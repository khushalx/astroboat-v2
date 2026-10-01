import { useId } from "react";
import { cn } from "@/lib/utils";

type MoonPhaseVisualProps = {
  phaseName: string;
  illuminationPercent: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
};

const sizeClasses = { sm: "h-14 w-14", md: "h-20 w-20", lg: "h-44 w-44" };
const craters = [
  { x: 31, y: 30, r: 8 }, { x: 42, y: 45, r: 6 }, { x: 61, y: 32, r: 11 },
  { x: 67, y: 66, r: 7 }, { x: 35, y: 70, r: 5 }, { x: 51, y: 77, r: 3 }, { x: 72, y: 45, r: 3 }
];

export function MoonPhaseVisual({ phaseName, illuminationPercent, size = "md", showLabel = false, className }: MoonPhaseVisualProps) {
  const clamped = Number.isFinite(illuminationPercent) ? Math.max(0, Math.min(100, illuminationPercent)) : 0;
  const litOnRight = /waxing|first|new/i.test(phaseName);
  const radius = 44;
  const terminator = radius * Math.abs(1 - 2 * clamped / 100);
  // The terminator is the projected ellipse of a sphere's day/night boundary.
  const boundary = terminator < 0.001 ? "L50 6" : `A${terminator} 44 0 0 ${clamped > 50 ? 1 : 0} 50 6`;
  const litPath = `M50 6 A44 44 0 0 1 50 94 ${boundary} Z`;
  const id = useId().replace(/:/g, "");
  const lightId = `moon-light-${id}`;
  const phaseId = `moon-phase-${id}`;
  const shadeId = `moon-shade-${id}`;

  return (
    <figure className={cn("inline-flex flex-col items-center gap-3", className)}>
      <svg className={cn(sizeClasses[size])} viewBox="0 0 100 100" role="img" aria-label={`${phaseName}, ${clamped}% illuminated`}>
        <defs>
          <radialGradient id={lightId} cx="38%" cy="30%" r="72%"><stop offset="0%" stopColor="#e3e5dd" /><stop offset="65%" stopColor="#bbc2b8" /><stop offset="100%" stopColor="#75847c" /></radialGradient>
          <radialGradient id={shadeId} cx="38%" cy="30%" r="75%"><stop offset="0%" stopColor="#252d2f" /><stop offset="100%" stopColor="#0c1114" /></radialGradient>
          <clipPath id={phaseId}><path d={litPath} transform={litOnRight ? undefined : "translate(100 0) scale(-1 1)"} /></clipPath>
        </defs>
        <circle cx="50" cy="50" r={radius} fill={`url(#${shadeId})`} stroke="#ffffff" strokeOpacity="0.12" strokeWidth="0.7" />
        {clamped > 0 && <g clipPath={`url(#${phaseId})`}>
          <circle cx="50" cy="50" r={radius} fill={`url(#${lightId})`} />
          {craters.map(({ x, y, r }) => <g key={`${x}-${y}`}><circle cx={x} cy={y} r={r} fill="#56645d" opacity="0.15" /><circle cx={x + 0.5} cy={y + 1} r={r - 0.8} fill="#8b958a" opacity="0.15" /></g>)}
          <circle cx="50" cy="50" r="43.5" fill="none" stroke="#f2f6e6" strokeOpacity="0.2" />
        </g>}
      </svg>
      {showLabel && <figcaption className="text-center"><p className="text-sm font-medium text-astro-text">{phaseName}</p><p className="font-mono text-xs text-astro-muted">{clamped}% illuminated</p></figcaption>}
    </figure>
  );
}
