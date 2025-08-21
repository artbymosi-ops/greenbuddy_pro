// src/components/MonsteraAvatar.jsx
import { useMemo } from "react";

/**
 * MonsteraAvatar
 * props:
 *  - size: px (default 300)
 *  - level: 1..10 (ovplyvní počet listov & fenestráciu)
 *  - mood: "happy" | "neutral" | "sad" | "talk"
 *  - wind: 0..1 (amplitúda hojdania)
 */
export default function MonsteraAvatar({
  size = 300,
  level = 1,
  mood = "happy",
  wind = 0.5,
}) {
  // koľko listov a koľko dier podľa levelu
  const cfg = useMemo(() => {
    const leaves = Math.min(6, 2 + Math.floor(level / 2)); // 2..6 listov
    const fen = Math.min(8, 1 + Math.floor(level * 0.8));  // 1..8 dier
    return { leaves, fen };
  }, [level]);

  // rozmiestnenie listov okolo stonky
  const angles = useMemo(() => {
    const base = [-28, -12, 8, 22, 36, 48]; // stupne od vertikály
    return base.slice(0, cfg.leaves);
  }, [cfg.leaves]);

  return (
    <div className="wrap" style={{ width: size, height: size * 0.78 }}>
      <svg
        className="svg"
        viewBox="0 0 360 280"
        width="100%"
        height="100%"
        role="img"
        aria-label="Monstera avatar"
      >
        {/* tieň */}
        <ellipse cx="180" cy="255" rx="96" ry="16" fill="rgba(0,0,0,.08)" />

        {/* hrniec – telo */}
        <defs>
          {/* otvor hrnca – nech rastlina vyrastá zvnútra */}
          <clipPath id="mouth">
            <ellipse cx="180" cy="160" rx="96" ry="18" />
          </clipPath>

          {/* gradient hrnca */}
          <linearGradient id="potG" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#bf7851" />
            <stop offset="100%" stopColor="#8d5137" />
          </linearGradient>
        </defs>

        {/* vnútro hrnca + telo */}
        <path
          d="M72 160 L288 160 L264 220 Q180 232 96 220 Z"
          fill="url(#potG)"
        />
        <ellipse cx="180" cy="166" rx="88" ry="12" fill="#2b241e" />

        {/* RASTLINA (orezaná otvorom) */}
        <g clipPath="url(#mouth)">
          {/* stonka */}
          <rect
            x="174"
            y="158"
            width="12"
            height="86"
            rx="6"
            fill="#2db66b"
            className="stem"
          />

          {/* listy */}
          {angles.map((deg, i) => (
            <LeafMonstera
              key={i}
              cx={180}
              cy={170}
              deg={deg}
              size={62 + i * 10}
              fenestrations={cfg.fen}
              wind={wind}
              delay={0.8 + i * 0.08}
            />
          ))}
        </g>

        {/* horný okraj hrnca – prekrytie */}
        <ellipse cx="180" cy="160" rx="96" ry="18" fill="#3a2a22" />
        <path
          d="M96 174 Q180 188 264 174"
          stroke="#fff"
          strokeWidth="6"
          strokeOpacity=".08"
          fill="none"
        />

        {/* OČI a ÚSTA – nad okrajom */}
        <Face mood={mood} x={180} y={150} />
      </svg>

      <style jsx>{`
        .wrap {
          display: grid;
          place-items: center;
        }
        .svg {
          overflow: visible;
        }
        .stem {
          transform-origin: 180px 246px; /* spodok stonky */
          transform: scaleY(0);
          animation: grow 900ms ease-out 400ms forwards;
        }
        @keyframes grow {
          to {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  );
}

/** Jeden list monstéry – tvar + dierky cez masku */
function LeafMonstera({ cx, cy, deg = 0, size = 70, fenestrations = 4, wind = 0.5, delay = 0.9 }) {
  // základný tvar: srdcovitý list monstéry s hlbším zárezom pri stopke
  // používame masku na vyrezanie "dier" a "výrezov od okraja"
  const holes = [];
  const holeCount = fenestrations; // 1..8

  // otvory pri stredovej žile (oválne "dierky")
  for (let i = 0; i < holeCount; i++) {
    const t = 0.25 + (i * 0.55) / holeCount; // 0.25..0.8
    const hx = (i % 2 === 0 ? -1 : 1) * (size * (0.18 + i * 0.02)); // striedanie strán
    const hy = -size * t;
    holes.push(
      <ellipse key={`h${i}`} cx={hx} cy={hy} rx={size * 0.12} ry={size * 0.06} fill="#000" />
    );
  }

  // okrajové zárezy (slots) – 3 na každej strane
  const slots = [];
  for (let s = 0; s < Math.min(3, Math.ceil(holeCount / 2)); s++) {
    const y = -size * (0.35 + s * 0.18);
    const w = size * (0.32 + s * 0.1);
    slots.push(
      <rect key={`sl${s}L`} x={-w - 2} y={y} width={w} height={size * 0.12} fill="#000" rx={size * 0.06} />
    );
    slots.push(
      <rect key={`sl${s}R`} x={2} y={y - size * 0.01} width={w} height={size * 0.12} fill="#000" rx={size * 0.06} />
    );
  }

  return (
    <g
      transform={`translate(${cx},${cy}) rotate(${deg})`}
      style={{
        transformOrigin: `${cx}px ${cy}px`,
        animation: `sway ${3.8 + Math.random()}s ease-in-out ${delay}s infinite alternate`,
      }}
    >
      <defs>
        <mask id={`m-${cx}-${cy}-${deg}-${size}`}>
          <rect x={-400} y={-400} width="800" height="800" fill="#fff" />
          {/* vysekni dierky + okrajové zárezy */}
          {holes}
          {slots}
        </mask>
      </defs>

      {/* stopka listu */}
      <path
        d={`M0 0 C 0 -${size * 0.15}, 0 -${size * 0.3}, 0 -${size * 0.45}`}
        stroke="#137a4e"
        strokeWidth="4"
        fill="none"
      />

      {/* hlavný list */}
      <path
        d={leafPath(size)}
        fill="#2fca78"
        stroke="#178e59"
        strokeWidth="3"
        mask={`url(#m-${cx}-${cy}-${deg}-${size})`}
        style={{
          transform: "scale(0.4)",
          transformOrigin: "0px 0px",
          opacity: 0,
          animation: `unfold 500ms ease-out ${delay}s forwards`,
        }}
      />
      <style jsx>{`
        @keyframes unfold {
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes sway {
          from {
            transform: translate(0, 0) rotate(${deg - 2 * wind}deg);
          }
          to {
            transform: translate(2px, -1px) rotate(${deg + 2 * wind}deg);
          }
        }
      `}</style>
    </g>
  );
}

/** Vektor srdcovitého listu monstéry (štýlový, ale verný siluete) */
function leafPath(S) {
  // tvar so zárezom pri stopke a širším okrajom
  const w = S * 0.9;
  const h = S * 1.2;
  return `
    M 0 0
    C ${-w * 0.25} ${-h * 0.1}, ${-w * 0.55} ${-h * 0.35}, ${-w * 0.52} ${-h * 0.65}
    C ${-w * 0.48} ${-h * 0.95}, ${-w * 0.1} ${-h * 1.1}, 0 ${-h}
    C ${w * 0.1} ${-h * 1.1}, ${w * 0.48} ${-h * 0.95}, ${w * 0.52} ${-h * 0.65}
    C ${w * 0.55} ${-h * 0.35}, ${w * 0.25} ${-h * 0.1}, 0 0
    Z
  `;
}

/** Oči + ústa s emóciami + “rozprávanie” */
function Face({ x, y, mood = "happy" }) {
  const mouth = {
    happy: "M -20 0 Q 0 12 20 0",
    neutral: "M -18 0 L 18 0",
    sad: "M -20 8 Q 0 -6 20 8",
    talk: "M -10 0 Q 0 14 10 0 Q 0 -8 -10 0 Z",
  }[mood] || "M -18 0 L 18 0";

  return (
    <g transform={`translate(${x},${y})`}>
      {/* oči */}
      <circle cx="-18" cy="-8" r="5" fill="#1b1b1b">
        <animate
          attributeName="r"
          values="5;5;1;5"
          keyTimes="0;0.45;0.5;1"
          dur="4s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="18" cy="-8" r="5" fill="#1b1b1b">
        <animate
          attributeName="r"
          values="5;5;1;5"
          keyTimes="0;0.45;0.5;1"
          dur="4s"
          repeatCount="indefinite"
        />
      </circle>

      {/* ústa */}
      <path d={mouth} fill="none" stroke="#1b1b1b" strokeWidth="4">
        {mood === "talk" && (
          <animate
            attributeName="d"
            dur="0.6s"
            repeatCount="indefinite"
            values="
              M -10 0 Q 0 14 10 0 Q 0 -8 -10 0 Z;
              M -12 0 Q 0 12 12 0 Q 0 -6 -12 0 Z;
              M -8 0 Q 0 16 8 0 Q 0 -10 -8 0 Z;
              M -10 0 Q 0 14 10 0 Q 0 -8 -10 0 Z
            "
          />
        )}
      </path>
    </g>
  );
                                              }
