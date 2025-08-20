import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import ReactionBar from "@/components/ReactionBar";
import CommentList from "@/components/CommentList";

let supabase=null;
if(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY){
  import("@supabase/supabase-js").then(({createClient})=>{
    supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  });
}

export default function PostDetailPage(){
  const { query:{id} } = useRouter();
  const [post,setPost]=useState(null);
  const [reporting,setReporting]=useState(false);
  const [msg,setMsg]=useState("");

  useEffect(()=>{
    (async()=>{
      if(!id) return;
      // local fallback
      const local = JSON.parse(localStorage.getItem("gb_forum_local")||"[]").find(p=>String(p._localId)===String(id));
      if(local) setPost(local);

      if(!supabase) return;
      const { data } = await supabase.from("forum_posts").select("*").eq("id", id).maybeSingle();
      if(data) setPost(data);
    })();
  },[id]);

  async function report(){
    if(!supabase || !post?.id) return;
    setReporting(true);
    const { data:{ user } } = await supabase.auth.getUser();
    await supabase.from("forum_reports").insert({
      post_id: post.id, user_id: user?.id || null, reason: "Manuell gemeldet"
    });
    setReporting(false);
    setMsg("Danke für deine Meldung. Admin prüft den Beitrag.");
  }

  if(!post) return <Layout><div className="card">Lade…</div></Layout>;

  const imgs = Array.isArray(post.images)?post.images:[];
  return (
    <Layout>
      <div className="card">
        <h2 className="title" style={{marginTop:0}}>{post.title}</h2>
        <div className="subtitle">{post.author_name || "User"} · {new Date(post.created_at).toLocaleString("de-DE")}</div>
        <p style={{whiteSpace:"pre-wrap"}}>{post.body}</p>
        {imgs.length>0 && (
          <div className="grid" style={{gap:8, marginTop:8}}>
            {imgs.map((url,i)=>(
              <img key={i} src={url} alt="Foto" style={{width:"100%", maxWidth:220, aspectRatio:"1/1", objectFit:"cover", borderRadius:12}}/>
            ))}
          </div>
        )}
        <ReactionBar post={post}/>
        <div style={{display:"flex",gap:8, marginTop:12}}>
          <button className="btn ghost" onClick={report} disabled={reporting}>Beitrag melden</button>
          {msg && <div className="subtitle">{msg}</div>}
        </div>
      </div>

      <CommentList postId={post.id ?? post._localId}/>
    </Layout>
  );
}
