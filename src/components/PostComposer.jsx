import { useState } from "react";

let supabase = null;
if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  import("@supabase/supabase-js").then(({ createClient }) => {
    supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  });
}

const SELL_RE = /(preda(m|j)|kúpim|na\s*predaj|for\s*sale|verkaufe|zu\s*verkaufen)/i;

export default function PostComposer({ onCreated }) {
  const [title, setTitle]   = useState("");
  const [body, setBody]     = useState("");
  const [files, setFiles]   = useState([]);
  const [loading, setLoading]=useState(false);
  const [warn, setWarn]     = useState("");

  function validate() {
    if (!title.trim()) return "Bitte füge einen Titel hinzu.";
    if (SELL_RE.test(title) || SELL_RE.test(body)) return "Verkauf/Ankauf ist im Forum nicht erlaubt.";
    return "";
  }

  async function upload(filesArr) {
    if (!supabase || !filesArr?.length) return [];
    const { data:{ user } } = await supabase.auth.getUser();
    if (!user) return [];
    const urls = [];
    for (const f of filesArr) {
      const ext = (f.name.split(".").pop() || "jpg").toLowerCase();
      const path = `forum/${user.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("forum").upload(path, f, { upsert:false });
      if (!error) {
        const { data } = supabase.storage.from("forum").getPublicUrl(path);
        urls.push(data.publicUrl);
      }
    }
    return urls;
  }

  async function submit(e){
    e.preventDefault();
    const v = validate();
    if (v) { setWarn(v); return; }
    setWarn("");
    setLoading(true);

    // offline skica do localStorage
    if (!supabase) {
      const draft = { _localId: crypto.randomUUID(), title, body, images: [], created_at: new Date().toISOString(), author_name: "Du" };
      const list = JSON.parse(localStorage.getItem("gb_forum_local") || "[]");
      localStorage.setItem("gb_forum_local", JSON.stringify([draft, ...list]));
      setLoading(false); setTitle(""); setBody(""); setFiles([]); onCreated?.(draft); return;
    }

    const { data:{ user } } = await supabase.auth.getUser();
    if (!user) { setWarn("Bitte einloggen."); setLoading(false); return; }

    const images = await upload(files);

    const { data:post, error } = await supabase.from("forum_posts").insert({
      user_id: user.id, title: title.trim(), body: body.trim(), images, hidden:false
    }).select().single();

    setLoading(false);
    if (error) { setWarn("Fehler beim Speichern."); return; }
    setTitle(""); setBody(""); setFiles([]); onCreated?.(post);
  }

  return (
    <form onSubmit={submit} className="card" style={{marginBottom:12}}>
      <h3 style={{marginTop:0}}>Beitrag erstellen</h3>
      {warn && <div className="subtitle" style={{color:"#b00"}}>{warn}</div>}
      <input className="input" placeholder="Titel" value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea className="input" rows={4} placeholder="Beschreibe deine Pflanze, Pflege, Tipps…"
        value={body} onChange={e=>setBody(e.target.value)} />
      <input className="input" type="file" multiple accept="image/*" onChange={e=>setFiles([...e.target.files])} />
      <button className="btn" type="submit" disabled={loading}>{loading?"Lade hoch…":"Posten"}</button>
      <p className="subtitle" style={{marginTop:8}}>Regeln: Keine Verkäufe/Ankäufe. Respektvoll bleiben. Keine Werbung/Spam.</p>
    </form>
  );
}
