"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

export function TrackArticleOpen({ path }: { path: string }) {
  useEffect(() => trackEvent("article_opened", { path }), [path]);
  return null;
}

export function TrackedLink({ event, href, children, className }: {
  event: AnalyticsEvent;
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return <Link href={href} className={className} onClick={() => trackEvent(event, { path: href })} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}>{children}</Link>;
}

export function ShareButton({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button type="button" className="cosmic-secondary mt-5 min-h-11 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-astro-blue/40" onClick={async () => {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        trackEvent("share_clicked", { path: new URL(url).pathname, method: "copy" });
      } catch {
        if (navigator.share) {
          await navigator.share({ title, url });
          trackEvent("share_clicked", { path: new URL(url).pathname, method: "native" });
        }
      }
    }}>{copied ? "Link copied" : "Share this page"}</button>
  );
}
