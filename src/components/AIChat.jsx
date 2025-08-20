import { useEffect, useRef, useState } from "react";

export default function AIChat({ seedPrompt = "Meine Pflanze hat gelbe Blätter – was tun?", plantContext }) {
  const [msgs, setMsgs] = useState([
    { role: "assistant", content: "Hi! Ich bin Greenbuddy 🌿. Wie kann ich deiner Pflanze helfen?" }
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [attach, setAttach] = useState([]); // File[]
  const listRef = useRef(null);

  useEffect(()=>{
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  },[msgs, busy]);

  async function send(e){
    e?.preventDefault?.();
    const text = input.trim();
    if(!text && attach.length===0) return;

    const userMsg = { role:"user", content:text || "(Bild gesendet)" };
    setMsgs(prev => [...prev, userMsg]);
    setInput("");
    setBusy(true);

    // upload priložených fotiek do dočasných URL (dataURL fallback)
    const imageUrls = [];
    for (const f of attach) {
      const url = await toDataURL(f);
      imageUrls.push(url);
    }
    setAttach([]);

    try{
      const res = await fetch("/api/chat", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          messages: msgs.concat([userMsg]),
          context: { plant: plantContext || null },
          images: imageUrls // ak budeš chcieť, vymeníme za Supabase public URL
        })
      });
      const data = await res.json();
      const reply = data.reply || "Entschuldige, ich konnte gerade nicht antworten.";
      setMsgs(prev => [...prev, { role:"assistant", content: reply }]);
    }catch(err){
      setMsgs(prev => [...prev, { role:"assistant", content: "Ups, da lief etwas schief. Bitte versuch es erneut." }]);
    }finally{
      setBusy(false);
    }
  }

  return (
    <div className="card" style={{display:"grid", gridTemplateRows:"auto 1fr auto", gap:12, height:520}}>
      <div>
        <h3 style={{marginTop:0}}>Pflanzenhilfe (AI)</h3>
        <p className="subtitle">Frag mich alles zu Pflege, Diagnose, Gießen, Düngen, Umtopfen und Schädlingen.</p>
      </div>

      <div ref={listRef} style={{overflowY:"auto", paddingRight:6}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex", justifyContent: m.role==="user"?"flex-end":"flex-start", marginBottom:8}}>
            <div style={{
              maxWidth:"78%",
              padding:"10px 12px",
              borderRadius:12,
              background: m.role==="user" ? "rgba(91,191,122,.15)" : "rgba(255,255,255,.06)",
              border: "1px solid rgba(255,255,255,.08)",
              whiteSpace:"pre-wrap"
            }}>{m.content}</div>
          </div>
        ))}
        {busy && <div className="subtitle">Denke nach…</div>}
      </div>

      <form onSubmit={send} className="ev-form" style={{display:"grid", gridTemplateColumns:"1fr auto", gap:8}}>
        <div style={{display:"grid", gap:6}}>
          <input className="input" placeholder={seedPrompt} value={input} onChange={e=>setInput(e.target.value)} />
          <input className="input" type="file" multiple accept="image/*" onChange={(e)=>setAttach([...e.target.files])} />
        </div>
        <button className="btn" disabled={busy} type="submit">{busy?"Sende…":"Senden"}</button>
      </form>
    </div>
  );
}

function toDataURL(file){
  return new Promise((res, rej)=>{
    const r = new FileReader();
    r.onload = ()=>res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}
<AIChat plantContext={{
  species: "Monstera deliciosa",
  light: "hell, indirekt",
  watering: "alle 5 Tage",
  lastActions: "gesprüht gestern, gedüngt vor 2 Wochen"
}}/>
