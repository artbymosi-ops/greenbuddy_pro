import Link from 'next/link'

export default function Landing(){
  return (
    <>
      <header className="app">
        <div className="brand"><span style={{fontSize:26}}>🌱</span><b>Greenbuddy</b></div>
        <nav><Link className="link" href="/auth/login">Anmelden</Link></nav>
      </header>
      <main className="app">
        <section className="card" style={{textAlign:'center', padding:'60px 20px'}}>
          <h1 style={{fontSize:42, margin:'6px 0'}}>Greenbuddy – deine lebendige Monstera</h1>
          <p style={{opacity:.85, maxWidth:680, margin:'0 auto 14px'}}>
            Pflege sie wie ein Tamagotchi: Gießen, Düngen, Umtopfen, Sprühen. Sie wächst, freut sich,
            wird traurig – und berät dich (AI) bei allen Pflanzenfragen. Mit Kalender, Tagebuch, Forum und mehr.
          </p>
          <Link className="btn" href="/auth/login">Start</Link>
          <div style={{marginTop:14}}>
            <Link className="small muted" href="/admin/login">Admin-Login</Link>
          </div>
        </section>
      </main>
    </>
  )
}
