import { cn } from "@/lib/utils";

type SatellitePassVisualProps = {
  className?: string;
  label?: string;
  maxElevationDegrees?: number;
  startAzimuthCompass?: string;
  endAzimuthCompass?: string;
  durationSeconds?: number;
};

export function SatellitePassVisual({
  className,
  label = "Satellite pass from rise to set",
  maxElevationDegrees,
  startAzimuthCompass,
  endAzimuthCompass,
  durationSeconds
}: SatellitePassVisualProps) {
  const peakY = typeof maxElevationDegrees === "number" && Number.isFinite(maxElevationDegrees)
    ? Math.max(22, 94 - maxElevationDegrees)
    : 39;
  const startLabel = startAzimuthCompass ?? "RISE";
  const endLabel = endAzimuthCompass ?? "SET";
  const durationLabel = typeof durationSeconds === "number" && Number.isFinite(durationSeconds)
    ? `${Math.round(durationSeconds / 60)} MIN`
    : "PEAK";

  return (
    <svg
      className={cn("h-28 w-full", className)}
      viewBox="0 0 260 120"
      role="img"
      aria-label={label}
    >
      <path d="M22 96 H238" stroke="#334155" strokeWidth="1.5" />
      <path d={`M34 94 C82 ${peakY} 176 ${peakY} 226 94`} fill="none" stroke="#7DD3FC" strokeWidth="2.5" />
      <path d={`M34 94 C82 ${peakY} 176 ${peakY} 226 94`} fill="none" stroke="#7DD3FC" strokeWidth="8" strokeOpacity="0.08" />
      <circle cx="34" cy="94" r="4" fill="#94A3B8" />
      <circle cx="130" cy={peakY + 8} r="5" fill="#D6A84F" />
      <circle cx="226" cy="94" r="4" fill="#94A3B8" />
      <path d={`M127 ${peakY} L136 ${peakY + 8} L127 ${peakY + 16} L130 ${peakY + 8} Z`} fill="#E5E7EB" opacity="0.9" />
      <text x="22" y="113" fill="#94A3B8" fontSize="9" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
        {startLabel}
      </text>
      <text x="113" y="21" fill="#94A3B8" fontSize="9" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
        {durationLabel}
      </text>
      <text x="214" y="113" fill="#94A3B8" fontSize="9" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
        {endLabel}
      </text>
    </svg>
  );
}
