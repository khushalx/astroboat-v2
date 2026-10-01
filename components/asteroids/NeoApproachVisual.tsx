import { formatLunarDistance } from "@/lib/utils";

type NeoApproachVisualProps = {
  distanceLunar?: number;
  label?: string;
};

export function NeoApproachVisual({ distanceLunar, label = "Near-Earth object approach diagram" }: NeoApproachVisualProps) {
  return (
    <svg className="h-40 w-full" viewBox="0 0 300 160" role="img" aria-label={label}>
      <defs>
        <radialGradient id="earth-glow" cx="35%" cy="30%" r="70%">
          <stop offset="0" stopColor="#d9edf3" />
          <stop offset="0.22" stopColor="#79b4cc" />
          <stop offset="0.74" stopColor="#284f63" />
          <stop offset="1" stopColor="#0b121b" />
        </radialGradient>
      </defs>
      <path d="M18 120 C82 24 208 18 282 105" fill="none" stroke="#51647c" strokeWidth="1" strokeDasharray="4 7" opacity="0.65" />
      <path d="M36 130 C98 70 195 53 265 96" fill="none" stroke="#d8b46a" strokeWidth="1.5" opacity="0.8" />
      <path d="M42 62 C108 118 208 118 273 48" fill="none" stroke="#8ecbe4" strokeWidth="1" strokeDasharray="2 7" opacity="0.24" />
      <line x1="126" y1="94" x2="222" y2="83" stroke="#7f8998" strokeWidth="1" strokeDasharray="3 5" />
      <circle cx="126" cy="94" r="21" fill="#8ecbe4" opacity="0.06" />
      <circle cx="126" cy="94" r="16" fill="url(#earth-glow)" />
      <path d="M114 88c5-6 8-3 13-6 3 5 8 6 10 10-4 2-6 6-9 9-6-1-8-7-14-13Z" fill="#73c79b" opacity="0.4" />
      <circle cx="222" cy="83" r="5" fill="#d8b46a" />
      <circle cx="222" cy="83" r="13" fill="none" stroke="#d8b46a" strokeOpacity="0.26" />
      <circle cx="222" cy="83" r="24" fill="none" stroke="#d8b46a" strokeOpacity="0.08" />
      <text x="108" y="137" fill="#aab3c1" fontSize="9" fontFamily="ui-sans-serif, system-ui, sans-serif">
        Earth
      </text>
      <text x="177" y="137" fill="#aab3c1" fontSize="9" fontFamily="ui-sans-serif, system-ui, sans-serif">
        {formatLunarDistance(distanceLunar)}
      </text>
    </svg>
  );
}
