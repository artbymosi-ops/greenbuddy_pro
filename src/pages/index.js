import Link from 'next/link';
import Layout from '@/components/Layout';

export default function Home() {
  return (
    <Layout>
      <section className="hero">
        <div>
          <div className="badge">Neu • Beta</div>
          <h1 className="title">Greenbuddy – deine interaktive Zimmerpflanze</h1>
          <p className="subtitle">Gieße, dünge, sprühe, verpflanze. Lerne über Pflege, erkenne Schädlinge – mit AI-Coach direkt in der App.</p>
          <div style={{display:'flex',gap:12,marginTop:18}}>
            <Link href="/app"><a className="btn">Start</a></Link>
            <Link href="/auth/login"><a className="btn ghost">Anmelden</a></Link>
          </div>
        </div>
        <div className="card" style={{display:'grid',placeItems:'center'}}>
          <img src="https://em-content.zobj.net/source/microsoft-teams/363/seedling_1f331.png" alt="" width="220" height="220" />
        </div>
      </section>
    </Layout>
  );
}
