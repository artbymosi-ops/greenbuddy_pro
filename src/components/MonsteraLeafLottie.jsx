// src/components/MonsteraLeafLottie.jsx
import { useEffect, useRef } from "react";

export default function MonsteraLeafLottie({
  src = "/anim/monstera-leaf.json",
  size = 260,
  order = 0,
  level = 1,
}) {
  const boxRef = useRef(null);

  useEffect(() => {
    let anim;

    (async () => {
      // dynamicky import -> iba v prehliadači
      const lottie = (await import("lottie-web")).default;

      const box = boxRef.current;
      if (!box) return;

      anim = lottie.loadAnimation({
        container: box,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: src,
      });

      box.style.transformOrigin = "50% 100%";
      const baseScale = 0.55 + Math.min(level, 10) * 0.045 + order * 0.04;

      box.animate(
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

      setTimeout(() => anim.playSegments([19, 49], true), order * 120);

      const onComplete = () => {
        anim.removeEventListener("complete", onComplete);
        anim.loop = true;
        anim.playSegments([78, 88], true);
        anim.setSpeed(0.9);
      };
      anim.addEventListener("complete", onComplete);
    })();

    return () => {
      try {
        anim?.destroy();
      } catch {}
    };
  }, [src, level, order]);

  const angle = (-25 + order * 14) * (Math.PI / 180);
  const radius = 40 + order * 12;
  const x = Math.cos(angle) * radius;
  const y = -Math.sin(angle) * radius;

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
      <div ref={boxRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
