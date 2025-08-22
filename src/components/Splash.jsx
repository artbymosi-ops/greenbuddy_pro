// src/components/Splash.jsx
import { useEffect } from "react";
import MonsteraLeafLottie from "@/components/MonsteraLeafLottie";

<div style={{ position: "relative", width: 360, height: 360 }}>
  <MonsteraLeafLottie showFace size={320} />
</div>

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

    </div>
  );
}
