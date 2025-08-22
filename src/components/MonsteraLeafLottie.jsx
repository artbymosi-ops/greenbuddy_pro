// src/components/MonsteraLeafLottie.jsx
import { useEffect, useRef } from "react";

/** načíta lottie-web z CDN len raz */
let lottieReady;
function ensureLottie() {
  if (typeof window !== "undefined" && window.lottie) return Promise.resolve(window.lottie);
  if (!lottieReady) {
    lottieReady = new Promise((resolve) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js";
      s.onload = () => resolve(window.lottie);
      document.head.appendChild(s);
    });
  }
  return lottieReady;
}

export default function MonsteraLeafLottie({
  size = 220,
  delay = 0,          // ms – hodí sa pri viac listoch
  flip = false,       // zrkadlenie (ľavá/pravá strana)
  x = 0, y = 0,       // posun v kontajneri
  speed = 1,          // rýchlosť animácie
  src = "/anim/monstera-leaf.json",
  showFace = false,   // prekryť list tváričkou (na titulke)
}) {
  const boxRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    let disposed = false;
    let startTimer;

    (async () => {
      const lottie = await ensureLottie();
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
      animRef.current = anim;

      // 1) po voliteľnom oneskorení – segment „rozbalenie“ (≈ frame 19–49)
      startTimer = setTimeout(() => {
        anim.playSegments([19, 49], true);
      }, Math.max(0, delay));

      // 2) po dokončení prepnúť na jemné hojdanie (≈ 58–91) v slučke
      const onComplete = () => {
        anim.removeEventListener("complete", onComplete);
        anim.loop = true;
        anim.playSegments([58, 91], true);
      };
      anim.addEventListener("complete", onComplete);
    })();

    return () => {
      disposed = true;
      clearTimeout(startTimer);
      try { animRef.current?.destroy(); } catch {}
    };
  }, [delay, speed, src]);

  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        left: `calc(50% + ${x}px - ${size / 2}px)`,
        top: `calc(50% + ${y}px - ${size / 2}px)`,
        transform: flip ? "scaleX(-1)" : "none",
        pointerEvents: "none",
      }}
    >
      <div ref={boxRef} style={{ width: "100%", height: "100%" }} />
      {showFace && <FaceOverlay />}
    </div>
  );
}

// jednoduchá tvár priamo NA LISTE
function FaceOverlay() {
  return (
    <svg viewBox="0 0 200 200" style={{ position: "absolute", inset: 0, transform: "translateY(12%)" }}>
      <circle cx="86" cy="90" r="12" fill="#fff" />
      <circle cx="116" cy="90" r="12" fill="#fff" />
      <circle cx="90" cy="92" r="7" fill="#222" />
      <circle cx="120" cy="92" r="7" fill="#222" />
      <circle cx="92" cy="90" r="2.2" fill="#fff" />
      <circle cx="122" cy="90" r="2.2" fill="#fff" />
      <path d="M78 116 q22 16 44 0" fill="none" stroke="#111" strokeWidth="6" strokeLinecap="round"/>
      <path d="M95 120 q11 8 22 0" fill="#e45"/>
    </svg>
  );
            }
