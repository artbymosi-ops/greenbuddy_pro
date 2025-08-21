import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Layout from "@/components/Layout";
import PlantHUD from "@/components/PlantHUD";
import { useEffect, useMemo, useState } from "react";
<a className="btn" href="/minigames" style={{marginTop:12}}>🎮 Minihry (získaj XP & kupóny)</a>
function isNight() { const h=new Date().getHours(); return h>=21 || h<6; }

export default function PlantPage(){
  const [state,setState]=useState(()=>JSON.parse(localStorage.getItem("gb_plant")||`{
    "level":1,"xp":0,"hydration":80,"nutrients":60,"health":100,"alive":true,"pests":false
  }`));
  useEffect(()=>localStorage.setItem("gb_plant", JSON.stringify(state)),[state]);

  // pasívny pokles & náhodní škodcovia
  useEffect(()=>{
    const t = setInterval(()=>{
      setState(s=>{
        if(!s.alive) return s;
        const hydration = Math.max(0, s.hydration-0.15);   // postupne klesá
        const health = Math.max(0, s.health - (hydration<15 ? 0.2 : 0) - (s.nutrients<10?0.05:0));
        const pests = s.pests || (hydration<25 && Math.random()<0.01);
        const alive = health>0;
        return { ...s, hydration, health, pests, alive };
      });
    }, 1000*10); // každých 10s drobná zmena
    return ()=>clearInterval(t);
  },[]);

  function revive(){ setState({level:1,xp:0,hydration:60,nutrients:40,health:100,alive:true,pests:false}); }

  const color = useMemo(()=>{
    if(!state.alive) return "#6b4f3a";               // mŕtva – hnedá
    if(state.hydration<20 || state.health<30) return "#6aa84f"; // bledšia
    if(state.nutrients>90) return "#2dc653";         // tmavšia po prehnojení
    return "#28c76f";
  },[state]);

  return (
    <Layout title="Meine Pflanze">
      <div className="card">
        <h2 style={{marginTop:0}}>GreenBuddy – 3D Monstera</h2>
        <p className="subtitle">
          Stimmung: {state.alive ? (isNight()?"schläft":"glücklich") : "✖ tot"} • Level {state.level} • XP {state.xp}/40
        </p>

        {/* Rastlinka (SVG s očami/ústami + škodcovia) */}
        <div style={{position:"relative", height:220, margin:"12px 0"}}>
          {/* hrniec + tieň */}
          <div style={{position:"absolute",left:"50%",top:"55%",transform:"translate(-50%,-50%) scale(1.1)"}}>
            <svg width="220" height="160" viewBox="0 0 220 160">
              <ellipse cx="110" cy="140" rx="80" ry="18" fill="rgba(0,0,0,.12)"/>
              <path d="M40 60h140l-16 60c-3 11-14 18-26 18H82c-12 0-23-7-26-18L40 60z" fill="#7a4b35"/>
              <ellipse cx="110" cy="60" rx="70" ry="14" fill="#3a2a22"/>
            </svg>
          </div>

          {/* stonka */}
          <div style={{position:"absolute",left:"50%",top:"30%",transform:"translateX(-50%)"}}>
            <div style={{width:12,height:70,background:"#1e9c5c",borderRadius:12}}/>
          </div>

          {/* listy – jednoduchý tvar monstery */}
          <svg style={{position:"absolute",left:"50%",top:"18%",transform:"translateX(-50%)"}} width="240" height="140" viewBox="0 0 240 140">
            <g transform="translate(0,0)">
              <path d="M120 70
                       C 90 10, 20 20, 30 70
                       C 40 110, 95 120, 120 70 Z"
                    fill={color}/>
              <path d="M120 70
                       C 150 10, 220 20, 210 70
                       C 200 110, 145 120, 120 70 Z"
                    fill={color}/>
                         import Leaf from "@/components/Leaf";

// ... v SVG:
<Leaf level={state.level || 1} side="left"  fill={color}/>
<Leaf level={state.level || 1} side="right" fill={color}/>
              {/* zárezy monstery */}
              <path d="M70 60 l15 10 M85 45 l18 14 M155 45 l-18 14 M170 60 l-15 10"
                    stroke="#2b8d5e" strokeWidth="6" strokeLinecap="round"/>
            </g>
            {/* tvár */}
            <g style={{opacity:isNight()?0.5:1}}>
              {/* oči */}
              <circle cx="100" cy="68" r="5" fill="#163b2c"/>
              <circle cx="140" cy="68" r="5" fill="#163b2c"/>
              {/* ústa (mení sa podľa nálady) */}
              <path d={state.alive ? "M108 84 q12 10 24 0" : "M108 90 q12 -8 24 0"} stroke="#163b2c" strokeWidth="4" fill="none" strokeLinecap="round"/>
            </g>
          </svg>

          {/* škodca – lienka/muška po ploche */}
          {state.pests && (
            <div style={{
              position:"absolute", left:0, top:0, width:"100%", height:"100%",
              backgroundImage:"radial-gradient(circle at 10px 10px, transparent 8px, transparent 9px)",
              animation:"bug 6s linear infinite"
            }}>
              <span role="img" aria-label="bug" style={{position:"absolute",fontSize:22, top:10, left:10}}>🐞</span>
            </div>
          )}
        </div>

        {!state.alive && <button className="btn" onClick={revive}>Začať odznova</button>}

        <div style={{marginTop:12}}>
          <PlantHUD state={state} setState={setState} />
        </div>
      </div>
    </Layout>
  );
}
// ⬇️ bezpečný dynamic import + fallback na default export
const Plant3D = dynamic(
  () =>
    import("@/components/Plant3D").then((m) => m.default ?? m.Plant3D ?? m),
  { ssr: false }
);

