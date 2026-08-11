import { useId } from "react";
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
  lg: "h-44 w-44"
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
  const id = useId().replace(/:/g, "");
  const shadowId = `moon-shadow-${id}`;
  const lightId = `moon-light-${id}`;

  return (
    <figure className={cn("inline-flex flex-col items-center gap-3", className)}>
      <svg
        className={cn(sizeClasses[size])}
        viewBox="0 0 100 100"
        role="img"
        aria-label={`${phaseName}, ${clamped}% illuminated`}
      >
        <defs>
          <radialGradient id={shadowId} cx="35%" cy="28%" r="70%">
            <stop offset="0%" stopColor="#27314a" />
            <stop offset="58%" stopColor="#101727" />
            <stop offset="100%" stopColor="#050811" />
          </radialGradient>
          <radialGradient id={lightId} cx="35%" cy="28%" r="70%">
            <stop offset="0%" stopColor="#fff9e8" />
            <stop offset="56%" stopColor="#e9ddb9" />
            <stop offset="100%" stopColor="#a89c80" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="none" stroke="#d8b46a" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="3 5" />
        <circle cx="50" cy="50" r="44" fill={`url(#${shadowId})`} stroke="#52617c" strokeWidth="1.2" />
        {clamped > 2 ? (
          <ellipse cx={litCenter} cy="50" rx={litRadius} ry="44" fill={`url(#${lightId})`} />
        ) : null}
        {clamped > 4 && clamped < 96 ? (
          <path
            d={litOnRight ? "M50 8 C39 24 39 76 50 92" : "M50 8 C61 24 61 76 50 92"}
            fill="none"
            stroke="#03050B"
            strokeOpacity="0.32"
            strokeWidth="1"
          />
        ) : null}
        <circle cx="35" cy="31" r="2" fill="#817b6e" opacity="0.38" />
        <circle cx="55" cy="58" r="3" fill="#817b6e" opacity="0.3" />
        <circle cx="66" cy="39" r="1.8" fill="#817b6e" opacity="0.32" />
        <circle cx="50" cy="50" r="44" fill="none" stroke="#F3F6FF" strokeOpacity="0.08" strokeWidth="2" />
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
