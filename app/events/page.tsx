export const revalidate = 900;

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
        eyebrow="The space calendar"
        title="Worth looking up for."
        subtitle="Rocket launches, mission milestones, and moments in the night sky. All times in UTC."
      />

      <EventsCalendarClient
        events={calendar.events}
        warnings={calendar.warnings}
        lastUpdated={calendar.lastUpdated}
      />
      <aside className="page-note"><p>Launch plans and event times can change. Check each event&apos;s original source before making viewing plans; dates are shown in UTC where available. <Link href="/data-sources" className="text-astro-blue underline">Review the event sources</Link>.</p>
      <p className="mt-2">
        Viewing guides: <Link href="/guides/how-to-watch-a-meteor-shower" className="text-astro-blue underline">meteor showers</Link>
        {" and "}<Link href="/guides/august-2027-solar-eclipse" className="text-astro-blue underline">the August 2027 solar eclipse</Link>.
      </p></aside>
    </PageShell>
  );
}
