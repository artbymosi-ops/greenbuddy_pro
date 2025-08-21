// src/components/Plant2D.jsx
import { useMemo } from "react";

const isNight = () => {
  const h = new Date().getHours();
  return h >= 22 || h < 6;
};

/** 2D Monstera
 * props: { state:{hydration,nutrients,spray,level,mood}, lastAction }
 */
export default function Plant2D({ state, lastAction }) {
  const night = isNight();

  // farby podľa nálady
  const leafFill   = state?.mood === "sad" ? "#78b78a" : "#35cb7b";
  const leafStroke = state?.mood === "sad" ? "#2a8a56" : "#1c8b57";
  const vein       = state?.mood === "sad" ? "#2a8a56" : "#157f4b";

  // veľkosť podľa levelu
  const scale = useMemo(() => 0.95 + (Math.max(1, state?.level || 1) * 0.06), [state?.level]);

  return (
    <div style={{ position: "relative" }}>
      {/* nočný overlay (jemne stmaví) */}
      {night && <div className="night-overlay on" />}

      <svg viewBox="0 0 400 280" width="100%" height="auto" style={{ display:"block" }}>
        {/* tieň */}
        <ellipse cx="200" cy="250" rx="110" ry="18" fill="#000" opacity=".18"/>

        {/* stonka */}
        <rect x="194" y="120" width="12" height="70" rx="6" fill="#2bb36a"/>

        {/* listy (dva veľké + jeden menší; jemné „dýchanie“ a reakcia na akcie) */}
        <Leaf cx={160} cy={120} r={60} fill={leafFill} stroke={leafStroke} vein={vein}
              className={cls(lastAction)} scale={scale} fenestrated={true} />
        <Leaf cx={240} cy={120} r={62} fill={leafFill} stroke={leafStroke} vein={vein}
              className={cls(lastAction)} scale={scale} fenestrated={true} delay=".15s" />
        <Leaf cx={200} cy={100} r={46} fill={leafFill} stroke={leafStroke} vein={vein}
              className={cls(lastAction)} scale={scale*0.92} fenestrated={state.level>=4} delay=".3s" />

        {/* tvárička */}
        <Face mood={state?.mood || "happy"} night={night} />

        {/* efekty akcií */}
        {lastAction==="water"  && <Drops/>}
        {lastAction==="spray"  && <Mist/>}
        {lastAction==="feed"   && <Sparkles/>}
      </svg>

      {/* Zzz pri spánku */}
      <div className={`zzz ${night ? "on":""}`}>Z z</div>

      <style jsx>{`
        @keyframes breath{0%{transform:translateY(0)}50%{transform:translateY(-1.5px)}100%{transform:translateY(0)}}
        @keyframes wobble{0%{transform:rotate(0)}25%{transform:rotate(-1.3deg)}50%{transform:rotate(1.3deg)}100%{transform:rotate(0)}}
        @keyframes pulse{0%{opacity:.92}50%{opacity:1}100%{opacity:.92}}
        .leaf{animation:breath 5s ease-in-out infinite; transform-origin: 200px 200px;}
        .leaf.wiggle{animation:wobble .5s ease;}
        .leaf.pulse{animation:pulse .6s ease;}
      `}</style>
    </div>
  );
}

function cls(lastAction){
  return lastAction==="spray" ? "leaf" :
         lastAction==="water" ? "leaf wiggle" :
         lastAction==="feed"  ? "leaf pulse" : "leaf";
}

function Leaf({ cx, cy, r, fill, stroke, vein, className, scale=1, fenestrated=false, delay="0s" }){
  const maskId = `fen-${cx}-${cy}-${r}`;
  return (
    <g style={{ transform:`scale(${scale})`, transformOrigin:"200px 200px", animationDelay:delay }}>
      <defs>
        <mask id={maskId}>
          <circle cx={cx} cy={cy} r={r} fill="#fff"/>
          {fenestrated && Array.from({length: 6}).map((_,i)=>(
            <ellipse key={i}
              cx={cx + (i%2 ?  r*0.22 : -r*0.18)}
              cy={cy + (i*7 - r*0.18)}
              rx={Math.max(3, r*0.06 + i*0.5)}
              ry={Math.max(2, r*0.03 + i*0.35)}
              fill="#000"
              transform={`rotate(${i%2?12:-8} ${cx} ${cy})`}
            />
          ))}
        </mask>
      </defs>
      <g className={className} mask={`url(#${maskId})`}>
        <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth="3"/>
        <path d={`M${cx} ${cy} c0 ${r*0.5} -${r*0.35} ${r*0.6} -${r*0.6} ${r*0.7}`}
              stroke={vein} strokeWidth="4" fill="none" opacity=".55"/>
      </g>
    </g>
  );
}

function Face({ mood, night }){
  return (
    <g transform="translate(0,10)" style={{opacity: night? .6 : 1}}>
      {/* oči s odleskom */}
      <g className="blink-eye">
        <circle cx="170" cy="190" r="6" fill="#121518"/>
        <circle cx="210" cy="190" r="6" fill="#121518"/>
        <circle cx="168" cy="188" r="2" fill="#fff" opacity=".9"/>
        <circle cx="208" cy="188" r="2" fill="#fff" opacity=".9"/>
      </g>
      {/* ústa podľa nálady */}
      {mood==="sad" ? (
        <path d="M170 206 q20 -14 40 0" stroke="#121518" strokeWidth="5" fill="none" strokeLinecap="round" className="mouth-talk"/>
      ) : mood==="happy" ? (
        <path d="M170 200 q20 12 40 0" stroke="#121518" strokeWidth="5" fill="none" strokeLinecap="round" className="mouth-talk"/>
      ) : (
        <path d="M170 202 q20 0 40 0" stroke="#121518" strokeWidth="5" fill="none" strokeLinecap="round"/>
      )}
    </g>
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
