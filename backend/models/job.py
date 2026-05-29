# backend/models/job.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Job(BaseModel):
    id: str
    title: str
    company: str
    location: str
    salary_min: Optional[float] = None  # USD
    salary_max: Optional[float] = None  # USD
    salary_min_ngn: Optional[float] = None  # NGN equivalent
    salary_max_ngn: Optional[float] = None  # NGN equivalent
    description: str
    requirements: List[str]
    url: str
    posted_at: datetime
    time_zone: str  # WAT compatibility
    visa_sponsorship: bool
    remote: bool
    source: str  # Firecrawl, Indeed, etc.
