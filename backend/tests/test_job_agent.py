# backend/tests/test_job_agent.py
import pytest
from unittest.mock import patch, AsyncMock
from backend.agents.job_agent import JobAgent

@pytest.mark.asyncio
async def test_job_agent_run(mock_firecrawl):
    # Patch FirecrawlService and firebase_service to avoid real network/db calls
    with patch("backend.agents.job_agent.firecrawl_service", mock_firecrawl), \
         patch("backend.agents.base.firebase_service") as mock_fb:
        
        agent = JobAgent(session_id="test-session")
        context = {"keywords": "Python", "location": "Remote"}
        
        result = await agent.run(context)
        
        assert result["scraped_count"] == 1
        assert len(result["matched_jobs"]) == 1
        job = result["matched_jobs"][0]
        assert job["title"] == "Test Engineer"
        assert "WAT" in job["wat_hours"]
        assert "$" in job["salary_display"]
        assert "₦" in job["salary_display"]
        
        # Verify progress updates were called
        assert agent.state.progress == 100.0
        assert agent.state.status == "completed"
