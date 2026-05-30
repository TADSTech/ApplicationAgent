
# backend/models/visa.py
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class VisaSponsorship(BaseModel):
    company_name: str
    country: str
    visa_type: str
    job_titles: List[str]
    last_updated: datetime
    notes: Optional[str] = None

class VisaStatusUpdate(BaseModel):
    company_name: str
    status: str # e.g., "sponsoring", "not sponsoring", "limited"
    source: str # e.g., "user_report", "scraper", "api"
    date_recorded: datetime
    details: Optional[str] = None
