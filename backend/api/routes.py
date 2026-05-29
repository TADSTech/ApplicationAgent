# backend/api/routes.py
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from backend.models.job import Job
from backend.models.user import User
from backend.models.application import Application
from backend.agents.orchestrator import MultiAgentOrchestrator
from backend.agents.job_agent import JobAgent
from backend.agents.resume_agent import ResumeAgent
from backend.agents.contract_agent import ContractAgent
from backend.agents.linkedin_agent import LinkedinAgent

router = APIRouter()

@router.post("/auth/login")
async def login():
    return {"message": "Successful login with Firebase token", "token": "mock-firebase-jwt"}

@router.post("/auth/logout")
async def logout():
    return {"message": "Logged out successfully"}

@router.get("/jobs", response_model=List[Dict[str, Any]])
async def get_jobs():
    # Return placeholder jobs formatted with WAT alignment and currency conversion
    return [
        {
            "id": "job-1",
            "title": "Senior React Developer",
            "company": "GlobalTech US",
            "location": "Remote, USA",
            "salary_display": "$90,000 / yr (~₦139,500,000 NGN)",
            "wat_working_hours": "18:00 - 02:00 WAT",
            "is_late_night_wat_shift": True,
            "visa_sponsorship": True,
            "remote": True,
        }
    ]

@router.post("/jobs/start")
async def start_job_search(session_id: str):
    orchestrator = MultiAgentOrchestrator(session_id)
    job_agent = JobAgent(session_id)
    orchestrator.register_agent(job_agent)
    
    result = await orchestrator.execute_agent_with_retry("job", {"jobs": []})
    return {"session_id": session_id, "orchestrator_result": result}

@router.post("/resume/tailor")
async def tailor_resume(session_id: str, job_id: str, resume_text: str):
    orchestrator = MultiAgentOrchestrator(session_id)
    resume_agent = ResumeAgent(session_id)
    orchestrator.register_agent(resume_agent)
    
    result = await orchestrator.execute_agent_with_retry("resume", {"job_id": job_id, "resume_text": resume_text})
    return {"session_id": session_id, "result": result}

@router.post("/contract/analyze")
async def analyze_contract(session_id: str, contract_text: str):
    orchestrator = MultiAgentOrchestrator(session_id)
    contract_agent = ContractAgent(session_id)
    orchestrator.register_agent(contract_agent)
    
    result = await orchestrator.execute_agent_with_retry("contract", {"contract_text": contract_text})
    return {"session_id": session_id, "result": result}

@router.post("/linkedin/dm")
async def send_linkedin_dm(session_id: str, recruiter_name: str, company_name: str):
    orchestrator = MultiAgentOrchestrator(session_id)
    linkedin_agent = LinkedinAgent(session_id)
    orchestrator.register_agent(linkedin_agent)
    
    result = await orchestrator.execute_agent_with_retry("linkedin", {"recruiter_name": recruiter_name, "company_name": company_name})
    return {"session_id": session_id, "result": result}
