import { useEffect, useMemo } from "react";

/**
 * Kvetináč so zeminou + tvárička.
 * Props: size, mood ("happy"|"sad"), talking (bool), name (string)
 */
export default function PotBuddy({
  size = 240,
  mood = "happy",
  talking = false,
  name,
}) {
  const eyeOffset = size * 0.19;
  const eyeR = size * 0.085;
  const pupilR = eyeR * 0.55;

  // farby
  const pot = { base: "#9b5a2e", rim: "#7c4926", shine: "#c07a46" };
  const soil = { top: "#5b3f2b" };

  // pre „smile“ vs „sad“
  const mouthD = useMemo(() => {
    const w = size * 0.42;
    const y = size * 0.58;
    if (mood === "sad") return `M ${size/2-w/2} ${y} Q ${size/2} ${y-20}, ${size/2+w/2} ${y}`;
    return `M ${size/2-w/2} ${y} Q ${size/2} ${y+20}, ${size/2+w/2} ${y}`;
  }, [mood, size]);

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }}>
        {/* tieň */}
        <ellipse cx="100" cy="178" rx="56" ry="12" fill="#dfeadf" />

        {/* telo kvetináča (mierny lesk) */}
        <defs>
          <linearGradient id="potGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={pot.base} />
            <stop offset="100%" stopColor="#8d532a" />
          </linearGradient>
        </defs>

        {/* rim + otvor */}
        <ellipse cx="100" cy="60" rx="70" ry="16" fill={pot.rim} />
        <ellipse cx="100" cy="62" rx="62" ry="14" fill={soil.top} />
        {/* telo */}
        <path
          d="M40 60 C48 160, 152 160, 160 60 Z"
          fill="url(#potGrad)"
          stroke="#6c3f1f"
        />
        {/* lesk */}
        <path
          d="M58 84 C60 140, 78 150, 94 154"
          fill="none"
          stroke={pot.shine}
          opacity=".22"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* oči */}
        <g transform="translate(0,8)">
          {/* biele */}
          <circle cx={100 - eyeOffset} cy={98} r={eyeR} fill="#fff" />
          <circle cx={100 + eyeOffset} cy={98} r={eyeR} fill="#fff" />
          {/* zreničky */}
          <circle className="pupil" cx={100 - eyeOffset + 2} cy={100} r={pupilR} fill="#222" />
          <circle className="pupil" cx={100 + eyeOffset + 2} cy={100} r={pupilR} fill="#222" />
          {/* „iskra“ */}
          <circle cx={100 - eyeOffset - 2} cy={95} r={pupilR*0.28} fill="#fff" />
          <circle cx={100 + eyeOffset - 2} cy={95} r={pupilR*0.28} fill="#fff" />
          {/* viečka – žmurkajú */}
          <rect className="lid" x={100-eyeOffset-eyeR} y={88-eyeR} width={eyeR*2} height={eyeR*2} rx={eyeR} fill="#9b5a2e" />
          <rect className="lid" x={100+eyeOffset-eyeR} y={88-eyeR} width={eyeR*2} height={eyeR*2} rx={eyeR} fill="#9b5a2e" />
        </g>

        {/* úsmev + jazyk (otváranie pri talking) */}
        <path className={`mouth ${talking ? "talk" : ""}`} d={mouthD} fill="none" stroke="#141414" strokeWidth="6" strokeLinecap="round" />
        {mood !== "sad" && (
          <path className={`tongue ${talking ? "talk" : ""}`} d="M90 145 q10 8 20 0" fill="#e44" />
        )}
      </svg>

      {name && (
        <div style={{
          position: "absolute", top: -28, left: "50%", transform: "translateX(-50%)",
          background: "#1f3a2e", color: "#fff", padding: "6px 12px", borderRadius: 999,
          fontWeight: 700, boxShadow: "0 8px 22px rgba(0,0,0,.12)"
        }}>
          {name}
        </div>
      )}

      <style jsx>{`
        .pupil { animation: look 6s ease-in-out infinite; }
        @keyframes look {
          0%,100% { transform: translate(0,0); }
          25% { transform: translate(2px,1px); }
          50% { transform: translate(-1px,1px); }
          75% { transform: translate(1px,-1px); }
        }
        .lid {
          animation: blink 4.6s infinite;
          transform-origin: center 100px;
          opacity: .001; /* prekryje len pri bliku */
        }
        @keyframes blink {
          0%, 92%, 100% { opacity: .001; }
          94%, 96% { opacity: 1; }
        }
        .mouth.talk { animation: speak 280ms ease-in-out infinite; }
        .tongue.talk { animation: tongue 280ms ease-in-out infinite; }
        @keyframes speak {
          0%,100% { transform: scaleY(1); }
          50% { transform: scaleY(1.35); }
        }
        @keyframes tongue {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(2px); }
        }
      `}</style>
    </div>
  );
}
