# backend/models/application.py
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime
from models.job import Job

class ApplicationNote(BaseModel):
    id: str
    author: str
    text: str
    created_at: datetime

class Application(BaseModel):
    id: str
    user_id: str
    job_id: str
    job: Job  # Snapshot of job at application time
    status: str  # applied, in_progress, interview, offer, rejected
    resume_version: str  # Which resume was used
    applied_at: datetime
    updated_at: datetime
    agent_status: Dict[str, str]  # Agent progress tracking
    notes: List[ApplicationNote]
