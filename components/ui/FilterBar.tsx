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
      className="flex gap-2 overflow-x-auto rounded-lg border border-astro-border bg-astro-surface/70 p-1.5"
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
              "min-h-11 min-w-fit rounded-full border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-astro-blue/40",
              active
                ? "border-astro-gold/45 bg-astro-gold text-astro-bg"
                : "border-transparent bg-transparent text-astro-muted hover:border-astro-border hover:text-astro-text"
            )}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
