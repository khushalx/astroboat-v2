import { cn } from "@/lib/utils";

export function Brand({ className }: { className?: string }) {
  return (
    <span className={cn("brand-lockup", className)}>
      <svg viewBox="0 0 40 40" fill="none" className="brand-mark" aria-hidden="true">
        <circle cx="20" cy="20" r="10.5" stroke="currentColor" strokeWidth="1.5" />
        <ellipse cx="20" cy="20" rx="19" ry="6.5" transform="rotate(-35 20 20)" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="30.8" cy="8.6" r="2.8" fill="currentColor" />
      </svg>
      <span>astroboat<span className="brand-period">.</span></span>
    </span>
  );
}
