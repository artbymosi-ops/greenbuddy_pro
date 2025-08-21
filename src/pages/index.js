import Layout from "@/components/Layout";
import Link from "next/link";

export default function Home(){
  return (
    <Layout title="Greenbuddy">
      <section className="hero card">
        <div>
          <div className="badge"><span className="dot"></span> Neu • Virtuelle Pflanze</div>
          <h1>Greenbuddy – tvoje hravé rastlinky v mobile</h1>
          <p className="subtitle">
            Pestuj virtuálnu Monsteru, uč sa starostlivosť o skutočné rastliny, plánuj zalievku a zdieľaj pokroky.
          </p>
          <div style={{display:"flex", gap:12, flexWrap:"wrap", marginTop:14}}>
            <Link className="btn" href="/plants">Začať</Link>
            <Link className="btn ghost" href="/auth/login">Prihlásiť</Link>
          </div>
          <p className="subtitle" style={{marginTop:12}}>
            Admin? <Link href="/admin">Tu sa prihlás</Link>
          </p>
        </div>
        <div className="hero-visual">
          <div className="buddy">
            <div className="leaf left"></div>
            <div className="leaf right"></div>
            <div className="stem"></div>
            <div className="pot"></div>
          </div>
        </div>
      </section>
    </Layout>
  );
    }
