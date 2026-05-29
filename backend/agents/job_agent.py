# backend/agents/job_agent.py
from typing import Dict, Any, List
from backend.agents.base import BaseAgent
from backend.utils.currency import format_salary_display, get_usd_to_ngn_rate
from backend.utils.timezones import calculate_wat_overlap
from backend.core.logging import logger

class JobAgent(BaseAgent):
    def __init__(self, session_id: str):
        super().__init__("job", session_id)

    async def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Retrieves listings, checks WAT timezone alignment, and formats salaries.
        No print() statements used to maintain SRE guidelines.
        """
        logger.info(
            "JobAgent is active and processing listings",
            extra={
                "session_id": self.session_id,
                "agent_type": self.agent_type,
                "payload": context
            }
        )
        self.update_progress(10.0)
        
        # Scrape or fetch raw jobs (mocked for phase 1 scaffolding)
        raw_jobs = context.get("jobs", [
            {
                "id": "job-1",
                "title": "Senior React Developer",
                "company": "GlobalTech US",
                "location": "Remote, USA",
                "salary_usd": 90000.0,
                "timezone": "PST",
                "visa_sponsorship": True,
                "remote": True,
            },
            {
                "id": "job-2",
                "title": "Backend Engineer (FastAPI)",
                "company": "EuroBuild Germany",
                "location": "Remote, Berlin",
                "salary_usd": 75000.0,
                "timezone": "CET",
                "visa_sponsorship": False,
                "remote": True,
            }
        ])
        
        self.update_progress(50.0)
        processed_jobs = []
        usd_to_ngn_rate = get_usd_to_ngn_rate()

        for idx, job in enumerate(raw_jobs):
            salary_usd = job.get("salary_usd", 0.0)
            salary_ngn = salary_usd * usd_to_ngn_rate
            formatted_salary = format_salary_display(salary_usd)
            
            # Timezone calculation
            wat_start, wat_end, is_late_night = calculate_wat_overlap(job.get("timezone", "GMT"))
            
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
            })
            
            progress = 50.0 + ((idx + 1) / len(raw_jobs) * 50.0)
            self.update_progress(min(progress, 99.0))

        self.update_progress(100.0, "completed")
        return {
            "scraped_count": len(raw_jobs),
            "matched_jobs": processed_jobs
        }
