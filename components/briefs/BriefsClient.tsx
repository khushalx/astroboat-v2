"use client";

import { useEffect, useMemo, useState } from "react";
import { BriefCard } from "@/components/briefs/BriefCard";
import { FeaturedBriefCard } from "@/components/briefs/FeaturedBriefCard";
import { getBriefCategory, getFeaturedBrief } from "@/components/briefs/brief-utils";
import { AstroCard } from "@/components/ui/AstroCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar } from "@/components/ui/FilterBar";
import type { AstronomyBrief, BriefsResult } from "@/lib/types";

const filters = [
  "All",
  "NASA",
  "Science",
  "Missions",
  "Solar",
  "Near-Earth"
];
const pageSize = 12;

type BriefsClientProps = {
  result: BriefsResult;
};

export function BriefsClient({ result }: BriefsClientProps) {
  const { briefs, sourceStatuses, lastChecked, latestItemDate, isFallback } = result;
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const activeSources = sourceStatuses.filter((status) => status.ok && status.count > 0).length || new Set(briefs.map((brief) => brief.source.name)).size;
  const filteredBriefs = useMemo(() => filterBriefs(briefs, activeFilter, query), [activeFilter, briefs, query]);
  const featured = getFeaturedBrief(filteredBriefs);
  const gridBriefs = filteredBriefs.filter((brief) => brief.id !== featured?.id);
  const visibleBriefs = gridBriefs.slice(0, visibleCount);
  const hasMore = visibleCount < gridBriefs.length;

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [activeFilter, query]);

  return (
    <div className="space-y-8">
      <AstroCard className="p-0">
        <div className="grid grid-cols-2 sm:grid-cols-4">
          <StatusCard label="Total briefs" value={briefs.length ? String(briefs.length) : "0"} />
          <StatusCard label="Active sources" value={String(activeSources)} />
          <StatusCard label="Latest item" value={isFallback ? "Fallback data" : formatBriefStatusDate(latestItemDate)} />
          <StatusCard label="Last checked" value={isFallback ? "Fallback data" : formatCheckedTime(lastChecked)} />
        </div>
      </AstroCard>

      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <label className="block">
            <span className="sr-only">Search briefs</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search briefs, missions, planets, JWST, asteroids..."
              className="glass-control min-h-11 w-full rounded-lg px-4 py-2.5 text-sm text-astro-text placeholder:text-[color:var(--text-dim)] focus:border-astro-blue/35 focus:outline-none focus:ring-2 focus:ring-astro-blue/15"
            />
          </label>
          <p className="text-xs text-astro-muted">
            {filteredBriefs.length} result{filteredBriefs.length === 1 ? "" : "s"}
          </p>
        </div>
        <FilterBar filters={filters} activeFilter={activeFilter} ariaLabel="Brief filters" onFilterChange={setActiveFilter} />
      </div>

      {featured ? <FeaturedBriefCard brief={featured} /> : null}

      <section>
        <h2 className="mb-5 font-display text-3xl font-normal tracking-[-0.02em] text-astro-text">Latest briefs</h2>
        {gridBriefs.length > 0 ? (
          <>
            <AstroCard className="divide-y divide-astro-border/70 p-0">
              {visibleBriefs.map((brief) => (
                <BriefCard key={brief.id} brief={brief} />
              ))}
            </AstroCard>
            {hasMore ? (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + pageSize)}
                  className="cosmic-secondary rounded-lg px-5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-astro-blue/35"
                >
                  Load more
                </button>
              </div>
            ) : null}
          </>
        ) : filteredBriefs.length === 0 ? (
          <EmptyState title="No briefs match this search" description="Try another source, topic, or mission keyword." />
        ) : null}
      </section>
    </div>
  );
}

function StatusCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-r border-astro-border/70 p-4 even:border-r-0 [&:nth-child(n+3)]:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <p className="text-xs text-astro-muted">{label}</p>
      <p className="mt-1.5 font-mono text-sm font-medium text-astro-text sm:text-base">{value}</p>
    </div>
  );
}

function filterBriefs(briefs: AstronomyBrief[], activeFilter: string, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  return briefs.filter((brief) => {
    const category = getBriefCategory(brief);
    const source = brief.source.name.toLowerCase();
    const tags = brief.tags.map((tag) => tag.toLowerCase());
    const filter = activeFilter.toLowerCase();
    const searchText = [brief.title, brief.source.name, category, ...brief.summary, ...brief.tags].join(" ").toLowerCase();
    const matchesFilter =
      activeFilter === "All" ||
      source === filter ||
      category.toLowerCase() === filter ||
      tags.some((tag) => tag === filter || tag.includes(filter)) ||
      (activeFilter === "NASA" && source.includes("nasa")) ||
      (activeFilter === "Science" && (source.includes("arxiv") || category.toLowerCase().includes("research") || searchText.includes("science"))) ||
      (activeFilter === "Missions" && (category.toLowerCase().includes("mission") || tags.some((tag) => tag.includes("mission")))) ||
      (activeFilter === "Solar" && (searchText.includes("solar") || searchText.includes("sun") || searchText.includes("space weather"))) ||
      (activeFilter === "Near-Earth" && (searchText.includes("asteroid") || searchText.includes("near-earth") || searchText.includes("neo")));

    if (!matchesFilter) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return searchText.includes(normalizedQuery);
  });
}

function formatBriefStatusDate(value?: string) {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", timeZone: "UTC" }).format(date);
}

function formatCheckedTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unavailable";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    hour12: false
  }).format(date);
}
