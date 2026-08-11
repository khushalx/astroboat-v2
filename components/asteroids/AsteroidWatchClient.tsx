"use client";

import { useEffect, useMemo, useState } from "react";
import { AstroCard } from "@/components/ui/AstroCard";
import { DataBadge } from "@/components/ui/DataBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar } from "@/components/ui/FilterBar";
import { MetricCard } from "@/components/ui/MetricCard";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { NeoApproachVisual } from "@/components/asteroids/NeoApproachVisual";
import type { NearEarthObject } from "@/lib/types";
import {
  formatKilometers,
  formatLunarDistance,
  formatSpeedKps,
  humanizeToken
} from "@/lib/utils";

const asteroidFilters = ["All", "This Week", "High Attention", "Low Risk", "Closest", "Fastest"];
const pageSize = 8;

type AsteroidWatchClientProps = {
  objects: NearEarthObject[];
};

export function AsteroidWatchClient({ objects }: AsteroidWatchClientProps) {
  const [activeFilter, setActiveFilter] = useState(asteroidFilters[0]);
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const filteredObjects = useMemo(() => filterObjects(objects, activeFilter), [activeFilter, objects]);
  const visibleObjects = filteredObjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredObjects.length;
  const closest = useMemo(() => findClosest(objects), [objects]);
  const fastest = useMemo(() => findFastest(objects), [objects]);
  const watchCount = objects.filter((object) => object.riskLevel === "watch" || object.riskLevel === "notable").length;
  const sourceLabel = objects.some((object) => object.source === "JPL SBDB")
    ? "JPL SBDB"
    : objects.some((object) => object.source === "NASA NeoWs")
      ? "NASA NeoWs"
      : "Mock";
  const usingFallback = objects.some((object) => object.isFallback);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [activeFilter]);

  return (
    <>
      {usingFallback ? (
        <div className="rounded-lg border border-astro-gold/25 bg-astro-gold/[0.06] px-4 py-3 text-sm leading-6 text-astro-text">
          Live asteroid data is temporarily unavailable. Showing saved Astroboat sample data.
        </div>
      ) : null}

      <AstroCard className="p-0">
        <div className="grid items-center lg:grid-cols-[minmax(0,0.96fr)_minmax(20rem,1.04fr)]">
          <div className="p-5 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-astro-gold">Approach context</p>
            <h2 className="mt-3 max-w-lg font-display text-3xl font-normal leading-tight text-astro-text sm:text-[2.25rem]">
              Cosmic visitors, placed in perspective.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-astro-muted">
              A close approach does not mean an impact threat. Distances, velocities, and size estimates are shown with calm risk context.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-astro-muted">
              <span>Source: {sourceLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{objects.length} objects in this window</span>
            </div>
          </div>
          <div className="border-t border-astro-border/70 bg-white/[0.012] px-4 py-5 lg:border-l lg:border-t-0">
            <p className="px-2 text-xs font-medium text-astro-muted">Closest projected pass</p>
            <NeoApproachVisual distanceLunar={closest?.distanceLunar} />
          </div>
        </div>
      </AstroCard>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4 [&>div:last-child]:col-span-2 lg:grid-cols-3 lg:[&>div:last-child]:col-span-1 xl:grid-cols-5">
        <MetricCard label="Tracked objects" value={objects.length} />
        <MetricCard label="Closest pass" value={closest ? formatLunarDistance(closest.distanceLunar) : "Unavailable"} />
        <MetricCard label="Fastest object" value={fastest ? formatSpeedKps(fastest.speedKps) : "Unavailable"} />
        <MetricCard label="Watch/notable" value={watchCount} />
        <MetricCard label="Data source" value={sourceLabel} />
      </div>

      <FilterBar filters={asteroidFilters} activeFilter={activeFilter} ariaLabel="Asteroid filters" onFilterChange={setActiveFilter} />

      {filteredObjects.length > 0 ? (
        <section aria-label="Near-Earth object approaches">
          <p className="mb-3 text-sm text-astro-muted">
            Showing {visibleObjects.length} of {filteredObjects.length} {filteredObjects.length === 1 ? "object" : "objects"}
          </p>
          <AstroCard className="divide-y divide-astro-border/70 p-0">
            {visibleObjects.map((neo) => <NeoRow key={neo.id} neo={neo} />)}
          </AstroCard>
          {hasMore ? (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + pageSize)}
                className="cosmic-secondary rounded-lg px-5 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-astro-blue/35"
              >
                Load more objects
              </button>
            </div>
          ) : null}
        </section>
      ) : (
        <EmptyState title="No matching objects" description="Try another filter or check back after the next cached update." />
      )}
    </>
  );
}

function NeoRow({ neo }: { neo: NearEarthObject }) {
  return (
    <article className="p-4 transition-colors hover:bg-white/[0.018] sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-normal text-astro-text sm:text-2xl">{neo.name}</h2>
          <p className="mt-1 text-sm text-astro-muted">Closest approach {neo.closeApproachDateDisplay}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <DataBadge label={humanizeToken(neo.riskLevel)} />
          <SourceBadge source={neo.source} />
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 lg:grid-cols-4">
        <Detail label="Distance" value={formatKilometers(neo.distanceKm)} />
        <Detail label="Lunar distance" value={formatLunarDistance(neo.distanceLunar)} />
        <Detail label="Speed" value={formatSpeedKps(neo.speedKps)} />
        <Detail label="Estimated size" value={neo.estimatedDiameterDisplay} />
      </dl>

      <div className="mt-4 max-w-2xl">
        <div className="mb-2 flex items-center justify-between gap-4 text-xs text-astro-muted">
          <span>Distance comparison</span>
          <span className="text-right">{neo.distanceComparison}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-astro-border/60">
          <div className="h-full rounded-full bg-astro-gold/80" style={{ width: `${distanceBarWidth(neo.distanceLunar)}%` }} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-astro-border/60 pt-3 text-sm text-astro-muted">
        <span>{neo.sizeComparison}</span>
        {neo.sourceUrl ? (
          <a
            href={neo.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-9 items-center rounded-md px-2 py-1 text-sm font-medium text-astro-blue transition hover:bg-astro-blue/[0.06] hover:text-astro-text focus:outline-none focus:ring-2 focus:ring-astro-blue/40"
          >
            Source <span className="ml-1" aria-hidden="true">→</span>
          </a>
        ) : null}
      </div>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-astro-border/60 pt-2.5">
      <dt className="text-xs text-astro-muted">{label}</dt>
      <dd className="mt-1 font-mono text-sm text-astro-text">{value}</dd>
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
      case "Low Risk":
        return object.riskLevel === "safe";
      case "Watch":
        return object.riskLevel === "watch";
      case "Notable":
        return object.riskLevel === "notable";
      case "High Attention":
        return object.riskLevel === "watch" || object.riskLevel === "notable";
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
