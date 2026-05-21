# Astroboat Assistant on Google Cloud Vertex AI

Astroboat should not call Gemini directly from the browser. The recommended setup is:

```text
Astroboat on Vercel -> /api/astrobot -> Google Cloud Run or Cloud Function -> Vertex AI Gemini
```

The Vercel route handler reads `ASTROBOT_BACKEND_URL` on the server and proxies chatbot requests to the Google Cloud endpoint. If that environment variable is missing, Astroboat returns a clean fallback message instead of crashing.

## Google Cloud Backend

Deploy the chatbot endpoint to Cloud Run or Cloud Functions. The service should:

- Use a Google Cloud service account.
- Grant that service account the Vertex AI User role.
- Use Application Default Credentials inside Google Cloud.
- Call a Vertex AI Gemini model from a supported region such as `us-central1`.
- Expose a simple HTTPS endpoint that accepts `POST { "message": "..." }`.
- Return `200 { "answer": "..." }`.

Do not put Google AI Studio API keys, service account JSON, or Google credentials in the Astroboat frontend.

## Vercel Configuration

Set this server-side environment variable in Vercel:

```bash
ASTROBOT_BACKEND_URL=https://YOUR_CLOUD_RUN_SERVICE_URL
```

Do not prefix it with `NEXT_PUBLIC_`. The browser should only call Astroboat's `/api/astrobot` route.

## Local Development

Install the Google Cloud CLI, then authenticate Application Default Credentials:

```bash
gcloud auth application-default login
gcloud config set project YOUR_PROJECT_ID
gcloud services enable aiplatform.googleapis.com
```

For local backend testing, set:

```bash
export GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID
export VERTEX_LOCATION=us-central1
export VERTEX_MODEL=gemini-1.5-flash
```

Then run the backend locally and set `ASTROBOT_BACKEND_URL` in the Next.js environment to the local endpoint.

## Assistant Behavior

Use this system prompt for Gemini:

```text
You are Astroboat Assistant, a calm astronomy helper.
Answer only astronomy, space science, skywatching, Moon, asteroids, satellites, space missions, and Astroboat-related questions.
Keep answers concise and beginner-friendly.
If the user asks for live/current data, say that live data should be checked on Astroboat's Events, Moon, or Asteroid Watch pages unless current context is provided.
Do not make up exact current events.
Do not provide unsafe or irrelevant content.
```

## Security Notes

- Never expose credentials to client-side code.
- Do not commit service account JSON files.
- Do not log full user messages unless necessary for a deliberate debugging session.
- Add rate limiting before public launch.
- Keep input validation on both Vercel and the Google Cloud backend.
- If backend authentication is added later, keep tokens server-side in Vercel environment variables.
