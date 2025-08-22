export default function PotBuddy({ size = 260, mood = "happy" }) {
  const mouth = {
    happy: "M70 115 q35 24 70 0",
    neutral: "M70 122 h70",
    sad: "M70 130 q35 -24 70 0",
  }[mood] || "M70 115 q35 24 70 0";

  return (
    <div style={{ position: "absolute", left: "50%", bottom: 0, transform: "translateX(-50%)", width: size, height: size * 0.62 }}>
      <svg viewBox="0 0 200 120" width="100%" height="100%" aria-hidden>
        {/* kvetináč */}
        <ellipse cx="100" cy="112" rx="76" ry="8" fill="#cfcfcf" opacity=".45" />
        <path d="M20 20 h160 l-16 80 a12 12 0 0 1 -12 10 H48 a12 12 0 0 1 -12 -10 Z" fill="#7c3f1e"/>
        <path d="M20 20 h160 v0 c0 12 -36 22 -80 22s-80-10 -80-22z" fill="#a0582b"/>

        {/* tvárička na črepníku */}
        <circle cx="78" cy="78" r="10" fill="#fff"/>
        <circle cx="122" cy="78" r="10" fill="#fff"/>
        <circle cx="80" cy="80" r="6" fill="#222"/>
        <circle cx="124" cy="80" r="6" fill="#222"/>
        <path d={mouth} fill="none" stroke="#111" strokeWidth="6" strokeLinecap="round" />
        <path d="M92 122 q16 11 32 0" fill="#e44" />
      </svg>
    </div>
  );
}
