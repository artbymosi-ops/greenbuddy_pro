// src/components/Plant2D.jsx
import { useEffect, useMemo, useState } from "react";
import MonsteraLeafLottie from "@/components/MonsteraLeafLottie";
import PotBuddy from "@/components/PotBuddy";

/**
 * 2D rastlinka:
 * - listy vyrastajú od stopky (MonsteraLeafLottie to rieši rastom + segmentami)
 * - počet listov rastie s levelom/size
 * - listy sú orezané na „scéne“, aby nepretŕčali mimo kvetináča
 * - PotBuddy má oči/ústa, žmurká a „hovorí“ podľa lastAction
 */
export default function Plant2D({
  state = { level: 1, mood: "happy", size: 0 },
  lastAction = null,
}) {
  const level = state?.level ?? 1;
  const sizeStage = 460;           // výška scény
  const potSize = 300;

  // koľko listov – podľa size (ak je) alebo levelu
  const nLeaves = useMemo(() => {
    const base = state?.size ?? Math.max(0, level - 1);
    return Math.min(1 + Math.floor(base / 1) + 1, 7); // 2..7 listov
  }, [level, state?.size]);

  // pripravené offsety pre X (cyklujú sa ak je viac listov)
  const leafOffsets = useMemo(
    () => [-120, -60, 0, 60, 120, -30, 90],
    []
  );

  // bublina „reči“ – text podľa poslednej akcie
  const [speech, setSpeech] = useState("");
  useEffect(() => {
    if (!lastAction) return;
    const lines = {
      water: "Danke fürs Gießen! 💧",
      feed: "Lecker Dünger! 🌱",
      spray: "Ahh, erfrischend! 🌫️",
      repot: "Neues Zuhause, juhu! 🪴",
    };
    setSpeech(lines[lastAction] ?? "");
    const t = setTimeout(() => setSpeech(""), 2600);
    return () => clearTimeout(t);
  }, [lastAction]);

  return (
    <div className="plantWrap">
      <div className="stage">
        {/* LISTY – postupne väčšie a s oneskorením */}
        {Array.from({ length: nLeaves }).map((_, i) => {
          const base = 220;           // počiatočná veľkosť
          const inc = 36;             // prírastok veľkosti na ďalší list
          const size = base + i * inc;
          const x = leafOffsets[i % leafOffsets.length];
          const delay = i * 240;      // kaskádový nástup
          const flip = i % 2 === 1;
          return (
            <MonsteraLeafLottie
              key={i}
              size={size}
              x={x}
              y={-90}
              delay={delay}
              growFrom={0.65}
              growTo={1}
              speed={0.95}
              flip={flip}
            />
          );
        })}

        {/* KVETINÁČ s tváričkou – ostáva na mieste, môže „hovoriť“ */}
        <PotBuddy size={potSize} mood={state?.mood ?? "happy"} speak={speech} />
      </div>

      <style jsx>{`
        .plantWrap {
          width: min(560px, 94vw);
          margin: 0 auto;
        }
        .stage {
          position: relative;
          height: ${sizeStage}px;
          /* dôležité: listy nepreliezajú mimo „scénu“,
             ale spodok necháme jemne otvorený pre vyrastanie */
          overflow: hidden;
          /* trochu „vyrežeme“ vnútro tak, aby listy vizuálne vychádzali od stopky
             a nepretŕčali cez horný okraj črepníka */
          clip-path: inset(-40px 0 70px 0);
          background: radial-gradient(120% 130% at 50% 0%,
            rgba(233,247,237,.35) 0%,
            rgba(244,251,246,.2) 60%,
            rgba(247,255,249,.15) 100%);
          border-radius: 24px;
        }
      `}</style>
    </div>
  );
}
