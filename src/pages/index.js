import Layout from '@/components/Layout';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Layout title="">
        <div className="hero">
          <div className="card">
            <h1>Greenbuddy – deine <span style={{color:'var(--brand)'}}>virtuelle Monstera</span> ♥</h1>
            <p>Pflege, lerne, spiele. Dein Buddy reagiert auf Gießen, Düngen, Sprühen und Umtopfen – wächst, freut sich oder wird traurig. Mit Chat-Tipps & Mini-Animationen.</p>
            <div style={{display:'flex',gap:10}}>
              <Link className="btn" href="/plant">Start</Link>
              <Link className="btn btn-ghost" href="/auth/login">Anmelden</Link>
            </div>
            <div style={{marginTop:8,fontSize:12,opacity:.7}}>
              Admin? <Link href="/admin/login">hier einloggen</Link>
            </div>
          </div>
          <div className="card">
            <img alt="Greenbuddy teaser" src="https://images.unsplash.com/photo-1524594227084-41a4a6f6e196?q=80&w=900&auto=format&fit=crop" style={{width:'100%',borderRadius:16}} />
          </div>
        </div>
      </Layout>
    </>
  );
}
