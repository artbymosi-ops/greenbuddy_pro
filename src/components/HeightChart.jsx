// src/components/HeightChart.jsx
import { useMemo } from "react";

/**
 * props:
 *  - data: [{ date: 'YYYY-MM-DD' | ISO, height_cm: number }]
 *  - color: CSS color (optional)
 */
export default function HeightChart({ data = [], color = "var(--mosi-accent)" }) {
  const series = useMemo(() => {
    // zoradiť podľa datumu a odfiltrovať bez height
    const arr = (data || [])
      .filter(d => d.height_cm != null)
      .map(d => ({ t: new Date(d.date), y: Number(d.height_cm) }))
      .sort((a,b)=>a.t-b.t);
    if (arr.length === 0) return { pts: [], minY: 0, maxY: 0, minT: 0, maxT: 0 };

    const minY = Math.min(...arr.map(x=>x.y));
    const maxY = Math.max(...arr.map(x=>x.y));
    const minT = arr[0].t.getTime();
    const maxT = arr[arr.length-1].t.getTime() || (minT+1);

    // padding
    const padY = Math.max(1, (maxY - minY) * 0.1);
    const Y0 = minY - padY;
    const Y1 = maxY + padY;

    const width = 560, height = 180, left = 36, right = 10, top = 10, bottom = 22;
    const W = width - left - right, H = height - top - bottom;

    const x = (t) => {
      const a = (t - minT) / Math.max(1, (maxT - minT));
      return left + a * W;
    };
    const y = (v) => {
      const a = (v - Y0) / Math.max(1, (Y1 - Y0));
      return top + (1 - a) * H;
    };

    const pts = arr.map(p => ({ x: x(p.t.getTime()), y: y(p.y), raw: p }));

    return { pts, minY: Y0, maxY: Y1, minT, maxT, width, height, left, right, top, bottom };
  }, [data]);

  if (!series.pts.length) {
    return <div className="subtitle">Keine Messungen vorhanden.</div>;
  }

  const pathD = series.pts.map((p,i)=>`${i===0?'M':'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${series.width} ${series.height}`} width="100%" height="auto" className="card" style={{padding:12}}>
      {/* osi (len Y mriežka) */}
      <g opacity="0.25">
        {Array.from({length:4}).map((_,i)=>{
          const y = series.top + (i/3)*(series.height - series.top - series.bottom);
          return <line key={i} x1={series.left} x2={series.width - series.right} y1={y} y2={y} stroke="currentColor" strokeWidth="1" />
        })}
      </g>
      {/* čiara */}
      <path d={pathD} fill="none" stroke={color} strokeWidth="3" />
      {/* body */}
      {series.pts.map((p,i)=>(
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#fff" stroke={color} strokeWidth="3" />
      ))}
    </svg>
  );
}
