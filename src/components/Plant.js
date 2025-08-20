import { useEffect, useMemo, useState } from "react";
import styles from "@/styles/plant.module.css";

export default function Plant({ state, action, onAnimEnd, pulse=false }) {
  const { hydration, nutrients, spray, level=1, xp=0, mood="happy", size=0 } = state || {};
  const [runFx, setRunFx] = useState(false);

  // urč počet lístkov podľa „veľkosti“
  const leaves = useMemo(() => Math.min(2 + (size ?? 0), 5), [size]);
  // mierne zväčšovanie rastliny pri leveloch
  const scale = useMemo(() => 0.9 + Math.min(0.12 * (size ?? 0), 0.5), [size]);

  useEffect(() => {
    if (!action) return;
    setRunFx(true);
    const t = setTimeout(() => {
      setRunFx(false);
      onAnimEnd?.();
    }, 1200);
    return () => clearTimeout(t);
  }, [action, onAnimEnd]);

  const cls = [
    styles.plant,
    action === "water" && styles.actionWater,
    action === "spray" && styles.actionSpray,
    action === "feed"  && styles.actionFeed,
    action === "repot" && styles.actionRepot,
    pulse && styles.pulse
  ].filter(Boolean).join(" ");

  const happy = mood !== "sad";

  return (
    <div className={cls} style={{ ["--scale"]: scale }}>
      {/* Level-up pulz */}
      {pulse && <div className={styles.ring} />}

      {/* FX overlaye */}
      {runFx && action === "water" && (
        <div className={styles.fxLayer}>
          {Array.from({length:7}).map((_,i)=>(<span key={i} className={styles.drop} style={{ ["--i"]: i }} />))}
        </div>
      )}
      {runFx && action === "spray" && (
        <div className={styles.fxLayer}><span className={styles.mist} /></div>
      )}
      {runFx && action === "feed" && (
        <div className={styles.fxLayer}>
          {Array.from({length:8}).map((_,i)=>(<span key={i} className={styles.sparkle} style={{ ["--i"]: i }} />))}
        </div>
      )}
      {runFx && action === "repot" && (
        <div className={styles.fxLayer}>
          {Array.from({length:6}).map((_,i)=>(<span key={i} className={styles.dust} style={{ ["--i"]: i }} />))}
        </div>
      )}

      {/* SVG rastlinka */}
      <svg className={styles.svg} viewBox="0 0 360 360" aria-label="Greenbuddy plant">
        {/* tieň */}
        <ellipse cx="180" cy="300" rx="120" ry="22" className={styles.shadow} />
        {/* kvetináč */}
        <g className={styles.pot}>
          <rect x="100" y="190" width="160" height="95" rx="26" />
          <rect x="80"  y="175" width="200" height="30" rx="20" />
          {/* tvárička */}
          <circle cx="155" cy="235" r="5" fill="var(--ink)" />
          <circle cx="205" cy="235" r="5" fill="var(--ink)" />
          {happy ? (
            <path d="M150 252 Q180 268 210 252" fill="none" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round"/>
          ) : (
            <path d="M150 262 Q180 246 210 262" fill="none" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round"/>
          )}
        </g>

        {/* stonka */}
        <rect x="176" y="150" width="8" height="48" rx="4" className={styles.stem}/>

        {/* lístky – dynamický počet */}
        <g className={styles.leaves}>
          {Array.from({length:leaves}).map((_,i)=>(
            <g key={i} className={`${styles.leaf} ${styles['leaf'+((i%3)+1)]}`}>
              <ellipse cx={180 + (i-1)*28} cy={150 - (i%2)*12} rx="62" ry="44" />
              <path d={`M ${180+(i-1)*28-36} ${150-(i%2)*12}
                        C ${180+(i-1)*28-10} ${130-(i%2)*12},
                          ${180+(i-1)*28+10} ${170-(i%2)*12},
                          ${180+(i-1)*28+36} ${150-(i%2)*12}`}
                    fill="none" stroke="rgba(0,0,0,.25)" strokeWidth="3" strokeLinecap="round"/>
            </g>
          ))}
        </g>
      </svg>

      {/* panel so štatmi (voliteľné – nechávam na stránku) */}
      <div className={styles.meta}>
        <div className={styles.badge}>Stimmung: {happy ? "happy" : "sad"}</div>
        <div className={styles.badge}>Level {level} • XP {xp}/{level*40}</div>
      </div>
    </div>
  );
}
