"use client";

import { useMemo, useState } from "react";
import { AstroCard } from "@/components/ui/AstroCard";
import { DataBadge } from "@/components/ui/DataBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar } from "@/components/ui/FilterBar";
import { MetricCard } from "@/components/ui/MetricCard";
import { SourceBadge } from "@/components/ui/SourceBadge";
import type { NearEarthObject } from "@/lib/types";
import {
  formatKilometers,
  formatLunarDistance,
  formatSpeedKps,
  humanizeToken
} from "@/lib/utils";

const asteroidFilters = ["All", "Safe", "Watch", "Notable", "Closest", "Fastest", "This Week", "This Month"];

type AsteroidWatchClientProps = {
  objects: NearEarthObject[];
};

export function AsteroidWatchClient({ objects }: AsteroidWatchClientProps) {
  const [activeFilter, setActiveFilter] = useState(asteroidFilters[0]);
  const filteredObjects = useMemo(() => filterObjects(objects, activeFilter), [activeFilter, objects]);
  const closest = useMemo(() => findClosest(objects), [objects]);
  const fastest = useMemo(() => findFastest(objects), [objects]);
  const watchCount = objects.filter((object) => object.riskLevel === "watch" || object.riskLevel === "notable").length;
  const sourceLabel = objects.some((object) => object.source === "JPL SBDB")
    ? "JPL SBDB"
    : objects.some((object) => object.source === "NASA NeoWs")
      ? "NASA NeoWs"
      : "Mock";
  const usingFallback = objects.some((object) => object.isFallback);

  return (
    <>
      {usingFallback ? (
        <div className="rounded-lg border border-astro-gold/35 bg-astro-gold/10 p-4 text-sm leading-6 text-astro-text">
          Live asteroid data is temporarily unavailable. Showing saved Astroboat sample data.
        </div>
      ) : null}

      <AstroCard className="border-astro-gold/35 bg-astro-gold/10 p-5">
        <p className="font-semibold text-astro-text">Asteroid Watch is educational. A close approach does not mean an impact threat.</p>
        <p className="mt-2 text-sm leading-6 text-astro-muted">
          Close-approach data is sourced from NASA/JPL SBDB. Optional estimated size data may use NASA NeoWs when available.
        </p>
      </AstroCard>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Tracked objects" value={objects.length} />
        <MetricCard label="Closest pass" value={closest ? formatLunarDistance(closest.distanceLunar) : "Unavailable"} />
        <MetricCard label="Fastest object" value={fastest ? formatSpeedKps(fastest.speedKps) : "Unavailable"} />
        <MetricCard label="Watch/notable" value={watchCount} />
        <MetricCard label="Data source" value={sourceLabel} />
      </div>

      <FilterBar filters={asteroidFilters} activeFilter={activeFilter} ariaLabel="Asteroid filters" onFilterChange={setActiveFilter} />

      <div className="space-y-4">
        {filteredObjects.length > 0 ? (
          filteredObjects.map((neo) => <NeoCard key={neo.id} neo={neo} />)
        ) : (
          <EmptyState title="No matching objects" description="Try another filter or check back after the next cached update." />
        )}
      </div>
    </>
  );
}

function NeoCard({ neo }: { neo: NearEarthObject }) {
  return (
    <AstroCard as="article" className="p-5 sm:p-6" interactive>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-astro-muted">Object</p>
          <h2 className="mt-2 text-xl font-semibold text-astro-text">{neo.name}</h2>
          <p className="mt-2 font-mono text-xs text-astro-blue">{neo.closeApproachDateDisplay}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DataBadge label={humanizeToken(neo.riskLevel)} />
          <SourceBadge source={neo.source} />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-4">
        <Detail label="Distance" value={formatKilometers(neo.distanceKm)} />
        <Detail label="Lunar distance" value={formatLunarDistance(neo.distanceLunar)} />
        <Detail label="Speed" value={formatSpeedKps(neo.speedKps)} />
        <Detail label="Estimated size" value={neo.estimatedDiameterDisplay} />
      </dl>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-astro-muted">
          <span>Distance comparison</span>
          <span>{neo.distanceComparison}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full border border-astro-border bg-astro-bg">
          <div className="h-full rounded-full bg-gradient-to-r from-astro-blue/60 to-astro-gold/75" style={{ width: `${distanceBarWidth(neo.distanceLunar)}%` }} />
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-astro-border bg-astro-bg/35 p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-astro-gold">Risk context</p>
          <p className="mt-2 text-sm leading-6 text-astro-muted">{neo.riskExplanation}</p>
        </div>
        <div className="rounded-lg border border-astro-border bg-astro-bg/35 p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-astro-blue">Why it matters</p>
          <p className="mt-2 text-sm leading-6 text-astro-muted">{neo.whyItMatters}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-astro-muted">
        <span>{neo.sizeComparison}</span>
        {neo.sourceUrl ? (
          <a
            href={neo.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-astro-border px-3 py-2 text-sm text-astro-text transition hover:border-astro-blue/45 hover:text-astro-blue focus:outline-none focus:ring-2 focus:ring-astro-blue/40"
          >
            Source
          </a>
        ) : null}
      </div>
    </AstroCard>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-astro-muted">{label}</dt>
      <dd className="mt-1 text-sm text-astro-text">{value}</dd>
    </div>
  );
}

function filterObjects(objects: NearEarthObject[], activeFilter: string) {
  const now = new Date();
  const weekEnd = addDays(now, 7);
  const filtered = objects.filter((object) => {
    const date = new Date(object.closeApproachDateUtc ?? `${object.closeApproachDate}T00:00:00Z`);

    switch (activeFilter) {
      case "Safe":
        return object.riskLevel === "safe";
      case "Watch":
        return object.riskLevel === "watch";
      case "Notable":
        return object.riskLevel === "notable";
      case "This Week":
        return !Number.isNaN(date.getTime()) && date >= now && date <= weekEnd;
      case "This Month":
        return !Number.isNaN(date.getTime()) && date.getUTCMonth() === now.getUTCMonth() && date.getUTCFullYear() === now.getUTCFullYear();
      default:
        return true;
    }
  });

  if (activeFilter === "Closest") {
    return [...filtered].sort((a, b) => a.distanceKm - b.distanceKm);
  }

  if (activeFilter === "Fastest") {
    return [...filtered].sort((a, b) => b.speedKps - a.speedKps);
  }

  return filtered;
}

function findClosest(objects: NearEarthObject[]) {
  return [...objects].sort((a, b) => a.distanceKm - b.distanceKm)[0];
}

function findFastest(objects: NearEarthObject[]) {
  return [...objects].sort((a, b) => b.speedKps - a.speedKps)[0];
}

function distanceBarWidth(distanceLunar?: number) {
  if (typeof distanceLunar !== "number" || !Number.isFinite(distanceLunar)) {
    return 12;
  }

  return Math.max(8, Math.min(100, 100 - distanceLunar * 3));
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}
