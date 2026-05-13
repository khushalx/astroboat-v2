import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  subtitle: string;
  eyebrow?: string;
  className?: string;
};

export function PageHeader({ title, subtitle, eyebrow = "Astroboat", className }: PageHeaderProps) {
  return (
    <header className={cn("terminal-rule max-w-4xl pt-5", className)}>
      <p className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-astro-gold">
        <span className="h-1.5 w-1.5 rounded-full bg-astro-gold" aria-hidden="true" />
        {eyebrow}
      </p>
      <h1 className="text-3xl font-semibold leading-tight text-astro-text sm:text-4xl">{title}</h1>
      <p className="mt-3 text-sm leading-7 text-astro-muted sm:text-base">{subtitle}</p>
    </header>
  );
}
