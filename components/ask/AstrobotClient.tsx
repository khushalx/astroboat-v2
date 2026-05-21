"use client";

import { FormEvent, useRef, useState } from "react";
import { AstroCard } from "@/components/ui/AstroCard";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

const INITIAL_MESSAGE: ChatMessage = {
  id: "intro",
  role: "assistant",
  text: "Ask me about Moon phases, asteroids, space events, skywatching, satellites, missions, or astronomy basics."
};

const MAX_MESSAGE_LENGTH = 1000;

export function AstrobotClient() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = input.trim();
    if (!message || isSending) {
      return;
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      setError(`Keep questions under ${MAX_MESSAGE_LENGTH} characters.`);
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: message
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setError("");
    setIsSending(true);

    try {
      const response = await fetch("/api/astrobot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const data = (await response.json()) as { answer?: string; error?: string };

      if (!response.ok) {
        setError(data.error ?? "Astroboat Assistant could not answer right now.");
      }

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: data.answer ?? "Astroboat Assistant could not answer right now. Please try again shortly."
        }
      ]);
    } catch {
      setError("Astroboat Assistant could not connect. Please try again shortly.");
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: "Astroboat Assistant could not connect. You can still explore Briefs, Events, Moon, and Asteroid Watch."
        }
      ]);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <AstroCard as="section" className="mission-surface min-h-[34rem] p-3 sm:p-4">
        <div className="flex min-h-[30rem] flex-col">
          <div className="border-b border-astro-border px-1 pb-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-astro-gold">
              Ask Astroboat
            </p>
            <p className="mt-1 text-sm text-astro-muted">
              Beginner-friendly astronomy answers, routed through a server-side backend when connected.
            </p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto py-4 pr-1" aria-live="polite">
            {messages.map((message) => (
              <article
                key={message.id}
                className={cn(
                  "max-w-[88%] rounded-lg border px-3 py-2.5 text-sm leading-6 sm:max-w-[78%]",
                  message.role === "user"
                    ? "ml-auto border-astro-blue/35 bg-astro-blue/10 text-astro-text"
                    : "border-astro-border bg-astro-bg/70 text-astro-muted"
                )}
              >
                <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-astro-gold">
                  {message.role === "user" ? "You" : "Astroboat"}
                </p>
                <p className="whitespace-pre-wrap">{message.text}</p>
              </article>
            ))}

            {isSending ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-astro-border bg-astro-bg/70 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-astro-muted">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-astro-gold" aria-hidden="true" />
                Thinking
              </div>
            ) : null}
          </div>

          {error ? (
            <p className="mb-3 rounded-md border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm text-red-100">
              {error}
            </p>
          ) : null}

          <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-t border-astro-border pt-3 sm:flex-row">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={MAX_MESSAGE_LENGTH}
              rows={2}
              placeholder="Ask about Moon phases, asteroids, space events, or astronomy basics..."
              className="min-h-16 flex-1 resize-none rounded-md border border-astro-border bg-astro-bg/80 px-3 py-2 text-sm leading-6 text-astro-text placeholder:text-astro-muted focus:border-astro-blue/50 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="min-h-11 rounded-md border border-astro-blue/45 bg-astro-blue/15 px-4 py-2 text-sm font-semibold text-astro-text transition hover:border-astro-blue hover:bg-astro-blue/25 disabled:cursor-not-allowed disabled:border-astro-border disabled:bg-astro-surface disabled:text-astro-muted"
            >
              {isSending ? "Sending" : "Send"}
            </button>
          </form>
        </div>
      </AstroCard>

      <aside className="space-y-3">
        <AstroCard className="p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-astro-gold">Good questions</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-astro-muted">
            <li>What does Moon illumination mean?</li>
            <li>How close is a near-Earth asteroid?</li>
            <li>What should I watch in the night sky?</li>
            <li>How do rocket launches reach orbit?</li>
          </ul>
        </AstroCard>
        <AstroCard className="p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-astro-gold">Live data note</p>
          <p className="mt-3 text-sm leading-6 text-astro-muted">
            For current launches, Moon details, and asteroid approaches, use Astroboat&apos;s live pages. The assistant should not invent exact current events.
          </p>
        </AstroCard>
      </aside>
    </section>
  );
}
