"use client";

import { useMemo, useState } from "react";
import { AstroCard } from "@/components/ui/AstroCard";
import { DataBadge } from "@/components/ui/DataBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar } from "@/components/ui/FilterBar";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { SatellitePassVisual } from "@/components/visuals/SatellitePassVisual";
import type { SatelliteFinderData, SatellitePass } from "@/lib/types";
import { formatDegrees, formatElevation, humanizeToken } from "@/lib/utils";

const passFilters = ["All passes", "Excellent", "Good", "Fair", "This Week"];

type SatelliteFinderClientProps = {
  data: SatelliteFinderData;
};

export function SatelliteFinderClient({ data }: SatelliteFinderClientProps) {
  const [activeFilter, setActiveFilter] = useState(passFilters[0]);
  const filteredPasses = useMemo(() => filterPasses(data.passes, activeFilter), [activeFilter, data.passes]);

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-astro-text">Visible passes</h2>
        <FilterBar filters={passFilters} activeFilter={activeFilter} ariaLabel="Satellite pass filters" onFilterChange={setActiveFilter} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {filteredPasses.length > 0 ? (
          filteredPasses.map((pass) => <PassCard key={pass.id} pass={pass} />)
        ) : (
          <EmptyState title="No matching passes" description="Try another filter or check back after the next cached update." />
        )}
      </div>
    </section>
  );
}

function PassCard({ pass }: { pass: SatellitePass }) {
  return (
    <AstroCard as="article" className="p-5" interactive>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-astro-muted">{pass.satelliteName}</p>
          <h3 className="mt-2 text-xl font-semibold text-astro-text">{pass.startTimeDisplay}</h3>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <DataBadge label={humanizeToken(pass.visibilityQuality)} />
          <SourceBadge source={pass.source} />
        </div>
      </div>

      <SatellitePassVisual
        className="mt-3"
        maxElevationDegrees={pass.maxElevationDegrees}
        startAzimuthCompass={pass.startAzimuthCompass}
        endAzimuthCompass={pass.endAzimuthCompass}
        durationSeconds={pass.durationSeconds}
      />

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <Detail label="Max elevation" value={formatElevation(pass.maxElevationDegrees)} />
        <Detail label="Duration" value={pass.durationDisplay} />
        <Detail label="Start direction" value={pass.startAzimuthCompass ?? formatDegrees(pass.startAzimuthDegrees)} />
        <Detail label="End direction" value={pass.endAzimuthCompass ?? formatDegrees(pass.endAzimuthDegrees)} />
        <Detail label="Peak time" value={pass.maxTimeDisplay ?? "Peak unavailable"} />
        <Detail label="Magnitude" value={typeof pass.magnitude === "number" ? pass.magnitude.toFixed(1) : "Unavailable"} />
      </dl>

      <p className="mt-4 border-l border-astro-blue/45 pl-3 text-sm leading-6 text-astro-muted">{pass.viewingAdvice}</p>
    </AstroCard>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-astro-muted">{label}</dt>
      <dd className="mt-1 text-astro-text">{value}</dd>
    </div>
  );
}

function filterPasses(passes: SatellitePass[], activeFilter: string) {
  const now = new Date();
  const weekEnd = addDays(now, 7);

  return passes.filter((pass) => {
    const start = new Date(pass.startTimeUtc);

    switch (activeFilter) {
      case "Excellent":
        return pass.visibilityQuality === "excellent";
      case "Good":
        return pass.visibilityQuality === "good";
      case "Fair":
        return pass.visibilityQuality === "fair";
      case "This Week":
        return !Number.isNaN(start.getTime()) && start >= now && start <= weekEnd;
      default:
        return true;
    }
  });
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}
