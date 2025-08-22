// src/pages/plant.js
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Plant2D from "@/components/Plant2D";

export default function PlantPage() {
  // režim hry (zatím len 2D – 3D môžeš doplniť neskôr)
  const [mode] = useState("2d");

  // herný stav
  const [st, setSt] = useState({
    hydration: 100,
    nutrients: 60,
    spray: 90,
    xp: 0,
    level: 1,
    mood: "happy",
  });

  const [lastAction, setLastAction] = useState(null);

  // Level-up + nálada
  useEffect(() => {
    const need = st.level * 40;
    if (st.xp >= need) {
      setSt((s) => ({ ...s, xp: s.xp - need, level: s.level + 1 }));
    }
    const mood =
      st.hydration < 30 || st.nutrients < 30 || st.spray < 30 ? "sad" : "happy";
    if (mood !== st.mood) setSt((s) => ({ ...s, mood }));
  }, [st.xp, st.hydration, st.nutrients, st.spray]); // eslint-disable-line

  // helpery
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
              <h2 style={{ marginTop: 0, marginBottom: 6 }}>Monstera</h2>
              <p className="subtitle" style={{ margin: 0 }}>
                Stimmung: {st.mood === "happy" ? "glücklich" : "traurig"} • Level{" "}
                {st.level} • XP {st.xp}/{st.level * 40}
              </p>
            </div>
            <a className="btn ghost" href="/minigames">🎮 Minihry</a>
          </div>

          {/* Stage – 2D rastlinka */}
          <div style={{ marginTop: 12 }}>
            {mode === "2d" && <Plant2D state={st} lastAction={lastAction} />}
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

          {/* Akčné tlačidlá */}
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginTop: 16,
              alignItems: "center",
            }}
          >
            <button className="btn" onClick={water}>💧 Gießen</button>
            <button className="btn" onClick={feed}>🧪 Düngen</button>
            <button className="btn" onClick={spray}>🌫️ Sprühen</button>
            <button className="btn ghost" onClick={repot}>🪴 Umtopfen</button>
          </div>
        </section>
      </main>
    </Layout>
  );
            }
