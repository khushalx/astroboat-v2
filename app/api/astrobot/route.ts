import { NextRequest, NextResponse } from "next/server";

const MAX_MESSAGE_LENGTH = 1000;
const FALLBACK_ANSWER =
  "Astroboat Assistant is not connected yet. You can still explore Briefs, Events, Moon, and Asteroid Watch.";

type AstrobotBackendResponse = {
  answer?: unknown;
};

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const message = typeof (body as { message?: unknown }).message === "string"
    ? (body as { message: string }).message.trim()
    : "";

  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.` },
      { status: 400 }
    );
  }

  const backendUrl = process.env.ASTROBOT_BACKEND_URL;

  if (!backendUrl) {
    return NextResponse.json({ answer: FALLBACK_ANSWER });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message }),
      cache: "no-store",
      signal: controller.signal
    });

    const data = await parseBackendResponse(response);

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Astroboat Assistant backend is unavailable.",
          answer: data.answer ?? "Astroboat Assistant could not answer right now. Please try again shortly."
        },
        { status: 502 }
      );
    }

    if (typeof data.answer !== "string" || !data.answer.trim()) {
      return NextResponse.json(
        {
          error: "Astroboat Assistant returned an invalid response.",
          answer: "Astroboat Assistant could not answer right now. Please try again shortly."
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ answer: data.answer.trim() });
  } catch {
    return NextResponse.json(
      {
        error: "Astroboat Assistant backend is unavailable.",
        answer: "Astroboat Assistant could not answer right now. Please try again shortly."
      },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeout);
  }
}

async function parseBackendResponse(response: Response): Promise<{ answer?: string }> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const data = (await response.json()) as AstrobotBackendResponse;
    return typeof data.answer === "string" ? { answer: data.answer } : {};
  }

  const text = await response.text();
  return text.trim() ? { answer: text.trim() } : {};
}
