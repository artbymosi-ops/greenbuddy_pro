import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Plant3D – prémiový vzhľad + DE voice lines
 * Props:
 *  - state: { hydration, nutrients, spray, xp, level, mood }
 *  - lastAction: 'water'|'feed'|'spray'|'repot'|null
 */
export default function Plant3D({ state, lastAction=null }) {
  const wrap = useRef(null);

  // --- Čas / noc ------------------------------------------------------------
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(()=>setNow(new Date()), 60_000);
    return ()=>clearInterval(t);
  }, []);
  const hour = now.getHours();
  const isNight = hour >= 22 || hour < 7;

  // --- Zvuk + reč (DE) ------------------------------------------------------
  const ac = useRef(null);
  const beep = (f=560, dur=.1, type="sine") => {
    try {
      ac.current = ac.current || new (window.AudioContext||window.webkitAudioContext)();
      const ctx = ac.current, o=ctx.createOscillator(), g=ctx.createGain();
      o.type=type; o.frequency.value=f; g.gain.value=0.001;
      o.connect(g); g.connect(ctx.destination); o.start();
      g.gain.exponentialRampToValueAtTime(.22, ctx.currentTime+.01);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+dur);
      o.stop(ctx.currentTime+dur);
    } catch {}
  };

  const speak = (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const pref = voices.find(v => /^de(-|_)/i.test(v.lang) && /(female|Google|Wavenet|Marlene|Lea|Vicki|Jenny)/i.test(v.name))
              || voices.find(v => /^de(-|_)/i.test(v.lang))
              || voices[0];
    if (pref) u.voice = pref;
    u.lang = "de-DE";
    u.rate = 1.02; u.pitch = 1.05; u.volume = .95;
    window.speechSynthesis.speak(u);
  };

  const LINES = {
    water: ["Ahh, das tut gut! Danke fürs Gießen.","Frisches Wasser – ich fühle mich lebendig!","Genau richtig, mein Durst war groß."],
    feed:  ["Lecker Dünger – das gibt Kraft!","Nährstoffe! Jetzt kann ich wachsen.","Mmh, das schmeckt meiner Wurzel."],
    spray: ["Feiner Nebel! Meine Blätter glitzern.","Danke, die Luftfeuchte ist perfekt.","Aaaah, so erfrischend!"],
    repot: ["Neues Zuhause – ich liebe diesen Topf!","Frische Erde, mehr Platz – danke!","So kann ich besser atmen und wachsen."],
    night: ["Pssst… Schlafenszeit. Bis morgen!","Ich ruhe mich aus und träume vom Wachsen."],
    morning: ["Guten Morgen! Bereit für einen sonnigen Tag.","Ich strecke meine Blätter – hallo Welt!"],
    lowCare: {
      hydration: "Ich habe etwas Durst… vielleicht ein Schlückchen?",
      nutrients: "Ein wenig Dünger würde mir gut tun.",
      spray:     "Ein Sprühnebel wäre jetzt toll."
    }
  };

  // hovoriť pri akciách (len cez deň)
  useEffect(()=>{
    if (isNight || !lastAction) return;
    const pick = (arr)=>arr[Math.floor(Math.random()*arr.length)];
    const tone = lastAction==='repot'?330 : lastAction==='spray'?740 : lastAction==='feed'?440 : 520;
    const arr = LINES[lastAction] || [];
    if (arr.length) speak(pick(arr));
    beep(tone);
  },[lastAction, isNight]);

  // ranný/večerný pozdrav
  useEffect(()=>{
    if (hour === 7 || hour === 8) speak(LINES.morning[0]);
    if (hour === 22) speak(LINES.night[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[hour]);

  // pripomienky starostlivosti (10 min, len cez deň)
  useEffect(()=>{
    if (isNight) return;
    const t = setInterval(()=>{
      if (state.hydration<30) speak(LINES.lowCare.hydration);
      else if (state.nutrients<30) speak(LINES.lowCare.nutrients);
      else if (state.spray<30) speak(LINES.lowCare.spray);
    }, 600_000);
    return ()=>clearInterval(t);
  },[state, isNight]);

  // --- rast + layout --------------------------------------------------------
  const growth = useMemo(()=>{
    const lvl = Math.min(6, Math.max(1, state.level||1));
    return {
      leaves: Math.min(8, 1 + Math.floor(lvl)), // 1..6 (max 8 pre budúcnosť)
      fenestrated: lvl >= 3,
      plantScale: 0.96 + lvl*0.06,
      potScale: 0.96 + (lvl-1)*0.04
    };
  },[state.level]);

  // parallax podľa myši/dotyku
  useEffect(()=>{
    const el = wrap.current; if (!el) return;
    const onMove = (e)=>{
      const r = el.getBoundingClientRect();
      const p = "touches" in e ? e.touches[0] : e;
      const x = (p.clientX - r.left)/r.width - .5;
      const y = (p.clientY - r.top)/r.height - .5;
      el.style.setProperty("--tiltX", `${Math.max(-10, Math.min(10, -y*10))}deg`);
      el.style.setProperty("--tiltY", `${Math.max(-10, Math.min(10,  x*10))}deg`);
    };
    const reset = ()=>{ el.style.setProperty("--tiltX","0deg"); el.style.setProperty("--tiltY","0deg"); };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("touchmove", onMove, {passive:true});
    el.addEventListener("mouseleave", reset);
    el.addEventListener("touchend", reset);
    return ()=>{ el.removeEventListener("mousemove", onMove); el.removeEventListener("touchmove", onMove); el.removeEventListener("mouseleave", reset); el.removeEventListener("touchend", reset); };
  },[]);

  // --- List (Monstera) ------------------------------------------------------
  const Leaf = ({i})=>{
    const count = Math.max(1, growth.leaves);
    const base = -32;
    const spread = 64;
    const a = count === 1 ? 0 : base + (i*(spread/(count-1)));
    const s = growth.plantScale * (0.9 + (i%3)*0.05);

    const hue = 150 + (i%3)*5;
    const fill = `hsl(${hue} 55% ${isNight?26:38}%)`;
    const stroke= `hsl(${hue} 60% ${isNight?18:28}%)`;
    const mid = `hsl(${hue} 70% ${isNight?22:34}%)`;

    // organický tvar + jemný „stopkový“ žliabok
    const path = `
      M0,0
      C 28,-24 74,-24 92,4
      C 110,34 82,78 42,86
      C 2,92 -22,70 -22,48
      C -18,24 -4,12 0,0 Z
    `;

    const fen = growth.fenestrated && (
      <>
        <path d="M20 16 C36 8 56 8 70 16" stroke="rgba(255,255,255,.28)" strokeWidth="3" fill="none"/>
        <path d="M16 32 C36 22 62 22 78 32" stroke="rgba(255,255,255,.22)" strokeWidth="3" fill="none"/>
        <path d="M12 48 C34 38 56 38 70 48" stroke="rgba(255,255,255,.18)" strokeWidth="3" fill="none"/>
      </>
    );

    const cls =
      lastAction==='water' ? 'leaf-wiggle' :
      lastAction==='spray' ? 'leaf-shimmer':
      lastAction==='feed'  ? 'leaf-pulse'  : '';

    return (
      <g transform={`translate(200,135) rotate(${a}) scale(${s})`}
         className={`layer leaf3d ${cls} leaf-breathe`}>
        <path d={path} fill={fill} stroke={stroke} strokeWidth="3" filter="url(#leafLight)"/>
        {fen}
        <path d="M2 10 C30 48 46 64 68 80" stroke={mid} strokeWidth="4" fill="none"/>
      </g>
    );
  };

  // tvar úst podľa nálady
  const mouthPath = (() => {
    if (state.mood === 'sad')   return "M34 10 q16 -8 32 0";
    if (state.mood === 'happy') return "M34 6 q16 8 32 0";
    return "M34 8 q16 6 32 0";
  })();

  // jemné mikropohyby očí (živší look)
  const [blink, setBlink] = useState(false);
  useEffect(()=>{
    let id;
    const loop = () => {
      setBlink(true);
      setTimeout(()=>setBlink(false), 120);
      id = setTimeout(loop, 2400 + Math.random()*2200);
    };
    id = setTimeout(loop, 1800 + Math.random()*1600);
    return ()=>clearTimeout(id);
  },[]);

  return (
    <div ref={wrap} className={`plant3d ${isNight?'night':''}`}>
      <svg viewBox="0 0 400 300" width="100%" height="auto" className="scene">
        <defs>
          {/* soft lesk na listoch */}
          <filter id="leafLight">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="b"/>
            <feSpecularLighting in="b" surfaceScale="2" specularConstant="0.6" specularExponent="12" lightingColor="#ffffff" result="spec">
              <fePointLight x="40" y="-40" z="80"/>
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceAlpha" operator="in" result="specOut"/>
            <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="specOut"/></feMerge>
          </filter>

          {/* vnútorný tieň pre črepník */}
          <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feOffset dx="0" dy="-1"/>
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="arithmetic" k2="-1" k3="1" />
          </filter>

          <filter id="softGlow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>

          {/* terakota gradienty */}
          <linearGradient id="terracotta" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#b26d47"/>
            <stop offset="60%" stopColor="#935233"/>
            <stop offset="100%" stopColor="#6f3c26"/>
          </linearGradient>
          <linearGradient id="terracottaRim" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#c07a52"/>
            <stop offset="100%" stopColor="#8a5034"/>
          </linearGradient>
          <linearGradient id="soilG" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3b2a21"/>
            <stop offset="100%" stopColor="#2a1d16"/>
          </linearGradient>
        </defs>

        {/* tieň na podlahe */}
        <ellipse cx="200" cy="272" rx="120" ry="16" fill="rgba(0,0,0,.35)"/>

        {/* Črepník – zúžený tvar (terakota) */}
        <g className="layer pot3d" transform={`translate(200,205) scale(${growth.potScale}) translate(-200,-205)`}>
          {/* okraj */}
          <path d="M80 162 Q200 138 320 162 L320 182 Q200 206 80 182 Z"
                fill="url(#terracottaRim)" filter="url(#innerShadow)"/>
          {/* misa (užšie dno) */}
          <path d="M110 182 Q200 198 290 182 L270 250 Q200 264 130 250 Z"
                fill="url(#terracotta)"/>
          {/* zemina */}
          <ellipse cx="200" cy="176" rx="96" ry="14" fill="url(#soilG)"/>
          {/* highlight */}
          <path d="M120 190 C160 186 240 186 280 190"
                stroke="rgba(255,255,255,.18)" strokeWidth="5" fill="none"/>
        </g>

        {/* Stonka */}
        <rect x="196" y="118" width="8" height="64" rx="4"
              fill={isNight?"#0d5e3a":"#1b8e58"} className="layer stem3d"/>

        {/* Listy */}
        {Array.from({length:growth.leaves}).map((_,i)=><Leaf key={i} i={i} />)}

        {/* Tvár – prémiové očká s odleskom */}
        <g transform="translate(150,210)" className="layer">
          {isNight ? (
            <>
              <path d="M26 8 q8 -6 16 0" stroke="#131313" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <path d="M74 8 q8 -6 16 0" stroke="#131313" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <text x="120" y="-10" fill="#a0c4ff" filter="url(#softGlow)">Z z z</text>
            </>
          ) : (
            <>
              {/* ľavé oko */}
              <g transform={`translate(24,3) scale(${blink?1:1})`}>
                <circle cx="5" cy="3" r="5" fill="#0f1112"/>
                <circle cx="3.2" cy="1.6" r="1.6" fill="#ffffff" opacity=".9"/>
                <circle cx="6.6" cy="4.0" r=".8" fill="#ffffff" opacity=".8"/>
              </g>
              {/* pravé oko */}
              <g transform={`translate(76,3) scale(${blink?1:1})`}>
                <circle cx="5" cy="3" r="5" fill="#0f1112"/>
                <circle cx="3.2" cy="1.6" r="1.6" fill="#ffffff" opacity=".9"/>
                <circle cx="6.6" cy="4.0" r=".8" fill="#ffffff" opacity=".8"/>
              </g>
              {/* ústa */}
              <path d={mouthPath}
                    stroke="#121212" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
            </>
          )}
        </g>

        {/* Efekty po akcii */}
        {lastAction==='water'  && <Drops/>}
        {lastAction==='spray'  && <Sparkles/>}
      </svg>
    </div>
  );
}

function Drops(){
  return (
    <g className="drops layer">
      {[0,1,2].map(k=>(
        <circle key={k} cx={160 + k*24} cy={70} r="5" fill="#62d3ff"/>
      ))}
    </g>
  );
}
function Sparkles(){
  return (
    <g className="sparkles layer">
      {[0,1,2,3].map(k=>(
        <g key={k} transform={`translate(${120+k*34}, ${54+(k%2)*16})`}>
          <path d="M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2 Z" fill="#cdefff"/>
        </g>
      ))}
    </g>
  );
      }
