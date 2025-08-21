import Link from "next/link";
import Layout from "@/components/Layout";

export default function AuthIndex(){
  return (
    <Layout title="Vitaj v Greenbuddy">
      <div className="card" style={{textAlign:"center", padding:"28px 20px"}}>
        <img src="/logo.svg" alt="" className="logo" onError={(e)=>e.currentTarget.style.display='none'} />
        <h1 className="display" style={{margin:"4px 0 8px"}}>Greenbuddy</h1>
        <p className="subtitle" style={{marginTop:0}}>
          Prihlás sa alebo si vytvor účet a poď sa starať o svoju Monsteru 🌿
        </p>
        <div style={{display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginTop:12}}>
          <Link href="/auth/login" className="btn">🔑 Prihlásiť</Link>
          <Link href="/auth/register" className="btn ghost">🆕 Registrovať</Link>
        </div>
      </div>
      <style jsx>{`
        .logo{ width:64px;height:64px; filter: drop-shadow(0 2px 6px rgba(0,0,0,.08)); }
      `}</style>
    </Layout>
  );
                    }
