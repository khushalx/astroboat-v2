import { cn } from "@/lib/utils";

type MoonPhaseVisualProps = {
  phaseName: string;
  illuminationPercent: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
};

const sizeClasses = {
  sm: "h-14 w-14",
  md: "h-20 w-20",
  lg: "h-36 w-36"
};

export function MoonPhaseVisual({
  phaseName,
  illuminationPercent,
  size = "md",
  showLabel = false,
  className
}: MoonPhaseVisualProps) {
  const clamped = Math.max(0, Math.min(100, illuminationPercent));
  const lower = phaseName.toLowerCase();
  const litOnRight = lower.includes("waxing") || lower.includes("first") || lower.includes("new");
  const litRadius = clamped <= 2 ? 0 : Math.max(3, (44 * clamped) / 100);
  const litCenter = litOnRight ? 94 - litRadius : 6 + litRadius;

  return (
    <figure className={cn("inline-flex flex-col items-center gap-3", className)}>
      <svg
        className={cn(sizeClasses[size], "drop-shadow-[0_0_20px_rgba(214,168,79,0.12)]")}
        viewBox="0 0 100 100"
        role="img"
        aria-label={`${phaseName}, ${clamped}% illuminated`}
      >
        <defs>
          <radialGradient id="moon-shadow" cx="35%" cy="28%" r="70%">
            <stop offset="0%" stopColor="#1F2937" />
            <stop offset="100%" stopColor="#0B1120" />
          </radialGradient>
          <radialGradient id="moon-light" cx="35%" cy="28%" r="70%">
            <stop offset="0%" stopColor="#F1E7C9" />
            <stop offset="100%" stopColor="#B9AD91" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="none" stroke="#D6A84F" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="3 5" />
        <circle cx="50" cy="50" r="44" fill="url(#moon-shadow)" stroke="#334155" strokeWidth="1.5" />
        {clamped > 2 ? (
          <ellipse cx={litCenter} cy="50" rx={litRadius} ry="44" fill="url(#moon-light)" />
        ) : null}
        {clamped > 4 && clamped < 96 ? (
          <path
            d={litOnRight ? "M50 8 C39 24 39 76 50 92" : "M50 8 C61 24 61 76 50 92"}
            fill="none"
            stroke="#070B14"
            strokeOpacity="0.32"
            strokeWidth="1"
          />
        ) : null}
        <circle cx="35" cy="31" r="2" fill="#8D8776" opacity="0.35" />
        <circle cx="55" cy="58" r="3" fill="#8D8776" opacity="0.26" />
        <circle cx="66" cy="39" r="1.8" fill="#8D8776" opacity="0.28" />
        <circle cx="50" cy="50" r="44" fill="none" stroke="#E5E7EB" strokeOpacity="0.08" strokeWidth="2" />
      </svg>
      {showLabel ? (
        <figcaption className="text-center">
          <p className="text-sm font-medium text-astro-text">{phaseName}</p>
          <p className="font-mono text-xs text-astro-muted">{clamped}% illuminated</p>
        </figcaption>
      ) : null}
    </figure>
  );
}
