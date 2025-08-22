export default function PotBuddy({
  size = 260,
  talk = false,        // keď true, ústa sa otvárajú
  mood = "happy",      // "happy" | "sad"
  soil = true,
}) {
  const w = size, h = size * 0.78;
  return (
    <div style={{ position: "relative", width: w, height: h, margin: "0 auto" }}>
      {/* tieň */}
      <div style={{
        position: "absolute", left: "50%", bottom: -8, width: w*0.6, height: w*0.18,
        transform: "translateX(-50%)", background: "radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,.18), rgba(0,0,0,0))",
        filter: "blur(6px)", opacity: .6,
      }}/>
      {/* črepník */}
      <svg viewBox="0 0 260 200" width={w} height={h} style={{ position:"absolute" }}>
        {/* vrchný okraj s leskom */}
        <ellipse cx="130" cy="40" rx="110" ry="26" fill="#7a4a24"/>
        <ellipse cx="130" cy="40" rx="103" ry="20" fill="#5f3b1d"/>
        {/* telo s jemným prechodom */}
        <path d="M35 40 L225 40 L205 170 Q130 190 55 170 Z"
              fill="url(#g)"/>
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8b572a"/>
            <stop offset="1" stopColor="#7a4a24"/>
          </linearGradient>
        </defs>
        {/* jemný lesk vľavo */}
        <path d="M60 60 Q70 140 60 160" stroke="rgba(255,255,255,.18)" strokeWidth="8" fill="none" />
      </svg>

      {/* zemina */}
      {soil && (
        <div style={{
          position: "absolute", left: "50%", top: h*0.34,
          width: w*0.84, height: w*0.22, transform: "translateX(-50%)",
          borderRadius: "50%", background: "linear-gradient(#5b4128,#4a3421)",
          boxShadow: "inset 0 6px 0 rgba(0,0,0,.15)",
        }} />
      )}

      {/* OČI */}
      <Eye x={w*0.36} y={h*0.5} />
      <Eye x={w*0.64} y={h*0.5} />

      {/* ÚSTA */}
      <Mouth x={w*0.5} y={h*0.64} talk={talk} mood={mood} />
    </div>
  );
}

function Eye({ x, y }) {
  const s = 38;
  return (
    <div style={{ position: "absolute", left: x - s/2, top: y - s/2, width: s, height: s }}>
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%", background: "#fff",
        boxShadow: "0 2px 2px rgba(0,0,0,.1)"
      }}/>
      <div style={{
        position: "absolute", left: "44%", top: "46%", width: s*0.38, height: s*0.38,
        borderRadius: "50%", background: "#1c1b1a"
      }}/>
      {/* lesk */}
      <div style={{
        position: "absolute", left: "56%", top: "26%", width: s*0.14, height: s*0.14,
        borderRadius: "50%", background: "rgba(255,255,255,.9)"
      }}/>
      {/* žmurkanie */}
      <div className="lid" style={{
        position: "absolute", left: 0, right: 0, top: 0, height: 0,
        background: "#7a4a24", borderBottomLeftRadius: s/2, borderBottomRightRadius: s/2,
        animation: "blink 4.2s infinite",
      }}/>
      <style jsx>{`
        @keyframes blink {
          0%, 92%, 100%   { height: 0 }
          94%             { height: ${Math.round(s*0.82)}px }
          96%             { height: 0 }
        }
      `}</style>
    </div>
  );
}

function Mouth({ x, y, talk, mood }) {
  const w = 130, h = 34;                 // rozumné hranice
  const open = talk ? 18 : 6;            // otvorenie pri rozprávaní
  const sad = mood === "sad";
  return (
    <svg width={w} height={h+18} style={{ position:"absolute", left:x-w/2, top:y-h/2 }}>
      {/* pery */}
      <path
        d={`M10 ${sad?20:18} Q ${w/2} ${sad?8:open} ${w-10} ${sad?20:18}`}
        stroke="#111" strokeWidth="12" fill="none" strokeLinecap="round"/>
      {/* jazyk */}
      {!sad && (
        <path d={`M${w/2-12} ${open+10} Q ${w/2} ${open+18} ${w/2+12} ${open+10}`}
              fill="#e14c5a"/>
      )}
    </svg>
  );
          }
