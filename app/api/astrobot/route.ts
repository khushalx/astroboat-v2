import { NextRequest, NextResponse } from "next/server";

const GROQ_CHAT_COMPLETIONS_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile";
const MAX_MESSAGE_LENGTH = 1000;
const TEMPORARY_UNAVAILABLE_ERROR =
  "Astroboat Assistant is temporarily unavailable. Please try again later.";

const SYSTEM_PROMPT = `You are Astroboat Assistant, a calm astronomy helper inside Astroboat.

Answer only questions related to:
- astronomy
- space science
- Moon phases
- asteroids
- skywatching
- space missions
- rockets and launches
- telescopes
- planets, stars, galaxies, black holes
- Astroboat website features

Rules:
- Keep answers beginner-friendly.
- Keep answers concise.
- Do not pretend to have live/current data unless it is provided.
- If the user asks for current launches, Moon details, or asteroid approaches, tell them to check Astroboat's dedicated pages: Events, Moon, or Asteroid Watch.
- Do not invent exact current data.
- If a question is unrelated to astronomy/space, politely redirect back to space topics.
- Avoid fear-based language for asteroids.
- Explain uncertainty clearly.`;

type GroqChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: unknown;
    };
  }>;
};

export async function POST(request: NextRequest) {
  const message = await readValidatedMessage(request);

  if ("error" in message) {
    return NextResponse.json({ error: message.error }, { status: 400 });
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Astroboat Assistant is not configured yet." },
      { status: 503 }
    );
  }

  try {
    const response = await fetch(GROQ_CHAT_COMPLETIONS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || DEFAULT_GROQ_MODEL,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT
          },
          {
            role: "user",
            content: message.value
          }
        ],
        temperature: 0.5,
        max_tokens: 500
      }),
      cache: "no-store"
    });

    if (!response.ok) {
      console.warn("[Astrobot] Groq request failed", {
        status: response.status,
        statusText: response.statusText
      });

      return NextResponse.json({ error: TEMPORARY_UNAVAILABLE_ERROR }, { status: 502 });
    }

    const data = (await response.json()) as GroqChatCompletionResponse;
    const answer = data.choices?.[0]?.message?.content;

    if (typeof answer !== "string" || !answer.trim()) {
      console.warn("[Astrobot] Groq response did not include an answer.");
      return NextResponse.json({ error: TEMPORARY_UNAVAILABLE_ERROR }, { status: 502 });
    }

    return NextResponse.json({ answer: answer.trim() });
  } catch (error) {
    console.warn("[Astrobot] Groq request could not be completed", {
      message: error instanceof Error ? error.message : "Unknown error"
    });

    return NextResponse.json({ error: TEMPORARY_UNAVAILABLE_ERROR }, { status: 502 });
  }
}

async function readValidatedMessage(
  request: NextRequest
): Promise<{ value: string } | { error: string }> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return { error: "Invalid JSON body." };
  }

  const rawMessage = isRecord(body) ? body.message : undefined;
  const message = typeof rawMessage === "string" ? rawMessage.trim() : "";

  if (!message) {
    return { error: "Message is required." };
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return { error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.` };
  }

  return { value: message };
}

function isRecord(value: unknown): value is { message?: unknown } {
  return typeof value === "object" && value !== null;
}
