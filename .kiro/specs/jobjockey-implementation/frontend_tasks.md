# JobJockey Frontend Implementation Plan (Phase 3 Detailed Breakdown)

This document breaks down the frontend tasks of Phase 3 for **FE Dev 1** and **FE Dev 2** with strict file ownership boundaries, setup instructions, and agentic guidelines to ensure parallel feature development without merge conflicts.

---

## 1. Setup Instructions (Shared)

Before starting development, both frontend developers must prepare their environments:

1. **Install Dependencies**:
   ```bash
   cd frontend
   pnpm install
   ```
2. **Start Local Development Server**:
   ```bash
   pnpm dev
   ```
3. **Environment Configuration**:
   Create a `.env.local` file inside the `frontend/` directory:
   ```env
   VITE_API_URL=http://localhost:8000/api/v1
   ```

---

## 2. Developer Breakdown & Strict File Ownership

### 2.1 Frontend Developer 1 (FE Dev 1) - Layout, Dashboard, and Swipe Mode UI
**Primary Goal**: Create the visual layout framework, core statistics dashboard metrics, interactive swipe-mode mechanics, and settings pages.

* **File Ownership Boundaries**:
  * `frontend/src/pages/Dashboard.tsx` (Task 3.4)
  * `frontend/src/pages/SwipeMode.tsx` (Task 3.3)
  * `frontend/src/pages/Settings.tsx` (Target configurations)
  * `frontend/src/components/layout/*` (Sidebar, Navbar, main containers)
  * `frontend/src/components/jobs/*` (Job cards, Swipe card swipers)
  * `frontend/src/components/ui/*` (Button, Input, Modal primitives)
  * `frontend/src/main.tsx` (Main router mounting)

* **Agentic Instructions**:
  * **Layout Framework**: Construct a responsive screen container housing a left-side persistent terminal-style Sidebar navigation inside `src/components/layout/`.
  * **Dashboard UI**: In `Dashboard.tsx`, render main metrics cards (e.g., matching rates, application funnels) and list the user's ongoing applications.
  * **Swipe Mode UI**: Build `SwipeMode.tsx` incorporating a swipe-gesture card stack. Ensure each card beautifully displays both USD and calculated NGN currency equivalents alongside WAT shift-compatibility alerts.
  * **Boundary Guard**: Do NOT write any code under `src/components/agents/` or modify `src/hooks/useAgents.ts`. Use mock agent progress states to render placeholder visuals.

---

### 2.2 Frontend Developer 2 (FE Dev 2) - Agent Terminal, Auto Mode, Integration
**Primary Goal**: Implement the high-impact "Live Terminal UI", real-time progress monitors, agent console logs, and backend API hook connections.

* **File Ownership Boundaries**:
  * `frontend/src/pages/AutoMode.tsx` (Task 3.2)
  * `frontend/src/components/agents/*` (TerminalConsole, AgentStatusPanel, ProgressMeter)
  * `frontend/src/hooks/useAgents.ts` (API status polling hook)
  * `frontend/src/services/api.ts` (FastAPI fetch client)
  * `frontend/src/services/auth.ts` (Authentication connector)

* **Agentic Instructions**:
  * **Live Terminal UI**: In `AutoMode.tsx`, render a terminal console container. Create a `TerminalConsole.tsx` component that processes a stream of execution messages (e.g., `[JobAgent] WAT timezone overlap calculated...`) with styling inspired by terminal interfaces.
  * **Agent Status Tracking**: Create progress gauges or steps (`ProgressMeter.tsx`) demonstrating active agent execution (queued, running, completed, failed) with matching color states.
  * **State Polling Hook**: Connect `useAgents.ts` to poll backend agent execution APIs. Keep UI elements updated with actual progress percentages.
  * **Boundary Guard**: Do NOT modify sidebar navigation, main layouts, or files under `src/components/jobs/`. Keep all work localized within your owned folders.

---

## 3. Merging & Verification Protocol
1. **Routing Merges**: `FE Dev 1` defines routes in `main.tsx` and imports the `AutoMode` page file directly.
2. **Standard Review**: Run `python ProjectLinter.py` locally before committing to verify files and patterns conform to system standards.
