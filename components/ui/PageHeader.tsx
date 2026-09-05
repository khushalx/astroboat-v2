import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  subtitle: string;
  eyebrow?: string;
  className?: string;
};

export function PageHeader({ title, subtitle, eyebrow, className }: PageHeaderProps) {
  return (
    <header className={cn("page-heading max-w-3xl pt-2 sm:pt-4", className)}>
      {eyebrow ? <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-astro-gold">{eyebrow}</p> : null}
      <h1 className="font-display text-4xl font-normal leading-[1.08] tracking-[-0.02em] text-astro-text text-balance sm:text-[2.75rem]">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-7 text-astro-muted sm:text-base">{subtitle}</p>
    </header>
  );
}
