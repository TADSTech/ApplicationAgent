# backend/services/firecrawl.py
from typing import List, Dict, Any

from firecrawl import FirecrawlApp
from core.logging import logger
from core.config import settings

class FirecrawlService:
    def __init__(self, api_key: str):
        self.app = FirecrawlApp(api_key=api_key) if api_key else None

    async def scrape_jobs(self, keywords: str, location: str) -> List[Dict[str, Any]]:
        """
        Scrapes job listings using the Firecrawl API.
        """
        if not self.app:
            logger.warning("Firecrawl API key not configured. Returning mock data.")
            
            # Enhanced mock data with various job types
            mock_jobs = [
                {
                    "id": "mock-job-1",
                    "title": f"Software Engineer - {keywords}",
                    "company": "MockTech Co.",
                    "location": location,
                    "salary_usd": 90000.0,
                    "description": "This is a mock job description for a software engineer. Key skills: Python, AWS, React.",
                    "requirements": ["Python", "AWS", "React", "Problem Solving"],
                    "url": "https://mockjobs.com/1",
                    "timezone": "EST",
                    "visa_sponsorship": True,
                    "remote": True
                },
                {
                    "id": "mock-job-2",
                    "title": f"DevOps Engineer - {keywords}",
                    "company": "Global Solutions Inc.",
                    "location": location,
                    "salary_usd": 110000.0,
                    "description": "Seeking a DevOps Engineer with cloud experience. Skills: Docker, Kubernetes, CI/CD.",
                    "requirements": ["Docker", "Kubernetes", "CI/CD", "AWS"],
                    "url": "https://mockjobs.com/2",
                    "timezone": "PST",
                    "visa_sponsorship": False,
                    "remote": True
                },
                {
                    "id": "mock-job-3",
                    "title": f"Data Scientist - {keywords}",
                    "company": "DataDriven Corp",
                    "location": location,
                    "salary_usd": 125000.0,
                    "description": "Data Scientist role focusing on machine learning and statistical analysis. Skills: Python, SQL, ML frameworks.",
                    "requirements": ["Python", "SQL", "Machine Learning", "Statistics", "TensorFlow"],
                    "url": "https://mockjobs.com/3",
                    "timezone": "EST",
                    "visa_sponsorship": True,
                    "remote": True
                },
                {
                    "id": "mock-job-4",
                    "title": f"Machine Learning Engineer - {keywords}",
                    "company": "AI Innovations Ltd",
                    "location": location,
                    "salary_usd": 140000.0,
                    "description": "ML Engineer to build and deploy machine learning models. Skills: Python, PyTorch, MLOps.",
                    "requirements": ["Python", "PyTorch", "MLOps", "Deep Learning", "Kubernetes"],
                    "url": "https://mockjobs.com/4",
                    "timezone": "GMT",
                    "visa_sponsorship": True,
                    "remote": True
                },
                {
                    "id": "mock-job-5",
                    "title": f"Data Analyst - {keywords}",
                    "company": "Analytics Pro",
                    "location": location,
                    "salary_usd": 85000.0,
                    "description": "Data Analyst to interpret data and create reports. Skills: SQL, Tableau, Excel.",
                    "requirements": ["SQL", "Tableau", "Excel", "Data Visualization", "Python"],
                    "url": "https://mockjobs.com/5",
                    "timezone": "CST",
                    "visa_sponsorship": False,
                    "remote": True
                },
                {
                    "id": "mock-job-6",
                    "title": f"Full Stack Developer - {keywords}",
                    "company": "WebWorks Inc",
                    "location": location,
                    "salary_usd": 105000.0,
                    "description": "Full Stack Developer for web applications. Skills: React, Node.js, PostgreSQL.",
                    "requirements": ["React", "Node.js", "PostgreSQL", "TypeScript", "AWS"],
                    "url": "https://mockjobs.com/6",
                    "timezone": "EST",
                    "visa_sponsorship": True,
                    "remote": True
                }
            ]
            
            # Filter mock jobs based on keywords
            keywords_lower = keywords.lower()
            if "data" in keywords_lower or "science" in keywords_lower or "analyst" in keywords_lower:
                return [job for job in mock_jobs if "data" in job["title"].lower() or "analyst" in job["title"].lower()]
            elif "machine learning" in keywords_lower or "ml" in keywords_lower:
                return [job for job in mock_jobs if "machine learning" in job["title"].lower() or "ml" in job["title"].lower()]
            elif "devops" in keywords_lower:
                return [job for job in mock_jobs if "devops" in job["title"].lower()]
            else:
                return mock_jobs

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

