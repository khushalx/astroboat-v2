export function Footer() {
  return (
    <footer className="border-t border-astro-border bg-astro-bg/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-astro-muted sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-astro-text">Astroboat V2</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-astro-gold">Sky tools online</p>
        </div>
        <p>
          Astronomy intelligence, sky tools, and beginner-friendly explainers for calm space awareness.
        </p>
      </div>
    </footer>
  );
}
