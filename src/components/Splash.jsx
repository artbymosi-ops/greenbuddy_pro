import { useEffect } from "react";

export default function Splash({ next = "/auth" }) {
  useEffect(() => {
    const seen = localStorage.getItem("gb_seen_splash");
    const timer = setTimeout(() => {
      if (!seen) localStorage.setItem("gb_seen_splash", "1");
      window.location.replace(next);
    }, 2800); // dĺžka animácie
    return () => clearTimeout(timer);
  }, [next]);

  const title = "Greenbuddy";

  return (
    <div className="wrap">
      {/* voliteľné logo – ak máš /public/logo.svg */}
      <img src="/logo.svg" alt="" className="logo" onError={(e)=>e.currentTarget.style.display='none'} />
      <h1 aria-label={title}>
        {title.split("").map((ch, i) => (
          <span key={i} style={{ animationDelay: `${i * 90}ms` }}>
            {ch}
          </span>
        ))}
      </h1>
      <p className="tag">deine spielerische Pflanzen-App</p>

      <style jsx>{`
        .wrap {
          min-height: 100svh;
          display: grid;
          place-items: center;
          background: radial-gradient(120% 120% at 50% 0%, #e9f7ed 0%, #f4fbf6 60%, #f7fff9 100%);
        }
        .logo {
          width: 72px;
          height: 72px;
          margin-bottom: 8px;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,.08));
          animation: pop 600ms ease both;
        }
        h1 {
          font-weight: 800;
          font-size: clamp(40px, 8vw, 72px);
          letter-spacing: .02em;
          margin: 0;
          line-height: 1;
        }
        h1 span {
          display: inline-block;
          transform: translateY(20px) scale(.96) rotate(-3deg);
          opacity: 0;
          animation: rise 650ms cubic-bezier(.2,.9,.2,1.1) forwards;
          will-change: transform, opacity;
        }
        h1 span:nth-child(odd){ transform: translateY(24px) scale(.96) rotate(3deg); }
        .tag {
          margin: 8px 0 0;
          opacity: .0;
          animation: fade 900ms ease 1.9s forwards;
        }
        @keyframes rise {
          to { transform: translateY(0) scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes fade { to { opacity: .8; } }
        @keyframes pop { from{transform:scale(.8);opacity:0} to{transform:scale(1);opacity:1} }
      `}</style>
    </div>
  );
}
