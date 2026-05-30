# Artifact Registry Setup

This document outlines the steps to create an Artifact Registry repository for storing Docker images of the JobJockey backend.

## 1. Artifact Registry Repository Creation

1.  **Ensure GCP Project is Selected**: Make sure your Google Cloud project is selected in the `gcloud` CLI.
    ```bash
    gcloud config set project YOUR_GCP_PROJECT_ID
    ```

2.  **Enable Artifact Registry API**: If not already enabled, enable the Artifact Registry API.
    ```bash
    gcloud services enable artifactregistry.googleapis.com
    ```

3.  **Create Docker Repository**: Create a Docker repository named `jobjockey-repo` in the `europe-west1` region.
    ```bash
    gcloud artifacts repositories create jobjockey-repo \
        --repository-format=docker \
        --location=europe-west1 \
        --description="Docker repository for JobJockey backend images"
    ```

4.  **Configure Docker to use gcloud as a credential helper**: This step authenticates Docker to push and pull images from Artifact Registry.
    ```bash
    gcloud auth configure-docker europe-west1-docker.pkg.dev
    ```

## 2. Verify Repository Creation

You can verify the repository was created successfully by listing your repositories:

```bash
gcloud artifacts repositories list --location=europe-west1
```