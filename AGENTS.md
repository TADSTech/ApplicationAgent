# JobJockey Multi-Agent Guidelines & Coordination Rules

Welcome, Agent! This document is the absolute source of truth and coordination manual for all autonomous agents developing, maintaining, or operating within the **JobJockey** platform.

JobJockey is a specialized, AI-powered job application system built to bridge the gap between **Nigerian professionals** and the **global job market** (remote, relocation, and visa-sponsored roles). Our design philosophy focuses on SRE-driven reliability, minimalist but maximalist UI/UX, and strict structural consistency.

All agents MUST read, understand, and strictly adhere to these architectural, stylistic, and operational standards.

---

## 1. System Architecture & Context Bridge

JobJockey is structured as a two-tier system:
1. **Frontend (Vite + React + TS):** Interactive dashboards with terminal-style visualizers for agent actions, Swipe Mode, and Auto Mode tracking.
2. **Backend (FastAPI + Python):** Orchestration engine, REST API endpoints, background worker integrations, and state persistence with Firebase Firestore.

### High-Level Flow
```
                                ┌─────────────────────────┐
                                │   React Vite Frontend   │
                                └────────────┬────────────┘
                                             │ REST API / Events
                                             ▼
                                ┌─────────────────────────┐
                                │   FastAPI Backend API   │
                                └────────────┬────────────┘
                                             │ Orchestrates
                                             ▼
                                ┌─────────────────────────┐
                                │ Multi-Agent Orchestrator│
                                └────────────┬────────────┘
                    ┌────────────────────────┼────────────────────────┐
                    ▼                        ▼                        ▼
         ┌────────────────────┐   ┌────────────────────┐   ┌────────────────────┐
         │     Job Agent      │   │    Resume Agent    │   │   Contract Agent   │
         │  (Scrape & Filter) │   │ (Tailor & Analyze) │   │ (Legal Analysis)   │
         └────────────────────┘   └────────────────────┘   └────────────────────┘
                                             │
                                             ▼
                                  ┌────────────────────┐
                                  │   LinkedIn Agent   │
                                  │(Outreach Automation)│
                                  └────────────────────┘
```

---

## 2. Directory Structure Conventions

To prevent file duplication and broken imports, both frontend and backend directories must maintain the following structures. Any modifications should preserve these exact paths:

### 2.1 Backend Structure (`backend/`)
```
backend/
├── agents/
│   ├── __init__.py
│   ├── base.py              # BaseAgent abstract class
│   ├── orchestrator.py      # MultiAgentOrchestrator
│   ├── job_agent.py         # JobAgent class
│   ├── resume_agent.py      # ResumeAgent class
│   ├── contract_agent.py    # ContractAgent class
│   └── linkedin_agent.py    # LinkedInAgent class
├── api/
│   ├── __init__.py
│   ├── routes.py            # API routing definitions
│   └── dependencies.py      # FastAPI Depends (auth, db hooks)
├── core/
│   ├── __init__.py
│   ├── config.py            # Settings and secret manager loading
│   ├── state.py             # Global State variables
│   └── logging.py           # JSON logger formatter setup
├── models/
│   ├── __init__.py
│   ├── job.py               # Pydantic schema for Jobs
│   ├── resume.py            # Pydantic schema for Resumes
│   ├── application.py       # Pydantic schema for Applications
│   └── user.py              # Pydantic schema for Users
├── services/
│   ├── __init__.py
│   ├── firecrawl.py         # Job scraping wrapper
│   ├── openai.py            # OpenAI / LLM call clients
│   └── linkedin.py          # LinkedIn API client integration
├── utils/
│   ├── __init__.py
│   ├── currency.py          # Currency converter (USD <-> NGN)
│   └── timezones.py         # WAT Timezone calculations (WAT is UTC+1)
├── main.py                  # Entry point
├── requirements.txt
└── Dockerfile
```

