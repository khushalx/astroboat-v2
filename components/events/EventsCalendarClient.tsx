"use client";

import { useMemo, useState } from "react";
import { AstroCard } from "@/components/ui/AstroCard";
import { DataBadge } from "@/components/ui/DataBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar } from "@/components/ui/FilterBar";
import { EventImage } from "@/components/events/EventImage";
import type { SpaceEvent } from "@/lib/types";
import { humanizeToken } from "@/lib/utils";

const eventFilters = ["Upcoming", "Launches", "Sky Events", "Past", "Eclipse", "Meteor", "Conjunction"];

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
      <div className="grid gap-3 border-y border-astro-border/70 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div>
          <p className="max-w-2xl text-sm leading-6 text-astro-muted">
            Launch data comes from The Space Devs. Selected sky events may be curated by Astroboat.
          </p>
        </div>
        <div className="text-xs text-astro-muted sm:text-right">
          <span>Last updated </span>
          <time className="font-mono text-astro-text">{formatDateTimeUtc(lastUpdated)}</time>
        </div>
      </div>

      {warnings.map((warning) => (
        <div key={warning} className="rounded-lg border border-astro-gold/25 bg-astro-gold/[0.06] p-4 text-sm leading-6 text-astro-text">
          {warning}
        </div>
      ))}

      <FilterBar filters={eventFilters} activeFilter={activeFilter} ariaLabel="Event filters" onFilterChange={setActiveFilter} />

      {filteredEvents.length > 0 ? (
        <AstroCard className="divide-y divide-astro-border/70 p-0">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </AstroCard>
      ) : (
        <EmptyState title="No upcoming events found" description="Try another filter or check back later for new space events." />
      )}
    </>
  );
}

function EventCard({ event }: { event: SpaceEvent }) {
  const past = isPastEvent(event);
  const sourceHref = event.sourceUrl;
  const statusLabel = past ? "Past" : getEventStatus(event);
  const sourceLabel = getPublicSourceLabel(event);
  const locationLine = event.provider ?? event.agency ?? event.location;

  return (
    <article className="group p-3 transition-colors hover:bg-white/[0.018] sm:p-4">
      <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4 sm:grid-cols-[9.5rem_minmax(0,1fr)]">
        <EventImage src={event.imageUrl} alt={`${event.title} event image`} category={event.category} className="!h-full min-h-28" />

        <div className="flex min-w-0 flex-col">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <DataBadge label={humanizeToken(event.category)} />
              <DataBadge label={statusLabel} />
            </div>
            {sourceLabel ? <span className="hidden text-xs text-[color:var(--text-dim)] sm:inline">{sourceLabel}</span> : null}
          </div>

          <h2 className="mt-2.5 line-clamp-2 font-display text-lg font-normal leading-6 text-astro-text transition group-hover:text-white sm:text-xl sm:leading-7">{event.title}</h2>

          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-astro-muted">
            <time dateTime={event.dateUtc} className="font-mono text-astro-blue">
              {formatEventDate(event.dateUtc)} • {formatEventTime(event.dateUtc)}
            </time>
            <span className="min-w-0 truncate">{locationLine}</span>
          </div>

          {event.description ? (
            <p className="mt-2 hidden line-clamp-2 text-sm leading-6 text-astro-muted sm:block">{event.description}</p>
          ) : null}

          {sourceHref ? (
            <div className="mt-auto pt-2">
              <a
                href={sourceHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-astro-blue transition hover:text-astro-text focus:outline-none focus:ring-2 focus:ring-astro-blue/35"
              >
                Source <span aria-hidden="true">↗</span>
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function filterEvents(events: SpaceEvent[], activeFilter: string) {
  return events.filter((event) => {
    const searchText = `${event.title} ${event.category} ${event.description}`.toLowerCase();
    const upcoming = isUpcomingEvent(event);
    const past = isPastEvent(event);

    switch (activeFilter) {
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
