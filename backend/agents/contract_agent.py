# backend/agents/contract_agent.py
from typing import Dict, Any
from backend.agents.base import BaseAgent
from backend.core.logging import logger

class ContractAgent(BaseAgent):
    def __init__(self, session_id: str):
        super().__init__("contract", session_id)

    async def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Parses employment contracts, checks visa lock-ins and calculates tax withholding implications.
        """
        logger.info(
            "ContractAgent is analyzing agreement terms",
            extra={
                "session_id": self.session_id,
                "agent_type": self.agent_type,
                "payload": {"contract_id": context.get("contract_id")}
            }
        )
        self.update_progress(15.0)

        contract_text = context.get("contract_text", "Relocation package includes $5,000 allowance, subject to a 12-month lock-in period.")
        
        # Flags detection
        flagged_clauses = []
        if "lock-in" in contract_text.lower() or "reimbursement" in contract_text.lower():
            flagged_clauses.append({
                "clause": "Relocation lock-in / reimbursement obligation",
                "risk_level": "medium",
                "description": "If you terminate contract before 12 months, you might be legally obligated to repay relocation allowances."
            })
            
        self.update_progress(50.0)

        # Tax estimation for remote contractors in Nigeria
        base_salary_usd = context.get("base_salary_usd", 80000.0)
        withholding_rate = 0.30 if "US" in contract_text else 0.0  # US W8-BEN vs W2 withholding
        net_usd = base_salary_usd * (1.0 - withholding_rate)

        self.update_progress(100.0, "completed")
        return {
            "flagged_clauses": flagged_clauses,
            "withholding_tax_estimate_rate": withholding_rate,
            "estimated_net_usd_salary": net_usd,
            "is_compliant": len(flagged_clauses) == 0
        }
