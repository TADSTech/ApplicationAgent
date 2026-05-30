# backend/core/config.py
import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "JobJockey"
    API_V1_STR: str = "/api/v1"
    
    # Firebase configurations
    FIREBASE_CREDENTIALS_PATH: Optional[str] = os.getenv("FIREBASE_CREDENTIALS_PATH", None)
    FIRESTORE_PROJECT_ID: str = os.getenv("FIRESTORE_PROJECT_ID", "jobjockey-default")
    
    # Gemini API Configuration
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", None)
    
    # External API Keys (Nice-to-Have - with mock fallbacks)
    EXCHANGERATE_API_KEY: Optional[str] = os.getenv("EXCHANGERATE_API_KEY", None)
    FIRECRAWL_API_KEY: Optional[str] = os.getenv("FIRECRAWL_API_KEY", None)
    GITHUB_TOKEN: Optional[str] = os.getenv("GITHUB_TOKEN", None)
    HACKERRANK_API_KEY: Optional[str] = os.getenv("HACKERRANK_API_KEY", None)
    DEVTO_API_KEY: Optional[str] = os.getenv("DEVTO_API_KEY", None)
    
    model_config = SettingsConfigDict(
        env_file = ".env",
        case_sensitive = True
    )

settings = Settings()
