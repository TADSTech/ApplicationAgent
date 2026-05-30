# JobJockey Backend Handover Document (`takeover_be.md`)

## 🤖 Agent Welcome
Welcome, Agent! You are taking over the **Backend & DevOps Implementation** for the JobJockey platform on a new machine. 

**Your primary mandate is to read and strictly adhere to `AGENTS.md` before writing any code.** 

JobJockey is an SRE-driven platform bridging Nigerian professionals to the global job market. Reliability, strict JSON logging, and adherence to "Nigeria-Specific Guardrails" (WAT timezones, USD/NGN currencies) are non-negotiable.

---

## 📍 Current State
- **Phase 1 (Scaffolding):** ✅ Completed.
- **Phase 2 (Agent Reasoning & API):** ✅ Completed. The `MultiAgentOrchestrator`, `JobAgent`, `ResumeAgent`, `ContractAgent`, and `LinkedinAgent` are fully implemented with Firestore state persistence, external API integrations (Firecrawl, OpenAI), and exponential backoff retry logic.
- **Phase 5.1 (Unit Tests):** ✅ Completed. Pytest suites cover the agents, timezone overlap logic, and dual-currency formatting.
- **Frontend (Phase 3):** ⏸️ OUT OF SCOPE. This is being handled by a separate frontend team. **Do not modify `frontend/` files.**

All Phase 2 and 5.1 backend progress has been committed and pushed to the `feature/backend-phase2` branch.

---

## 🎯 Your Immediate Scope & Objectives

Your goal is to finalize backend readiness, focusing on **Integration Testing** and **Cloud Deployment Setup** as defined in `.kiro/specs/jobjockey-implementation/tasks.md` and `cloud_setup_tasks.md`.

### 1. Phase 5: Testing & Quality Assurance (Integration)
*Reference: `tasks.md` -> Task 5.2 & 5.3*
- [ ] **5.2.1 Test agent orchestration:** Ensure the orchestrator smoothly hands off state between agents and Firestore.
- [ ] **5.2.2 Test API integrations:** Use FastAPI `TestClient` to verify that `routes.py` endpoints correctly initialize agent sessions.
- [ ] **5.2.3 Test end-to-end workflows:** Simulate a full run from `JobAgent` through to `LinkedinAgent`.
- [ ] **5.2.4 Test error handling:** Ensure intentional failures trigger the Rule 4.1 retry mechanics.

### 2. Phase 4: Cloud Run Deployment Setup (Backend Only)
*Reference: `tasks.md` -> Task 4.1 & `.kiro/specs/jobjockey-implementation/cloud_setup_tasks.md`*
- [ ] **1.1 & 1.2 Firestore Database Provisioning:** Document or script the setup for the `europe-west1` Firestore Native instance and security rules.
- [ ] **2.1 & 2.2 Artifact Registry:** Document or script the creation of `jobjockey-repo` in `europe-west1`.
- [ ] **4.1.1 Create Cloud Run deployment configuration:** Refine the `backend/Dockerfile` if necessary to ensure it runs `uvicorn main:app --host 0.0.0.0 --port $PORT`.
- [ ] **3.3 Service Deployments:** Create a deployment script (`deploy_backend.sh`) wrapping the `gcloud run deploy` commands with the required secrets mounting (Secret Manager integration for `FIREBASE_CREDENTIALS`, `OPENAI_API_KEY`, etc.).

---

## 🛑 Strict Guardrails & Rules (From `AGENTS.md`)

1. **Rule 4.1 (Exponential Backoff):** Do not remove the retry logic in `orchestrator.py`.
2. **Rule 4.2 (Structured JSON Logging):** Never use `print()`. Always use `backend.core.logging.logger` with the `extra={"payload": {...}}` kwargs.
3. **Rule 4.3 (State Persistence):** Ensure any new agent logic calls `self._sync_state()` to save to Firestore.
4. **Rule 5.1 & 5.2 (Nigeria Context):** Any new mock data or tests MUST use WAT (UTC+1) timezone assumptions and include NGN currency calculations via the established utility functions.
5. **Linter Enforcement:** Before any git commit, you MUST run `python ProjectLinter.py`. If it fails, fix the architectural violation before proceeding. Do not bypass the linter.
6. **Boundary Discipline:** Do NOT attempt to implement frontend UI, swipe modes, or dashboard React components. Your scope ends at the FastAPI boundaries and GCP infrastructure.

---

## 🚀 How to Start

1. Checkout the branch: `git checkout feature/backend-phase2` (or pull the latest).
2. Create/Activate the virtual environment: `python -m venv venv && source venv/bin/activate` (or `venv\Scripts\activate` on Windows).
3. Install requirements: `pip install -r backend/requirements.txt`.
4. Read `backend/api/routes.py` and `backend/agents/orchestrator.py` to understand the current architecture.
5. Begin executing the tasks defined in **"Your Immediate Scope"** above.

Good luck, Agent! Build a resilient bridge.
