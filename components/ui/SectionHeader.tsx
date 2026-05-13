import Link from "next/link";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
};

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  actionHref,
  className
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div>
        <p className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-astro-gold">
          <span className="h-px w-6 bg-astro-gold/60" aria-hidden="true" />
          Astroboat
        </p>
        <h2 className="text-2xl font-semibold text-astro-text">{title}</h2>
        {subtitle ? <p className="mt-2 max-w-3xl text-sm leading-6 text-astro-muted">{subtitle}</p> : null}
      </div>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="inline-flex w-fit items-center rounded-md border border-astro-border px-3 py-2 text-sm font-medium text-astro-text transition hover:border-astro-blue/45 hover:text-astro-blue focus:outline-none focus:ring-2 focus:ring-astro-blue/40"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
