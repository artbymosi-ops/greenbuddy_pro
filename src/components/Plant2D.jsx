// src/components/Plant2D.jsx
import MonsteraLeafLottie from "@/components/MonsteraLeafLottie";

export default function Plant2D({ state }) {
  const level = Math.max(1, state?.level ?? 1);

  // koľko listov pre daný level (príklad: 0→žiadny, 1–2→1 list, 3–4→2 listy, …)
  const leaves = Math.min(8, Math.floor((level + 1) / 2));

  // rozloženie listov (x,y posuny a mierne zrkadlenie)
  const layout = [
    { x: 0,   y: 40,  flip: false },
    { x: -90, y: 60,  flip: true  },
    { x: 90,  y: 60,  flip: false },
    { x: -130,y: 10,  flip: true  },
    { x: 130, y: 10,  flip: false },
    { x: -80, y: -30, flip: true  },
    { x: 80,  y: -30, flip: false },
    { x: 0,   y: -50, flip: false },
  ];

  return (
    <div style={{
      position: "relative",
      width: 360, height: 360,
      margin: "0 auto",
    }}>
      {/* kvetináč (SVG), hlina, tieň – očká NIE, tvár je na liste */}
      <Pot />

      {/* listy – každý s malým oneskorením, nech sa rozbaľujú postupne */}
      {Array.from({ length: leaves }).map((_, i) => (
        <MonsteraLeafLottie
          key={i}
          size={220}
          delay={i * 250}
          x={layout[i].x}
          y={layout[i].y}
          flip={layout[i].flip}
          showFace={i === leaves - 1}  // tvár na NAJNOVŠOM (vrchnom) liste
        />
      ))}
    </div>
  );
}

function Pot() {
  return (
    <svg viewBox="0 0 360 220" style={{ position: "absolute", left: 0, top: 70, width: 360, height: 220 }}>
      {/* tieň */}
      <ellipse cx="180" cy="200" rx="95" ry="15" fill="rgba(0,0,0,.08)" />
      {/* telo kvetináča */}
      <defs>
        <linearGradient id="potG" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#B67852" />
          <stop offset="100%" stopColor="#8A4E34" />
        </linearGradient>
      </defs>
      <path d="M76 120 L284 120 L260 172 Q180 182 100 172 Z" fill="url(#potG)" />
      {/* hlina + odlesk */}
      <ellipse cx="180" cy="124" rx="84" ry="11" fill="#2a221b" />
      <ellipse cx="180" cy="120" rx="92" ry="18" fill="#3a2a22" />
      <path d="M102 132 Q180 146 258 132" stroke="#fff" strokeOpacity=".08" strokeWidth="6" fill="none" />
    </svg>
  );
}
