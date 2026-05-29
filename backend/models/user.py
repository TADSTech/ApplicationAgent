# backend/models/user.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserProfile(BaseModel):
    phone: Optional[str] = None
    location: str = "Nigeria"
    timezone: str = "WAT"
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None

class UserPreferences(BaseModel):
    target_roles: List[str]
    target_salary_min: Optional[float] = None  # USD
    preferred_locations: List[str]
    sponsorship_required: bool = True
    remote_only: bool = True

class User(BaseModel):
    id: str
    email: str
    name: str
    profile: UserProfile
    preferences: UserPreferences
    created_at: datetime
    updated_at: datetime
