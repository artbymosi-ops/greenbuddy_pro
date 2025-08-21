import { REACTIONS } from "@/lib/emojiReactions";
import { useEffect, useState } from "react";

let supabase=null;
if(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY){
  import("@supabase/supabase-js").then(({createClient})=>{
    supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  });
}
import { REACTIONS } from "@/lib/emojiReactions";
const SAFE_REACTIONS = Array.isArray(REACTIONS) && REACTIONS.length ? REACTIONS : [
  { id: "like", emoji: "👍", label: "Like" },
  { id: "love", emoji: "❤️", label: "Love" },
];
export default function ReactionBar({ post, onReact }){
  const [counts, setCounts] = useState({}); // {emoji: n}
  const [mine, setMine]     = useState({}); // {emoji: true}

  useEffect(()=>{
    (async ()=>{
      if(!supabase || !post.id) return;
      const { data } = await supabase
        .from("forum_reactions")
        .select("emoji,user_id")
        .eq("post_id", post.id);
      const c = {}; const m = {};
      const { data:{ user } } = await supabase.auth.getUser();
      for(const r of (data||[])){ c[r.emoji]=(c[r.emoji]||0)+1; if(user && r.user_id===user.id){ m[r.emoji]=true; } }
      setCounts(c); setMine(m);
    })();
  },[post.id]);

  async function toggle(emoji){
    // offline – len UI
    if(!supabase || !post.id){ setCounts(s=>({...s,[emoji]: (s[emoji]||0) + (mine[emoji]? -1 : 1)})); setMine(m=>({...m, [emoji]:!m[emoji]})); return; }

    const { data:{ user } } = await supabase.auth.getUser();
    if(!user) return;

    if(mine[emoji]){
      await supabase.from("forum_reactions").delete().eq("post_id",post.id).eq("emoji",emoji).eq("user_id",user.id);
      setMine(m=>({...m,[emoji]:false})); setCounts(s=>({...s,[emoji]:Math.max(0,(s[emoji]||1)-1)}));
    }else{
      await supabase.from("forum_reactions").insert({ post_id:post.id, user_id:user.id, emoji });
      setMine(m=>({...m,[emoji]:true})); setCounts(s=>({...s,[emoji]:(s[emoji]||0)+1}));
    }
    onReact?.(emoji);
  }

  return (
    <div style={{display:"flex", gap:8, flexWrap:"wrap", marginTop:8}}>
      {REACTIONS.map(e=>(
        <button key={e} className="btn ghost" onClick={()=>toggle(e)}>
          {e} {counts[e]>0 ? counts[e] : ""}
        </button>
      ))}
    </div>
  );
}
