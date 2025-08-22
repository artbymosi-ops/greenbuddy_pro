// src/components/Splash.jsx
import Head from "next/head";
import { useEffect } from "react";
import MonsteraLeafLottie from "@/components/MonsteraLeafLottie";
import PotBuddy from "@/components/PotBuddy";

export default function Splash({ next = "/auth/login" }) {
  // Auto-preskočenie po krátkej chvíli
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
    <>
      {/* Playful font */}
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="wrap">
        {/* Naskakujúci, hravý nadpis */}
        <h1 className="type" aria-label={title}>
          {title.split("").map((ch, i) => (
            <span
              key={i}
              className="ch"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              {ch}
            </span>
          ))}
        </h1>

        {/* Tagline pilulka */}
        <p className="tag">deine spielerische Pflanzen-App</p>

        {/* Stage – list vyrastá zo zeminy a kvetináč má úsmev */}
        <div className="stage">
          <MonsteraLeafLottie size={300} y={-34} speed={1} />
          <PotBuddy size={260} mood="happy" />
        </div>
      </div>

      <style jsx>{`
        .wrap {
          min-height: 100svh;
          display: grid;
          place-items: center;
          padding: 24px 16px 40px;
          gap: 10px;
          background: radial-gradient(
            120% 120% at 50% 0%,
            #e9f7ed 0%,
            #f4fbf6 60%,
            #f7fff9 100%
          );
        }

        /* Nadpis – „balónikové“ písmo s pop/wiggle efektom */
        .type {
          margin: 0;
          font-family: "Baloo 2", system-ui, -apple-system, Segoe UI, Roboto,
            "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji",
            "Segoe UI Emoji";
          font-weight: 800;
          font-size: clamp(44px, 9vw, 86px);
          line-height: 0.95;
          letter-spacing: 0.5px;
          color: #1f2e24;
          text-shadow: 0 2px 0 #dfeee4;
        }
        .type .ch {
          display: inline-block;
          transform-origin: 60% 70%;
          animation: pop 420ms cubic-bezier(0.22, 1, 0.36, 1) both,
            wiggle 2400ms ease-in-out infinite 600ms;
        }
        .type .ch:nth-child(2n) {
          animation-delay: 90ms, 690ms;
        }
        .type .ch:nth-child(3n) {
          animation-delay: 180ms, 720ms;
        }

        @keyframes pop {
          0% {
            transform: translateY(20px) scale(0.6) rotate(-6deg);
            opacity: 0;
          }
          60% {
            transform: translateY(-4px) scale(1.06) rotate(1deg);
            opacity: 1;
          }
          100% {
            transform: translateY(0) scale(1) rotate(0deg);
          }
        }
        @keyframes wiggle {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-2px) rotate(0.6deg);
          }
        }

        .tag {
          margin: 4px 0 8px;
          padding: 8px 14px;
          border-radius: 999px;
          background: #2b3d33;
          color: #fff;
          font-weight: 600;
          letter-spacing: 0.2px;
          box-shadow: 0 8px 24px rgba(19, 37, 28, 0.12);
        }

        .stage {
          position: relative;
          width: min(520px, 92vw);
          height: 420px;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}
