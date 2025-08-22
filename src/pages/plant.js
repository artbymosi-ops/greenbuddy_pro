// src/pages/plant.js
import { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import Plant2D from "@/components/Plant2D";

export default function PlantPage() {
  // meno – načítame až na klientovi
  const [name, setName] = useState("Monstera");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gb_plant_name");
      if (saved) setName(saved);
    }
  }, []);
  const rename = (e) => {
    const v = e.target.value.slice(0, 20);
    setName(v);
    if (typeof window !== "undefined") {
      localStorage.setItem("gb_plant_name", v);
    }
  };

  // režim – už len 2D
  const mode = "2d";

  // herný stav
  const [st, setSt] = useState({
    hydration: 100,
    nutrients: 60,
    spray: 90,
    xp: 0,
    level: 1,
    mood: "happy", // "happy" | "sad"
    size: 0,       // vizuálny rast
  });
  const [lastAction, setLastAction] = useState(null);

  // hovorené hlášky
  const [bubble, setBubble] = useState("");
  const speak = (text, ms = 1800) => {
    setBubble(text);
    window.clearTimeout((speak)._t);
    (speak)._t = window.setTimeout(() => setBubble(""), ms);
  };

  // odvodené hodnoty
  const xpNeed = useMemo(() => st.level * 40, [st.level]);

  // level-up + nálada
  useEffect(() => {
    if (st.xp >= xpNeed) {
      setSt((s) => ({
        ...s,
        xp: s.xp - xpNeed,
        level: s.level + 1,
        size: Math.min((s.size ?? 0) + 1, 6),
      }));
      speak("Rastiem! 🌱");
    }
    const moodNow =
      st.hydration < 30 || st.nutrients < 30 || st.spray < 30 ? "sad" : "happy";
    if (moodNow !== st.mood) {
      setSt((s) => ({ ...s, mood: moodNow }));
      speak(moodNow === "happy" ? "Som šťastná 🌿" : "Necítim sa dobre 😢");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [st.xp, st.hydration, st.nutrients, st.spray]);

  // helpery
  const addXp = (n) => setSt((s) => ({ ...s, xp: s.xp + n }));

  const water = () => {
    setSt((s) => ({ ...s, hydration: Math.min(100, s.hydration + 18) }));
    addXp(6);
    setLastAction("water");
    speak("Ďakujem za vodu 💧");
  };
  const feed = () => {
    setSt((s) => ({ ...s, nutrients: Math.min(100, s.nutrients + 14) }));
    addXp(6);
    setLastAction("feed");
    speak("Mňam, živiny! 🧪");
  };
  const spray = () => {
    setSt((s) => ({ ...s, spray: Math.min(100, s.spray + 12) }));
    addXp(6);
    setLastAction("spray");
    speak("Osvieženie! ✨");
  };
  const repot = () => {
    setSt((s) => ({
      ...s,
      nutrients: Math.min(100, s.nutrients + 10),
      hydration: Math.max(60, s.hydration - 8),
    }));
    addXp(10);
    setLastAction("repot");
    speak("Nový domov, super! 🪴");
  };

  return (
    <Layout title="Meine Pflanze">
      <main style={{ padding: 16, maxWidth: 980, margin: "0 auto" }}>
        <section className="card" style={{ marginBottom: 16, position: "relative" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2 style={{ marginTop: 0 }}>Monstera</h2>
              <p className="subtitle">
                Stimmung: {st.mood === "happy" ? "glücklich" : "traurig"} • Level {st.level} • XP{" "}
                {st.xp}/{xpNeed}
              </p>
            </div>

            {/* odkaz na minihry */}
            <a className="btn ghost" href="/minigames" style={{ alignSelf: "center" }}>
              🎮 Minihry
            </a>
          </div>

          {/* meno rastlinky */}
          <div style={{ margin: "6px 0 10px" }}>
            <label className="subtitle" htmlFor="pname">
              Názov:
            </label>{" "}
            <input
              id="pname"
              value={name}
              onChange={rename}
              placeholder="Zadaj meno"
              className="input"
              style={{ minWidth: 180, fontWeight: 600 }}
            />
          </div>

          {/* bublina s hláškou */}
          {bubble && (
            <div
              style={{
                position: "absolute",
                left: 24,
                top: 88,
                background: "#1f3a2e",
                color: "white",
                padding: "10px 14px",
                borderRadius: 20,
                boxShadow: "0 10px 30px rgba(0,0,0,.12)",
                zIndex: 2,
                maxWidth: 280,
              }}
            >
              {bubble}
            </div>
          )}

          {/* Rastlinka (iba 2D) */}
          <div style={{ marginTop: 8 }}>
            <Plant2D state={st} lastAction={lastAction} />
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

          {/* Akčné tlačidlá */}
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

      <style jsx>{`
        .input {
          appearance: none;
          border: none;
          outline: none;
          background: #f4f8f4;
          padding: 10px 12px;
          border-radius: 12px;
        }
      `}</style>
    </Layout>
  );
                         }
