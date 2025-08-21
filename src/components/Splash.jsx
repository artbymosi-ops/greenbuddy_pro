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
      {/* voliteľné logo (ak nie je, skryje sa) */}
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

      {/* ── NOVÁ ANIMÁCIA POD TEXTOM ── */}
      <div className="stage" aria-hidden>
        <svg viewBox="0 0 320 180" className="hero">
          {/* tieň */}
          <ellipse cx="160" cy="155" rx="90" ry="14" fill="rgba(0,0,0,.08)" />

          {/* kvetináč */}
          <g className="pot">
            <defs>
              <linearGradient id="potG" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#B67852" />
                <stop offset="100%" stopColor="#8A4E34" />
              </linearGradient>
            </defs>
            <ellipse cx="160" cy="90" rx="82" ry="16" fill="#3a2a22" />
            <path
              d="M80 90 L240 90 L220 140 Q160 150 100 140 Z"
              fill="url(#potG)"
            />
            <path
              d="M95 102 Q160 115 225 102"
              stroke="#fff"
              strokeOpacity=".08"
              strokeWidth="6"
              fill="none"
            />
          </g>

          {/* stonka – vyrastie */}
          <rect
            className="stem"
            x="156"
            y="92"
            width="8"
            height="56"
            rx="4"
            fill="#2bb36a"
          />

          {/* pravý list – objaví sa a jemne sa hojdá */}
          <g className="leaf leaf-r">
            <path
              d="M190 102
                 c24 6 30 34 6 48
                 c-26 14 -58 -8 -40 -28
                 c10 -12 20 -18 34 -20 z"
              fill="#2fcf78"
              stroke="#1a8e57"
              strokeWidth="3"
            />
            {/* jednoduchá „fenestrácia“ */}
            <path
              d="M196 120 l10 6 M188 114 l10 6 M182 128 l8 6"
              stroke="#e9fff2"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </g>

          {/* ľavý list */}
          <g className="leaf leaf-l">
            <path
              d="M130 102
                 c-24 6 -30 34 -6 48
                 c26 14 58 -8 40 -28
                 c-10 -12 -20 -18 -34 -20 z"
              fill="#31c874"
              stroke="#1a8e57"
              strokeWidth="3"
            />
            <path
              d="M118 120 l-10 6 M126 114 l-10 6 M132 128 l-8 6"
              stroke="#e9fff2"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </g>
        </svg>

        {/* nenápadné „svetelné“ bublinky */}
        <i />
        <i />
        <i />
        <i />
      </div>

      <style jsx>{`
        .wrap {
          min-height: 100svh;
          display: grid;
          place-items: center;
          padding: 24px 16px 32px;
          gap: 8px;
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
          animation: pop 600ms ease both;
        }
        h1 {
          font-weight: 800;
          font-size: clamp(40px, 8vw, 72px);
          letter-spacing: 0.02em;
          margin: 0;
          line-height: 1;
        }
        h1 span {
          display: inline-block;
          transform: translateY(20px) scale(0.96) rotate(-3deg);
          opacity: 0;
          animation: rise 650ms cubic-bezier(0.2, 0.9, 0.2, 1.1) forwards;
          will-change: transform, opacity;
        }
        h1 span:nth-child(odd) {
          transform: translateY(24px) scale(0.96) rotate(3deg);
        }
        .tag {
          margin: 6px 0 2px;
          opacity: 0;
          animation: fade 900ms ease 1.9s forwards;
        }

        /* ── stage s animovanou rastlinkou ── */
        .stage {
          width: min(560px, 90vw);
          height: 220px;
          position: relative;
          display: grid;
          place-items: center;
          margin-top: 6px;
        }
        .hero {
          width: 100%;
          height: auto;
          overflow: visible;
        }
        .stem {
          transform-origin: 160px 148px; /* spodok stonky */
          transform: scaleY(0);
          animation: grow 900ms ease-out 900ms forwards;
        }
        .leaf {
          transform-origin: 160px 148px;
          transform: scale(0.2) translateY(30px);
          opacity: 0;
          animation: leafIn 600ms ease-out 1200ms forwards,
            sway 3.4s ease-in-out 2s infinite alternate;
        }
        .leaf-l {
          animation-delay: 1180ms, 2000ms;
        }
        .leaf-r {
          animation-delay: 1280ms, 2100ms;
        }

        /* „bublinky“ – jemný ambient */
        .stage i {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #c7f3d9;
          opacity: 0.8;
          left: 20%;
          top: 80%;
          animation: floatUp 5s linear infinite;
          filter: blur(0.2px);
        }
        .stage i:nth-of-type(2) {
          left: 75%;
          animation-duration: 6s;
          animation-delay: 0.7s;
        }
        .stage i:nth-of-type(3) {
          left: 55%;
          animation-duration: 7s;
          animation-delay: 1.2s;
        }
        .stage i:nth-of-type(4) {
          left: 35%;
          animation-duration: 5.5s;
          animation-delay: 0.4s;
        }

        /* keyframes */
        @keyframes rise {
          to {
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 1;
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
        @keyframes grow {
          to {
            transform: scaleY(1);
          }
        }
        @keyframes leafIn {
          to {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
        @keyframes sway {
          0% {
            transform: rotate(-2deg) translateX(-1px);
          }
          100% {
            transform: rotate(2deg) translateX(1px);
          }
        }
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.0;
          }
          15% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-110px) scale(0.9);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
        }
