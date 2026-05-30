# JobJockey

A platform to help you find, apply, and succeed in remote roles worldwide.

## Project Structure

```
├── backend/          # FastAPI backend
├── frontend/         # React + Vite frontend
└── README.md
```

## Getting Started

### Backend

1. Navigate to backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   uvicorn main:app --reload --port 8080
   ```

### Frontend

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```

## Docker

### Backend

```bash
cd backend
docker build -t jobjockey-backend .
docker run -p 8080:8080 jobjockey-backend
```

### Frontend

```bash
cd frontend
docker build -t jobjockey-frontend .
docker run -p 8080:8080 jobjockey-frontend
```

## Google Cloud Run Deployment

This project is configured to run on Google Cloud Run.

### Backend Deployment

```bash
cd backend
gcloud builds submit --tag gcr.io/[PROJECT_ID]/jobjockey-backend
gcloud run deploy jobjockey-backend --image gcr.io/[PROJECT_ID]/jobjockey-backend --platform managed --port 8080 --allow-unauthenticated
```

### Frontend Deployment

```bash
cd frontend
gcloud builds submit --tag gcr.io/[PROJECT_ID]/jobjockey-frontend
gcloud run deploy jobjockey-frontend --image gcr.io/[PROJECT_ID]/jobjockey-frontend --platform managed --port 8080 --allow-unauthenticated
```
