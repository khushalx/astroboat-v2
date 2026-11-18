"use client";

import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { AstroCard } from "@/components/ui/AstroCard";
import { DataBadge } from "@/components/ui/DataBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar } from "@/components/ui/FilterBar";
import { MetricCard } from "@/components/ui/MetricCard";
import { NeoApproachVisual } from "@/components/asteroids/NeoApproachVisual";
import type { NearEarthObject } from "@/lib/types";
import {
  formatKilometers,
  formatLunarDistance,
  formatSpeedKps,
} from "@/lib/utils";

const asteroidFilters = ["All", "This Week", "Within 5 LD", "Closest", "Fastest"];
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
  const sourceLabel = objects.some((object) => object.source === "JPL SBDB")
    ? "JPL SBDB"
    : objects.some((object) => object.source === "NASA NeoWs")
      ? "NASA NeoWs"
      : "Mock";
  const usingFallback = objects.some((object) => object.isFallback);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [activeFilter]);

  if (usingFallback) {
    return <EmptyState title="Approach data is unavailable" description="NASA JPL and the optional NASA backup could not be reached. Sample objects are withheld; check the original sources or return after the next refresh." />;
  }

  return (
    <>
      <section className="neo-context" aria-label="Understanding approach distances">
        <div>
          <h2>Close is a matter of perspective.</h2>
          <p>A close approach is not an impact prediction. One lunar distance (LD) is about 384,400 km: the average distance between Earth and the Moon.</p>
          <p className="!text-xs">{sourceLabel} · {objects.length} approaches in the source window</p>
        </div>
        <div>
          <p className="text-center text-xs text-astro-muted">Closest approach in this window</p>
          <NeoApproachVisual distanceLunar={closest?.distanceLunar} />
        </div>
      </section>
      <div className="neo-metrics">
        <MetricCard label="Tracked approaches" value={objects.length} />
        <MetricCard label="Closest distance" value={closest ? formatLunarDistance(closest.distanceLunar).replace(/ lunar distances?$/, " LD") : "Unavailable"} />
        <MetricCard label="Highest speed" value={fastest ? formatSpeedKps(fastest.speedKps) : "Unavailable"} />
      </div>

      <FilterBar filters={asteroidFilters} activeFilter={activeFilter} ariaLabel="Asteroid filters" onFilterChange={(filter) => { setActiveFilter(filter); trackEvent("tool_used", { tool: "asteroids", action: "filter" }); }} />

      {filteredObjects.length > 0 ? (
        <section aria-label="Near-Earth object approaches">
          <p className="mb-3 text-xs text-astro-muted" role="status">
            Showing {visibleObjects.length} of {filteredObjects.length} {filteredObjects.length === 1 ? "object" : "objects"}
          </p>
          <AstroCard className="feed-list p-0">
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
    <article className="neo-row">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2>{neo.name}</h2>
          <p className="mt-1 text-xs text-astro-muted">Approach <time dateTime={neo.closeApproachDateUtc}>{neo.closeApproachDateDisplay}</time></p>
        </div>
        <DataBadge label={neo.isPotentiallyHazardous ? "PHA classification" : (neo.distanceLunar ?? Infinity) <= 5 ? "Within 5 lunar distances" : "Distant approach"} />
      </div>
      <dl className="neo-details">
        <Detail label="Distance from Earth" value={formatKilometers(neo.distanceKm)} />
        <Detail label="In lunar distances" value={formatLunarDistance(neo.distanceLunar)} />
        <Detail label="Relative speed" value={formatSpeedKps(neo.speedKps)} />
        <Detail label="Estimated diameter" value={neo.estimatedDiameterDisplay.replace(/^Estimated /, "")} />
      </dl>
      <div className="neo-context-note">
        <p>{neo.isPotentiallyHazardous ? "Potentially hazardous is an orbital classification, not a prediction of impact." : neo.sizeComparison}</p>
        {neo.sourceUrl && <a className="inline-flex min-h-11 items-center gap-1 text-astro-blue hover:text-astro-text" href={neo.sourceUrl} target="_blank" rel="noopener noreferrer">{neo.source} <span aria-hidden="true">↗</span></a>}
      </div>
    </article>
  );
}
function Detail({ label, value }: { label: string; value: string }) {
  return <div><dt>{label}</dt><dd>{value}</dd></div>;
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
      case "Within 5 LD":
        return typeof object.distanceLunar === "number" && object.distanceLunar <= 5;
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

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}
