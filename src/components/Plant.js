import { useMemo } from 'react'

export default function Plant({ level=1, mood='neutral', pests=false, disease=false }) {
  const leavesCount = Math.min(8, Math.floor(2 + level))
  const scale = Math.min(1.25, 0.85 + level * 0.05)
  const droop = mood === 'sad' ? 12 : mood === 'neutral' ? 4 : 0
  const bounce = mood === 'happy' ? 'plant-bounce 2.2s ease-in-out infinite' : 'none'

  const leaves = useMemo(() => {
    const arr = []
    for (let i = 0; i < leavesCount; i++) {
      const angle = -35 + (i * (70/(leavesCount-1 || 1)))
      const x = 120 + Math.cos(angle*Math.PI/180) * 55
      const y = 140 + Math.sin(angle*Math.PI/180) * (30 + i*1.5)
      const r = 28 + (i%3)*4
      arr.push({ x, y, r, angle })
    }
    return arr
  }, [leavesCount])

  return (
    <div className="card center" style={{width:'min(540px, 90vw)', height:360, transform:`scale(${scale})`, transformOrigin:'center top'}}>
      <style jsx>{`
        @keyframes sway { 0% { transform: rotate(${mood==='sad'? -2: -1}deg); } 50% { transform: rotate(${mood==='sad'? 2: 1}deg); } 100% { transform: rotate(${mood==='sad'? -2: -1}deg); } }
        @keyframes plant-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        .shadow { filter: blur(12px); opacity:.25 }
        .leaf { transition: filter .2s ease; } .leaf:hover { filter: brightness(1.1); }
        .spots { pointer-events: none; }
      `}</style>

      <svg viewBox="0 0 260 220" width="100%" height="100%" style={{display:'block', animation: bounce}}>
        <ellipse className="shadow" cx="130" cy="210" rx="90" ry="10" fill="#000" />
        <g>
          <rect x="70" y="152" width="120" height="46" rx="8" fill="#6b4a3a"/>
          <rect x="60" y="144" width="140" height="16" rx="8" fill="#8a5d48"/>
          <ellipse cx="130" cy="152" rx="70" ry="12" fill="#4d362c"/>
        </g>
        <g style={{transformOrigin:'130px 80px', animation:'sway 4s ease-in-out infinite'}}>
          <rect x="126" y="84" width="8" height={68 - droop} rx="5" fill="#2a7c4c"/>
          <rect x="126" y={84 + (68 - droop)} width="8" height={droop} rx="5" fill="#1c5a35" opacity="0.9"/>
          {leaves.map((L, idx) => (
            <g key={idx} transform={`translate(${L.x},${L.y - droop/2}) rotate(${L.angle})`}>
              <path className="leaf"
                d={`M 0 0 C ${-L.r*0.9} ${-L.r*0.2}, ${-L.r*0.8} ${-L.r*1.2}, 0 ${-L.r}
                   C ${L.r*0.8} ${-L.r*1.2}, ${L.r*0.9} ${-L.r*0.2}, 0 0 Z`}
                fill={disease ? '#53b067' : '#38a36a'} stroke="#1b6b43" strokeWidth="2"/>
              <path d={`M 0 ${-L.r*0.7} c -6 4 -12 10 -14 16`} stroke="#185b38" strokeWidth="2" fill="none"/>
              <path d={`M 0 ${-L.r*0.9} c 8 6 14 12 16 20`} stroke="#185b38" strokeWidth="2" fill="none"/>
              {pests && idx%2===0 && (<g className="spots"><circle r="2.2" cx={L.r*0.3} cy={-L.r*0.3} fill="#f6d37c"/><circle r="1.8" cx={-L.r*0.2} cy={-L.r*0.15} fill="#efbf6b"/></g>)}
              {disease && (<g className="spots" opacity="0.65"><circle r="5" cx={-L.r*0.15} cy={-L.r*0.55} fill="#d3e06e"/><circle r="4" cx={L.r*0.2} cy={-L.r*0.35} fill="#c1d65a"/></g>)}
            </g>
          ))}
        </g>
        <g transform="translate(0,0)">
          {mood==='happy' && (<><circle cx="100" cy="168" r="3" fill="#0a0a0a"/><circle cx="160" cy="168" r="3" fill="#0a0a0a"/><path d="M108 178 q22 12 44 0" stroke="#0a0a0a" strokeWidth="3" fill="none" strokeLinecap="round"/></>)}
          {mood==='neutral' && (<><circle cx="100" cy="168" r="3" fill="#0a0a0a"/><circle cx="160" cy="168" r="3" fill="#0a0a0a"/><line x1="116" y1="180" x2="148" y2="180" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round"/></>)}
          {mood==='sad' && (<><circle cx="100" cy="168" r="3" fill="#0a0a0a"/><circle cx="160" cy="168" r="3" fill="#0a0a0a"/><path d="M108 188 q22 -12 44 0" stroke="#0a0a0a" strokeWidth="3" fill="none" strokeLinecap="round"/></>)}
        </g>
      </svg>
    </div>
  )
}
