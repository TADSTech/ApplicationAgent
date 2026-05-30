# backend/tests/conftest.py
import pytest
import asyncio
from unittest.mock import MagicMock, AsyncMock

@pytest.fixture
def mock_firecrawl():
    mock = MagicMock()
    mock.scrape_jobs = AsyncMock(return_value=[
        {
            "id": "test-1",
            "title": "Test Engineer",
            "company": "Test Co",
            "location": "Remote",
            "salary_usd": 100000.0,
            "timezone": "EST",
            "visa_sponsorship": True,
            "remote": True,
            "description": "Test description",
            "url": "http://test.com"
        }
    ])
    return mock

@pytest.fixture
def mock_openai():
    mock = MagicMock()
    mock.generate_response = AsyncMock(return_value="Mock LLM Response")
    return mock

@pytest.fixture
def mock_firebase():
    mock = MagicMock()
    mock.update_agent_state = MagicMock()
    return mock
