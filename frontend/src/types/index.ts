// frontend/src/types/index.ts

export interface UserProfile {
  phone?: string;
  location: string;
  timezone: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

export interface UserPreferences {
  targetRoles: string[];
  targetSalaryMin?: number;
  preferredLocations: string[];
  sponsorshipRequired: boolean;
  remoteOnly: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  profile: UserProfile;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryMinNgn?: number;
  salaryMaxNgn?: number;
  salaryDisplay?: string;
  description: string;
  requirements: string[];
  url: string;
  postedAt: string;
  timeZone: string;
  visaSponsorship: boolean;
  remote: boolean;
  source: string;
}

export interface ApplicationNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  job: Job;
  status: 'applied' | 'in_progress' | 'interview' | 'offer' | 'rejected';
  resumeVersion: string;
  appliedAt: string;
  updatedAt: string;
  agentStatus: Record<string, string>;
  notes: ApplicationNote[];
}

export interface AgentState {
  sessionId: string;
  agentType: 'job' | 'resume' | 'contract' | 'linkedin' | 'orchestrator';
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
  result?: Record<string, any>;
  error?: string;
  startedAt?: string;
  completedAt?: string;
}
