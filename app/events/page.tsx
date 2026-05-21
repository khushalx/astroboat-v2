import type { Metadata } from "next";
import { EventsCalendarClient } from "@/components/events/EventsCalendarClient";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { getCombinedSpaceCalendar } from "@/services/events-service";

export const metadata: Metadata = {
  title: "Space Events",
  description: "Upcoming launches, sky events, and mission milestones in one clean calendar.",
  alternates: {
    canonical: "/events"
  },
  openGraph: {
    title: "Space Events — Astroboat",
    description: "Upcoming launches, sky events, and mission milestones in one clean calendar.",
    url: "/events",
    images: ["/astroboat-search-banner.png"]
  }
};

export default async function EventsPage() {
  const calendar = await getCombinedSpaceCalendar();

  return (
    <PageShell>
      <PageHeader
        title="Space Events"
        subtitle="Upcoming launches, sky events, and mission milestones in one clean calendar."
      />
      <EventsCalendarClient
        events={calendar.events}
        warnings={calendar.warnings}
        lastUpdated={calendar.lastUpdated}
      />
    </PageShell>
  );
}
