import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [open, setOpen] = useState(false);

  // MENU v nemčine (doplnené /plant)
  const nav = [
    { href: '/', label: 'Start' },
    { href: '/plant', label: 'Meine Pflanze' },
    { href: '/calendar', label: 'Kalender' },
    { href: '/journal', label: 'Tagebuch' },
    { href: '/forum', label: 'Forum' },
    { href: '/admin', label: 'Admin' },
  ];

  return (
    <header className="nav">
      <div className="nav-inner container">
        <div className="brand">
          <span className="brand-badge" />
          Greenbuddy
        </div>

        <div className="h-right" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* prepínač jazykov nechávame – ak nechceš, odstráň */}
          <LangSwitch />

          {/* hamburger */}
          <button
            className={`hamb ${open ? 'is-open' : ''}`}
            aria-label="Menü"
            onClick={() => setOpen(v => !v)}
          >
            <span />
            <span />
            <span />
          </button>

          {/* dropdown menu */}
          <nav className={`menu ${open ? 'open' : ''}`} onClick={() => setOpen(false)}>
            <ul>
              {nav.map(item => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

/** jednoduchý fake prepínač jazykov – ak máš vlastný, nechaj svoj */
function LangSwitch() {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState('Deutsch');
  return (
    <div style={{ position: 'relative' }}>
      <button className="select" onClick={() => setOpen(o => !o)}>{val}</button>
      {open && (
        <div className="menu open" style={{ top: 44, right: 0 }}>
          <ul>
            {['Deutsch', 'Slovenčina'].map(v => (
              <li key={v} onClick={() => { setVal(v); setOpen(false); }}>{v}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
