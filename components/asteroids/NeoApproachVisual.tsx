import { formatLunarDistance } from "@/lib/utils";

type NeoApproachVisualProps = {
  distanceLunar?: number;
  label?: string;
};

export function NeoApproachVisual({ distanceLunar, label = "Near-Earth object approach diagram" }: NeoApproachVisualProps) {
  return (
    <svg className="h-32 w-full" viewBox="0 0 260 130" role="img" aria-label={label}>
      <defs>
        <pattern id="neo-grid" width="26" height="26" patternUnits="userSpaceOnUse">
          <path d="M26 0H0V26" fill="none" stroke="#1E293B" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="260" height="130" fill="url(#neo-grid)" opacity="0.22" />
      <path d="M24 92 C78 28 176 28 234 88" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 5" />
      <path d="M52 92 C98 54 164 54 210 88" fill="none" stroke="#D6A84F" strokeWidth="2" />
      <line x1="114" y1="78" x2="188" y2="80" stroke="#64748B" strokeWidth="1" strokeDasharray="3 4" />
      <circle cx="114" cy="78" r="15" fill="#0F766E" opacity="0.85" />
      <circle cx="109" cy="73" r="4" fill="#7DD3FC" opacity="0.7" />
      <circle cx="188" cy="80" r="5" fill="#D6A84F" />
      <circle cx="188" cy="80" r="12" fill="none" stroke="#D6A84F" strokeOpacity="0.22" />
      <text x="91" y="116" fill="#94A3B8" fontSize="9" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
        EARTH
      </text>
      <text x="147" y="116" fill="#94A3B8" fontSize="9" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace">
        {formatLunarDistance(distanceLunar)}
      </text>
    </svg>
  );
}
