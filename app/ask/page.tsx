import { pageMetadata } from "@/lib/seo";
import { AstrobotClient } from "@/components/ask/AstrobotClient";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageShell } from "@/components/ui/PageShell";

export const metadata = pageMetadata({
  title: 'Ask Astroboat Astronomy Questions',
  description: 'Ask the Astroboat assistant astronomy questions and explore related live sky tools.',
  path: '/ask',
  noindex: true
})

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
