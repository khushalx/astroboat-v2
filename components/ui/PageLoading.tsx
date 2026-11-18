export function PageLoading() {
  return (
    <div className="page-shell" role="status" aria-label="Loading Astroboat">
      <span className="sr-only">Loading the observatory…</span>
      <div className="max-w-lg space-y-4 py-4" aria-hidden="true"><div className="h-3 w-32 animate-pulse rounded bg-astro-elevated" /><div className="h-12 w-4/5 animate-pulse rounded bg-astro-elevated" /></div>
      <div className="grid gap-4 sm:grid-cols-2" aria-hidden="true">{[0, 1, 2, 3].map((item) => <div key={item} className="h-48 animate-pulse rounded border border-astro-border bg-astro-surface" />)}</div>
    </div>
  );
}
