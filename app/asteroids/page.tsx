import { pageMetadata } from "@/lib/seo";
import { AsteroidWatchClient } from "@/components/asteroids/AsteroidWatchClient";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { getNearEarthObjects } from "@/services/asteroids-service";
import Link from "next/link";

export const metadata = pageMetadata({
  title: 'Near-Earth Asteroid Close Approaches',
  description: 'See near-Earth object approaches from NASA JPL with distance, speed, size estimates, and clear risk context.',
  path: '/asteroids',
  noindex: false
})

export default async function AsteroidsPage() {
  const nearEarthObjects = await getNearEarthObjects();

  return (
    <PageShell>
      <PageHeader
        title="Asteroid Watch"
        subtitle="Near-Earth objects on close approach, sourced from NASA JPL."
      />
      <p className="max-w-3xl text-sm leading-7 text-astro-muted">A near-Earth object is an asteroid or comet whose orbit brings it into Earth&apos;s neighborhood. This list covers a limited future window using NASA JPL close-approach data; distances and sizes are estimates, and Astroboat&apos;s watch labels are browsing cues rather than impact predictions. <Link href="/guides/what-is-a-near-earth-object" className="text-astro-blue underline">Learn how to read close approaches</Link>.</p>

      {nearEarthObjects.length > 0 ? (
        <AsteroidWatchClient objects={nearEarthObjects} />
      ) : (
        <EmptyState
          title="No near-Earth objects found"
          description="No close approaches are available for this cached window. Check back after the next update."
        />
      )}
    </PageShell>
  );
}
