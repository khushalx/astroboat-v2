import { cn } from "@/lib/utils";

type OrbitLineVisualProps = {
  className?: string;
  label?: string;
  mode?: "asteroid" | "satellite";
};

export function OrbitLineVisual({ className, label = "Orbital approach", mode = "asteroid" }: OrbitLineVisualProps) {
  return (
    <svg
      className={cn("h-28 w-full", className)}
      viewBox="0 0 240 120"
      role="img"
      aria-label={label}
    >
      <rect x="0" y="0" width="240" height="120" fill="url(#orbit-grid)" opacity="0.28" />
      <defs>
        <pattern id="orbit-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke="#1E293B" strokeWidth="1" />
        </pattern>
      </defs>
      <path
        d="M20 76 C64 18 144 18 220 78"
        fill="none"
        stroke="#334155"
        strokeWidth="1.5"
        strokeDasharray="4 5"
      />
      <path
        d="M14 92 C76 54 160 50 226 90"
        fill="none"
        stroke="#7DD3FC"
        strokeWidth="1"
        strokeOpacity="0.18"
      />
      <path
        d="M36 82 C82 42 146 43 198 78"
        fill="none"
        stroke={mode === "asteroid" ? "#D6A84F" : "#7DD3FC"}
        strokeWidth="2"
      />
      <line x1="112" y1="70" x2="177" y2="73" stroke="#64748B" strokeWidth="1" strokeDasharray="3 4" />
      <circle cx="112" cy="70" r="13" fill="#0F766E" opacity="0.85" />
      <circle cx="108" cy="66" r="4" fill="#7DD3FC" opacity="0.7" />
      <circle cx="177" cy="73" r="5" fill={mode === "asteroid" ? "#D6A84F" : "#7DD3FC"} />
      <circle cx="177" cy="73" r="11" fill="none" stroke={mode === "asteroid" ? "#D6A84F" : "#7DD3FC"} strokeOpacity="0.2" />
      <text x="92" y="103" fill="#94A3B8" fontSize="9" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
        EARTH
      </text>
      <text x="154" y="101" fill="#94A3B8" fontSize="9" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
        APPROACH
      </text>
    </svg>
  );
}
