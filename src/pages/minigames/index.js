// src/pages/minigames/index.js
import { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";

/* Jednoduchý generátor kupónov – ukladá do localStorage */
function awardCoupon({ tier, percent, min }) {
  const bag = JSON.parse(localStorage.getItem("gb_rewards") || "{}");
  const key = tier || `OFF${percent}_${min}`;
  if (!bag[key]) {
    bag[key] = {
      code: `${percent}OFF-${min}-${Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase()}`,
      percent,
      min,
      ts: Date.now(),
    };
    localStorage.setItem("gb_rewards", JSON.stringify(bag));
  }
  return bag[key];
}

export default function MiniGamesPage() {
  const [tab, setTab] = useState("leaves"); // leaves | ladybug
  return (
    <Layout title="Mini-hry">
      <div className="card">
        <div className="mg-toolbar">
          <div>
            <h2 className="title" style={{ margin: 0 }}>
              Mini-hry
            </h2>
            <p className="subtitle" style={{ margin: "4px 0 0" }}>
              Získaj XP pre rastlinku – a pri skvelom výkone aj zľavový kupón 🎁
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className={"btn" + (tab === "leaves" ? "" : " ghost")}
              onClick={() => setTab("leaves")}
            >
              🍃 Falling Leaves
            </button>
            <button
              className={"btn" + (tab === "ladybug" ? "" : " ghost")}
              onClick={() => setTab("ladybug")}
            >
              🐞 Ladybug Chase
            </button>
          </div>
        </div>
      </div>

      {tab === "leaves" ? <GameLeaves /> : <GameLadybug />}

      {/* lokálne štýly pre minihry */}
      <style jsx>{`
        .mg-toolbar {
          display: flex;
          align-items: center;
          gap: 10px;
          justify-content: space-between;
        }
        .mg-wrap {
          margin-top: 12px;
        }
        .board {
          position: relative;
          height: 420px;
          overflow: hidden;
          border-radius: 14px;
          background: linear-gradient(#eaf7ed, #f4fbf5);
        }
        .leaf,
        .ladybug {
          position: absolute;
          transform: translate(-50%, -50%);
          cursor: pointer;
          user-select: none;
          font-size: 28px;
        }
        .leaf.pop {
          animation: pop 0.18s ease forwards;
        }
        @keyframes pop {
          to {
            transform: translate(-50%, -50%) scale(1.4);
            opacity: 0;
          }
        }
        .modal {
          position: fixed;
          inset: 0;
          display: grid;
          place-items: center;
          background: rgba(0, 0, 0, 0.35);
        }
        .modal .box {
          background: #fff;
          padding: 16px;
          border-radius: 14px;
          max-width: 420px;
          text-align: center;
          box-shadow: var(--shadow);
        }
      `}</style>
    </Layout>
  );
}

/* -------------------- GAME 1: FALLING LEAVES -------------------- */
function GameLeaves() {
  const DURATION = 30; // sekúnd
  const TARGET = 25; // listov na kupón
  const [time, setTime] = useState(DURATION);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [leaves, setLeaves] = useState([]); // {id,x,start}
  const idc = useRef(1);
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setTime((s) => Math.max(0, s - 1)), 1000);
    const s = setInterval(spawn, 450);
    return () => {
      clearInterval(t);
      clearInterval(s);
    };
  }, [running]);

  useEffect(() => {
    if (time === 0 && running) {
      setRunning(false);
      if (score >= TARGET) {
        const c = awardCoupon({ tier: "10OFF25", percent: 10, min: 25 });
        setCoupon(c);
      }
      // XP si vieš odčítať z `score` a prirátať k rastline (ak chceš, doplním)
    }
  }, [time, running, score]);

  function spawn() {
    setLeaves((l) => [
      ...l,
      { id: idc.current++, x: Math.random() * 92 + 4, start: Date.now() },
    ]);
    setLeaves((l) => l.slice(-60)); // udržuj rozumný počet
  }
  function hit(id) {
    setLeaves((l) => l.filter((a) => a.id !== id));
    setScore((s) => s + 1);
  }
  function start() {
    setScore(0);
    setTime(DURATION);
    setCoupon(null);
    setRunning(true);
    setLeaves([]);
  }

  return (
    <div className="card mg-wrap">
      <div className="mg-toolbar">
        <div className="badge">🎯 Cieľ: {TARGET}</div>
        <div className="badge timer">⏱ {time}s</div>
        <div className="badge">⭐ Skóre: {score}</div>
        <div style={{ marginLeft: "auto" }}>
          <button className="btn" onClick={start} disabled={running}>
            {running ? "Beží…" : "Štart"}
          </button>
        </div>
      </div>

      <div className="board">
        {leaves.map((l) => (
          <LeafFaller key={l.id} x={l.x} onHit={() => hit(l.id)} />
        ))}
      </div>

      {coupon && (
        <div className="modal">
          <div className="box">
            <h3>🎉 Skvelý výkon!</h3>
            <p>
              Získavaš kupón <b>{coupon.code}</b> – <b>{coupon.percent}%</b> zľava pri
              objednávke nad <b>{coupon.min}€</b>.
            </p>
            <button className="btn" onClick={() => setCoupon(null)}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function LeafFaller({ x, onHit }) {
  const [y, setY] = useState(-20);
  const [pop, setPop] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setY((v) => v + 2.2), 30);
    return () => clearInterval(t);
  }, []);
  if (y > 420) return null;
  return (
    <div
      className={"leaf" + (pop ? " pop" : "")}
      style={{ left: `${x}%`, top: y }}
      onClick={() => {
        setPop(true);
        setTimeout(onHit, 180);
      }}
      title="Klikni!"
    >
      🪴
    </div>
  );
}

