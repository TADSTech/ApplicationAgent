# backend/services/job_feedback.py
"""AI-powered job feedback and analysis service."""

from typing import Dict, Any, Optional
from pydantic import BaseModel
from ..services.gemini import gemini_service
from ..core.logging import logger


class JobFeedback(BaseModel):
    """Job feedback analysis model."""
    match_reasoning: str
    red_flags: list[str]
    opportunities: list[str]
    salary_analysis: str
    timezone_impact: str
    visa_likelihood: str
    overall_recommendation: str
    confidence_score: int  # 0-100


class JobFeedbackService:
    """Service for providing AI feedback on job matches."""
    
    def __init__(self):
        self.gemini = gemini_service
    
    async def analyze_job_match(
        self,
        job_title: str,
        company: str,
        job_description: str,
        salary_usd: int,
        location: str,
        timezone: str,
        visa_sponsorship: bool,
        remote: bool,
        user_profile: Optional[Dict[str, Any]] = None
    ) -> JobFeedback:
        """
        Provide comprehensive AI analysis of a job match.
        
        Args:
            job_title: Job title
            company: Company name
            job_description: Full job description
            salary_usd: Salary in USD
            location: Job location
            timezone: Job timezone
            visa_sponsorship: Whether visa sponsorship is offered
            remote: Whether job is remote
            user_profile: Optional user profile for personalized analysis
        
        Returns:
            JobFeedback object with detailed analysis
        """
        logger.info(
            "Analyzing job match",
            extra={
                "payload": {
                    "job_title": job_title,
                    "company": company,
                    "remote": remote
                }
            }
        )
        
        prompt = self._build_feedback_prompt(
            job_title, company, job_description, salary_usd,
            location, timezone, visa_sponsorship, remote, user_profile
        )
        
        try:
            response = await self.gemini.generate_response(
                prompt=prompt,
                system_prompt="You are a career advisor specializing in helping Nigerian professionals evaluate global job opportunities. Provide honest, practical advice considering Nigeria-specific context (WAT timezone, visa requirements, salary conversion, etc.)."
            )
            
            feedback = self._parse_feedback_response(response)
            
            logger.info(
                "Job analysis completed",
                extra={
                    "payload": {
                        "confidence_score": feedback.confidence_score,
                        "red_flags_count": len(feedback.red_flags)
                    }
                }
            )
            
            return feedback
            
        except Exception as e:
            logger.error(f"Job feedback analysis failed: {str(e)}")
            return self._get_fallback_feedback(
                job_title, salary_usd, timezone, visa_sponsorship, remote
            )
    
    def _build_feedback_prompt(
        self,
        job_title: str,
        company: str,
        job_description: str,
        salary_usd: int,
        location: str,
        timezone: str,
        visa_sponsorship: bool,
        remote: bool,
        user_profile: Optional[Dict[str, Any]]
    ) -> str:
        """Build the feedback prompt."""
        salary_ngn = salary_usd * 1550  # Approximate conversion
        
        user_context = ""
        if user_profile:
            user_context = f"""
CANDIDATE PROFILE:
- Current Location: {user_profile.get('location', 'Lagos, Nigeria')}
- Target Roles: {', '.join(user_profile.get('target_roles', []))}
- Visa Required: {user_profile.get('visa_required', True)}
"""
        
        return f"""Analyze this job opportunity for a Nigerian professional and provide detailed feedback.

JOB DETAILS:
- Title: {job_title}
- Company: {company}
- Location: {location}
- Remote: {'Yes' if remote else 'No'}
- Timezone: {timezone}
- Salary: ${salary_usd:,} USD (~₦{salary_ngn:,} NGN)
- Visa Sponsorship: {'Yes' if visa_sponsorship else 'No'}

JOB DESCRIPTION:
{job_description}

{user_context}

Provide a comprehensive analysis covering:

1. MATCH REASONING: Why this job is or isn't a good fit (2-3 sentences)

2. RED FLAGS: List 2-4 potential concerns or risks (e.g., timezone challenges, visa issues, company stability, role clarity)

3. OPPORTUNITIES: List 2-4 positive aspects or growth opportunities

4. SALARY ANALYSIS: Is this salary competitive for the role? How does it compare in NGN terms for Nigerian context? (2-3 sentences)

5. TIMEZONE IMPACT: Analyze the {timezone} timezone impact on WAT (UTC+1). What are the working hours in Lagos time? Is this sustainable? (2-3 sentences)

6. VISA LIKELIHOOD: If visa sponsorship is {'offered' if visa_sponsorship else 'not offered'}, what are the realistic chances and considerations? (2-3 sentences)

7. OVERALL RECOMMENDATION: Should the candidate apply? Why or why not? (2-3 sentences)

8. CONFIDENCE SCORE: Rate your confidence in this analysis (0-100)

Format as JSON:
{{
  "match_reasoning": "...",
  "red_flags": ["flag1", "flag2"],
  "opportunities": ["opp1", "opp2"],
  "salary_analysis": "...",
  "timezone_impact": "...",
  "visa_likelihood": "...",
  "overall_recommendation": "...",
  "confidence_score": 85
}}"""
    
    def _parse_feedback_response(self, response: str) -> JobFeedback:
        """Parse AI response into JobFeedback object."""
        import json
        import re
        
        try:
            # Extract JSON
            json_match = re.search(r'\{[\s\S]*\}', response)
            if json_match:
                data = json.loads(json_match.group())
                return JobFeedback(**data)
        except Exception as e:
            logger.warning(f"Failed to parse feedback response: {e}")
        
        # Fallback: return basic feedback
        return JobFeedback(
            match_reasoning="This role shows potential based on the job description.",
            red_flags=["Unable to perform detailed analysis"],
            opportunities=["Review job details carefully"],
            salary_analysis="Salary appears competitive for the role level.",
            timezone_impact="Consider timezone compatibility with your schedule.",
            visa_likelihood="Review visa requirements carefully if applicable.",
            overall_recommendation="Review the full job description and company details before applying.",
            confidence_score=50
        )
    
    def _get_fallback_feedback(
        self,
        job_title: str,
        salary_usd: int,
        timezone: str,
        visa_sponsorship: bool,
        remote: bool
    ) -> JobFeedback:
        """Return fallback feedback when AI analysis fails."""
        salary_ngn = salary_usd * 1550
        
        # Calculate timezone impact
        tz_impact = "favorable" if timezone in ["GMT", "CET", "EST"] else "challenging"
        
        return JobFeedback(
            match_reasoning=f"This {job_title} role offers {'remote work flexibility' if remote else 'on-site experience'} with a competitive salary package.",
            red_flags=[
                f"Timezone ({timezone}) may require {tz_impact} working hours for WAT",
                "Limited automated analysis available - review details carefully"
            ] + (["No visa sponsorship offered"] if not visa_sponsorship else []),
            opportunities=[
                f"Competitive salary: ${salary_usd:,} (~₦{salary_ngn:,})",
                "Global work experience",
                "Professional growth opportunity"
            ] + (["Visa sponsorship available"] if visa_sponsorship else []),
            salary_analysis=f"The salary of ${salary_usd:,} USD (approximately ₦{salary_ngn:,} NGN) is competitive for this role level in the global market.",
            timezone_impact=f"The {timezone} timezone will require coordination with WAT (UTC+1). Review specific working hours requirements.",
            visa_likelihood="Visa sponsorship available - research specific requirements for your situation." if visa_sponsorship else "No visa sponsorship offered. Consider if you have existing work authorization.",
            overall_recommendation="This role shows promise. Review the full job description, research the company, and assess timezone compatibility before applying.",
            confidence_score=60
        )


# Global instance
job_feedback_service = JobFeedbackService()
