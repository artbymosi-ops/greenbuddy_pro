import { useState } from 'react'
import Link from 'next/link'

export default function Layout({ children, user, onLogout }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <header className="app">
        <div className="brand"><span style={{fontSize:24}}>🌱</span><b>Greenbuddy</b></div>
        <div className="nav">
          <button className="menuBtn" onClick={()=>setOpen(!open)}>{open?'–':'☰'}</button>
        </div>
      </header>
      {open && (
        <nav style={{maxWidth:1100, margin:'0 auto 12px', padding:'0 16px'}}>
          <div className="card" style={{display:'flex',flexWrap:'wrap',gap:10}}>
            <Link className="btn alt" href="/app">Tamagotchi</Link>
            <Link className="btn alt" href="/calendar">Kalender</Link>
            <Link className="btn alt" href="/diary">Tagebuch</Link>
            <Link className="btn alt" href="/forum">Forum</Link>
            <Link className="btn alt" href="/inbox">Inbox</Link>
            <a className="btn alt" href="https://example-shop" target="_blank" rel="noreferrer">Shop</a>
            <a className="btn alt" href="https://example-blog" target="_blank" rel="noreferrer">Blog</a>
            <Link className="btn alt" href="/account">Konto</Link>
            <button className="btn" onClick={onLogout}>Abmelden</button>
          </div>
        </nav>
      )}
      <main className="app">{children}</main>
    </>
  )
}
