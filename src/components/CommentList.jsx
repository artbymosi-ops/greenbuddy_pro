import { useEffect, useState } from "react";

let supabase=null;
if(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY){
  import("@supabase/supabase-js").then(({createClient})=>{
    supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  });
}

export default function CommentList({ postId }){
  const [items,setItems]=useState([]);
  const [text,setText]=useState("");

  useEffect(()=>{
    let sub;
    (async()=>{
      // local fallback
      const loc = JSON.parse(localStorage.getItem("gb_forum_comments")||"[]").filter(c=>c.post_id===postId);
      setItems(loc);

      if(!supabase || !postId) return;
      const { data } = await supabase.from("forum_comments").select("*").eq("post_id", postId).order("created_at");
      if(data) setItems(data);

      sub = supabase.channel("forum_comments")
        .on("postgres_changes",{event:"*",schema:"public",table:"forum_comments", filter:`post_id=eq.${postId}`}, payload=>{
          setItems(prev=>{
            if(payload.eventType==="INSERT") return [...prev,payload.new];
            if(payload.eventType==="DELETE") return prev.filter(x=>x.id!==payload.old.id);
            return prev;
          });
        }).subscribe();
    })();
    return ()=>sub?.unsubscribe();
  },[postId]);

  async function add(e){
    e.preventDefault();
    if(!text.trim()) return;

    if(!supabase){
      const item = { _localId:crypto.randomUUID(), post_id:postId, text:text.trim(), author_name:"Du", created_at:new Date().toISOString() };
      setItems(p=>[...p,item]);
      const all = JSON.parse(localStorage.getItem("gb_forum_comments")||"[]");
      localStorage.setItem("gb_forum_comments", JSON.stringify([...all,item]));
      setText(""); return;
    }
    const { data:{ user } } = await supabase.auth.getUser();
    if(!user) return;
    const { data, error } = await supabase.from("forum_comments").insert({
      post_id: postId, user_id: user.id, text: text.trim()
    }).select().single();
    if(!error && data) setItems(p=>[...p,data]);
    setText("");
  }

  return (
    <div className="card" style={{marginTop:12}}>
      <h3 style={{marginTop:0}}>Kommentare</h3>
      <ul className="ev-list" style={{marginTop:8}}>
        {items.length===0 && <li className="empty">Noch keine Kommentare.</li>}
        {items.map(c=>(
          <li key={c.id ?? c._localId}>
            <div>
              <div className="ev-title">{c.author_name || "User"} · {new Date(c.created_at).toLocaleString("de-DE")}</div>
              <div>{c.text}</div>
            </div>
          </li>
        ))}
      </ul>
      <form onSubmit={add} className="ev-form">
        <input className="input" placeholder="Schreibe einen Kommentar…" value={text} onChange={e=>setText(e.target.value)}/>
        <button className="btn" type="submit">Senden</button>
      </form>
    </div>
  );
}
