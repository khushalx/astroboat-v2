"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { guideCategoryId } from "@/lib/guide-seo";

type GuideEntry = { slug: string; title: string; description: string; category: string; readingMinutes: number };
export function GuidesIndex({ guides }: { guides: GuideEntry[] }) {
  const [query, setQuery] = useState("");
  const categories = [...new Set(guides.map((guide) => guide.category))];
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return guides.filter((guide) => `${guide.title} ${guide.description} ${guide.category}`.toLowerCase().includes(term));
  }, [guides, query]);
  return (
    <div className="space-y-8">
      <div className="context-panel">
        <div className="flex flex-wrap items-center gap-4">
          <label className="min-w-0 flex-1">
            <span className="sr-only">Search astronomy guides</span>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a guide: Moon, telescopes, black holes…" className="glass-control min-h-12 w-full rounded px-4 text-sm" />
          </label>
          <p className="text-xs text-astro-muted" role="status">{filtered.length} guide{filtered.length === 1 ? "" : "s"}</p>
        </div>
        <nav aria-label="Guide topics" className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
          {categories.filter((category) => filtered.some((guide) => guide.category === category)).map((category) => <a key={category} href={`#${guideCategoryId(category)}`} className="inline-flex min-h-11 items-center text-xs text-astro-blue hover:text-astro-text">{category}</a>)}
        </nav>
      </div>
      {categories.map((category) => {
        const entries = filtered.filter((guide) => guide.category === category);
        return entries.length ? <section key={category} id={guideCategoryId(category)} aria-labelledby={`${guideCategoryId(category)}-title`} className="scroll-mt-28">
          <h2 id={`${guideCategoryId(category)}-title`} className="mb-5 font-display text-3xl">{category}</h2>
          <div className="guide-grid">
            {entries.map((guide) => <article key={guide.slug} className="guide-entry">
              <p className="eyebrow text-astro-gold">{guide.readingMinutes} min read</p>
              <h3 className="mt-3"><Link href={`/guides/${guide.slug}`}>{guide.title}</Link></h3>
              <p className="mt-3 text-sm leading-7 text-astro-muted">{guide.description}</p>
              <Link href={`/guides/${guide.slug}`} className="mt-3 inline-flex min-h-11 items-center text-sm text-astro-blue hover:underline">Read the guide <span className="ml-2" aria-hidden="true">↗</span></Link>
            </article>)}
          </div>
        </section> : null;
      })}
      {filtered.length === 0 && <EmptyState title="No guides found" description="Try a broader topic, or clear your search to browse the reading room." />}
    </div>
  );
}
