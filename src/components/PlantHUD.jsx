import { useEffect, useMemo, useState } from "react";
import ActionButton from "./ActionButton";
import { askNotifyPermission, scheduleNotification } from "@/lib/reminders";
// vo funkcii water():
askNotifyPermission().then(ok=>{
  if(ok) scheduleNotification("Greenbuddy", "Čas zaliať 🌿", 2*24*60*60*1000);
});
const COOLDOWNS = {
  water: 2*24*60*60,       // 2 dni
  fertilize: 14*24*60*60,  // 14 dní
  spray: 24*60*60,         // 1 deň
  repot: 90*24*60*60       // 90 dní
};

export default function PlantHUD({ state, setState }){
  const [last,setLast] = useState(()=>JSON.parse(localStorage.getItem("gb_lastActs")||"{}"));
  useEffect(()=>localStorage.setItem("gb_lastActs", JSON.stringify(last)),[last]);

  function stamp(k){ setLast(v=>({ ...v, [k]: Date.now() })); }

  const water = ()=>{ if(!can("water")) return; stamp("water"); setState(s=>({...s, hydration: Math.min(100, s.hydration+25)})); };
  const fertilize = ()=>{ if(!can("fertilize")) return; stamp("fertilize"); setState(s=>({...s, nutrients: Math.min(100, s.nutrients+20)})); };
  const spray = ()=>{ if(!can("spray")) return; stamp("spray"); setState(s=>({...s, spray: Math.min(100, (s.spray||0)+20)})); };
  const repot = ()=>{ if(!can("repot")) return; stamp("repot"); setState(s=>({...s, pot: (s.pot||0)+1 })); };

  function can(k){ const ts=last[k]; if(!ts) return true; return Date.now()-ts >= (COOLDOWNS[k]*1000); }

 import ActionButton from "./ActionButton";
import { WaterIcon, FertilizerIcon, SprayIcon, RepotIcon } from "@/components/icons/PlantIcons";
// ...
<div style={{display:"grid",gap:12,gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))"}}>
  <ActionButton icon={<WaterIcon/>}      label="Gießen"  /* ... */ onClick={water}/>
  <ActionButton icon={<FertilizerIcon/>} label="Düngen"  /* ... */ onClick={fertilize}/>
  <ActionButton icon={<SprayIcon/>}      label="Sprühen" /* ... */ onClick={spray}/>
  <ActionButton icon={<RepotIcon/>}      label="Umtopfen"/* ... */ onClick={repot}/>
</div> 
