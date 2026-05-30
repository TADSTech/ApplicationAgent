# backend/agents/job_agent.py
from typing import Dict, Any, List
from backend.agents.base import BaseAgent
from backend.utils.currency import format_salary_display, get_usd_to_ngn_rate
from backend.utils.timezones import calculate_wat_overlap
from backend.services.firecrawl import FirecrawlService
from backend.core.config import settings
from backend.core.logging import logger

class JobAgent(BaseAgent):
    def __init__(self, session_id: str):
        super().__init__("job", session_id)
        self.firecrawl = FirecrawlService(api_key=settings.FIRECRAWL_API_KEY)

    async def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Retrieves listings, checks WAT timezone alignment, and formats salaries.
        No print() statements used to maintain SRE guidelines.
        """
        keywords = context.get("keywords", "Software Engineer")
        location = context.get("location", "USA")

        logger.info(
            "JobAgent is active and processing listings",
            extra={
                "session_id": self.session_id,
                "agent_type": self.agent_type,
                "payload": {"keywords": keywords, "location": location}
            }
        )
        self.update_progress(10.0)
        
        # Scrape live jobs
        raw_jobs = await self.firecrawl.scrape_jobs(keywords, location)
        
        if not raw_jobs:
            self.update_progress(100.0, "completed")
            return {"scraped_count": 0, "matched_jobs": [], "message": "No jobs found for criteria."}

        self.update_progress(50.0)
        processed_jobs = []
        usd_to_ngn_rate = get_usd_to_ngn_rate()

        for idx, job in enumerate(raw_jobs):
            salary_usd = job.get("salary_usd", 0.0)
            salary_ngn = salary_usd * usd_to_ngn_rate
            formatted_salary = format_salary_display(salary_usd)
            
            # Timezone calculation
            timezone_str = job.get("timezone", "GMT")
            wat_start, wat_end, is_late_night = calculate_wat_overlap(timezone_str)
            
            processed_jobs.append({
                "id": job.get("id"),
                "title": job.get("title"),
                "company": job.get("company"),
                "location": job.get("location"),
                "salary_usd": salary_usd,
                "salary_ngn": salary_ngn,
                "salary_display": formatted_salary,
                "wat_working_hours": f"{wat_start:02d}:00 - {wat_end:02d}:00 WAT",
                "is_late_night_wat_shift": is_late_night,
                "visa_sponsorship": job.get("visa_sponsorship", False),
                "remote": job.get("remote", False),
                "url": job.get("url")
            })
            
            progress = 50.0 + ((idx + 1) / len(raw_jobs) * 50.0)
            self.update_progress(min(progress, 99.0))

        self.update_progress(100.0, "completed")
        return {
            "scraped_count": len(raw_jobs),
            "matched_jobs": processed_jobs
        }
