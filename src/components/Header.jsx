import Link from "next/link";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Header(){
  const { pathname } = useRouter();
  const [open, setOpen] = useState(false);

  // zobraz menu všade okrem "/" (landing)
  const showMenu = pathname !== "/";

  return (
    <header className="site-header">
      <div className="container" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <Link href="/" className="brand">Greenbuddy</Link>

        {showMenu ? (
          <>
            <button className="menu-btn" onClick={()=>setOpen(v=>!v)} aria-label="Menu">☰</button>
            {open && (
              <nav className="menu">
                <Link href="/">Start</Link>
                <Link href="/plant">Meine Pflanze</Link>
                <Link href="/calendar">Kalender</Link>
                <Link href="/diary">Tagebuch</Link>
                <Link href="/forum">Forum</Link>
                <Link href="/admin">Admin</Link>
              </nav>
            )}
          </>
        ) : (
          <div /> /* prázdne miesto – nech sa nerozpadne layout */
        )}
      </div>
    </header>
  );
}
export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <Link href="/" className="logo">Greenbuddy</Link>

      <div className="spacer" />

      <nav className={`nav ${open ? "open" : ""}`} onClick={()=>setOpen(false)}>
        <Link href="/">Start</Link>
        <Link href="/plant">Meine Pflanze</Link>
        <Link href="/calendar">Kalender</Link>
        <Link href="/diary">Tagebuch</Link>
        <Link href="/forum">Forum</Link>
        <Link href="/admin">Admin</Link>
      </nav>

      <button
        className={`hamb ${open ? "is-open" : ""}`}
        aria-label="Menü"
        onClick={()=>setOpen(v=>!v)}
      >
        <span/><span/><span/>
      </button>

      <style jsx>{`
        .site-header{position:sticky;top:0;z-index:50;display:flex;align-items:center;gap:12px;padding:12px 16px;background:#eaf5e8;border-bottom:1px solid #d8ebd9}
        .logo{font-weight:800;font-size:22px}
        .spacer{flex:1}
        .nav{display:flex;gap:16px}
        .nav a{padding:8px 10px;border-radius:10px}
        .nav a:hover{background:#dff0e0}
        .hamb{display:none;position:relative;width:44px;height:36px;border:1px solid #cbdccb;border-radius:12px;background:#fff}
        .hamb span{position:absolute;left:10px;right:10px;height:2px;background:#2b4630;border-radius:2px;transition:transform .25s,opacity .2s,top .25s}
        .hamb span:nth-child(1){top:11px}
        .hamb span:nth-child(2){top:17px}
        .hamb span:nth-child(3){top:23px}
        .hamb.is-open span:nth-child(1){top:17px;transform:rotate(45deg)}
        .hamb.is-open span:nth-child(2){opacity:0}
        .hamb.is-open span:nth-child(3){top:17px;transform:rotate(-45deg)}
        @media (max-width: 860px){
          .nav{position:absolute;right:12px;top:60px;flex-direction:column;gap:10px;background:#fff;border:1px solid #dbe7dc;border-radius:14px;padding:12px;box-shadow:0 10px 30px #0001;display:none}
          .nav.open{display:flex}
          .hamb{display:block}
        }
      `}</style>
    </header>
  );
}
