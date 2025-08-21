// src/components/MonsteraAvatar.jsx
import React, { useMemo } from "react";

/**
 * MonsteraAvatar
 * props:
 *  - size: px (napr. 320–380)
 *  - level: 1..∞ (fenestrácia a počet listov rastie s levelom)
 *  - mood: "happy" | "neutral" | "sad" | "talk"  (ohne ústa tvar)
 *  - wind: 0..1 (amplitúda jemného kývania listov)
 */
export default function MonsteraAvatar({ size = 340, level = 1, mood = "happy", wind = 0.5 }) {
  // koľko listov a „dier“ podľa levelu
  const leafCount = Math.min(8, 2 + Math.floor(level / 2));           // 2..8 listov
  const fenHoles  = Math.min(6, Math.floor(Math.max(0, level - 1)));  // 0..6 otvorov
  const deepCuts  = Math.min(4, Math.floor(level / 3));                // hlboké rezy od okraja

  // rozmiestnenie listov okolo stonky
  const leaves = useMemo(() => {
    const out = [];
    const radius = 56;               // vzdialenosť od stonky
    for (let i = 0; i < leafCount; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const ring = Math.floor(i / 2);
      const y = -18 - ring * 16;     // vyššie pri väčšom indexe
      const x = side * (28 + ring * 10);
      const rot = side * (12 + ring * 6);
      out.push({ x, y, rot, side });
    }
    return out;
  }, [leafCount]);

  // farby podľa nálady
  const leafFill = mood === "sad" ? "#6ec78c" : "#2ecf78";
  const leafEdge = mood === "sad" ? "#2b7c4e" : "#1a8e57";

  return (
    <div className="wrap" style={{ width: size, height: size * 0.7 }}>
      <svg viewBox="-180 -150 360 260" className="svg" role="img" aria-label="Monstera plant in pot">
        {/* tieň */}
        <ellipse cx="0" cy="90" rx="110" ry="16" fill="rgba(0,0,0,.10)" />

        {/* kvetináč – vyšší a užší */}
        <defs>
          <linearGradient id="potG" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#b87552" />
            <stop offset="100%" stopColor="#8a4e34" />
          </linearGradient>
          {/* výrez hrdla hrnca – čo je nad elipsou, prekryje „okraj“ */}
          <clipPath id="mouthClip">
            <ellipse cx="0" cy="10" rx="120" ry="20" />
          </clipPath>
        </defs>

        {/* telo hrnca */}
        <path d="M-120,10 L120,10 L92,84 Q0,98 -92,84 Z" fill="url(#potG)" />
        {/* hlina */}
        <ellipse cx="0" cy="10" rx="110" ry="18" fill="#2b221b" />

        {/* rastlina – vnútri hrnca, ale oči/ústa sú na hrnci, takže idú až po hrdlo */}
        <g clipPath="url(#mouthClip)">
          {/* hlavná stonka */}
          <g transform="translate(0,8)">
            <path d="M0,20 C0,10 0,-20 0,-60" stroke="#2bb36a" strokeWidth="10" strokeLinecap="round" />
            {/* bočné konáriky */}
            <path d="M0,-18 C-6,-26 -12,-36 -16,-48" stroke="#2bb36a" strokeWidth="6" strokeLinecap="round" />
            <path d="M0,-32 C6,-40 12,-50 16,-62" stroke="#2bb36a" strokeWidth="6" strokeLinecap="round" />
          </g>

          {/* listy */}
          {leaves.map((p, i) => (
            <Leaf
              key={i}
              x={p.x}
              y={p.y}
              rot={p.rot}
              side={p.side}
              fill={leafFill}
              edge={leafEdge}
              holes={fenHoles}
              cuts={deepCuts}
              wind={wind}
            />
          ))}
        </g>

        {/* okraj hrnca navrchu */}
        <ellipse cx="0" cy="10" rx="120" ry="20" fill="#3a2a22" />

        {/* tvárička na hrnci */}
        <PotFace mood={mood} />
      </svg>

      <style jsx>{`
        .wrap { display:grid; place-items:center; }
        .svg  { width:100%; height:100%; overflow:visible; }
      `}</style>
    </div>
  );
}

