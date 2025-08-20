// src/pages/calendar.js
import Layout from "@/components/Layout";
import CalendarMonth from "@/components/CalendarMonth";
import { useEffect, useState } from "react";

// lazy supabase klient (build nepadá bez env)
let supabase = null;
if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  import("@supabase/supabase-js").then(({ createClient }) => {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  });
}

export default function CalendarPage() {
  const [plants, setPlants] = useState([]);  // [{id,name,emoji}]
  const [events, setEvents] = useState([]);  // [{id,title,note,date,plant_id?,type?}]

  // --- OFFLINE LOAD ---
  useEffect(() => {
    const p = localStorage.getItem("gb_plants");
    const e = localStorage.getItem("gb_calendar");
    if (p) setPlants(JSON.parse(p));
    if (e) setEvents(JSON.parse(e));
  }, []);
  useEffect(() => { localStorage.setItem("gb_plants", JSON.stringify(plants)); }, [plants]);
  useEffect(() => { localStorage.setItem("gb_calendar", JSON.stringify(events)); }, [events]);

  // --- SUPABASE SYNC (ak je user) ---
  useEffect(() => {
    let sub1, sub2;
    (async () => {
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const p = await supabase.from("plants").select("*").order("inserted_at", { ascending: true });
      if (!p.error && p.data) setPlants(p.data);

      const e = await supabase.from("calendar_events").select("*").order("date", { ascending: true });
      if (!e.error && e.data) setEvents(e.data);

      sub1 = supabase
        .channel("plants")
        .on("postgres_changes", { event: "*", schema: "public", table: "plants" }, payload => {
          setPlants(prev => {
            if (payload.eventType === "INSERT") return [...prev, payload.new];
            if (payload.eventType === "DELETE") return prev.filter(x => x.id !== payload.old.id);
            if (payload.eventType === "UPDATE") return prev.map(x => x.id === payload.new.id ? payload.new : x);
            return prev;
          });
        })
        .subscribe();

      sub2 = supabase
        .channel("cal")
        .on("postgres_changes", { event: "*", schema: "public", table: "calendar_events" }, payload => {
          setEvents(prev => {
            if (payload.eventType === "INSERT") return [...prev, payload.new];
            if (payload.eventType === "DELETE") return prev.filter(x => x.id !== payload.old.id);
            if (payload.eventType === "UPDATE") return prev.map(x => x.id === payload.new.id ? payload.new : x);
            return prev;
          });
        })
        .subscribe();
    })();

    return () => { sub1?.unsubscribe?.(); sub2?.unsubscribe?.(); };
  }, []);

  // --- ADD / DELETE ---
  async function add(ev) {
    // ev: { title, note, date:Date, plant_id?, type? }
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("calendar_events")
          .insert({
            user_id: user.id,
            plant_id: ev.plant_id || null,
            title: ev.title,
            note: ev.note || null,
            type: ev.type || null,
            date: new Date(ev.date).toISOString().slice(0, 10), // yyyy-mm-dd
          })
          .select()
          .single();
        if (!error && data) { setEvents(prev => [...prev, data]); scheduleLocalNotify(data); return; }
      }
    }
    // offline fallback
    const local = { ...ev, _localId: crypto.randomUUID(), date: new Date(ev.date).toISOString().slice(0, 10) };
    setEvents(prev => [...prev, local]);
    scheduleLocalNotify(local);
  }

  async function del(idOrLocal) {
    if (supabase && typeof idOrLocal === "number") {
      await supabase.from("calendar_events").delete().eq("id", idOrLocal);
    }
    setEvents(prev => prev.filter(e => (e.id ?? e._localId) !== idOrLocal));
  }

  // --- Jednoduché lokálne pripomienky (24h dopredu) ---
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
    const now = Date.now();
    events.forEach(ev => {
      const t = new Date(ev.date).getTime();
      if (t > now && t - now < 24 * 60 * 60 * 1000) scheduleLocalNotify(ev);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

  function scheduleLocalNotify(ev) {
    if (typeof window === "undefined" || Notification.permission !== "granted") return;
    const diff = new Date(ev.date).getTime() - Date.now();
    if (diff <= 0 || diff > 24 * 60 * 60 * 1000) return; // iba do 24h

    const plant = plants.find(p => String(p.id) === String(ev.plant_id));
    const title = `${plant?.emoji || "🌿"} ${plant?.name || "Pflanze"} – Erinnerung`;
    const body  = `${ev.title} (${ev.type || ""}) um ${new Date(ev.date).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}`;
    setTimeout(() => new Notification(title, { body }), diff);
  }

  return (
    <Layout>
      <div className="card" style={{ marginTop: 0 }}>
        <h2 className="title" style={{ marginTop: 0 }}>Kalender & Erinnerungen</h2>
        <p className="subtitle">Lege Erinnerungen für deine echten Pflanzen an – Gießen, Düngen, Sprühen, Umtopfen.</p>
      </div>

      <CalendarMonth events={events} onAdd={add} onDelete={del} />
    </Layout>
  );
        }
