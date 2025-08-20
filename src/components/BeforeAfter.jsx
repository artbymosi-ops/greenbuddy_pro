// src/components/BeforeAfter.jsx
import { useState } from "react";

/**
 * props:
 *  - beforeUrl, afterUrl (string)
 *  - height (CSS) optional
 */
export default function BeforeAfter({ beforeUrl, afterUrl, height = 280 }) {
  const [val, setVal] = useState(50); // percent

  if (!beforeUrl || !afterUrl) return null;

  return (
    <div className="ba-wrap" style={{height}}>
      <img src={beforeUrl} alt="Vorher" className="ba-img" />
      <div className="ba-after" style={{ width: `${val}%` }}>
        <img src={afterUrl} alt="Nachher" className="ba-img" />
      </div>
      <input className="ba-range" type="range" min="0" max="100" value={val} onChange={e=>setVal(e.target.value)} />
      <div className="ba-labels">
        <span>Vorher</span>
        <span>Nachher</span>
      </div>
    </div>
  );
}
