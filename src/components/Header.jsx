import { useState } from "react";
import LangSwitch from "./LangSwitch";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="nav-inner">
        {/* logo/brand */}
        <div className="brand">🌱 Greenbuddy</div>

        {/* pravá strana */}
        <div className="h-right">
          <LangSwitch />

          {/* hamburger */}
          <button
            className={`hamb ${open ? "is-open" : ""}`}
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* mobilné menu */}
      {open && (
        <nav className="menu open">
          <ul>
            <li><a href="/">Domov</a></li>
            <li><a href="/meine-pflanze">Moja rastlina</a></li>
            <li><a href="/kalender">Kalendár</a></li>
            <li><a href="/tagebuch">Denník</a></li>
            <li><a href="/forum">Fórum</a></li>
            <li><a href="/admin">Admin</a></li>
          </ul>
        </nav>
      )}
    </header>
  );
      }
