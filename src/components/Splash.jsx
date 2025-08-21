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

      {/* ── ANIMOVANÁ RASTLINKA ── */}
      <div className="stage" aria-hidden>
        <svg viewBox="0 0 360 220" className="hero">
          {/* tieň */}
          <ellipse cx="180" cy="200" rx="95" ry="15" fill="rgba(0,0,0,.08)" />

          {/* telo kvetináča (zadná časť + hlina) */}
          <defs>
            {/* fenestrácia – masky v lokálnych súradniciach listu */}
            <mask id="leafMaskL" maskUnits="userSpaceOnUse" x="-80" y="-50" width="160" height="130">
              <rect x="-80" y="-50" width="160" height="130" fill="#fff" />
              <ellipse cx="-28" cy="-8" rx="10" ry="6" fill="#000" />
              <ellipse cx="-42" cy="8" rx="11" ry="6" fill="#000" />
              <ellipse cx="-14" cy="14" rx="9" ry="6" fill="#000" />
              <path d="M-54 22 q22 -8 42 10" stroke="#000" strokeWidth="10" strokeLinecap="round" />
            </mask>
            <mask id="leafMaskR" maskUnits="userSpaceOnUse" x="-80" y="-50" width="160" height="130">
              <rect x="-80" y="-50" width="160" height="130" fill="#fff" />
              <ellipse cx="28" cy="-8" rx="10" ry="6" fill="#000" />
              <ellipse cx="42" cy="8" rx="11" ry="6" fill="#000" />
              <ellipse cx="14" cy="14" rx="9" ry="6" fill="#000" />
              <path d="M54 22 q-22 -8 -42 10" stroke="#000" strokeWidth="10" strokeLinecap="round" />
            </mask>

            <linearGradient id="potG" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#B67852" />
              <stop offset="100%" stopColor="#8A4E34" />
            </linearGradient>
          </defs>

          {/* telo kvetináča (zadná stena) */}
          <path d="M76 120 L284 120 L260 172 Q180 182 100 172 Z" fill="url(#potG)" />
          {/* hlina */}
          <ellipse cx="180" cy="124" rx="84" ry="11" fill="#2a221b" />

          {/* RASTLINA */}
<g transform="translate(180,124)" className="plant">
  {/* stonka */}
  <rect className="stem" x="-4" y="0" width="8" height="72" rx="4" fill="#2bb36a" />

  {/* ľavý list */}
  <g className="leaf leaf-l" transform="translate(-16,0)">
    <path
      d="M0 0 C -38 -8, -58 26, -34 48 C -10 70, 24 48, 10 22 C 6 10, 3 3, 0 0 Z"
      fill="#2fcf78"
      stroke="#1a8e57"
      strokeWidth="3"
    />
  </g>

  {/* pravý list */}
  <g className="leaf leaf-r" transform="translate(16,0)">
    <path
      d="M0 0 C 38 -8, 58 26, 34 48 C 10 70, -24 48, -10 22 C -6 10, -3 3, 0 0 Z"
      fill="#31c874"
      stroke="#1a8e57"
      strokeWidth="3"
    />
  </g>
</g>

          {/* horný okraj kvetináča – prekryje všetko nad hranou = ilúzia, že vychádza zvnútra */}
          <ellipse cx="180" cy="120" rx="92" ry="18" fill="#3a2a22" />
          <path d="M102 132 Q180 146 258 132" stroke="#fff" strokeOpacity=".08" strokeWidth="6" fill="none" />
        </svg>

        {/* bublinky */}
        <i /><i /><i /><i />
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
        .logo { width: 72px; height: 72px; margin-bottom: 4px; filter: drop-shadow(0 2px 6px rgba(0,0,0,.08)); animation: pop .6s ease both; }
        h1 { font-weight: 800; font-size: clamp(40px, 8vw, 72px); letter-spacing: .02em; margin: 0; line-height: 1; }
        h1 span { display: inline-block; transform: translateY(22px) scale(.96) rotate(-3deg); opacity: 0; animation: rise .65s cubic-bezier(.2,.9,.2,1.1) forwards; }
        h1 span:nth-child(odd){ transform: translateY(26px) scale(.96) rotate(3deg); }
        .tag { margin: 6px 0 2px; opacity: 0; animation: fade .9s ease 1.9s forwards; }

        .stage { width: min(560px, 92vw); height: 250px; position: relative; display: grid; place-items: center; margin-top: 6px; }
        .hero { width: 100%; height: auto; overflow: visible; }

        /* Animácie rastliny – žiadna clipPath, čisté a spoľahlivé */
        .plant { transform: translateY(24px); animation: popUp .7s ease-out .6s forwards; }
        .stem  { transform-origin: 0 76px; transform: scaleY(0); animation: grow .9s ease-out .8s forwards; }

        .leaf {
          transform-origin: 0 0;
          transform: translateY(28px) scaleX(0);
          opacity: 0;
          animation:
            unfold .5s ease-out 1.15s forwards,
            sway   3.6s ease-in-out 1.8s infinite alternate,
            gust   6s ease-in-out 2.2s infinite;
        }
        .leaf-l { animation-delay: 1.1s, 1.7s, 2.2s; }
        .leaf-r { animation-delay: 1.2s, 1.8s, 2.4s; }

        .stage i {
          position: absolute; width: 8px; height: 8px; border-radius: 50%; background: #c7f3d9; opacity: .8;
          left: 20%; top: 88%; animation: floatUp 5s linear infinite; filter: blur(.2px);
        }
        .stage i:nth-of-type(2){ left: 75%; animation-duration: 6s; animation-delay: .7s; }
        .stage i:nth-of-type(3){ left: 55%; animation-duration: 7s; animation-delay: 1.2s; }
        .stage i:nth-of-type(4){ left: 35%; animation-duration: 5.5s; animation-delay: .4s; }

        /* keyframes */
        @keyframes rise { to { transform: translateY(0) scale(1) rotate(0); opacity: 1; } }
        @keyframes fade { to { opacity: .8; } }
        @keyframes pop  { from { transform: scale(.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes popUp{ from { transform: translateY(24px); } to { transform: translateY(0); } }
        @keyframes grow { to { transform: scaleY(1); } }
        @keyframes unfold { to { transform: translateY(0) scaleX(1); opacity: 1; } }
        @keyframes sway { 0% { transform: rotate(-2deg); } 100% { transform: rotate(2deg); } }
        @keyframes gust {
          0%, 92%, 100% { transform: none; }
          94% { transform: translateY(-2px) rotate(-3deg); }
          96% { transform: translateY(1px) rotate(3deg); }
          98% { transform: translateY(0) rotate(0deg); }
        }
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          15% { opacity: .6; }
          100% { transform: translateY(-120px) scale(.9); opacity: 0; }
        }
      `}</style>
    </div>
  );
              }
