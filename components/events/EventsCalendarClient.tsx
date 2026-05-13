"use client";

import { useMemo, useState } from "react";
import { AstroCard } from "@/components/ui/AstroCard";
import { DataBadge } from "@/components/ui/DataBadge";
import { DetailPanel } from "@/components/ui/DetailPanel";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterBar } from "@/components/ui/FilterBar";
import { EventTimelineVisual } from "@/components/visuals/EventTimelineVisual";
import { eventFilters } from "@/lib/constants";
import type { SpaceEvent } from "@/lib/types";
import { humanizeToken } from "@/lib/utils";

type EventsCalendarClientProps = {
  events: SpaceEvent[];
  warnings: string[];
  lastUpdated: string;
};

export function EventsCalendarClient({ events, warnings, lastUpdated }: EventsCalendarClientProps) {
  const [activeFilter, setActiveFilter] = useState(eventFilters[0]);
  const filteredEvents = useMemo(() => filterEvents(events, activeFilter), [activeFilter, events]);
  const preview = filteredEvents[0] ?? events[0];

  return (
    <>
      <div className="mission-surface rounded-lg border border-astro-border bg-astro-surface/70 p-4">
        <p className="text-sm leading-6 text-astro-muted">
          Launch and spaceflight data from The Space Devs Launch Library 2. Some sky events may be curated by Astroboat.
        </p>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-astro-muted">
          Cached data refreshed every 6 hours / Last checked {formatDateTimeUtc(lastUpdated)}
        </p>
      </div>

      {warnings.map((warning) => (
        <div key={warning} className="rounded-lg border border-astro-gold/35 bg-astro-gold/10 p-4 text-sm leading-6 text-astro-text">
          {warning}
        </div>
      ))}

      <FilterBar filters={eventFilters} activeFilter={activeFilter} ariaLabel="Event filters" onFilterChange={setActiveFilter} />

      {filteredEvents.length > 0 ? (
        <EventTimelineVisual
          items={filteredEvents.slice(0, 8).map((event) => ({
            label: humanizeToken(event.category),
            date: formatDateOnly(event.dateUtc)
          }))}
          className="overflow-x-auto"
        />
      ) : (
        <EmptyState title="No matching events" description="Try a different filter or check back after the next cached update." />
      )}

      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <EmptyState title="No event cards" description="There are no events available for this filter." />
          )}
        </div>

        {preview ? (
          <aside className="hidden lg:block">
            <DetailPanel eyebrow="Event preview" title={preview.title} description={preview.whyItMatters}>
              <div className="rounded-lg border border-astro-border bg-astro-elevated p-4">
                <EventMedia event={preview} compact />
                <dl className="mt-4 space-y-3 text-sm">
                  <DetailRow label="UTC date" value={preview.dateDisplay} />
                  <DetailRow label="Status" value={humanizeToken(preview.status)} />
                  <DetailRow label="Location" value={preview.location} />
                  {preview.provider ? <DetailRow label="Provider" value={preview.provider} /> : null}
                  {preview.rocket ? <DetailRow label="Rocket" value={preview.rocket} /> : null}
                </dl>
              </div>
            </DetailPanel>
          </aside>
        ) : null}
      </div>
    </>
  );
}

