// src/pages/plant.js
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Plant2D from "@/components/Plant2D";

// 3D len na klientovi (ak komponent existuje)
const Plant3D = dynamic(() => import("@/components/Plant3D"), {
  ssr: false,
  loading: () => <div style={{ height: 320 }} />,
});

export default function PlantPage() {
  // 2D / 3D režim
  const [mode, setMode] = useState("2d"); // "2d" | "3d"

  // Herný stav
  const [st, setSt] = useState({
    hydration: 100,
    nutrients: 60,
    spray: 90,
    xp: 0,
    level: 1,
    mood: "happy", // "happy" | "sad"
  });

  // posledná akcia pre animácie/hlášky
  const [lastAction, setLastAction] = useState(null);

  // Načítať stav z localStorage (len na klientovi)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("gb_plant_state");
      if (raw) setSt((s) => ({ ...s, ...JSON.parse(raw) }));
    } catch {}
  }, []);

  // Ukladať stav po zmenách
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("gb_plant_state", JSON.stringify(st));
    } catch {}
  }, [st]);

  // Level-up + nálada
  useEffect(() => {
    const need = st.level * 40; // XP potrebná na level-up
    if (st.xp >= need) {
      setSt((s) => ({
        ...s,
        xp: s.xp - need,
        level: s.level + 1,
      }));
    }
    const mood =
      st.hydration < 30 || st.nutrients < 30 || st.spray < 30 ? "sad" : "happy";
    if (mood !== st.mood) setSt((s) => ({ ...s, mood }));
  }, [st.xp, st.hydration, st.nutrients, st.spray]); // zmeny, ktoré toto ovplyvnia

  // Helpery akcií
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
    <Layout title="Greenbuddy">
      <main style={{ padding: 16, maxWidth: 960, margin: "0 auto" }}>
        <section className="card" style={{ marginBottom: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2 style={{ margin: "4px 0 0" }}>Monstera</h2>
              <p className="subtitle" style={{ margin: "6px 0 0" }}>
                Stimmung: {st.mood === "happy" ? "glücklich" : "traurig"} • Level{" "}
                {st.level} • XP {st.xp}/{st.level * 40}
              </p>
            </div>

            {/* odkaz na minihry */}
            <a className="btn ghost" href="/minigames" style={{ whiteSpace: "nowrap" }}>
              🎮 Minihry
            </a>
          </div>

          {/* prepínač 2D/3D */}
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button
              className={`btn ${mode === "2d" ? "" : "ghost"}`}
              onClick={() => setMode("2d")}
            >
              🌿 2D
            </button>
            <button
              className={`btn ${mode === "3d" ? "" : "ghost"}`}
              onClick={() => setMode("3d")}
            >
              🌱 3D
            </button>
          </div>

          {/* Rastlinka */}
          <div style={{ marginTop: 12 }}>
            {mode === "2d" ? (
              <Plant2D state={st} lastAction={lastAction} />
            ) : (
              <Plant3D state={st} lastAction={lastAction} />
            )}
          </div>

          {/* Stavové karty */}
          <div className="grid grid-3" style={{ marginTop: 14 }}>
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

          {/* Tlačidlá akcií */}
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
          </div>
        </section>
      </main>
    </Layout>
  );
  }
