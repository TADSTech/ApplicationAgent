// frontend/src/services/api.ts
import { Job, AgentState } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = {
  async getJobs(): Promise<Job[]> {
    const res = await fetch(`${API_BASE_URL}/jobs`);
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
  },

  async startJobSearch(sessionId: string): Promise<{ session_id: string; orchestrator_result: any }> {
    const res = await fetch(`${API_BASE_URL}/jobs/start?session_id=${sessionId}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to start job search');
    return res.json();
  },

  async getAgentStates(sessionId: string): Promise<AgentState[]> {
    const res = await fetch(`${API_BASE_URL}/agents/states?session_id=${sessionId}`);
    if (!res.ok) throw new Error('Failed to fetch agent states');
    return res.json();
  },

  async tailorResume(sessionId: string, jobId: string, resumeText: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/resume/tailor?session_id=${sessionId}&job_id=${jobId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume_text: resumeText }),
    });
    if (!res.ok) throw new Error('Failed to tailor resume');
    return res.json();
  },

  async analyzeContract(sessionId: string, contractText: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/contract/analyze?session_id=${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contract_text: contractText }),
    });
    if (!res.ok) throw new Error('Failed to analyze contract');
    return res.json();
  },

  async sendLinkedInDM(sessionId: string, recruiterName: string, companyName: string): Promise<any> {
    const res = await fetch(
      `${API_BASE_URL}/linkedin/dm?session_id=${sessionId}&recruiter_name=${recruiterName}&company_name=${companyName}`,
      { method: 'POST' }
    );
    if (!res.ok) throw new Error('Failed to send LinkedIn DM');
    return res.json();
  }
};
export default apiClient;
