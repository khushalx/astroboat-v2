"use client";

import Link from "next/link";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [failedMessage, setFailedMessage] = useState("");

  useEffect(() => {
    if (messages.length > 0 || isSending) {
      const panel = scrollRef.current;
      panel?.scrollTo({ top: panel.scrollHeight, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
  }, [messages, isSending]);

  async function sendMessage(value: string, retry = false) {
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

    if (!retry) setMessages((current) => [...current, userMessage]);
    setInput("");
    setError("");
    setIsSending(true);

    try {
      const response = await fetch("/api/astrobot", {
        method: "POST",
        signal: AbortSignal.timeout(30000),
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const data = (await safeReadJson(response)) as { answer?: string; error?: string };

      if (!response.ok) {
        setError(cleanAssistantError(data.error));
        setFailedMessage(message);
        return;
      }

      const answer = data.answer?.trim();
      setFailedMessage("");

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: answer || "Astroboat Assistant is temporarily unavailable. Please try again later."
        }
      ]);
    } catch {
      setFailedMessage(message);
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
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
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
    <section className="assistant-shell space-y-4">
      <AstroCard as="section" className="p-0">
        <div className="assistant-panel flex flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-astro-border/70 px-4 py-4 sm:px-6">
            <div>
              <p className="text-sm font-semibold text-astro-text">Astronomy conversation</p>
              <p className="mt-1 text-xs text-astro-muted">An astronomy-focused AI · Answers can contain mistakes.</p>
            </div>
            {hasUserMessages && <button type="button" disabled={isSending} onClick={() => { setMessages([]); setError(""); setFailedMessage(""); setInput(""); inputRef.current?.focus(); }} className="cosmic-secondary shrink-0 px-3 py-2 text-xs">New conversation</button>}
          </div>

          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5" role="log" aria-label="Astronomy conversation" aria-live="polite" aria-busy={isSending}>
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
          </div>

          <div className="border-t border-astro-border/70 bg-astro-bg/35 p-3 sm:p-4">
            {error ? <div role="alert"><ErrorNotice message={error} />{failedMessage && <button type="button" disabled={isSending} className="mb-2 inline-flex min-h-11 items-center text-sm text-astro-blue" onClick={() => void sendMessage(failedMessage, true)}>Try this question again ↗</button>}</div> : null}

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
                placeholder="What are you curious about?"
                className="glass-control min-h-14 flex-1 resize-none rounded-lg px-3.5 py-3 text-sm leading-6 text-astro-text placeholder:text-[color:var(--text-dim)] focus:border-astro-blue/60 focus:outline-none focus:ring-2 focus:ring-astro-blue/20 disabled:cursor-not-allowed disabled:opacity-70"
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                aria-label="Send message to Astroboat"
                className="cosmic-primary inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-astro-gold/35 disabled:translate-y-0 disabled:cursor-not-allowed disabled:border-astro-border disabled:bg-astro-surface disabled:text-astro-muted disabled:shadow-none"
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

      <aside className="context-panel text-sm leading-6 text-astro-muted">
        For current conditions, go straight to the source-backed tools.
        <div className="assistant-links"><Link href="/moon">Lunar observatory ↗</Link><Link href="/events">Space calendar ↗</Link><Link href="/asteroids">Asteroid watch ↗</Link></div>
      </aside>
    </section>
  );
}

function StarterState({ onPromptClick }: { onPromptClick: (prompt: string) => void }) {
  return (
    <div className="assistant-starter">
      <span className="starter-symbol mb-4 grid h-12 w-12 place-items-center rounded-full border border-astro-blue/20 bg-astro-blue/[0.05] text-lg text-astro-blue" aria-hidden="true">
        ✦
      </span>
      <h2 className="font-display text-2xl font-normal text-astro-text sm:text-3xl">What would you like to explore?</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-astro-muted">Start with a question. Follow your curiosity.</p>
      <div className="assistant-prompts">
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
        "chat-message max-w-[92%] rounded-xl border px-3.5 py-3 text-sm leading-6 sm:max-w-[78%] sm:px-4",
        isUser
          ? "ml-auto border-astro-gold/25 bg-astro-gold/[0.07] text-astro-text"
          : "mr-auto border-astro-border bg-white/[0.025] text-astro-text"
      )}
    >
      <p className={cn("mb-1 text-xs font-semibold", isUser ? "text-astro-gold" : "text-astro-blue")}>
        {isUser ? "You" : "Astroboat"}
      </p>
      <p className="whitespace-pre-wrap">{message.text}</p>
    </article>
  );
}

function TypingIndicator() {
  return (
    <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-astro-border bg-white/[0.025] px-3 py-2 text-sm text-astro-muted">
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
      className="focus-visible:outline-astro-gold"
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
  if (!error || /html|cannot post|stack|http|cloud run|fetch|not configured|api key/i.test(error)) {
    return "Astroboat Assistant is temporarily unavailable. Please try again later.";
  }

  return error;
}
