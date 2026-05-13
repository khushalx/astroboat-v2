import type { Metadata } from "next";
import { AsteroidWatchClient } from "@/components/asteroids/AsteroidWatchClient";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";
import { getNearEarthObjects } from "@/services/asteroids-service";

export const metadata: Metadata = {
  title: "Asteroid Watch — Astroboat",
  description: "Track near-Earth object close approaches with calm, science-based explanations."
};

export default async function AsteroidsPage() {
  const nearEarthObjects = await getNearEarthObjects();

  return (
    <PageShell>
      <PageHeader
        title="Asteroid Watch"
        subtitle="Track upcoming near-Earth object close approaches with calm, science-based explanations."
      />

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
