import { useEffect, useMemo, useRef, useState } from "react";
import MonsteraLeafLottie from "@/components/MonsteraLeafLottie";
import PotBuddy from "@/components/PotBuddy";

const xpNeed = (lvl) => lvl * 40;
const clamp = (n, a=0, b=100) => Math.max(a, Math.min(b, n));

export default function Plant2D() {
  const [name, setName] = useState(() => localStorage.getItem("plant_name") || "Monstera");
  const [mode, setMode] = useState("happy"); // pre PotBuddy: happy | sad | speaking

  const [st, setSt] = useState({
    hydration: 100,
    nutrients: 60,
    spray: 90,
    xp: 0,
    level: 1,
  });
  const [lastAction, setLastAction] = useState(null);
  const audio = useRef(null);

  // mini „píp“ zvuk
  useEffect(() => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audio.current = ctx;
    return () => ctx.close();
  }, []);
  const beep = (freq=880, t=0.07) => {
    const ctx = audio.current; if (!ctx) return;
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = "sine"; o.frequency.value = freq;
    o.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(0.001, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t);
    o.start(); o.stop(ctx.currentTime + t);
  };

  // level-up + nálada
  useEffect(() => {
    let cur = st;
    while (cur.xp >= xpNeed(cur.level)) {
      cur = { ...cur, xp: cur.xp - xpNeed(cur.level), level: cur.level + 1 };
      beep(1200, .09);
    }
    if (cur !== st) setSt(cur);

    const sad = cur.hydration < 30 || cur.nutrients < 30 || cur.spray < 30;
    setMode(sad ? "sad" : "happy");
  }, [st.xp, st.hydration, st.nutrients, st.spray]); // eslint-disable-line

  // akcie
  const act = (type) => {
    setSt((s) => {
      const n = { ...s };
      if (type === "water")     n.hydration = clamp(s.hydration + 18);
      if (type === "feed")      n.nutrients = clamp(s.nutrients + 14);
      if (type === "spray")     n.spray     = clamp(s.spray + 12);
      if (type === "repot")    { n.nutrients = clamp(s.nutrients + 10); n.hydration = clamp(s.hydration - 8, 40, 100); }
      n.xp += type === "repot" ? 10 : 6;
      return n;
    });
    setLastAction(type);
    setMode("speaking");
    beep();
    setTimeout(() => setMode("happy"), 600);
  };

  // textové hlášky (a hlas)
  const message = useMemo(() => {
    const want = [];
    if (st.hydration < 30) want.push("vodu");
    if (st.nutrients < 30) want.push("hnojivo");
    if (st.spray < 30)     want.push("spršku");
    if (!want.length) return `Som ${name} a som šťastná 🌿`;
    if (want.length === 1) return `Prosím, ${want[0]}!`;
    if (want.length === 2) return `Prosím, ${want[0]} a ${want[1]}!`;
    return "Prosím, všetko! 🌧️🧪🌫️";
  }, [st, name]);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(message);
    u.lang = "sk-SK";
    u.rate = 1.05;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    return () => window.speechSynthesis.cancel();
  }, [message]);

  // počet listov podľa levelu (max 6)
  const leaves = Math.min(1 + Math.floor(st.level / 2), 6);

  // uloženie mena
  useEffect(() => {
    localStorage.setItem("plant_name", name);
  }, [name]);

  return (
    <div>
      {/* HLAVIČKA s menom a XP */}
      <div style={{ display:"flex", alignItems:"baseline", gap:12, justifyContent:"space-between" }}>
        <div>
          <h2 style={{ margin: "0 0 4px" }}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label="Meno rastlinky"
              style={{
                font: "inherit", fontWeight: 800, border: "none", background: "transparent",
                borderBottom: "2px solid #b9d7c0", outline: "none", padding: "2px 4px", borderRadius: 6
              }}
            />
          </h2>
          <div style={{ opacity:.8 }}>
            Stimmung: {mode === "sad" ? "traurig" : "glücklich"} • Level {st.level} • XP {st.xp}/{xpNeed(st.level)}
          </div>
        </div>
        <a className="btn ghost" href="/minigames">🎮 Minihry</a>
      </div>

      {/* STAGE */}
      <div className="stage">
        {/* listy – vyrastajú postupne, každý trochu väčší */}
        {Array.from({ length: leaves }).map((_, i) => {
          const k = i - (leaves - 1) / 2;               // rozloženie okolo stredu
          const spread = 60;                            // vodorovné rozostupy
          const size = 220 + i * 26;                    // rastúca veľkosť
          return (
            <MonsteraLeafLottie
              key={i}
              size={size}
              x={k * spread}
              y={-36}
              growFrom={0.55}
              growTo={1}
              delay={i * 240}
              flip={k < 0}
              speed={0.95}
            />
          );
        })}

        {/* kvetináč s tvárou */}
        <PotBuddy size={280} mood={mode === "speaking" ? "speaking" : mode} />

        {/* bublina s hláškou */}
        <div className="bubble">{message}</div>
      </div>

      {/* stavové kartičky */}
      <div className="grid">
        <div className="card"><strong>Hydration</strong><div>{st.hydration}</div></div>
        <div className="card"><strong>Nährstoffe</strong><div>{st.nutrients}</div></div>
        <div className="card"><strong>Spray</strong><div>{st.spray}</div></div>
      </div>

      {/* akcie */}
      <div className="actions">
        <button className="btn" onClick={() => act("water")}>💧 Gießen</button>
        <button className="btn" onClick={() => act("feed")}>🧪 Düngen</button>
        <button className="btn" onClick={() => act("spray")}>🌫️ Sprühen</button>
        <button className="btn ghost" onClick={() => act("repot")}>🪴 Umtopfen</button>
      </div>

      <style jsx>{`
        .stage {
          position: relative;
          width: min(560px, 96vw);
          height: 420px;
          margin: 14px auto 8px;
          border-radius: 20px;
          background: radial-gradient(120% 100% at 50% 0%, #edf7f0 0%, #f7fff9 60%, #f7fff9 100%);
          overflow: hidden;
        }
        .bubble {
          position: absolute;
          left: 50%; top: 16px; transform: translateX(-50%);
          background: #2b3d33; color: #fff; padding: 8px 14px; border-radius: 999px;
          font-size: 14px;
          box-shadow: 0 6px 16px rgba(0,0,0,.08);
          animation: pop .25s ease-out;
          pointer-events: none;
          max-width: calc(100% - 24px); white-space: nowrap; text-overflow: ellipsis; overflow: hidden;
        }
        @keyframes pop { from { transform: translateX(-50%) scale(.9); opacity:.0 } to { transform: translateX(-50%) scale(1); opacity:1 } }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 10px 0; }
        .card { background: #fff; border-radius: 16px; padding: 14px; box-shadow: 0 6px 20px rgba(0,0,0,.06); text-align:center; }
        .actions { display:flex; gap:12px; flex-wrap:wrap; margin-top: 8px; }
        .btn { background:#2f6b3f; color:#fff; border:none; padding:10px 14px; border-radius:14px; font-weight:600; }
        .btn.ghost { background: #fff; color:#2f6b3f; border:2px solid #2f6b3f; }
      `}</style>
    </div>
  );
        }
