# backend/services/firecrawl.py
from typing import List, Dict, Any

from firecrawl import FirecrawlApp
from backend.core.logging import logger
from backend.core.config import settings

class FirecrawlService:
    def __init__(self, api_key: str):
        self.app = FirecrawlApp(api_key=api_key) if api_key else None

    async def scrape_jobs(self, keywords: str, location: str) -> List[Dict[str, Any]]:
        """
        Scrapes job listings using the Firecrawl API.
        """
        if not self.app:
            logger.warning("Firecrawl API key not configured. Returning mock data.")
            return [
                {
                    "id": "mock-job-1",
                    "title": f"Mock Software Engineer - {keywords}",
                    "company": "MockTech Co.",
                    "location": location,
                    "salary_usd": 90000.0,
                    "description": "This is a mock job description for a software engineer. Key skills: Python, AWS.",
                    "requirements": ["Python", "AWS", "Problem Solving"],
                    "url": "https://mockjobs.com/1",
                    "timezone": "EST",
                    "visa_sponsorship": True,
                    "remote": True
                },
                {
                    "id": "mock-job-2",
                    "title": f"Mock DevOps Engineer - {keywords}",
                    "company": "Global Solutions Inc.",
                    "location": location,
                    "salary_usd": 110000.0,
                    "description": "Seeking a mock DevOps Engineer with cloud experience. Skills: Docker, Kubernetes.",
                    "requirements": ["Docker", "Kubernetes", "CI/CD"],
                    "url": "https://mockjobs.com/2",
                    "timezone": "PST",
                    "visa_sponsorship": False,
                    "remote": True
                }
            ]

        logger.info(f"Firecrawl scraping initiated for keywords: {keywords}, location: {location}")
        try:
            search_query = f"{keywords} jobs in {location} remote"
            search_result = self.app.search(search_query)
            
            jobs = []
            for item in search_result.get('data', []):
                jobs.append({
                    "id": item.get('url'),
                    "title": item.get('title'),
                    "company": "Extracted from Page",
                    "location": location,
                    "salary_usd": 0.0, 
                    "timezone": "GMT", 
                    "visa_sponsorship": "visa" in item.get('content', '').lower(),
                    "remote": True,
                    "description": item.get('content', ''),
                    "url": item.get('url')
                })
            return jobs
        except Exception as e:
            logger.error(f"Firecrawl scraping failed: {str(e)}")
            return []

firecrawl_service = FirecrawlService(api_key=settings.FIRECRAWL_API_KEY)

