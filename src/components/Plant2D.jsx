import { useEffect, useMemo, useRef, useState } from "react";
import PotBuddy from "@/components/PotBuddy";
import MonsteraLeafLottie from "@/components/MonsteraLeafLottie";

export default function Plant2D({ state, lastAction }) {
  // meno – čítaj až na klientovi
  const [name, setName] = useState("Monstera");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("gb_plant_name");
    if (saved) setName(saved);
  }, []);
  const saveName = (v) => {
    setName(v);
    if (typeof window !== "undefined") localStorage.setItem("gb_plant_name", v);
  };

  // rozprávanie pri akciách
  const [talk, setTalk] = useState(false);
  useEffect(() => {
    if (!lastAction) return;
    setTalk(true);
    const t = setTimeout(() => setTalk(false), 900);
    return () => clearTimeout(t);
  }, [lastAction]);

  // listy – koľko ich zobraziť podľa levelu
  const leavesCount = Math.min(1 + Math.floor((state.level - 1) / 1), 7);

  return (
    <div className="stage">
      {/* bublina + meno */}
      <div className="bubble">{pickLine(state, lastAction)}</div>
      <div className="name">
        <input value={name} onChange={(e) => saveName(e.target.value)} />
      </div>

      {/* listy (pod tvárou) */}
      <div className="leaves">
        {Array.from({ length: leavesCount }).map((_, i) => (
          <MonsteraLeafLottie key={i} order={i} level={state.level}
            soilCenter={{ xPct: 50, yPct: 64 }} size={260}/>
        ))}
      </div>

      {/* črepník s tvárou navrchu */}
      <div className="pot">
        <PotBuddy size={260} talk={talk} mood={state.mood}/>
      </div>

      <style jsx>{`
        .stage {
          position: relative;
          width: min(480px, 92vw);
          height: 360px;
          margin: 0 auto;
          border-radius: 24px;
          background: #f5fbf7;
          overflow: hidden;
        }
        .leaves {
          position: absolute; inset: 0;
          /* maska: nech je vidno hlavne to, čo vyrastie nad zeminou */
          -webkit-mask-image: radial-gradient(120% 90% at 50% 64%, #000 48%, rgba(0,0,0,0) 52%);
          mask-image: radial-gradient(120% 90% at 50% 64%, #000 48%, rgba(0,0,0,0) 52%);
        }
        .pot { position: absolute; left: 50%; bottom: 18px; transform: translateX(-50%); }

        .bubble {
          position: absolute; left: 20px; top: 16px;
          max-width: calc(100% - 140px);
          background: #223a2e; color: #fff;
          padding: 10px 14px; border-radius: 18px;
          box-shadow: 0 8px 20px rgba(0,0,0,.12);
          font-weight: 600; line-height: 1.22;
        }
        .name {
          position: absolute; right: 16px; top: 12px;
        }
        .name input {
          border: 0; outline: 0; background: #fff; padding: 6px 12px;
          border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,.08);
          font-weight: 700; min-width: 120px;
        }
      `}</style>
    </div>
  );
}

function pickLine(st, action) {
  if (action === "water") return "Ďakujem, super napitá! 💧";
  if (action === "feed")  return "Mmm… chutí! 🌱";
  if (action === "spray") return "Osvieženie! ✨";
  if (action === "repot") return "Nový domov, super! 🪴";
  if (st.hydration < 30) return "Prosím napiť 💧";
  if (st.nutrients < 30) return "Potrebujem živiny 🌿";
  if (st.spray < 30) return "Trochu rosiť? 🌫️";
  return "Som Monstera a som šťastná 🌿";
}
