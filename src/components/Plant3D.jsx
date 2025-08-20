import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Plant3D – DE-only voice + lines
 * Props:
 *  - state: { hydration, nutrients, spray, xp, level, mood }
 *  - lastAction: 'water'|'feed'|'spray'|'repot'|null
 */
export default function Plant3D({ state, lastAction=null }) {
  const wrap = useRef(null);

  // --- Zeit / Schlaf --------------------------------------------------------
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(()=>setNow(new Date()), 60_000);
    return ()=>clearInterval(t);
  }, []);
  const hour = now.getHours();
  const isNight = hour >= 22 || hour < 7;

  // --- Audio + Sprache (DE) -------------------------------------------------
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

  // milý nemecký hlas (ak je k dispozícii)
  const speak = (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    // prednosť DE ženským / „pekným“ hlasom
    const pref = voices.find(v => /^de(-|_)/i.test(v.lang) && /(female|Google|Wavenet|Marlene|Lea|Vicki|Jenny)/i.test(v.name))
              || voices.find(v => /^de(-|_)/i.test(v.lang))
              || voices[0];
    if (pref) u.voice = pref;
    u.lang = "de-DE";
    u.rate = 1.02; u.pitch = 1.05; u.volume = .95;
    window.speechSynthesis.speak(u);
  };

  const LINES = {
    water: [
      "Ahh, das tut gut! Danke fürs Gießen.",
      "Frisches Wasser – ich fühle mich lebendig!",
      "Genau richtig, mein Durst war groß."
    ],
    feed: [
      "Lecker Dünger – das gibt Kraft!",
      "Nährstoffe! Jetzt kann ich wachsen.",
      "Mmh, das schmeckt meiner Wurzel."
    ],
    spray: [
      "Feiner Nebel! Meine Blätter glitzern.",
      "Danke, die Luftfeuchte ist perfekt.",
      "Aaaah, so erfrischend!"
    ],
    repot: [
      "Neues Zuhause – ich liebe diesen Topf!",
      "Frische Erde, mehr Platz – danke!",
      "So kann ich besser atmen und wachsen."
    ],
    night: [
      "Pssst… Schlafenszeit. Bis morgen!",
      "Ich ruhe mich aus und träume vom Wachsen."
    ],
    morning: [
      "Guten Morgen! Bereit für einen sonnigen Tag.",
      "Ich strecke meine Blätter – hallo Welt!"
    ],
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

  // jemné pripomienky (každých 10 min, len cez deň)
  useEffect(()=>{
    if (isNight) return;
    const t = setInterval(()=>{
      if (state.hydration<30) speak(LINES.lowCare.hydration);
      else if (state.nutrients<30) speak(LINES.lowCare.nutrients);
      else if (state.spray<30) speak(LINES.lowCare.spray);
    }, 600_000);
    return ()=>clearInterval(t);
  },[state, isNight]);

  // --- rast + 3D vrstvy -----------------------------------------------------
  const growth = useMemo(()=>{
    const lvl = Math.min(6, Math.max(1, state.level||1));
    return { leaves: 3 + Math.floor(lvl), fenestrated: lvl >= 3, scale: 0.95 + lvl*0.12 };
  },[state.level]);

  // parallax podľa myši/dotyku
  useEffect(()=>{
    const el = wrap.current; if (!el) return;
    const onMove = (e)=>{
      const r = el.getBoundingClientRect();
      const cx = "touches" in e ? e.touches[0].clientX : e.clientX;
      const cy = "touches" in e ? e.touches[0].clientY : e.clientY;
      const x = (cx - r.left)/r.width - .5;
      const y = (cy - r.top)/r.height - .5;
      el.style.setProperty("--tiltX", `${Math.max(-10, Math.min(10, -y*10))}deg`);
      el.style.setProperty("--tiltY", `${Math.max(-10, Math.min(10, x*10))}deg`);
    };
    const reset = ()=>{ el.style.setProperty("--tiltX","0deg"); el.style.setProperty("--tiltY","0deg"); };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("touchmove", onMove, {passive:true});
    el.addEventListener("mouseleave", reset);
    el.addEventListener("touchend", reset);
    return ()=>{ el.removeEventListener("mousemove", onMove); el.removeEventListener("touchmove", onMove); el.removeEventListener("mouseleave", reset); el.removeEventListener("touchend", reset); };
  },[]);

  // prepracovaný list (s „dýchaním“ a fenestráciou)
  const Leaf = ({i})=>{
    const a = -35 + i*(70/Math.max(1,growth.leaves-1));
    const s = growth.scale*(.92 + (i%3)*.06);
    const hue = 150 + (i%3)*6;
    const fill = `hsl(${hue} 55% ${isNight?26:38}%)`;
    const stroke= `hsl(${hue} 60% ${isNight?18:28}%)`;
    const mid = `hsl(${hue} 70% ${isNight?22:34}%)`;
    const path = `
      M0,0
      C 28,-24 74,-24 92,4
      C 110,34 82,78 42,86
      C 2,92 -22,70 -22,48
      C -18,24 -4,12 0,0 Z
    `;
    const fen = growth.fenestrated && (
      <>
        <path d="M20 16 C36 8 56 8 70 16" stroke="rgba(0,0,0,.22)" strokeWidth="3" fill="none"/>
        <path d="M16 32 C36 22 62 22 78 32" stroke="rgba(0,0,0,.18)" strokeWidth="3" fill="none"/>
        <path d="M12 48 C34 38 56 38 70 48" stroke="rgba(0,0,0,.14)" strokeWidth="3" fill="none"/>
      </>
    );
    // akcie -> jemné efekty
    const cls =
      lastAction==='water' ? 'leaf-wiggle' :
      lastAction==='spray' ? 'leaf-shimmer':
      lastAction==='feed'  ? 'leaf-pulse'  : '';

    return (
      <g transform={`translate(200,135) rotate(${a}) scale(${s})`} className={`layer leaf3d ${cls} leaf-breathe`}>
        <path d={path} fill={fill} stroke={stroke} strokeWidth="3" filter="url(#leafLight)"/>
        {fen}
        <path d="M2 10 C30 48 46 64 68 80" stroke={mid} strokeWidth="4" fill="none"/>
      </g>
    );
  };

  return (
    <div ref={wrap} className={`plant3d ${isNight?'night':''}`}>
      <svg viewBox="0 0 400 300" width="100%" height="auto" className="scene">
        <defs>
          <filter id="leafLight">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="b"/>
            <feSpecularLighting in="b" surfaceScale="2" specularConstant="0.6" specularExponent="12" lightingColor="#ffffff" result="spec">
              <fePointLight x="40" y="-40" z="80"/>
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceAlpha" operator="in" result="specOut"/>
            <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="specOut"/></feMerge>
          </filter>
          <filter id="softGlow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <linearGradient id="potG" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#8b5a3c"/><stop offset="100%" stopColor="#603a25"/></linearGradient>
          <linearGradient id="rimG" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#a77554"/><stop offset="100%" stopColor="#7b5037"/></linearGradient>
          <linearGradient id="soilG" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#3b2a21"/><stop offset="100%" stopColor="#2a1d16"/></linearGradient>
        </defs>

        {/* tieň */}
        <ellipse cx="200" cy="272" rx="120" ry="16" fill="rgba(0,0,0,.35)"/>

        {/* Topf (3D) */}
        <g className="layer pot3d">
          <rect x="95" y="176" width="210" height="82" rx="22" fill="url(#potG)"/>
          <rect x="82" y="162" width="236" height="34" rx="17" fill="url(#rimG)"/>
          <ellipse cx="200" cy="176" rx="96" ry="14" fill="url(#soilG)"/>
          <path d="M110 186 C140 178 200 178 232 186" stroke="rgba(255,255,255,.16)" strokeWidth="6" fill="none"/>
        </g>

        {/* Stiel */}
        <rect x="194" y="120" width="12" height="60" rx="6" fill={isNight?"#0d5e3a":"#1b8e58"} className="layer stem3d"/>

        {/* Blätter */}
        {Array.from({length:growth.leaves}).map((_,i)=><Leaf key={i} i={i}/>)}

        {/* Gesicht / Schlaf */}
        <g transform="translate(150,210)" className="layer">
          {isNight ? (
            <>
              <path d="M26 8 q8 -6 16 0" stroke="#131313" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <path d="M74 8 q8 -6 16 0" stroke="#131313" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <text x="120" y="-10" fill="#a0c4ff" filter="url(#softGlow)">Z z z</text>
            </>
          ) : (
            <>
              <rect x="22" y="0" width="6" height="6" fill="#131313" rx="1"/>
              <rect x="74" y="0" width="6" height="6" fill="#131313" rx="1"/>
              <path d={`M34 ${state.mood==='sad'?10:6} q16 ${state.mood==='sad'?-8:8} 32 0`} stroke="#131313" strokeWidth="3" fill="none" strokeLinecap="round"/>
            </>
          )}
        </g>

        {/* Effekte */}
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
