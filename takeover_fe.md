# JobJockey Frontend Handover Document (`takeover_fe.md`)

## 🤖 Agent Welcome
Welcome, Frontend Agent! You are taking over the **Frontend Implementation** for the JobJockey platform.

**Your primary mandate is to read and strictly adhere to `AGENTS.md` and `DESIGN.md` before writing any code.**

JobJockey is a specialized, AI-powered job application system built to bridge the gap between Nigerian professionals and the global job market. Our design philosophy focuses on SRE-driven reliability, minimalist but maximalist UI/UX, and strict structural consistency.

---

## 📍 Current State

### Backend Status
- **Phase 1 (Scaffolding):** ✅ Completed.
- **Phase 2 (Agent Reasoning & API):** ✅ Completed. All backend agents and API endpoints are implemented.
- **Phase 4 (Cloud Run Deployment):** ✅ Completed. The backend is configured for Cloud Run deployment.
- **Phase 5 (Testing & Quality Assurance):** ✅ Completed (Backend only, Performance Testing out of scope for automated execution). Backend unit and integration tests are in place.
- **Phase 6 (Nigeria-Specific Features - Backend):** ✅ Completed. All backend logic for Nigeria-specific features (Time Zone Navigation, Visa Sponsorship Tracker, Currency Intelligence, Portfolio Showcase, Interview Preparation) has been implemented.

### Backend API Status
- **Gemini AI Integration:** ✅ Completed. All LLM interactions now use the Gemini API (using `google-genai` SDK).
- **All backend progress has been committed and pushed to the `feature/backend-phase2` branch.**

---

## 🎯 Your Immediate Scope & Objectives

Your goal is to implement the frontend UI and integrate with the existing backend API, focusing on **Phase 3: UI Component Library & Frontend Wiring** and the remaining tasks in **Phase 4: Cloud Run Deployment & "Magic Moment" Polish** and **Phase 5: Testing & Quality Assurance** as defined in `.kiro/specs/jobjockey-implementation/tasks.md`.

### 1. Phase 3: UI Component Library & Frontend Wiring
*Reference: `tasks.md` -> Task 3.1, 3.2, 3.3, 3.4*
- [ ] **3.1.1 Create reusable UI components:** Develop a foundational set of React UI components adhering to `DESIGN.md`.
- [ ] **3.1.2 Implement terminal-style animated progress indicators:** Create interactive visualizers for agent actions.
- [ ] **3.1.3 Create agent status components:** Display real-time status and logs from backend agents.
- [ ] **3.1.4 Implement responsive design:** Ensure the UI is fully responsive across various devices.

- [ ] **3.2.1 Implement real-time agent progress tracking:** Connect frontend to backend for live updates on agent operations.
- [ ] **3.2.2 Add job search initiation:** Create UI for users to start job search via the JobAgent.
- [ ] **3.2.3 Create application dashboard:** Develop the main dashboard for users to manage applications.
- [ ] **3.2.4 Implement job selection:** Allow users to select jobs for further processing.

- [ ] **3.3.1 Implement swipe gesture UI:** Develop the Tinder-for-Jobs UI with swipe functionality.
- [ ] **3.3.2 Add job card components:** Design and implement interactive job cards.
- [ ] **3.3.3 Create application workflow:** Integrate the swipe UI with the application submission flow.
- [ ] **3.3.4 Implement job filtering:** Add UI controls for filtering job listings.

- [ ] **3.4.1 Create main dashboard layout:** Design the overall layout for the user dashboard.
- [ ] **3.4.2 Implement application overview:** Display a summary of user applications.
- [ ] **3.4.3 Add agent status display:** Show the status of various agents (Job, Resume, etc.).
- [ ] **3.4.4 Create next steps section:** Guide users on what to do next.

### 2. Phase 4: Cloud Run Deployment & "Magic Moment" Polish
*Reference: `tasks.md` -> Task 4.2, 4.3, 4.4*
- [ ] **4.2.1 Configure Firebase Hosting:** Set up Firebase for frontend deployment.
- [ ] **4.2.2 Set up build process:** Configure the build process for the React application.
- [ ] **4.2.3 Deploy to Firebase Hosting:** Deploy the frontend to Firebase Hosting.
- [ ] **4.2.4 Configure custom domain:** Set up a custom domain for the frontend.

- [ ] **4.3.1 Add animations and transitions:** Enhance UX with subtle animations.
- [ ] **4.3.2 Implement dark mode:** Provide a dark theme option for the UI.
- [ ] **4.3.3 Add keyboard shortcuts:** Improve accessibility and power-user experience.
- [ ] **4.3.4 Create onboarding flow:** Develop a guided onboarding experience for new users.

- [ ] **4.4.1 Write API documentation:** Document the frontend's interaction with the backend API.
- [ ] **4.4.2 Create user guide:** Develop comprehensive user documentation.
- [ ] **4.4.3 Document agent workflows:** Explain how frontend interacts with backend agent processes.
- [ ] **4.4.4 Add code comments:** Ensure frontend codebase is well-commented.

