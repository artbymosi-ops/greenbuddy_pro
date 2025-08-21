import { useMemo } from "react";

/** Premium Monstera (DE) – reaguje na mood/level/lastAction
 *  props: { state:{hydration,nutrients,spray,level,mood}, lastAction }
 */
export default function Plant3D({ state, lastAction }) {
  const level = Math.max(1, Math.min(10, state?.level || 1));
  const mood  = state?.mood || "happy";

  const config = useMemo(()=>{
    const leaves = 2 + Math.floor(level*0.8);        // rast listov
    const fen    = level >= 3;
    const scale  = 0.95 + level*0.06;                 // plynulý rast
    return { leaves, fen, scale };
  },[level]);

  const leafFill   = mood==="sad" ? "#70b780" : "#32c976";
  const leafStroke = mood==="sad" ? "#2b7c4e" : "#1a8e57";
  const vein       = mood==="sad" ? "#2a8a56" : "#157f4b";

  return (
    <div className="plant-wrap">
      <svg className="scene" viewBox="0 0 400 280" width="100%" height="auto">
        {/* tieň */}
        <ellipse cx="200" cy="250" rx="110" ry="18" fill="#000" opacity=".18"/>

        {/* kmeň */}
        <rect x="194" y="120" width="12" height="70" rx="6" fill="#2bb36a"/>

        {/* listy */}
        {Array.from({length: config.leaves}).map((_,i)=>{
          const angle = -30 + i*(60/Math.max(1,config.leaves-1));
          const r = 48 + (i%3)*6;
          const cx = 200 + Math.cos((angle-90)*Math.PI/180)*46;
          const cy = 120 + Math.sin((angle-90)*Math.PI/180)*46;
          const maskId = `fen${i}`;
          return (
            <g key={i} transform={`scale(${config.scale})`} style={{transformOrigin:"200px 200px"}}>
              <defs>
                <mask id={maskId}>
                  <circle cx={cx} cy={cy} r={r} fill="#fff"/>
                  {config.fen && Array.from({length: 6}).map((__,k)=>(
                    <ellipse key={k}
                      cx={cx + (k%2? r*0.22 : -r*0.18)}
                      cy={cy + (k*7 - r*0.18)}
                      rx={Math.max(3, r*0.06 + k*0.5)}
                      ry={Math.max(2, r*0.03 + k*0.35)}
                      fill="#000"
                      transform={`rotate(${k%2?12:-8} ${cx} ${cy})`}
                    />
                  ))}
                </mask>
              </defs>
              <g mask={`url(#${maskId})`} className={
                lastAction==="spray" ? "leaf shimmer" :
                lastAction==="water" ? "leaf wiggle"  :
                lastAction==="feed"  ? "leaf pulse"   : "leaf"
              }>
                <circle cx={cx} cy={cy} r={r} fill={leafFill} stroke={leafStroke} strokeWidth="3"/>
                <path d={`M${cx} ${cy} c0 ${r*0.5} -${r*0.35} ${r*0.6} -${r*0.6} ${r*0.7}`}
                      stroke={vein} strokeWidth="4" fill="none" opacity=".55"/>
              </g>
            </g>
          );
        })}

        {/* tvárička */}
        <g transform="translate(0,10)">
          {/* oči s odleskom */}
          <g>
            <circle cx="170" cy="190" r="6" fill="#121518"/>
            <circle cx="210" cy="190" r="6" fill="#121518"/>
            <circle cx="168" cy="188" r="2" fill="#fff" opacity=".9"/>
            <circle cx="208" cy="188" r="2" fill="#fff" opacity=".9"/>
          </g>
          {/* ústa podľa nálady */}
          {mood==="sad" ? (
            <path d="M170 206 q20 -14 40 0" stroke="#121518" strokeWidth="5" fill="none" strokeLinecap="round"/>
          ) : mood==="happy" ? (
            <path d="M170 200 q20 12 40 0"  stroke="#121518" strokeWidth="5" fill="none" strokeLinecap="round"/>
          ) : (
            <path d="M170 202 q20 0 40 0"    stroke="#121518" strokeWidth="5" fill="none" strokeLinecap="round"/>
          )}
        </g>

        {/* užší terakotový kvetináč */}
        <defs>
          <linearGradient id="potG" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#6b3f2a"/>
            <stop offset="100%" stopColor="#4a2a1c"/>
          </linearGradient>
          <linearGradient id="rimG" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#a57152"/>
            <stop offset="100%" stopColor="#7b4d35"/>
          </linearGradient>
        </defs>
        <g>
          {/* okraj (užší) */}
          <rect x="120" y="150" width="160" height="26" rx="13" fill="url(#rimG)"/>
          {/* vnútro/zem */}
          <ellipse cx="200" cy="162" rx="74" ry="10" fill="#3a2318"/>
          {/* telo kvetináča – užšie a vyššie, terakota */}
          <path d="M142 168 L258 168 L238 220 Q200 228 162 220 Z" fill="url(#potG)"/>
          {/* jemný lesk */}
          <path d="M150 184 q50 10 100 0" stroke="#fff" strokeOpacity=".08" strokeWidth="6" fill="none"/>
        </g>

        {/* efekty */}
        {lastAction==="water"  && <Drops/>}
        {lastAction==="spray"  && <Mist/>}
        {lastAction==="feed"   && <Sparkles/>}
      </svg>

      <style jsx>{`
        .plant-wrap{width:100%;max-width:720px;margin:0 auto}
        .scene{display:block}
        .leaf{transform-origin:200px 200px;animation:breath 5s ease-in-out infinite}
        .leaf.wiggle{animation:wobble .5s ease}
        .leaf.pulse{animation:pulse .6s ease}
        .leaf.shimmer{filter:url(#leafLight)}
        @keyframes breath{0%{transform:translateY(0)}50%{transform:translateY(-1.5px)}100%{transform:translateY(0)}}
        @keyframes wobble{0%{transform:rotate(0)}25%{transform:rotate(-1.3deg)}50%{transform:rotate(1.3deg)}100%{transform:rotate(0)}}
        @keyframes pulse{0%{opacity:.9}50%{opacity:1}100%{opacity:.9}}
      `}</style>
    </div>
  );
}

