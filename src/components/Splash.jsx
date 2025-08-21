// src/components/Splash.jsx
import { useEffect } from "react";
import MonsteraToon from "@/components/MonsteraToon"; // ← ak máš MonsteraAvatar, zmeň import aj použitie dolu

export default function Splash({ next = "/auth/login" }) {
  useEffect(() => {
    // bezpečne len v prehliadači
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
      {/* voliteľné logo – ak chýba, skryje sa */}
      <img
        src="/logo.svg"
        alt=""
        className="logo"
        onError={(e) => (e.currentTarget.style.display = "none")}
      />

      {/* názov skladaný po písmenkách */}
      <h1 aria-label={title} className="type">
        {title.split("").map((ch, i) => (
          <span key={i} style={{ animationDelay: `${i * 90}ms` }}>
            {ch}
          </span>
        ))}
      </h1>

      <p className="tag">deine spielerische Pflanzen-App</p>

<div className="stage" aria-hidden>
  {/* na titulke už vyrastená */}
  <MonsteraToon level={9} mood="happy" wind={0.45} face="leaf" size={360}/>
</div>
{/* na titulke už vyrastená */}
      <MonsteraToon
        level={9}
        mood="happy"
        wind={0.45}
        face="leaf"
        size={360}
      />
    </div>

    <style jsx>{`
      /* tvoje CSS sem */
    `}</style>
  </div>
);
}
