import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Splash({ next = "/auth" }) {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      // ak by si to chcela len prvýkrát, odkomentuj:
      // localStorage.setItem("gb_seen_splash", "1");
      router.replace(next);
    }, 2200); // dĺžka animácie
    return () => clearTimeout(t);
  }, [router, next]);

  return (
    <div className="splash">
      {/* mini logo (voliteľné) */}
      <div className="logo-dot">🌿</div>

      {/* SVG “kreslený” názov */}
      <svg className="brand-draw" viewBox="0 0 1200 220" aria-label="Greenbuddy">
        <text x="50%" y="57%" textAnchor="middle" className="stroke">Greenbuddy</text>
        <text x="50%" y="57%" textAnchor="middle" className="fill">Greenbuddy</text>
      </svg>
    </div>
  );
}
