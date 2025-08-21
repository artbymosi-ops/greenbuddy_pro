          import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function LangSwitch() {
  const [val, setVal] = useState("de");
  return (
    <select
      className="select"
      value={val}
      onChange={(e) => setVal(e.target.value)}
      aria-label="Sprache"
    >
      <option value="de">Deutsch</option>
      <option value="sk">Slovenčina</option>
    </select>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // zavrieť menu pri kliku mimo
  useEffect(() => {
    function onDoc(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  // klávesa ESC
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <nav className="nav">
      <div className="nav-inner container">
        <Link href="/" className="brand">
          <span className="brand-badge" aria-hidden />
          Greenbuddy
        </Link>

        <div className="h-right" style={{ display: "flex", gap: 10 }}>
          <LangSwitch />
          <button
            aria-label="Menü"
            className={`hamb ${open ? "is-open" : ""} menu-btn`}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden>≡</span>
          </button>
        </div>

        <div ref={ref} className={`menu ${open ? "open" : ""}`}>
          <ul>
            <li><Link href="/" onClick={() => setOpen(false)}>Start</Link></li>
            <li><Link href="/plant" onClick={() => setOpen(false)}>Meine Pflanze</Link></li>
            <li><Link href="/calendar" onClick={() => setOpen(false)}>Kalender</Link></li>
            <li><Link href="/diary" onClick={() => setOpen(false)}>Tagebuch</Link></li>
            <li><Link href="/forum" onClick={() => setOpen(false)}>Forum</Link></li>
            <li><Link href="/admin" onClick={() => setOpen(false)}>Admin</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
