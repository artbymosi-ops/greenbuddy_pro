import { useEffect, useMemo, useRef, useState } from "react";

export default function PlantPremiumV2() {
  const [st, setSt] = useState({
    hydration: 90,
    nutrients: 65,
    spray: 86,
    xp: 0,
    level: 1,
    mood: "happy", // happy | neutral | sad | excited | sleepy
    size: 1.0,
  });

  const [pulse, setPulse] = useState(false);
  const [fx, setFx] = useState(null); // "water"|"spray"|"feed"|"repot"|"level"
  const [soundOn, setSoundOn] = useState(true);
  const [voiceOn, setVoiceOn] = useState(true);

  const lastTick = useRef(Date.now());
  const audio = useRef({});

  // preload zvukov
  useEffect(() => {
    const names = ["water","spray","feed","repot","levelup","pop"];
    names.forEach(n => { audio.current[n] = new Audio(`/sounds/${n}.mp3`); audio.current[n].volume = 0.7; });
  }, []);

  // nálada podľa hodnôt
  useEffect(() => {
    let mood = "happy";
    const low = [st.hydration, st.nutrients, st.spray].some(v => v < 30);
    const superHigh = [st.hydration, st.nutrients, st.spray].every(v => v > 85);
    if (low) mood = "sad";
    else if (superHigh) mood = "excited";
    else if (st.hydration < 45 || st.spray < 45) mood = "neutral";
    if (mood !== st.mood) setSt(s => ({ ...s, mood }));
  }, [st.hydration, st.nutrients, st.spray]); // eslint-disable-line

  // level-up a rast
  useEffect(() => {
    const need = st.level * 40;
    if (st.xp >= need) {
      setSt(s => ({
        ...s,
        xp: s.xp - need,
        level: s.level + 1,
        size: Math.min((s.size ?? 1) + 0.1, 1.7),
        mood: "excited",
      }));
      beam("level");
      say(["Woohoo, ďakujem!","Juhu, nové listy!","Level up!"].at(Math.floor(Math.random()*3)));
    }
  }, [st.xp]); // eslint-disable-line

  // plynulé tikanie
  useEffect(() => {
    const t = setInterval(() => {
      const now = Date.now();
      if (now - lastTick.current < 7000) return; // každých ~7s
      lastTick.current = now;
      setSt(s => ({
        ...s,
        hydration: Math.max(0, s.hydration - 2),
        nutrients: Math.max(0, s.nutrients - 1),
        spray: Math.max(0, s.spray - 1),
        mood: s.hydration < 30 || s.spray < 30 ? "sad" : s.mood
      }));
    }, 2500);
    return () => clearInterval(t);
  }, []);

  function flash(){ setPulse(true); setTimeout(()=>setPulse(false), 350); }
  function beam(type){
    setFx(type);
    if (soundOn) {
      const map = { water:"water", spray:"spray", feed:"feed", repot:"repot", level:"levelup" };
      const k = map[type];
      if (audio.current[k]) audio.current[k].currentTime = 0, audio.current[k].play();
    }
    setTimeout(()=>setFx(null), 650);
    flash();
  }
  function say(text){
    if (!voiceOn || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    // vyber jemný hlas (ak je DE/EN/SK dostupný)
    const v = window.speechSynthesis.getVoices().find(v=>/de-|de_/i.test(v.lang)) ||
              window.speechSynthesis.getVoices().find(v=>/en-|en_/i.test(v.lang)) ||
              window.speechSynthesis.getVoices()[0];
    if (v) u.voice = v;
    u.rate = 1.03; u.pitch = 1.05; u.volume = 0.9;
    window.speechSynthesis.cancel(); // nech neprechádza backlog
    window.speechSynthesis.speak(u);
  }

  // akcie
  const water = () => {
    setSt(s => ({ ...s, hydration: Math.min(100, s.hydration + 16), xp: s.xp + 6 }));
    beam("water");
    say("Mňam, voda!");
  };
  const feed = () => {
    setSt(s => ({ ...s, nutrients: Math.min(100, s.nutrients + 14), xp: s.xp + 6 }));
    beam("feed");
    say("Hnojivo dodané.");
  };
  const spray = () => {
    setSt(s => ({ ...s, spray: Math.min(100, s.spray + 12), xp: s.xp + 6 }));
    beam("spray");
    say("Osviežujúca hmla!");
  };
  const repot = () => {
    setSt(s => ({
      ...s,
      nutrients: Math.min(100, s.nutrients + 12),
      hydration: Math.max(50, s.hydration - 8),
      xp: s.xp + 10
    }));
    beam("repot");
    say("Nový domov, juchú!");
  };

  const bar = v => `linear-gradient(90deg, var(--g) ${v}%, rgba(255,255,255,.06) ${v}%)`;

  return (
    <div className="wrap">
      <header className="topbar">
        <div className="brand">
          <span className="dot"/><span>Greenbuddy</span>
        </div>
        <div className="toggles">
          <button className={"mini"+(soundOn?" on":"")} onClick={()=>setSoundOn(s=>!s)} title="Sound">🔊</button>
          <button className={"mini"+(voiceOn?" on":"")} onClick={()=>setVoiceOn(v=>!v)} title="Voice">🗣️</button>
        </div>
      </header>

      <section className={`card ${pulse ? "pulse" : ""}`}>
        <div className="plantStage">
          <MonsteraSVG level={st.level} size={st.size} mood={st.mood} fx={fx}/>
        </div>

        <div className="statsRow">
          <div className="chip">Stimmung: <strong>{st.mood}</strong></div>
          <div className="chip">Level: <strong>{st.level}</strong></div>
          <div className="chip">XP: <strong>{st.xp}/{st.level*40}</strong></div>
        </div>

        <div className="meters">
          <label>Hydration <span>{st.hydration}/100</span></label>
          <div className="meter"><div className="fill" style={{width:`${st.hydration}%`,background:bar(st.hydration)}}/></div>

          <label>Nährstoffe <span>{st.nutrients}/100</span></label>
          <div className="meter"><div className="fill" style={{width:`${st.nutrients}%`,background:bar(st.nutrients)}}/></div>

          <label>Spray <span>{st.spray}/100</span></label>
          <div className="meter"><div className="fill" style={{width:`${st.spray}%`,background:bar(st.spray)}}/></div>
        </div>

        <div className="btnRow">
          <button className="btn" onClick={water}>Gießen</button>
          <button className="btn" onClick={feed}>Düngen</button>
          <button className="btn" onClick={spray}>Sprühen</button>
          <button className="btn ghost" onClick={repot}>Umtopfen</button>
        </div>
      </section>

      <style jsx>{`
        :root{
          --bg:#0e1216; --card:#11171c; --text:#eaf3ef; --sub:#b7c7bf;
          --g:#3ee089; --brand1:#a7f3d0; --brand2:#60a5fa;
        }
        .wrap{min-height:100vh;background:radial-gradient(1200px 600px at 80% -100px,#16303400,#16303466),var(--bg);padding:24px 16px 56px;color:var(--text)}
        .topbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}
        .brand{display:flex;align-items:center;gap:10px;font-weight:800;font-size:22px}
        .dot{width:26px;height:26px;border-radius:8px;background:linear-gradient(135deg,var(--brand1),var(--brand2));box-shadow:0 0 20px #60a5fa33 inset}
        .toggles{display:flex;gap:10px}
        .mini{background:#0b1016;border:1px solid #203040;border-radius:10px;padding:6px 10px;color:#9fb4a6}
        .mini.on{box-shadow:0 0 0 1px #38bdf8 inset;color:#e5f3ff}
        .card{max-width:820px;margin:0 auto;background:var(--card);border:1px solid #1e293b;border-radius:22px;padding:22px;box-shadow:0 20px 60px #0009,inset 0 1px 0 #fff1}
        .pulse{animation:pulse .35s ease}
        .plantStage{display:flex;justify-content:center;align-items:center;padding:8px 0 14px}
        .statsRow{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin:6px 0 10px}
        .chip{background:#0b1016;border:1px solid #1f2937;border-radius:999px;padding:6px 12px;font-size:14px;color:var(--sub)}
        .meters{margin-top:8px}
        label{display:flex;justify-content:space-between;color:var(--sub);font-size:14px;margin:10px 0 6px}
        .meter{height:10px;background:#0c1116;border:1px solid #1b2633;border-radius:999px;overflow:hidden}
        .fill{height:100%;transition:width .3s ease,background .3s ease;background:var(--g)}
        .btnRow{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-top:18px}
        .btn{padding:10px 16px;border:none;border-radius:12px;cursor:pointer;font-weight:700;color:#08131a;background:linear-gradient(180deg,#49e5a1,#12b981);box-shadow:0 8px 24px #10b98155,inset 0 1px 0 #fff8}
        .btn:hover{transform:translateY(-1px) scale(1.01)}
        .ghost{background:linear-gradient(180deg,#93c5fd,#38bdf8);box-shadow:0 8px 24px #38bdf855,inset 0 1px 0 #fff8}
        @keyframes pulse{from{transform:scale(.998)}to{transform:scale(1)}}
        @keyframes leaf {0%{transform:rotate(0)}50%{transform:rotate(1.4deg)}100%{transform:rotate(0)}}
        @keyframes rain{0%{transform:translateY(-12px);opacity:0}10%{opacity:1}100%{transform:translateY(36px);opacity:0}}
        @keyframes mist{0%{transform:translateX(0) scale(1);opacity:.0}15%{opacity:.5}100%{transform:translateX(40px) scale(1.15);opacity:0}}
        @keyframes sparkle{0%{transform:scale(.5);opacity:0}30%{opacity:1}100%{transform:scale(1.4);opacity:0}}
        @keyframes wobble{0%{transform:rotate(0)}25%{transform:rotate(-1.3deg)}50%{transform:rotate(1.3deg)}100%{transform:rotate(0)}}
      `}</style>
    </div>
  );
}

/** SVG Monstera s fenestráciou (okienka rastú s levelom) + emócie + krajší kvetináč */
function MonsteraSVG({ level, size, mood, fx }) {
  const scale = Math.min(1.7, 1 + (level-1)*0.08) * size;
  const leafColor = mood==="sad" ? "#78b78a" : "#35cb7b";
  const vein = mood==="sad" ? "#2a8a56" : "#1c8b57";
  const stem = mood==="sad" ? "#509761" : "#2bb36a";

  // koľko dierok (fenestrácii)
  const holes = Math.min(8, Math.floor(level*1.5));

  // očká + ústa podľa emócie
  const EyesMouth = () => {
    const baseY = 182, x1 = 160, x2 = 200;
    const eye = (cx) => {
      let ry = 5, rx = 5, rot=0;
      if (mood==="excited") { ry=5; rx=5; }
      else if (mood==="sleepy") { ry=2.2; rx=8; }
      else if (mood==="sad") { ry=5; rx=5; }
      return <ellipse cx={cx} cy={baseY} rx={rx} ry={ry} fill="#121518" transform={`rotate(${rot} ${cx} ${baseY})`} />;
    };
    const mouth = ()=>{
      if (mood==="sad") return <path d="M165 202q15 -10 30 0" stroke="#121518" strokeWidth="5" fill="none" strokeLinecap="round"/>;
      if (mood==="excited") return <path d="M162 196q18 18 36 0" stroke="#121518" strokeWidth="5" fill="none" strokeLinecap="round"/>;
      if (mood==="sleepy") return <path d="M165 198q15 0 30 0" stroke="#121518" strokeWidth="5" fill="none" strokeLinecap="round"/>;
      return <path d="M165 198q18 10 36 0" stroke="#121518" strokeWidth="5" fill="none" strokeLinecap="round"/>;
    };
    return (<g>{eye(x1)}{eye(x2)}{mouth()}</g>);
  };

  // maska na fenestrácie
  const LeafWithFenestration = ({ cx, cy, r }) => {
    const id = `m${cx}${cy}${r}`;
    const holesArr = Array.from({length: holes});
    return (
      <>
        <defs>
          <mask id={id}>
            <circle cx={cx} cy={cy} r={r} fill="white"/>
            {holesArr.map((_,i)=>(
              <ellipse key={i}
                cx={cx + (i%2===0? r*0.25 : -r*0.2) + i*2}
                cy={cy + (i*8 - r*0.2)}
                rx={Math.max(3, r*0.06 + i*0.6)}
                ry={Math.max(2, r*0.03 + i*0.4)}
                fill="black"
                transform={`rotate(${i%2?12:-8} ${cx} ${cy})`}
              />
            ))}
          </mask>
        </defs>
        <g mask={`url(#${id})`} style={{animation:"leaf 4s ease-in-out infinite", transformOrigin:`${cx}px ${cy+r}px`}}>
          <circle cx={cx} cy={cy} r={r} fill={leafColor}/>
          <path d={`M${cx} ${cy} c0 ${r*0.5} -${r*0.35} ${r*0.6} -${r*0.6} ${r*0.7}`}
                stroke={vein} strokeWidth="4" fill="none" opacity=".55"/>
        </g>
      </>
    );
  };

  // FX vrstvy
  const WaterFX = ()=>(
    <g>
      {[...Array(10)].map((_,i)=>(
        <circle key={i} cx={220+i*10} cy={60} r={2.8} fill="#60a5fa"
          style={{animation:"rain .6s ease forwards", animationDelay:`${i*25}ms`}}/>
      ))}
    </g>
  );
  const SprayFX = ()=>(
    <g opacity=".75">
      {[...Array(9)].map((_,i)=>(
        <circle key={i} cx={140+i*14} cy={50+(i%3)*6} r={2.4} fill="#93c5fd"
          style={{animation:"mist .6s ease forwards", animationDelay:`${i*30}ms`}}/>
      ))}
    </g>
  );
  const FeedFX = ()=>(
    <g>
      {[...Array(6)].map((_,i)=>(
        <circle key={i} cx={200+i*14} cy={80-i*4} r={2.5} fill="#facc15"
          style={{animation:"sparkle .6s ease forwards", animationDelay:`${i*40}ms`}}/>
      ))}
    </g>
  );
  const LevelFX = ()=>(
    <g>
      {[...Array(12)].map((_,i)=>(
        <circle key={i} cx={180} cy={120} r={3} fill="#a7f3d0"
          style={{transformOrigin:"180px 120px", animation:"sparkle .8s ease forwards", animationDelay:`${i*40}ms`}}/>
      ))}
    </g>
  );

  return (
    <svg width="380" height="280" viewBox="0 0 360 260" style={{ transform:`scale(${scale})`, transition:"transform .35s ease" }}>
      {/* tieň */}
      <ellipse cx="180" cy="208" rx="120" ry="26" fill="#000" opacity=".22" />
      {/* listy */}
      <LeafWithFenestration cx={145} cy={92} r={54}/>
      <LeafWithFenestration cx={205} cy={88} r={58}/>
      <LeafWithFenestration cx={245} cy={98} r={52}/>
      {/* stonka */}
      <rect x="176" y="110" width="8" height="40" rx="4" fill={stem}/>
      {/* kvetináč – gradient, highlight, jemný tvar */}
      <defs>
        <linearGradient id="potG" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#6b3f2a"/>
          <stop offset="100%" stopColor="#4a2a1c"/>
        </linearGradient>
      </defs>
      <g>
        <rect x="88" y="145" width="184" height="84" rx="20" fill="url(#potG)"/>
        <ellipse cx="180" cy="145" rx="94" ry="14" fill="#3a2318"/>
        <path d="M96 156 q84 26 168 0" stroke="#7d4a31" strokeWidth="2" opacity=".25" fill="none"/>
        {/* highlight */}
        <path d="M98 170 q38 -8 164 0" stroke="#fff" strokeOpacity=".07" strokeWidth="4" fill="none"/>
        <EyesMouth/>
      </g>

      {/* efekty */}
      {fx==="water" && <WaterFX/>}
      {fx==="spray" && <SprayFX/>}
      {fx==="feed" && <FeedFX/>}
      {fx==="level" && <LevelFX/>}
    </svg>
  );
}
