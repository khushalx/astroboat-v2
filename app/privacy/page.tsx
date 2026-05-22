import type { Metadata } from "next";
import { AstroCard } from "@/components/ui/AstroCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";

export const metadata: Metadata = {
  title: "Privacy Policy — Astroboat",
  description: "Read Astroboat's privacy policy for analytics, chatbot messages, third-party services, and data handling."
};

export default function PrivacyPage() {
  return (
    <PageShell className="max-w-3xl">
      <PageHeader
        eyebrow="Privacy"
        title="Privacy Policy"
        subtitle="A simple overview of how Astroboat handles basic usage data, assistant messages, and third-party services."
      />

      <AstroCard className="space-y-5 p-5 text-sm leading-7 text-astro-muted sm:p-6">
        <section>
          <h2 className="text-lg font-semibold text-astro-text">Information Astroboat May Use</h2>
          <p className="mt-2">
            Astroboat may use basic analytics to understand page visits, general usage patterns, performance, and
            product reliability. This helps improve the platform without selling personal data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-astro-text">Assistant Messages</h2>
          <p className="mt-2">
            Messages submitted to the Astroboat Assistant may be sent to a server-side AI backend to generate
            responses. Do not submit sensitive personal information, passwords, private documents, or confidential
            data into the chatbot.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-astro-text">Third-Party Services</h2>
          <p className="mt-2">
            Astroboat may use third-party APIs and services for astronomy data, AI responses, hosting, analytics,
            and reliability. These services may process limited technical data needed to provide their functions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-astro-text">Personal Data</h2>
          <p className="mt-2">
            Astroboat does not sell personal data. If account features, saved preferences, or newsletter tools are
            added later, this policy should be updated to explain those changes clearly.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-astro-text">Privacy Questions</h2>
          <p className="mt-2">
            For privacy questions, contact Astroboat at{" "}
            <a className="text-astro-blue hover:text-astro-text" href="mailto:khushaldangar29@gmail.com">
              khushaldangar29@gmail.com
            </a>
            .
          </p>
        </section>
      </AstroCard>
    </PageShell>
  );
}
