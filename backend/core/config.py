# backend/core/config.py
import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

# Determine backend base directory
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class Settings(BaseSettings):
    PROJECT_NAME: str = "JobJockey"
    API_V1_STR: str = "/api/v1"
    
    # Demo Mode Configuration
    DEMO_MODE: bool = True
    DEMO_JOB_DELAY: int = 20  # seconds for job search simulation
    ENABLE_REAL_SCRAPING: bool = False
    ENABLE_LINKEDIN_INTEGRATION: bool = False
    
    # Firebase configurations
    FIREBASE_CREDENTIALS_PATH: Optional[str] = None
    FIRESTORE_PROJECT_ID: str = "jobjockey-default"
    FIREBASE_WEB_API_KEY: Optional[str] = None
    
    # Gemini API Configuration
    GEMINI_API_KEY: Optional[str] = None
    
    # OpenRouter API Configuration (Backup for Gemini rate limits)
    OPENROUTER_API_KEY: Optional[str] = None
    
    # External API Keys (Nice-to-Have - with mock fallbacks)
    EXCHANGERATE_API_KEY: Optional[str] = None
    FIRECRAWL_API_KEY: Optional[str] = None
    GITHUB_TOKEN: Optional[str] = None
    HACKERRANK_API_KEY: Optional[str] = None
    DEVTO_API_KEY: Optional[str] = None
    
    @property
    def resolved_credentials_path(self) -> Optional[str]:
        if not self.FIREBASE_CREDENTIALS_PATH:
            return None
        if os.path.isabs(self.FIREBASE_CREDENTIALS_PATH):
            return self.FIREBASE_CREDENTIALS_PATH
        return os.path.join(BACKEND_DIR, self.FIREBASE_CREDENTIALS_PATH)
    
    model_config = SettingsConfigDict(
        env_file = os.path.join(BACKEND_DIR, ".env"),
        case_sensitive = True,
        extra = "ignore"
    )

settings = Settings()
