# JobJockey Cloud Deployment Plan (Phase 4 Detailed Breakdown)

This document maps out the specific checklists and configurations required to build and deploy the JobJockey platform to production on Google Cloud Platform (GCP) and Firebase.

---

## 1. Cloud Firestore Database Provisioning

- [ ] **1.1 Database Instance Setup**
  - Create a new project in the Google Cloud Console: `jobjockey-production`.
  - Provision a Cloud Firestore database in Native mode.
  - Set the default instance region to a European region (e.g., `europe-west1` / Belgium) to provide low-latency access to WAT (West Africa Time).

- [ ] **1.2 Security Rules Implementation**
  - Create and apply secure database rules so users can only read/write their own profiles, resumes, and matched applications:
    ```javascript
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /users/{userId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
        match /resumes/{resumeId} {
          allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
        }
        match /applications/{appId} {
          allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
        }
      }
    }
    ```

- [ ] **1.3 Firebase Admin SDK Private Credentials**
  - Go to Project Settings -> Service Accounts.
  - Click "Generate New Private Key" to download the Service Account configuration file.
  - Safely distribute it to the secure Secrets Manager vault (do NOT commit this key to the repository).

---

## 2. GCP Artifact Registry Configuration

- [ ] **2.1 Repository Setup**
  - Enable the Artifact Registry API within the GCP Console.
  - Create a Docker container repository:
    * **Name**: `jobjockey-repo`
    * **Format**: Docker
    * **Location Type**: Regional
    * **Region**: `europe-west1`

- [ ] **2.2 CI/CD Authentications**
  - Configure the local development workstation or Cloud Build runners to authenticate with Google Cloud registries:
    ```bash
    gcloud auth configure-docker europe-west1-docker.pkg.dev
    ```

---

## 3. Cloud Run Backend Service Deployment

- [ ] **3.1 Container Build**
  - Compile the Docker container:
    ```bash
    docker build -t europe-west1-docker.pkg.dev/jobjockey-production/jobjockey-repo/backend:latest ./backend
    ```

- [ ] **3.2 Registry Push**
  - Push the built image to the secure repository:
    ```bash
    docker push europe-west1-docker.pkg.dev/jobjockey-production/jobjockey-repo/backend:latest
    ```

- [ ] **3.3 Service Deployments**
  - Deploy the backend container to Cloud Run with scale-to-zero (to prevent idle charges) and public access:
    ```bash
    gcloud run deploy jobjockey-backend \
      --image europe-west1-docker.pkg.dev/jobjockey-production/jobjockey-repo/backend:latest \
      --platform managed \
      --region europe-west1 \
      --allow-unauthenticated \
      --memory 512Mi \
      --max-instances 5
    ```

---

## 4. GCP Secret Manager Integration

- [ ] **4.1 Secret Registries**
  - Register API secrets safely:
    * `OPENAI_API_KEY`
    * `FIRECRAWL_API_KEY`
    * `FIREBASE_CREDENTIALS` (The content of the Service Account private key JSON)

- [ ] **4.2 Service Mounting**
  - Bind secrets securely from Secret Manager to Cloud Run container environments, avoiding raw file configuration leaks:
    ```bash
    gcloud run services update jobjockey-backend \
      --set-secrets=/secrets/firebase_credentials.json=FIREBASE_CREDENTIALS:latest \
      --update-env-vars=FIREBASE_CREDENTIALS_PATH=/secrets/firebase_credentials.json
    ```

---

## 5. Firebase Hosting Frontend Deployment

- [ ] **5.1 Setup CLI Configurations**
  - Install Firebase CLI tooling:
    ```bash
    npm install -g firebase-tools
    ```
  - Log in to your Google Account:
    ```bash
    firebase login
    ```

- [ ] **5.2 Environment Provisioning**
  - Run the hosting initialization wizard inside the `frontend/` directory:
    ```bash
    firebase init hosting
    ```
  - Select `jobjockey-production` as the target project, define `dist` as the build output directory, and configure the project as a single-page app (SPA).

- [ ] **5.3 Deployment Execution**
  - Run the Vite production build:
    ```bash
    cd frontend
    pnpm build
    ```
  - Deploy static assets to Firebase Hosting:
    ```bash
    firebase deploy --only hosting
    ```
