# backend/services/profile_builder.py
"""AI-powered user profile builder that learns from resume and answered questions."""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel
from datetime import datetime
import json
try:
    from services.gemini import gemini_service
    from core.logging import logger
except ImportError:
    from backend.services.gemini import gemini_service
    from backend.core.logging import logger


class UserProfile(BaseModel):
    """Comprehensive user profile model."""
    user_id: str
    
    # Basic Info (from resume)
    name: Optional[str] = None
    email: Optional[str] = None
    location: str = "Lagos, Nigeria"
    timezone: str = "WAT"
    
    # Career Info
    current_title: Optional[str] = None
    years_experience: Optional[int] = None
    skills: List[str] = []
    industries: List[str] = []
    
    # Preferences (from questions)
    target_roles: List[str] = []
    target_salary_min: Optional[int] = None
    target_salary_max: Optional[int] = None
    preferred_locations: List[str] = []
    remote_preference: str = "remote_only"  # remote_only, hybrid, onsite, flexible
    visa_required: bool = True
    willing_to_relocate: bool = False
    
    # Work Style Preferences
    company_size_preference: List[str] = []  # startup, scaleup, enterprise
    company_stage_preference: List[str] = []  # seed, series_a, series_b, etc
    equity_important: bool = True
    
    # Timezone Preferences
    acceptable_timezones: List[str] = []
    max_timezone_difference: int = 6  # hours from WAT
    willing_late_night_shifts: bool = False
    
    # Career Goals
    career_goals: List[str] = []
    learning_interests: List[str] = []
    deal_breakers: List[str] = []
    
    # Answered Questions
    answered_questions: Dict[str, Any] = {}
    
    # Profile Completeness
    completeness_score: int = 0  # 0-100
    last_updated: str = ""
    
    # AI Insights
    profile_summary: str = ""
    recommended_roles: List[str] = []


class ProfileQuestion(BaseModel):
    """A question to ask the user to build their profile."""
    id: str
    question: str
    context: str  # Why we're asking
    question_type: str  # multiple_choice, text, number, boolean, range
    options: Optional[List[str]] = None
    priority: int  # 1-10, higher = more important
    category: str  # preferences, work_style, career_goals, etc