### 3. Phase 5: Testing & Quality Assurance
*Reference: `tasks.md` -> Task 5.1, 5.3*
- [ ] **5.1.3 Test UI components:** Write unit tests for all reusable UI components.
- [ ] **5.1.4 Achieve >80% code coverage:** Ensure comprehensive test coverage for frontend code (Backend coverage achieved, Frontend pending).

- [ ] **5.3.1 Test job search performance:** Evaluate frontend performance for job search.
- [ ] **5.3.2 Test resume tailoring performance:** Test performance of resume tailoring UI.
- [ ] **5.3.3 Test contract analysis performance:** Assess performance of contract analysis display.
- [ ] **5.3.4 Optimize slow endpoints:** Work with backend team to optimize any slow API calls affecting frontend. (Note: Backend performance testing is out of scope for automated execution in this phase).

---

## 🔌 Backend API Integration Guide

### API Base URL
```
http://localhost:8000/api/v1
```
Configure via `VITE_API_URL` in `.env` file.

### Available Endpoints

#### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login with Firebase token |
| POST | `/auth/logout` | Logout |

#### Job Search
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/jobs/search` | Start autonomous job search |

**Request Body:**
```json
{
  "session_id": "unique-session-id",
  "keywords": "Software Engineer",
  "location": "Remote"
}
```

**Response:**
```json
{
  "session_id": "unique-session-id",
  "result": {
    "status": "success",
    "data": [...]
  }
}
```

#### Resume Tailoring
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/resume/tailor` | Tailor resume for a specific job |

**Request Body:**
```json
{
  "session_id": "unique-session-id",
  "job_description": "Job description text...",
  "resume_text": "User's resume text..."
}
```

**Response:**
```json
{
  "session_id": "unique-session-id",
  "result": {
    "tailored_output": {...},
    "nigeria_context_adapted": true,
    "status": "success"
  }
}
```

#### Contract Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/contract/analyze` | Analyze employment contract |

**Request Body:**
```json
{
  "session_id": "unique-session-id",
  "contract_text": "Contract text...",
  "base_salary_usd": 80000
}
```

**Response:**
```json
{
  "session_id": "unique-session-id",
  "result": {...}
}
```

#### LinkedIn Outreach
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/linkedin/outreach` | Prepare LinkedIn outreach messages |

**Request Body:**
```json
{
  "session_id": "unique-session-id",
  "recruiter_name": "John Doe",
  "company_name": "Tech Company",
  "job_title": "Software Engineer"
}
```

**Response:**
```json
{
  "session_id": "unique-session-id",
  "result": {...}
}
```

### Agent Types
The backend supports the following agent types:
- `job` - Job Agent (fetches and filters job listings)
- `resume` - Resume Agent (tails and optimizes resumes)
- `contract` - Contract Agent (analyzes employment contracts)
- `linkedin` - LinkedIn Agent (manages LinkedIn outreach)
- `orchestrator` - Multi-Agent Orchestrator

### Agent State Structure
```typescript
interface AgentState {
  sessionId: string;
  agentType: 'job' | 'resume' | 'contract' | 'linkedin' | 'orchestrator';
  status: 'queued' | 'running' | 'completed' | 'failed';
  progress: number; // 0-100
  result?: Record<string, any>;
  error?: string;
  startedAt?: string;
  completedAt?: string;
}
```

### Job Data Structure
```typescript
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryMin?: number; // USD
  salaryMax?: number; // USD
  salaryMinNgn?: number; // NGN equivalent
  salaryMaxNgn?: number; // NGN equivalent
  salaryDisplay?: string; // Formatted display string
  description: string;
  requirements: string[];
  url: string;
  postedAt: string;
  timeZone: string; // WAT compatibility
  visaSponsorship: boolean;
  remote: boolean;
  source: string; // Firecrawl, Indeed, etc.
}
```

---

## 🛑 Strict Guardrails & Rules (From `AGENTS.md` and `DESIGN.md`)

1.  **UI/UX Design System Enforcement**: Strictly adhere to `DESIGN.md` for all visual elements (colors, typography, spacing, component styles).
2.  **Boundary Discipline**: Do NOT attempt to modify `backend/` files.
3.  **SRE-driven UI**: Ensure frontend components can display structured JSON logs and real-time process updates in the SRE Terminal panes (deep space midnight background, green-glowing `Space Mono` typography).
4.  **Nigeria Context**: Implement UI elements that properly display USD/NGN currency conversions and WAT timezone information using the backend utilities.
5.  **State Management**: Integrate with the backend's Firestore state persistence for agent progress and results.
6.  **Backend API**: All backend LLM interactions now use the Gemini API.

---

## 🚀 How to Start

1.  Checkout the `main` or `feature/frontend-phase3` branch (whichever is designated for frontend development).
2.  Install frontend dependencies: `pnpm install` (project uses pnpm).
3.  Review the existing `frontend/src` directory structure.
4.  Familiarize yourself with `DESIGN.md`.
5.  Begin executing the tasks defined in **"Your Immediate Scope"** above, focusing on Phase 3.

### Quick Start Commands
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Environment Variables
Copy `.env.example` to `.env` and configure:
```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
```

---

Good luck, Agent! Build a beautiful and performant bridge.