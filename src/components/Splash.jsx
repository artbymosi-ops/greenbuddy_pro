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
      <img src="/logo.svg" alt="" className="logo"
           onError={(e)=>e.currentTarget.style.display="none"} />

      {/* názov skladajúci sa po písmenkách */}
      <h1 aria-label={title}>
        {title.split("").map((ch,i)=>(
          <span key={i} style={{animationDelay:`${i*90}ms`}}>{ch}</span>
        ))}
      </h1>
      <p className="tag">deine spielerische Pflanzen-App</p>

      {/* ── ANIMOVANÁ RASTLINKA ── */}
      <div className="stage" aria-hidden>
        <svg viewBox="0 0 360 220" className="hero">
          {/* tieň */}
          <ellipse cx="180" cy="200" rx="95" ry="15" fill="rgba(0,0,0,.08)"/>

          {/* telo hrnca (vzadu) */}
          <defs>
            {/* OREZ – aby rastlina bola iba „vnútri“ otvoru */}
            <clipPath id="potMouth">
              <ellipse cx="180" cy="120" rx="92" ry="18"/>
            </clipPath>

            {/* masky na fenestráciu listov */}
            <mask id="leafMaskL">
              <rect width="400" height="240" fill="#fff"/>
              {/* „dierky“ (čierna = vyseknúť) */}
              <ellipse cx="146" cy="96" rx="10" ry="6" fill="#000"/>
              <ellipse cx="134" cy="108" rx="11" ry="6" fill="#000"/>
              <ellipse cx="158" cy="112" rx="9"  ry="6" fill="#000"/>
            </mask>
            <mask id="leafMaskR">
              <rect width="400" height="240" fill="#fff"/>
              <ellipse cx="214" cy="96" rx="10" ry="6" fill="#000"/>
              <ellipse cx="226" cy="108" rx="11" ry="6" fill="#000"/>
              <ellipse cx="202" cy="112" rx="9"  ry="6" fill="#000"/>
            </mask>

            <linearGradient id="potG" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%"  stopColor="#B67852"/>
              <stop offset="100%" stopColor="#8A4E34"/>
            </linearGradient>
          </defs>

          {/* vnútro + telo */}
          <path d="M76 120 L284 120 L260 172 Q180 182 100 172 Z"
                fill="url(#potG)"/>
          <ellipse cx="180" cy="124" rx="84" ry="11" fill="#2a221b"/>

          {/* RASTLINA – orezaná otvorom hrnca */}
          <g clipPath="url(#potMouth)">
            {/* posunuté na stred otvoru, začína tesne pod okrajom a „vyskočí“ */}
            <g className="plant" transform="translate(180,124)">
              {/* stonka – vyrastie */}
              <rect className="stem" x="-5" y="-2" width="10" height="78" rx="5" fill="#2bb36a"/>

              {/* ľavý list: rozvinutie + kolísanie */}
              <g className="leaf leaf-l" transform="translate(-18,12)">
                <path
                  d="M0 0 C -40 -8, -66 28, -38 52 C -6 82, 34 56, 16 26 C 10 12, 6 4, 0 0 Z"
                  fill="#2fcf78" stroke="#1a8e57" strokeWidth="3"
                  mask="url(#leafMaskL)"/>
                <path d="M-8 -6 L0 8" stroke="#1a8e57" strokeWidth="3" />
              </g>

              {/* pravý list: rozvinutie + kolísanie */}
              <g className="leaf leaf-r" transform="translate(18,12)">
                <path
                  d="M0 0 C 40 -8, 66 28, 38 52 C 6 82, -34 56, -16 26 C -10 12, -6 4, 0 0 Z"
                  fill="#31c874" stroke="#1a8e57" strokeWidth="3"
                  mask="url(#leafMaskR)"/>
                <path d="M8 -6 L0 8" stroke="#1a8e57" strokeWidth="3" />
              </g>
            </g>
          </g>

          {/* okraj hrnca (navrchu – prekryje všetko nad hranou) */}
          <ellipse cx="180" cy="120" rx="92" ry="18" fill="#3a2a22"/>
          {/* jemný odlesk */}
          <path d="M102 132 Q180 146 258 132" stroke="#fff" strokeOpacity=".08" strokeWidth="6" fill="none"/>
        </svg>

        {/* bublinky */}
        <i/><i/><i/><i/>
      </div>

      <style jsx>{`
        .wrap{
          min-height:100svh; display:grid; place-items:center;
          padding:24px 16px 32px; gap:8px;
          background:radial-gradient(120% 120% at 50% 0%, #e9f7ed 0%, #f4fbf6 60%, #f7fff9 100%);
        }
        .logo{ width:72px; height:72px; margin-bottom:4px; filter:drop-shadow(0 2px 6px rgba(0,0,0,.08)); animation:pop .6s ease both; }
        h1{ font-weight:800; font-size:clamp(40px,8vw,72px); letter-spacing:.02em; margin:0; line-height:1; }
        h1 span{ display:inline-block; transform:translateY(22px) scale(.96) rotate(-3deg); opacity:0;
                 animation:rise .65s cubic-bezier(.2,.9,.2,1.1) forwards; }
        h1 span:nth-child(odd){ transform:translateY(26px) scale(.96) rotate(3deg); }
        .tag{ margin:6px 0 2px; opacity:0; animation:fade .9s ease 1.9s forwards; }

        .stage{ width:min(560px,92vw); height:250px; position:relative; display:grid; place-items:center; margin-top:6px; }
        .hero{ width:100%; height:auto; overflow:visible; }

        /* ANIMÁCIE RASTLINY */
        .plant{ transform:translateY(22px); animation:popUp .7s ease-out .6s forwards; }
        .stem{ transform-origin:0 76px; transform:scaleY(0); animation:grow .9s ease-out .8s forwards; }

        .leaf{ transform-origin:0 0; transform:translateY(24px) scaleX(0); opacity:0;
               animation:unfold .45s ease-out 1.15s forwards, sway 3.6s ease-in-out 1.6s infinite alternate; }
        .leaf-r{ animation-delay:1.2s, 1.7s; }
        .leaf-l{ animation-delay:1.1s, 1.6s; }

        /* bublinky */
        .stage i{ position:absolute; width:8px; height:8px; border-radius:50%; background:#c7f3d9; opacity:.8;
                  left:20%; top:88%; animation:floatUp 5s linear infinite; filter:blur(.2px); }
        .stage i:nth-of-type(2){ left:75%; animation-duration:6s; animation-delay:.7s; }
        .stage i:nth-of-type(3){ left:55%; animation-duration:7s; animation-delay:1.2s; }
        .stage i:nth-of-type(4){ left:35%; animation-duration:5.5s; animation-delay:.4s; }

        /* keyframes */
        @keyframes rise{ to{ transform:translateY(0) scale(1) rotate(0); opacity:1; } }
        @keyframes fade{ to{ opacity:.8; } }
        @keyframes pop{ from{ transform:scale(.8); opacity:0; } to{ transform:scale(1); opacity:1; } }
        @keyframes popUp{ from{ transform:translateY(22px); } to{ transform:translateY(0); } }
        @keyframes grow{ to{ transform:scaleY(1); } }
        @keyframes unfold{ to{ transform:translateY(0) scaleX(1); opacity:1; } }
        @keyframes sway{ 0%{ transform:rotate(-2deg); } 100%{ transform:rotate(2deg); } }
        @keyframes floatUp{
          0%{ transform:translateY(0) scale(1); opacity:0; }
          15%{ opacity:.6; }
          100%{ transform:translateY(-120px) scale(.9); opacity:0; }
        }
      `}</style>
    </div>
  );
}
