import { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";

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
