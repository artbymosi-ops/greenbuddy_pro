// src/components/MonsteraToon.jsx
import React from "react";

/**
 * MonsteraToon – hravá 2D Monstera
 * props:
 *  - size: px (default 360)
 *  - level: 1..10+ (pribúdajú listy a fenestrácie)
 *  - mood: "happy" | "neutral" | "sad" | "talk" (ovplyvní výraz)
 *  - wind: 0..1 (amplitúda hojdania listov)
 *  - face: "leaf" | "pot"  (default "leaf" – tvár na liste)
 */
export default function MonsteraToon({
  size = 360,
  level = 1,
  mood = "happy",
  wind = 0.35,
  face = "leaf",
}) {
  const w = 380;               // vnútorný viewBox šírka
  const h = 300;               // vnútorný viewBox výška
  const leaves = Math.min(6, Math.max(1, Math.floor((level + 1) / 2))); // 1..6
  const fen = Math.min(8, Math.max(0, Math.floor(level / 2)));           // 0..8
  const sway = (i) => `${2 + 1.5 * wind + (i % 2 ? 0.2 : 0)}deg`;

  // farby
  const potDark = "#8A4E34";
  const potMid = "#B67852";
  const soil = "#2e241c";
  const leafFill = "#2fb769";
  const leafFillDark = "#26a65d";
  const leafStroke = "#146b3f";

  // jednoduchý výraz
  const isSad = mood === "sad";
  const isTalk = mood === "talk";
  const mouthUp = mood === "happy" || isTalk;

  // fenestrácie – generujeme oválne „dierky“ pre masku
  const fenestrations = (side = "left") => {
    const elems = [];
    const sx = side === "left" ? -1 : 1;
    for (let i = 0; i < fen; i++) {
      const yy = -5 + i * 10 + (side === "left" ? 0 : 5);
      const xx = sx * (20 + i * 6);
      const rx = 6 + (i % 3);
      const ry = 4 + ((i + 1) % 3);
      elems.push(
        <ellipse key={side + i} cx={xx} cy={yy} rx={rx} ry={ry} fill="#000" />
      );
    }
    return elems;
  };

  // jeden list (srdcový tvar + maska fenestrácií)
  const Leaf = ({ angle = 0, dist = 0, scale = 1, isFace = false, idx = 0 }) => (
    <g
      className="leaf"
      style={{
        transformOrigin: "190px 145px",
        animationDelay: `${0.3 + idx * 0.05}s`,
      }}
      transform={`translate(190,145) rotate(${angle}) translate(${dist},0) scale(${scale})`}
    >
      <defs>
        <mask id={`maskL${idx}`}>
          <rect x="-160" y="-140" width="320" height="300" fill="#fff" />
          {/* stredová „žilová“ štrbina */}
          <rect x="-3" y="-70" width="6" height="115" fill="#000" rx="3" />
          {/* bočné fenestrácie */}
          {fenestrations("left")}
          {fenestrations("right")}
        </mask>
      </defs>

      {/* tvar listu */}
      <path
        d="M0 -84
           C 64 -84, 108 -40, 108 0
           C 108 52, 60 88, 0 96
           C -60 88, -108 52, -108 0
           C -108 -40, -64 -84, 0 -84 Z"
        fill={isFace ? leafFill : leafFillDark}
        stroke={leafStroke}
        strokeWidth="5"
        mask={`url(#maskL${idx})`}
      />
      {/* stredná žila */}
      <path d="M0 -70 L 0 80" stroke={leafStroke} strokeWidth="5" />
      {/* vedľajšie žily */}
      <path d="M0 -30 C -34 -36, -62 -28, -84 -12" stroke={leafStroke} strokeWidth="4" fill="none"/>
      <path d="M0 -30 C  34 -36,  62 -28,  84 -12" stroke={leafStroke} strokeWidth="4" fill="none"/>
      <path d="M0  10 C -40  -2,  -70 14,  -90 34" stroke={leafStroke} strokeWidth="4" fill="none"/>
      <path d="M0  10 C  40  -2,   70 14,   90 34" stroke={leafStroke} strokeWidth="4" fill="none"/>

      {/* jemný odlesk */}
      <path d="M-52 -48 C -22 -66, 22 -66, 52 -48" stroke="#bef5d2" strokeOpacity=".5" strokeWidth="6" fill="none"/>

      {/* tvár – iba ak isFace = true a face === "leaf" */}
      {isFace && face === "leaf" && (
        <g className="face" transform="translate(0,0)">
          {/* oči */}
          <g className="eye" transform="translate(-26,-12)">
            <circle r="15" fill="#fff" />
            <circle r="8" cx="2" cy="2" fill="#222" />
            <circle r="3" cx="6" cy="-1" fill="#fff" />
            <path d="M-16 -16 q16 -10 32 0" stroke="#222" strokeWidth="4" fill="none" />
          </g>
          <g className="eye" transform="translate(26,-12)">
            <circle r="15" fill="#fff" />
            <circle r="8" cx="1" cy="2" fill="#222" />
            <circle r="3" cx="5" cy="-1" fill="#fff" />
            <path d="M-16 -16 q16 -10 32 0" stroke="#222" strokeWidth="4" fill="none" />
          </g>
          {/* ústa */}
          <path
            d={mouthUp ? "M-24 16 q24 18 48 0" : "M-24 24 q24 -10 48 0"}
            stroke="#222"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          {/* jazyk pri happy/talk */}
          {mouthUp && (
            <path d="M2 24 q8 10 18 0 q-10 6 -18 0 Z" fill="#ff6b6b" />
          )}
        </g>
      )}
    </g>
  );

  // rozloženie bočných listov (okolo hlavného)
  const sideLeaves = [];
  const ring = [
    { a: -26, d: 46, s: 0.88 },
    { a: 26,  d: 46, s: 0.88 },
    { a: -48, d: 64, s: 0.78 },
    { a: 48,  d: 64, s: 0.78 },
    { a: -70, d: 78, s: 0.68 },
    { a: 70,  d: 78, s: 0.68 },
  ];
  for (let i = 0; i < leaves - 1; i++) {
    const r = ring[i];
    sideLeaves.push(<Leaf key={`L${i}`} idx={i} angle={r.a} dist={r.d} scale={r.s} />);
  }

  return (
    <div className="toon" style={{ width: size, maxWidth: "100%" }}>
      <svg viewBox={`0 0 ${w} ${h}`} className="svg">
        {/* tieň */}
        <ellipse cx="190" cy="270" rx="120" ry="18" fill="rgba(0,0,0,.12)" />
        {/* kvetináč */}
        <defs>
          <linearGradient id="potG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={potMid} />
            <stop offset="100%" stopColor={potDark} />
          </linearGradient>
        </defs>
        <g className="pot" transform="translate(0,-2)">
          {/* horný okraj */}
          <ellipse cx="190" cy="168" rx="115" ry="22" fill={soil} />
          {/* vnútorný tieň okraja */}
          <path d="M90 170 Q190 195 290 170" stroke="#000" strokeOpacity=".25" strokeWidth="8" fill="none"/>
          {/* telo */}
          <path d="M70 170 L310 170 L282 240 Q190 252 98 240 Z" fill="url(#potG)" />
          {/* odlesk */}
          <path d="M98 226 Q190 238 282 226" stroke="#fff" strokeOpacity=".12" strokeWidth="8" fill="none"/>
          {/* tvár na kvetináči (iba ak face === "pot") */}
          {face === "pot" && (
            <g transform="translate(190,210)">
              <circle cx="-26" cy="-6" r="10" fill="#111"/>
              <circle cx=" 26" cy="-6" r="10" fill="#111"/>
              <circle cx="-22" cy="-8" r="3" fill="#fff"/>
              <circle cx=" 30" cy="-8" r="3" fill="#fff"/>
              <path d={mouthUp ? "M-20 10 q20 14 40 0" : "M-20 18 q20 -10 40 0"} stroke="#111" strokeWidth="5" fill="none" strokeLinecap="round"/>
              {mouthUp && <path d="M0 18 q8 8 16 0 q-8 6 -16 0 Z" fill="#ff6b6b" />}
            </g>
          )}
        </g>

        {/* stonky (z hliny nahor) */}
        <g className="stems" transform="translate(190,168)">
          <path d="M-8 4 C -8 40, -6 84, -4 110" stroke={leafStroke} strokeWidth="7" fill="none" />
          <path d="M 8 4 C  8 40,  6 84,  4 110" stroke={leafStroke} strokeWidth="7" fill="none" />
          <path d="M-8 4 C -4 64, -2 96,  0 118" stroke={leafFillDark} strokeWidth="9" fill="none" />
          <path d="M 8 4 C  4 64,  2 96,  0 118" stroke={leafFill}     strokeWidth="9" fill="none" />
        </g>

        {/* listy */}
        {sideLeaves}
        {/* hlavný list s tvárou */}
        <Leaf isFace idx={99} angle={0} dist={0} scale={1} />
      </svg>

      <style jsx>{`
        .svg { width: 100%; height: auto; overflow: visible; }
        /* hojdanie vietor */
        .leaf {
          animation: sway 3.8s ease-in-out infinite alternate;
        }
        .leaf:nth-of-type(2) { animation-duration: 4.2s; }
        .leaf:nth-of-type(3) { animation-duration: 4.6s; }
        .leaf:nth-of-type(4) { animation-duration: 3.6s; }
        .leaf:nth-of-type(5) { animation-duration: 4.0s; }
        .leaf:nth-of-type(6) { animation-duration: 4.4s; }
        @keyframes sway {
          0%   { transform: rotate(-${sway(0)}); }
          100% { transform: rotate(${sway(1)}); }
        }
        /* žmurkanie – cez horné „mihalnice“ (oblúčik) posúvame maskou očí */
        .face .eye {
          animation: blink 6s ease-in-out infinite;
        }
        .face .eye:nth-child(1) { animation-delay: .2s; }
        @keyframes blink {
          0%, 92%, 100% { transform: translateY(0) scaleY(1); }
          94%           { transform: translateY(3px) scaleY(0.1); }
          96%           { transform: translateY(0) scaleY(1); }
        }
      `}</style>
    </div>
  );
        }
