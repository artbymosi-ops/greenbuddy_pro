import Link from "next/link";
import { useEffect, useState } from "react";
// + pridaj tento import
import LangSwitch from "@/components/LangSwitch";

// ...vo vnútri returnu, vpravo do .h-right pred hamburger:
<div className="h-right">
  <LangSwitch />
  <button
    className={`hamb ${open ? "is-open" : ""}`}
    aria-label="Menü"
    onClick={() => setOpen(v=>!v)}
  >
    <span/><span/><span/>
  </button>
</div>
export default function Header() {
  const [open, setOpen] = useState(false);
  useEffect(()=>{ document.body.style.overflow = open ? "hidden" : ""; }, [open]);

  return (
    <header className="site-header">
      <div className="container header-row">
        <Link href="/" className="brand">
          <span className="mascot" aria-hidden>🪴</span>
          <span className="brand-text">Greenbuddy</span>
        </Link>

        <div className="h-right">
          <button
            className={`hamb ${open ? "is-open" : ""}`}
            aria-label="Menü"
            onClick={() => setOpen(v=>!v)}
          >
            <span/><span/><span/>
          </button>
        </div>
      </div>

      <nav className={`drawer ${open ? "open" : ""}`} onClick={()=>setOpen(false)}>
        <div className="drawer-panel" onClick={(e)=>e.stopPropagation()}>
          <div className="drawer-head">
            <span className="mascot big">🪴</span>
            <strong>Menü</strong>
          </div>
          <Link href="/plants" className="drawer-link">Pflanzen</Link>
          <Link href="/calendar" className="drawer-link">Kalender</Link>
          <Link href="/diary" className="drawer-link">Tagebuch</Link>
          <Link href="/forum" className="drawer-link">Forum</Link>
          <Link href="/chat" className="drawer-link">AI-Chat</Link>
          <hr/>
          <Link href="/auth/login" className="drawer-link">Anmelden</Link>
          <Link href="/auth/register" className="drawer-link">Registrieren</Link>
          <Link href="/admin" className="drawer-link">Admin</Link>
        </div>
      </nav>
    </header>
  );
                                                             }
