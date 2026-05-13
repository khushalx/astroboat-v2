import { AstroCard } from "@/components/ui/AstroCard";

type MetricCardProps = {
  label: string;
  value: string | number;
  helper?: string;
};

export function MetricCard({ label, value, helper }: MetricCardProps) {
  return (
    <AstroCard className="p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-astro-muted">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-astro-text">{value}</p>
      <div className="mt-3 h-px w-12 bg-astro-blue/35" aria-hidden="true" />
      {helper ? <p className="mt-2 text-sm leading-6 text-astro-muted">{helper}</p> : null}
    </AstroCard>
  );
}
