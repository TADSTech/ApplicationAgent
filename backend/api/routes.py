# backend/api/routes.py
from fastapi import APIRouter, Depends, HTTPException, status, Body, Query
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
try:
    from models.job import Job
    from agents.orchestrator import MultiAgentOrchestrator
    from agents.job_agent import JobAgent
    from agents.resume_agent import ResumeAgent
    from agents.contract_agent import ContractAgent
    from agents.linkedin_agent import LinkedinAgent
    from api.dependencies import verify_firebase_token
    from core.logging import logger
    from services.currency_converter import currency_converter_service
    from services.portfolio_showcase import portfolio_showcase_service
    from services.demo_job_service import demo_job_service
    from services.profile_builder import profile_builder_service
except ImportError:
    from backend.models.job import Job
    from backend.agents.orchestrator import MultiAgentOrchestrator
    from backend.agents.job_agent import JobAgent
    from backend.agents.resume_agent import ResumeAgent
    from backend.agents.contract_agent import ContractAgent
    from backend.agents.linkedin_agent import LinkedinAgent
    from backend.api.dependencies import verify_firebase_token
    from backend.core.logging import logger
    from backend.services.currency_converter import currency_converter_service
    from backend.services.portfolio_showcase import portfolio_showcase_service
    from backend.services.demo_job_service import demo_job_service
    from backend.services.profile_builder import profile_builder_service

router = APIRouter()

@router.get("/jobs")
async def get_demo_jobs(
    keywords: Optional[str] = None,
    location: Optional[str] = None,
    remote_only: bool = False,
    visa_required: bool = False,
    min_salary: Optional[int] = None,
    max_salary: Optional[int] = None,
    limit: int = 20
):
    """
    Get demo jobs with optional filtering.
    """
    try:
        jobs = demo_job_service.get_matching_jobs(
            keywords=keywords,
            location=location,
            remote_only=remote_only,
            visa_required=visa_required,
            min_salary=min_salary,
            max_salary=max_salary,
            limit=limit
        )
        
        return {
            "count": len(jobs),
            "jobs": jobs
        }
    except Exception as e:
        logger.error(f"Error getting demo jobs: {str(e)}", 
                    extra={"agent_type": "api", "error": str(e)})
        raise HTTPException(status_code=500, detail="Failed to fetch jobs")

