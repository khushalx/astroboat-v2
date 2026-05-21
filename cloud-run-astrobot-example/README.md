# Astroboat Cloud Run Assistant Example

This is an optional Google Cloud Run backend for `/api/astrobot`. It uses Vertex AI Gemini with Application Default Credentials or the Cloud Run service account. It does not use API keys.

## Environment

Set these variables in Cloud Run:

```bash
GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID
VERTEX_LOCATION=us-central1
VERTEX_MODEL=gemini-1.5-flash
```

The Cloud Run service account needs the Vertex AI User role.

## Local Setup

```bash
gcloud auth application-default login
gcloud config set project YOUR_PROJECT_ID
gcloud services enable aiplatform.googleapis.com
npm install
npm start
```

Then set Astroboat's server-side environment variable:

```bash
ASTROBOT_BACKEND_URL=http://localhost:8080
```

## Deploy Sketch

```bash
gcloud run deploy astroboat-astrobot \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID,VERTEX_LOCATION=us-central1,VERTEX_MODEL=gemini-1.5-flash
```

For public production traffic, add rate limiting and consider requiring a backend auth token between Vercel and Cloud Run.
