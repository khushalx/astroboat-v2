import { pageMetadata } from "@/lib/seo";
import { EventsCalendarClient } from "@/components/events/EventsCalendarClient";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { getCombinedSpaceCalendar } from "@/services/events-service";
import Link from "next/link";

export const metadata = pageMetadata({
  title: 'Upcoming Space Launches & Sky Events',
  description: 'Explore upcoming launches, mission milestones, and sky events with dates, sources, and viewing context.',
  path: '/events',
  noindex: false
})

export default async function EventsPage() {
  const calendar = await getCombinedSpaceCalendar();

  return (
    <PageShell>
      <PageHeader
        title="Space Events"
        subtitle="Upcoming launches, sky events, and mission milestones in one clean calendar."
      />
      <p className="max-w-3xl text-sm leading-7 text-astro-muted">Launch plans and event times can change. Check each event&apos;s original source before making viewing plans; dates are shown in UTC where available. <Link href="/data-sources" className="text-astro-blue underline">Review the event sources</Link>.</p>
      <EventsCalendarClient
        events={calendar.events}
        warnings={calendar.warnings}
        lastUpdated={calendar.lastUpdated}
      />
    </PageShell>
  );
}
