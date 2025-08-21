// src/components/Splash.jsx
import { useEffect } from "react";
import MonsteraToon from "@/components/MonsteraToon";

export default function Splash({ next = "/auth/login" }) {
  useEffect(() => {
    const seen =
      typeof window !== "undefined" && localStorage.getItem("gb_seen_splash");
    const t = setTimeout(() => {
      if (!seen) localStorage.setItem("gb_seen_splash", "1");
      window.location.replace(next);
    }, 2800);
    return () => clearTimeout(t);
  }, [next]);

  const title = "GreenBuddy";

  return (
    <div className="wrap">
      {/* voliteľné logo – skryje sa ak chýba */}
      <img
        src="/logo.svg"
        alt=""
        className="logo"
        onError={(e) => (e.currentTarget.style.display = "none")}
      />

      {/* názov skladajúci sa po písmenkách */}
      <h1 aria-label={title} className="type">
        {title.split("").map((ch, i) => (
          <span key={i} style={{ animationDelay: `${i * 90}ms` }}>
            {ch}
          </span>
        ))}
      </h1>

      <p className="tag">deine spielerische Pflanzen-App</p>

      {/* Monstera – tvár na liste, finálna na splash */}
      <div className="stage" aria-hidden>
        <MonsteraToon level={9} mood="happy" wind={0.45} face="leaf" size={360} />
      </div>

      {/* -------- styles musia byť VO VNÚTRI returnu -------- */}
      <style jsx>{`
        .wrap {
          min-height: 100svh;
          display: grid;
          place-items: center;
          gap: 8px;
          padding: 24px 16px 32px;
          background: radial-gradient(
            120% 120% at 50% 0%,
            #e9f7ed 0%,
            #f4fbf6 60%,
            #f7fff9 100%
          );
        }
        .logo {
          width: 72px;
          height: 72px;
          margin-bottom: 4px;
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.08));
          animation: pop 0.6s ease both;
        }

        .type {
          font-weight: 800;
          font-size: clamp(40px, 8vw, 72px);
          letter-spacing: 0.02em;
          line-height: 1;
          margin: 0;
        }
        .type span {
          display: inline-block;
          opacity: 0;
          transform: translateY(20px) scale(0.96) rotate(-3deg);
          animation: letterIn 0.65s cubic-bezier(0.2, 0.9, 0.2, 1.1) forwards;
        }
        .type span:nth-child(odd) {
          transform: translateY(24px) scale(0.96) rotate(3deg);
        }

        .tag {
          margin: 6px 0 2px;
          opacity: 0;
          animation: fade 0.9s ease 1.9s forwards;
        }

        .stage {
          width: min(560px, 92vw);
          height: 260px;
          display: grid;
          place-items: center;
        }

        @keyframes letterIn {
          to {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(0deg);
          }
        }
        @keyframes fade {
          to {
            opacity: 0.8;
          }
        }
        @keyframes pop {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
