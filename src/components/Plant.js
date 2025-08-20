import { useEffect, useMemo, useRef } from "react";

export default function Plant({
  level = 1,
  xp = 0,
  mood = "happy",          // "happy" | "neutral" | "sad" | "wilt" | "dead"
  size = 1,                // 1.0 … 3.0 (škálovanie podľa levelu)
  action = null            // "water" | "spray" | "fertilize" | "repot" | null
}) {
  const potRef = useRef(null);

  // vyber tvár podľa nálady
  const face = useMemo(() => {
    switch (mood) {
      case "happy":
        return { eyes: "• •", mouth: "‿", color: "#58c26a" };
      case "neutral":
        return { eyes: "• •", mouth: "━", color: "#82c48a" };
      case "sad":
        return { eyes: "• •", mouth: "︶", color: "#b4cfae" };
      case "wilt":
        return { eyes: "• •", mouth: "︵", color: "#c7d9c1" };
      case "dead":
        return { eyes: "x x", mouth: "—", color: "#9aa39a" };
      default:
        return { eyes: "• •", mouth: "━", color: "#82c48a" };
    }
  }, [mood]);

  // krátka „pulse“ animácia pri akcii
  useEffect(() => {
    if (!action || !potRef.current) return;
    const el = potRef.current;
    el.classList.remove("pulse");
    // reflow hack, aby sa animácia vždy spustila
    void el.offsetWidth;
    el.classList.add("pulse");
  }, [action]);

  return (
    <div className="plant-wrap">
      <div
        className={`plant ${mood}`}
        style={{ transform: `scale(${size})` }}
        ref={potRef}
        aria-label={`Greenbuddy, Level ${level}, Stimmung ${mood}`}
      >
        {/* stonka */}
        <div className="stem" />
        {/* listy */}
        <div className="leaf leaf-a" />
        <div className="leaf leaf-b" />
        <div className="leaf leaf-c" />
        {/* kvetináč s tvárou */}
        <div className="pot">
          <div className="eyes">{face.eyes}</div>
          <div className="mouth">{face.mouth}</div>
        </div>

        {/* akčné efekty */}
        {action === "water" && <div className="effect water" />}
        {action === "spray" && <div className="effect spray" />}
        {action === "fertilize" && <div className="effect sparkles" />}
        {action === "repot" && <div className="effect dust" />}
      </div>

      <style jsx>{`
        .plant-wrap {
          display: grid;
          place-items: center;
          width: 100%;
          padding: 12px 0 20px;
        }
        .plant {
          position: relative;
          width: 220px;
          height: 210px;
          filter: drop-shadow(0 16px 22px rgba(0,0,0,.18));
          transition: transform .4s cubic-bezier(.2,.8,.2,1);
        }
        .plant.happy .leaf { filter: saturate(1.1); }
        .plant.sad .leaf { filter: saturate(.85); }
        .plant.wilt .leaf { transform: rotate(18deg) translateY(8px); filter: saturate(.75) brightness(.95); }
        .plant.dead .leaf { filter: grayscale(.8) brightness(.9); }

        .pulse { animation: pulse .5s ease-out; }
        @keyframes pulse { 0%{ transform: scale(1) } 50%{ transform: scale(1.05) } 100%{ transform: scale(1) } }

        .stem {
          position: absolute; left: 106px; bottom: 88px;
          width: 10px; height: 78px; background: #2f8b57; border-radius: 6px;
        }

        .leaf {
          position: absolute; bottom: 105px;
          width: 86px; height: 64px; background: ${face.color};
          border-radius: 60px 60px 60px 60px / 44px 44px 44px 44px;
          box-shadow: inset 0 0 0 4px rgba(0,0,0,.06);
        }
        .leaf-a { left: 58px; transform: rotate(-16deg); }
        .leaf-b { left: 92px; transform: rotate(6deg); }
        .leaf-c { left: 120px; transform: rotate(22deg); }

        .pot {
          position: absolute; bottom: 0; left: 22px; right: 22px;
          height: 86px; background: #6b4a3b; border-radius: 18px 18px 22px 22px;
        }
        .eyes, .mouth {
          position: absolute; left: 0; right: 0; text-align: center;
          color: #111; font-weight: 700; font-size: 18px; letter-spacing: 6px;
        }
        .eyes { bottom: 48px; }
        .mouth { bottom: 28px; letter-spacing: 0; }

        .effect {
          position: absolute; inset: 0; pointer-events: none;
        }
        .effect.water::after {
          content: "";
          position: absolute; left: 0; right: 0; top: -6px; margin: 0 auto;
          width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent;
          border-top: 18px solid #4aa3ff; opacity: 0; animation: drop .7s ease-out forwards;
        }
        @keyframes drop {
          0% { transform: translateY(-30px); opacity: 0 }
          50% { opacity: 1 }
          100% { transform: translateY(65px); opacity: 0 }
        }

        .effect.spray { background: radial-gradient(circle at 50% 20%, rgba(170,220,255,.7), transparent 35%); animation: puff .6s ease-out both; }
        @keyframes puff { from { opacity: .0; transform: scale(.9) } to { opacity: .9; transform: scale(1.05) } }

        .effect.sparkles {
          --c: radial-gradient(circle, #ffe38a 20%, transparent 22%);
          background:
            var(--c) 40% 30%/8px 8px no-repeat,
            var(--c) 60% 40%/10px 10px no-repeat,
            var(--c) 50% 20%/6px 6px no-repeat;
          animation: twinkle .9s ease-in-out both;
        }
        @keyframes twinkle { 0% { opacity: 0 } 40% { opacity: 1 } 100% { opacity: 0 } }

        .effect.dust { background: radial-gradient(300px 120px at 50% 80%, rgba(0,0,0,.12), transparent 60%); animation: dust .5s ease-out both; }
        @keyframes dust { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
    </div>
  );
}
