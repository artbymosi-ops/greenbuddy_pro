import PlantPremiumV2 from "@/components/Plant";
export default function PlantPage(){ return <PlantPremiumV2/>; }
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
// hore:
const [lastAction, setLastAction] = useState(null);

// ...
const water = ()=>{ setSt(s=>({ ...s, hydration:Math.min(100,s.hydration+18)})); addXp(6); setLastAction('water'); };
const feed  = ()=>{ setSt(s=>({ ...s, nutrients:Math.min(100,s.nutrients+14)})); addXp(6); setLastAction('feed'); };
const spray = ()=>{ setSt(s=>({ ...s, spray:Math.min(100,s.spray+12)})); addXp(6); setLastAction('spray'); };
const repot = ()=>{ setSt(s=>({ ...s, nutrients:Math.min(100,s.nutrients+10), hydration:Math.max(60,s.hydration-8)})); addXp(10); setLastAction('repot'); };
  
// lazy load supabase klienta (aby build nepadal, keď env nie je nastavené)
let supabase = null;
if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  import("@supabase/supabase-js").then(({ createClient }) => {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  });
}

export default function PlantsPage() {
  const [plants, setPlants] = useState([]); // {id?, name, species?, emoji?}
  const [form, setForm] = useState({ name: "", species: "", emoji: "🪴" });
  const [loading, setLoading] = useState(false);

  // --- OFFLINE LOAD ---
  useEffect(() => {
    const p = localStorage.getItem("gb_plants");
    if (p) setPlants(JSON.parse(p));
  }, []);
  useEffect(() => {
    localStorage.setItem("gb_plants", JSON.stringify(plants));
  }, [plants]);

  // --- SUPABASE SYNC (ak je user) ---
  useEffect(() => {
    let sub;
    (async () => {
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("plants")
        .select("*")
        .order("inserted_at", { ascending: true });
      if (!error && data) setPlants(data);

      sub = supabase.channel("plants")
        .on("postgres_changes", { event: "*", schema: "public", table: "plants" }, payload => {
          setPlants(prev => {
            if (payload.eventType === "INSERT") return [...prev, payload.new];
            if (payload.eventType === "DELETE") return prev.filter(p => p.id !== payload.old.id);
            if (payload.eventType === "UPDATE") return prev.map(p => p.id === payload.new.id ? payload.new : p);
            return prev;
          });
        }).subscribe();
    })();
    return () => sub?.unsubscribe();
  }, []);

  async function addPlant(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);

    // ak máme supabase + user, ulož do DB
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase.from("plants").insert({
          user_id: user.id,
          name: form.name.trim(),
          species: form.species.trim() || null,
          emoji: form.emoji || null
        }).select().single();

        setLoading(false);
        if (!error && data) {
          setPlants(prev => [...prev, data]);
          setForm({ name: "", species: "", emoji: "🪴" });
          return;
        }
      }
    }

    // fallback: offline lokálna položka
    const local = { _localId: crypto.randomUUID(), name: form.name.trim(), species: form.species.trim(), emoji: form.emoji };
    setPlants(prev => [...prev, local]);
    setForm({ name: "", species: "", emoji: "🪴" });
    setLoading(false);
  }

  async function removePlant(idOrLocal) {
    if (supabase && typeof idOrLocal === "number") {
      await supabase.from("plants").delete().eq("id", idOrLocal);
    }
    setPlants(prev => prev.filter(p => (p.id ?? p._localId) !== idOrLocal));
  }

  return (
    <Layout>
      <div className="card">
        <h2 className="title" style={{ marginTop: 0 }}>Meine Pflanzen</h2>
        <p className="subtitle">Füge deine echten Pflanzen hinzu. Diese kannst du im Kalender für Erinnerungen auswählen.</p>

        <form onSubmit={addPlant} className="ev-form" style={{ marginTop: 12 }}>
          <input className="input" placeholder="Name (z. B. Monstera im Wohnzimmer)"
                 value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <input className="input" placeholder="Art (optional, z. B. Monstera deliciosa)"
                 value={form.species} onChange={e => setForm(f => ({ ...f, species: e.target.value }))} />
          <input className="input" placeholder="Emoji (optional)" maxLength={4}
                 value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} />
          <button className="btn" disabled={loading} type="submit">{loading ? "Speichern…" : "Hinzufügen"}</button>
        </form>
      </div>

      <ul className="ev-list" style={{ marginTop: 16 }}>
        {plants.length === 0 && <li className="empty">Noch keine Pflanzen angelegt.</li>}
        {plants.map(p => (
          <li key={p.id ?? p._localId}>
            <div>
              <div className="ev-title">
                <span className="ev-tag" style={{ background: "#5bbf7a" }}>{p.emoji || "🌿"}</span>
                {p.name}
              </div>
              {p.species && <div className="subtitle" style={{ marginTop: 2 }}>{p.species}</div>}
            </div>
            <button className="btn ghost" onClick={() => removePlant(p.id ?? p._localId)}>Löschen</button>
          </li>
        ))}
      </ul>
    </Layout>
  );
  }

// v JSX:
<Plant state={st} pulse={pulse} lastAction={lastAction} />
import Plant3D from "@/components/Plant3D";
// ...
const [lastAction, setLastAction] = useState(null);
// pri akciách:
const water = ()=>{ /* ...update state... */ setLastAction('water'); };
const feed  = ()=>{ /* ... */ setLastAction('feed');  };
const spray = ()=>{ /* ... */ setLastAction('spray'); };
const repot = ()=>{ /* ... */ setLastAction('repot'); };
// render:
<Plant3D state={st} lastAction={lastAction}/>
import Plant3D from "@/components/Plant3D";
export default function PlantPage(){
  // tu máš svoj st (hydration, nutrients, spray, xp, level, mood) a setLastAction v handleroch
  // ...
  return <Plant3D state={st} lastAction={lastAction} />;
                   }
                   
