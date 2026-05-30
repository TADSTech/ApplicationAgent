# JobJockey Backend API Test Documentation

## 🧪 Testing Status

### Test Environment
- **Backend Server:** Running on `http://localhost:8000`
- **API Version:** `/api/v1`
- **Current API Keys Configured:** 
  - EXCHANGERATE_API_KEY ✅
  - GEMINI_API_KEY ✅
  - FIRECRAWL_API_KEY ✅
  - GITHUB_TOKEN ✅

---

## 📋 Backend Endpoints

### Authentication Endpoints

| Method | Endpoint | Status | Description |
|--------|----------|--------|-------------|
| POST | `/auth/login` | ⏳ Pending | Login with Firebase token |
| POST | `/auth/logout` | ⏳ Pending | Logout |

### Job Endpoints

| Method | Endpoint | Status | Description |
|--------|----------|-------------|
| POST | `/jobs/search` | ⏳ Pending | Start autonomous job search |

### Resume Endpoints

| Method | Endpoint | Status | Description |
|--------|----------|-------------|
| POST | `/resume/tailor` | ⏳ Pending | Tailor resume for a specific job |

### Contract Endpoints

| Method | Endpoint | Status | Description |
|--------|----------|-------------|
| POST | `/contract/analyze` | ⏳ Pending | Analyze employment contract |

### LinkedIn Endpoints

| Method | Endpoint | Status | Description |
|--------|----------|-------------|
| POST | `/linkedin/outreach` | ⏳ Pending | Prepare LinkedIn outreach messages |

### Portfolio Endpoints

| Method | Endpoint | Status | Description |
|--------|----------|-------------|
| POST | `/portfolio/github` | ⏳ Pending | Fetch GitHub repositories |

### Utility Endpoints

| Method | Endpoint | Status | Description |
|--------|----------|-------------|
| GET | `/exchange-rate` | ✅ **TESTED** | Get USD/NGN exchange rate |

---

## 🧪 Test Results

### Exchange Rate API Test
**Status:** ✅ **PASSED**

**Test Details:**
- **Endpoint:** `GET /api/v1/exchange-rate`
- **API Key:** EXCHANGERATE_API_KEY configured
- **Test Date:** 2026-05-30
- **Result:** Currency conversion working correctly

**Request:**
```bash
curl http://localhost:8000/api/v1/exchange-rate
```

**Response:**
```json
{
  "usd_to_ngn": 1625.5,
  "ngn_to_usd": 0.000615,
  "timestamp": "2026-05-30T05:48:16.166415+00:00"
}
```

**Notes:**
- Uses the correct ExchangeRate-API Pair endpoint format: `/v6/API_KEY/pair/USD/NGN`
- Returns both USD to NGN and NGN to USD rates
- Falls back to mock rate if API call fails

---

## 🚀 Running the Backend Server

### Prerequisites
```bash
# Install dependencies
cd backend
pip install -r requirements.txt
```

### Start Server
```bash
# From ApplicationAgent root directory
python -m uvicorn backend.main:app --reload --port 8000
```

### Test Endpoints
```bash
# Test root endpoint
curl http://localhost:8000/

# Test exchange rate
curl http://localhost:8000/api/v1/exchange-rate

# Test job search (requires session_id)
curl -X POST http://localhost:8000/api/v1/jobs/search \
  -H "Content-Type: application/json" \
  -d '{"session_id": "test-123", "keywords": "Software Engineer", "location": "Remote"}'

# Test GitHub repos (requires GITHUB_TOKEN)
curl -X POST http://localhost:8000/api/v1/portfolio/github \
  -H "Content-Type: application/json" \
  -d '{"github_username": "sudotads"}'
```

---

## 📝 Test Notes

- All endpoints use Gemini API for LLM operations
- Mock data returned when API keys are not configured
- Exchange Rate API is the first external API being tested
- All agents implement exponential backoff retry logic (max 3 retries)
- Server is currently running on `http://localhost:8000`