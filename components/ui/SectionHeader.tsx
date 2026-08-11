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
    <div className={cn("mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div>
        <h2 className="font-display text-3xl font-normal tracking-[-0.015em] text-astro-text">{title}</h2>
        {subtitle ? <p className="mt-2 max-w-3xl text-sm leading-6 text-astro-muted">{subtitle}</p> : null}
      </div>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="cosmic-secondary inline-flex min-h-10 w-fit items-center rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-astro-blue/35"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
