# backend/agents/linkedin_agent.py
from typing import Dict, Any
from .base import BaseAgent
from ..services.linkedin import linkedin_service
from ..services.gemini import gemini_service
from ..core.config import settings
from ..core.logging import logger

class LinkedinAgent(BaseAgent):
    def __init__(self, session_id: str):
        super().__init__("linkedin", session_id)
        self.linkedin_service = linkedin_service
        self.gemini = gemini_service

    async def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Drafts LinkedIn connection requests and follow-up sequences.
        """
        recruiter = context.get("recruiter_name", "Recruiter")
        company = context.get("company_name", "the company")
        job_title = context.get("job_title", "Software Engineer")

        logger.info(
            "LinkedInAgent starting outreach formulation",
            extra={
                "session_id": self.session_id,
                "agent_type": self.agent_type,
                "payload": {"recruiter_name": recruiter, "company": company}
            }
        )
        self.update_progress(30.0)

        system_prompt = """
        You are an expert LinkedIn Outreach Agent for JobJockey.
        Your goal is to craft highly personalized connection requests and DMs for Nigerian professionals.
        
        STRICT RULES:
        1. Keep connection requests under 300 characters.
        2. Be professional but warm.
        3. Mention specific interest in global/remote collaboration.
        4. Draft a follow-up DM that is concise and value-driven.
        5. Recommend the best time to send the message in WAT, assuming the recruiter is in the job's timezone (default EST if not provided).
        """

        prompt = f"""
        RECRUITER: {recruiter}
        COMPANY: {company}
        JOB TITLE: {job_title}
        
        Draft a connection request and a follow-up DM.
        """

        self.update_progress(60.0)
        llm_response = await gemini_service.generate_response(prompt, system_prompt)
        
        self.update_progress(90.0)

        self.update_progress(100.0, "completed")
        return {
            "outreach_drafts": llm_response,
            "status": "success"
        }
