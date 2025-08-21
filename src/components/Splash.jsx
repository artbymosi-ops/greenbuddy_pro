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

      {/* ── ANIMOVANÁ RASTLINKA ── */}
      <div className="stage" aria-hidden>
        <svg viewBox="0 0 320 200" className="hero">
          {/* tieň */}
          <ellipse cx="160" cy="178" rx="90" ry="14" fill="rgba(0,0,0,.08)" />

          {/* kvetináč */}
          <g className="pot">
            <defs>
              <linearGradient id="potG" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#B67852" />
                <stop offset="100%" stopColor="#8A4E34" />
              </linearGradient>
            </defs>
            {/* okraj hrnca */}
            <ellipse cx="160" cy="118" rx="86" ry="16" fill="#3a2a22" />
            {/* telo hrnca */}
            <path
              d="M74 118 L246 118 L224 168 Q160 178 96 168 Z"
              fill="url(#potG)"
            />
            {/* odlesk */}
            <path
              d="M98 130 Q160 142 222 130"
              stroke="#fff"
              strokeOpacity=".08"
              strokeWidth="6"
              fill="none"
            />
            {/* zemina */}
            <ellipse cx="160" cy="122" rx="78" ry="10" fill="#2a221b" />
          </g>

          {/* PLANT – kreslíme relatívne od vrchu stonky */}
          <g className="plant" transform="translate(160,122)">
            {/* stonka – vyrastie z „pôdy“ hore */}
            <rect
              className="stem"
              x="-4"
              y="-2"
              width="8"
              height="64"
              rx="4"
              fill="#2bb36a"
            />

            {/* ĽAVÝ LIST */}
            <g className="leaf leaf-l" transform="translate(-14,10) rotate(-18)">
              {/* tvar listu – jemný „Monstera“ feeling */}
              <path
                d="M0 0
                   C -38 -6, -58 26, -36 48
                   C -10 74, 28 52, 18 26
                   C 12 8, 8 2, 0 0 Z"
                fill="#2fcf78"
                stroke="#1a8e57"
                strokeWidth="3"
              />
              {/* svetlé „otvory“ – fenestrácia */}
              <path d="M-12 -2 c-16 8 -22 16 -10 22" stroke="#eafff3" strokeWidth="6" strokeLinecap="round"/>
              <path d="M-6 10 c-12 6 -14 10 -6 16"   stroke="#eafff3" strokeWidth="6" strokeLinecap="round"/>
              <path d="M2 20 c-10 4 -10 8 -2 12"    stroke="#eafff3" strokeWidth="6" strokeLinecap="round"/>
            </g>

            {/* PRAVÝ LIST */}
            <g className="leaf leaf-r" transform="translate(14,10) rotate(18)">
              <path
                d="M0 0
                   C 38 -6, 58 26, 36 48
                   C 10 74, -28 52, -18 26
                   C -12 8, -8 2, 0 0 Z"
                fill="#31c874"
                stroke="#1a8e57"
                strokeWidth="3"
              />
              <path d="M12 -2 c16 8 22 16 10 22" stroke="#eafff3" strokeWidth="6" strokeLinecap="round"/>
              <path d="M6 10 c12 6 14 10 6 16"   stroke="#eafff3" strokeWidth="6" strokeLinecap="round"/>
              <path d="M-2 20 c10 4 10 8 2 12"   stroke="#eafff3" strokeWidth="6" strokeLinecap="round"/>
            </g>
          </g>
        </svg>

        {/* jemné „svetelné“ bublinky */}
        <i /><i /><i /><i />
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
        h1 span:nth-child(odd) { transform: translateY(24px) scale(0.96) rotate(3deg); }
        .tag { margin: 6px 0 2px; opacity: 0; animation: fade 900ms ease 1.9s forwards; }

        /* ── stage ── */
        .stage { width: min(560px, 92vw); height: 240px; position: relative; display: grid; place-items: center; margin-top: 6px; }
        .hero { width: 100%; height: auto; overflow: visible; }

        /* animácie rastliny */
        .stem { transform-origin: 0 62px; transform: scaleY(0); animation: grow 900ms ease-out 800ms forwards; }
        .leaf { transform-origin: 0 0; transform: scale(0.2) translateY(30px); opacity: 0; animation: leafIn 600ms ease-out 1100ms forwards, sway 3.4s ease-in-out 1.8s infinite alternate; }
        .leaf-l { animation-delay: 1080ms, 1800ms; }
        .leaf-r { animation-delay: 1180ms, 1900ms; }

        /* bublinky */
        .stage i { position: absolute; width: 8px; height: 8px; border-radius: 50%; background: #c7f3d9; opacity: .8; left: 20%; top: 86%; animation: floatUp 5s linear infinite; filter: blur(.2px); }
        .stage i:nth-of-type(2){ left: 75%; animation-duration: 6s; animation-delay: .7s; }
        .stage i:nth-of-type(3){ left: 55%; animation-duration: 7s; animation-delay: 1.2s; }
        .stage i:nth-of-type(4){ left: 35%; animation-duration: 5.5s; animation-delay: .4s; }

        /* keyframes */
        @keyframes rise { to { transform: translateY(0) scale(1) rotate(0deg); opacity: 1; } }
        @keyframes fade { to { opacity: .8; } }
        @keyframes pop { from { transform: scale(.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes grow { to { transform: scaleY(1); } }
        @keyframes leafIn { to { transform: scale(1) translateY(0); opacity: 1; } }
        @keyframes sway { 0% { transform: rotate(-2deg) translateX(-1px); } 100% { transform: rotate(2deg) translateX(1px); } }
        @keyframes floatUp { 0% { transform: translateY(0) scale(1); opacity: 0; } 15% { opacity: .6; } 100% { transform: translateY(-120px) scale(.9); opacity: 0; } }
      `}</style>
    </div>
  );
              }