### 2.2 Frontend Structure (`frontend/`)
```
frontend/
├── src/
│   ├── components/
│   │   ├── agents/          # Agent terminal panels & status components
│   │   ├── jobs/            # Job cards & Swipe lists
│   │   ├── ui/              # Button, Input, Modal (radix-ui/shadcn equivalents)
│   │   └── layout/          # Navbar, Sidebar, Page containers
│   ├── pages/
│   │   ├── AutoMode.tsx     # Animated autonomous dashboard
│   │   ├── SwipeMode.tsx    # Tinder-for-Jobs UI
│   │   ├── Dashboard.tsx    # User's personal application center
│   │   └── Settings.tsx     # Context setups (Target salary, location, timezone)
│   ├── services/
│   │   ├── api.ts           # Axios / fetch client wrapped
│   │   └── auth.ts          # Firebase Authentication client
│   ├── hooks/
│   │   └── useAgents.ts     # Hook to poll and update agent status
│   ├── types/
│   │   └── index.ts         # Global interface definitions
│   └── main.tsx
```

---

## 3. Agent Implementation Standards

All backend agents must inherit from `BaseAgent` and maintain standard interfaces to make orchestration seamless and predictable.

### 3.1 BaseAgent Class Definition (`backend/agents/base.py`)
```python
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel

class AgentState(BaseModel):
    session_id: str
    agent_type: str
    status: str          # "queued", "running", "completed", "failed"
    progress: float      # 0.0 to 100.0
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

class BaseAgent(ABC):
    def __init__(self, agent_type: str, session_id: str):
        self.agent_type = agent_type
        self.session_id = session_id
        self.state = AgentState(
            session_id=session_id,
            agent_type=agent_type,
            status="queued",
            progress=0.0
        )

    @abstractmethod
    async def run(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute the agent's core reasoning logic.
        MUST handle exceptions, set self.state.status and progress.
        """
        pass

    def update_progress(self, progress: float, status: str = "running"):
        self.state.progress = progress
        self.state.status = status
        # Trigger Firestore sync or state callback here
```

### 3.2 Individual Agent Responsibilities

1. **JobAgent (`job_agent.py`):**
   - Retrieves listings via Firecrawl / external scrapers.
   - Computes WAT Compatibility (evaluates remote hours against UTC+1).
   - Flags visa sponsorship and remote capabilities.
   - Calculates USD/NGN currency conversions.
   - Outputs: List of matching job objects.

2. **ResumeAgent (`resume_agent.py`):**
   - Extracts semantic skills from resumes.
   - Aligns accomplishments with international hiring keywords.
   - Performs a "Nigeria Context Adaptation" (translates local company scales or terminology into globally understood equivalents).
   - Generates skill-gap analysis report.
   - Outputs: Tailored resume PDF/text and gap report.

3. **ContractAgent (`contract_agent.py`):**
   - Parses foreign employment contracts (Relocation, B2B Contractor, or US W2 equivalents).
   - Detects intellectual property, non-competes, and termination notice clauses.
   - Focuses on visa lock-in duration or relocation reimbursement obligations.
   - Computes tax withholdings and net pay calculations for Nigerian remote contractors.
   - Outputs: Analysis report with flagged high-risk clauses.

4. **LinkedInAgent (`linkedin_agent.py`):**
   - Crafts highly personalized outreach sequence starting with connection requests.
   - Schedules engagement (recommends ideal posting and DM times adjusted to recruiter timezones relative to WAT).
   - Tracks DM responses and aggregates conversion rates.
   - Outputs: Queue of drafted outreach DMs.

---

## 4. SRE & Reliability "Golden Rules"

Since JobJockey values the "industrialization of data" and SRE principles, agents must NEVER write simple, fragile scripts. Resiliency is built in.

### Rule 4.1: Retries with Exponential Backoff
Every external call (scrapers, LLMs, Firestore, LinkedIn API) must have retry logic.
- **Initial Retry Delay:** 1 second
- **Multiplier:** 2x
- **Max Retries:** 3
- **Fallback Behavior:** If all retries fail, do not crash the orchestrator. Log a warning with structured JSON, mark the current agent state as `failed` (with a clean error string), and allow other independent agents to run if possible, or gracefully prompt the UI.

