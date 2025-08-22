import { useEffect } from "react";
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

  return (
    <div className="wrap">
      <h1 className="type" aria-label={title}>{title}</h1>
      <p className="tag">deine spielerische Pflanzen-App</p>

      {/* Stage pre animáciu */}
      <div className="stage">
        {/* LIST – vyrastá z okraja črepníka (trochu posunutý hore) */}
        <MonsteraLeafLottie size={320} y={-70} speed={1} />

        {/* KVETINÁČ – s tváričkou */}
        <PotBuddy size={260} mood="happy" />
      </div>

      <style jsx>{`
        .wrap {
          min-height: 100svh;
          display: grid;
          place-items: center;
          padding: 24px 16px 40px;
          gap: 10px;
          background: radial-gradient(120% 120% at 50% 0%, #e9f7ed 0%, #f4fbf6 60%, #f7fff9 100%);
        }
        .type { font-weight: 800; font-size: clamp(40px, 8vw, 72px); line-height: 1; margin: 0; }
        .tag { opacity: .9; margin: 4px 0 8px; }

        .stage {
          position: relative;
          width: min(520px, 92vw);
          height: 420px;
        }
      `}</style>
    </div>
  );
}
