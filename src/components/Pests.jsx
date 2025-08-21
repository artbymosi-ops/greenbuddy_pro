import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Pests overlay
 * Props:
 *  - danger (number 0–100): vyššia hodnota => väčšia šanca na výskyt
 *  - sprayFlag (number): inkrementuj po použití spreja (vyčistí škodcov)
 */
export default function Pests({ danger=0, sprayFlag=0, onAnyRemoved }){
  const [pests, setPests] = useState([]); // {id,type,x,y,anim}
  const idc = useRef(1);

  // spawn logika – každých ~15s šanca podľa „danger“
  useEffect(()=>{
    const t = setInterval(()=>{
      const chance = Math.min(70, Math.max(0, danger)); // cap
      if (Math.random()*100 < chance/3){ // pár percent
        spawn();
      }
    }, 15000);
    return ()=>clearInterval(t);
  },[danger]);

  // po spreji zmaž všetkých
  useEffect(()=>{
    if(!sprayFlag) return;
    setPests([]);
  },[sprayFlag]);

  function spawn(){
    const type = Math.random()<0.65 ? "aphid" : "spider";
    const x = 30 + Math.random()*70; // %
    const y = 20 + Math.random()*60; // %
    const anim = Math.random()<0.5 ? "driftA" : "driftB";
    setPests(p=>[...p, { id:idc.current++, type, x, y, anim }]);
  }
  function squish(id){
    setPests(p=>p.filter(q=>q.id!==id));
    onAnyRemoved?.();
  }

  return (
    <div className="pests-layer">
      {pests.map(p=>(
        <div
          key={p.id}
          className={`pest ${p.type} ${p.anim}`}
          style={{ left:`${p.x}%`, top:`${p.y}%` }}
          onClick={()=>squish(p.id)}
          title={p.type==="aphid"?"Voška":"Pavúčik"}
        />
      ))}
    </div>
  );
}
