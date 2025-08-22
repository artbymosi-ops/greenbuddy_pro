// src/pages/plant.js
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import MonsteraLeafLottie from "@/components/MonsteraLeafLottie";

export default function PlantPage() {
  return (
    <div style={{ width: 300, height: 300 }}>
      <MonsteraLeafLottie />
    </div>
  );
}
import Plant2D from "@/components/Plant2D";

// 3D komponent len na klientovi
const Plant3D = dynamic(() => import("@/components/Plant3D"), { ssr: false });

export default function PlantPage() {
  const [mode, setMode] = useState("2d"); // "2d" | "3d"

  // Herný stav
  const [st, setSt] = useState({
    hydration: 100,
    nutrients: 60,
    spray: 90,
    xp: 0,
    level: 1,
    mood: "happy",
    size: 0,
  });

  const [lastAction, setLastAction] = useState(null);

  // Level-up + nálada
  useEffect(() => {
    const need = st.level * 40;
    if (st.xp >= need) {
      setSt((s) => ({
        ...s,
        xp: s.xp - need,
        level: s.level + 1,
        size: Math.min((s.size ?? 0) + 1, 6),
      }));
    }
    const mood =
      st.hydration < 30 || st.nutrients < 30 || st.spray < 30 ? "sad" : "happy";
    if (mood !== st.mood) setSt((s) => ({ ...s, mood }));
  }, [st.xp, st.hydration, st.nutrients, st.spray]);

  // Helpery
  const addXp = (n) => setSt((s) => ({ ...s, xp: s.xp + n }));

  const water = () => {
    setSt((s) => ({ ...s, hydration: Math.min(100, s.hydration + 18) }));
    addXp(6);
    setLastAction("water");
  };
  const feed = () => {
    setSt((s) => ({ ...s, nutrients: Math.min(100, s.nutrients + 14) }));
    addXp(6);
    setLastAction("feed");
  };
  const spray = () => {
    setSt((s) => ({ ...s, spray: Math.min(100, s.spray + 12) }));
    addXp(6);
    setLastAction("spray");
  };
  const repot = () => {
    setSt((s) => ({
      ...s,
      nutrients: Math.min(100, s.nutrients + 10),
      hydration: Math.max(60, s.hydration - 8),
    }));
    addXp(10);
    setLastAction("repot");
  };

  return (
    <Layout title="Meine Pflanze">
      <main style={{ padding: 16, maxWidth: 960, margin: "0 auto" }}>
        <section className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <h2 style={{ marginTop: 0 }}>GreenBuddy – Monstera</h2>
              <p className="subtitle">
                Stimmung: {st.mood === "happy" ? "glücklich" : "traurig"} • Level {st.level} • XP{" "}
                {st.xp}/{st.level * 40}
              </p>
            </div>

            {/* Prepínač 2D/3D */}
            <div style={{ display: "flex", gap: 8 }}>
              <button className={`btn ${mode === "2d" ? "" : "ghost"}`} onClick={() => setMode("2d")}>
                🌿 2D
              </button>
              <button className={`btn ${mode === "3d" ? "" : "ghost"}`} onClick={() => setMode("3d")}>
                🌱 3D
              </button>
            </div>
          </div>

          {/* Rastlinka */}
          <div style={{ marginTop: 8 }}>
            {mode === "2d" ? (
              <Plant2D state={st} lastAction={lastAction} />
            ) : (
              <Plant3D state={st} lastAction={lastAction} />
            )}
          </div>

          {/* Stavové karty */}
          <div className="grid grid-3" style={{ marginTop: 12 }}>
            <div className="card">
              <strong>Hydration</strong>
              <div>{st.hydration}</div>
            </div>
            <div className="card">
              <strong>Nährstoffe</strong>
              <div>{st.nutrients}</div>
            </div>
            <div className="card">
              <strong>Spray</strong>
              <div>{st.spray}</div>
            </div>
          </div>

          {/* Tlačidlá */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
            <button className="btn" onClick={water}>
              💧 Gießen
            </button>
            <button className="btn" onClick={feed}>
              🧪 Düngen
            </button>
            <button className="btn" onClick={spray}>
              🌫️ Sprühen
            </button>
            <button className="btn ghost" onClick={repot}>
              🪴 Umtopfen
            </button>
            <a className="btn" href="/minigames">
              🎮 Minihry
            </a>
          </div>
        </section>
      </main>
    </Layout>
  );
}
