import { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";

/* --- helpers --- */
function awardCoupon({ tier, percent, min }) {
  const bag = JSON.parse(localStorage.getItem("gb_rewards") || "{}");
  if (!bag[tier]) {
    bag[tier] = {
      code: `${percent}OFF-${min}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      percent, min, ts: Date.now(),
    };
    localStorage.setItem("gb_rewards", JSON.stringify(bag));
  }
  return bag[tier];
}
function addXpToPlant(xp) {
  const st = JSON.parse(localStorage.getItem("gb_plant") || "{}");
  if (!st || typeof st !== "object") return;
  st.xp = Math.max(0, (st.xp || 0) + xp);
  localStorage.setItem("gb_plant", JSON.stringify(st));
}
function flyXp(root, text = "+20 XP") {
  if (!root) return;
  const b = document.createElement("div");
  b.textContent = text;
  b.style.cssText =
    "position:absolute;left:50%;top:8px;transform:translateX(-50%);font-weight:800;background:#fff;padding:6px 10px;border-radius:12px;box-shadow:0 6px 18px #0001;animation:fly .9s ease forwards;";
  root.appendChild(b);
  setTimeout(() => b.remove(), 1000);
}
function confetti(root) {
  if (!root) return;
  const colors = ["#34d399", "#fbbf24", "#60a5fa", "#f472b6", "#a78bfa", "#f87171"];
  for (let i = 0; i < 80; i++) {
    const c = document.createElement("i");
    c.style.cssText =
      "position:absolute;top:0;left:50%;width:6px;height:10px;opacity:.9;border-radius:2px;transform:translateX(-50%);";
    c.style.background = colors[i % colors.length];
    c.style.left = `${10 + Math.random() * 80}%`;
    c.style.animation = `conf${i % 5} 900ms ease-out forwards`;
    root.appendChild(c);
    setTimeout(() => c.remove(), 1000);
  }
}

/* --- stránka --- */
export default function MiniGamesPage() {
  const [tab, setTab] = useState("leaves"); // leaves | ladybug | memory
  return (
    <Layout title="Mini-hry">
      <div className="card">
        <div className="mg-toolbar">
          <div>
            <h2 className="title" style={{ margin: 0 }}>Mini-hry</h2>
            <p className="subtitle" style={{ margin: "4px 0 0" }}>
              Získaj XP pre rastlinku – pri výbornom výkone aj kupón 🎁
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className={"btn" + (tab === "leaves" ? "" : " ghost")} onClick={() => setTab("leaves")}>🍃 Falling Leaves</button>
            <button className={"btn" + (tab === "ladybug" ? "" : " ghost")} onClick={() => setTab("ladybug")}>🐞 Ladybug Chase</button>
            <button className={"btn" + (tab === "memory" ? "" : " ghost")} onClick={() => setTab("memory")}>🧠 Pexeso</button>
          </div>
        </div>
      </div>

      {tab === "leaves" ? <GameLeaves /> : tab === "ladybug" ? <GameLadybug /> : <GameMemory />}

      <style jsx>{`
        .mg-toolbar{display:flex;align-items:center;gap:10px;justify-content:space-between}
        .mg-wrap{margin-top:12px}
        .board{position:relative;height:420px;overflow:hidden;border-radius:14px;background:linear-gradient(#eaf7ed,#f4fbf5)}
        .leaf,.ladybug,.cardx{position:absolute;transform:translate(-50%,-50%);user-select:none;cursor:pointer}
        .leaf{font-size:28px}
        .leaf.pop{animation:pop .18s ease forwards}
        @keyframes pop{to{transform:translate(-50%,-50%) scale(1.4);opacity:0}}
        @keyframes fly{to{transform:translate(-50%,-36px);opacity:0}}
        /* 5 rôznych pádov pre konfety */
        @keyframes conf0{to{transform:translateY(380px) rotate(80deg);opacity:.2}}
        @keyframes conf1{to{transform:translateY(380px) rotate(-120deg);opacity:.2}}
        @keyframes conf2{to{transform:translate(-40px,380px) rotate(140deg);opacity:.2}}
        @keyframes conf3{to{transform:translate(40px,380px) rotate(-60deg);opacity:.2}}
        @keyframes conf4{to{transform:translateY(380px) rotate(200deg);opacity:.2}}
      `}</style>
    </Layout>
  );
}

/* -------------------- GAME 1: FALLING LEAVES -------------------- */
function GameLeaves() {
  const DURATION = 30;  // s
  const TARGET = 100;   // cieľ
  const [time, setTime] = useState(DURATION);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [leaves, setLeaves] = useState([]); // {id,x,y,vx,vy,emoji}
  const idc = useRef(1);
  const boardRef = useRef(null);

  // spúšťaj čas a spawn
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setTime((s) => Math.max(0, s - 1)), 1000);
    const sp = setInterval(spawn, 280);
    const mov = setInterval(step, 28);
    return () => { clearInterval(t); clearInterval(sp); clearInterval(mov); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  useEffect(() => {
    if (time === 0 && running) finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, running]);

  function finish() {
    setRunning(false);
    const xp = Math.floor(score / 20) * 20;         // po 20 XP
    addXpToPlant(xp);
    flyXp(boardRef.current?.parentElement, `+${xp} XP`);
    if (score >= TARGET) {
      confetti(boardRef.current);
      awardCoupon({ tier: "10OFF25", percent: 10, min: 25 });
    }
  }

  function spawn() {
    const emoji = Math.random() < 0.5 ? "🍃" : "🌿";
    const x = 20 + Math.random() * 360;
    const y = -20;
    const vx = (Math.random() - 0.5) * 1.2;  // bočný vietor
    const vy = 1.6 + Math.random() * 1.4;
    setLeaves((l) => [...l, { id: idc.current++, x, y, vx, vy, emoji }].slice(-120));
  }
  function step() {
    setLeaves((l) =>
      l.map((a) => ({ ...a, x: a.x + a.vx, y: a.y + a.vy, vx: a.vx * 0.99 + Math.sin(a.y / 22) * 0.06 }))
       .filter((a) => a.y < 460)
    );
  }
  function hit(id) {
    setLeaves((l) => l.filter((a) => a.id !== id));
    setScore((s) => s + 1);
  }
  function start() {
    setScore(0); setTime(DURATION); setLeaves([]); setRunning(true);
  }

  return (
    <div className="card mg-wrap" ref={boardRef}>
      <div className="mg-toolbar">
        <div className="badge">🎯 Cieľ: {TARGET}</div>
        <div className="badge">⏱ {time}s</div>
        <div className="badge">⭐ Skóre: {score}</div>
        <div style={{ marginLeft: "auto" }}>
          <button className="btn" onClick={start} disabled={running}>{running ? "Beží…" : "Štart"}</button>
        </div>
      </div>
      <div className="board">
        {leaves.map((l) => (
          <div
            key={l.id}
            className="leaf"
            style={{ left: l.x, top: l.y }}
            onClick={() => hit(l.id)}
            title="Klikni!"
          >
            {l.emoji}
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------- GAME 2: LADYBUG CHASE -------------------- */
function GameLadybug() {
  const DURATION = 30;
  const TARGET = 100;
  const [time, setTime] = useState(DURATION);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [bug, setBug] = useState({ x: 60, y: 60, step: 800 });
  const boardRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setTime((s) => Math.max(0, s - 1)), 1000);
    const m = setInterval(move, bug.step);
    return () => { clearInterval(t); clearInterval(m); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, bug.step]);

  useEffect(() => { if (time === 0 && running) finish(); /* eslint-disable-next-line */ }, [time, running]);

  function finish() {
    setRunning(false);
    const xp = Math.floor(score / 20) * 20;
    addXpToPlant(xp);
    flyXp(boardRef.current?.parentElement, `+${xp} XP`);
    if (score >= TARGET) {
      confetti(boardRef.current);
      awardCoupon({ tier: "10OFF25", percent: 10, min: 25 });
    }
  }

  function move() {
    setBug(() => {
      const dash = Math.random() < 0.35;          // občas šprint
      return {
        x: 8 + Math.random() * 84,
        y: 10 + Math.random() * 80,
        step: dash ? 380 : 750,
      };
    });
  }
  function hit() {
    setScore((s) => s + 1);
    move();
  }
  function start() {
    setScore(0); setTime(DURATION); setRunning(true); move();
  }

  return (
    <div className="card mg-wrap" ref={boardRef}>
      <div className="mg-toolbar">
        <div className="badge">🎯 Cieľ: {TARGET}</div>
        <div className="badge">⏱ {time}s</div>
        <div className="badge">⭐ Skóre: {score}</div>
        <div style={{ marginLeft: "auto" }}>
          <button className="btn" onClick={start} disabled={running}>{running ? "Beží…" : "Štart"}</button>
        </div>
      </div>
      <div className="board">
        {running && (
          <div
            className="ladybug"
            style={{ left: `${bug.x}%`, top: `${bug.y}%`, fontSize: 28 }}
            onClick={hit}
            title="Klikni!"
          >
            🐞
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------- GAME 3: PEXESO -------------------- */
function GameMemory() {
  const PAIRS = 6;
  const EMO = ["🌿", "🍃", "🍀", "🌱", "🌵", "🌼", "🍓", "🍋", "🍄", "🫐"];
  const deck = useRef([]);
  const [cards, setCards] = useState([]);
  const [open, setOpen] = useState([]);
  const [matched, setMatched] = useState([]);
  const [running, setRunning] = useState(false);
  const [moves, setMoves] = useState(0);
  const boardRef = useRef(null);

  useEffect(() => {
    const pool = EMO.slice(0, PAIRS);
    deck.current = shuffle([...pool, ...pool]).map((e, i) => ({ id: i + 1, e }));
    setCards(deck.current);
  }, []);

  useEffect(() => {
    if (running && matched.length === PAIRS) {
      const xp = 40;                 // fixný bonus za dokončenie
      addXpToPlant(xp);
      flyXp(boardRef.current?.parentElement, `+${xp} XP`);
      confetti(boardRef.current);
      setRunning(false);
    }
  }, [matched, running]);

  function shuffle(a) {
    const b = [...a];
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
  }
  function start() {
    setOpen([]); setMatched([]); setMoves(0); setRunning(true);
    setCards(shuffle(deck.current));
  }
  function clickCard(c) {
    if (!running) return;
    if (open.find((o) => o.id === c.id)) return;
    if (matched.find((m) => m === c.e)) return;
    const o = [...open, c];
    setOpen(o);
    if (o.length === 2) {
      setMoves((m) => m + 1);
      if (o[0].e === o[1].e) {
        setMatched((m) => [...m, o[0].e]);
        setOpen([]);
      } else {
        setTimeout(() => setOpen([]), 600);
      }
    }
  }

  return (
    <div className="card mg-wrap" ref={boardRef}>
      <div className="mg-toolbar">
        <div className="badge">🃏 Pexeso</div>
        <div className="badge">🔁 Ťahy: {moves}</div>
        <div className="badge">✅ Páry: {matched.length}/{PAIRS}</div>
        <div style={{ marginLeft: "auto" }}>
          <button className="btn" onClick={start}>{running ? "Beží…" : "Štart"}</button>
        </div>
      </div>
      <div className="board" style={{ display: "grid", placeItems: "center" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 72px)", gap: 10 }}>
          {cards.map((c) => {
            const isOpen = !!open.find((o) => o.id === c.id) || matched.includes(c.e);
            return (
              <div
                key={c.id}
                className="cardx"
                onClick={() => clickCard(c)}
                style={{
                  width: 72, height: 72, borderRadius: 12, background: "#fff",
                  border: "1px solid #dbe7dc", display: "grid", placeItems: "center",
                  boxShadow: "0 8px 18px #0001", fontSize: 34,
                }}
              >
                {isOpen ? c.e : "❓"}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
                }
