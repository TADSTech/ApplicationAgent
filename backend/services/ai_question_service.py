# backend/services/ai_question_service.py
"""AI Question Service with Gemini primary and Claude backup, with proper guardrails."""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel
from services.gemini import gemini_service
from services.profile_builder import profile_builder_service, ProfileQuestion
from core.logging import logger
from core.config import settings
import json
import re


class AIQuestion(BaseModel):
    """AI-generated question for the user."""
    id: str
    question: str
    context: str
    triggered_by: str  # job_id or 'profile_gap'
    priority: int
    question_type: str
    options: Optional[List[str]] = None
    category: str


class AIQuestionService:
    """
    Service for generating contextual AI questions with proper guardrails.
    Uses Gemini as primary, Claude as backup.
    """
    
    # Content safety guardrails
    FORBIDDEN_TOPICS = [
        'religion', 'political affiliation', 'marital status', 'pregnancy',
        'sexual orientation', 'gender identity', 'age', 'disability',
        'race', 'ethnicity', 'national origin', 'genetic information'
    ]
    
    ALLOWED_CATEGORIES = [
        'work_preferences', 'compensation', 'career_goals', 'skills',
        'location', 'timezone', 'work_style', 'company_culture',
        'growth_opportunities', 'technical_requirements'
    ]
    
    def __init__(self):
        self.gemini = gemini_service
        self.profile_builder = profile_builder_service
        # OpenRouter is available via gemini service fallback
    
    async def generate_question_for_job(
        self,
        job: Dict[str, Any],
        user_profile: Dict[str, Any]
    ) -> Optional[AIQuestion]:
        """
        Generate a contextual question when user views a job with special scenarios.
        
        Args:
            job: Job dictionary with potential special_scenario field
            user_profile: User's current profile
        
        Returns:
            AIQuestion if a question should be asked, None otherwise
        """
        # Check if job has special scenario
        special_scenario = job.get('special_scenario')
        if not special_scenario:
            return None
        
        # Check if we already asked about this scenario
        answered_questions = user_profile.get('answered_questions', {})
        scenario_key = f"scenario_{special_scenario}"
        if scenario_key in answered_questions:
            return None  # Already asked
        
        logger.info(
            "Generating question for special scenario",
            extra={"payload": {"scenario": special_scenario, "job_id": job.get('id')}}
        )
        
        # Get pre-defined question trigger if available
        ai_trigger = job.get('ai_question_trigger')
        if ai_trigger:
            return AIQuestion(
                id=scenario_key,
                question=ai_trigger['question'],
                context=ai_trigger['context'],
                triggered_by=job['id'],
                priority=8,
                question_type='boolean' if 'Are you' in ai_trigger['question'] else 'multiple_choice',
                options=['Yes', 'No', 'Maybe - tell me more'] if 'Are you' in ai_trigger['question'] else None,
                category='work_preferences'
            )
        
        # Generate question using AI with guardrails
        return await self._generate_ai_question(job, user_profile, special_scenario)
    
    async def generate_profile_questions(
        self,
        user_profile: Dict[str, Any],
        max_questions: int = 3
    ) -> List[AIQuestion]:
        """
        Generate questions to fill profile gaps.
        
        Args:
            user_profile: User's current profile
            max_questions: Maximum questions to generate
        
        Returns:
            List of AIQuestion objects
        """
        logger.info(
            "Generating profile gap questions",
            extra={"payload": {"user_id": user_profile.get('user_id')}}
        )
        
        # Use profile builder service
        from services.profile_builder import UserProfile
        profile = UserProfile(**user_profile)
        
        questions = await self.profile_builder.generate_next_questions(
            profile=profile,
            max_questions=max_questions
        )
        
        # Convert to AIQuestion format
        ai_questions = []
        for q in questions:
            ai_questions.append(AIQuestion(
                id=q.id,
                question=q.question,
                context=q.context,
                triggered_by='profile_gap',
                priority=q.priority,
                question_type=q.question_type,
                options=q.options,
                category=q.category
            ))
        
        return ai_questions
    
    async def _generate_ai_question(
        self,
        job: Dict[str, Any],
        user_profile: Dict[str, Any],
        scenario: str
    ) -> Optional[AIQuestion]:
        """Generate question using AI with safety guardrails."""
        
        # Build safe prompt
        prompt = self._build_safe_prompt(job, user_profile, scenario)
        
        try:
            # Try Gemini first
            response = await self._call_gemini_with_guardrails(prompt)
            if response:
                return self._parse_question_response(response, job['id'], scenario)
            
            # Fallback to Claude if available
            if self.claude_available:
                response = await self._call_claude_with_guardrails(prompt)
                if response:
                    return self._parse_question_response(response, job['id'], scenario)
        
        except Exception as e:
            logger.error(f"AI question generation failed: {e}")
        
        return None
    
    def _build_safe_prompt(
        self,
        job: Dict[str, Any],
        user_profile: Dict[str, Any],
        scenario: str
    ) -> str:
        """Build a prompt with safety guardrails."""
        
        return f"""Generate ONE professional question to ask a job seeker about this opportunity.

JOB DETAILS:
- Title: {job.get('title')}
- Company: {job.get('company')}
- Location: {job.get('location')}
- Remote: {job.get('remote')}
- Scenario: {scenario}

USER CONTEXT:
- Current Title: {user_profile.get('current_title', 'Not specified')}
- Location: {user_profile.get('location', 'Lagos, Nigeria')}

STRICT RULES:
1. ONLY ask about: work preferences, compensation expectations, location flexibility, timezone compatibility, career goals, or technical requirements
2. NEVER ask about: {', '.join(self.FORBIDDEN_TOPICS)}
3. Keep question professional and job-relevant
4. Make it a yes/no or multiple choice question
5. Explain WHY you're asking (context)

Format as JSON:
{{
  "question": "Clear, professional question here?",
  "context": "Why we're asking this",
  "question_type": "boolean or multiple_choice",
  "options": ["Option 1", "Option 2"] (if multiple_choice),
  "category": "work_preferences"
}}"""
    
    async def _call_gemini_with_guardrails(self, prompt: str) -> Optional[str]:
        """Call Gemini with safety checks."""
        try:
            system_prompt = f"""You are a professional career advisor. 

STRICT SAFETY RULES:
1. NEVER ask about: {', '.join(self.FORBIDDEN_TOPICS)}
2. ONLY ask about: {', '.join(self.ALLOWED_CATEGORIES)}
3. Keep all questions professional and job-relevant
4. Respect user privacy and legal boundaries

If you cannot generate a safe, appropriate question, return an empty response."""
            
            response = await self.gemini.generate_response(
                prompt=prompt,
                system_prompt=system_prompt
            )
            
            # Safety check response
            if self._contains_forbidden_content(response):
                logger.warning("Gemini response contained forbidden content")
                return None
            
            return response
        
        except Exception as e:
            logger.error(f"Gemini call failed: {e}")
            return None
    
    async def _call_claude_with_guardrails(self, prompt: str) -> Optional[str]:
        """Call Claude (Anthropic) as backup with safety checks."""
        try:
            # Import anthropic only if needed
            import anthropic
            
            client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
            
            system_prompt = f"""You are a professional career advisor.

STRICT SAFETY RULES:
1. NEVER ask about: {', '.join(self.FORBIDDEN_TOPICS)}
2. ONLY ask about: {', '.join(self.ALLOWED_CATEGORIES)}
3. Keep all questions professional and job-relevant
4. Respect user privacy and legal boundaries"""
            
            message = client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1024,
                system=system_prompt,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            response = message.content[0].text
            
            # Safety check response
            if self._contains_forbidden_content(response):
                logger.warning("Claude response contained forbidden content")
                return None
            
            return response
        
        except Exception as e:
            logger.error(f"Claude call failed: {e}")
            return None
    
    def _contains_forbidden_content(self, text: str) -> bool:
        """Check if text contains forbidden topics."""
        text_lower = text.lower()
        for topic in self.FORBIDDEN_TOPICS:
            if topic in text_lower:
                return True
        return False
    
    def _parse_question_response(
        self,
        response: str,
        job_id: str,
        scenario: str
    ) -> Optional[AIQuestion]:
        """Parse AI response into AIQuestion object."""
        try:
            # Extract JSON
            json_match = re.search(r'\{[\s\S]*\}', response)
            if json_match:
                data = json.loads(json_match.group())
                
                # Validate category
                if data.get('category') not in self.ALLOWED_CATEGORIES:
                    logger.warning(f"Invalid category: {data.get('category')}")
                    return None
                
                # Final safety check
                if self._contains_forbidden_content(data.get('question', '')):
                    logger.warning("Parsed question contains forbidden content")
                    return None
                
                return AIQuestion(
                    id=f"scenario_{scenario}",
                    question=data['question'],
                    context=data.get('context', 'This helps us understand your preferences'),
                    triggered_by=job_id,
                    priority=7,
                    question_type=data.get('question_type', 'boolean'),
                    options=data.get('options'),
                    category=data.get('category', 'work_preferences')
                )
        
        except Exception as e:
            logger.error(f"Failed to parse question response: {e}")
        
        return None


# Global instance
ai_question_service = AIQuestionService()