/* ====== Pot face (eyes + mouth) ====== */
function PotFace({ mood }) {
  const smile = mood === "sad" ? "M-26,26 Q0,16 26,26" : "M-26,28 Q0,38 26,28";
  return (
    <g className="face">
      {/* oči – bielko + zrenička + iskra */}
      <g className="eye eye-l" transform="translate(-36,4)">
        <circle cx="0" cy="0" r="9.5" fill="#f7faf9" />
        <circle className="pupil" cx="0" cy="0" r="5.5" fill="#212121" />
        <circle cx="-2.5" cy="-2.5" r="1.6" fill="#fff" />
        {/* mihalnice (jemné) */}
        <path d="M-8,-6 l4,-3 M-10,-2 l4,-2" stroke="#2f2f2f" strokeWidth="1.6" strokeLinecap="round" />
      </g>
      <g className="eye eye-r" transform="translate(36,4)">
        <circle cx="0" cy="0" r="9.5" fill="#f7faf9" />
        <circle className="pupil" cx="0" cy="0" r="5.5" fill="#212121" />
        <circle cx="-2.5" cy="-2.5" r="1.6" fill="#fff" />
        <path d="M8,-6 l-4,-3 M10,-2 l-4,-2" stroke="#2f2f2f" strokeWidth="1.6" strokeLinecap="round" />
      </g>

      {/* úsmev + jazyk */}
      <path d={smile} stroke="#212121" strokeWidth="4" fill="none" strokeLinecap="round" />
      {mood !== "sad" && (
        <>
          <path d="M-12,28 Q0,36 12,28 Q0,34 -12,28 Z" fill="#ff6b7a" opacity=".85" />
          <path d="M0,28 q0,6 -8,6 q8,0 8,-6 Z" fill="#ff8a96" opacity=".9" />
        </>
      )}

      <style jsx>{`
        .eye .pupil {
          animation: look 6s ease-in-out infinite;
          transform-origin: center;
        }
        .eye { animation: blink 5.2s infinite; }
        @keyframes look {
          0%, 20% { transform: translate(0,0); }
          30% { transform: translate(1.8px, 0.8px); }
          60% { transform: translate(-1.6px, -0.6px); }
          80% { transform: translate(0.8px, 1.2px); }
          100% { transform: translate(0,0); }
        }
        @keyframes blink {
          0%, 92%, 100%   { transform: scaleY(1); }
          94%             { transform: scaleY(0.1); }
          96%             { transform: scaleY(1); }
        }
      `}</style>
    </g>
  );
}

/* ====== Single leaf with fenestration ====== */
function Leaf({ x, y, rot, side, fill, edge, holes, cuts, wind }) {
  // základný srdcový tvar (okolo 0,0 – napojený pri stopke)
  // mierne asymetrický pre živší dojem
  const path =
    "M0,0 " +
    "C " + (side * -26) + ",-32 " + (side * -62) + ",-6 " + (side * -54) + ",28 " +
    "C " + (side * -44) + ",66 " + (side * -4) + ",60 " + (side * 10) + ",28 " +
    "C " + (side * 18) + ",10 " + (side * 10) + ",4 0,0 Z";

  // maska na otvory + hlboké rezy
  const maskId = useMemo(() => "m" + Math.random().toString(36).slice(2), []);
  const holeDots = [];
  for (let i = 0; i < holes; i++) {
    const ry = -6 + i * 8 + (side > 0 ? 0 : 2);
    const rx = side * (i % 2 === 0 ? 16 : 22);
    const r  = 4 + (i % 2) * 1.5;
    holeDots.push({ rx, ry, r });
  }
  const cutPaths = [];
  for (let i = 0; i < cuts; i++) {
    const cy = 8 + i * 10;
    // „hlboký“ výrez od okraja smerom k stredovej žile
    const d =
      side < 0
        ? `M${-50},${cy} q20,-6 38,12`
        : `M${50},${cy} q-20,-6 -38,12`;
    cutPaths.push(d);
  }

  return (
    <g
      className="leaf"
      transform={`translate(${x},${y}) rotate(${rot})`}
      style={{ animationDuration: `${3.6 + Math.random()}s`, animationDelay: `${1 + Math.random()}s` }}
    >
      <defs>
        <mask id={maskId}>
          <rect x="-80" y="-70" width="160" height="140" fill="#fff" />
          {holeDots.map((h, i) => (
            <ellipse key={i} cx={h.rx} cy={h.ry} rx={h.r + 1} ry={h.r * 0.7 + 1} fill="#000" />
          ))}
          {cutPaths.map((d, i) => (
            <path key={i} d={d} stroke="#000" strokeWidth="9" strokeLinecap="round" />
          ))}
        </mask>
      </defs>

      {/* list */}
      <path d={path} fill={fill} stroke={edge} strokeWidth="3" mask={`url(#${maskId})`} />
      {/* stredová žila */}
      <path d={`M0,0 C ${side*-6},-10 ${side*-10},6 ${side*-8},20`} stroke={edge} strokeWidth="2.2" fill="none" />
      {/* odlesk */}
      <path
        d={`M ${side*-30},-8 q ${side*10},-6 ${side*26},6`}
        stroke="#e8fff5"
        strokeOpacity=".8"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />

      <style jsx>{`
        .leaf {
          transform-origin: 0px 0px;
          animation: sway ${3.6 + wind}s ease-in-out infinite alternate;
        }
        @keyframes sway {
          0%   { transform: rotate(${rot - 2 - 4 * wind}deg) translateX(0); }
          100% { transform: rotate(${rot + 2 + 4 * wind}deg) translateX(${side * 1.5}px); }
        }
      `}</style>
    </g>
  );
              }
