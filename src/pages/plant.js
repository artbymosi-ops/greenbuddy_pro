import { useEffect, useMemo, useState } from "react";
import PotBuddy from "@/components/PotBuddy";
import MonsteraLeafLottie from "@/components/MonsteraLeafLottie";

export default function Plant2D({ state, lastAction }) {
  const { level, hydration, nutrients, spray, mood } = state;

  // meno (bez SSR chyby)
  const [name, setName] = useState("Monstera");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("gb_plant_name");
    if (saved) setName(saved);
  }, []);
  const saveName = (n) => {
    setName(n);
    if (typeof window !== "undefined") localStorage.setItem("gb_plant_name", n);
  };

  // hlášky
  const line = useMemo(() => {
    if (hydration < 30) return "Prosím napi ma 💧";
    if (nutrients < 30) return "Potrebujem živiny 🧪";
    if (spray < 30) return "Trochu sprchy by padlo vhod 🌫️";
    if (lastAction === "water") return "Ďakujem za vodu! 💦";
    if (lastAction === "feed") return "Mhmm… chutí! 🌱";
    if (lastAction === "spray") return "Osvieženie! ✨";
    if (lastAction === "repot") return "Nový domov, super! 🪴";
    return "Som Monstera a som šťastná 🌿";
  }, [hydration, nutrients, spray, lastAction]);

  // koľko listov (rastie s levelom)
  const leaves = Math.min(1 + Math.floor(level / 2), 8);

  return (
    <div className="stage">
      {/* bublina */}
      <div className="bubble">{line}</div>

      {/* listy (od stredu zeminy) */}
      {Array.from({ length: leaves }).map((_, i) => (
        <MonsteraLeafLottie key={i} order={i} level={level} size={300} />
      ))}

      {/* kvetináč s tváričkou – „rozpráva“, keď je bublina kritická alebo po akcii */}
      <PotBuddy
        size={260}
        mood={mood === "happy" ? "happy" : "sad"}
        talking={/Prosím|Potrebujem|Osvieženie|Ďakujem|Mhmm|Nový/.test(line)}
        name={name}
      />

      {/* meno – edit */}
      <div className="nameEdit">
        <input
          value={name}
          onChange={(e) => saveName(e.target.value)}
          aria-label="Názov rastlinky"
        />
      </div>

      <style jsx>{`
        .stage {
          position: relative;
          width: 100%;
          padding-top: 62%;
          background: #f4fbf6;
          border-radius: 18px;
          overflow: hidden;
        }
        .bubble {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 6%;
          background: #233a2f;
          color: #fff;
          padding: 10px 16px;
          border-radius: 999px;
          font-weight: 600;
          box-shadow: 0 10px 28px rgba(0,0,0,.12);
        }
        .nameEdit {
          position: absolute;
          top: 0; right: 8px;
        }
        .nameEdit input {
          background: #ffffffd8;
          border: 1px solid #dce8de;
          border-radius: 10px;
          padding: 6px 10px;
          font-weight: 700;
          width: 120px;
        }
      `}</style>
    </div>
  );
  }
