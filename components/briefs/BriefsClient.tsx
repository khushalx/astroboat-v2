"use client";

import { useMemo, useState } from "react";
import { BriefCard } from "@/components/briefs/BriefCard";
import { FeaturedBriefCard } from "@/components/briefs/FeaturedBriefCard";
import { getBriefCategory, getFeaturedBrief } from "@/components/briefs/brief-utils";
import { AstroCard } from "@/components/ui/AstroCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar } from "@/components/ui/FilterBar";
import type { AstronomyBrief } from "@/lib/types";

const filters = ["All", "NASA", "ESA", "arXiv", "APOD", "Research", "Missions", "Planetary Science"];

type BriefsClientProps = {
  briefs: AstronomyBrief[];
};

export function BriefsClient({ briefs }: BriefsClientProps) {
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const featured = getFeaturedBrief(briefs);
  const filteredBriefs = useMemo(() => filterBriefs(briefs, activeFilter), [activeFilter, briefs]);
  const gridBriefs = filteredBriefs.filter((brief) => brief.id !== featured?.id);
  const activeSources = new Set(briefs.map((brief) => brief.source.name)).size;
  const researchPapers = briefs.filter((brief) => brief.source.name === "arXiv" || getBriefCategory(brief) === "Research").length;
  const lastUpdated = getLastUpdated(briefs);

  return (
    <div className="space-y-8">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatusCard label="Total briefs" value={briefs.length ? String(briefs.length) : "0"} />
        <StatusCard label="Active sources" value={String(activeSources)} />
        <StatusCard label="Research papers" value={String(researchPapers)} />
        <StatusCard label="Last updated" value={lastUpdated} />
      </div>

      <FilterBar filters={filters} activeFilter={activeFilter} ariaLabel="Brief filters" onFilterChange={setActiveFilter} />

      {featured ? <FeaturedBriefCard brief={featured} /> : null}

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-astro-gold">Reading list</p>
            <h2 className="mt-2 text-2xl font-semibold text-astro-text">Latest summaries</h2>
          </div>
        </div>
        {filteredBriefs.length > 0 ? (
          <div className="grid gap-5 xl:grid-cols-2">
            {(gridBriefs.length > 0 ? gridBriefs : filteredBriefs).map((brief) => (
              <BriefCard key={brief.id} brief={brief} />
            ))}
          </div>
        ) : (
          <EmptyState title="No briefs match this filter" description="Try another source or topic filter." />
        )}
      </section>
    </div>
  );
}

function StatusCard({ label, value }: { label: string; value: string }) {
  return (
    <AstroCard className="mission-surface p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-astro-muted">{label}</p>
      <p className="mt-2 text-xl font-semibold text-astro-text">{value}</p>
    </AstroCard>
  );
}

function filterBriefs(briefs: AstronomyBrief[], activeFilter: string) {
  if (activeFilter === "All") {
    return briefs;
  }

  return briefs.filter((brief) => {
    const category = getBriefCategory(brief);

    if (activeFilter === "Research") {
      return brief.source.name === "arXiv" || category === "Research" || brief.tags.some((tag) => /research|survey|paper/i.test(tag));
    }

    if (activeFilter === "Missions" || activeFilter === "Planetary Science") {
      return category === activeFilter || brief.tags.some((tag) => tag.toLowerCase() === activeFilter.toLowerCase());
    }

    return brief.source.name === activeFilter;
  });
}

function getLastUpdated(briefs: AstronomyBrief[]) {
  const latest = briefs
    .map((brief) => new Date(`${brief.publishedAt}T00:00:00Z`))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  if (!latest) {
    return "Unavailable";
  }

  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(latest);
}
