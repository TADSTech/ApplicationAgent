# backend/tests/test_linkedin_agent.py
import pytest
from unittest.mock import patch
from backend.agents.linkedin_agent import LinkedinAgent

@pytest.mark.asyncio
async def test_linkedin_agent_run(mock_openai):
    with patch("backend.agents.linkedin_agent.OpenAIService", return_value=mock_openai), \
         patch("backend.agents.base.firebase_service"):
        
        agent = LinkedinAgent(session_id="test-session")
        context = {
            "recruiter_name": "Jane Smith",
            "company_name": "TechGlobal",
            "job_title": "Backend Dev"
        }
        
        result = await agent.run(context)
        
        assert result["status"] == "success"
        assert result["outreach_drafts"] == "Mock LLM Response"
        assert agent.state.status == "completed"
        assert agent.state.progress == 100.0
