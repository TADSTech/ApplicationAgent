# Design Document

## Introduction

JobJockey is an AI-powered job application platform featuring autonomous multi-agent reasoning (fetching jobs, tailoring resumes, analyzing legal contracts, and automating LinkedIn outreach) with a "minimalist but maximalist" UI/UX. This 24-hour hackathon project emphasizes Site Reliability Engineering (SRE), scalable infrastructure, and the "industrialization of data" even within an MVP scope. The system must be modular, resilient, and ready for production deployment.

### Unique Selling Proposition (USP)

**Nigeria-to-Global Job Bridge:** JobJockey specializes in helping Nigerian professionals secure international jobs by combining:
- **Nigeria-First Job Curation:** Prioritizing companies that actively hire Nigerian talent (remote, visa-sponsored, or relocation roles)
- **LinkedIn Automation Suite:** AI-powered DM drafting, connection request optimization, and engagement tracking
- **Nigerian Context Awareness:** Understanding local challenges (time zone differences, currency conversion, visa requirements) and providing tailored guidance
- **"Apply & Follow-Up" Automation:** Auto-apply to jobs with tailored resumes + AI-generated follow-up messages to hiring managers
- **Legal Contract Analysis:** Help Nigerians understand international employment contracts, including visa sponsorship terms, equity grants, and relocation packages

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              User Interface (Vite/React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Auto Mode   │  │ Swipe Mode   │  │  Dashboard   │  │  Settings    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Backend API (FastAPI)                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  /api/v1/jobs/start          /api/v1/resume/tailor                   │   │
│  │  /api/v1/linkedin/connect    /api/v1/contract/analyze                │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Multi-Agent Orchestrator                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Job Agent  │  │ Resume Agent │  │Contract Agent│  │LinkedIn Agent│    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          External Services & AI                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Firecrawl   │  │  OpenAI/     │  │  Firebase    │  │  LinkedIn    │    │
│  │  /Indeed     │  │  VertexAI    │  │  Firestore   │  │  API         │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component Breakdown

#### Frontend (Vite + React + TypeScript)

**Directory Structure:**
```
frontend/
├── src/
│   ├── components/
│   │   ├── agents/          # Agent status components
│   │   ├── jobs/            # Job listing components
│   │   ├── ui/              # Reusable UI components
│   │   └── layout/          # Layout components
│   ├── pages/
│   │   ├── AutoMode.tsx     # Autonomous job application mode
│   │   ├── SwipeMode.tsx    # Manual job application mode
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   └── Settings.tsx     # User settings
│   ├── services/
│   │   ├── api.ts           # API client
│   │   └── auth.ts          # Firebase auth
│   ├── hooks/
│   │   └── useAgents.ts     # Agent state management
│   ├── types/
│   │   └── index.ts         # TypeScript types
│   └── main.tsx
├── public/
└── vite.config.ts
```

**Key Features:**
- **Auto Mode:** Real-time agent progress tracking with animated terminal-style UI
- **Swipe Mode:** Manual job application with swipe gestures
- **Dashboard:** Overview of all applications, agent status, and next steps
- **Live Terminal UI:** Minimalist but maximalist aesthetic with animated progress indicators

#### Backend (Python + FastAPI)

**Directory Structure:**
```
backend/
├── agents/
│   ├── __init__.py
│   ├── base.py              # Base agent class
│   ├── orchestrator.py      # Multi-agent orchestrator
│   ├── job_agent.py         # Job fetching and filtering
│   ├── resume_agent.py      # Resume tailoring
│   ├── contract_agent.py    # Contract analysis
│   └── linkedin_agent.py    # LinkedIn automation
├── api/
│   ├── __init__.py
│   ├── routes.py            # API routes
│   └── dependencies.py      # Dependencies (auth, db)
├── core/
│   ├── __init__.py
│   ├── config.py            # Configuration
│   ├── state.py             # State management
│   └── logging.py           # Logging setup
├── models/
│   ├── __init__.py
│   ├── job.py               # Job model
│   ├── resume.py            # Resume model
│   ├── application.py       # Application model
│   └── user.py              # User model
├── services/
│   ├── __init__.py
│   ├── firecrawl.py         # Firecrawl integration
│   ├── openai.py            # OpenAI/LLM integration
│   └── linkedin.py          # LinkedIn API integration
├── utils/
│   ├── __init__.py
│   ├── currency.py          # Currency conversion
│   └── timezones.py         # Timezone utilities
├── main.py                  # FastAPI app entry point
├── requirements.txt
└── Dockerfile
```

**Key Components:**

1. **Orchestrator (`agents/orchestrator.py`):**
   - Manages multiple agents concurrently
   - Handles agent state persistence in Firestore
   - Coordinates agent execution order
   - Implements retry logic with exponential backoff

2. **Job Agent (`agents/job_agent.py`):**
   - Fetches jobs from multiple sources (Firecrawl, Indeed, LinkedIn)
   - Filters jobs based on Nigeria-specific criteria
   - Converts salaries to USD/NGN
   - Tracks time zone compatibility

3. **Resume Agent (`agents/resume_agent.py`):**
   - Analyzes job descriptions
   - Tailors resumes using LLM
   - Highlights Nigeria-relevant experience
   - Suggests skill gaps

4. **Contract Agent (`agents/contract_agent.py`):**
   - Parses employment contracts
   - Identifies visa sponsorship terms
   - Explains tax implications for Nigerians
   - Flags problematic clauses

5. **LinkedIn Agent (`agents/linkedin_agent.py`):**
   - Manages LinkedIn connections
   - Drafts personalized DMs
   - Tracks engagement metrics
   - Optimizes outreach timing

#### Infrastructure

**Docker Configuration:**
- Multi-stage builds for optimized images
- Cloud Run optimized (scale-to-zero)
- Environment-specific configuration

**Deployment:**
- Google Cloud Run for backend services
- Firebase Hosting for frontend
- Firestore for state management
- Cloud Build for CI/CD

## Data Models

### User Model
```python
class User(BaseModel):
    id: str
    email: str
    name: str
    profile: UserProfile
    preferences: UserPreferences
    created_at: datetime
    updated_at: datetime
```

### Job Model
```python
class Job(BaseModel):
    id: str
    title: str
    company: str
    location: str
    salary_min: Optional[float]  # USD
    salary_max: Optional[float]  # USD
    salary_min_ngn: Optional[float]  # NGN equivalent
    salary_max_ngn: Optional[float]  # NGN equivalent
    description: str
    requirements: List[str]
    url: str
    posted_at: datetime
    time_zone: str  # WAT compatibility
    visa_sponsorship: bool
    remote: bool
    source: str  # Firecrawl, Indeed, etc.
```

### Application Model
```python
class Application(BaseModel):
    id: str
    user_id: str
    job_id: str
    job: Job  # Snapshot of job at application time
    status: str  # applied, in_progress, interview, offer, rejected
    resume_version: str  # Which resume was used
    applied_at: datetime
    updated_at: datetime
    agent_status: Dict[str, str]  # Agent progress tracking
    notes: List[ApplicationNote]
```

### Agent State Model
```python
class AgentState(BaseModel):
    session_id: str
    agent_type: str
    status: str  # queued, running, completed, failed
    progress: float  # 0-100
    result: Optional[Dict[str, Any]]
    error: Optional[str]
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Login with Firebase token
- `POST /api/v1/auth/logout` - Logout

### Jobs
- `GET /api/v1/jobs` - List jobs with filters
- `POST /api/v1/jobs/start` - Start autonomous job search
- `GET /api/v1/jobs/{job_id}` - Get job details

### Resume
- `POST /api/v1/resume/tailor` - Tailor resume for a job
- `GET /api/v1/resume/versions` - List resume versions
- `POST /api/v1/resume/upload` - Upload new resume

### LinkedIn
- `POST /api/v1/linkedin/connect` - Connect LinkedIn account
- `POST /api/v1/linkedin/dm` - Send DM to hiring manager
- `GET /api/v1/linkedin/connections` - List connections

### Contract
- `POST /api/v1/contract/analyze` - Analyze employment contract
- `GET /api/v1/contract/{contract_id}` - Get analysis results

## Agent Workflow

### Job Search Workflow
```
1. User initiates job search
   ↓
2. Job Agent fetches jobs from multiple sources
   ↓
3. Jobs are filtered based on Nigeria-specific criteria
   ↓
4. Jobs are stored in Firestore with USD/NGN salaries
   ↓
5. User can select jobs for application
```

### Application Workflow
```
1. User selects a job
   ↓
2. Resume Agent tailors resume for the job
   ↓
3. LinkedIn Agent sends connection request to hiring manager
   ↓
4. LinkedIn Agent sends follow-up DM
   ↓
5. Application is submitted
   ↓
6. Contract Agent monitors for offer letters
   ↓
7. Contract Agent analyzes offer and provides insights
```

## Error Handling

### Agent Retry Strategy
- **Initial retry:** 1 second
- **Second retry:** 2 seconds
- **Third retry:** 4 seconds
- **Maximum retries:** 3
- **Fallback:** Notify user with error details

### Error Categories
1. **Transient errors** (network issues): Retry with backoff
2. **User errors** (invalid input): Return 400 with clear message
3. **System errors** (internal failures): Log and notify admin
4. **External API errors**: Continue with other sources

## Security

### Authentication
- Firebase Admin SDK for token validation
- JWT tokens for API authentication
- Role-based access control

### Data Protection
- Encryption at rest (Firestore)
- Encryption in transit (HTTPS)
- Sensitive data masking in logs
- API rate limiting

## Performance Targets

| Operation | Target Response Time | Max Response Time |
|-----------|---------------------|-------------------|
| Job search initiation | < 1s | 2s |
| Resume tailoring | < 30s | 60s |
| Contract analysis | < 15s | 30s |
| LinkedIn DM | < 5s | 10s |
| Dashboard load | < 2s | 5s |

## Monitoring & Observability

### Logging
- Structured JSON logs
- Trace IDs for request correlation
- Agent operation logging with timestamps

### Metrics
- Request latency
- Agent execution time
- Error rates
- System resource usage

### Alerting
- Error rate > 5% in 5 minutes
- Agent execution time > 2x expected
- System resource usage > 80%

## Deployment

### Local Development
```bash
# Start backend
cd backend
uvicorn main:app --reload --port 8000

# Start frontend
cd frontend
pnpm dev
```

### Production (Cloud Run)
```bash
# Build and deploy backend
cd backend
gcloud builds submit --config cloudbuild.yaml

# Deploy frontend
cd frontend
pnpm build
gsutil -m rsync -r dist gs://jobjockey-frontend
```

## Next Steps

1. **Phase 1:** Core scaffolding and state management
2. **Phase 2:** Agent reasoning logic & API integration
3. **Phase 3:** UI component library & frontend wiring
4. **Phase 4:** Cloud Run deployment & "Magic Moment" polish

## References

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [LangChain Documentation](https://python.langchain.com/)
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)