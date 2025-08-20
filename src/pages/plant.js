import { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import Plant from "@/components/Plant";
import { supabase } from "@/lib/supabaseClient"; // ak ešte nemáš, nechaj tak – stránka funguje aj bez ukladania

const XP_PER_LEVEL = 40;

export default function PlantPage() {
  const [hydration, setHydration] = useState(100);
  const [nutrients, setNutrients] = useState(70);
  const [spray, setSpray] = useState(90);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [action, setAction] = useState(null);  // pre spúšťanie animácií
  const [lastActionAt, setLastActionAt] = useState(Date.now());

  // nálada podľa stavu
  const mood = useMemo(() => {
    if (hydration <= 0 || nutrients <= 0) return "dead";
    if (hydration < 20 || nutrients < 20) return "wilt";
    if (spray < 25) return "sad";
    if (hydration < 45 || nutrients < 45) return "neutral";
    return "happy";
  }, [hydration, nutrients, spray]);

  // rast podľa levelu
  const size = useMemo(() => Math.min(1 + (level - 1) * 0.12, 2.6), [level]);

  // prirodzený pokles hodnôt (rýchlejší Tamagotchi štýl)
  useEffect(() => {
    const t = setInterval(() => {
      setHydration((v) => Math.max(0, v - 1));
      setNutrients((v) => Math.max(0, v - 0.5));
      setSpray((v) => Math.max(0, v - 0.4));
    }, 6000); // každých 6 s
    return () => clearInterval(t);
  }, []);

  // levelovanie z XP
  useEffect(() => {
    if (xp >= XP_PER_LEVEL) {
      setLevel((L) => L + 1);
      setXp((x) => x - XP_PER_LEVEL);
    }
  }, [xp]);

  // helper na spustenie krátkej akcie s animáciou
  function runAction(name, updater, xpGain = 6) {
    updater();
    setAction(name);
    setLastActionAt(Date.now());
    setXp((x) => x + xpGain);
    // po 900ms zruš „action“, aby sa animácia mohla znovu spustiť
    setTimeout(() => setAction(null), 900);
  }

  const water = () =>
    runAction("water", () => setHydration((v) => Math.min(100, v + 22)));

  const fertilize = () =>
    runAction("fertilize", () => setNutrients((v) => Math.min(100, v + 18)), 10);

  const sprayPests = () =>
    runAction("spray", () => setSpray((v) => Math.min(100, v + 18)));

  const repot = () =>
    runAction(
      "repot",
      () => {
        setNutrients((v) => Math.min(100, v + 25));
        setHydration((v) => Math.min(100, v + 10));
      },
      14
    // v handleroch len pridaj setAction(...):
const water = ()=>{ setSt(s=>({...s, hydration:Math.min(100,s.hydration+18)})); addXp(6); setAction("water"); };
const feed  = ()=>{ setSt(s=>({...s, nutrients:Math.min(100,s.nutrients+14)})); addXp(6); setAction("feed"); };
const spray = ()=>{ setSt(s=>({...s, spray:Math.min(100,s.spray+12)}));     addXp(6); setAction("spray"); };
const repot = ()=>{ setSt(s=>({...s, nutrients:Math.min(100,s.nutrients+10), hydration:Math.max(60,s.hydration-8)})); addXp(10); setAction("repot"); };
  );
  
// hore nad return:
const [action, setAction] = useState(""); // "water" | "feed" | "spray" | "repot"


// v JSX:
<Plant state={st} action={action} onAnimEnd={()=>setAction("")} pulse={pulse} />
  return (
    <Layout title="Greenbuddy – Tamagotchi">
      <div className="container">
        <header className="hero">
          <h1 className="brand">Greenbuddy</h1>
          <p className="sub">Deine virtuelle Monstera – pflege mich gut 🌿</p>
        </header>

        <section className="stage">
          <Plant level={level} xp={xp} mood={mood} size={size} action={action} />
        </section>

        <section className="stats">
          <div className="pill">Stimmung: <b>{mood}</b></div>
          <div className="pill">Level: <b>{level}</b></div>
          <div className="pill">XP: <b>{xp}/{XP_PER_LEVEL}</b></div>
        </section>

        <section className="meters">
          <Meter label="Hydration" value={hydration} />
          <Meter label="Nährstoffe" value={nutrients} />
          <Meter label="Spray" value={spray} />
        </section>

        <section className="actions">
          <button onClick={water}>Gießen</button>
          <button onClick={fertilize}>Düngen</button>
          <button onClick={sprayPests}>Sprühen</button>
          <button onClick={repot}>Umtopfen</button>
        </section>
      </div>

      <style jsx>{`
        .container { max-width: 960px; margin: 0 auto; padding: 16px 18px 60px; }
        .hero { text-align: center; margin: 8px 0 10px; }
        .brand { font-size: 28px; font-weight: 800; letter-spacing: .2px; }
        .sub { opacity: .8; margin-top: -4px; }

        .stage { display: grid; place-items: center; margin: 4px 0 6px; }

        .stats { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin: 6px 0 2px; }
        .pill { background: rgba(0,0,0,.06); padding: 6px 10px; border-radius: 999px; font-size: 14px; }

        .meters { display: grid; grid-template-columns: 1fr; gap: 10px; max-width: 540px; margin: 8px auto 16px; }
        @media(min-width: 560px){ .meters { grid-template-columns: repeat(3, 1fr); } }

        .actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
        .actions button {
          padding: 10px 14px; border-radius: 12px; border: none; font-weight: 700;
          background: #111; color: #fff; cursor: pointer; transition: transform .12s ease, opacity .2s;
        }
        .actions button:hover { transform: translateY(-1px); opacity: .92; }
        .actions button:active { transform: translateY(0); opacity: 1; }
      `}</style>
    </Layout>
  );
}

function Meter({ label, value }) {
  return (
    <div className="meter">
      <div className="top">
        <span>{label}</span>
        <b>{value}/100</b>
      </div>
      <div className="bar"><span style={{ width: `${value}%` }} /></div>

      <style jsx>{`
        .top { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; }
        .bar { height: 9px; background: rgba(0,0,0,.08); border-radius: 999px; overflow: hidden; }
        .bar span { display: block; height: 100%; background: linear-gradient(90deg,#4ade80,#22c55e); }
      `}</style>
    </div>
  );
}
