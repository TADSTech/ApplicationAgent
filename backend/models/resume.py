# backend/models/resume.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ResumeSection(BaseModel):
    title: str
    content: str

class Resume(BaseModel):
    id: str
    user_id: str
    filename: str
    s3_url: Optional[str] = None
    parsed_skills: List[str]
    sections: List[ResumeSection]
    nigeria_adapted: bool = False
    created_at: datetime
    updated_at: datetime
