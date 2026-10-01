import { pageMetadata } from "@/lib/seo";
import { CoreTools } from "@/components/home/CoreTools";
import { Hero } from "@/components/home/Hero";
import { getUpcomingEvents } from "@/services/events-service";
import { getCurrentMoonData } from "@/services/moon-service";

export const metadata = pageMetadata({
  title: 'Astronomy, Space Events & Sky Tools',
  description: 'Explore astronomy briefs, space imagery, upcoming events, the Moon, and near-Earth objects with source-linked context.',
  path: '/',
  noindex: false
})

export default async function HomePage() {
  const [events, moon] = await Promise.all([
    getUpcomingEvents(),
    getCurrentMoonData()
  ]);

  return (
    <>
      <Hero
        moon={moon}
        nextEvent={events[0] ?? null}
      />
      <CoreTools moon={moon} />
    </>
  );
}
