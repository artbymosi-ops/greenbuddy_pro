  // src/components/MonsteraLeafLottie.jsx
import { useEffect, useRef } from "react";

/**
 * List vyrastá od stopky:
 * - odohrá segment 19–49 (uncurl),
 * - potom zapne loop 78–88 (jemné hojdanie skrátené),
 * - zároveň zväčšíme kontajner scale: growFrom -> growTo (rast).
 * Všetko beží bez npm, Lottie sa načíta z CDN.
 */
export default function MonsteraLeafLottie({
  src = "/anim/monstera-leaf.json",
  size = 320,
  x = 0,
  y = -60,        // posun hore, aby vizuálne vyrastal z črepníka
  speed = 1,
  growFrom = 0.7, // počiatočná mierka
  growTo = 1.0,   // cieľová mierka
  delay = 0,
  flip = false,
}) {
  const boxRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    let disposed = false;

    // 1) načítanie lottie-web z CDN (ak už je v okne, hneď ho použijeme)
    const loadLottie = () =>
      new Promise((resolve) => {
        if (window.lottie) return resolve(window.lottie);
        const id = "lottie-web-cdn";
        if (document.getElementById(id)) {
          // už sa načítava – počkáme na window.lottie
          const iv = setInterval(() => {
            if (window.lottie) {
              clearInterval(iv);
              resolve(window.lottie);
            }
          }, 30);
          return;
        }
        const s = document.createElement("script");
        s.id = id;
        s.src =
          "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js";
        s.onload = () => resolve(window.lottie);
        document.head.appendChild(s);
      });

    (async () => {
      const lottie = await loadLottie();
      if (disposed || !boxRef.current) return;

      // 2) init animácie
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

      // 3) „rast od stopky“ – CSS scale s kotvou dole
      const host = boxRef.current;
      host.style.transformOrigin = "50% 100%";
      host.animate(
        [{ transform: `scale(${growFrom})` }, { transform: `scale(${growTo})` }],
        {
          duration: 800,
          delay,
          easing: "cubic-bezier(.2,.9,.2,1)",
          fill: "forwards",
        }
      );

      // 4) spusti uncurl segment
      const t1 = setTimeout(() => anim.playSegments([19, 49], true), delay);

      // 5) po uncurl -> skrátené jemné hojdanie (menej deformácie)
      const onComplete = () => {
        anim.removeEventListener("complete", onComplete);
        anim.loop = true;
        anim.playSegments([78, 88], true);
        anim.setSpeed(0.9);
      };
      anim.addEventListener("complete", onComplete);

      // cleanup
      return () => {
        clearTimeout(t1);
        try {
          anim.destroy();
        } catch {}
      };
    })();

    return () => {
      disposed = true;
    };
  }, [src, speed, delay, growFrom, growTo]);

  // Kontajner ukotvený k spodku „stage“
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        left: `calc(50% + ${x}px - ${size / 2}px)`,
        top: `calc(100% - ${size}px + ${y}px)`,
        transform: flip ? "scaleX(-1)" : "none",
        pointerEvents: "none",
      }}
    >
      <div ref={boxRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
      }
