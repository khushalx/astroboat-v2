"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { searchIndex, quickSearchItems, type SearchIndexItem } from "@/lib/search-index";
import { cn } from "@/lib/utils";

const searchEventName = "astroboat:open-search";

type SearchTriggerProps = {
  className?: string;
  showShortcut?: boolean;
};

export function SearchTrigger({ className, showShortcut = false }: SearchTriggerProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-md border border-astro-border bg-astro-surface/90 px-3 py-2 text-sm text-astro-muted transition hover:border-astro-blue/45 hover:bg-astro-elevated hover:text-astro-blue focus:outline-none focus:ring-2 focus:ring-astro-blue/40",
        className
      )}
      aria-label="Open Astroboat search"
      onClick={() => window.dispatchEvent(new Event(searchEventName))}
    >
      <span className="relative h-3 w-3 rounded-full border border-current" aria-hidden="true">
        <span className="absolute -right-1 -bottom-1 h-1.5 w-px rotate-[-45deg] bg-current" />
      </span>
      <span>{showShortcut ? "Search Astroboat..." : "Search"}</span>
      {showShortcut ? (
        <span className="hidden rounded border border-astro-border bg-astro-bg/60 px-1.5 py-0.5 font-mono text-[10px] text-astro-muted xl:inline">
          Cmd K
        </span>
      ) : null}
    </button>
  );
}

export function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const trimmedQuery = query.trim();
  const results = useMemo(() => filterSearchResults(trimmedQuery), [trimmedQuery]);
  const visibleResults = trimmedQuery ? results : quickSearchItems;

  const closeSearch = useCallback(() => {
    setOpen(false);
    setQuery("");
    window.setTimeout(() => returnFocusRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    function openSearch() {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setOpen(true);
    }

    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable);

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openSearch();
        return;
      }

      if (event.key === "/" && !isTyping && !open) {
        event.preventDefault();
        openSearch();
        return;
      }

      if (event.key === "Escape" && open) {
        event.preventDefault();
        closeSearch();
      }
    }

    window.addEventListener(searchEventName, openSearch);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(searchEventName, openSearch);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeSearch, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => inputRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function navigateTo(item: SearchIndexItem) {
    closeSearch();
    router.push(item.url);
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 py-16 sm:py-24" role="dialog" aria-modal="true" aria-label="Astroboat search">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-astro-bg/80 backdrop-blur-sm"
        aria-label="Close search"
        onClick={closeSearch}
      />
      <div className="relative w-full max-w-2xl overflow-hidden rounded-lg border border-astro-border bg-astro-surface shadow-[0_24px_90px_rgba(0,0,0,0.48)]">
        <div className="border-b border-astro-border p-4">
          <label className="block">
            <span className="sr-only">Search Astroboat</span>
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Moon, Events, Briefs, Asteroids, NASA, Launch, or NEO..."
              className="w-full rounded-md border border-astro-border bg-astro-bg px-4 py-3 text-base text-astro-text placeholder:text-astro-muted focus:outline-none focus:ring-2 focus:ring-astro-blue/40"
            />
          </label>
          <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-astro-muted">
            <span>Cmd K / Ctrl K</span>
            <span className="h-1 w-1 rounded-full bg-astro-border" />
            <span>/ to open</span>
            <span className="h-1 w-1 rounded-full bg-astro-border" />
            <span>Esc to close</span>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-3">
          {!trimmedQuery ? (
            <p className="px-2 pb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-astro-gold">Quick links</p>
          ) : null}

          {visibleResults.length > 0 ? (
            <div className="space-y-2">
              {visibleResults.map((item) => (
                <button
                  key={item.url}
                  type="button"
                  onClick={() => navigateTo(item)}
                  className="block w-full rounded-md border border-transparent p-3 text-left transition hover:border-astro-blue/35 hover:bg-astro-elevated focus:outline-none focus:ring-2 focus:ring-astro-blue/40"
                >
                  <span className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <span>
                      <span className="block text-base font-semibold text-astro-text">{item.title}</span>
                      <span className="mt-1 block text-sm leading-6 text-astro-muted">{item.description}</span>
                    </span>
                    <span className="w-fit rounded-full border border-astro-border bg-astro-bg/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-astro-blue">
                      {item.kind}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-astro-border bg-astro-bg/35 p-6 text-center">
              <h2 className="text-base font-semibold text-astro-text">No matching sky tool found</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-astro-muted">
                Try searching for Moon, Events, Briefs, Asteroids, NASA, Launch, or NEO.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function filterSearchResults(query: string) {
  const normalized = query.toLowerCase();

  if (!normalized) {
    return quickSearchItems;
  }

  return searchIndex.filter((item) => {
    const searchable = [item.title, item.description, item.kind, ...item.keywords].join(" ").toLowerCase();

    return searchable.includes(normalized);
  });
}