export default function PlantPage() {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [st.xp, st.hydration, st.nutrients, st.spray]);

  const addXp = (n) => setSt((s) => ({ ...s, xp: s.xp + n }));
  const water = () => { setSt(s => ({ ...s, hydration: Math.min(100, s.hydration + 18) })); addXp(6); setLastAction("water"); };
  const feed  = () => { setSt(s => ({ ...s, nutrients: Math.min(100, s.nutrients + 14) })); addXp(6); setLastAction("feed");  };
  const spray = () => { setSt(s => ({ ...s, spray: Math.min(100, s.spray + 12) }));      addXp(6); setLastAction("spray"); };
  const repot = () => {
    setSt(s => ({ ...s, nutrients: Math.min(100, s.nutrients + 10), hydration: Math.max(60, s.hydration - 8) }));
    addXp(10); setLastAction("repot");
  };

  return (
    <Layout>
      <main style={{ padding: 16, maxWidth: 960, margin: "0 auto" }}>
        <section className="card" style={{ marginBottom: 16 }}>
          <h2 style={{ marginTop: 0 }}>GreenBuddy – 3D Monstera</h2>
          <p className="subtitle">
            Stimmung: {st.mood === "happy" ? "glücklich" : "traurig"} • Level {st.level} • XP {st.xp}/{st.level * 40}
          </p>

          <Plant3D state={st} lastAction={lastAction} />

          <div className="grid grid-3" style={{ marginTop: 12 }}>
            <div className="card"><strong>Hydration</strong><div>{st.hydration}</div></div>
            <div className="card"><strong>Nährstoffe</strong><div>{st.nutrients}</div></div>
            <div className="card"><strong>Spray</strong><div>{st.spray}</div></div>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
            <button className="btn" onClick={water}>Gießen</button>
            <button className="btn" onClick={feed}>Düngen</button>
            <button className="btn" onClick={spray}>Sprühen</button>
            <button className="btn ghost" onClick={repot}>Umtopfen</button>
            <button className="btn" onClick={() => { setSt(s => ({ ...s, hydration: 12 })); setLastAction("alert"); }}>
              Problem simulieren
            </button>
          </div>
        </section>
      </main>
    </Layout>
  );
            }
