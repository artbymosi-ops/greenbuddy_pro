import { useEffect, useMemo, useRef } from 'react';

export default function Plant({ mood='happy', level=1, onBlink }) {
  const faceRef = useRef(null);
  useEffect(()=>{ // malé žmurknutie občas
    const t = setInterval(()=>{
      if(faceRef.current){ faceRef.current.classList.add('blink'); setTimeout(()=>faceRef.current?.classList.remove('blink'),120); }
    }, 3000 + Math.random()*2000);
    return ()=>clearInterval(t);
  },[]);

  const scale = useMemo(()=> 1 + (level-1)*0.04, [level]);

  const fillLeaf = mood==='sad' ? '#86a87d' : '#37b279';
  const fillPot  = '#5c3f32';

  return (
    <div className="plant grow" style={{transform:`scale(${scale})`}}>
      <svg width="320" height="260" viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Monstera">
        {/* tieň */}
        <ellipse cx="160" cy="230" rx="110" ry="18" fill="black" opacity=".25"/>
        {/* kvetináč */}
        <rect x="60" y="150" width="200" height="54" rx="14" fill={fillPot}/>
        <rect x="50" y="140" width="220" height="16" rx="8" fill="#7b5646"/>
        {/* stonka */}
        <rect x="156" y="90" width="8" height="60" rx="4" fill="#2e8a55"/>
        {/* listy (monstera tvar – zjednodušené) */}
        <g>
          <path d="M130 110c-30-40 30-70 58-40 20 22-15 52-30 56-12 4-28-4-28-16z" fill={fillLeaf}/>
          <path d="M196 120c10-28 52-26 62 2 10 30-34 48-54 36-14-8-14-30-8-38z" fill={fillLeaf}/>
          <path d="M168 100c-8-24 24-42 44-26 22 18-2 44-18 46-12 2-22-6-26-20z" fill={fillLeaf}/>
        </g>
        {/* tvár */}
        <g transform="translate(0,10)">
          <circle cx="125" cy="198" r="4" fill="#211a19"/>
          <circle ref={faceRef} cx="195" cy="198" r="4" fill="#211a19"/>
          <path d="M140 210c8 10 32 10 40 0" stroke="#211a19" strokeWidth="4" strokeLinecap="round"/>
        </g>
      </svg>
    </div>
  );
}
