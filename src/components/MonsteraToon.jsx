import React, { useMemo } from "react";

/**
 * MonsteraToon – jedna drop-in SVG rastlinka
 * Props:
 *  - level: 1..10   (viac listov a fenestrácií)
 *  - mood:  "happy" | "neutral" | "sad" | "talk"
 *  - wind:  0..1    (amplitúda kolísania)
 *  - face:  "leaf" | "pot"   (kde je tvár)
 *  - size:  pixel šírka (výška sa prispôsobí; default 360)
 */
export default function MonsteraToon({
  level = 1,
  mood = "happy",
  wind = 0.3,
  face = "leaf",
  size = 360,
}) {
  const L = Math.max(1, Math.min(10, Math.floor(level)));

  const cfg = useMemo(() => {
    // počet listov
    const leaves =
      L <= 2 ? 1 :
      L <= 4 ? 2 :
      L <= 6 ? 3 :
      L <= 8 ? 4 : 5;

    // koľko „dierok“ na list (fenestrácia) – stupňuje sa s levelom
    const fen =
      L <= 2 ? 0 :
      L <= 4 ? 2 :
      L <= 6 ? 4 :
      L <= 8 ? 6 : 8;

    // hĺbka zárezov od okraja (0..1)
    const notch = L <= 2 ? 0.0 : L <= 4 ? 0.22 : L <= 6 ? 0.34 : L <= 8 ? 0.44 : 0.52;

    // mierka celku (rast)
    const scale = 0.9 + L * 0.06;

    return { leaves, fen, notch, scale };
  }, [L]);

  const colors = {
    leaf: mood === "sad" ? "#79c28d" : "#2fcb78",
    stroke: mood === "sad" ? "#2a8a56" : "#187e4f",
    vein: mood === "sad" ? "#2c8c59" : "#157446",
    potTop: "#3a2a22",
    potG1: "#B67852",
    potG2: "#8A4E34",
  };

  // Pomocné: vygeneruje „srdcovitý“ list so zárezmi a fenestráciou.
  // Lokálne súradnice listu: stonka je v (0,0), list smeruje nahor.
  function Leaf({ side = "left", idx = 0 }) {
    // základné krivky srdcového listu
    const dir = side === "left" ? -1 : 1;
    const w = 78;    // „šírka“ listu
    const h = 92;    // „výška“ listu

    // obrys – srdcovitý tvar (horný výrez pri stopke je jemný)
    const outline = `
      M 0 0
      C ${dir * 18} -8, ${dir * 40} -14, ${dir * 52} 10
      C ${dir * 68} 40, ${dir * 40} ${h}, ${dir * 8} ${h - 8}
      C ${dir * -10} ${h - 4}, ${dir * -26} ${h - 18}, ${dir * -30} ${h - 40}
      C ${dir * -36} ${h - 70}, ${dir * -10} -2, 0 0 Z
    `;

    // zárezy (výrezy od okraja smerom k stredovej žile)
    // počítame pár zakusnutí – ich hĺbka úmerná cfg.notch
    const notchPaths = [];
    const nCount = Math.round(3 + cfg.notch * 6); // 3..9
    for (let i = 0; i < nCount; i++) {
      const yy = 24 + (i * (h - 40)) / (nCount + 1); // pozdĺž výšky
      const depth = 10 + cfg.notch * 22;             // hĺbka
      const span = 10 + (i % 2) * 6;                 // „šírka“ zárezu
      const x1 = dir * (w - 6);
      const x2 = dir * (w - 6 - depth);
      notchPaths.push(
        <path
          key={`n-${side}-${i}`}
          d={`M ${x1} ${yy} q ${dir * -span} -4 ${dir * -span} -10 T ${x2} ${yy - 1}`}
          stroke={colors.leaf}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          opacity="0.98"
        />
      );
    }

    // fenestrácie (oválne „okienka“ okolo stredovej žily)
    const fenHoles = [];
    for (let i = 0; i < cfg.fen; i++) {
      const ry = 3 + i * 0.6;
      const rx = 6 + i * 0.8;
      const yy = 14 + (i * (h - 34)) / (cfg.fen + 1);
      const xx = dir * (12 + (i % 2 ? 10 : 6)); // strieda sa vzdialenosť
      fenHoles.push(
        <ellipse
          key={`f-${side}-${i}`}
          cx={xx}
          cy={yy}
          rx={rx}
          ry={ry}
          fill="#fff"
          opacity="0.0001" // maskujeme pomocou clipPath nižšie
        />
      );
    }

    // maska: vykrojíme fenestrácie z výplne listu
    const maskId = `fen-${side}-${idx}`;
    return (
      <g className={`leaf leaf-${side}`}>
        <defs>
          <mask id={maskId}>
            {/* plná plocha listu */}
            <path d={outline} fill="#fff" />
            {/* „čierna“ by dieru vyrezala, ale v maske je opak, preto použijeme triky: */}
            {/* Jednoducho urobíme malé tvary transparentné cez „stroke overdraw“, alebo využijeme dvojité prekrytie */}
          </mask>
        </defs>

        {/* výplň listu */}
        <path d={outline} fill={colors.leaf} stroke={colors.stroke} strokeWidth="3" />

        {/* fenestrácie – prekryjeme farbou pozadia hrnca/pozadia (na splash funguje),
            v appke je lepšie použiť masku/clipPath proti konkrétnemu pozadiu.
            Aby to fungovalo univerzálne, urobíme „vymazanie“ cez compositing trikom: */}
        <g style={{ mixBlendMode: "destination-out" }}>{fenHoles}</g>

        {/* žilky */}
        <path d={`M 0 0 C ${dir * 10} ${h * 0.25}, ${dir * 6} ${h * 0.55}, ${dir * 2} ${h * 0.85}`}
              stroke={colors.vein} strokeWidth="4" fill="none" opacity="0.6" />
        <path d={`M ${dir * 8} ${h * 0.28} q ${dir * 14} 10 ${dir * 26} 14`}
              stroke={colors.vein} strokeWidth="3" fill="none" opacity="0.5" />
        <path d={`M ${dir * -6} ${h * 0.42} q ${dir * -16} 12 ${dir * -30} 18`}
              stroke={colors.vein} strokeWidth="3" fill="none" opacity="0.5" />
      </g>
    );
  }

  // Oči + ústa (umiestnime podľa face)
  function Face() {
    // tvary úst
    const mouth =
      mood === "sad"
        ? "M 160 188 q 16 -12 32 0"
        : mood === "talk"
        ? "M 160 186 q 16 10 32 0"
        : "M 160 184 q 16 12 32 0";

    return (
      <g className={`face face-${face}`}>
        {/* oči */}
        <g className="eyes">
          <g>
            <ellipse cx="168" cy="172" rx="10" ry="10" fill="#111" />
            <circle cx="166" cy="170" r="3" fill="#fff" />
            {/* mihalnice (jemné) */}
            <path d="M158 162 q 4 -6 8 0" stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
          <g>
            <ellipse cx="208" cy="172" rx="10" ry="10" fill="#111" />
            <circle cx="206" cy="170" r="3" fill="#fff" />
            <path d="M198 162 q 4 -6 8 0" stroke="#111" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        </g>
        {/* ústa */}
        <path d={mouth} stroke="#111" strokeWidth="5" fill="none" strokeLinecap="round" />
        {mood !== "sad" && <path d="M176 184 q 6 8 12 0" stroke="#cc3a3a" strokeWidth="3" />}
      </g>
    );
  }

  // Rozmiestnenie listov okolo stonky podľa počtu
  const leafSlots = useMemo(() => {
    const base = [
      { side: "left",  dx: -22, dy: -6,  rot: -18 },
      { side: "right", dx:  22, dy: -6,  rot:  18 },
      { side: "left",  dx: -28, dy: -22, rot: -28 },
      { side: "right", dx:  28, dy: -22, rot:  28 },
      { side: "right", dx:  10, dy: -36, rot:  8  },
    ];
    return base.slice(0, cfg.leaves);
  }, [cfg.leaves]);

  return (
    <svg
      width={size}
      viewBox="0 0 360 260"
      style={{ display: "block", maxWidth: "100%" }}
    >
      {/* tieň */}
      <ellipse cx="180" cy="234" rx="110" ry="16" fill="rgba(0,0,0,.12)" />

      {/* telo kvetináča (vzadu) */}
      <defs>
        <linearGradient id="potG" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={colors.potG1} />
          <stop offset="100%" stopColor={colors.potG2} />
        </linearGradient>
      </defs>
      <path d="M96 140 L264 140 L242 210 Q180 222 118 210 Z" fill="url(#potG)" />
      {/* hlina */}
      <ellipse cx="180" cy="144" rx="86" ry="12" fill={colors.potTop} />

      {/* RASTLINA */}
      <g className="plant" transform={`translate(180,144) scale(${cfg.scale})`}>
        {/* stonka */}
        <rect x="-6" y="-2" width="12" height="92" rx="6" fill={colors.vein} />

        {/* listy */}
        {leafSlots.map((s, i) => (
          <g key={i} transform={`translate(${s.dx},${s.dy}) rotate(${s.rot})`}>
            <Leaf side={s.side} idx={i} />
          </g>
        ))}
      </g>

      {/* tvár – podľa voľby: na liste (default) alebo na kvetináči */}
      {face === "leaf" ? (
        <g transform="translate(0,-12)"><Face /></g>
      ) : (
        <g transform="translate(0,12)"><Face /></g>
      )}

      {/* horný okraj kvetináča (prekrytie) */}
      <ellipse cx="180" cy="140" rx="92" ry="16" fill={colors.potTop} />
      {/* jemný odlesk */}
      <path d="M110 156 q70 20 140 0" stroke="#fff" strokeOpacity=".06" strokeWidth="6" />

      {/* animácie */}
      <style>{`
        .plant { transform-origin: 180px 230px; animation: breathe 5s ease-in-out infinite; }
        .leaf { transform-origin: 0 0; animation: sway ${3.4 - wind}s ease-in-out infinite alternate; }
        .eyes ellipse { animation: blink 6s infinite; transform-origin: center; }
        @keyframes breathe { 0%{ transform: translateY(0) } 50%{ transform: translateY(-2px) } 100%{ transform: translateY(0) } }
        @keyframes sway { 0%{ transform: rotate(-1.6deg) } 100%{ transform: rotate(1.6deg) } }
        @keyframes blink { 0%,96%,100%{ transform: scaleY(1) } 97%,99%{ transform: scaleY(0.1) } }
      `}</style>
    </svg>
  );
}
