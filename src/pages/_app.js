import '@/styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}  import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import Plant from '@/components/Plant';

export default function AppPage(){
  const [st, setSt] = useState({
    hydration:100, nutrients:60, spray:90, xp:0, level:1, mood:'happy', size:0
  });
  const [pulse, setPulse] = useState(false);

  // level up -> rast
  useEffect(()=>{
    const need = st.level*40;
    if(st.xp >= need){
      setSt(s=>({ ...s, xp: s.xp-need, level:s.level+1, size:Math.min((s.size??0)+1, 5)}));
      flash();
    }
    // nálada
    const mood = (st.hydration<30 || st.nutrients<30 || st.spray<30) ? 'sad' : 'happy';
    if(mood!==st.mood) setSt(s=>({ ...s, mood }));
  },[st.xp, st.hydration, st.nutrients, st.spray]);

  function flash(){ setPulse(true); setTimeout(()=>setPulse(false), 350); }

  const addXp = (n)=> setSt(s=>({ ...s, xp:s.xp+n }));

  const water = ()=>{ setSt(s=>({ ...s, hydration:Math.min(100,s.hydration+18)})); addXp(6); flash(); }
  const feed  = ()=>{ setSt(s=>({ ...s, nutrients:Math.min(100,s.nutrients+14)})); addXp(6); flash(); }
  const spray = ()=>{ setSt(s=>({ ...s, spray:Math.min(100,s.spray+12)})); addXp(6); flash(); }
  const repot = ()=>{ setSt(s=>({ ...s, nutrients:Math.min(100,s.nutrients+10), hydration:Math.max(60,s.hydration-8)})); addXp(10); flash(); }
  const tick  = ()=>{ // simulácia času – mierny pokles
    setSt(s=>({ ...s,
      hydration:Math.max(0,s.hydration-3),
      nutrients:Math.max(0,s.nutrients-2),
      spray:Math.max(0,s.spray-2)
    }));
  };

  useEffect(()=>{
    const t = setInterval(()=>tick(), 8000);
    return ()=>clearInterval(t);
  },[]);

  return (
    <Layout>
      <div className="grid" style={{gap:24}}>
        <section className="card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div className="badge">Stimmung: {st.mood==='happy'?'glücklich':'traurig'}</div>
              <h2 className="title" style={{fontSize:28, marginTop:6}}>Level {st.level} • <span className="subtitle">XP {st.xp}/{st.level*40}</span></h2>
            </div>
          </div>
          <Plant state={st} onPulse={pulse} />
          <div className="grid grid-3" style={{marginTop:12}}>
            <div className="stat"><h3>Hydration</h3><div className="v">{st.hydration}</div></div>
            <div className="stat"><h3>Nährstoffe</h3><div className="v">{st.nutrients}</div></div>
            <div className="stat"><h3>Spray</h3><div className="v">{st.spray}</div></div>
          </div>
          <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:16}}>
            <button className="btn" onClick={water}>Gießen</button>
            <button className="btn" onClick={feed}>Düngen</button>
            <button className="btn" onClick={spray}>Sprühen</button>
            <button className="btn ghost" onClick={repot}>Umtopfen</button>
            <button className="btn danger" onClick={()=>setSt(s=>({...s, hydration:12}))}>Problem simulieren</button>
          </div>
        </section>

        <section className="card">
          <h3 style={{marginTop:0}}>Chat mit Greenbuddy</h3>
          <p className="subtitle">Frag mich alles zur Pflege – ich antworte auf Deutsch.</p>
          {/* sem už máš svoj chat komponent, zostal nezmenený – tlačidlo/textarea */}
          {/* ak chceš, viem ti ho upraviť na bubliny a TTS/hlas */}
        </section>
      </div>
    </Layout>
  );
}
