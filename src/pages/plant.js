import { useEffect, useMemo, useRef, useState } from 'react';
import Layout from '@/components/Layout';
import Plant from '@/components/Plant';

const clamp = (v,min=0,max=100)=>Math.max(min,Math.min(max,v));

export default function PlantPage(){
  const [hydr,setHydr]=useState(100);
  const [nutr,setNutr]=useState(60);
  const [spray,setSpray]=useState(90);
  const [xp,setXP]=useState(0);
  const [level,setLevel]=useState(1);
  const [mood,setMood]=useState('happy'); // happy | neutral | sad
  const fxRef=useRef(null);

  // Načítanie/uloženie lokálne (stačí bez DB)
  useEffect(()=>{
    const s = JSON.parse(localStorage.getItem('gbuddy-state')||'{}');
    if(s.hydr!=null){ setHydr(s.hydr); setNutr(s.nutr||60); setSpray(s.spray||90); setXP(s.xp||0); setLevel(s.level||1); }
  },[]);
  useEffect(()=>{
    localStorage.setItem('gbuddy-state', JSON.stringify({hydr,nutr,spray,xp,level}));
  },[hydr,nutr,spray,xp,level]);

  // Jednoduchá „metabolika“
  useEffect(()=>{
    const t = setInterval(()=>{
      setHydr(h=>clamp(h-1));
      setSpray(s=>clamp(s-1));
      setMood(curr=>{
        const avg=(hydr+nutr+spray)/3;
        if(avg>70) return 'happy';
        if(avg>40) return 'neutral';
        return 'sad';
      });
    }, 4000);
    return ()=>clearInterval(t);
  },[hydr,nutr,spray]);

  // Levelovanie
  useEffect(()=>{
    if(xp>=40){ setLevel(l=>l+1); setXP(0);
      // jemná „radosť“ animácia
      const el = document.querySelector('.plant'); el?.classList.add('levelup'); setTimeout(()=>el?.classList.remove('levelup'),600);
    }
  },[xp]);

  // FX helper
  const fx = (type)=>{
    if(!fxRef.current) return;
    const box = fxRef.current.getBoundingClientRect();
    if(type==='water'){
      for(let i=0;i<10;i++){
        const d=document.createElement('div');
        d.className='drop waterFX';
        d.style.left=(Math.random()*box.width-60)+'px';
        d.style.top=(-20 + Math.random()*10)+'px';
        d.classList.add('drop');
        fxRef.current.appendChild(d);
        setTimeout(()=>d.remove(),620);
      }
    } else if(type==='spray'){
      const m=document.createElement('div');
      m.className='sprayFX';
      const b=document.createElement('div');
      b.className='mist';
      m.appendChild(b);
      fxRef.current.appendChild(m);
      setTimeout(()=>m.remove(),720);
    }
  };

  const handleWater=()=>{ setHydr(h=>clamp(h+18)); setXP(x=>x+6); fx('water'); };
  const handleFertilize=()=>{ setNutr(n=>clamp(n+16)); setXP(x=>x+8); };
  const handleSpray=()=>{ setSpray(s=>clamp(s+20)); setXP(x=>x+5); fx('spray'); };
  const handleRepot=()=>{ setXP(x=>x+15); setNutr(n=>clamp(n+10)); };

  const moodLabel = {happy:'happy',neutral:'okay',sad:'traurig'}[mood];
  const levelLabel = useMemo(()=>`Level ${level}`,[level]);

  return (
    <Layout title="Mein Greenbuddy">
      <div className="card">
        <div className="plant-stage" ref={fxRef} style={{position:'relative'}}>
          <Plant mood={mood} level={level}/>
        </div>

        <div className="stat-wrap">
          <div className="stat"><div>Hydration</div><b>{hydr}/100</b></div>
          <div className="stat"><div>Nährstoffe</div><b>{nutr}/100</b></div>
          <div className="stat"><div>Spray</div><b>{spray}/100</b></div>
          <div className="stat"><div>XP</div><b>{xp}/40</b></div>
        </div>
        <div style={{marginTop:8,color:'var(--muted)'}}>Stimmung: <b style={{color:'var(--brand)'}}>{moodLabel}</b> • {levelLabel}</div>

        <div className="controls">
          <button className="ctrl" onClick={handleWater}>Gießen</button>
          <button className="ctrl" onClick={handleFertilize}>Düngen</button>
          <button className="ctrl" onClick={handleSpray}>Sprühen</button>
          <button className="ctrl" onClick={handleRepot}>Umtopfen</button>
        </div>
      </div>

      <div className="grid cols-2" style={{marginTop:16}}>
        <div className="card">
          <h3 className="title">Chat mit Greenbuddy</h3>
          <p className="subtitle">Der Assistent kommt im nächsten Schritt (verbindet sich mit deiner API und Supabase). 😊</p>
        </div>
        <div className="card">
          <h3 className="title">Tipps</h3>
          <p className="subtitle">Halte Hydration & Spray über 60 und dein Buddy bleibt glücklich – XP gibt’s für jede Aktion.</p>
        </div>
      </div>
    </Layout>
  );
}
