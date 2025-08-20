import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

let supabase=null;
if(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY){
  import("@supabase/supabase-js").then(({createClient})=>{
    supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  });
}

export default function AdminForum(){
  const [me,setMe]=useState(null);
  const [reports,setReports]=useState([]);
  const [posts,setPosts]=useState([]);

  useEffect(()=>{
    (async()=>{
      if(!supabase) return;
      const { data:{ user } } = await supabase.auth.getUser();
      if(!user){ return; }
      const prof = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      setMe({ user, is_admin: !!prof.data?.is_admin });

      const r = await supabase.from("forum_reports").select("*, forum_posts(*)").order("created_at",{ascending:false});
      if(!r.error && r.data) setReports(r.data);

      const p = await supabase.from("forum_posts").select("*").order("created_at",{ascending:false}).limit(200);
      if(!p.error && p.data) setPosts(p.data);
    })();
  },[]);

  async function hide(p, hidden){
    await supabase.from("forum_posts").update({hidden}).eq("id", p.id);
    setPosts(prev=>prev.map(x=>x.id===p.id?{...x,hidden}:x));
  }
  async function remove(p){
    await supabase.from("forum_posts").delete().eq("id", p.id);
    setPosts(prev=>prev.filter(x=>x.id!==p.id));
    setReports(prev=>prev.filter(r=>r.post_id!==p.id));
  }

  if(me && !me.is_admin) return <Layout><div className="card">Nur für Admin.</div></Layout>;

  return (
    <Layout>
      <div className="card">
        <h2 className="title" style={{marginTop:0}}>Admin · Forum Moderation</h2>
        <p className="subtitle">Gemeldete Beiträge und Moderationsaktionen.</p>
      </div>

      <div className="card">
        <h3 style={{marginTop:0}}>Meldungen</h3>
        <ul className="ev-list">
          {reports.length===0 && <li className="empty">Keine Meldungen.</li>}
          {reports.map(r=>(
            <li key={r.id}>
              <div>
                <div className="ev-title">#{r.post_id} · {new Date(r.created_at).toLocaleString("de-DE")}</div>
                <div className="subtitle">{r.reason || "—"}</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <a className="btn ghost" href={`/forum/${r.post_id}`}>Öffnen</a>
                <button className="btn" onClick={()=>hide(r.forum_posts, !r.forum_posts.hidden)}>
                  {r.forum_posts.hidden? "Sichtbar machen" : "Verstecken"}
                </button>
                <button className="btn danger" onClick={()=>remove(r.forum_posts)}>Löschen</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="card" style={{marginTop:12}}>
        <h3 style={{marginTop:0}}>Alle Beiträge</h3>
        <ul className="ev-list">
          {posts.map(p=>(
            <li key={p.id}>
              <div>
                <div className="ev-title">{p.title} {p.hidden ? "· (versteckt)" : ""}</div>
                <div className="subtitle">{new Date(p.created_at).toLocaleString("de-DE")}</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <a className="btn ghost" href={`/forum/${p.id}`}>Öffnen</a>
                <button className="btn" onClick={()=>hide(p, !p.hidden)}>{p.hidden ? "Sichtbar" : "Verstecken"}</button>
                <button className="btn danger" onClick={()=>remove(p)}>Löschen</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
                                     }
