import { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import PlantHUD from "@/components/PlantHUD";

// noc: 21:00–06:00
function isNight() { const h = new Date().getHours(); return h >= 21 || h < 6; }

const DEFAULT_STATE = {
  level: 1,
  xp: 0,
  hydration: 80,
  nutrients: 60,
  health: 100,
  alive: true,
  pests: false,
};

export default function PlantPage() {
  // bezpečná inicializácia cez localStorage len na klientovi
  const [state, setState] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = JSON.parse(localStorage.getItem("gb_plant") || "null");
        return saved || DEFAULT_STATE;
      } catch {}
    }
    return DEFAULT_STATE;
  });

  // perzistencia
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("gb_plant", JSON.stringify(state));
    }
  }, [state]);

  // pasívny pokles + náhodní škodcovia
  useEffect(() => {
    const t = setInterval(() => {
      setState((s) => {
        if (!s.alive) return s;
        const hydration = Math.max(0, s.hydration - 0.15);
        const health =
          Math.max(0, s.health - (hydration < 15 ? 0.2 : 0) - (s.nutrients < 10 ? 0.05 : 0));
        const pests = s.pests || (hydration < 25 && Math.random() < 0.01);
        const alive = health > 0;
        return { ...s, hydration, health, pests, alive };
      });
    }, 10_000);
    return () => clearInterval(t);
  }, []);

  function revive() {
    setState({ ...DEFAULT_STATE, hydration: 60, nutrients: 40 });
  }

  // farba listov podľa stavu
  const leafColor = useMemo(() => {
    if (!state.alive) return "#6b4f3a";                         // mŕtva – hnedá
    if (state.hydration < 20 || state.health < 30) return "#6aa84f"; // bledšia
    if (state.nutrients > 90) return "#2dc653";                 // tmavšia po prehnojení
    return "#28c76f";
  }, [state]);

  return (
    <Layout title="Meine Pflanze">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>GreenBuddy – 3D Monstera</h2>
        <p className="subtitle">
          Stimmung: {state.alive ? (isNight() ? "schläft" : "glücklich") : "✖ tot"} • Level{" "}
          {state.level} • XP {state.xp}/40
        </p>

        {/* tlačidlo na minihry */}
        <a className="btn" href="/minigames" style={{ marginTop: 12, marginBottom: 8 }}>
          🎮 Minihry (získaj XP &amp; kupóny)
        </a>

        {/* rastlina */}
        <div style={{ position: "relative", height: 220, margin: "12px 0" }}>
          {/* hrniec + tieň */}
          <div style={{ position: "absolute", left: "50%", top: "55%", transform: "translate(-50%,-50%) scale(1.1)" }}>
            <svg width="220" height="160" viewBox="0 0 220 160">
              <ellipse cx="110" cy="140" rx="80" ry="18" fill="rgba(0,0,0,.12)" />
              <path d="M40 60h140l-16 60c-3 11-14 18-26 18H82c-12 0-23-7-26-18L40 60z" fill="#7a4b35" />
              <ellipse cx="110" cy="60" rx="70" ry="14" fill="#3a2a22" />
            </svg>
          </div>

          {/* stonka */}
          <div style={{ position: "absolute", left: "50%", top: "30%", transform: "translateX(-50%)" }}>
            <div style={{ width: 12, height: 70, background: "#1e9c5c", borderRadius: 12 }} />
          </div>

          {/* jednoduché listy monstery + tvár */}
          <svg
            style={{ position: "absolute", left: "50%", top: "18%", transform: "translateX(-50%)" }}
            width="240"
            height="140"
            viewBox="0 0 240 140"
          >
            <g>
              {/* dva hlavné listy */}
              <path
                d="M120 70 C 90 10, 20 20, 30 70 C 40 110, 95 120, 120 70 Z"
                fill={leafColor}
              />
              <path
                d="M120 70 C 150 10, 220 20, 210 70 C 200 110, 145 120, 120 70 Z"
                fill={leafColor}
              />
              {/* zárezy */}
              <path
                d="M70 60 l15 10 M85 45 l18 14 M155 45 l-18 14 M170 60 l-15 10"
                stroke="#2b8d5e"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </g>

            {/* tvár */}
            <g style={{ opacity: isNight() ? 0.5 : 1 }}>
              <circle cx="100" cy="68" r="5" fill="#163b2c" />
              <circle cx="140" cy="68" r="5" fill="#163b2c" />
              <path
                d={state.alive ? "M108 84 q12 10 24 0" : "M108 90 q12 -8 24 0"}
                stroke="#163b2c"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          </svg>

          {/* škodca – behajúca lienka */}
          {state.pests && (
            <span
              role="img"
              aria-label="bug"
              style={{
                position: "absolute",
                fontSize: 22,
                top: 12,
                left: 12,
                animation: "bug 6s linear infinite",
              }}
            >
              🐞
            </span>
          )}
        </div>

        {!state.alive && (
          <button className="btn" onClick={revive}>
            Začať odznova
          </button>
        )}

        <div style={{ marginTop: 12 }}>
          <PlantHUD state={state} setState={setState} />
        </div>
      </div>
    </Layout>
  );
            }
