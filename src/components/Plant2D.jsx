// src/components/Plant2D.jsx
import React, { useMemo } from "react";

/** 2D Monstera – realistickejšie listy + kvetináč
 * props: { state:{level, mood}, lastAction }
 */
export default function Plant2D({ state = {}, lastAction }) {
  const level = Math.max(1, Math.min(10, state.level ?? 1));
  const mood  = state.mood ?? "happy";

  // koľko listov + mierka podľa levelu
  const cfg = useMemo(() => {
    const leaves = 3 + Math.floor(level * 0.7); // 3..10
    const scale  = 0.95 + level * 0.05;
    const fen    = level >= 2;                   // od levelu 2 už má výrezy
    return { leaves, scale, fen };
  }, [level]);

  // farby podľa nálady
  const leafFill   = mood === "sad" ? "#6FBF7E" : "#31C46F";
  const leafStroke = mood === "sad" ? "#2B7D4F" : "#1A8E57";
  const vein       = mood === "sad" ? "#2A8A56" : "#157F4B";

  return (
    <div style={{ width: "100%", maxWidth: 720, margin: "0 auto" }}>
      <svg viewBox="0 0 420 320" width="100%" height="auto">
        {/* podkladový tieň */}
        <ellipse cx="210" cy="298" rx="110" ry="16" fill="#000" opacity=".12" />

        {/* T E L O  R A S T L I N Y */}
        {/* stonka */}
        <rect x="205" y="155" width="10" height="84" rx="6" fill="#2BB36A" />

        {/* listy – každý je samostatná skupina s maskou výrezov */}
        {Array.from({ length: cfg.leaves }).map((_, i) => {
          // rozloženie listov okolo stonky
          const side  = i % 2 ? 1 : -1;
          const spread = 24 + (i % 3) * 8;
          const rot   = side * (12 + (i % 4) * 4);
          const cx    = 210 + side * (38 + i * 5);
          const cy    = 180 - (i % 3) * 10 - i * 4;
          const r     = 44 + (i % 3) * 6; // „veľkosť“ listu
          const id    = `leafMask${i}`;

          // jemné oživenie pri poslednej akcii
          const animClass =
            lastAction === "spray" ? "leaf-shimmer" :
            lastAction === "water" ? "leaf-wiggle"  :
            lastAction === "feed"  ? "leaf-pulse"   : "";

          return (
            <g key={i} transform={`translate(${cx} ${cy}) rotate(${rot}) scale(${cfg.scale})`}>
              <defs>
                {/* maska pre fenestrácie (výrezy) – séra elíps okolo „stredovej žily“ */}
                <mask id={id}>
                  <rect x="-120" y="-120" width="240" height="240" fill="#fff" />
                  {cfg.fen &&
                    Array.from({ length: 7 }).map((__, k) => (
                      <ellipse
                        // dierky smerom k okraju
                        key={k}
                        cx={-r * 0.06 + (k - 3) * 9}
                        cy={-6 + k * 8}
                        rx={Math.max(3, 4 + k * 0.6)}
                        ry={Math.max(2, 3 + k * 0.5)}
                        fill="#000"
                        transform={`rotate(${side * (k % 2 ? 12 : -8)}) translate(${side * (r * 0.32)} 0)`}
                      />
                    ))}
                </mask>
              </defs>

              {/* samotný tvar listu – „monstera s lalokmi“ */}
              <g mask={`url(#${id})`} className={animClass}>
                <path
                  d={monsteraPath(r)}
                  fill={leafFill}
                  stroke={leafStroke}
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                {/* hlavná žila */}
                <path d={`M0 0 C ${-r * 0.15} ${r * 0.35}, ${-r * 0.35} ${r * 0.62}, ${-r * 0.62} ${r * 0.72}`}
                      stroke={vein} strokeWidth="4" fill="none" opacity=".55"/>
              </g>
            </g>
          );
        })}

        {/* T V Á R I Č K A */}
        <g transform="translate(0,6)">
          {/* oči */}
          <circle cx="188" cy="220" r="6" fill="#121518" className="blink-eye" />
          <circle cx="232" cy="220" r="6" fill="#121518" className="blink-eye" />
          <circle cx="186" cy="218" r="2" fill="#fff" opacity=".9" />
          <circle cx="230" cy="218" r="2" fill="#fff" opacity=".9" />

          {/* ústa – nálada */}
          {mood === "sad" ? (
            <path d="M188 236 q22 -14 44 0" stroke="#121518" strokeWidth="5" fill="none" strokeLinecap="round"/>
          ) : (
            <path d="M188 232 q22 12 44 0" stroke="#121518" strokeWidth="5" fill="none" strokeLinecap="round"/>
          )}
        </g>

        {/* K V E T I N Á Č  +  Z E M */}
        <defs>
          <linearGradient id="potBody" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"  stopColor="#8C5A3E"/>
            <stop offset="100%" stopColor="#5B3A27"/>
          </linearGradient>
          <linearGradient id="potRim" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"  stopColor="#B77B55"/>
            <stop offset="100%" stopColor="#8C5A3E"/>
          </linearGradient>
        </defs>

        {/* okraj */}
        <rect x="120" y="238" width="180" height="26" rx="13" fill="url(#potRim)"/>
        {/* zem */}
        <ellipse cx="210" cy="250" rx="82" ry="11" fill="#3A2318"/>
        {/* telo kvetináča */}
        <path d="M138 256 L282 256 L260 300 Q210 308 160 300 Z" fill="url(#potBody)"/>
      </svg>

      {/* lokálne animácie – ladia s tvojimi globálnymi */}
      <style jsx>{`
        .leaf-wiggle { animation: wiggle .45s ease; transform-origin: center; }
        .leaf-pulse  { animation: pulse  .6s  ease; }
        .leaf-shimmer{ animation: shimmer .9s ease; }
        @keyframes wiggle { 0%{transform:rotate(0)}25%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}100%{transform:rotate(0)} }
        @keyframes pulse  { 0%{filter:none}50%{filter:brightness(1.2)}100%{filter:none} }
        @keyframes shimmer{ 0%{filter:brightness(1)}50%{filter:brightness(1.35)}100%{filter:brightness(1)} }
      `}</style>
    </div>
  );
}

/** Tvar listu monstery (jedna strana, mierne „srdcový“ tvar s lalokmi) */
function monsteraPath(r) {
  // r ≈ „polomer“ listu. Vráti closed path okolo (0,0), orientované doľava.
  const w = r * 1.2, h = r * 1.0;

  // horný lalok + bočné laloky
  return [
    `M 0 0`,
    `c ${-w*0.15} ${-h*0.45}, ${-w*0.65} ${-h*0.55}, ${-w*0.75} ${-h*0.10}`, // hore vľavo
    `c ${-w*0.10} ${h*0.30}, ${-w*0.05} ${h*0.55}, ${w*0.10} ${h*0.80}`,    // spodok
    `c ${w*0.30} ${h*0.15}, ${w*0.60} ${-h*0.05}, ${w*0.65} ${-h*0.40}`,   // späť hore
    `c ${-w*0.05} ${-h*0.18}, ${-w*0.22} ${-h*0.22}, ${-w*0.10} ${-h*0.30}`, // horný „zub“
    `Z`,
  ].join(" ");
}