### Rule 4.2: Structured JSON Logging
Do not use raw print statements. Always use a structured formatter.
**Required Fields in Log Entries:**
- `timestamp`: UTC ISO 8601 string
- `trace_id`: Correlates the API request across the systems
- `session_id`: Correlates the job seeker's current active multi-agent pipeline
- `agent_type`: `"job"`, `"resume"`, `"contract"`, `"linkedin"`, or `"orchestrator"`
- `level`: `"INFO"`, `"WARNING"`, `"ERROR"`
- `message`: Clear textual description of the action
- `payload`: Context dict (e.g., job title being matched, API status codes)

```python
# Example log structure
logger.info(
    "Job filtering complete", 
    extra={
        "trace_id": trace_id,
        "session_id": session_id,
        "agent_type": "job",
        "payload": {"scraped_count": 42, "matched_nigeria_eligible": 5}
    }
)
```

### Rule 4.3: State Persistence & Idempotency
Each agent execution step must be idempotent. If an agent run is interrupted midway, running it again with the same `session_id` should resume or cleanly overwrite previous partial data without creating duplicates. Always save intermediate state to Firestore.

---

## 5. Nigeria-Specific Guardrails & Context Rules

JobJockey's unique bridge capability lies in its deep awareness of the Nigerian environment. All agents must enforce the following calculations and constraints:

### 5.1 Currency Intelligence Code Standards
Do not hardcode exchange rates. Maintain a base utility `backend/utils/currency.py` with an external fallback API (like ExchangeRate-API or a cache file updated hourly).
- **USD/NGN Display Requirement:** Every salary display must show both currencies:
  - Example: `$80,000 / yr (~₦124,000,000 NGN)`
  - Use comma separation for thousands.

### 5.2 Time Zone Compatibility Checking (WAT / UTC+1)
When filtering remote listings, the `JobAgent` must run a timezone overlap validation:
- Remote US East Coast (EST, UTC-5) has a 6-hour difference with Nigeria (WAT, UTC+1).
- Remote US West Coast (PST, UTC-8) has a 9-hour difference with Nigeria.
- Europe (CET/BST) has 0 to 1-hour difference.
- If a listing specifies "Must work US Pacific core hours (9 AM - 5 PM PST)", the agent must calculate that the user will be working **6 PM - 2 AM WAT**. The agent must flag this as a **Late Night WAT Shift** and ask for user preference.

### 5.3 Nigeria Context Adaptation (Resume Optimization)
The `ResumeAgent` must adapt resumes to global standards:
- **No Personal Details:** Remove typical Nigerian CV patterns such as State of Origin, Local Government Area, Religion, Marital Status, and Gender.
- **Title Adaptation:** Translate localized titles if appropriate (e.g. converting "National Youth Service Corps (NYSC) Software Engineer" into "Software Engineer Associate (Civil Service/National Program)").
- **Community Focus:** Highlight active Nigerian tech ecosystems as credibility indicators (e.g. "Tech Cabal Community", "AltSchool Africa", "Ingressive for Good", "Andela", "NIGUG").

---

## 6. Linter Verification & Pre-Push Hook

Before writing code or finalizing a PR, run the local project linter to verify file placements, class inheritances, SRE compliance, and formatting conventions.

To run the linter locally:
```bash
python ProjectLinter.py
```

### Git Integration (Pre-Push Enforcement)
To guarantee consistency across all developers and agents, the linter is configured as a Git `pre-push` hook. Every time a push is initiated, `ProjectLinter.py` is invoked. If any architectural conventions, file positions, SRE compliance rules, or Nigeria context requirements are violated, the push is aborted.

You can verify that the hook is active or install it by writing to `.git/hooks/pre-push`.

Stay aligned, Agent. Let's build a resilient job bridge!
