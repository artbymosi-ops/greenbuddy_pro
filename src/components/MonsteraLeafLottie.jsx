import { useEffect, useRef } from "react";

export default function MonsteraLeafLottie({
  src = "/anim/monstera-leaf.json",
  size = 240,
  order = 0,
  level = 1,
  soilCenter = { xPct: 50, yPct: 64 }, // kde je zemina v kontajneri (percentá)
}) {
  const boxRef = useRef(null);

  useEffect(() => {
    let anim;
    const run = async () => {
      if (!window.lottie) {
        await new Promise((r) => {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js";
          s.onload = r;
          document.body.appendChild(s);
        });
      }
      const lottie = window.lottie;
      const box = boxRef.current;
      if (!box) return;

      anim = lottie.loadAnimation({
        container: box,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: src,
      });

      // jemný „rast“ od stopky
      const base = 0.55 + Math.min(level, 10) * 0.045 + order * 0.04;
      box.style.transformOrigin = "50% 100%";
      box.animate(
        [{ transform: `scale(${base - 0.18})` }, { transform: `scale(${base})` }],
        { duration: 800, easing: "cubic-bezier(.2,.9,.2,1)", fill: "forwards", delay: order * 140 }
      );

      setTimeout(() => anim.playSegments([19, 49], true), order * 120);
      const onComplete = () => {
        anim.removeEventListener("complete", onComplete);
        anim.loop = true;
        anim.playSegments([78, 88], true); // skrátený hojda segment
        anim.setSpeed(0.9);
      };
      anim.addEventListener("complete", onComplete);
    };
    run();

    return () => {
      try { anim?.destroy(); } catch {}
    };
  }, [src, level, order]);

  // vejárovité rozloženie okolo stredu zeminy
  const angle = (-28 + order * 14) * (Math.PI / 180);
  const radius = 34 + order * 12;
  const x = Math.cos(angle) * radius;
  const y = -Math.sin(angle) * radius;

  return (
    <div
      style={{
        position: "absolute",
        // ukotvenie do stredu zeminy
        left: `calc(${soilCenter.xPct}% + ${x}px - ${size / 2}px)`,
        top: `calc(${soilCenter.yPct}% + ${y}px - ${size}px)`,
        width: size,
        height: size,
        pointerEvents: "none",
      }}
    >
      <div ref={boxRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