class ProfileBuilderService:
    """Service for building and maintaining user profiles through AI-powered questions."""
    
    def __init__(self):
        self.gemini = gemini_service
    
    async def analyze_resume_for_profile(
        self,
        resume_text: str,
        user_id: str
    ) -> UserProfile:
        """
        Extract profile information from resume using AI.
        
        Args:
            resume_text: Full resume text
            user_id: User ID
        
        Returns:
            UserProfile with extracted information
        """
        logger.info(
            "Analyzing resume for profile extraction",
            extra={"payload": {"user_id": user_id, "resume_length": len(resume_text)}}
        )
        
        prompt = f"""Analyze this resume and extract structured profile information.

RESUME:
{resume_text}

Extract the following information:
1. Name
2. Email
3. Current location (default to Lagos, Nigeria if not specified)
4. Current job title
5. Years of experience (estimate from work history)
6. Skills (list of technical and soft skills)
7. Industries worked in
8. Career level (junior, mid, senior, lead, principal, executive)

Format as JSON:
{{
  "name": "Full Name",
  "email": "email@example.com",
  "location": "City, Country",
  "current_title": "Job Title",
  "years_experience": 5,
  "skills": ["skill1", "skill2"],
  "industries": ["industry1", "industry2"],
  "career_level": "senior"
}}

IMPORTANT: Be conservative with estimates. If information is unclear, use null."""
        
        try:
            response = await self.gemini.generate_response(
                prompt=prompt,
                system_prompt="You are an expert resume parser. Extract only factual information from resumes."
            )
            
            # Parse response
            import re
            json_match = re.search(r'\{[\s\S]*\}', response)
            if json_match:
                data = json.loads(json_match.group())
                
                profile = UserProfile(
                    user_id=user_id,
                    name=data.get('name'),
                    email=data.get('email'),
                    location=data.get('location', 'Lagos, Nigeria'),
                    current_title=data.get('current_title'),
                    years_experience=data.get('years_experience'),
                    skills=data.get('skills', []),
                    industries=data.get('industries', []),
                    last_updated=datetime.utcnow().isoformat()
                )
                
                # Calculate initial completeness
                profile.completeness_score = self._calculate_completeness(profile)
                
                logger.info(
                    "Resume analysis completed",
                    extra={"payload": {"completeness": profile.completeness_score}}
                )
                
                return profile
        
        except Exception as e:
            logger.error(f"Resume analysis failed: {e}")
        
        # Return minimal profile
        return UserProfile(
            user_id=user_id,
            last_updated=datetime.utcnow().isoformat()
        )
    
    async def generate_next_questions(
        self,
        profile: UserProfile,
        job_context: Optional[Dict[str, Any]] = None,
        max_questions: int = 3
    ) -> List[ProfileQuestion]:
        """
        Generate intelligent questions to ask the user based on their profile gaps
        and current job context.
        
        Args:
            profile: Current user profile
            job_context: Optional context about a job they're viewing
            max_questions: Maximum number of questions to generate
        
        Returns:
            List of ProfileQuestion objects
        """
        logger.info(
            "Generating profile questions",
            extra={"payload": {"user_id": profile.user_id, "completeness": profile.completeness_score}}
        )
        
        # Identify gaps in profile
        gaps = self._identify_profile_gaps(profile)
        
        # Build context for AI
        context = self._build_question_context(profile, gaps, job_context)
        
        prompt = f"""Generate {max_questions} intelligent questions to ask this user to improve their job search profile.

CURRENT PROFILE:
- Completeness: {profile.completeness_score}%
- Current Title: {profile.current_title or 'Unknown'}
- Experience: {profile.years_experience or 'Unknown'} years
- Skills: {', '.join(profile.skills[:5]) if profile.skills else 'None listed'}
- Target Roles: {', '.join(profile.target_roles) if profile.target_roles else 'Not specified'}

PROFILE GAPS:
{', '.join(gaps)}

{context}

Generate questions that:
1. Fill critical gaps in their profile
2. Are relevant to their career level and goals
3. Help match them with better opportunities
4. Are specific and actionable
5. Consider Nigerian context (WAT timezone, visa needs, salary expectations in NGN)

For each question, provide:
- A clear, conversational question
- Context explaining why we're asking
- Question type (multiple_choice, text, number, boolean, range)
- Options (if multiple_choice)
- Priority (1-10)
- Category (preferences, work_style, career_goals, compensation, logistics)

Format as JSON array:
[
  {{
    "id": "unique_id",
    "question": "What's your ideal company size?",
    "context": "This helps us filter opportunities that match your work style preferences.",
    "question_type": "multiple_choice",
    "options": ["Startup (1-50)", "Scale-up (51-500)", "Enterprise (500+)", "No preference"],
    "priority": 7,
    "category": "work_style"
  }}
]"""
        
        try:
            response = await self.gemini.generate_response(
                prompt=prompt,
                system_prompt="You are a career advisor helping Nigerian professionals find global opportunities. Ask thoughtful, relevant questions."
            )
            
            # Parse questions
            import re
            json_match = re.search(r'\[[\s\S]*\]', response)
            if json_match:
                questions_data = json.loads(json_match.group())
                questions = [ProfileQuestion(**q) for q in questions_data[:max_questions]]
                
                logger.info(
                    "Generated profile questions",
                    extra={"payload": {"count": len(questions)}}
                )
                
                return questions
        
        except Exception as e:
            logger.error(f"Question generation failed: {e}")
        
        # Return fallback questions
        return self._get_fallback_questions(gaps, max_questions)
    
    async def update_profile_from_answer(
        self,
        profile: UserProfile,
        question_id: str,
        answer: Any
    ) -> UserProfile:
        """
        Update user profile based on answered question using AI to interpret the answer.
        
        Args:
            profile: Current profile
            question_id: ID of answered question
            answer: User's answer
        
        Returns:
            Updated UserProfile
        """
        logger.info(
            "Updating profile from answer",
            extra={"payload": {"user_id": profile.user_id, "question_id": question_id}}
        )
        
        # Store the answer
        profile.answered_questions[question_id] = {
            "answer": answer,
            "answered_at": datetime.utcnow().isoformat()
        }
        
        # Use AI to interpret and update profile
        prompt = f"""A user answered a profile question. Update their profile accordingly.

CURRENT PROFILE:
{profile.model_dump_json(indent=2)}

QUESTION ID: {question_id}
ANSWER: {answer}

Based on this answer, suggest updates to the profile. Consider:
1. Which profile fields should be updated?
2. What values should they have?
3. Any insights about the user's preferences?

Format as JSON with field updates:
{{
  "updates": {{
    "field_name": "new_value"
  }},
  "insights": "Brief insight about what this reveals"
}}"""
        
        try:
            response = await self.gemini.generate_response(
                prompt=prompt,
                system_prompt="You are a profile management system. Interpret user answers and update profiles accurately."
            )
            
            import re
            json_match = re.search(r'\{[\s\S]*\}', response)
            if json_match:
                data = json.loads(json_match.group())
                updates = data.get('updates', {})
                
                # Apply updates
                for field, value in updates.items():
                    if hasattr(profile, field):
                        setattr(profile, field, value)
                
                # Update metadata
                profile.last_updated = datetime.utcnow().isoformat()
                profile.completeness_score = self._calculate_completeness(profile)
                
                logger.info(
                    "Profile updated",
                    extra={"payload": {"new_completeness": profile.completeness_score}}
                )
        
        except Exception as e:
            logger.error(f"Profile update failed: {e}")
        
        return profile
    
    def _identify_profile_gaps(self, profile: UserProfile) -> List[str]:
        """Identify missing or incomplete profile fields."""
        gaps = []
        
        if not profile.target_roles:
            gaps.append("target_roles")
        if not profile.target_salary_min:
            gaps.append("salary_expectations")
        if not profile.preferred_locations:
            gaps.append("location_preferences")
        if not profile.company_size_preference:
            gaps.append("company_size")
        if not profile.acceptable_timezones:
            gaps.append("timezone_preferences")
        if not profile.career_goals:
            gaps.append("career_goals")
        
        return gaps
    
    def _calculate_completeness(self, profile: UserProfile) -> int:
        """Calculate profile completeness score (0-100)."""
        total_fields = 15
        filled_fields = 0
        
        if profile.name: filled_fields += 1
        if profile.email: filled_fields += 1
        if profile.current_title: filled_fields += 1
        if profile.years_experience: filled_fields += 1
        if profile.skills: filled_fields += 1
        if profile.target_roles: filled_fields += 1
        if profile.target_salary_min: filled_fields += 1
        if profile.preferred_locations: filled_fields += 1
        if profile.company_size_preference: filled_fields += 1
        if profile.acceptable_timezones: filled_fields += 1
        if profile.career_goals: filled_fields += 1
        if profile.remote_preference: filled_fields += 1
        if profile.willing_to_relocate is not None: filled_fields += 1
        if profile.equity_important is not None: filled_fields += 1
        if profile.willing_late_night_shifts is not None: filled_fields += 1
        
        return int((filled_fields / total_fields) * 100)
    
    def _build_question_context(
        self,
        profile: UserProfile,
        gaps: List[str],
        job_context: Optional[Dict[str, Any]]
    ) -> str:
        """Build context string for question generation."""
        context_parts = []
        
        if job_context:
            context_parts.append(f"USER IS VIEWING JOB: {job_context.get('title')} at {job_context.get('company')}")
            context_parts.append(f"Job requires: {', '.join(job_context.get('requirements', []))}")
        
        return '\n'.join(context_parts)
    
    def _get_fallback_questions(self, gaps: List[str], max_questions: int) -> List[ProfileQuestion]:
        """Return fallback questions when AI generation fails."""
        fallback_questions = [
            ProfileQuestion(
                id="salary_range",
                question="What's your target salary range in USD?",
                context="This helps us show you opportunities that match your compensation expectations.",
                question_type="range",
                priority=9,
                category="compensation"
            ),
            ProfileQuestion(
                id="remote_preference",
                question="What's your work location preference?",
                context="Understanding your flexibility helps us match you with the right opportunities.",
                question_type="multiple_choice",
                options=["Fully remote only", "Hybrid (2-3 days office)", "Open to on-site", "Flexible"],
                priority=8,
                category="preferences"
            ),
            ProfileQuestion(
                id="timezone_flexibility",
                question="Are you willing to work late-night shifts (e.g., 6 PM - 2 AM WAT for US West Coast hours)?",
                context="Some remote roles require working hours that align with US timezones.",
                question_type="boolean",
                priority=7,
                category="logistics"
            ),
        ]
        
        return fallback_questions[:max_questions]


# Global instance
profile_builder_service = ProfileBuilderService()
