# backend/agents/contract_agent.py
from typing import Dict, Any
from .base import BaseAgent
from services.gemini import GeminiService
from core.config import settings
from core.logging import logger

class ContractAgent(BaseAgent):
    def __init__(self, session_id: str):
        super().__init__("contract", session_id)
        self.gemini = GeminiService()

    async def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Parses employment contracts, checks visa lock-ins and calculates tax withholding implications.
        """
        contract_text = context.get("contract_text", "")
        base_salary_usd = context.get("base_salary_usd", 0.0)

        logger.info(
            "ContractAgent is analyzing agreement terms",
            extra={
                "session_id": self.session_id,
                "agent_type": self.agent_type,
                "payload": {"contract_length": len(contract_text)}
            }
        )
        self.update_progress(15.0)

        system_prompt = """
        You are an expert Legal & Contract Analysis Agent for JobJockey.
        Your goal is to parse employment contracts for Nigerian professionals moving abroad or working remotely.
        
        STRICT FOCUS AREAS:
        1. Visa Lock-in: Detect duration and reimbursement obligations if the employee leaves early.
        2. Relocation: Identify relocation allowance and any repayment clauses.
        3. Intellectual Property: Check if all IP created belongs to the company.
        4. Termination: Identify notice periods and severance.
        5. Remote Tax: Flag if the contract is B2B (Contractor) or W2 (Employee) and estimate US/UK tax withholding implications for a Nigerian resident.
        
        Provide a JSON response with 'flagged_clauses' (list of objects with 'clause', 'risk_level', 'description') and 'summary'.
        """

        prompt = f"""
        CONTRACT TEXT:
        {contract_text}
        
        BASE SALARY: ${base_salary_usd}
        
        Analyze this contract and flag any high-risk clauses for a Nigerian professional.
        """

        self.update_progress(40.0)
        llm_response = await self.gemini.generate_response(prompt, system_prompt)
        
        self.update_progress(90.0)

        self.update_progress(100.0, "completed")
        return {
            "analysis_output": llm_response,
            "status": "success"
        }
