import { useState } from 'react';
import Link from 'next/link';
import { FiMenu, FiX, FiCalendar, FiBookOpen, FiMessageCircle, FiInbox, FiSettings, FiHome, FiExternalLink } from 'react-icons/fi';

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header style={{position:'sticky',top:0,zIndex:40,background:'rgba(13,17,23,.7)',backdropFilter:'blur(8px)',borderBottom:'1px solid rgba(255,255,255,.08)'}}>
        <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 24px'}}>
          <Link href="/"><a style={{display:'flex',gap:10,alignItems:'center',fontWeight:800,fontSize:22}}>
            <span style={{fontSize:28}}>🌱</span> Greenbuddy
          </a></Link>
          <button className="btn ghost" onClick={()=>setOpen(true)}><FiMenu size={20} /> Menü</button>
        </div>
      </header>

      <div className={`nav ${open?'open':''}`}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
          <div style={{fontWeight:800, fontSize:20}}>Menü</div>
          <button className="btn ghost" onClick={()=>setOpen(false)}><FiX size={20}/> Schließen</button>
        </div>
        <div className="hr" />
        <nav className="grid" style={{gap:10}}>
          <NavLink href="/app" icon={<FiHome/>} label="Start (Pflanze)" onClick={()=>setOpen(false)} />
          <NavLink href="/calendar" icon={<FiCalendar/>} label="Kalender" onClick={()=>setOpen(false)} />
          <NavLink href="/diary" icon={<FiBookOpen/>} label="Tagebuch" onClick={()=>setOpen(false)} />
          <NavLink href="/forum" icon={<FiMessageCircle/>} label="Forum" onClick={()=>setOpen(false)} />
          <NavLink href="/inbox" icon={<FiInbox/>} label="Inbox (Gutscheine)" onClick={()=>setOpen(false)} />
          <NavLink href="/account" icon={<FiSettings/>} label="Konto" onClick={()=>setOpen(false)} />
          <a className="btn ghost" href="https://tvoj-eshop.tld" target="_blank" rel="noreferrer"><FiExternalLink/> Shop</a>
          <a className="btn ghost" href="https://tvoj-eshop.tld/blog" target="_blank" rel="noreferrer"><FiExternalLink/> Blog</a>
        </nav>
      </div>
      <div className={`nav-backdrop ${open?'show':''}`} onClick={()=>setOpen(false)} />

      <main className="container" style={{padding:'26px 24px'}}>{children}</main>
    </>
  );
}

function NavLink({href, icon, label, onClick}) {
  return (
    <Link href={href}>
      <a className="btn" style={{display:'flex',gap:10,alignItems:'center'}} onClick={onClick}>
        <span style={{display:'grid',placeItems:'center'}}>{icon}</span> {label}
      </a>
    </Link>
  );
}
