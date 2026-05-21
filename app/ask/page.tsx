import type { Metadata } from "next";
import { AstrobotClient } from "@/components/ask/AstrobotClient";
import { PageHeader } from "@/components/ui/PageHeader";

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
    <div className="space-y-6">
      <PageHeader
        eyebrow="Assistant"
        title="Ask Astroboat"
        subtitle="Ask simple questions about astronomy, space events, Moon phases, asteroids, and space science."
      />
      <AstrobotClient />
    </div>
  );
}
