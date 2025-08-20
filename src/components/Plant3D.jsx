import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Props
 * - state: { hydration, nutrients, spray, xp, level, mood }
 * - lastAction: 'water'|'feed'|'spray'|'repot'|null
 */
export default function Plant3D({ state, lastAction=null }) {
  const wrap = useRef(null);

  // --- čas / spánok ---------------------------------------------------------
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(()=>setNow(new Date()), 60_000);
    return ()=>clearInterval(t);
  }, []);
  const hour = now.getHours();
  const isNight = hour >= 22 || hour < 7;

  // --- zvuk + reč -----------------------------------------------------------
  const ac = useRef(null);
  const blip = (f=580, dur=.09, type="sine") => {
    try {
      ac.current = ac.current || new (window.AudioContext||window.webkitAudioContext)();
      const ctx = ac.current, o=ctx.createOscillator(), g=ctx.createGain();
      o.type=type; o.frequency.value=f; g.gain.value=0.001;
      o.connect(g); g.connect(ctx.destination); o.start();
      g.gain.exponentialRampToValueAtTime(.25, ctx.currentTime+.01);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+dur);
      o.stop(ctx.currentTime+dur);
    } catch {}
  };
  const speak = (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    // vyber nežný hlas, ak existuje
    const voices = window.speechSynthesis.getVoices();
    const pref = voices.find(v => /(de-|sk-|en-)/i.test(v.lang) && /female|Google|Wavenet|Jenny|Marlene/i.test(v.name));
    if (pref) u.voice = pref;
    u.lang = pref?.lang || "de-DE"; // zmeň na "sk-SK" keď chceš
    u.rate = 1.02; u.pitch = 1.05; u.volume = .95;
    window.speechSynthesis.speak(u);
  };

  const LINES = {
    water: [
      "Ahh, das tut gut! Danke fürs Gießen.",
      "Frisches Wasser – ich fühle mich lebendig!",
    ],
    feed: [
      "Lecker Dünger – das gibt Power!",
      "Nährstoffe! Ich werde stark und groß.",
    ],
    spray: [
      "Mmm, Nebel! Meine Blätter glitzern.",
      "Danke, die Luftfeuchte ist perfekt.",
    ],
    repot: [
      "Neues Zuhause! Ich liebe diesen Topf.",
      "Frische Erde – ich kann besser atmen.",
    ],
    night: [
      "Pssst… Schlafenszeit. Bis morgen!",
      "Ich ruhe mich aus und wachse im Traum.",
    ],
    morning: [
      "Guten Morgen! Bereit für einen sonnigen Tag.",
      "Ich strecke meine Blätter – hallo Welt!",
    ],
    lowCare: [
      "Ich habe ein bisschen Durst…",
      "Könnte ich etwas Dünger haben?",
      "Ein Sprühnebel wäre toll!",
    ],
  };

  // hovoriť pri akciách / ráno / noc / nízke staty
  useEffect(()=>{
    if (isNight) return; // v noci ticho
    if (lastAction) {
      const pick = LINES[lastAction][Math.floor(Math.random()*LINES[lastAction].length)];
      speak(pick); blip(lastAction==='repot'?330:lastAction==='spray'?740:lastAction==='feed'?440:520);
    }
  },[lastAction, isNight]);

  // pozdrav ráno / noc
  useEffect(()=>{
    const m = hour;
    if (m===7 || m===8) speak(LINES.morning[0]);
    if (m===22) speak(LINES.night[0]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[hour]);

  // upozornenie pri nízkych hodnotách (raz za 10 min)
  useEffect(()=>{
    if (isNight) return;
    const t = setInterval(()=>{
      if (state.hydration<30) speak(LINES.lowCare[0]);
      else if (state.nutrients<30) speak(LINES.lowCare[1]);
      else if (state.spray<30) speak(LINES.lowCare[2]);
    }, 600_000);
    return ()=>clearInterval(t);
  },[state, isNight]);

  // --- rast a 3D vrstvy -----------------------------------------------------
  const growth = useMemo(()=>{
    const lvl = Math.min(6, Math.max(1, state.level||1));
    return {
      leaves: 3 + Math.floor(lvl), // 4–9 listov
      fenestrated: lvl >= 3,
      scale: 0.95 + lvl*0.12
    };
  },[state.level]);

  // parallax podľa polohy myši / dotyku
  useEffect(()=>{
    const el = wrap.current;
    if (!el) return;
    const onMove = (e)=>{
      const r = el.getBoundingClientRect();
      const x = (("touches" in e ? e.touches[0].clientX : e.clientX)-r.left)/r.width - .5;
      const y = (("touches" in e ? e.touches[0].clientY : e.clientY)-r.top)/r.height - .5;
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

  // list – prepracovaný tvar s ľahkým 3D svetlom
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
    return (
      <g transform={`translate(200,135) rotate(${a}) scale(${s})`} className="layer leaf3d">
        <path d={path} fill={fill} stroke={stroke} strokeWidth="3" filter="url(#leafLight)"/>
        {growth.fenestrated && (
          <>
            <path d="M20 16 C36 8 56 8 70 16" stroke="rgba(0,0,0,.22)" strokeWidth="3" fill="none"/>
            <path d="M16 32 C36 22 62 22 78 32" stroke="rgba(0,0,0,.18)" strokeWidth="3" fill="none"/>
            <path d="M12 48 C34 38 56 38 70 48" stroke="rgba(0,0,0,.14)" strokeWidth="3" fill="none"/>
          </>
        )}
        <path d="M2 10 C30 48 46 64 68 80" stroke={mid} strokeWidth="4" fill="none"/>
      </g>
    );
  };

  return (
    <div ref={wrap} className={`plant3d ${isNight?'night':''}`}>
      <svg viewBox="0 0 400 300" width="100%" height="auto" className="scene">
        <defs>
          {/* jemné svetlo na listoch */}
          <filter id="leafLight">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur"/>
            <feSpecularLighting in="blur" surfaceScale="2" specularConstant="0.6" specularExponent="12" lightingColor="#ffffff" result="spec">
              <fePointLight x="40" y="-40" z="80"/>
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceAlpha" operator="in" result="specOut"/>
            <feMerge>
              <feMergeNode in="SourceGraphic"/>
              <feMergeNode in="specOut"/>
            </feMerge>
          </filter>
          {/* glow pre zzz */}
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="2" result="b"/>
            <feMerge>
              <feMergeNode in="b"/><feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          {/* gradienty na hrniec/zeminu */}
          <linearGradient id="potG" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#8b5a3c"/>
            <stop offset="100%" stopColor="#603a25"/>
          </linearGradient>
          <linearGradient id="rimG" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#a77554"/>
            <stop offset="100%" stopColor="#7b5037"/>
          </linearGradient>
          <linearGradient id="soilG" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3b2a21"/>
            <stop offset="100%" stopColor="#2a1d16"/>
          </linearGradient>
        </defs>

        {/* tieň */}
        <ellipse cx="200" cy="272" rx="120" ry="16" fill="rgba(0,0,0,.35)"/>

        {/* hrniec 3D */}
        <g className="layer pot3d">
          <rect x="95" y="176" width="210" height="82" rx="22" fill="url(#potG)"/>
          <rect x="82" y="162" width="236" height="34" rx="17" fill="url(#rimG)"/>
          <ellipse cx="200" cy="176" rx="96" ry="14" fill="url(#soilG)"/>
          {/* highlight */}
          <path d="M110 186 C140 178 200 178 232 186" stroke="rgba(255,255,255,.16)" strokeWidth="6" fill="none"/>
        </g>

        {/* stonka */}
        <rect x="194" y="120" width="12" height="60" rx="6" fill={isNight?"#0d5e3a":"#1b8e58"} className="layer stem3d"/>

        {/* listy */}
        {Array.from({length:growth.leaves}).map((_,i)=><Leaf key={i} i={i}/>)}

        {/* tvárička / spánok */}
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

        {/* akčné efekty */}
        {lastAction==='water'  && <Drops/>}
        {lastAction==='spray'  && <Sparkles/>}
      </svg>
    </div>
  );
}

// kvapky
function Drops(){
  return (
    <g className="drops layer">
      {[0,1,2].map(k=>(
        <circle key={k} cx={160 + k*24} cy={70} r="5" fill="#62d3ff"/>
      ))}
    </g>
  );
}
// trblietky
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
