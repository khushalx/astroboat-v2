import { AstroCard } from "@/components/ui/AstroCard";
import { DataBadge } from "@/components/ui/DataBadge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EventTimelineVisual } from "@/components/visuals/EventTimelineVisual";
import type { SpaceEvent } from "@/lib/types";
import { humanizeToken } from "@/lib/utils";

type UpcomingEventsProps = {
  events: SpaceEvent[];
};

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <section className="py-8">
      <SectionHeader
        title="Upcoming Space Events"
        subtitle="A calm event queue for launches, sky watching, research releases, and region-specific visibility."
        actionLabel="View Calendar"
        actionHref="/events"
      />
      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <EventTimelineVisual
          items={events.slice(0, 5).map((event) => ({
            label: humanizeToken(event.category),
            date: event.dateDisplay.replace(", 2026", "")
          }))}
          className="overflow-x-auto"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {events.slice(0, 4).map((event) => (
            <AstroCard key={event.id} className="p-4" interactive>
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold leading-6 text-astro-text">{event.title}</h3>
                <DataBadge label={humanizeToken(event.status)} />
              </div>
              <p className="mt-3 font-mono text-xs text-astro-blue">{event.dateDisplay}</p>
              <p className="mt-3 text-sm leading-6 text-astro-muted">{event.whyItMatters}</p>
            </AstroCard>
          ))}
        </div>
      </div>
    </section>
  );
}
