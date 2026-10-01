"use client";

import { cn } from "@/lib/utils";

type FilterBarProps = {
  filters: string[];
  activeFilter?: string;
  ariaLabel: string;
  onFilterChange?: (filter: string) => void;
};

export function FilterBar({ filters, activeFilter = filters[0], ariaLabel, onFilterChange }: FilterBarProps) {
  return (
    <div
      className="flex flex-wrap gap-2 border-b border-astro-border/70 pb-4"
      aria-label={ariaLabel}
    >
      {filters.map((filter) => {
        const active = filter === activeFilter;

        return (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange?.(filter)}
            className={cn(
              "min-h-9 rounded-lg border px-3 py-1.5 text-xs font-medium transition sm:text-sm focus:outline-none focus:ring-2 focus:ring-astro-blue/35",
              active
                ? "border-astro-blue/30 bg-astro-blue/10 text-astro-text"
                : "border-transparent bg-transparent text-astro-muted hover:border-astro-border hover:bg-white/[0.025] hover:text-astro-text"
            )}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
