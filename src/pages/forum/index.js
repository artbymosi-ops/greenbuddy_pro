import { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import PostComposer from "@/components/PostComposer";
import ForumPostCard from "@/components/ForumPostCard";

let supabase=null;
if(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY){
  import("@supabase/supabase-js").then(({createClient})=>{
    supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  });
}

export default function ForumPage(){
  const [q,setQ]=useState("");
  const [posts,setPosts]=useState([]);

  useEffect(()=>{
    // local fallback
    const local = JSON.parse(localStorage.getItem("gb_forum_local")||"[]");
    setPosts(local);

    (async()=>{
      if(!supabase) return;
      const { data } = await supabase.from("forum_posts").select("*").eq("hidden", false).order("created_at",{ascending:false});
      if(data) setPosts(data);
      supabase.channel("forum_posts")
        .on("postgres_changes",{event:"*",schema:"public",table:"forum_posts"}, payload=>{
          setPosts(prev=>{
            if(payload.eventType==="INSERT") return [payload.new, ...prev];
            if(payload.eventType==="DELETE") return prev.filter(p=>p.id!==payload.old.id);
            if(payload.eventType==="UPDATE"){
              const arr = prev.map(p=>p.id===payload.new.id?payload.new:p);
              // skryté z feedu
              return arr.filter(p=>!p.hidden);
            }
            return prev;
          });
        }).subscribe();
    })();
  },[]);

  const filtered = useMemo(()=>{
    if(!q.trim()) return posts;
    const s = q.toLowerCase();
    return posts.filter(p => (p.title||"").toLowerCase().includes(s) || (p.body||"").toLowerCase().includes(s));
  },[posts,q]);

  return (
    <Layout>
      <div className="card">
        <h2 className="title" style={{marginTop:0}}>Forum</h2>
        <p className="subtitle">Teile Fotos, Tipps und frage die Community. Keine Verkäufe/Ankäufe.</p>
        <input className="input" placeholder="Suche im Forum…" value={q} onChange={e=>setQ(e.target.value)} />
      </div>

      <PostComposer onCreated={(p)=>setPosts(prev=>[p,...prev])} />

      {filtered.length===0 && <div className="card">Keine Beiträge gefunden.</div>}
      {filtered.map(p=>(
        <ForumPostCard key={p.id ?? p._localId} post={p}/>
      ))}
    </Layout>
  );
}
