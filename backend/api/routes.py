# backend/api/routes.py
from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from backend.models.job import Job
from backend.agents.orchestrator import MultiAgentOrchestrator
from backend.agents.job_agent import JobAgent
from backend.agents.resume_agent import ResumeAgent
from backend.agents.contract_agent import ContractAgent
from backend.agents.linkedin_agent import LinkedinAgent
from backend.api.dependencies import verify_firebase_token
from backend.core.logging import logger

router = APIRouter()

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

@router.post("/auth/login")
async def login(auth_data: Dict[str, Any] = Depends(verify_firebase_token)):
    return {"message": "Successful login with Firebase token", "user": auth_data}

@router.post("/auth/logout")
async def logout():
    return {"message": "Logged out successfully"}

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
