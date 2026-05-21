"use client";

import { useMemo, useState } from "react";
import { AstroCard } from "@/components/ui/AstroCard";
import { DataBadge } from "@/components/ui/DataBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { EventImage } from "@/components/events/EventImage";
import type { SpaceEvent } from "@/lib/types";
import { cn } from "@/lib/utils";
import { humanizeToken } from "@/lib/utils";

const eventFilters = ["All", "Upcoming", "Launches", "Sky Events", "Past", "Eclipse", "Meteor", "Conjunction"];

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
        <p>Launch data comes from The Space Devs. Selected sky events may be curated by Astroboat.</p>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-dim)]">
          Last checked {formatDateTimeUtc(lastUpdated)}
        </p>
      </div>

      {warnings.map((warning) => (
        <div key={warning} className="rounded-lg border border-astro-gold/35 bg-astro-gold/10 p-3.5 text-sm leading-6 text-astro-text">
          {warning}
        </div>
      ))}

      <EventFilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      {filteredEvents.length > 0 ? (
        <div className="space-y-3">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <EmptyState title="No upcoming events found" description="Try another filter or check back later for new space events." />
      )}
    </>
  );
}

function EventFilterBar({
  activeFilter,
  onFilterChange
}: {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}) {
  return (
    <div
      className="flex gap-1.5 overflow-x-auto rounded-lg border border-astro-border bg-astro-surface/70 p-1.5"
      aria-label="Event filters"
    >
      {eventFilters.map((filter) => {
        const active = filter === activeFilter;

        return (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            className={cn(
              "min-h-9 min-w-fit rounded-full border px-3 py-1.5 text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-astro-blue/40 sm:text-sm",
              active
                ? "border-astro-blue/45 bg-astro-blue/15 text-astro-blue"
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

function EventCard({ event }: { event: SpaceEvent }) {
  const past = isPastEvent(event);
  const sourceHref = event.sourceUrl;
  const statusLabel = past ? "Past" : getEventStatus(event);
  const sourceLabel = getPublicSourceLabel(event);
  const locationLine = event.provider ?? event.agency ?? event.location;

  return (
    <AstroCard as="article" className={past ? "p-3.5 opacity-65 sm:p-4" : "p-3.5 sm:p-4"} interactive>
      <div className="grid gap-3 md:grid-cols-[205px_minmax(0,1fr)] md:gap-4">
        <EventImage src={event.imageUrl} alt={`${event.title} event image`} category={event.category} />

        <div className="flex min-w-0 flex-col">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
            <DataBadge label={humanizeToken(event.category)} />
              <DataBadge label={statusLabel} />
            </div>
            {sourceLabel ? (
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--text-dim)]">{sourceLabel}</span>
            ) : null}
          </div>

          <h2 className="mt-3 line-clamp-2 text-base font-semibold leading-6 text-astro-text">{event.title}</h2>

          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-astro-muted">
            <time dateTime={event.dateUtc} className="font-mono text-astro-blue">
              {formatEventDate(event.dateUtc)} • {formatEventTime(event.dateUtc)}
            </time>
            <span className="min-w-0 truncate">{locationLine}</span>
          </div>

          {event.description ? (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-astro-muted">{event.description}</p>
          ) : null}

          {sourceHref ? (
            <div className="mt-3 flex justify-start md:mt-auto md:justify-end md:pt-3">
              <a
                href={sourceHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-9 items-center rounded-md border border-astro-border px-3 py-1.5 text-sm text-astro-text transition hover:border-astro-blue/45 hover:text-astro-blue focus:outline-none focus:ring-2 focus:ring-astro-blue/40"
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
  return events.filter((event) => {
    const searchText = `${event.title} ${event.category} ${event.description}`.toLowerCase();
    const upcoming = isUpcomingEvent(event);
    const past = isPastEvent(event);

    switch (activeFilter) {
      case "All":
      case "Upcoming":
        return upcoming;
      case "Past":
        return past;
      case "Launches":
        return upcoming && event.category === "launch";
      case "Sky Events":
        return upcoming && event.category === "sky_event";
      case "Eclipse":
        return upcoming && searchText.includes("eclipse");
      case "Conjunction":
        return upcoming && searchText.includes("conjunction");
      case "Meteor":
        return upcoming && searchText.includes("meteor");
      default:
        return upcoming;
    }
  });
}

function getEventStatus(event: SpaceEvent) {
  if (event.status === "live") {
    return "Live";
  }

  if (event.status === "confirmed") return "Confirmed";
  if (event.status === "to_be_confirmed" || event.status === "to_be_determined") {
    return humanizeToken(event.status);
  }
  if (event.status === "delayed" || event.status === "failed") {
    return humanizeToken(event.status);
  }

  return "Upcoming";
}

function isPastEvent(event: SpaceEvent) {
  if (event.status === "live") {
    return false;
  }

  const date = new Date(event.dateUtc);

  return !Number.isNaN(date.getTime()) && date.getTime() < Date.now();
}

function isUpcomingEvent(event: SpaceEvent) {
  if (event.status === "live") {
    return true;
  }

  const date = new Date(event.dateUtc);

  return !Number.isNaN(date.getTime()) && date.getTime() >= Date.now();
}

function getPublicSourceLabel(event: SpaceEvent) {
  if (event.source === "Mock") {
    return "Curated";
  }

  return event.source;
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

function formatEventDate(dateUtc: string) {
  return formatPart(dateUtc, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function formatEventTime(dateUtc: string) {
  return formatPart(dateUtc, {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
    hour12: false
  });
}

function formatPart(dateUtc: string, options: Intl.DateTimeFormatOptions) {
  const date = new Date(dateUtc);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return new Intl.DateTimeFormat("en", { ...options, timeZone: "UTC" }).format(date);
}
