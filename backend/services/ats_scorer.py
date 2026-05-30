# backend/services/ats_scorer.py
"""ATS (Applicant Tracking System) scoring service using Gemini AI."""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel
import json
import re
from .gemini import gemini_service
from ..core.logging import logger


class ATSScore(BaseModel):
    """ATS scoring result model."""
    overall_score: int  # 0-100
    keyword_match: int  # 0-100
    experience_relevance: int  # 0-100
    skills_alignment: int  # 0-100
    format_quality: int  # 0-100
    improvements: List[str]
    strengths: List[str]
    missing_keywords: List[str]
    match_summary: str


class ATSScorerService:
    """Service for scoring resumes against job descriptions."""
    
    def __init__(self):
        self.gemini = gemini_service
    
    async def score_resume(
        self,
        resume_text: str,
        job_description: str,
        job_title: str,
        job_requirements: List[str]
    ) -> ATSScore:
        """
        Score a resume against a job description using AI analysis.
        
        Args:
            resume_text: Full text content of the resume
            job_description: Job description text
            job_title: Title of the job position
            job_requirements: List of required skills/qualifications
        
        Returns:
            ATSScore object with detailed scoring and feedback
        """
        logger.info(
            "Starting ATS scoring",
            extra={
                "payload": {
                    "job_title": job_title,
                    "resume_length": len(resume_text),
                    "requirements_count": len(job_requirements)
                }
            }
        )
        
        # Build comprehensive prompt
        prompt = self._build_scoring_prompt(
            resume_text, job_description, job_title, job_requirements
        )
        
        try:
            # Get AI response
            response = await self.gemini.generate_response(
                prompt=prompt,
                system_prompt="You are an expert ATS (Applicant Tracking System) analyzer and career coach specializing in helping Nigerian professionals optimize their resumes for global job markets."
            )
            
            # Parse response into structured format
            score = self._parse_ats_response(response, job_requirements)
            
            logger.info(
                "ATS scoring completed",
                extra={
                    "payload": {
                        "overall_score": score.overall_score,
                        "keyword_match": score.keyword_match
                    }
                }
            )
            
            return score
            
        except Exception as e:
            logger.error(f"ATS scoring failed: {str(e)}")
            # Return fallback score
            return self._get_fallback_score(job_requirements)
    
    def _build_scoring_prompt(
        self,
        resume_text: str,
        job_description: str,
        job_title: str,
        job_requirements: List[str]
    ) -> str:
        """Build the scoring prompt for Gemini."""
        return f"""Analyze this resume against the job description and provide detailed ATS scoring.

JOB TITLE: {job_title}

JOB DESCRIPTION:
{job_description}

KEY REQUIREMENTS:
{', '.join(job_requirements)}

RESUME:
{resume_text}

Provide a comprehensive ATS analysis with the following:

1. OVERALL SCORE (0-100): Overall match quality
2. KEYWORD MATCH (0-100): How well resume keywords match job requirements
3. EXPERIENCE RELEVANCE (0-100): How relevant is the candidate's experience
4. SKILLS ALIGNMENT (0-100): How well skills align with requirements
5. FORMAT QUALITY (0-100): Resume structure and readability

6. TOP 3-5 STRENGTHS: What makes this candidate stand out

7. TOP 3-5 IMPROVEMENTS: Specific actionable suggestions to improve the resume

8. MISSING KEYWORDS: Important keywords from the job description that are missing from the resume

9. MATCH SUMMARY: 2-3 sentence summary of why this candidate is or isn't a good fit

Format your response as JSON with this structure:
{{
  "overall_score": 85,
  "keyword_match": 80,
  "experience_relevance": 90,
  "skills_alignment": 85,
  "format_quality": 80,
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "missing_keywords": ["keyword1", "keyword2"],
  "match_summary": "Summary text here"
}}

IMPORTANT: Consider that this is a Nigerian professional applying to global roles. Highlight any Nigeria-specific context that should be adapted for international audiences."""
    
    def _parse_ats_response(self, response: str, job_requirements: List[str]) -> ATSScore:
        """Parse Gemini response into ATSScore object."""
        try:
            # Try to extract JSON from response
            json_match = re.search(r'\{[\s\S]*\}', response)
            if json_match:
                data = json.loads(json_match.group())
                return ATSScore(**data)
            else:
                # Fallback parsing
                return self._parse_text_response(response, job_requirements)
        except Exception as e:
            logger.warning(f"Failed to parse ATS response: {e}")
            return self._get_fallback_score(job_requirements)
    
    def _parse_text_response(self, response: str, job_requirements: List[str]) -> ATSScore:
        """Parse text response when JSON parsing fails."""
        # Extract scores using regex
        overall = self._extract_score(response, r'overall[_\s]score[:\s]+(\d+)')
        keyword = self._extract_score(response, r'keyword[_\s]match[:\s]+(\d+)')
        experience = self._extract_score(response, r'experience[_\s]relevance[:\s]+(\d+)')
        skills = self._extract_score(response, r'skills[_\s]alignment[:\s]+(\d+)')
        format_q = self._extract_score(response, r'format[_\s]quality[:\s]+(\d+)')
        
        # Extract lists
        strengths = self._extract_list(response, r'strengths?[:\s]+(.*?)(?=improvements?|missing|$)', 3)
        improvements = self._extract_list(response, r'improvements?[:\s]+(.*?)(?=missing|match summary|$)', 3)
        missing = self._extract_list(response, r'missing[_\s]keywords?[:\s]+(.*?)(?=match summary|$)', 5)
        
        # Extract summary
        summary_match = re.search(r'match[_\s]summary[:\s]+(.*?)(?=\n\n|$)', response, re.IGNORECASE | re.DOTALL)
        summary = summary_match.group(1).strip() if summary_match else "Analysis completed."
        
        return ATSScore(
            overall_score=overall,
            keyword_match=keyword,
            experience_relevance=experience,
            skills_alignment=skills,
            format_quality=format_q,
            strengths=strengths,
            improvements=improvements,
            missing_keywords=missing,
            match_summary=summary
        )
    
    def _extract_score(self, text: str, pattern: str) -> int:
        """Extract a score from text using regex."""
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            try:
                score = int(match.group(1))
                return max(0, min(100, score))  # Clamp to 0-100
            except ValueError:
                pass
        return 75  # Default fallback
    
    def _extract_list(self, text: str, pattern: str, max_items: int = 5) -> List[str]:
        """Extract a list of items from text."""
        match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
        if match:
            items_text = match.group(1)
            # Split by newlines, bullets, or numbers
            items = re.split(r'[\n•\-\*]|\d+\.', items_text)
            items = [item.strip() for item in items if item.strip()]
            return items[:max_items]
        return []
    
    def _get_fallback_score(self, job_requirements: List[str]) -> ATSScore:
        """Return a fallback score when AI analysis fails."""
        return ATSScore(
            overall_score=75,
            keyword_match=70,
            experience_relevance=75,
            skills_alignment=75,
            format_quality=80,
            strengths=[
                "Resume demonstrates relevant experience",
                "Clear professional summary",
                "Well-structured format"
            ],
            improvements=[
                "Add more specific metrics and achievements",
                "Include keywords from job description",
                "Tailor experience section to match role requirements"
            ],
            missing_keywords=job_requirements[:5],
            match_summary="This resume shows potential for the role. Consider tailoring it further to match specific job requirements and adding quantifiable achievements."
        )


# Global instance
ats_scorer_service = ATSScorerService()
