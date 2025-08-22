// src/components/MonsteraLeafLottie.jsx
import { useEffect, useRef } from "react";
import Lottie from "lottie-react";
import monsteraAnim from "@/anim/monstera-leaf.json"; // import JSON priamo

export default function MonsteraLeafLottie({
  size = 260,
  order = 0,         // poradie listu (0…)
  level = 1,         // pre veľkosť
}) {
  const boxRef = useRef(null);

  // vypočítame mierku podľa levelu a order
  const baseScale = 0.55 + Math.min(level, 10) * 0.045 + order * 0.04;

  // pozície okolo stredu zeminy (vejárovito)
  const angle = (-25 + order * 14) * (Math.PI / 180);
  const radius = 40 + order * 12;
  const x = Math.cos(angle) * radius;
  const y = -Math.sin(angle) * radius;

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.style.transformOrigin = "50% 100%";
      boxRef.current.animate(
        [
          { transform: `scale(${baseScale - 0.18})` },
          { transform: `scale(${baseScale})` },
        ],
        {
          duration: 800,
          easing: "cubic-bezier(.2,.9,.2,1)",
          fill: "forwards",
          delay: order * 140,
        }
      );
    }
  }, [baseScale, order]);

  return (
    <div
      style={{
        position: "absolute",
        left: `calc(50% + ${x}px - ${size / 2}px)`,
        top: `calc(64% + ${y}px - ${size}px)`,
        width: size,
        height: size,
        pointerEvents: "none",
      }}
    >
      <div ref={boxRef} style={{ width: "100%", height: "100%" }}>
        <Lottie
          animationData={monsteraAnim}
          loop
          autoplay
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}
