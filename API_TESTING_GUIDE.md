# API Testing Guide - No Frontend Required

This guide shows how to test all JobJockey backend API endpoints without a frontend using command-line tools.

## Prerequisites
- Backend server running on `http://127.0.0.1:8000`
- PowerShell (Windows) or curl (cross-platform)

## Starting the Backend Server

### Windows PowerShell
```powershell
cd backend
python -m uvicorn main:app --port 8000
```

### Background Mode (Recommended)
```powershell
python -m uvicorn main:app --port 8000
```

## API Endpoints Testing

### 1. Root Endpoint
**Purpose:** Check if server is running

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/" -Method Get
```

**curl:**
```bash
curl http://127.0.0.1:8000/
```

**Expected Response:**
```json
{"message": "Welcome to the JobJockey API!"}
```

---

### 2. Exchange Rate Endpoint
**Purpose:** Get current USD to NGN exchange rate

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/exchange-rate" -Method Get | ConvertTo-Json
```

**curl:**
```bash
curl http://127.0.0.1:8000/api/v1/exchange-rate
```

**Expected Response:**
```json
{
  "usd_to_ngn": 1625.5,
  "ngn_to_usd": 0.000615,
  "timestamp": "2026-05-30T06:35:24.726588+01:00"
}
```

---

### 3. Job Search Endpoint
**Purpose:** Search for jobs using AI agents

**PowerShell:**
```powershell
$body = @{
    session_id = "test-123"
    keywords = "Software Engineer"
    location = "Remote"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/jobs/search" -Method Post -ContentType "application/json" -Body $body
```

**curl:**
```bash
curl -X POST http://127.0.0.1:8000/api/v1/jobs/search \
  -H "Content-Type: application/json" \
  -d '{"session_id": "test-123", "keywords": "Software Engineer", "location": "Remote"}'
```

**Test Data Science Jobs:**
```powershell
$body = @{
    session_id = "test-data-science"
    keywords = "Data Scientist"
    location = "Remote"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/jobs/search" -Method Post -ContentType "application/json" -Body $body
```

---

### 4. Resume Tailor Endpoint
**Purpose:** Tailor resume for a specific job

**PowerShell:**
```powershell
$body = @{
    session_id = "test-123"
    job_description = "Software Engineer position requiring Python and AWS experience"
    resume_text = "Experienced developer with 5 years in Python and cloud technologies."
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/resume/tailor" -Method Post -ContentType "application/json" -Body $body
```

**curl:**
```bash
curl -X POST http://127.0.0.1:8000/api/v1/resume/tailor \
  -H "Content-Type: application/json" \
  -d '{"session_id": "test-123", "job_description": "Software Engineer position requiring Python and AWS experience", "resume_text": "Experienced developer with 5 years in Python and cloud technologies."}'
```

---

### 5. Contract Analysis Endpoint
**Purpose:** Analyze employment contracts

**PowerShell:**
```powershell
$body = @{
    session_id = "test-123"
    contract_text = "This is a sample employment contract for a software engineer position."
    base_salary_usd = 90000
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/contract/analyze" -Method Post -ContentType "application/json" -Body $body
```

**curl:**
```bash
curl -X POST http://127.0.0.1:8000/api/v1/contract/analyze \
  -H "Content-Type: application/json" \
  -d '{"session_id": "test-123", "contract_text": "This is a sample employment contract for a software engineer position.", "base_salary_usd": 90000}'
```

---

### 6. LinkedIn Outreach Endpoint
**Purpose:** Generate LinkedIn outreach messages

**PowerShell:**
```powershell
$body = @{
    session_id = "test-123"
    recruiter_name = "John Smith"
    company_name = "Tech Corp"
    job_title = "Software Engineer"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/linkedin/outreach" -Method Post -ContentType "application/json" -Body $body
```

**curl:**
```bash
curl -X POST http://127.0.0.1:8000/api/v1/linkedin/outreach \
  -H "Content-Type: application/json" \
  -d '{"session_id": "test-123", "recruiter_name": "John Smith", "company_name": "Tech Corp", "job_title": "Software Engineer"}'
```

---

### 7. GitHub Portfolio Endpoint
**Purpose:** Fetch GitHub repositories for portfolio showcase

