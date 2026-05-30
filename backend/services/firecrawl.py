# backend/services/firecrawl.py
from typing import List, Dict, Any
from firecrawl import FirecrawlApp
from backend.core.logging import logger

class FirecrawlService:
    def __init__(self, api_key: str):
        self.app = FirecrawlApp(api_key=api_key) if api_key else None

    async def scrape_jobs(self, keywords: str, location: str) -> List[Dict[str, Any]]:
        """
        Interacts with the Firecrawl API to gather live web-scraped job postings.
        """
        if not self.app:
            logger.warning("Firecrawl API key not configured. Returning mock data.")
            return [
                {
                    "id": "mock-1",
                    "title": "Software Engineer II (Remote)",
                    "company": "Stripe",
                    "location": "San Francisco, CA",
                    "salary_usd": 120000.0,
                    "timezone": "PST",
                    "visa_sponsorship": True,
                    "remote": True,
                    "description": "Building global payments infrastructure.",
                    "url": "https://stripe.com/jobs"
                }
            ]

        logger.info(
            "Initiating Firecrawl scraping stream",
            extra={
                "agent_type": "job",
                "payload": {"keywords": keywords, "location": location}
            }
        )

        try:
            # Using crawl or search depending on the need. Search is usually better for specific keywords.
            search_query = f"{keywords} jobs in {location} remote"
            search_result = self.app.search(search_query)
            
            # Map search result to standard job model
            jobs = []
            for item in search_result.get('data', []):
                jobs.append({
                    "id": item.get('url'),
                    "title": item.get('title'),
                    "company": "Extracted from Page", # Firecrawl search doesn't always split metadata
                    "location": location,
                    "salary_usd": 0.0, # Will need LLM to extract this from description
                    "timezone": "GMT", # Default to GMT, will be updated by JobAgent
                    "visa_sponsorship": "visa" in item.get('content', '').lower(),
                    "remote": True,
                    "description": item.get('content', ''),
                    "url": item.get('url')
                })
            return jobs
        except Exception as e:
            logger.error(f"Firecrawl scraping failed: {str(e)}")
            return []
