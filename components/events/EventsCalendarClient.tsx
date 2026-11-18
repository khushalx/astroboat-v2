"use client";

import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { AstroCard } from "@/components/ui/AstroCard";
import { DataBadge } from "@/components/ui/DataBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar } from "@/components/ui/FilterBar";
import { EventImage } from "@/components/events/EventImage";
import type { SpaceEvent } from "@/lib/types";
import { isPastEvent, isUpcomingEvent } from "@/lib/event-time";
import { humanizeToken } from "@/lib/utils";

const eventFilters = ["Upcoming", "Launches", "Sky Events", "Past", "Eclipse", "Meteor", "Conjunction"];

type EventsCalendarClientProps = {
  events: SpaceEvent[];
  warnings: string[];
  lastUpdated: string;
};

export function EventsCalendarClient({ events, warnings, lastUpdated }: EventsCalendarClientProps) {
  const [activeFilter, setActiveFilter] = useState(eventFilters[0]);
  const [now, setNow] = useState(() => Date.parse(lastUpdated));
  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 60000);
    return () => window.clearInterval(timer);
  }, []);
  const filteredEvents = useMemo(() => filterEvents(events, activeFilter, now), [activeFilter, events, now]);

  return (
    <>
      <div className="feed-meta">
        <p>The Space Devs · Selected sky events by Astroboat</p>
        <p>Checked <time dateTime={lastUpdated}>{formatDateTimeUtc(lastUpdated)}</time></p>
      </div>

      {warnings.map((warning) => (
        <div key={warning} className="data-notice">
          {warning}
        </div>
      ))}

      <FilterBar filters={eventFilters} activeFilter={activeFilter} ariaLabel="Event filters" onFilterChange={(filter) => { setActiveFilter(filter); trackEvent("tool_used", { tool: "events", action: "filter" }); }} />

      {filteredEvents.length > 0 ? (
        <AstroCard className="feed-list p-0">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} now={now} />
          ))}
        </AstroCard>
      ) : (
        <EmptyState title={activeFilter === "Past" ? "No past events in this feed" : "No events in this view"} description="This feed has a limited date window. Try another filter or check the original sources for a wider calendar." />
      )}
    </>
  );
}

function EventCard({ event, now }: { event: SpaceEvent; now: number }) {
  const date = new Date(event.dateUtc);
  const past = isPastEvent(event, now);
  return (
    <article className={`event-row${event.imageUrl ? "" : " event-row-no-image"}`}>
      {event.imageUrl && <div className="event-thumbnail"><EventImage src={event.imageUrl} alt={event.title} category={event.category} /></div>}
      <time dateTime={event.dateUtc} className="event-date">
        <span>{new Intl.DateTimeFormat("en", { month: "short", timeZone: "UTC" }).format(date)}</span>
        <strong>{date.getUTCDate()}</strong>
        <span>{date.getUTCFullYear()}</span>
      </time>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow">{humanizeToken(event.category)}</span>
          <DataBadge label={event.source === "Mock" ? "Saved example" : past ? "Past" : getEventStatus(event)} />
        </div>
        <h2 className="event-title">{event.title}</h2>
        <div className="event-meta">
          <span className="font-mono text-astro-blue">{formatEventTime(event.dateUtc)}</span>
          <span>{event.provider ?? event.agency ?? event.location}</span>
        </div>
        {event.description && <p className="event-description line-clamp-2">{event.description}</p>}
        <div className="flex flex-wrap items-center gap-x-5">
          {event.sourceUrl && <a className="event-source" href={event.sourceUrl} target="_blank" rel="noopener noreferrer">{event.source === "Mock" ? "Source" : event.source}<span aria-hidden="true"> ↗</span></a>}
          {event.webcastUrl && <a className="event-source" href={event.webcastUrl} target="_blank" rel="noopener noreferrer">Watch webcast<span aria-hidden="true"> ↗</span></a>}
        </div>
      </div>
    </article>
  );
}

function filterEvents(events: SpaceEvent[], activeFilter: string, now: number) {
  return events.filter((event) => {
    const searchText = `${event.title} ${event.category} ${event.description}`.toLowerCase();
    const upcoming = isUpcomingEvent(event, now) && event.source !== "Mock";
    const past = isPastEvent(event, now);

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
