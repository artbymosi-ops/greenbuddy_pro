// pages/demo-2d-vs-3d.js
import { useState } from "react";
import Plant2D from "@/components/Plant2D";
import Plant3D from "@/components/Plant3D";

export default function Demo() {
  const [tab, setTab] = useState("2d");
  return (
    <main className="container" style={{padding:16}}>
      <h1>Greenbuddy – 2D vs 3D</h1>
      <div style={{display:"flex", gap:8, marginBottom:12}}>
        <button className={`btn ${tab==="2d"?"":"ghost"}`} onClick={()=>setTab("2d")}>🌿 2D</button>
        <button className={`btn ${tab==="3d"?"":"ghost"}`} onClick={()=>setTab("3d")}>🌱 3D</button>
      </div>
      <div className="card">{tab==="2d" ? <Plant2D/> : <Plant3D/>}</div>
    </main>
  );
  }
