// src/pages/plant.js
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import Layout from "@/components/Layout";

// len klientsky render
const Plant3D = dynamic(() => import("@/components/Plant3D"), { ssr: false });

export default function PlantPage() {
  // ========= HERNÝ STAV =========
  const [st, setSt] = useState({
    hydration: 100,
    nutrients: 60,
    spray: 90,
    xp: 0,
    level: 1,
    mood: "happy",        // happy | neutral | sad
    potStage: 1,          // 1 = malý, 2 = stredný, 3 = väčší (Plant3D to použije cez scale)
    pests: false,         // škodcovia prítomní?
    lastWater: Date.now(),
    lastFeed: Date.now(),
    lastSpray: Date.now()
  });

  const [lastAction, setLastAction] = useState(null);
  const tickRef = useRef(Date.now());
  const lowSprayTicks = useRef(0); // help pri vzniku škodcov

  // ========= POMOCKY =========
  const needXP = useMemo(() => st.level * 40, [st.level]);
  const addXP = (n) => setSt(s => ({ ...s, xp: s.xp + n }));

  // nálada podľa stavov
  useEffect(() => {
    const mood =
      st.hydration < 30 || st.nutrients < 30 || st.spray < 30 ? "sad"
      : (st.hydration < 45 || st.spray < 45) ? "neutral"
      : "happy";
    if (mood !== st.mood) setSt(s => ({ ...s, mood }));
  }, [st.hydration, st.nutrients, st.spray]); // eslint-disable-line

  // level-up + odporúčané presadenie
  useEffect(() => {
    if (st.xp >= needXP) {
      setSt(s => {
        const next = {
          ...s,
          xp: s.xp - needXP,
          level: s.level + 1
        };
        // odporuč presadiť na leveloch 3 a 5 (zvýš potStage po akcii repot)
        return next;
      });
      setLastAction("level");
    }
  }, [st.xp, needXP]);

  // ========= TICK (schádzanie hodnôt) =========
  useEffect(() => {
    const t = setInterval(() => {
      const now = Date.now();
      if (now - tickRef.current < 8000) return; // približne každých ~8s
      tickRef.current = now;

      setSt(s => {
        const next = {
          ...s,
          hydration: Math.max(0, s.hydration - 2),
          nutrients: Math.max(0, s.nutrients - 1),
          spray:     Math.max(0, s.spray - 1),
        };
        return next;
      });

      // sledovanie nízkeho spreja -> škodcovia (od levelu 3)
      if (st.level >= 3) {
        if (st.spray < 35) {
          lowSprayTicks.current += 1;
          if (!st.pests && lowSprayTicks.current >= 4) {
            setSt(s => ({ ...s, pests: true }));
            lowSprayTicks.current = 0;
          }
        } else {
          lowSprayTicks.current = 0;
        }
      }
    }, 2500);
    return () => clearInterval(t);
  }, [st.level, st.pests, st.spray]);

  // ========= AKCIE =========
  const water = () => {
    setSt(s => ({
      ...s,
      hydration: Math.min(100, s.hydration + 18),
      lastWater: Date.now()
    }));
    addXP(6);
    setLastAction("water");
  };

  const feed = () => {
    setSt(s => ({
      ...s,
      nutrients: Math.min(100, s.nutrients + 14),
      lastFeed: Date.now()
    }));
    addXP(6);
    setLastAction("feed");
  };

  const spray = () => {
    setSt(s => {
      const cleared = s.pests && s.spray <= 65; // rozumná podmienka na odstránenie
      return {
        ...s,
        spray: Math.min(100, s.spray + 12),
        pests: cleared ? false : s.pests,
        lastSpray: Date.now()
      };
    });
    addXP( clearedPestsReward() );
    setLastAction("spray");
  };
  const clearedPestsReward = () => (st.pests ? 10 : 6);

  const repot = () => {
    // presádzanie má zmysel okolo levelu 3 a 5
    const eligible = st.level >= 3 && st.potStage < 3;
    setSt(s => ({
      ...s,
      potStage: eligible ? s.potStage + 1 : s.potStage,
      nutrients: Math.min(100, s.nutrients + 10),
      hydration: Math.max(60, s.hydration - 8)
    }));
    addXP( eligible ? 14 : 6 );
    setLastAction("repot");
  };

  // ========= ODVODENÉ TEXTY / TAGY =========
  const tags = useMemo(() => {
    const arr = [];
    if (st.level >= 3 && st.potStage === 1) arr.push("Empfohlen: Umtopfen bald");
    if (st.level >= 5 && st.potStage === 2) arr.push("Empfohlen: Größerer Topf");
    if (st.pests) arr.push("Schädlinge! Spray benutzen");
    return arr;
  }, [st.level, st.potStage, st.pests]);

  // ========= RENDER =========
  return (
    <Layout>
      <main className="container" style={{ paddingBlock: 16 }}>
        <section className="card plant-wrap" style={{ marginBottom: 16 }}>
          <div className="plant-tags">
            {tags.map((t,i)=>(
              <span key={i} className={`tag ${t.includes("Schädlinge") ? "danger" : ""}`}>{t}</span>
            ))}
          </div>

          <h2 className="title" style={{ marginTop: 0 }}>GreenBuddy – 3D Monstera</h2>
          <p className="subtitle">
            Stimmung: {st.mood === "happy" ? "glücklich" : st.mood === "neutral" ? "okay" : "traurig"}
            {" • "}Level {st.level}
            {" • "}XP {st.xp}/{needXP}
          </p>

          {/* 3D rastlina */}
          <Plant3D state={st} lastAction={lastAction} />

          {/* Stavové karty */}
          <div className="grid grid-3" style={{ marginTop: 12 }}>
            <div className="card"><strong>Hydration</strong><div>{st.hydration}</div></div>
            <div className="card"><strong>Nährstoffe</strong><div>{st.nutrients}</div></div>
            <div className="card"><strong>Spray</strong><div>{st.spray}</div></div>
          </div>

          {/* Ovládanie */}
          <div className="controls">
            <button className="btn" onClick={water} disabled={st.hydration >= 96}>Gießen</button>
            <button className="btn" onClick={feed} disabled={st.nutrients >= 96}>Düngen</button>
            <button className="btn" onClick={spray}>Sprühen</button>
            <button className="btn ghost" onClick={repot} disabled={st.potStage >= 3}>Umtopfen</button>
            <button
              className="btn"
              onClick={() => { setSt(s => ({ ...s, hydration: 12 })); setLastAction("alert"); }}
            >
              Problem simulieren
            </button>
          </div>
        </section>
      </main>
    </Layout>
  );
            }
