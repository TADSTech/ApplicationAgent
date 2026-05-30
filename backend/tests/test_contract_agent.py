# backend/tests/test_contract_agent.py
import pytest
from unittest.mock import patch
from backend.agents.contract_agent import ContractAgent

@pytest.mark.asyncio
async def test_contract_agent_run(mock_openai):
    with patch("backend.agents.contract_agent.gemini_client", mock_openai), \
         patch("backend.agents.base.firebase_service"):
        agent = ContractAgent(session_id="test-session")
        context = {
            "contract_text": "Sample US employment contract with relocation lock-in.",
            "base_salary_usd": 90000.0
        }
        
        result = await agent.run(context)
        
        assert result["status"] == "success"
        assert result["analysis_output"] == "Mock LLM Response"
        assert agent.state.status == "completed"
        assert agent.state.progress == 100.0
