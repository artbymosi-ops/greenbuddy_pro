// src/components/MonsteraLeafLottie.jsx
import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import { useEffect, useRef } from "react";

export default function MonsteraLeafLottie({ src="/anim/monstera-leaf.json" }) {
  const boxRef = useRef(null);

  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js";
    s.onload = () => {
      window.lottie.loadAnimation({
        container: boxRef.current,
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: src,
      });
    };
    document.head.appendChild(s);
    return () => s.remove();
  }, [src]);

  return <div ref={boxRef} style={{ width: "100%", height: "100%" }} />;
}
export default function MonsteraLeafLottie({
  size = 220,
  delay = 0,         // oneskorenie rozbalenia v ms (pri viacerých listoch)
  flip = false,      // zrkadlenie pre pravú/ľavú stranu
  x = 0, y = 0,      // posun v kontajneri (px)
  speed = 1,         // celková rýchlosť animácie
  src = "/anim/monstera-leaf.json",
  showFace = false,  // či prekryť list tváričkou
}) {
  const boxRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (!boxRef.current) return;

    // inicializácia
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

    // 1) po voliteľnom delayi spustiť segment rozbalenia
    const t1 = setTimeout(() => {
      // z tvojho JSONu: rozbalenie je cca 19–49 frame
      anim.playSegments([19, 49], true);
    }, Math.max(0, delay));

    // 2) po dohraní rozbalenia prepnúť na jemné hojdanie (cca 58–91)
    const onComplete = () => {
      anim.removeEventListener("complete", onComplete);
      anim.loop = true;
      anim.playSegments([58, 91], true);
    };
    anim.addEventListener("complete", onComplete);

    return () => {
      clearTimeout(t1);
      try { anim.destroy(); } catch {}
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
      {showFace && (
        <FaceOverlay />
      )}
    </div>
  );
}

// jednoduchá tvár na LISTE (pre Splash/titulku)
function FaceOverlay() {
  return (
    <svg viewBox="0 0 200 200" style={{
      position: "absolute", inset: 0, transform: "translateY(12%)",
    }}>
      {/* oči */}
      <circle cx="86" cy="90" r="12" fill="#fff"/>
      <circle cx="116" cy="90" r="12" fill="#fff"/>
      <circle cx="90" cy="92" r="7" fill="#222"/>
      <circle cx="120" cy="92" r="7" fill="#222"/>
      {/* lesk v očiach */}
      <circle cx="92" cy="90" r="2.2" fill="#fff"/>
      <circle cx="122" cy="90" r="2.2" fill="#fff"/>
      {/* úsmev s jazýčkom */}
      <path d="M78 116 q22 16 44 0" fill="none" stroke="#111" strokeWidth="6" strokeLinecap="round"/>
      <path d="M95 120 q11 8 22 0" fill="#e45"/>
    </svg>
  );
}
