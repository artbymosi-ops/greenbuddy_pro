// src/components/Splash.jsx
import { useEffect, useMemo } from "react";
import MonsteraLeafLottie from "@/components/MonsteraLeafLottie";
import PotBuddy from "@/components/PotBuddy";

export default function Splash({ next = "/auth/login" }) {
  useEffect(() => {
    const seen = typeof window !== "undefined" && localStorage.getItem("gb_seen_splash");
    const t = setTimeout(() => {
      if (!seen) localStorage.setItem("gb_seen_splash", "1");
      window.location.replace(next);
    }, 2800);
    return () => clearTimeout(t);
  }, [next]);

  const title = "GreenBuddy";
  const chars = useMemo(() => title.split(""), [title]);

  return (
    <div className="wrap">
      {/* Hravý nadpis */}
      <h1 className="title" aria-label={title}>
        {chars.map((ch, i) => (
          <span key={i} style={{ animationDelay: `${i * 70}ms` }}>{ch}</span>
        ))}
      </h1>

      <p className="tag">deine spielerische Pflanzen-App</p>

      {/* Stage */}
      <div className="stage">
        <MonsteraLeafLottie size={360} y={-90} growFrom={0.6} growTo={1} />
        <PotBuddy size={300} speak="Hallo! Ich bin dein GreenBuddy." />
      </div>

      <style jsx>{`
        .wrap {
          min-height: 100svh;
          display: grid;
          place-items: center;
          padding: 24px 16px 40px;
          gap: 12px;
          background: radial-gradient(120% 120% at 50% 0%, #e9f7ed 0%, #f4fbf6 60%, #f7fff9 100%);
        }
        .title { margin: 0; font-size: clamp(42px, 8.5vw, 74px); font-weight: 800; letter-spacing: .5px; }
        .title span {
          display: inline-block;
          transform: translateY(24px) rotate(-6deg) scale(.9);
          opacity: 0;
          animation: pop .45s cubic-bezier(.2,.9,.2,1) forwards;
        }
        .title span:nth-child(odd)  { animation-duration: .52s; }
        .title span:nth-child(even) { animation-duration: .48s; }
        @keyframes pop {
          60% { transform: translateY(-6px) rotate(3deg) scale(1.04); opacity: 1; }
          100%{ transform: translateY(0) rotate(0)   scale(1);    opacity: 1; }
        }
        .tag {
          margin: 4px 0 6px;
          padding: 6px 14px;
          background: #2f3947;
          color: #fff;
          border-radius: 18px;
          font-size: .96rem;
          opacity: .92;
        }
        .stage {
          position: relative;
          width: min(520px, 92vw);
          height: 460px; /* vyšší kvôli črepníku */
        }
      `}</style>
    </div>
  );
}
