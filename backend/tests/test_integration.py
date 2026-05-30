import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch, MagicMock
from backend.main import app
from backend.agents.base import AgentState, BaseAgent # Explicitly import AgentState
from backend.agents.job_agent import JobAgent
from backend.agents.resume_agent import ResumeAgent
from backend.agents.contract_agent import ContractAgent
from backend.agents.linkedin_agent import LinkedinAgent
from backend.agents.orchestrator import MultiAgentOrchestrator

client = TestClient(app)

@pytest.fixture
def mock_job_agent():
    with patch('backend.agents.job_agent.JobAgent', autospec=True) as MockJobAgent:
        mock_instance = MockJobAgent.return_value
        mock_instance.agent_type = "job"
        mock_instance.session_id = "test_session_id"
        mock_instance.state = AgentState(
            session_id="test_session_id",
            agent_type="job",
            status="queued",
            progress=0.0
        )
        mock_instance.run = AsyncMock(return_value={"jobs": ["job1", "job2"]})
        mock_instance._sync_state = AsyncMock() # Mock Firestore sync
        yield mock_instance

@pytest.fixture
def mock_resume_agent():
    with patch('backend.agents.resume_agent.ResumeAgent', autospec=True) as MockResumeAgent:
        mock_instance = MockResumeAgent.return_value
        mock_instance.agent_type = "resume"
        mock_instance.session_id = "test_session_id"
        mock_instance.state = AgentState(
            session_id="test_session_id",
            agent_type="resume",
            status="queued",
            progress=0.0
        )
        mock_instance.run = AsyncMock(return_value={"tailored_resume": "resume_content"})
        mock_instance._sync_state = AsyncMock()
        yield mock_instance

@pytest.fixture
def mock_contract_agent():
    with patch('backend.agents.contract_agent.ContractAgent', autospec=True) as MockContractAgent:
        mock_instance = MockContractAgent.return_value
        mock_instance.agent_type = "contract"
        mock_instance.session_id = "test_session_id"
        mock_instance.state = AgentState(
            session_id="test_session_id",
            agent_type="contract",
            status="queued",
            progress=0.0
        )
        mock_instance.run = AsyncMock(return_value={"contract_analysis": "analysis_report"})
        mock_instance._sync_state = AsyncMock()
        yield mock_instance

@pytest.fixture
def mock_linkedin_agent():
    with patch('backend.agents.linkedin_agent.LinkedinAgent', autospec=True) as MockLinkedinAgent:
        mock_instance = MockLinkedinAgent.return_value
        mock_instance.agent_type = "linkedin"
        mock_instance.session_id = "test_session_id"
        mock_instance.state = AgentState(
            session_id="test_session_id",
            agent_type="linkedin",
            status="queued",
            progress=0.0
        )
        mock_instance.run = AsyncMock(return_value={"outreach_queue": ["dm1", "dm2"]})
        mock_instance._sync_state = AsyncMock()
        yield mock_instance

@pytest.fixture
def mock_orchestrator():
    with patch('backend.agents.orchestrator.MultiAgentOrchestrator', autospec=True) as MockOrchestrator:
        mock_instance = MockOrchestrator.return_value
        mock_instance.session_id = "test_session_id"
        mock_instance.agents = {}
        mock_instance.register_agent = AsyncMock()
        mock_instance.execute_agent_with_retry = AsyncMock(return_value={"jobs": ["job1", "job2"]})
        yield mock_instance

@pytest.mark.asyncio
async def test_job_search_api_success(mock_job_agent):
    session_id = "test_session_id_api"
    keywords = "Software Engineer"
    location = "Remote"

    # Patch the MultiAgentOrchestrator within the test scope for this specific endpoint call
    with patch('backend.api.routes.MultiAgentOrchestrator', autospec=True) as MockOrchestratorRoute:
        mock_orchestrator_instance = MockOrchestratorRoute.return_value
        mock_orchestrator_instance.execute_agent_with_retry = AsyncMock(return_value={"jobs": ["job1_api", "job2_api"]})
        mock_orchestrator_instance.register_agent = MagicMock()

        response = client.post("/api/v1/jobs/search", json={"session_id": session_id, "keywords": keywords, "location": location})

        assert response.status_code == 200
        assert response.json() == {"session_id": session_id, "result": {"jobs": ["job1_api", "job2_api"]}}

        # Verify orchestrator methods were called correctly
        MockOrchestratorRoute.assert_called_once_with(session_id)
        mock_orchestrator_instance.register_agent.assert_called_once()
        args, kwargs = mock_orchestrator_instance.register_agent.call_args
        # Assert that a JobAgent instance was passed to register_agent
        assert isinstance(args[0], JobAgent)

        mock_orchestrator_instance.execute_agent_with_retry.assert_called_once_with(
            "job",
            {"keywords": keywords, "location": location}
        )

@pytest.mark.asyncio
async def test_resume_tailor_api_success(mock_resume_agent):
    session_id = "test_session_id_resume"
    job_description = "Some job description"
    resume_text = "My resume content"

    with patch('backend.api.routes.MultiAgentOrchestrator', autospec=True) as MockOrchestratorRoute:
        mock_orchestrator_instance = MockOrchestratorRoute.return_value
        mock_orchestrator_instance.execute_agent_with_retry = AsyncMock(return_value={"tailored_resume": "mock_tailored_resume"})
        mock_orchestrator_instance.register_agent = MagicMock()

        response = client.post("/api/v1/resume/tailor", json={"session_id": session_id, "job_description": job_description, "resume_text": resume_text})

        assert response.status_code == 200
        assert response.json() == {"session_id": session_id, "result": {"tailored_resume": "mock_tailored_resume"}}

        MockOrchestratorRoute.assert_called_once_with(session_id)
        mock_orchestrator_instance.register_agent.assert_called_once()
        args, kwargs = mock_orchestrator_instance.register_agent.call_args
        assert isinstance(args[0], ResumeAgent)

        mock_orchestrator_instance.execute_agent_with_retry.assert_called_once_with(
            "resume",
            {"job_description": job_description, "resume_text": resume_text}
        )

