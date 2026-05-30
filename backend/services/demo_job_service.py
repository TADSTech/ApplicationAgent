# backend/services/demo_job_service.py
"""Demo job service for loading and filtering pre-generated job listings."""

import json
import os
from typing import List, Dict, Any, Optional
try:
    from ..core.logging import logger
except ImportError:
    from backend.core.logging import logger

class DemoJobService:
    def __init__(self):
        self.jobs: List[Dict[str, Any]] = []
        self._load_jobs()
    
    def _load_jobs(self):
        """Load demo jobs from JSON file."""
        data_path = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            'data',
            'demo_jobs.json'
        )
        
        try:
            with open(data_path, 'r') as f:
                self.jobs = json.load(f)
            logger.info(f"Loaded {len(self.jobs)} demo jobs from {data_path}")
        except FileNotFoundError:
            logger.error(f"Demo jobs file not found at {data_path}")
            self.jobs = []
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse demo jobs JSON: {e}")
            self.jobs = []
    
    def get_matching_jobs(
        self,
        keywords: Optional[str] = None,
        location: Optional[str] = None,
        remote_only: bool = False,
        visa_required: bool = False,
        min_salary: Optional[int] = None,
        max_salary: Optional[int] = None,
        limit: int = 150
    ) -> List[Dict[str, Any]]:
        """
        Filter and return matching jobs based on criteria.
        
        Args:
            keywords: Search keywords (matches title, company, requirements)
            location: Location filter
            remote_only: Only return remote jobs
            visa_required: Only return jobs with visa sponsorship
            min_salary: Minimum salary filter
            max_salary: Maximum salary filter
            limit: Maximum number of jobs to return
        
        Returns:
            List of matching job dictionaries
        """
        filtered_jobs = self.jobs.copy()
        
        # Apply filters
        if keywords:
            keywords_lower = keywords.lower()
            filtered_jobs = [
                job for job in filtered_jobs
                if (keywords_lower in job['title'].lower() or
                    keywords_lower in job['company'].lower() or
                    any(keywords_lower in req.lower() for req in job['requirements']))
            ]
        
        if location and location.lower() != 'remote':
            filtered_jobs = [
                job for job in filtered_jobs
                if location.lower() in job['location'].lower()
            ]
        
        if remote_only:
            filtered_jobs = [job for job in filtered_jobs if job['remote']]
        
        if visa_required:
            filtered_jobs = [job for job in filtered_jobs if job['visa_sponsorship']]
        
        if min_salary:
            filtered_jobs = [job for job in filtered_jobs if job['salary_usd'] >= min_salary]
        
        if max_salary:
            filtered_jobs = [job for job in filtered_jobs if job['salary_usd'] <= max_salary]
        
        # Return limited results
        return filtered_jobs[:limit]
    
    def get_job_by_id(self, job_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific job by ID."""
        for job in self.jobs:
            if job['id'] == job_id:
                return job
        return None
    
    def get_random_jobs(self, count: int = 10) -> List[Dict[str, Any]]:
        """Get random jobs for testing."""
        import random
        return random.sample(self.jobs, min(count, len(self.jobs)))


# Global instance
demo_job_service = DemoJobService()
