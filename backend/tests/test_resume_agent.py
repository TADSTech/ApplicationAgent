# backend/tests/test_resume_agent.py
import pytest
from unittest.mock import patch, MagicMock
from backend.agents.resume_agent import ResumeAgent

@pytest.mark.asyncio
async def test_resume_agent_run(mock_openai):
    with patch("backend.agents.resume_agent.gemini_client", mock_openai), \
         patch("backend.agents.base.firebase_service"):
        agent = ResumeAgent(session_id="test-session")
        context = {
            "resume_text": "NYSC Software Engineer",
            "job_description": "Looking for a Python Developer"
        }
        
        result = await agent.run(context)
        
        assert result["status"] == "success"
        assert result["tailored_output"] == "Mock LLM Response"
        assert result["nigeria_context_adapted"] is True
        assert agent.state.status == "completed"
        assert agent.state.progress == 100.0
