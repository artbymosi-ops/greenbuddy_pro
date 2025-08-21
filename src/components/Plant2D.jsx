import { useEffect, useMemo, useRef } from "react";

/** 2D Monstera – realistickejší tvar s fenestráciou, tvár nad kvetináčom */
export default function Plant2D({ state, lastAction, sound = true }) {
  const level = Math.max(1, state?.level || 1);
  const mood = state?.mood || "happy";
  const fenLevel = Math.min(5, Math.floor(level / 2)); // viac dier s levelom

  // krátke „bľabotanie“ so zvukom pri zmene nálady/akcii
  useEffect(() => {
    if (!sound) return;
    let stopped = false;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.type = "sine";
    o.frequency.value = mood === "sad" ? 180 : mood === "happy" ? 420 : 260;
    g.gain.value = 0.0001;
    o.start();
    let i = 0;
    const t = setInterval(() => {
      if (stopped) return;
      g.gain.setTargetAtTime(0.08, ctx.currentTime, 0.005);
      setTimeout(() => g.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.005), 120);
      o.frequency.setTargetAtTime(o.frequency.value + (Math.random() * 80 - 40), ctx.currentTime, 0.01);
      if (++i > 10) {
        clearInterval(t);
        try { o.stop(); ctx.close(); } catch {}
      }
    }, 160);
    return () => { stopped = true; try { o.stop(); ctx.close(); } catch {} };
  }, [mood, lastAction, sound]);

  const leafFill   = mood === "sad" ? "#77c18a" : "#33c374";
  const leafStroke = mood === "sad" ? "#2b7c4e" : "#1a8e57";

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox="0 0 400 300" width="100%" height="auto">
        {/* tieň */}
        <ellipse cx="200" cy="270" rx="110" ry="16" fill="#000" opacity=".12" />

        {/* kvetináč – krajší tvar + okraj */}
        <defs>
          <linearGradient id="potBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b67956" />
            <stop offset="100%" stopColor="#7b4d35" />
          </linearGradient>
          <linearGradient id="potRim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d3a07d" />
            <stop offset="100%" stopColor="#9b6b4d" />
          </linearGradient>
          {/* tvár nech je len NAD okrajom */}
          <clipPath id="faceClip">
            <rect x="110" y="95" width="180" height="110" rx="14" />
          </clipPath>
        </defs>
        {/* hrana okraja */}
        <path d="M100 160 q100 -36 200 0 v22 q-100 36 -200 0 z" fill="url(#potRim)" />
        {/* telo kvetináča */}
        <path d="M120 178 L280 178 L260 235 Q200 246 140 235 Z" fill="url(#potBody)" />
        {/* zemina */}
        <ellipse cx="200" cy="170" rx="86" ry="14" fill="#3b2418" />

        {/* stonka */}
        <rect x="194" y="120" width="12" height="60" rx="6" fill="#2bb36a" />

        {/* listy monstery – dve hlavné + malé podľa levelu */}
        <MonsteraLeaf cx={150} cy={120} r={56} rot={-14} fill={leafFill} stroke={leafStroke} fen={fenLevel} />
        <MonsteraLeaf cx={245} cy={112} r={52} rot={12}  fill={leafFill} stroke={leafStroke} fen={fenLevel} />
        {level >= 3 && <MonsteraLeaf cx={115} cy={140} r={38} rot={-28} fill={leafFill} stroke={leafStroke} fen={fenLevel - 1} />}
        {level >= 4 && <MonsteraLeaf cx={285} cy={138} r={34} rot={22}  fill={leafFill} stroke={leafStroke} fen={fenLevel - 2} />}

        {/* tvár – nad kvetináčom (s klipom) */}
        <g clipPath="url(#faceClip)">
          <g transform="translate(0,-8)">
            <circle className="blink-eye" cx="178" cy="150" r="5.8" fill="#101417" />
            <circle className="blink-eye" cx="222" cy="150" r="5.8" fill="#101417" />
            {mood === "sad" ? (
              <path className="mouth-talk" d="M175 168 q25 -14 50 0" stroke="#101417" strokeWidth="5" strokeLinecap="round" fill="none" />
            ) : mood === "happy" ? (
              <path className="mouth-talk" d="M175 165 q25 14 50 0" stroke="#101417" strokeWidth="5" strokeLinecap="round" fill="none" />
            ) : (
              <path className="mouth-talk" d="M175 166 q25 0 50 0" stroke="#101417" strokeWidth="5" strokeLinecap="round" fill="none" />
            )}
          </g>
        </g>

        {/* efekty akcií */}
        {lastAction === "water" && <Drops />}
        {lastAction === "spray" && <Mist />}
        {lastAction === "feed"  && <Sparkles />}
      </svg>

      <style jsx>{`
        .blink-eye { transform-origin: center; animation: blink 5s linear infinite; }
        @keyframes blink { 0%,96%,100% { transform: scaleY(1) } 97%,99% { transform: scaleY(.1) } }
        .mouth-talk { animation: talk .9s ease-in-out 2 }
        @keyframes talk { 0%,100% { transform: scaleY(1) } 50% { transform: scaleY(1.6) } }
      `}</style>
    </div>
  );
}

