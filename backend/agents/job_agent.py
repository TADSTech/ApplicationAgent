# backend/agents/job_agent.py
from typing import Dict, Any, List
from datetime import datetime, timezone
from backend.agents.base import BaseAgent
from backend.utils.currency import format_salary_display, FALLBACK_RATE
from backend.services.currency_converter import currency_converter_service
from backend.utils.timezones import calculate_wat_overlap
from backend.services.firecrawl import FirecrawlService
from backend.core.config import settings
from backend.core.logging import logger
from backend.models.job import Job

class JobAgent(BaseAgent):
    def __init__(self, session_id: str):
        super().__init__("job", session_id)
        self.firecrawl = FirecrawlService(api_key=settings.FIRECRAWL_API_KEY)
        self.currency_converter_service = currency_converter_service

    async def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Retrieves listings, checks WAT timezone alignment, and formats salaries.
        Adheres to Rule 3.2.1 and Nigeria-specific Rule 5.
        """
        keywords = context.get("keywords", "Software Engineer")
        location = context.get("location", "Remote")

        logger.info(
            "JobAgent initiating search",
            extra={
                "session_id": self.session_id,
                "agent_type": self.agent_type,
                "payload": {"keywords": keywords, "location": location}
            }
        )
        self.update_progress(10.0)
        
        try:
            # Scrape live jobs via Firecrawl
            raw_jobs = await self.firecrawl.scrape_jobs(keywords, location)
            self.update_progress(40.0)
            
            if not raw_jobs:
                logger.warning(
                    "No jobs found",
                    extra={"session_id": self.session_id, "agent_type": self.agent_type}
                )
                self.update_progress(100.0, "completed")
                return {"scraped_count": 0, "matched_jobs": []}

            processed_jobs = []
            usd_to_ngn_rate = await self.currency_converter_service.get_exchange_rate("USD", "NGN")
            if usd_to_ngn_rate is None:
                usd_to_ngn_rate = FALLBACK_RATE # Fallback to default if service fails

            for idx, job_data in enumerate(raw_jobs):
                # Salary processing (Rule 5.1)
                salary_usd = job_data.get("salary_usd", 0.0)
                salary_ngn = salary_usd * usd_to_ngn_rate
                salary_display = await format_salary_display(salary_usd)
                
                # Timezone overlap calculation (Rule 5.2)
                tz = job_data.get("timezone", "GMT")
                wat_start, wat_end, is_late_night = calculate_wat_overlap(tz)
                
                # Constructing Job Model
                job_obj = {
                    "id": job_data.get("id", f"job-{idx}"),
                    "title": job_data.get("title", "Unknown Title"),
                    "company": job_data.get("company", "Unknown Company"),
                    "location": job_data.get("location", location),
                    "salary_min": salary_usd,
                    "salary_max": salary_usd,
                    "salary_min_ngn": salary_ngn,
                    "salary_max_ngn": salary_ngn,
                    "salary_display": salary_display,
                    "description": job_data.get("description", ""),
                    "requirements": job_data.get("requirements", []),
                    "url": job_data.get("url", ""),
                    "posted_at": datetime.now(timezone.utc).isoformat(), # Mocked for now
                    "time_zone": tz,
                    "wat_hours": f"{wat_start:02d}:00 - {wat_end:02d}:00 WAT",
                    "is_late_night_wat_shift": is_late_night,
                    "visa_sponsorship": job_data.get("visa_sponsorship", False),
                    "remote": job_data.get("remote", True),
                    "source": "Firecrawl"
                }
                
                processed_jobs.append(job_obj)
                
                # Progress calculation
                progress = 40.0 + ((idx + 1) / len(raw_jobs) * 60.0)
                self.update_progress(min(progress, 99.0))

            self.update_progress(100.0, "completed")
            return {
                "scraped_count": len(raw_jobs),
                "matched_jobs": processed_jobs
            }

        except Exception as e:
            logger.error(
                "JobAgent execution failed",
                extra={
                    "session_id": self.session_id,
                    "agent_type": self.agent_type,
                    "payload": {"error": str(e)}
                }
            )
            self.state.status = "failed"
            self.state.error = str(e)
            self._sync_state()
            raise
