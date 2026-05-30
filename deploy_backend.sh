#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Configuration variables
PROJECT_ID="YOUR_GCP_PROJECT_ID" # Replace with your GCP project ID
REGION="europe-west1"
SERVICE_NAME="jobjockey-backend"
IMAGE_NAME="jobjockey-repo"

# 1. Authenticate gcloud (if not already authenticated)
# gcloud auth login # Uncomment if you need to log in interactively

# 2. Set the current GCP project
echo "Setting GCP project to ${PROJECT_ID}"
gcloud config set project "${PROJECT_ID}"

# 3. Build and push the Docker image to Artifact Registry
echo "Building Docker image..."
# Ensure you are in the 'backend' directory for building the Dockerfile
docker build -t "${REGION}-docker.pkg.dev/${PROJECT_ID}/${IMAGE_NAME}/${SERVICE_NAME}:latest" ./backend

echo "Pushing Docker image to Artifact Registry..."
docker push "${REGION}-docker.pkg.dev/${PROJECT_ID}/${IMAGE_NAME}/${SERVICE_NAME}:latest"

# 4. Deploy to Cloud Run with secret mounts
echo "Deploying to Cloud Run..."
gcloud run deploy "${SERVICE_NAME}" \
  --image="${REGION}-docker.pkg.dev/${PROJECT_ID}/${IMAGE_NAME}/${SERVICE_NAME}:latest" \
  --region="${REGION}" \
  --platform="managed" \
  --allow-unauthenticated \
  --set-env-vars="FIRESTORE_PROJECT_ID=${FIRESTORE_PROJECT_ID}" \
  --set-secrets="FIRECRAWL_API_KEY=FIRECRAWL_API_KEY:latest" \
  --set-secrets="OPENAI_API_KEY=OPENAI_API_KEY:latest" \
  --set-secrets="LINKEDIN_CLIENT_ID=LINKEDIN_CLIENT_ID:latest" \
  --set-secrets="LINKEDIN_CLIENT_SECRET=LINKEDIN_CLIENT_SECRET:latest" \
  --set-secrets="FIREBASE_CREDENTIALS_PATH=FIREBASE_CREDENTIALS_JSON:latest" \
  --update-secrets="FIREBASE_CREDENTIALS_JSON=projects/${PROJECT_ID}/secrets/FIREBASE_CREDENTIALS_JSON:latest" \
  --ingress="all" \
  --memory="512Mi" \
  --cpu="1" \
  --max-instances="5" \
  --min-instances="1"

echo "Deployment complete!"
