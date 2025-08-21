import { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import { awardCoupon } from "@/lib/coupons";


export default function MiniGames(){
  const [running,setRunning]=useState(false);
  const [time,setTime]=useState(30);
  const [score,setScore]=useState(0);
  const boxRef = useRef(null);
  const [leaves,setLeaves]=useState([]);

  useEffect(()=>{
    if(!running) return;
    setScore(0); setLeaves([]);
    const t1 = setInterval(()=>setTime(t=>t-1),1000);
    const t2 = setInterval(()=>{
      setLeaves(prev=>[...prev, { id:crypto.randomUUID(), x: Math.random()*90+5, y: -10 }]);
    }, 600);

    const fall = setInterval(()=>{
      setLeaves(prev=>prev.map(l=>({...l,y:l.y+4})).filter(l=>l.y<110));
    }, 120);

    return ()=>{
      clearInterval(t1); clearInterval(t2); clearInterval(fall);
    };
  },[running]);

  useEffect(()=>{ if(time<=0 && running){ setRunning(false); } },[time,running]);

  function clickLeaf(id){
    setLeaves(prev=>prev.filter(l=>l.id!==id));
    setScore(s=>s+1);
  }

  function start(){ setTime(30); setScore(0); setRunning(true); }

  const wonCoupon = !running && score>=20;
  const xp = !running ? Math.min(30, score) : 0;

  useEffect(()=>{
    if(!running && (wonCoupon || xp>0)){
      const bag = JSON.parse(localStorage.getItem("gb_rewards")||"{}");
      if(wonCoupon && !bag.coupon10){
        bag.coupon10 = `GB10-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
      }
      bag.xp = (bag.xp||0) + xp;
      localStorage.setItem("gb_rewards", JSON.stringify(bag));
    }
  },[running]);

  return (
    <Layout title="Minihry">
      <div className="card">
        <h2 style={{marginTop:0}}>🍃 Padajúce listy</h2>
        <p className="subtitle">Klikaj na listy. 30 sekúnd. 20+ zásahov = <b>kupón -10% nad 25€</b>, inak XP = počet zásahov.</p>

        <div ref={boxRef} style={{position:"relative",height:360,overflow:"hidden",borderRadius:12,background:"linear-gradient(#eaf7ed,#f4fbf5)"}}>
          {leaves.map(l=>(
            <button key={l.id} onClick={()=>clickLeaf(l)} style={{
              position:"absolute", left:`${l.x}%`, top:`${l.y}%`, transform:"translate(-50%,-50%)",
              background:"transparent", border:"none", cursor:"pointer"
            }} aria-label="leaf">
              <span style={{fontSize:28}}>🍂</span>
            </button>
          ))}
          {!running && <div style={{position:"absolute",inset:0,display:"grid",placeItems:"center"}}>
            <button className="btn" onClick={start}>Štart</button>
          </div>}
        </div>

        <div style={{display:"flex",gap:12,marginTop:12}}>
          <div className="badge">⏱️ {time}s</div>
          <div className="badge">⭐ {score}</div>
        </div>

        {!running && (
          <div className="card" style={{marginTop:12}}>
            {wonCoupon
              ? <p>Gratulujem! Tvoj kupón: <b>{JSON.parse(localStorage.getItem("gb_rewards")).coupon10}</b></p>
              : <p>Získal/a si XP: <b>{xp}</b> (pripočítame k rastline).</p>}
            <p className="subtitle">Na najvyššom leveli dáme aj <b>-20% nad 70€</b>.</p>
          </div>
        )}
      </div>
    </Layout>
  );
                                 }

export default function MiniGamesPage(){
  const [tab, setTab] = useState("leaves"); // leaves | ladybug
  return (
    <Layout title="Mini-hry">
      <div className="card">
        <div className="mg-toolbar">
          <div>
            <h2 className="title" style={{margin:0}}>Mini-hry</h2>
            <p className="subtitle" style={{margin:"4px 0 0"}}>
              Získaj XP pre rastlinku – a pri skvelom výkone aj zľavový kupón 🎁
            </p>
          </div>
          <div style={{display:"flex", gap:8}}>
            <button className={"btn"+(tab==="leaves"?"":" ghost")} onClick={()=>setTab("leaves")}>🍃 Falling Leaves</button>
            <button className={"btn"+(tab==="ladybug"?"":" ghost")} onClick={()=>setTab("ladybug")}>🐞 Ladybug Chase</button>
          </div>
        </div>
      </div>

      {tab==="leaves" ? <GameLeaves/> : <GameLadybug/>}
    </Layout>
  );
}

/* -------------------- GAME 1: FALLING LEAVES -------------------- */
function GameLeaves(){
  const DURATION = 30;            // sekúnd
  const TARGET = 25;              // koľko listov „popnúť“ na kupón
  const [time, setTime] = useState(DURATION);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [leaves, setLeaves] = useState([]); // {id,x,start}
  const idc = useRef(1);
  const [coupon, setCoupon] = useState(null);

  useEffect(()=>{
    if(!running) return;
    const t = setInterval(()=>setTime(s=>Math.max(0, s-1)), 1000);
    const s = setInterval(spawn, 450);
    return ()=>{ clearInterval(t); clearInterval(s); };
  },[running]);

  useEffect(()=>{
    if(time===0 && running){
      setRunning(false);
      if(score>=TARGET){
        const c = awardCoupon({ tier:"10OFF25", percent:10, min:25 });
        setCoupon(c);
      }
    }
  },[time, running, score]);

  function spawn(){
    setLeaves(l => [...l, { id:idc.current++, x: Math.random()*92+4, start: Date.now() }]);
    // udržuj rozumný počet
    setLeaves(l => l.slice(-60));
  }
  function hit(id){
    setLeaves(l=>l.filter(a=>a.id!==id));
    setScore(s=>s+1);
  }
  function start(){ setScore(0); setTime(DURATION); setCoupon(null); setRunning(true); setLeaves([]); }

  return (
    <div className="card mg-wrap">
      <div className="mg-toolbar">
        <div className="badge">🎯 Cieľ: {TARGET}</div>
        <div className="badge timer">⏱ {time}s</div>
        <div className="badge">⭐ Skóre: {score}</div>
        <div style={{marginLeft:"auto"}}>
          <button className="btn" onClick={start} disabled={running}>{running?"Beží…":"Štart"}</button>
        </div>
      </div>
      <div className="board">
        {leaves.map(l=>(
          <LeafFaller key={l.id} x={l.x} onHit={()=>hit(l.id)} />
        ))}
      </div>

      {coupon && (
        <div className="modal">
          <div className="box">
            <h3>🎉 Skvelý výkon!</h3>
            <p>Získavaš kupón <b>{coupon.code}</b> – <b>{coupon.percent}%</b> zľava pri objednávke nad <b>{coupon.min}€</b>.</p>
            <button className="btn" onClick={()=>setCoupon(null)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
function LeafFaller({ x, onHit }){
  const [y, setY] = useState(-20);
  const [pop, setPop] = useState(false);
  useEffect(()=>{
    const t = setInterval(()=>setY(v=>v+2.2), 30);
    return ()=>clearInterval(t);
  },[]);
  if(y>420) return null;
  return (
    <div
      className={"leaf"+(pop?" pop":"")}
      style={{ left:`${x}%`, top:y }}
      onClick={()=>{ setPop(true); setTimeout(onHit, 180); }}
      title="Klikni!"
    >
      🍂
    </div>
  );
}

/* -------------------- GAME 2: LADYBUG CHASE -------------------- */
function GameLadybug(){
  const DURATION = 25;
  const TARGET = 12;
  const [time, setTime] = useState(DURATION);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [bug, setBug] = useState({ x:50, y:50 });
  const [coupon, setCoupon] = useState(null);

  useEffect(()=>{
    if(!running) return;
    const t = setInterval(()=>setTime(s=>Math.max(0, s-1)), 1000);
    const m = setInterval(()=>move(), 750);
    return ()=>{ clearInterval(t); clearInterval(m); };
  },[running]);

  useEffect(()=>{
    if(time===0 && running){
      setRunning(false);
      if(score>=TARGET){
        const c = awardCoupon({ tier:"10OFF25", percent:10, min:25 });
        setCoupon(c);
      }
    }
  },[time, running, score]);

  function move(){
    setBug({ x: Math.random()*92+4, y: Math.random()*82+8 });
  }
  function hit(){
    setScore(s=>s+1);
    move();
  }
  function start(){ setScore(0); setTime(DURATION); setCoupon(null); setRunning(true); move(); }

  return (
    <div className="card mg-wrap">
      <div className="mg-toolbar">
        <div className="badge">🎯 Cieľ: {TARGET}</div>
        <div className="badge timer">⏱ {time}s</div>
        <div className="badge">⭐ Skóre: {score}</div>
        <div style={{marginLeft:"auto"}}>
          <button className="btn" onClick={start} disabled={running}>{running?"Beží…":"Štart"}</button>
        </div>
      </div>
      <div className="board">
        {running && (
          <div
            className="ladybug"
            style={{ left:`${bug.x}%`, top:`${bug.y}%` }}
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
            <p>Vyhrávaš kupón <b>{coupon.code}</b> – <b>{coupon.percent}%</b> zľava pri objednávke nad <b>{coupon.min}€</b>.</p>
            <button className="btn" onClick={()=>setCoupon(null)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
