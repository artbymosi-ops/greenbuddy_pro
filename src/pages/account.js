// src/pages/calendar.js
import Layout from "@/components/Layout";
import CalendarMonth from "@/components/CalendarMonth";
import { useEffect, useMemo, useState } from "react";

// lazy supabase (ak je nastavené)
let supabase = null;
if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  // dynamický import kvôli build-time bez env
  import("@supabase/supabase-js").then(({ createClient }) => {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  });
}

export default function CalendarPage(){
  const [events, setEvents] = useState([]);

  // LOCAL fallback storage (aby fungovalo aj bez servera)
  useEffect(()=>{
    const raw = localStorage.getItem("gb_calendar");
    if(raw) setEvents(JSON.parse(raw));
  },[]);
  useEffect(()=>{
    localStorage.setItem("gb_calendar", JSON.stringify(events));
  },[events]);

  // SUPABASE – načítanie ak je k dispozícii a user prihlásený
  useEffect(()=>{
    let sub;
    (async ()=>{
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if(!user) return;

      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .order("date", { ascending: true });

      if(!error && data) setEvents(data);

      // realtime
      sub = supabase
        .channel("cal_chan")
        .on("postgres_changes",
          { event: "*", schema: "public", table: "calendar_events" },
          (payload) => {
            setEvents((prev) => {
              if(payload.eventType === "INSERT") return [...prev, payload.new];
              if(payload.eventType === "DELETE") return prev.filter(e => e.id !== payload.old.id);
              if(payload.eventType === "UPDATE") return prev.map(e => e.id===payload.new.id ? payload.new : e);
              return prev;
            });
          }
        ).subscribe();
    })();
    return ()=>{ sub?.unsubscribe(); };
  },[]);

  async function add(ev){
    // ak je supabase + user -> ulož na server; inak lokálne
    if(supabase){
      const { data: { user } } = await supabase.auth.getUser();
      if(user){
        const { data, error } = await supabase.from("calendar_events").insert({
          user_id: user.id, title: ev.title, note: ev.note,
          date: new Date(ev.date).toISOString()
        }).select().single();
        if(!error && data){ setEvents(prev => [...prev, data]); return; }
      }
    }
    // offline fallback
    setEvents(prev => [...prev, { ...ev, _localId: crypto.randomUUID(), date: ev.date }]);
  }

  async function del(idOrLocal){
    if(supabase && typeof idOrLocal === "number"){
      await supabase.from("calendar_events").delete().eq("id", idOrLocal);
    }
    setEvents(prev => prev.filter(e => (e.id ?? e._localId) !== idOrLocal));
  }

  return (
    <Layout>
      <div className="card">
        <h2 className="title" style={{marginTop:0}}>Kalender</h2>
        <p className="subtitle">Plane Gießen, Düngen, Sprühen oder Umtopfen.</p>
      </div>

      <CalendarMonth
        events={events}
        onAdd={add}
        onDelete={del}
      />
    </Layout>
  );
}
