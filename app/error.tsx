"use client";

import Link from "next/link";
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="context-panel mx-auto my-10 max-w-xl text-center" role="alert">
    <p className="eyebrow text-astro-gold">A brief interruption</p>
    <h1 className="mt-4 font-display text-3xl">The observatory couldn’t load.</h1>
    <p className="mt-4 text-sm leading-7 text-astro-muted">Try again in a moment. You can still explore the rest of Astroboat.</p>
    <div className="mt-6 flex flex-wrap justify-center gap-3"><button type="button" onClick={reset} className="cosmic-primary px-5 py-2 text-sm">Try again</button><Link href="/" className="cosmic-secondary inline-flex items-center px-5 py-2 text-sm">Back to discovery</Link></div>
  </div>;
}
