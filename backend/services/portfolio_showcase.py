
# backend/services/portfolio_showcase.py
import httpx
from typing import List, Dict, Any, Optional
from ..core.logging import logger
from ..core.config import settings

class PortfolioShowcaseService:
    def __init__(self):
        self.github_token = settings.GITHUB_TOKEN # Assume GITHUB_TOKEN is added to config
        self.hackerrank_api_key = settings.HACKERRANK_API_KEY # Assume HACKERRANK_API_KEY is added to config
        self.devto_api_key = settings.DEVTO_API_KEY # Assume DEVTO_API_KEY is added to config

    async def get_github_repos(self, github_username: str) -> Optional[List[Dict[str, Any]]]:
        """
        Fetches public repositories for a given GitHub username.
        """
        if not self.github_token:
            logger.warning("GITHUB_TOKEN is not set, skipping GitHub integration.", extra={"agent_type": "portfolio_showcase"})
            return None

        headers = {"Authorization": f"token {self.github_token}"}
        url = f"https://api.github.com/users/{github_username}/repos"
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, headers=headers, timeout=10)
                response.raise_for_status()
                return response.json()
        except httpx.RequestError as e:
            logger.error(f"GitHub API request failed: {e}", extra={"agent_type": "portfolio_showcase", "error": str(e)})
            return None
        except Exception as e:
            logger.error(f"An unexpected error occurred during GitHub fetch: {e}", extra={"agent_type": "portfolio_showcase", "error": str(e)})
            return None

    async def get_hackerrank_profile(self, hackerrank_username: str) -> Optional[Dict[str, Any]]:
        """
        (Placeholder) Fetches HackerRank profile data.
        In a real application, this would involve scraping or a private API if available.
        """
        logger.info(f"Fetching HackerRank profile for {hackerrank_username} (placeholder).",
                    extra={"agent_type": "portfolio_showcase", "payload": {"username": hackerrank_username}})
        # Mock data
        if hackerrank_username == "testuser":
            return {
                "username": "testuser",
                "rank": 12345,
                "badges": ["Python (Gold)", "Algorithms (Silver)"],
                "solved_challenges": 50,
                "details": "This is mock data. Real HackerRank integration needs a proper API/scraping."
            }
        return None

    async def get_devto_articles(self, devto_username: str) -> Optional[List[Dict[str, Any]]]:
        """
        Fetches articles for a given Dev.to username.
        """
        # Dev.to API usually doesn't require an API key for public articles, but having one for higher rate limits is common
        headers = {"api-key": self.devto_api_key} if self.devto_api_key else {}
        url = f"https://dev.to/api/articles?username={devto_username}"
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, headers=headers, timeout=10)
                response.raise_for_status()
                return response.json()
        except httpx.RequestError as e:
            logger.error(f"Dev.to API request failed: {e}", extra={"agent_type": "portfolio_showcase", "error": str(e)})
            return None
        except Exception as e:
            logger.error(f"An unexpected error occurred during Dev.to fetch: {e}", extra={"agent_type": "portfolio_showcase", "error": str(e)})
            return None

portfolio_showcase_service = PortfolioShowcaseService()
