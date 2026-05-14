"use client";

import { useMemo, useState } from "react";
import { AstroCard } from "@/components/ui/AstroCard";
import { DataBadge } from "@/components/ui/DataBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar } from "@/components/ui/FilterBar";
import type { SpaceEvent } from "@/lib/types";
import { humanizeToken } from "@/lib/utils";

const eventFilters = ["All", "Upcoming", "Past", "Launch", "Eclipse", "Conjunction", "Meteor"];

type EventsCalendarClientProps = {
  events: SpaceEvent[];
  warnings: string[];
  lastUpdated: string;
};

export function EventsCalendarClient({ events, warnings, lastUpdated }: EventsCalendarClientProps) {
  const [activeFilter, setActiveFilter] = useState(eventFilters[0]);
  const filteredEvents = useMemo(() => filterEvents(events, activeFilter), [activeFilter, events]);

  return (
    <>
      <div className="rounded-lg border border-astro-border bg-astro-surface/70 p-3.5 text-sm leading-6 text-astro-muted sm:p-4">
        <p>Launch Library data from The Space Devs. Selected sky events may be curated by Astroboat.</p>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-dim)]">
          Last checked {formatDateTimeUtc(lastUpdated)}
        </p>
      </div>

      {warnings.map((warning) => (
        <div key={warning} className="rounded-lg border border-astro-gold/35 bg-astro-gold/10 p-3.5 text-sm leading-6 text-astro-text">
          {warning}
        </div>
      ))}

      <FilterBar filters={eventFilters} activeFilter={activeFilter} ariaLabel="Event filters" onFilterChange={setActiveFilter} />

      {filteredEvents.length > 0 ? (
        <div className="space-y-3">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <EmptyState title="No matching events" description="Try a different filter or check back after the next cached update." />
      )}
    </>
  );
}

function EventCard({ event }: { event: SpaceEvent }) {
  const past = isPastEvent(event);
  const sourceHref = event.webcastUrl ?? event.sourceUrl;

  return (
    <AstroCard as="article" className={past ? "p-3.5 opacity-65 sm:p-4" : "p-3.5 sm:p-4"} interactive>
      <div className="grid gap-4 sm:grid-cols-[88px_1fr]">
        <time dateTime={event.dateUtc} className="rounded-lg border border-astro-border bg-astro-bg/40 p-3 text-center">
          <span className="block font-mono text-2xl font-semibold leading-none text-astro-blue">{formatDay(event.dateUtc)}</span>
          <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.2em] text-astro-muted">{formatMonth(event.dateUtc)}</span>
          <span className="mt-1 block font-mono text-[11px] text-[color:var(--text-dim)]">{formatYear(event.dateUtc)}</span>
        </time>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <DataBadge label={humanizeToken(event.category)} />
            <DataBadge label={past ? "Past" : getEventStatus(event)} />
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--text-dim)]">{event.source}</span>
          </div>

          <h2 className="mt-3 line-clamp-2 text-base font-semibold leading-6 text-astro-text">{event.title}</h2>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-astro-muted">
            <span className="font-mono text-astro-blue">{event.dateDisplay}</span>
            <span>{event.provider ?? event.agency ?? event.location}</span>
          </div>

          {sourceHref ? (
            <div className="mt-3 flex justify-end">
              <a
                href={sourceHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center rounded-md border border-astro-border px-3 py-2 text-sm text-astro-text transition hover:border-astro-blue/45 hover:text-astro-blue focus:outline-none focus:ring-2 focus:ring-astro-blue/40"
              >
                Source <span className="ml-1" aria-hidden="true">→</span>
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </AstroCard>
  );
}

function filterEvents(events: SpaceEvent[], activeFilter: string) {
  const now = Date.now();

  return events.filter((event) => {
    const date = new Date(event.dateUtc);

    if (Number.isNaN(date.getTime())) {
      return false;
    }

    const searchText = `${event.title} ${event.category} ${event.description}`.toLowerCase();

    switch (activeFilter) {
      case "Upcoming":
        return date.getTime() >= now;
      case "Past":
        return date.getTime() < now;
      case "Launch":
        return event.category === "launch";
      case "Eclipse":
        return searchText.includes("eclipse");
      case "Conjunction":
        return searchText.includes("conjunction");
      case "Meteor":
        return searchText.includes("meteor");
      default:
        return true;
    }
  });
}

function getEventStatus(event: SpaceEvent) {
  if (event.status === "live") {
    return "Live";
  }

  return "Upcoming";
}

function isPastEvent(event: SpaceEvent) {
  const date = new Date(event.dateUtc);

  return !Number.isNaN(date.getTime()) && date.getTime() < Date.now();
}

function formatDateTimeUtc(dateUtc: string) {
  const date = new Date(dateUtc);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
    hour12: false
  }).format(date);
}

function formatDay(dateUtc: string) {
  return formatPart(dateUtc, { day: "2-digit" });
}

function formatMonth(dateUtc: string) {
  return formatPart(dateUtc, { month: "short" });
}

function formatYear(dateUtc: string) {
  return formatPart(dateUtc, { year: "numeric" });
}

function formatPart(dateUtc: string, options: Intl.DateTimeFormatOptions) {
  const date = new Date(dateUtc);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return new Intl.DateTimeFormat("en", { ...options, timeZone: "UTC" }).format(date);
}
