import { Job, AgentState } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const DEFAULT_TIMEOUT = 15000;
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken(): string | null {
  return authToken;
}

class ApiError extends Error {
  status: number;
  payload: any;

  constructor(message: string, status: number, payload?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  retries = MAX_RETRIES,
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new ApiError(
          body.detail || `Request failed with status ${res.status}`,
          res.status,
          body,
        );
      }

      return res.json() as Promise<T>;
    } catch (err) {
      clearTimeout(timeoutId);

      if (attempt < retries) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
        await sleep(delay);
        continue;
      }

      if (err instanceof ApiError) throw err;
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new ApiError('Request timed out', 408);
      }
      throw new ApiError((err as Error).message || 'Unknown error', 0);
    }
  }

  throw new ApiError('Max retries exceeded', 0);
}

export const apiClient = {
  // ── Auth ──────────────────────────────────────────────────
  async login(firebaseToken: string): Promise<{ token: string; user: any }> {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ firebase_token: firebaseToken }),
    });
  },

  async logout(): Promise<void> {
    return request('/auth/logout', { method: 'POST' });
  },

  // ── Jobs ───────────────────────────────────────────────────
  async getJobs(): Promise<Job[]> {
    return request('/jobs');
  },

  async startJobSearch(
    sessionId: string,
    keywords: string,
    location: string = 'Remote',
  ): Promise<{ session_id: string; result: { status: string; data: Job[] } }> {
    return request('/jobs/search', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId, keywords, location }),
    });
  },

  // ── Agents ─────────────────────────────────────────────────
  async getAgentStates(sessionId: string): Promise<AgentState[]> {
    return request(`/agents/states?session_id=${encodeURIComponent(sessionId)}`);
  },

  // ── Resume ─────────────────────────────────────────────────
  async tailorResume(
    sessionId: string,
    jobDescription: string,
    resumeText: string,
  ): Promise<{
    session_id: string;
    result: { tailored_output: any; nigeria_context_adapted: boolean; status: string };
  }> {
    return request('/resume/tailor', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId, job_description: jobDescription, resume_text: resumeText }),
    });
  },

  // ── Contract ───────────────────────────────────────────────
  async analyzeContract(
    sessionId: string,
    contractText: string,
    baseSalaryUsd: number = 0,
  ): Promise<{ session_id: string; result: any }> {
    return request('/contract/analyze', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId, contract_text: contractText, base_salary_usd: baseSalaryUsd }),
    });
  },

  // ── LinkedIn ───────────────────────────────────────────────
  async linkedinOutreach(
    sessionId: string,
    recruiterName: string,
    companyName: string,
    jobTitle: string,
  ): Promise<{ session_id: string; result: any }> {
    return request('/linkedin/outreach', {
      method: 'POST',
      body: JSON.stringify({
        session_id: sessionId,
        recruiter_name: recruiterName,
        company_name: companyName,
        job_title: jobTitle,
      }),
    });
  },
};

export { ApiError };
export default apiClient;
