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
      className="mission-surface flex gap-2 overflow-x-auto rounded-lg border border-astro-border/80 bg-astro-surface/45 p-2"
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
              "min-w-fit rounded-full border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-astro-blue/40",
              active
                ? "border-astro-gold/45 bg-astro-gold/10 text-astro-text shadow-[0_0_0_1px_rgba(214,168,79,0.08)]"
                : "border-astro-border/80 bg-astro-bg/25 text-astro-muted hover:border-astro-blue/45 hover:text-astro-blue"
            )}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
