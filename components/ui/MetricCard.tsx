type MetricCardProps = {
  label: string;
  value: string | number;
  helper?: string;
};

export function MetricCard({ label, value, helper }: MetricCardProps) {
  return (
    <div className="border-t border-astro-border/70 pt-3">
      <p className="text-xs font-medium text-astro-muted">{label}</p>
      <p className="mt-1.5 font-mono text-lg font-medium tracking-[-0.02em] text-astro-text">{value}</p>
      {helper ? <p className="mt-2 text-sm leading-6 text-astro-muted">{helper}</p> : null}
    </div>
  );
}
