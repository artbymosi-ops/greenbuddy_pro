// src/components/MonsteraLeafLottie.jsx
import { useEffect, useRef } from "react";
import lottie from "lottie-web";

/**
 * List vyrastá od stopky:
 * - najprv odohrá segment 19–49 (uncurl),
 * - potom zapne loop len 78–88 (jemné hojdanie),
 * - zároveň zväčšíme kontajner scale: 0.7 -> 1.0 (rast).
 */
export default function MonsteraLeafLottie({
  src = "/anim/monstera-leaf.json",
  size = 320,
  x = 0,
  y = -60,          // trochu hore, aby vyzeral že ide z črepníka
  speed = 1,
  growFrom = 0.7,   // počiatočné zväčšenie
  growTo = 1.0,     // cieľ
  delay = 0,        // oneskorenie spustenia (pri viacerých listoch)
  flip = false,
}) {
  const boxRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (!boxRef.current) return;

    const anim = lottie.loadAnimation({
      container: boxRef.current,
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: src,
      rendererSettings: { progressiveLoad: true },
    });
    animRef.current = anim;
    anim.setSpeed(speed);

    // rast kontajnera (CSS), kotva dole – „od stopky“
    const host = boxRef.current;
    host.style.transformOrigin = "50% 100%";
    host.animate(
      [
        { transform: `scale(${growFrom})` },
        { transform: `scale(${growTo})` },
      ],
      { duration: 800, delay, easing: "cubic-bezier(.2,.9,.2,1)", fill: "forwards" }
    );

    // 1) uncurl
    const t1 = setTimeout(() => {
      anim.playSegments([19, 49], true);
    }, delay);

    // 2) po uncurl -> krátke hojdanie (skrátený segment)
    const onComplete = () => {
      anim.removeEventListener("complete", onComplete);
      anim.loop = true;
      anim.playSegments([78, 88], true);   // skrátené, menej ohybu
      anim.setSpeed(0.9);
    };
    anim.addEventListener("complete", onComplete);

    return () => {
      clearTimeout(t1);
      try { anim.destroy(); } catch {}
    };
  }, [src, speed, delay, growFrom, growTo]);

  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        left: `calc(50% + ${x}px - ${size / 2}px)`,
        top: `calc(100% - ${size}px + ${y}px)`, // ukotvené k spodku stage
        transform: flip ? "scaleX(-1)" : "none",
        pointerEvents: "none",
      }}
    >
      <div ref={boxRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
