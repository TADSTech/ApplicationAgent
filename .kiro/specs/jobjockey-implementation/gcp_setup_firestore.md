# Firestore Database Provisioning and Security Rules

This document outlines the steps to provision a Firestore Native instance and configure its security rules for the JobJockey backend.

## 1. Firestore Database Provisioning

1.  **Ensure GCP Project is Selected**: Make sure your Google Cloud project is selected in the `gcloud` CLI.
    ```bash
    gcloud config set project YOUR_GCP_PROJECT_ID
    ```

2.  **Enable Firestore API**: If not already enabled, enable the Firestore API.
    ```bash
    gcloud services enable firestore.googleapis.com
    ```

3.  **Create Firestore Native Database**: Create a Firestore Native database instance in the `europe-west1` region. Replace `YOUR_GCP_PROJECT_ID` with your actual project ID.
    ```bash
    gcloud firestore databases create --database='(default)' --region=europe-west1
    ```
    *Note: The `--database='(default)'` flag specifies the default Firestore database for the project.* 

## 2. Firestore Security Rules

Firestore security rules control access to your database. For JobJockey, we need to ensure that agents can only read and write their own session states.

1.  **Create a Security Rules File**: Create a file named `firestore.rules` (e.g., in a `gcp/` directory within your project, or directly in `.kiro/specs/jobjockey-implementation/`).

2.  **Add Security Rules**: Add the following rules to `firestore.rules`. These rules allow authenticated users (agents) to read and write their own session data within the `agent_states` collection.

    ```firestore
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        // Allow read/write to agent_states collection if authenticated and session_id matches
        match /agent_states/{sessionId}/agents/{agentType} {
          allow read, write: if request.auth != null && request.auth.uid == sessionId;
        }

        // Optionally, if you have a top-level 'users' collection to store user profiles
        match /users/{userId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }

        // Deny all other access by default
        match /{document=**} {
          allow read, write: if false;
        }
      }
    }
    ```

3.  **Deploy Security Rules**: Deploy the security rules using the `gcloud` CLI. Ensure you are in the directory containing `firestore.rules` or provide the correct path.
    ```bash
    gcloud firestore deploy firestore.rules
    ```

    *Note: This command deploys the rules to the default Firestore Native database.*