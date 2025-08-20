// src/pages/plants/[id].js
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import HeightChart from "@/components/HeightChart";
import BeforeAfter from "@/components/BeforeAfter";

// lazy supabase
let supabase = null;
if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  import("@supabase/supabase-js").then(({ createClient }) => {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  });
}

const fmtDate = (v) => new Date(v).toISOString().slice(0,10);

export default function PlantDetailPage(){
  const router = useRouter();
  const { id } = router.query;          // string
  const [plant, setPlant] = useState(null);
  const [entries, setEntries] = useState([]);
  const [saving, setSaving] = useState(false);

  // form
  const [date, setDate] = useState(fmtDate(new Date()));
  const [height, setHeight] = useState("");
  const [note, setNote] = useState("");
  const [files, setFiles] = useState([]);

  // load plant + entries (offline)
  useEffect(()=>{
    if(!id) return;
    try {
      const plants = JSON.parse(localStorage.getItem("gb_plants") || "[]");
      const p = plants.find(x => String(x.id ?? x._localId) === String(id));
      if(p) setPlant(p);
    } catch {}
    try {
      const all = JSON.parse(localStorage.getItem("gb_diary") || "[]");
      setEntries(all.filter(e => String(e.plant_id ?? "") === String(id) || (e.plant_name || "").includes(plant?.name || "")));
    } catch {}
  },[id]);

  // load from Supabase (if logged in)
  useEffect(()=>{
    let sub;
    (async ()=>{
      if(!supabase || !id) return;
      const { data:{ user } } = await supabase.auth.getUser();
      if(!user) return;

      const p = await supabase.from("plants").select("*").eq("id", id).single();
      if(!p.error && p.data) setPlant(p.data);

      const d = await supabase.from("diary_entries").select("*").eq("plant_id", id).order("date",{ascending:false});
      if(!d.error && d.data) setEntries(d.data);

      sub = supabase.channel("diary_entries_"+id)
        .on("postgres_changes", {event:"*", schema:"public", table:"diary_entries", filter:`plant_id=eq.${id}`}, payload=>{
          setEntries(prev=>{
            if(payload.eventType==="INSERT") return [payload.new, ...prev];
            if(payload.eventType==="DELETE") return prev.filter(e=>e.id!==payload.old.id);
            if(payload.eventType==="UPDATE") return prev.map(e=>e.id===payload.new.id?payload.new:e);
            return prev;
          });
        }).subscribe();
    })();
    return ()=>sub?.unsubscribe();
  },[id]);

  // upload photos (supabase or DataURL)
  async function uploadPhotos(filesArr){
    if(!filesArr?.length) return [];
    if(supabase){
      const { data:{ user } } = await supabase.auth.getUser();
      if(user){
        const urls = [];
        for (const f of filesArr){
          const ext = f.name.split(".").pop() || "jpg";
          const path = `${user.id}/${id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
          const { error } = await supabase.storage.from("diary").upload(path, f, { upsert:false });
          if(!error){
            const { data } = supabase.storage.from("diary").getPublicUrl(path);
            urls.push(data.publicUrl);
          }
        }
        return urls;
      }
    }
    // fallback DataURL
    const toDataUrl = (file)=> new Promise(res=>{ const r=new FileReader(); r.onload=()=>res(r.result); r.readAsDataURL(file); });
    const out = [];
    for(const f of filesArr) out.push(await toDataUrl(f));
    return out;
  }

  async function addEntry(e){
    e.preventDefault();
    setSaving(true);
    const photos = await uploadPhotos(files);

    const payload = {
      date,
      plant_id: Number.isFinite(+id) ? +id : null,
      plant_name: plant ? `${plant.emoji || "🌿"} ${plant.name}` : "",
      height_cm: height ? Number(height) : null,
      note,
      photos
    };

    if(supabase){
      const { data:{ user } } = await supabase.auth.getUser();
      if(user){
        const { data, error } = await supabase.from("diary_entries").insert({
          ...payload, user_id: user.id
        }).select().single();
        setSaving(false);
        if(!error && data){
          setEntries(prev=>[data,...prev]);
          resetForm();
          return;
        }
      }
    }
    // offline
    const local = { _localId: crypto.randomUUID(), ...payload };
    setEntries(prev=>[local, ...prev]);
    setSaving(false);
    resetForm();
    // utrž lokalny diary
    const all = JSON.parse(localStorage.getItem("gb_diary") || "[]");
    localStorage.setItem("gb_diary", JSON.stringify([local, ...all]));
  }

  function resetForm(){ setDate(fmtDate(new Date())); setHeight(""); setNote(""); setFiles([]); }

  function beforeAfterCandidates(){
    // vyber najstaršie a najnovšie foto pre pekný slider
    const all = entries.flatMap(e => (Array.isArray(e.photos) ? e.photos.map(u=>({u, d:e.date})) : []));
    if(all.length < 2) return {before:null, after:null};
    const sorted = all.sort((a,b)=> new Date(a.d) - new Date(b.d));
    return { before: sorted[0].u, after: sorted[sorted.length-1].u };
    }

  const chartData = useMemo(()=> entries
    .filter(e => e.height_cm != null)
    .map(e => ({ date: e.date, height_cm: e.height_cm }))
    , [entries]);

  const { before, after } = beforeAfterCandidates();

  return (
    <Layout>
      <div className="card">
        <button className="btn ghost" onClick={()=>router.push("/plants")}>← Zurück</button>
        <h2 className="title" style={{marginTop:8}}>
          {plant?.emoji || "🪴"} {plant?.name || "Pflanze"}
        </h2>
        {plant?.species && <p className="subtitle">{plant.species}</p>}
      </div>

      {/* Slider Vorher/Nachher */}
      {before && after && (
        <div className="card" style={{marginTop:12}}>
          <h3 style={{marginTop:0}}>Vorher / Nachher</h3>
          <BeforeAfter beforeUrl={before} afterUrl={after} height={300} />
        </div>
      )}

      {/* Graf výšky */}
      <div className="card" style={{marginTop:12}}>
        <h3 style={{marginTop:0}}>Wachstum (Höhe in cm)</h3>
        <HeightChart data={chartData}/>
      </div>

      {/* Pridať zápis */}
      <div className="card" style={{marginTop:12}}>
        <h3 style={{marginTop:0}}>Neuer Eintrag</h3>
        <form onSubmit={addEntry} className="ev-form">
          <input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} />
          <input className="input" type="number" min="0" step="0.5" placeholder="Höhe (cm)"
                 value={height} onChange={e=>setHeight(e.target.value)} />
          <input className="input" type="file" multiple accept="image/*" onChange={e=>setFiles([...e.target.files])} />
          <input className="input" placeholder="Notiz (optional)" value={note} onChange={e=>setNote(e.target.value)} />
          <button className="btn" type="submit" disabled={saving}>{saving?"Speichere…":"Hinzufügen"}</button>
        </form>
      </div>

      {/* Chronik */}
      <div className="card" style={{marginTop:12}}>
        <h3 style={{marginTop:0}}>Chronik</h3>
        <ul className="ev-list" style={{marginTop:8}}>
          {entries.length===0 && <li className="empty">Noch keine Einträge.</li>}
          {entries.map(e=>(
            <li key={e.id ?? e._localId} style={{alignItems:"flex-start"}}>
              <div>
                <div className="ev-title">{new Date(e.date).toLocaleDateString("de-DE")}</div>
                {e.height_cm!=null && <div className="subtitle">Höhe: {e.height_cm} cm</div>}
                {e.note && <p style={{marginTop:6, whiteSpace:"pre-wrap"}}>{e.note}</p>}
                {Array.isArray(e.photos) && e.photos.length>0 && (
                  <div className="grid" style={{gap:8, marginTop:8}}>
                    {e.photos.map((u,i)=>(
                      <img key={i} src={u} alt="Foto" style={{width:"100%", maxWidth:180, aspectRatio:"1/1", objectFit:"cover", borderRadius:12}}/>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
