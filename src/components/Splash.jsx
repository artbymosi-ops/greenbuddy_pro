// src/components/Splash.jsx
import { useEffect } from "react";
import MonsteraLeafLottie from "@/components/MonsteraLeafLottie";
import PotBuddy from "@/components/PotBuddy";

export default function Splash({ next = "/auth/login" }) {
  useEffect(() => {
    const seen =
      typeof window !== "undefined" && localStorage.getItem("gb_seen_splash");
    const t = setTimeout(() => {
      if (!seen && typeof window !== "undefined") {
        localStorage.setItem("gb_seen_splash", "1");
      }
      if (typeof window !== "undefined") window.location.replace(next);
    }, 2800);
    return () => clearTimeout(t);
  }, [next]);

  const title = "GreenBuddy";

  return (
    <div className="wrap">
      {/* Hravý naskakujúci nadpis */}
      <h1 aria-label={title} className="type">
        {title.split("").map((ch, i) => (
          <span key={i} style={{ animationDelay: `${i * 70}ms` }}>
            {ch}
          </span>
        ))}
      </h1>

      <p className="tag">deine spielerische Pflanzen-App</p>

      {/* Stage – pot + list vyrastajúci zo zeminy */}
      <div className="stage">
        <MonsteraLeafLottie size={280} level={3} order={0} />
        <PotBuddy size={220} mood="happy" />
      </div>

      <style jsx>{`
        .wrap {
          min-height: 100svh;
          display: grid;
          place-items: center;
          padding: 24px 16px 40px;
          gap: 12px;
          background: radial-gradient(
            120% 120% at 50% 0%,
            #e9f7ed 0%,
            #f4fbf6 60%,
            #f7fff9 100%
          );
        }
        .type {
          margin: 0;
          font-weight: 800;
          font-size: clamp(44px, 10vw, 84px);
          line-height: 1;
          letter-spacing: 1px;
          display: inline-block;
        }
        .type span {
          display: inline-block;
          transform: translateY(12px) scale(0.9);
          opacity: 0;
          filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.08));
          animation: pop 520ms cubic-bezier(0.2, 0.9, 0.2, 1) forwards;
        }
        @keyframes pop {
          60% {
            transform: translateY(-6px) scale(1.06) rotate(-1deg);
            opacity: 1;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        .tag {
          margin: 0;
          padding: 10px 18px;
          background: #2b3f34;
          color: #fff;
          border-radius: 999px;
          font-weight: 600;
          box-shadow: 0 12px 26px rgba(0, 0, 0, 0.12);
        }
        .stage {
          position: relative;
          width: min(520px, 92vw);
          height: 420px;
        }
      `}</style>
    </div>
  );
}
