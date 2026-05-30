# backend/tests/test_orchestrator.py
import pytest
import asyncio
from unittest.mock import MagicMock, AsyncMock, patch
from backend.agents.orchestrator import MultiAgentOrchestrator
from backend.agents.base import BaseAgent

class MockAgent(BaseAgent):
    async def run(self, context):
        if context.get("should_fail"):
            raise Exception("Forced Failure")
        return {"status": "success"}

@pytest.mark.asyncio
async def test_orchestrator_retry_logic():
    with patch("backend.agents.base.firebase_service"):
        orchestrator = MultiAgentOrchestrator(session_id="test-session")
        agent = MockAgent(agent_type="mock", session_id="test-session")
        orchestrator.register_agent(agent)
        
        # Test success on first try
        result = await orchestrator.execute_agent_with_retry("mock", {"should_fail": False})
        assert result["status"] == "success"
        assert agent.state.status == "completed"

@pytest.mark.asyncio
async def test_orchestrator_failure_and_exhaustion():
    with patch("backend.agents.base.firebase_service"), \
         patch("asyncio.sleep", return_value=None): # Speed up test by skip sleep
        
        orchestrator = MultiAgentOrchestrator(session_id="test-session")
        agent = MockAgent(agent_type="mock", session_id="test-session")
        orchestrator.register_agent(agent)
        
        # Test failure after 3 retries
        result = await orchestrator.execute_agent_with_retry("mock", {"should_fail": True})
        assert result["status"] == "failed"
        assert result["error"] == "Forced Failure"
        assert agent.state.status == "failed"
