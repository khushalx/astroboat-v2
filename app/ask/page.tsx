import type { Metadata } from "next";
import { AstrobotClient } from "@/components/ask/AstrobotClient";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";

export const metadata: Metadata = {
  title: "Ask Astroboat",
  description:
    "Ask simple questions about astronomy, space events, Moon phases, asteroids, and space science.",
  alternates: {
    canonical: "/ask"
  },
  openGraph: {
    title: "Ask Astroboat",
    description:
      "Ask simple questions about astronomy, space events, Moon phases, asteroids, and space science.",
    url: "https://astroboat.in/ask"
  }
};

export default function AskPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Assistant"
        title="Ask Astroboat"
        subtitle="Ask simple questions about astronomy, space events, Moon phases, asteroids, and space science."
      />
      <AstrobotClient />
    </PageShell>
  );
}