function Drops(){
  return (
    <g opacity=".9">
      {Array.from({length:8}).map((_,i)=>(
        <circle key={i} cx={150+i*18} cy={90} r="3" fill="#62d3ff"
          style={{animation:"rain .7s ease forwards", animationDelay:`${i*40}ms`}}/>
      ))}
      <style jsx>{`@keyframes rain{0%{transform:translateY(-10px);opacity:0}15%{opacity:1}100%{transform:translateY(34px);opacity:0}}`}</style>
    </g>
  );
}
function Mist(){
  return (
    <g opacity=".6">
      {Array.from({length:9}).map((_,i)=>(
        <circle key={i} cx={130+i*16} cy={80+(i%3)*6} r="2.6" fill="#cfe9ff"
          style={{animation:"mist .7s ease forwards", animationDelay:`${i*35}ms`}}/>
      ))}
      <style jsx>{`@keyframes mist{0%{transform:translateX(0);opacity:0}20%{opacity:.6}100%{transform:translateX(38px);opacity:0}}`}</style>
    </g>
  );
}
function Sparkles(){
  return (
    <g>
      {Array.from({length:10}).map((_,i)=>(
        <circle key={i} cx={180} cy={120} r="3" fill="#a7f3d0"
          style={{transformOrigin:"180px 120px",animation:"spark .8s ease forwards",animationDelay:`${i*40}ms`}}/>
      ))}
      <style jsx>{`@keyframes spark{0%{transform:scale(.6);opacity:0}40%{opacity:1}100%{transform:scale(1.5);opacity:0}}`}</style>
    </g>
  );
      }
