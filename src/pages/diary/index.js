import { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";

// Lazy supabase – aby build nepadal bez env
let supabase = null;
if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  import("@supabase/supabase-js").then(({ createClient }) => {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  });
}

const fmtDate = (v) => new Date(v).toISOString().slice(0, 10);

export default function DiaryPage() {
  const [plants, setPlants] = useState([]);
  const [entries, setEntries] = useState([]);
  const [filterPlant, setFilterPlant] = useState("all");
  const [saving, setSaving] = useState(false);

  const [date, setDate] = useState(fmtDate(new Date()));
  const [plantId, setPlantId] = useState("");
  const [plantName, setPlantName] = useState("");
  const [height, setHeight] = useState("");
  const [note, setNote] = useState("");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    try { setPlants(JSON.parse(localStorage.getItem("gb_plants") || "[]")); } catch {}
    (async () => {
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("plants").select("*").order("inserted_at");
      if (data) setPlants(data);
    })();
  }, []);

  useEffect(() => { try { setEntries(JSON.parse(localStorage.getItem("gb_diary") || "[]")); } catch {} }, []);
  useEffect(() => { localStorage.setItem("gb_diary", JSON.stringify(entries)); }, [entries]);

  useEffect(() => {
    let sub;
    (async () => {
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("diary_entries").select("*").order("date",{ascending:false});
      if (data) setEntries(data);
      sub = supabase.channel("diary_entries")
        .on("postgres_changes",{event:"*",schema:"public",table:"diary_entries"}, payload => {
          setEntries(prev=>{
            const t = payload.eventType;
            if (t==="INSERT") return [payload.new,...prev];
            if (t==="DELETE") return prev.filter(e=>e.id!==payload.old.id);
            if (t==="UPDATE") return prev.map(e=>e.id===payload.new.id?payload.new:e);
            return prev;
          });
        }).subscribe();
    })();
    return ()=>sub?.unsubscribe();
  }, []);

  const plantLabel = (id) => {
    const p = plants.find(p => (p.id ?? p._localId) === id);
    if (!p) return plantName || "";
    return `${p.emoji || "🌿"} ${p.name}`;
  };

  async function uploadPhotos(filesArr){
    if (!filesArr?.length) return [];
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const urls=[];
        for (const f of filesArr){
          const ext = f.name.split(".").pop() || "jpg";
          const path = `${user.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
          const { error } = await supabase.storage.from("diary").upload(path,f,{upsert:false});
          if (!error){
            const { data } = supabase.storage.from("diary").getPublicUrl(path);
            urls.push(data.publicUrl);
          }
        }
        return urls;
      }
    }
    const toDataUrl = (file) => new Promise(res=>{ const r=new FileReader(); r.onload=()=>res(r.result); r.readAsDataURL(file); });
    const out=[]; for (const f of filesArr) out.push(await toDataUrl(f)); return out;
  }

  async function addEntry(e){
    e.preventDefault(); setSaving(true);
    const photos = await uploadPhotos(files);
    const payload = {
      date, plant_id: typeof plantId==="number"?plantId:null,
      plant_name: plantId ? plantLabel(plantId) : (plantName || ""),
      height_cm: height ? Number(height) : null,
      note: note || "", photos
    };
    if (supabase){
      const { data: { user } } = await supabase.auth.getUser();
      if (user){
        const { data, error } = await supabase.from("diary_entries").insert({ ...payload, user_id:user.id }).select().single();
        setSaving(false);
        if (!error && data){ setEntries(prev=>[data,...prev]); resetForm(); return; }
      }
    }
    setEntries(prev=>[{ _localId: crypto.randomUUID(), ...payload }, ...prev]);
    setSaving(false); resetForm();
  }

  function resetForm(){ setDate(fmtDate(new Date())); setPlantId(""); setPlantName(""); setHeight(""); setNote(""); setFiles([]); }

  async function deleteEntry(entry){
    if (supabase && entry.id){ await supabase.from("diary_entries").delete().eq("id", entry.id); }
    setEntries(prev => prev.filter(e => (e.id ?? e._localId) !== (entry.id ?? entry._localId)));
  }

  const filtered = useMemo(()=>entries.filter(e => filterPlant==="all"?true:(String(e.plant_id ?? "")===String(filterPlant))),[entries,filterPlant]);

  return (
    <Layout>
      <div className="card">
        <h2 className="title" style={{marginTop:0}}>Tagebuch</h2>
        <p className="subtitle">Notiere Wachstum, Pflege und hänge Fotos an. Perfekt für <i>Vorher/Nachher</i>.</p>

        <form onSubmit={addEntry} className="ev-form" style={{marginTop:12}}>
          <div className="grid grid-3" style={{gap:12}}>
            <div>
              <label className="subtitle">Datum</label>
              <input type="date" className="input" value={date} onChange={e=>setDate(e.target.value)} />
            </div>
            <div>
              <label className="subtitle">Pflanze</label>
              <select className="input" value={plantId} onChange={(e)=>{ const v=e.target.value; setPlantId(v); if(v) setPlantName(""); }}>
                <option value="">— auswählen (oder freien Namen unten) —</option>
                {plants.map(p=>(
                  <option key={p.id ?? p._localId} value={p.id ?? p._localId}>
                    {(p.emoji || "🌿")} {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="subtitle">Höhe (cm)</label>
              <input className="input" type="number" min="0" step="0.5" value={height} onChange={e=>setHeight(e.target.value)} placeholder="z. B. 42" />
            </div>
          </div>

          <div className="grid" style={{gap:12, marginTop:12}}>
            <div>
              <label className="subtitle">Freier Pflanzenname (falls nicht in der Liste)</label>
              <input className="input" value={plantName} onChange={e=>{ setPlantName(e.target.value); setPlantId(""); }} placeholder="z. B. Monstera im Büro" />
            </div>
            <div>
              <label className="subtitle">Fotos (Vorher/Nachher möglich)</label>
              <input className="input" type="file" multiple accept="image/*" onChange={e=>setFiles([...e.target.files])}/>
              {files?.length>0 && <div className="subtitle" style={{marginTop:4}}>{files.length} Datei(en) ausgewählt</div>}
            </div>
          </div>

          <label className="subtitle" style={{marginTop:12}}>Notiz</label>
          <textarea className="input" rows={4} value={note} onChange={e=>setNote(e.target.value)} placeholder="Wie geht’s der Pflanze? Pflege, Standort, Beobachtungen …" />
          <button className="btn" type="submit" disabled={saving} style={{marginTop:12}}>{saving ? "Speichere…" : "Eintrag hinzufügen"}</button>
        </form>
      </div>

      <div className="card" style={{marginTop:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h3 className="title" style={{marginTop:0}}>Chronik</h3>
          <select className="input" style={{maxWidth:260}} value={filterPlant} onChange={e=>setFilterPlant(e.target.value)}>
            <option value="all">Alle Pflanzen</option>
            {plants.map(p=>(
              <option key={p.id ?? p._localId} value={p.id ?? p._localId}>
                {(p.emoji || "🌿")} {p.name}
              </option>
            ))}
          </select>
        </div>

        <ul className="ev-list" style={{marginTop:8}}>
          {filtered.length===0 && <li className="empty">Noch keine Einträge.</li>}
          {filtered.map(entry=>(
            <li key={entry.id ?? entry._localId} style={{alignItems:"flex-start"}}>
              <div>
                <div className="ev-title">
                  {entry.plant_id ? (
                    <a className="ev-tag" href={`/plants/${entry.plant_id}`} style={{textDecoration:"none"}}>
                      {entry.plant_name || plantLabel(entry.plant_id)}
                    </a>
                  ) : (
                    <span className="ev-tag">{entry.plant_name || plantLabel(entry.plant_id)}</span>
                  )}
                  {new Date(entry.date).toLocaleDateString("de-DE")}
                </div>
                <div className="subtitle" style={{marginTop:4}}>
                  {entry.height_cm ? `Höhe: ${entry.height_cm} cm` : null}
                </div>
                {entry.note && <p style={{marginTop:8, whiteSpace:"pre-wrap"}}>{entry.note}</p>}
                {Array.isArray(entry.photos) && entry.photos.length > 0 && (
                  <div className="grid" style={{gap:8, marginTop:10}}>
                    {entry.photos.map((url, i)=>(
                      <img key={i} src={url} alt="Foto" style={{ width:"100%", maxWidth:220, aspectRatio:"1 / 1", objectFit:"cover", borderRadius:12, border:"1px solid rgba(0,0,0,0.06)" }}/>
                    ))}
                  </div>
                )}
              </div>
              <button className="btn ghost" onClick={()=>deleteEntry(entry)}>Löschen</button>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
              }