function EventCard({ event }: { event: SpaceEvent }) {
  return (
    <AstroCard as="article" className="p-5 sm:p-6" interactive>
      <div className="grid gap-5 md:grid-cols-[160px_1fr]">
        <EventMedia event={event} />
        <div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                <DataBadge label={humanizeToken(event.category)} />
                <DataBadge label={humanizeToken(event.status)} />
              </div>
              <h2 className="text-lg font-semibold leading-7 text-astro-text">{event.title}</h2>
              <p className="mt-2 font-mono text-xs text-astro-blue">
                {event.dateDisplay} / {getRelativeTimeLabel(event.dateUtc)}
              </p>
            </div>
            <span className="w-fit rounded-full border border-astro-border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-astro-muted">
              {event.source}
            </span>
          </div>

          <dl className="mt-5 grid gap-3 sm:grid-cols-3">
            <DetailBlock label="Location" value={event.location} />
            <DetailBlock label="Agency/provider" value={event.provider ?? event.agency ?? "Not listed"} />
            <DetailBlock label="Visibility" value={event.visibility} />
          </dl>

          <p className="mt-5 line-clamp-3 text-sm leading-6 text-astro-muted">{event.description}</p>
          <div className="mt-4 rounded-lg border border-astro-border bg-astro-bg/35 p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-astro-gold">Why it matters</p>
            <p className="mt-2 text-sm leading-6 text-astro-muted">{event.whyItMatters}</p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {event.webcastUrl ? (
              <a
                href={event.webcastUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-astro-gold/45 bg-astro-gold/10 px-3 py-2 text-sm text-astro-text transition hover:bg-astro-gold/15 focus:outline-none focus:ring-2 focus:ring-astro-gold/45"
              >
                Watch webcast
              </a>
            ) : null}
            {event.sourceUrl ? (
              <a
                href={event.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-astro-border px-3 py-2 text-sm text-astro-text transition hover:border-astro-blue/45 hover:text-astro-blue focus:outline-none focus:ring-2 focus:ring-astro-blue/40"
              >
                Source
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </AstroCard>
  );
}

function EventMedia({ event, compact = false }: { event: SpaceEvent; compact?: boolean }) {
  const [failed, setFailed] = useState(false);

  if (event.imageUrl && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={event.imageUrl}
        alt={`${event.title} image`}
        className={compact ? "h-32 w-full rounded-md border border-astro-border object-cover" : "h-40 w-full rounded-md border border-astro-border object-cover md:h-full"}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      className={compact ? "h-32 rounded-md border border-astro-border bg-astro-bg" : "h-40 rounded-md border border-astro-border bg-astro-bg md:h-full"}
      aria-label={`${event.title} visual placeholder`}
      role="img"
    >
      <div className="relative h-full overflow-hidden rounded-md">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(125,211,252,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute bottom-8 left-6 right-6 h-px bg-astro-border" />
        <div className="absolute left-7 top-8 h-8 w-8 rounded-full border border-astro-gold/50" />
        <div className="absolute bottom-12 right-8 h-2 w-14 rotate-[-12deg] bg-astro-blue/40" />
        <div className="absolute right-6 top-6 h-10 w-10 rounded-full border border-astro-blue/20" />
      </div>
    </div>
  );
}

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-astro-muted">{label}</dt>
      <dd className="mt-1 text-sm text-astro-text">{value}</dd>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-astro-muted">{label}</dt>
      <dd className="mt-1 text-astro-text">{value}</dd>
    </div>
  );
}

function filterEvents(events: SpaceEvent[], activeFilter: string) {
  const now = new Date();
  const sevenDays = 1000 * 60 * 60 * 24 * 7;

  return events.filter((event) => {
    const date = new Date(event.dateUtc);

    if (Number.isNaN(date.getTime())) {
      return false;
    }

    switch (activeFilter) {
      case "Launches":
        return event.category === "launch";
      case "Space Events":
        return event.category !== "launch" && event.category !== "sky_event";
      case "Sky Events":
        return event.category === "sky_event";
      case "This Week":
        return date.getTime() >= now.getTime() && date.getTime() <= now.getTime() + sevenDays;
      case "This Month":
        return date.getUTCFullYear() === now.getUTCFullYear() && date.getUTCMonth() === now.getUTCMonth();
      case "Online":
        return event.visibility === "Online" || Boolean(event.webcastUrl);
      case "Worldwide":
        return event.visibility === "Worldwide";
      default:
        return true;
    }
  });
}

function formatDateTimeUtc(dateUtc: string) {
  const date = new Date(dateUtc);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
    hour12: false
  }).format(date);
}

function formatDateOnly(dateUtc: string) {
  const date = new Date(dateUtc);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    timeZone: "UTC"
  }).format(date);
}

function getRelativeTimeLabel(dateUtc: string) {
  const date = new Date(dateUtc);

  if (Number.isNaN(date.getTime())) {
    return "Timing unknown";
  }

  const diffMs = date.getTime() - Date.now();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const absHours = Math.abs(diffHours);

  if (absHours < 1) return diffMs >= 0 ? "Within the hour" : "Less than an hour ago";
  if (absHours < 48) return diffMs >= 0 ? `In ${absHours} hours` : `${absHours} hours ago`;

  const days = Math.round(absHours / 24);

  return diffMs >= 0 ? `In ${days} days` : `${days} days ago`;
}
