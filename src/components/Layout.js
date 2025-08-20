import { useState } from 'react';
import Link from 'next/link';

export default function Layout({ title = 'Greenbuddy', children }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="nav">
        <div className="nav-inner container">
          <Link href="/" className="brand">
            <span className="brand-badge" />
            <span>Greenbuddy</span>
          </Link>
          <button className="menu-btn" onClick={() => setOpen(v => !v)} aria-label="Menu">
            ☰
          </button>
          <div className={`menu ${open ? 'open' : ''}`}>
            <ul onClick={()=>setOpen(false)}>
              <li><Link href="/plant">Mein Greenbuddy</Link></li>
              <li><Link href="/calendar">Kalender</Link></li>
              <li><Link href="/diary">Tagebuch</Link></li>
              <li><Link href="/forum">Forum</Link></li>
              <li><Link href="/inbox">Inbox</Link></li>
              <li><Link href="/account">Konto</Link></li>
              <li><a href="https://tvoj-eshop.tld" target="_blank">Shop</a></li>
              <li><a href="https://tvoj-eshop.tld/blog" target="_blank">Blog</a></li>
              <li><Link href="/admin">Admin</Link></li>
              <li><Link href="/auth/login">Abmelden</Link></li>
            </ul>
          </div>
        </div>
      </nav>
      <main className="main container">
        {title ? <div className="card" style={{marginBottom:12}}><h2 className="title">{title}</h2></div> : null}
        {children}
      </main>
    </>
  );
}