@router.get("/exchange-rate")
async def get_exchange_rate():
    """
    Get current exchange rate between USD and NGN.
    Returns both USD to NGN and NGN to USD rates.
    """
    from datetime import datetime, timezone
    
    try:
        usd_to_ngn = await currency_converter_service.get_exchange_rate("USD", "NGN")
        
        if usd_to_ngn is None:
            # Return fallback/mock rate if API call fails
            usd_to_ngn = 1625.50  # Fallback rate
            logger.warning("Exchange rate API call failed, using fallback rate", 
                         extra={"agent_type": "api", "fallback_rate": usd_to_ngn})
        
        ngn_to_usd = 1.0 / usd_to_ngn if usd_to_ngn > 0 else 0.0
        
        return {
            "usd_to_ngn": round(usd_to_ngn, 2),
            "ngn_to_usd": round(ngn_to_usd, 6),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        logger.error(f"Error getting exchange rate: {str(e)}", 
                    extra={"agent_type": "api", "error": str(e)})
        raise HTTPException(status_code=500, detail="Failed to get exchange rate")

class JobSearchRequest(BaseModel):
    session_id: str
    keywords: str = "Software Engineer"
    location: str = "Remote"

class ResumeTailorRequest(BaseModel):
    session_id: str
    job_description: str
    resume_text: str

class ContractAnalyzeRequest(BaseModel):
    session_id: str
    contract_text: str
    base_salary_usd: float = 0.0

class LinkedInDMRequest(BaseModel):
    session_id: str
    recruiter_name: str
    company_name: str
    job_title: str

class GitHubReposRequest(BaseModel):
    github_username: str

class ParseResumeRequest(BaseModel):
    resume_text: str
    user_id: str = "demo_user"

@router.post("/auth/login")
async def login(auth_data: Dict[str, Any] = Depends(verify_firebase_token)):
    return {"message": "Successful login with Firebase token", "user": auth_data}

@router.post("/auth/logout")
async def logout():
    return {"message": "Logged out successfully"}

@router.get("/agents/states")
async def get_agent_states(session_id: str):
    """
    Get states of all agents for a given session.
    """
    try:
        from services.firebase import firebase_service
    except ImportError:
        from backend.services.firebase import firebase_service
    return firebase_service.get_agent_states(session_id)

@router.post("/jobs/search")
async def start_job_search(request: JobSearchRequest):
    orchestrator = MultiAgentOrchestrator(request.session_id)
    job_agent = JobAgent(request.session_id)
    orchestrator.register_agent(job_agent)
    
    context = {
        "keywords": request.keywords,
        "location": request.location
    }
    
    result = await orchestrator.execute_agent_with_retry("job", context)
    return {"session_id": request.session_id, "result": result}

@router.post("/resume/tailor")
async def tailor_resume(request: ResumeTailorRequest):
    orchestrator = MultiAgentOrchestrator(request.session_id)
    resume_agent = ResumeAgent(request.session_id)
    orchestrator.register_agent(resume_agent)
    
    context = {
        "job_description": request.job_description,
        "resume_text": request.resume_text
    }
    
    result = await orchestrator.execute_agent_with_retry("resume", context)
    return {"session_id": request.session_id, "result": result}

@router.post("/contract/analyze")
async def analyze_contract(request: ContractAnalyzeRequest):
    orchestrator = MultiAgentOrchestrator(request.session_id)
    contract_agent = ContractAgent(request.session_id)
    orchestrator.register_agent(contract_agent)
    
    context = {
        "contract_text": request.contract_text,
        "base_salary_usd": request.base_salary_usd
    }
    
    result = await orchestrator.execute_agent_with_retry("contract", context)
    return {"session_id": request.session_id, "result": result}

@router.post("/linkedin/outreach")
async def prepare_linkedin_outreach(request: LinkedInDMRequest):
    orchestrator = MultiAgentOrchestrator(request.session_id)
    linkedin_agent = LinkedinAgent(request.session_id)
    orchestrator.register_agent(linkedin_agent)
    
    context = {
        "recruiter_name": request.recruiter_name,
        "company_name": request.company_name,
        "job_title": request.job_title
    }
    
    result = await orchestrator.execute_agent_with_retry("linkedin", context)
    return {"session_id": request.session_id, "result": result}

@router.post("/portfolio/github")
async def get_github_repos(request: GitHubReposRequest):
    """
    Fetch GitHub repositories for a given username using GitHub token.
    """
    try:
        repos = await portfolio_showcase_service.get_github_repos(request.github_username)
        
        if repos is None:
            return {
                "github_username": request.github_username,
                "repos": [],
                "status": "failed",
                "message": "GitHub token not configured or API call failed"
            }
        
        # Format repos to include only relevant info
        formatted_repos = []
        for repo in repos[:10]:  # Limit to 10 most recent repos
            formatted_repos.append({
                "name": repo.get("name"),
                "description": repo.get("description"),
                "language": repo.get("language"),
                "stars": repo.get("stargazers_count"),
                "forks": repo.get("forks_count"),
                "url": repo.get("html_url"),
                "updated_at": repo.get("updated_at")
            })
        
        return {
            "github_username": request.github_username,
            "repos": formatted_repos,
            "status": "success",
            "total_count": len(repos)
        }
    except Exception as e:
        logger.error(f"Error fetching GitHub repos: {str(e)}", 
                    extra={"agent_type": "api", "error": str(e)})
        raise HTTPException(status_code=500, detail="Failed to fetch GitHub repositories")

@router.get("/agents/states")
async def get_agent_states(session_id: str):
    """Mock endpoint for agent states to prevent errors"""
    return []

@router.post("/resume/parse")
async def parse_resume_for_profile(request: ParseResumeRequest):
    """
    Parse resume text to extract profile information (name, email, skills, etc.)
    using AI.
    """
    try:
        logger.info(
            "Parsing resume for profile",
            extra={"agent_type": "api", "user_id": request.user_id, "resume_length": len(request.resume_text)}
        )

        profile = await profile_builder_service.analyze_resume_for_profile(
            resume_text=request.resume_text,
            user_id=request.user_id
        )

        # Return the relevant fields for frontend form filling
        return {
            "full_name": profile.name,
            "email": profile.email,
            "location": profile.location,
            "phone": None,  # Not extracted yet, could add later
            "linkedInUrl": None,
            "gitHubUrl": None,
            "timezone": profile.timezone,
            "current_title": profile.current_title,
            "years_experience": profile.years_experience,
            "skills": profile.skills,
            "industries": profile.industries
        }
    except Exception as e:
        logger.error(f"Error parsing resume: {str(e)}", 
                    extra={"agent_type": "api", "error": str(e)})
        raise HTTPException(status_code=500, detail="Failed to parse resume")
