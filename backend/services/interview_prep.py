
# backend/services/interview_prep.py
from typing import List, Dict, Any, Optional
from backend.core.logging import logger
from backend.services.gemini import gemini_service

class InterviewPrepService:
    def __init__(self):
        # Simple in-memory database for demonstration
        self.interview_questions_db = {
            "behavioral": [
                "Tell me about a time you faced a challenge and how you overcame it.",
                "Describe a situation where you had to work with a difficult team member.",
                "How do you handle stress and pressure?"
            ],
            "technical_python": [
                "Explain the difference between a list and a tuple in Python.",
                "What is a decorator in Python and when would you use it?",
                "Explain Python's GIL."
            ],
            "technical_fastapi": [
                "How do you handle dependency injection in FastAPI?",
                "Explain the purpose of Pydantic models in FastAPI."
            ]
        }

        self.bias_mitigation_tips = [
            "Focus on STAR method responses for behavioral questions.",
            "Use objective scoring rubrics.",
            "Ask standardized questions to all candidates.",
            "Be aware of your own unconscious biases related to accent, background, or appearance."
        ]

    async def get_interview_questions(self, category: str, count: int = 3) -> List[str]:
        """
        Retrieves interview questions based on category.
        """
        questions = self.interview_questions_db.get(category.lower(), [])
        if not questions:
            logger.warning(f"No interview questions found for category: {category}", extra={"agent_type": "interview_prep"})
            return []
        return questions[:count]

    async def get_bias_mitigation_tips(self) -> List[str]:
        """
        Returns a list of bias mitigation tips for interviewers.
        """
        return self.bias_mitigation_tips

    async def simulate_interview_response(self, question: str, candidate_response: str) -> Dict[str, Any]:
        """
        (Placeholder) Simulates an interview response evaluation using an LLM.
        In a real application, this would involve a more sophisticated prompt and evaluation criteria.
        """
        logger.info(f"Simulating interview response for question: {question[:50]}...",
                    extra={"agent_type": "interview_prep", "payload": {"question": question}})
        try:
            # Example LLM interaction (replace with actual prompt engineering)
            # This is a basic placeholder; actual implementation needs careful prompt design.
            response = await gemini_service.generate_response(
                prompt=f"Question: {question}\nCandidate Answer: {candidate_response}\nProvide constructive feedback on the candidate's response, focusing on structure, relevance, and completeness. Suggest areas for improvement.",
                system_prompt="You are an interview coach providing feedback on a candidate's answer."
            )
            feedback = response
            return {"feedback": feedback, "simulation_status": "mock_llm_evaluation"}
        except Exception as e:
            logger.error(f"LLM interview simulation failed: {e}", extra={"agent_type": "interview_prep", "error": str(e)})
            return {"feedback": "Failed to simulate. Please try again.", "simulation_status": "failed"}

interview_prep_service = InterviewPrepService()