@pytest.mark.asyncio
async def test_contract_analyze_api_success(mock_contract_agent):
    session_id = "test_session_id_contract"
    contract_text = "Some contract text"
    base_salary_usd = 100000.0

    with patch('backend.api.routes.MultiAgentOrchestrator', autospec=True) as MockOrchestratorRoute:
        mock_orchestrator_instance = MockOrchestratorRoute.return_value
        mock_orchestrator_instance.execute_agent_with_retry = AsyncMock(return_value={"contract_analysis": "mock_analysis_report"})
        mock_orchestrator_instance.register_agent = MagicMock()

        response = client.post("/api/v1/contract/analyze", json={"session_id": session_id, "contract_text": contract_text, "base_salary_usd": base_salary_usd})

        assert response.status_code == 200
        assert response.json() == {"session_id": session_id, "result": {"contract_analysis": "mock_analysis_report"}}

        MockOrchestratorRoute.assert_called_once_with(session_id)
        mock_orchestrator_instance.register_agent.assert_called_once()
        args, kwargs = mock_orchestrator_instance.register_agent.call_args
        assert isinstance(args[0], ContractAgent)

        mock_orchestrator_instance.execute_agent_with_retry.assert_called_once_with(
            "contract",
            {"contract_text": contract_text, "base_salary_usd": base_salary_usd}
        )

@pytest.mark.asyncio
async def test_linkedin_outreach_api_success(mock_linkedin_agent):
    session_id = "test_session_id_linkedin"
    recruiter_name = "Jane Doe"
    company_name = "Tech Corp"
    job_title = "Software Engineer"

    with patch('backend.api.routes.MultiAgentOrchestrator', autospec=True) as MockOrchestratorRoute:
        mock_orchestrator_instance = MockOrchestratorRoute.return_value
        mock_orchestrator_instance.execute_agent_with_retry = AsyncMock(return_value={"outreach_queue": ["mock_dm_1", "mock_dm_2"]})
        mock_orchestrator_instance.register_agent = MagicMock()

        response = client.post("/api/v1/linkedin/outreach", json={"session_id": session_id, "recruiter_name": recruiter_name, "company_name": company_name, "job_title": job_title})

        assert response.status_code == 200
        assert response.json() == {"session_id": session_id, "result": {"outreach_queue": ["mock_dm_1", "mock_dm_2"]}}

        MockOrchestratorRoute.assert_called_once_with(session_id)
        mock_orchestrator_instance.register_agent.assert_called_once()
        args, kwargs = mock_orchestrator_instance.register_agent.call_args
        assert isinstance(args[0], LinkedinAgent)

        mock_orchestrator_instance.execute_agent_with_retry.assert_called_once_with(
            "linkedin",
            {"recruiter_name": recruiter_name, "company_name": company_name, "job_title": job_title}
        )

@pytest.mark.asyncio
async def test_orchestrator_executes_agent_and_updates_state(mock_job_agent):
    orchestrator = MultiAgentOrchestrator(session_id="test_session_id")
    orchestrator.register_agent(mock_job_agent)
    
    context = {"keywords": "DevOps", "location": "Anywhere"}
    result = await orchestrator.execute_agent_with_retry("job", context)

    mock_job_agent.run.assert_awaited_once_with(context)
    mock_job_agent._sync_state.assert_called() # Should be called multiple times for state updates

    assert mock_job_agent.state.status == "completed"
    assert mock_job_agent.state.progress == 100.0
    assert mock_job_agent.state.result == {"jobs": ["job1", "job2"]}
    assert result == {"jobs": ["job1", "job2"]}

@pytest.mark.asyncio
async def test_orchestrator_handles_agent_failure_and_retries(mock_job_agent):
    # Configure the mock agent to fail twice and then succeed
    mock_job_agent.run.side_effect = [Exception("Simulated failure 1"), Exception("Simulated failure 2"), {"jobs": ["job_retry_success"]}]

    orchestrator = MultiAgentOrchestrator(session_id="test_session_id")
    orchestrator.register_agent(mock_job_agent)
    
    context = {"keywords": "Data Scientist", "location": "Remote"}
    result = await orchestrator.execute_agent_with_retry("job", context)

    assert mock_job_agent.run.await_count == 3 # Initial call + 2 retries
    assert mock_job_agent.state.status == "completed"
    assert mock_job_agent.state.result == {"jobs": ["job_retry_success"]}
    assert result == {"jobs": ["job_retry_success"]}

@pytest.mark.asyncio
async def test_orchestrator_handles_persistent_agent_failure(mock_job_agent):
    # Configure the mock agent to always fail
    mock_job_agent.run.side_effect = Exception("Persistent simulated failure")

    orchestrator = MultiAgentOrchestrator(session_id="test_session_id")
    orchestrator.register_agent(mock_job_agent)
    
    context = {"keywords": "ML Engineer", "location": "New York"}
    result = await orchestrator.execute_agent_with_retry("job", context)

    assert mock_job_agent.run.await_count == 4 # Initial call + 3 retries (max_retries)
    assert mock_job_agent.state.status == "failed"
    assert "Persistent simulated failure" in mock_job_agent.state.error
    assert result == {"status": "failed", "error": "Persistent simulated failure"}


