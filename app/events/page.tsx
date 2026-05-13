import type { Metadata } from "next";
import { EventsCalendarClient } from "@/components/events/EventsCalendarClient";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { getCombinedSpaceCalendar } from "@/services/events-service";

export const metadata: Metadata = {
  title: "Space Events Calendar — Astroboat",
  description: "Track global launches, mission events, and selected sky events."
};

export default async function EventsPage() {
  const calendar = await getCombinedSpaceCalendar();

  return (
    <PageShell>
      <PageHeader
        title="Space Events Calendar"
        subtitle="Global launches, mission events, crewed spaceflight updates, and selected sky events."
      />
      <EventsCalendarClient
        events={calendar.events}
        warnings={calendar.warnings}
        lastUpdated={calendar.lastUpdated}
      />
    </PageShell>
  );
}
