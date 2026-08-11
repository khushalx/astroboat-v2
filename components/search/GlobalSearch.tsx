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
        "glass-control inline-flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm text-astro-muted transition hover:border-astro-blue/30 hover:text-astro-text focus:outline-none focus:ring-2 focus:ring-astro-blue/35",
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
        <span className="hidden rounded border border-astro-border/80 bg-white/[0.025] px-1.5 py-0.5 text-[10px] text-[color:var(--text-dim)] xl:inline">
          ⌘K
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
    <div className="fixed inset-0 z-50 flex items-start justify-center px-3 py-8 sm:px-4 sm:py-20" role="dialog" aria-modal="true" aria-label="Astroboat search">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-[#03050a]/80 backdrop-blur-sm"
        aria-label="Close search"
        onClick={closeSearch}
      />
      <div className="astro-card relative w-full max-w-xl overflow-hidden rounded-xl border">
        <div className="border-b border-astro-border/70 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-base font-semibold text-astro-text">Search Astroboat</p>
              <p className="mt-0.5 text-xs text-astro-muted">Find astronomy tools and sections.</p>
            </div>
            <button
              type="button"
              onClick={closeSearch}
              className="grid h-9 w-9 place-items-center rounded-lg border border-astro-border/80 bg-white/[0.025] text-sm text-astro-muted transition hover:text-astro-text focus:outline-none focus:ring-2 focus:ring-astro-blue/30"
              aria-label="Close search"
            >
              ×
            </button>
          </div>
          <label className="block">
            <span className="sr-only">Search Astroboat</span>
            <span className="relative block">
              <span className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border border-astro-blue" aria-hidden="true">
                <span className="absolute -bottom-1 -right-1 h-1.5 w-px rotate-[-45deg] bg-astro-blue" />
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search Moon, events, briefs, asteroids..."
                className="w-full rounded-lg border border-astro-border bg-astro-bg/70 py-3 pl-11 pr-4 text-base text-astro-text placeholder:text-[color:var(--text-dim)] focus:border-astro-blue/45 focus:outline-none focus:ring-2 focus:ring-astro-blue/15"
              />
            </span>
          </label>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-[color:var(--text-dim)]">
            <span>Cmd K / Ctrl K</span>
            <span className="h-1 w-1 rounded-full bg-astro-border" />
            <span>/ to open</span>
            <span className="h-1 w-1 rounded-full bg-astro-border" />
            <span>Esc to close</span>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 sm:p-3">
          {!trimmedQuery ? (
            <p className="px-2 py-2 text-xs font-medium text-astro-muted">Quick destinations</p>
          ) : (
            <p className="px-2 py-2 text-xs font-medium text-astro-muted">{visibleResults.length} result{visibleResults.length === 1 ? "" : "s"}</p>
          )}

          {visibleResults.length > 0 ? (
            <div>
              {visibleResults.map((item) => (
                <button
                  key={item.url}
                  type="button"
                  onClick={() => navigateTo(item)}
                  className="group block w-full rounded-lg border border-transparent p-3 text-left transition hover:bg-white/[0.035] focus:outline-none focus:ring-2 focus:ring-astro-blue/30"
                >
                  <span className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <span>
                      <span className="block text-base font-semibold text-astro-text transition group-hover:text-white">{item.title}</span>
                      <span className="mt-1 block text-sm leading-6 text-astro-muted">{item.description}</span>
                    </span>
                    <span className="w-fit rounded-md border border-astro-border/80 px-2 py-1 text-[10px] text-astro-muted">
                      {item.kind}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-astro-border bg-white/[0.015] p-7 text-center">
              <h2 className="font-display text-xl font-normal text-astro-text">No matching sky tool found</h2>
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
