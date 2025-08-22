// src/components/Splash.jsx
import { useEffect } from "react";
import MonsteraLeafLottie from "@/components/MonsteraLeafLottie";

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

  return (
    <div className="wrap">
      <img
        src="/logo.svg"
        alt=""
        className="logo"
        onError={(e) => (e.currentTarget.style.display = "none")}
      />

      <h1 aria-label={title} className="type">
        {title.split("").map((ch, i) => (
          <span key={i} style={{ animationDelay: `${i * 90}ms` }}>
            {ch}
          </span>
        ))}
      </h1>

      <p className="tag">deine spielerische Pflanzen-App</p>

      <div className="stage" aria-hidden>
        <div className="anim">
          <MonsteraLeafLottie showFace size={320} />
        </div>
      </div>

      <style jsx>{`
        .wrap {
          min-height: 100svh;
          display: grid;
          place-items: center;
          padding: 24px 16px 32px;
          gap: 8px;
          background: radial-gradient(120% 120% at 50% 0%, #e9f7ed 0%, #f4fbf6 60%, #f7fff9 100%);
        }
        .logo { width: 72px; height: 72px; margin-bottom: 4px; }
        .type { font-weight: 800; font-size: clamp(40px, 8vw, 72px); line-height: 1; margin: 0; }
        .type span { display: inline-block; opacity: 0; transform: translateY(20px) scale(0.96);
          animation: letterIn .65s cubic-bezier(.2,.9,.2,1.1) forwards; }
        .type span:nth-child(odd) { transform: translateY(24px) scale(0.96); }
        .tag { margin: 6px 0 2px; opacity: 0; animation: fade .9s ease 1.9s forwards; }

        .stage { width: min(560px, 92vw); height: 320px; display: grid; place-items: center; }
        .anim { position: relative; width: 360px; height: 360px; }

        @keyframes letterIn { to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes fade { to { opacity: .8; } }
      `}</style>
    </div>
  );
}
