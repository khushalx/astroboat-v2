# Astroboat Assistant on Groq

Astroboat Assistant is handled by the Next.js server route at `/api/astrobot`.
The route calls Groq directly from the server, so the API key is never exposed to
browser code.

## Vercel Environment Variables

Add these variables in Vercel:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

`GROQ_MODEL` is optional. If it is not set, Astroboat uses
`llama-3.3-70b-versatile`.

Do not use `NEXT_PUBLIC_GROQ_API_KEY`.