**PowerShell:**
```powershell
$body = @{
    github_username = "your-github-username"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/portfolio/github" -Method Post -ContentType "application/json" -Body $body | ConvertTo-Json
```

**curl:**
```bash
curl -X POST http://127.0.0.1:8000/api/v1/portfolio/github \
  -H "Content-Type: application/json" \
  -d '{"github_username": "your-github-username"}'
```

**Note:** Requires `GITHUB_TOKEN` in `backend/.env` file. See `GITHUB_TOKEN_SETUP.md` for setup instructions.

---

### 8. Auth Logout Endpoint
**Purpose:** User logout

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/auth/logout" -Method Post
```

**curl:**
```bash
curl -X POST http://127.0.0.1:8000/api/v1/auth/logout
```

---

## Quick Test Script (PowerShell)

Save this as `test-api.ps1` and run it:

```powershell
# Test all endpoints
Write-Host "Testing JobJockey API Endpoints..." -ForegroundColor Green

# 1. Root endpoint
Write-Host "`n1. Root Endpoint:" -ForegroundColor Yellow
Invoke-RestMethod -Uri "http://127.0.0.1:8000/" -Method Get

# 2. Exchange rate
Write-Host "`n2. Exchange Rate:" -ForegroundColor Yellow
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/exchange-rate" -Method Get | ConvertTo-Json

# 3. Job search
Write-Host "`n3. Job Search:" -ForegroundColor Yellow
$body = @{ session_id = "test-123"; keywords = "Software Engineer"; location = "Remote" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/jobs/search" -Method Post -ContentType "application/json" -Body $body

# 4. Resume tailor
Write-Host "`n4. Resume Tailor:" -ForegroundColor Yellow
$body = @{ session_id = "test-123"; job_description = "Software Engineer position"; resume_text = "Experienced developer" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/resume/tailor" -Method Post -ContentType "application/json" -Body $body

# 5. Contract analyze
Write-Host "`n5. Contract Analyze:" -ForegroundColor Yellow
$body = @{ session_id = "test-123"; contract_text = "Sample contract"; base_salary_usd = 90000 } | ConvertTo-Json
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/contract/analyze" -Method Post -ContentType "application/json" -Body $body

# 6. LinkedIn outreach
Write-Host "`n6. LinkedIn Outreach:" -ForegroundColor Yellow
$body = @{ session_id = "test-123"; recruiter_name = "John"; company_name = "Tech Corp"; job_title = "Engineer" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/linkedin/outreach" -Method Post -ContentType "application/json" -Body $body

# 7. GitHub portfolio
Write-Host "`n7. GitHub Portfolio:" -ForegroundColor Yellow
$body = @{ github_username = "torvalds" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/portfolio/github" -Method Post -ContentType "application/json" -Body $body | ConvertTo-Json

# 8. Auth logout
Write-Host "`n8. Auth Logout:" -ForegroundColor Yellow
Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/v1/auth/logout" -Method Post

Write-Host "`n`nAll tests completed!" -ForegroundColor Green
```

Run it:
```powershell
.\test-api.ps1
```

## Troubleshooting

### Connection Refused
- Ensure backend server is running
- Check if port 8000 is available
- Try restarting the server

### 500 Internal Server Error
- Check server logs for error details
- Verify all required environment variables are set
- Ensure all dependencies are installed

### 404 Not Found
- Verify endpoint URL is correct
- Check if endpoint is implemented in routes.py

### 401 Unauthorized
- Check Firebase token configuration (for auth endpoints)
- Verify GitHub token is valid (for portfolio endpoint)

## Monitoring Server Logs

While testing, monitor server logs in real-time:
```powershell
# Server logs are displayed in the terminal where you started the server
# Look for:
# - INFO messages for successful operations
# - WARNING messages for fallback/mock data usage
# - ERROR messages for failures
```

## Mock vs Live Testing

### Mock Mode (Current)
- All endpoints use mock data when API keys not configured
- Useful for development and testing
- No external API calls required

### Live Mode
- Configure API keys in `backend/.env`:
  - `GEMINI_API_KEY` for AI responses
  - `FIRECRAWL_API_KEY` for live job scraping
  - `GITHUB_TOKEN` for GitHub portfolio
  - `EXCHANGERATE_API_KEY` for live exchange rates
- Real API calls will be made
- More realistic results but requires valid API keys
