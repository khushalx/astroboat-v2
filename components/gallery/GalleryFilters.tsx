"use client";

import type { GalleryCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

type GalleryFiltersProps = {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: GalleryCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSurpriseMe: () => void;
  totalCount: number;
  filteredCount: number;
};

export function GalleryFilters({
  categories,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  onSurpriseMe,
  totalCount,
  filteredCount
}: GalleryFiltersProps) {
  return (
    <div className="mb-8 space-y-4">
      {/* Top row: Search input + Surprise Me button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-astro-muted">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search celestial objects, telescopes (JWST, Hubble, Orion)..."
            aria-label="Search astronomy gallery"
            className="w-full rounded-lg border border-astro-border/80 bg-astro-surface/70 py-2 pl-9 pr-8 text-sm text-astro-text placeholder:text-[color:var(--text-dim)] focus:border-astro-blue focus:bg-astro-surface focus:outline-none focus:ring-1 focus:ring-astro-blue/50 transition-colors"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search query"
              className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-astro-muted hover:text-astro-text"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : null}
        </div>

        {/* Action Controls: Surprise Me + Item Count */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSurpriseMe}
            className="cosmic-secondary inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium sm:text-sm focus:outline-none focus:ring-2 focus:ring-astro-blue/35"
            title="Discover a random high-resolution astronomy capture"
          >
            <svg className="h-4 w-4 text-astro-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Surprise Me</span>
          </button>

          <span className="font-mono text-xs text-[color:var(--text-dim)]">
            {filteredCount === totalCount ? `${totalCount} captures` : `${filteredCount} of ${totalCount}`}
          </span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <nav
        aria-label="Filter gallery by astronomical category"
        className="flex flex-wrap items-center gap-1.5 border-b border-astro-border/60 pb-4"
      >
        {categories.map((cat) => {
          const active = cat === activeCategory;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat as GalleryCategory)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all sm:text-sm focus:outline-none focus:ring-2 focus:ring-astro-blue/35",
                active
                  ? "border-astro-blue/40 bg-astro-blue/15 text-astro-text shadow-sm"
                  : "border-transparent bg-transparent text-astro-muted hover:border-astro-border/70 hover:bg-white/[0.03] hover:text-astro-text"
              )}
            >
              {cat}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