/* --- Monstera list so „skutočnejšími“ oknami a zárezmi --- */
function MonsteraLeaf({ cx, cy, r, rot = 0, fill, stroke, fen = 2 }) {
  const id = useMemo(() => `m${Math.random().toString(36).slice(2)}`, []);
  const holes = [];
  for (let i = 0; i < fen; i++) {
    holes.push({
      // pretiahnuté okná pozdĺž žily
      type: "ellipse",
      cx: cx + (i % 2 ? r * 0.22 : -r * 0.18),
      cy: cy - r * 0.15 + i * r * 0.18,
      rx: r * (0.13 + i * 0.02),
      ry: r * (0.05 + i * 0.015),
      rot: i % 2 ? 16 : -12,
    });
    // okrajové "slits" smerujúce od okraja k žile
    holes.push({
      type: "slit",
      x1: cx + (i % 2 ? r * 0.85 : -r * 0.85),
      y1: cy - r * 0.05 + i * r * 0.16,
      x2: cx + (i % 2 ? r * 0.55 : -r * 0.55),
      y2: cy + i * r * 0.10,
      w: r * 0.09,
    });
  }

  const shape = `
    M ${cx} ${cy - r * 0.1}
    C ${cx - r * 0.9} ${cy - r * 0.8}, ${cx - r * 1.0} ${cy + r * 0.4}, ${cx} ${cy + r * 0.9}
    C ${cx + r * 1.0} ${cy + r * 0.4}, ${cx + r * 0.9} ${cy - r * 0.8}, ${cx} ${cy - r * 0.1} Z
  `;

  return (
    <g transform={`rotate(${rot} ${cx} ${cy})`}>
      <defs>
        <mask id={id}>
          <path d={shape} fill="#fff" />
          {holes.map((h, i) =>
            h.type === "slit" ? (
              <path
                key={`s${i}`}
                d={`M ${h.x1} ${h.y1} Q ${cx} ${cy} ${h.x2} ${h.y2}`}
                stroke="#000"
                strokeWidth={h.w}
                strokeLinecap="round"
                fill="none"
              />
            ) : (
              <ellipse
                key={`e${i}`}
                cx={h.cx}
                cy={h.cy}
                rx={h.rx}
                ry={h.ry}
                fill="#000"
                transform={`rotate(${h.rot} ${h.cx} ${h.cy})`}
              />
            )
          )}
        </mask>
      </defs>

      <g mask={`url(#${id})`}>
        <path d={shape} fill={fill} stroke={stroke} strokeWidth="3" />
        <path d={`M${cx} ${cy} q ${-r * 0.25} ${r * 0.4} 0 ${r * 0.8}`} stroke={stroke} strokeOpacity=".6" strokeWidth="4" fill="none" />
      </g>
    </g>
  );
}

/* efekty */
function Drops() {
  return (
    <g opacity=".9">
      {Array.from({ length: 8 }).map((_, i) => (
        <circle key={i} cx={140 + i * 18} cy={90} r="3" fill="#62d3ff"
          style={{ animation: "rain .7s ease forwards", animationDelay: `${i * 40}ms` }} />
      ))}
      <style jsx>{`@keyframes rain { 0%{transform:translateY(-10px);opacity:0} 15%{opacity:1} 100%{transform:translateY(34px);opacity:0} }`}</style>
    </g>
  );
}
function Mist() {
  return (
    <g opacity=".6">
      {Array.from({ length: 9 }).map((_, i) => (
        <circle key={i} cx={120 + i * 16} cy={86 + (i % 3) * 6} r="2.6" fill="#cfe9ff"
          style={{ animation: "mist .7s ease forwards", animationDelay: `${i * 35}ms` }} />
      ))}
      <style jsx>{`@keyframes mist { 0%{transform:translateX(0);opacity:0} 20%{opacity:.6} 100%{transform:translateX(38px);opacity:0} }`}</style>
    </g>
  );
}
function Sparkles() {
  return (
    <g>
      {Array.from({ length: 10 }).map((_, i) => (
        <circle key={i} cx={200} cy={120} r="3" fill="#a7f3d0"
          style={{ transformOrigin: "200px 120px", animation: "spark .8s ease forwards", animationDelay: `${i * 40}ms` }} />
      ))}
      <style jsx>{`@keyframes spark { 0%{transform:scale(.6);opacity:0} 40%{opacity:1} 100%{transform:scale(1.5);opacity:0} }`}</style>
    </g>
  );
                        }