// noc: 22:00–06:00 (lokálny čas)
const isNight = () => {
  const h = new Date().getHours();
  return h >= 22 || h < 6;
};
const [night, setNight] = useState(isNight());
useEffect(() => {
  const t = setInterval(() => setNight(isNight()), 60_000);
  return () => clearInterval(t);
}, []);
<div style={{position:"relative"}}>
  {/* SVG rastlina */}
  <div className={night ? "asleep" : ""}>
    {/* ...TU ostáva tvoj existujúci SVG výstup... */}
  </div>

  {/* Zzz bubliny */}
  <div className={`zzz ${night ? "on":""}`}>Z z</div>

  {/* nočný overlay so „hviezdami“ */}
  <div className={`night-overlay ${night ? "on":""}`}>
    <div className="stars">
      {/* pár hviezd – náhodné rozmiestnenie */}
      <i style={{left:"12%", top:"14%", animationDelay:"0s"}}/>
      <i style={{left:"28%", top:"26%", animationDelay:".7s"}}/>
      <i style={{left:"44%", top:"10%", animationDelay:"1.1s"}}/>
      <i style={{left:"66%", top:"22%", animationDelay:".2s"}}/>
      <i style={{left:"78%", top:"8%",  animationDelay:"1.5s"}}/>
      <i style={{left:"18%", top:"40%", animationDelay:".9s"}}/>
      <i style={{left:"86%", top:"36%", animationDelay:".3s"}}/>
    </div>
  </div>
</div>
import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import Layout from "@/components/Layout";
import Pests from "@/components/Pests";              // +++

const Plant3D = dynamic(() => import("@/components/Plant3D"), { ssr: false });

export default function PlantPage() {
  const [st, setSt] = useState({ hydration:100, nutrients:60, spray:90, xp:0, level:1, mood:"happy", size:0 });
  const [lastAction, setLastAction] = useState(null);

  // cooldown „spray“ -> keď sa zmení, vyčistí škodcov
  const [sprayFlag, setSprayFlag] = useState(0);

  // „nebezpečnosť“ – podľa nízkej vlhkosti, preliatia, nízkych živín…
  const danger = Math.max(
    0,
    (st.spray<40 ? 30 : 0) +
    (st.hydration<25 ? 25 : 0) +
    (st.nutrients<30 ? 20 : 0)
  );

  // akcie
  const addXp = n => setSt(s=>({...s, xp:s.xp+n}));

  const water = ()=>{ setSt(s=>({...s, hydration:Math.min(100,s.hydration+18)})); addXp(6); setLastAction("water"); };
  const feed  = ()=>{ setSt(s=>({...s, nutrients:Math.min(100,s.nutrients+14)})); addXp(6); setLastAction("feed"); };
  const spray = ()=>{ setSt(s=>({...s, spray:Math.min(100,s.spray+12)})); addXp(6); setLastAction("spray"); setSprayFlag(f=>f+1); };
  const repot = ()=>{ setSt(s=>({...s, nutrients:Math.min(100,s.nutrients+10), hydration:Math.max(60,s.hydration-8)})); addXp(10); setLastAction("repot"); };

  // …(ostatný tvoj existujúci kód tu zostáva)

  return (
    <Layout>
      <main style={{ padding: 16, maxWidth: 960, margin: "0 auto" }}>
        <section className="card" style={{ marginBottom: 16, position:"relative" }}>
          <h2 style={{ marginTop: 0 }}>GreenBuddy – 3D Monstera</h2>
          <p className="subtitle">Stimmung: {st.mood==='happy'?'glücklich':'traurig'} • Level {st.level} • XP {st.xp}/{st.level*40}</p>

          {/* RASTLINA */}
          <div style={{position:"relative"}}>
            <Plant3D state={st} lastAction={lastAction} />
            {/* ŠKODCOVIA NAD RASTLINOU */}
            <Pests danger={danger} sprayFlag={sprayFlag} onAnyRemoved={()=>addXp(1)} />
          </div>

          {/* TLAČIDLÁ… (nechávam tvoje) */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
            <button className="btn" onClick={water}>💧 Gießen</button>
            <button className="btn" onClick={feed}>🧪 Düngen</button>
            <button className="btn" onClick={spray}>🌫️ Sprühen</button>
            <button className="btn ghost" onClick={repot}>🪴 Umtopfen</button>
            <a className="btn" href="/minigames">🎮 Mini-hry</a>
          </div>
        </section>
      </main>
    </Layout>
  );
}
