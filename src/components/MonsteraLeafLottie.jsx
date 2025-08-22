import { useEffect, useRef } from "react";

export default function MonsteraLeafLottie({
  src = "/anim/monstera-leaf.json",
  size = 320,
  x = 0,
  y = -40,        // o niečo menší offset, nech to vyzerá, že ide zo zeminy
  speed = 1,
  growFrom = 0.65,
  growTo = 1.0,
  delay = 0,
  flip = false,
}) {
  const boxRef = useRef(null);

  useEffect(() => {
    let disposed = false;

    const loadLottie = () =>
      new Promise((resolve) => {
        if (window.lottie) return resolve(window.lottie);
        const id = "lottie-web-cdn";
        if (document.getElementById(id)) {
          const iv = setInterval(() => { if (window.lottie) { clearInterval(iv); resolve(window.lottie);} }, 30);
          return;
        }
        const s = document.createElement("script");
        s.id = id;
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js";
        s.onload = () => resolve(window.lottie);
        document.head.appendChild(s);
      });

    (async () => {
      const lottie = await loadLottie();
      if (disposed || !boxRef.current) return;

      const anim = lottie.loadAnimation({
        container: boxRef.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: src,
        rendererSettings: { progressiveLoad: true },
      });

      anim.setSpeed(speed);

      const host = boxRef.current;
      host.style.transformOrigin = "50% 100%";
      host.animate(
        [{ transform: `scale(${growFrom})` }, { transform: `scale(${growTo})` }],
        { duration: 800, delay, easing: "cubic-bezier(.2,.9,.2,1)", fill: "forwards" }
      );

      const t1 = setTimeout(() => anim.playSegments([19, 49], true), delay);

      const onComplete = () => {
        anim.removeEventListener("complete", onComplete);
        anim.loop = true;
        anim.playSegments([78, 88], true); // kratšie, prirodzenejšie
        anim.setSpeed(0.9);
      };
      anim.addEventListener("complete", onComplete);

      return () => { clearTimeout(t1); try { anim.destroy(); } catch {} };
    })();

    return () => { disposed = true; };
  }, [src, speed, delay, growFrom, growTo]);

  return (
    <div
      style={{
        position: "absolute",
        width: size, height: size,
        left: `calc(50% + ${x}px - ${size/2}px)`,
        top:  `calc(100% - ${size}px + ${y}px)`,
        transform: flip ? "scaleX(-1)" : "none",
        pointerEvents: "none",
      }}
    >
      <div ref={boxRef} style={{ width:"100%", height:"100%" }} />
    </div>
  );
            }
