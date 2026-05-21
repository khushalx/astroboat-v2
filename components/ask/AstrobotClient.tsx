"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { AstroCard } from "@/components/ui/AstroCard";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

const MAX_MESSAGE_LENGTH = 1000;
const SUGGESTED_PROMPTS = [
  "What is a black hole?",
  "Why does the Moon change shape?",
  "How close is a near-Earth asteroid?",
  "What should I watch in the night sky?"
];

export function AstrobotClient() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSending]);

  async function sendMessage(value: string) {
    const message = value.trim();
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

      const data = (await safeReadJson(response)) as { answer?: string; error?: string };

      if (!response.ok) {
        setError(cleanAssistantError(data.error));
        return;
      }

      const answer = data.answer?.trim();

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: answer || "Astroboat Assistant is temporarily unavailable. Please try again later."
        }
      ]);
    } catch {
      setError("Astroboat Assistant is temporarily unavailable. Please try again later.");
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(input);
    }
  }

  function handlePromptClick(prompt: string) {
    setInput(prompt);
    inputRef.current?.focus();
  }

  const hasUserMessages = messages.some((message) => message.role === "user");

  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem]">
      <AstroCard as="section" className="mission-surface p-0">
        <div className="flex min-h-[36rem] flex-col sm:min-h-[38rem]">
          <div className="flex items-start justify-between gap-4 border-b border-astro-border px-4 py-4 sm:px-5">
            <div>
              <p className="font-display text-xl font-normal text-astro-text">Ask Astroboat</p>
              <p className="mt-1 text-sm text-astro-muted">Ask simple astronomy questions.</p>
            </div>
            <div
              className="relative mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-astro-blue/30 bg-astro-blue/10"
              aria-hidden="true"
            >
              <span className="h-3 w-3 rounded-full bg-astro-gold shadow-[0_0_18px_rgba(214,168,79,0.35)]" />
              <span className="absolute h-7 w-7 rounded-full border border-astro-blue/45" />
              <span className="absolute h-px w-8 rotate-[-24deg] bg-astro-blue/45" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-5" aria-live="polite">
            {!hasUserMessages ? (
              <StarterState onPromptClick={handlePromptClick} />
            ) : (
              <div className="space-y-3">
                {messages.map((message) => (
                  <ChatBubble key={message.id} message={message} />
                ))}
              </div>
            )}

            {isSending ? (
              <TypingIndicator />
            ) : null}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-astro-border bg-astro-elevated/45 p-3 sm:p-4">
            {error ? <ErrorNotice message={error} /> : null}

            <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <label className="sr-only" htmlFor="astrobot-message">
                Ask Astroboat a question
              </label>
              <textarea
                id="astrobot-message"
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSending}
                maxLength={MAX_MESSAGE_LENGTH}
                rows={2}
                aria-label="Ask Astroboat a question"
                placeholder="Ask about Moon phases, asteroids, space events, or astronomy basics..."
                className="min-h-14 flex-1 resize-none rounded-xl border border-astro-border bg-astro-bg/90 px-3.5 py-3 text-sm leading-6 text-astro-text shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] placeholder:text-astro-muted focus:border-astro-blue/70 focus:outline-none focus:ring-2 focus:ring-astro-blue/20 disabled:cursor-not-allowed disabled:opacity-70"
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                aria-label="Send message to Astroboat"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-astro-gold/45 bg-astro-gold px-5 py-3 text-sm font-semibold text-astro-bg shadow-[0_8px_24px_rgba(214,168,79,0.12)] transition hover:-translate-y-0.5 hover:bg-[#e3bb63] focus:outline-none focus:ring-2 focus:ring-astro-gold/35 disabled:translate-y-0 disabled:cursor-not-allowed disabled:border-astro-border disabled:bg-astro-surface disabled:text-astro-muted disabled:shadow-none"
              >
                {isSending ? (
                  <>
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" aria-hidden="true" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </AstroCard>

      <aside className="space-y-3">
        <AstroCard className="p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-astro-gold">Good questions</p>
          <div className="mt-3 flex flex-col gap-2">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <PromptButton key={prompt} prompt={prompt} onClick={() => handlePromptClick(prompt)} />
            ))}
          </div>
        </AstroCard>
        <AstroCard className="p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-astro-gold">Live data note</p>
          <p className="mt-3 text-sm leading-6 text-astro-muted">
            For live launches, Moon data, and asteroid approaches, use Astroboat&apos;s dedicated pages. The assistant explains concepts and context.
          </p>
        </AstroCard>
      </aside>
    </section>
  );
}

function StarterState({ onPromptClick }: { onPromptClick: (prompt: string) => void }) {
  return (
    <div className="flex min-h-[20rem] flex-col items-center justify-center rounded-xl border border-astro-border bg-astro-bg/35 px-4 py-8 text-center">
      <div className="relative mb-4 grid h-14 w-14 place-items-center rounded-full border border-astro-blue/30 bg-astro-blue/10" aria-hidden="true">
        <span className="h-3 w-3 rounded-full bg-astro-gold" />
        <span className="absolute h-9 w-9 rounded-full border border-astro-gold/30" />
        <span className="absolute h-px w-12 rotate-[-18deg] bg-astro-blue/45" />
      </div>
      <h2 className="font-display text-2xl font-normal text-astro-text">What would you like to explore?</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-astro-muted">Ask about Moon phases, asteroids, space events, or astronomy basics.</p>
      <div className="mt-5 flex max-w-2xl flex-wrap justify-center gap-2">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <PromptButton key={prompt} prompt={prompt} onClick={() => onPromptClick(prompt)} />
        ))}
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <article
      className={cn(
        "max-w-[92%] rounded-2xl border px-3.5 py-3 text-sm leading-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.035)] sm:max-w-[78%] sm:px-4",
        isUser
          ? "ml-auto border-astro-gold/35 bg-astro-gold/10 text-astro-text"
          : "mr-auto border-astro-blue/30 bg-astro-bg/80 text-astro-text"
      )}
    >
      <p className={cn("mb-1 font-mono text-[10px] uppercase tracking-[0.18em]", isUser ? "text-astro-gold" : "text-astro-blue")}>
        {isUser ? "You" : "Astroboat"}
      </p>
      <p className="whitespace-pre-wrap">{message.text}</p>
    </article>
  );
}

function TypingIndicator() {
  return (
    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-astro-blue/25 bg-astro-bg/80 px-3 py-2 text-sm text-astro-muted">
      <span>Astroboat is thinking</span>
      <span className="flex gap-1" aria-hidden="true">
        {[0, 120, 240].map((delay) => (
          <span key={delay} className="h-1.5 w-1.5 animate-pulse rounded-full bg-astro-blue" style={{ animationDelay: `${delay}ms` }} />
        ))}
      </span>
    </div>
  );
}

function ErrorNotice({ message }: { message: string }) {
  return (
    <p className="mb-3 rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm leading-6 text-red-100">
      {message}
    </p>
  );
}

function PromptButton({ prompt, onClick }: { prompt: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-astro-border bg-astro-bg/70 px-3 py-2 text-left text-xs leading-5 text-astro-muted transition hover:border-astro-blue/50 hover:bg-astro-blue/10 hover:text-astro-text focus:outline-none focus:ring-2 focus:ring-astro-blue/25"
    >
      {prompt}
    </button>
  );
}

async function safeReadJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function cleanAssistantError(error?: string) {
  if (!error || /html|cannot post|stack|http|cloud run|fetch/i.test(error)) {
    return "Astroboat Assistant is temporarily unavailable. Please try again later.";
  }

  return error;
}
