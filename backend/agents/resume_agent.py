# backend/agents/resume_agent.py
from typing import Dict, Any
from backend.agents.base import BaseAgent
from backend.core.logging import logger

class ResumeAgent(BaseAgent):
    def __init__(self, session_id: str):
        super().__init__("resume", session_id)

    async def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Tailors resumes by aligning local achievements with global standards
        and performing Nigeria Context Adaptation.
        """
        logger.info(
            "ResumeAgent is tailoring resume",
            extra={
                "session_id": self.session_id,
                "agent_type": self.agent_type,
                "payload": {"resume_id": context.get("resume_id"), "job_id": context.get("job_id")}
            }
        )
        self.update_progress(20.0)

        # Retrieve and adapt resume
        raw_text = context.get("resume_text", "Software Engineer at NYSC ICT Hub. Managed local database solutions.")
        
        # Nigeria Context Adaptation logic (e.g., Translating NYSC)
        adapted_text = raw_text
        if "NYSC" in raw_text or "National Youth Service Corps" in raw_text:
            adapted_text = adapted_text.replace("NYSC", "National Youth Service Corps (Civil Service National Program)")
            adapted_text = adapted_text.replace("NYSC ICT Hub", "Associate Software Engineer at National Program ICT Division")
            
        self.update_progress(60.0)

        skill_gap = {
            "missing_skills": ["Docker", "FastAPI"],
            "suggested_courses": ["Docker and Kubernetes: The Complete Guide", "FastAPI Masterclass"]
        }

        self.update_progress(100.0, "completed")
        return {
            "adapted_resume_text": adapted_text,
            "skill_gap_analysis": skill_gap,
            "nigeria_context_adapted": True
        }
