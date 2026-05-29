# JobJockey Backend Implementation Plan (Phase 2 Detailed Breakdown)

This document breaks down the backend tasks of Phase 2 for **BE Dev 1** and **BE Dev 2** with strict file ownership boundaries, setup instructions, and agentic guidelines to ensure parallel feature development without merge conflicts.

---

## 1. Setup Instructions (Shared)

Before starting development, both backend developers must prepare their environments:

1. **Create and Activate Virtual Environment**:
   ```bash
   cd backend
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Unix/macOS:
   source venv/bin/activate
   ```
2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
3. **Configure Environment Variables**:
   Create a `.env` file in the `backend/` directory:
   ```env
   FIRESTORE_PROJECT_ID=jobjockey-dev
   OPENAI_API_KEY=your-openai-api-key
   FIRECRAWL_API_KEY=your-firecrawl-api-key
   ```

---

## 2. Developer Breakdown & Strict File Ownership

### 2.1 Backend Developer 1 (BE Dev 1) - API Routes, Scraping, Timezones & LinkedIn
**Primary Goal**: Implement remote job scraping streams, WAT timezone overlap filters, recruiter connection sequences, and API route mappings.

* **File Ownership Boundaries**:
  * `backend/api/routes.py` (FastAPI route registry)
  * `backend/utils/timezones.py` (Task 6.1)
  * `backend/services/firecrawl.py` (Scraper wrapper - Task 2.2.1)
  * `backend/services/linkedin.py` (LinkedIn integration - Task 2.5)
  * `backend/agents/job_agent.py` (JobAgent - Task 2.2)
  * `backend/agents/linkedin_agent.py` (LinkedinAgent - Task 2.5)

* **Agentic Instructions**:
  * **Job Scraping Integration**: Implement `firecrawl.py` to stream crawled postings from web boards and external aggregators.
  * **WAT Compatibility**: Implement `utils/timezones.py` with offset math. Flag PST/EST listings ending after late hours as "Late Night WAT Shifts".
  * **Outreach Automation**: Build `linkedin_agent.py` to craft tailored connection messages and follow-up sequences.
  * **Boundary Guard**: Do NOT write retry wrapper systems or parse contract text. Keep log outputs fully structured under `backend.core.logging`. Do NOT use raw `print()` statements.

---

### 2.2 Backend Developer 2 (BE Dev 2) - Orchestration, AI Engines, Resumes & Contracts
**Primary Goal**: Build the orchestration core, retry handler with exponential backoff, document parsing/tailoring, and contract tax estimators.

* **File Ownership Boundaries**:
  * `backend/agents/base.py` (Task 2.1.1)
  * `backend/agents/orchestrator.py` (Task 2.1.2)
  * `backend/utils/currency.py` (Task 6.3)
  * `backend/services/openai.py` (LLM prompt wrapper)
  * `backend/agents/resume_agent.py` (ResumeAgent - Task 2.3)
  * `backend/agents/contract_agent.py` (ContractAgent - Task 2.4)

* **Agentic Instructions**:
  * **Orchestration & Retry loops**: Implement the `MultiAgentOrchestrator` execution loops. Enforce a retry strategy (Initial: 1s, Multiplier: 2x, Max Retries: 3) to prevent API timeouts from halting operations.
  * **Currency Intelligence**: Implement live exchange rate checks in `utils/currency.py` and output dual-format currency strings.
  * **Resume Context Translation**: Tailor resumes inside `resume_agent.py`, converting localized terms (e.g. NYSC) into globally accessible equivalents.
  * **Contract Term Auditor**: Implement `contract_agent.py` to detect lock-ins or non-competes, and calculate contractor tax withholding models.
  * **Boundary Guard**: Do NOT register API endpoints or modify scraper utilities. Coordinate with BE Dev 1 strictly using abstract base class signatures. Do NOT use raw `print()` statements.
