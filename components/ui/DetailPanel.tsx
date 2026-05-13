import type { ReactNode } from "react";
import { AstroCard } from "@/components/ui/AstroCard";

type DetailPanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function DetailPanel({ eyebrow, title, description, children }: DetailPanelProps) {
  return (
    <AstroCard className="sticky top-24 p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-astro-gold">{eyebrow}</p>
      <h2 className="mt-3 text-xl font-semibold leading-7 text-astro-text">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-astro-muted">{description}</p>
      {children ? <div className="mt-5">{children}</div> : null}
    </AstroCard>
  );
}