/* -------------------- GAME 2: LADYBUG CHASE -------------------- */
function GameLadybug() {
  const DURATION = 25;
  const TARGET = 12;
  const [time, setTime] = useState(DURATION);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [bug, setBug] = useState({ x: 50, y: 50 });
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setTime((s) => Math.max(0, s - 1)), 1000);
    const m = setInterval(() => move(), 750);
    return () => {
      clearInterval(t);
      clearInterval(m);
    };
  }, [running]);

  useEffect(() => {
    if (time === 0 && running) {
      setRunning(false);
      if (score >= TARGET) {
        const c = awardCoupon({ tier: "10OFF25", percent: 10, min: 25 });
        setCoupon(c);
      }
    }
  }, [time, running, score]);

  function move() {
    setBug({ x: Math.random() * 92 + 4, y: Math.random() * 82 + 8 });
  }
  function hit() {
    setScore((s) => s + 1);
    move();
  }
  function start() {
    setScore(0);
    setTime(DURATION);
    setCoupon(null);
    setRunning(true);
    move();
  }

  return (
    <div className="card mg-wrap">
      <div className="mg-toolbar">
        <div className="badge">🎯 Cieľ: {TARGET}</div>
        <div className="badge timer">⏱ {time}s</div>
        <div className="badge">⭐ Skóre: {score}</div>
        <div style={{ marginLeft: "auto" }}>
          <button className="btn" onClick={start} disabled={running}>
            {running ? "Beží…" : "Štart"}
          </button>
        </div>
      </div>

      <div className="board">
        {running && (
          <div
            className="ladybug"
            style={{ left: `${bug.x}%`, top: `${bug.y}%` }}
            onClick={hit}
            title="Klikni!"
          >
            🐞
          </div>
        )}
      </div>

      {coupon && (
        <div className="modal">
          <div className="box">
            <h3>🎉 Bravo!</h3>
            <p>
              Vyhrávaš kupón <b>{coupon.code}</b> – <b>{coupon.percent}%</b> zľava pri
              objednávke nad <b>{coupon.min}€</b>.
            </p>
            <button className="btn" onClick={() => setCoupon(null)}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
