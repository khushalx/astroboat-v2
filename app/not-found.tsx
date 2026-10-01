import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl py-20 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-astro-gold">404 · Signal not found</p>
      <h1 className="mt-4 font-display text-4xl text-astro-text">This page is out of orbit.</h1>
      <p className="mt-4 text-base leading-7 text-astro-muted">The link may have changed, or this brief may have left the current feed.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="cosmic-primary rounded-lg px-5 py-3 text-sm">Go to Astroboat</Link>
        <Link href="/briefs" className="cosmic-secondary rounded-lg px-5 py-3 text-sm">Browse current briefs</Link>
      </div>
    </div>
  );
}
