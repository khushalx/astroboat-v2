"use client";



type FilterBarProps = {
  filters: string[];
  activeFilter?: string;
  ariaLabel: string;
  onFilterChange?: (filter: string) => void;
};

export function FilterBar({ filters, activeFilter = filters[0], ariaLabel, onFilterChange }: FilterBarProps) {
  return (
    <div
      className="filter-bar"
      role="group"
      aria-label={ariaLabel}
    >
      {filters.map((filter) => {
        const active = filter === activeFilter;

        return (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange?.(filter)}
            aria-pressed={active}
            className="filter-button"
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
