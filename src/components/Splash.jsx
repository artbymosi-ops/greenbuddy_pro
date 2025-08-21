// src/components/Splash.jsx
import { useEffect } from "react";

export default function Splash({ next = "/auth/login" }) {
  useEffect(() => {
    const seen = localStorage.getItem("gb_seen_splash");
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

      {/* názov skladajúci sa po písmenkách */}
      <h1 aria-label={title}>
        {title.split("").map((ch, i) => (
          <span key={i} style={{ animationDelay: `${i * 90}ms` }}>
            {ch}
          </span>
        ))}
      </h1>
      <p className="tag">deine spielerische Pflanzen-App</p>
import MonsteraAvatar from "@/components/MonsteraAvatar";

// ...vo vnútri <div className="stage"> ...
<div className="stage" aria-hidden>
  <MonsteraAvatar size={340} level={6} mood="happy" wind={0.5} />
</div>
  }
                
