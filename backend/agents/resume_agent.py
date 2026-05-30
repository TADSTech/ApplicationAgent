# backend/agents/resume_agent.py
from typing import Dict, Any
from pydantic import BaseModel, Field
from .base import BaseAgent
from services.gemini import gemini_service
from core.logging import logger

class ResumeTailoringOutput(BaseModel):
    adapted_resume: str = Field(description="The tailored resume in markdown format")
    skill_gap_analysis: list = Field(description="List of missing skills and recommendations")
    nigeria_context_notes: list = Field(description="Notes about Nigeria context adaptations made")

class ResumeAgent(BaseAgent):
    def __init__(self, session_id: str):
        super().__init__("resume", session_id)

    async def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Tailors resumes by aligning local achievements with global standards
        and performing Nigeria Context Adaptation.
        """
        resume_text = context.get("resume_text", "")
        job_description = context.get("job_description", "")

        logger.info(
            "ResumeAgent is tailoring resume",
            extra={
                "session_id": self.session_id,
                "agent_type": self.agent_type,
                "payload": {"resume_length": len(resume_text), "job_length": len(job_description)}
            }
        )
        self.update_progress(20.0)

        # System prompt enforcing Nigeria Context Adaptation (Rule 5.3)
        system_prompt = """
        You are an expert Resume Tailoring Agent for JobJockey. 
        Your goal is to adapt Nigerian professional resumes for the global job market.
        
        STRICT RULES:
        1. Remove personal details typical in Nigerian CVs: State of Origin, LGA, Religion, Marital Status, and Gender.
        2. Translate localized titles: e.g., 'National Youth Service Corps (NYSC) Software Engineer' -> 'Software Engineer Associate (Civil Service/National Program)'.
        3. Highlight Nigerian tech ecosystems: Tech Cabal, AltSchool, Ingressive for Good, Andela, NIGUG.
        4. Focus on global keywords and impact-driven accomplishments.
        5. Provide a JSON response with 'adapted_resume' (markdown) and 'skill_gap_analysis' (list of missing skills and recommendations).
        """

        prompt = f"""
        JOB DESCRIPTION:
        {job_description}
        
        USER RESUME:
        {resume_text}
        
        Please tailor this resume for the job and perform the Nigeria Context Adaptation.
        """

        self.update_progress(40.0)
        
        # Use structured output with Gemini
        llm_response = await gemini_service.generate_structured_response(
            prompt, 
            ResumeTailoringOutput,
            system_prompt
        )
        
        self.update_progress(90.0)

        self.update_progress(100.0, "completed")
        return {
            "tailored_output": llm_response,
            "nigeria_context_adapted": True,
            "status": "success"
        }
