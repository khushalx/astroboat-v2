import { NextRequest, NextResponse } from "next/server";

const GROQ_CHAT_COMPLETIONS_URL = "https://api.groq.com/openai/v1/chat/completions";
// Groq retired llama-3.3-70b-versatile (model_not_found as of 2026-11-23).
const DEFAULT_GROQ_MODEL = "openai/gpt-oss-120b";
const MAX_MESSAGE_LENGTH = 1000;
const REQUEST_TIMEOUT_MS = 30_000;
// Reasoning models (GPT-OSS) spend part of this budget thinking before they
// answer. 500 tokens cut roughly half of real answers off mid-sentence.
const MAX_COMPLETION_TOKENS = 1024;
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
- Keep answers concise: usually 2 or 3 short paragraphs, at most about 180 words.
- Write plain text only. The chat window does not render Markdown, so never use tables, headings, bold or italic markers, or code blocks. Short "- " bullet lines are fine.
- Do not pretend to have live/current data unless it is provided.
- If the user asks for current launches, Moon details, or asteroid approaches, tell them to check Astroboat's dedicated pages: Events, Moon, or Asteroid Watch.
- Do not invent exact current data.
- If a question is unrelated to astronomy/space, politely redirect back to space topics.
- Avoid fear-based language for asteroids.
- Explain uncertainty clearly.`;

type GroqChatCompletionResponse = {
  choices?: Array<{
    finish_reason?: unknown;
    message?: {
      content?: unknown;
    };
  }>;
};

function resolveGroqModel(value: string | undefined) {
  const model = value?.trim() || DEFAULT_GROQ_MODEL;
  // Groq's GPT-OSS model IDs include their provider namespace.
  return model === "gpt-oss-120b" || model === "gpt-oss-20b" ? `openai/${model}` : model;
}

async function upstreamFailure(response: Response, model: string) {
  const data = await response.json().catch(() => null) as { error?: { code?: unknown } } | null;
  // Do not log provider messages, headers, or request bodies: they may contain secrets.
  const rawCode = data?.error?.code;
  const code = typeof rawCode === "string" && /^[a-z_]{1,64}$/.test(rawCode) ? rawCode : "upstream_error";
  console.warn("[Astrobot] Groq request failed", { status: response.status, code, model });

  if (response.status === 401) {
    return NextResponse.json({ error: "Astroboat’s AI connection needs to be updated. Please try again later.", code: "ASSISTANT_AUTH_ERROR" }, { status: 503 });
  }
  if (response.status === 404 || code === "model_not_found" || code === "model_decommissioned") {
    return NextResponse.json({ error: "Astroboat’s AI model is unavailable. Please try again later.", code: "ASSISTANT_MODEL_ERROR" }, { status: 503 });
  }
  if (response.status === 429) {
    return NextResponse.json({ error: "Astroboat has reached its AI request limit. Please try again in a little while.", code: "ASSISTANT_RATE_LIMITED" }, { status: 429 });
  }
  return NextResponse.json({ error: TEMPORARY_UNAVAILABLE_ERROR, code: "ASSISTANT_UPSTREAM_ERROR" }, { status: 502 });
}

export async function POST(request: NextRequest) {
  const message = await readValidatedMessage(request);

  if ("error" in message) {
    return NextResponse.json({ error: message.error }, { status: 400 });
  }

  const apiKey = process.env.GROQ_API_KEY?.trim();
  const model = resolveGroqModel(process.env.GROQ_MODEL);

  if (!apiKey) {
    return NextResponse.json(
      { error: "Astroboat Assistant is not configured yet.", code: "ASSISTANT_NOT_CONFIGURED" },
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
        model,
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
        max_completion_tokens: MAX_COMPLETION_TOKENS,
        // GPT-OSS reasons before answering; "low" keeps answers fast and leaves the
        // budget for the reply. Other Groq models reject this parameter.
        ...(isReasoningModel(model) ? { reasoning_effort: "low", include_reasoning: false } : {})
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    });

    if (!response.ok) {
      return await upstreamFailure(response, model);
    }

    const data = (await response.json()) as GroqChatCompletionResponse;
    const choice = data.choices?.[0];
    const rawAnswer = choice?.message?.content;
    const answer = typeof rawAnswer === "string" ? formatAnswer(rawAnswer, choice?.finish_reason === "length") : "";

    if (!answer) {
      console.warn("[Astrobot] Groq response did not include an answer.", { finishReason: typeof choice?.finish_reason === "string" ? choice.finish_reason : "unknown", model });
      return NextResponse.json({ error: TEMPORARY_UNAVAILABLE_ERROR }, { status: 502 });
    }

    if (choice?.finish_reason === "length") {
      console.warn("[Astrobot] Answer reached the token limit and was trimmed to its last complete sentence.", { model });
    }

    return NextResponse.json({ answer });
  } catch (error) {
    const timedOut = error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
    console.warn("[Astrobot] Groq request could not be completed", { code: timedOut ? "timeout" : "network_error" });

    if (timedOut) {
      return NextResponse.json({ error: "Astroboat took too long to respond. Please try again.", code: "ASSISTANT_TIMEOUT" }, { status: 504 });
    }

    return NextResponse.json({ error: TEMPORARY_UNAVAILABLE_ERROR }, { status: 502 });
  }
}

function isReasoningModel(model: string) {
  return /(^|\/)gpt-oss-/i.test(model);
}

/**
 * The chat window renders plain text. Remove Markdown emphasis and headings the
 * model may still emit, and if the reply hit the token limit, end it at the last
 * complete sentence instead of mid-word.
 */
function formatAnswer(raw: string, truncated: boolean): string {
  let text = raw
    .replace(/\r\n/g, "\n")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/^\s*[-*_]{3,}\s*$/gm, "")
    .replace(/^(\s*)\* /gm, "$1- ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (truncated) {
    const lastEnd = Math.max(text.lastIndexOf(". "), text.lastIndexOf("! "), text.lastIndexOf("? "), text.lastIndexOf(".\n"), text.lastIndexOf("?\n"), text.lastIndexOf("!\n"));
    if (/[.!?]["”’)]?$/.test(text)) return text;
    text = lastEnd > text.length / 3 ? text.slice(0, lastEnd + 1).trim() : `${text.replace(/[\s,;:–—-]+$/, "")}…`;
  }

  return text;
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
