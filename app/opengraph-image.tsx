import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Astroboat astronomy intelligence and sky tools";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

const stars = [
  [88, 88, 2],
  [172, 156, 1],
  [260, 76, 1],
  [378, 128, 2],
  [514, 72, 1],
  [690, 116, 1],
  [788, 78, 2],
  [996, 132, 1],
  [1094, 82, 2],
  [142, 382, 1],
  [294, 492, 2],
  [426, 416, 1],
  [616, 510, 1],
  [846, 456, 2],
  [1040, 506, 1],
  [1118, 364, 1]
];

function SocialImage() {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#070B14",
        color: "#E5E7EB",
        fontFamily: "Arial, Helvetica, sans-serif"
      }}
    >
      <svg
        width="1200"
        height="630"
        viewBox="0 0 1200 630"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.9
        }}
      >
        <rect width="1200" height="630" fill="#070B14" />
        <path d="M-80 188C188 82 484 70 813 154C1032 210 1190 198 1326 114" stroke="#1E293B" strokeWidth="2" fill="none" />
        <path d="M-116 504C160 384 424 332 696 348C928 362 1108 302 1296 196" stroke="#1E293B" strokeWidth="1.5" fill="none" />
        <ellipse cx="924" cy="314" rx="340" ry="104" stroke="#7DD3FC" strokeOpacity="0.22" strokeWidth="2" fill="none" />
        <ellipse cx="924" cy="314" rx="224" ry="68" stroke="#D6A84F" strokeOpacity="0.2" strokeWidth="2" fill="none" />
        <circle cx="924" cy="314" r="7" fill="#D6A84F" />
        <circle cx="1022" cy="274" r="3.5" fill="#7DD3FC" />
        <path d="M0 525H1200" stroke="#1E293B" strokeWidth="1" />
        <path d="M0 105H1200" stroke="#1E293B" strokeWidth="1" opacity="0.5" />
        <path d="M120 0V630M360 0V630M600 0V630M840 0V630M1080 0V630" stroke="#1E293B" strokeWidth="1" opacity="0.22" />
      </svg>

      {stars.map(([left, top, dotSize], index) => (
        <div
          key={`${left}-${top}-${index}`}
          style={{
            position: "absolute",
            left,
            top,
            width: dotSize,
            height: dotSize,
            borderRadius: 999,
            background: index % 3 === 0 ? "#D6A84F" : "#7DD3FC",
            opacity: index % 2 === 0 ? 0.8 : 0.45
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          left: 72,
          top: 70,
          display: "flex",
          alignItems: "center",
          gap: 14,
          color: "#94A3B8",
          fontSize: 22,
          letterSpacing: 3,
          textTransform: "uppercase"
        }}
      >
        <div style={{ width: 38, height: 1, background: "#D6A84F" }} />
        Observatory feed
      </div>

      <div
        style={{
          position: "absolute",
          left: 72,
          top: 150,
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div
          style={{
            fontSize: 108,
            fontWeight: 700,
            letterSpacing: -2,
            lineHeight: 1,
            color: "#F8FAFC"
          }}
        >
          Astroboat
        </div>
        <div
          style={{
            marginTop: 26,
            fontSize: 44,
            lineHeight: 1.18,
            color: "#E5E7EB"
          }}
        >
          Astronomy Intelligence & Sky Tools
        </div>
        <div
          style={{
            marginTop: 42,
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#D6A84F",
            fontSize: 28,
            fontWeight: 600
          }}
        >
          Briefs • Events • Moon • Asteroids
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 72,
          bottom: 62,
          display: "flex",
          alignItems: "center",
          gap: 12,
          color: "#94A3B8",
          fontSize: 24
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: 999, background: "#86EFAC" }} />
        astroboat.in
      </div>
    </div>
  );
}

export default function Image() {
  return new ImageResponse(<SocialImage />, size);
}
