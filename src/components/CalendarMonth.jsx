// src/components/CalendarMonth.jsx
import { useMemo, useState, useEffect } from "react";
import { addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
         eachDayOfInterval, isSameMonth, isSameDay, format } from "date-fns";
import de from "date-fns/locale/de";

export default function CalendarMonth({ events = [], onAdd, onDelete }) {
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState(new Date());

  // dni zobrazené v mriežke (6 týždňov)
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const end   = endOfWeek(endOfMonth(cursor),     { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  // udalosti podľa dňa
  const byDay = useMemo(() => {
    const map = {};
    for (const ev of events) {
      const key = format(new Date(ev.date), "yyyy-MM-dd");
      map[key] ||= [];
      map[key].push(ev);
    }
    return map;
  }, [events]);

  // form state
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  function addEvent(e) {
    e.preventDefault();
    if (!title?.trim()) return;
    onAdd?.({
      title: title.trim(),
      note: note.trim(),
      date: selected,   // Date objekt
    });
    setTitle(""); setNote("");
  }

  return (
    <div className="cal">
      <div className="cal-toolbar">
        <button className="btn ghost" onClick={() => setCursor(subMonths(cursor, 1))}>◀</button>
        <div className="cal-month">
          {format(cursor, "LLLL yyyy", { locale: de })}
        </div>
        <button className="btn ghost" onClick={() => setCursor(addMonths(cursor, 1))}>▶</button>
        <button className="btn" onClick={() => { setCursor(new Date()); setSelected(new Date()); }}>Heute</button>
      </div>

      <div className="cal-grid">
        {["Mo","Di","Mi","Do","Fr","Sa","So"].map(d => (
          <div key={d} className="cal-h">{d}</div>
        ))}

        {days.map((d) => {
          const key = format(d, "yyyy-MM-dd");
          const inMonth = isSameMonth(d, cursor);
          const isSel = isSameDay(d, selected);
          const dayEvents = byDay[key] || [];
          return (
            <div
              key={key}
              className={`cal-cell ${inMonth ? "" : "muted"} ${isSel ? "sel" : ""}`}
              onClick={() => setSelected(d)}
            >
              <div className="cal-date">{format(d, "d")}</div>
              <div className="cal-dots">
                {dayEvents.slice(0,4).map((ev, i) => (
                  <span key={i} title={ev.title} className="dot"/>
                ))}
                {dayEvents.length > 4 && <span className="more">+{dayEvents.length-4}</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="card" style={{marginTop:16}}>
        <h3 style={{marginTop:0}}>
          {format(selected, "EEEE, d. LLLL yyyy", { locale: de })}
        </h3>

        <ul className="ev-list">
          {(byDay[format(selected, "yyyy-MM-dd")] || []).map((ev) => (
            <li key={ev.id || ev._localId}>
              <div>
                <div className="ev-title">{ev.title}</div>
                {ev.note && <div className="ev-note">{ev.note}</div>}
              </div>
              {onDelete && (
                <button className="btn ghost" onClick={() => onDelete(ev.id || ev._localId)}>Löschen</button>
              )}
            </li>
          ))}
          {(!byDay[format(selected, "yyyy-MM-dd")] || (byDay[format(selected, "yyyy-MM-dd")]?.length===0)) && (
            <li className="empty">Keine Einträge.</li>
          )}
        </ul>

        <form onSubmit={addEvent} className="ev-form">
          <input className="input" placeholder="Titel" value={title} onChange={e=>setTitle(e.target.value)} />
          <input className="input" placeholder="Notiz (optional)" value={note} onChange={e=>setNote(e.target.value)} />
          <button className="btn" type="submit">Hinzufügen</button>
        </form>
      </div>
    </div>
  );
}
// src/components/CalendarMonth.jsx
import { useMemo, useState } from "react";
import { addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isSameDay, format } from "date-fns";
import de from "date-fns/locale/de";
import { TASK_TYPES, TYPE_KEYS } from "@/lib/plantTypes";

export default function CalendarMonth({
  plants = [],                 // [{id,name,emoji}]
  events = [],                 // [{id|_localId, plant_id, title, note, type, date}]
  onAdd, onDelete
}) {
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState(new Date());
  const [plantFilter, setPlantFilter] = useState("all");
  const [form, setForm] = useState({ title:"", note:"", type:"water", plant_id:"all", time:"08:00" });

  const days = useMemo(() => {
    const s = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const e = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
    return eachDayOfInterval({ start: s, end: e });
  }, [cursor]);

  const filtered = useMemo(() => {
    return events.filter(ev => plantFilter==="all" ? true : String(ev.plant_id)===String(plantFilter));
  }, [events, plantFilter]);

  const byDay = useMemo(() => {
    const map = {};
    for (const ev of filtered) {
      const key = format(new Date(ev.date), "yyyy-MM-dd");
      map[key] ||= [];
      map[key].push(ev);
    }
    return map;
  }, [filtered]);

  function submit(e){
    e.preventDefault();
    if(!form.title.trim()) return;
    const [hh,mm] = (form.time || "08:00").split(":").map(n=>parseInt(n,10));
    const dt = new Date(selected);
    dt.setHours(hh||8, mm||0, 0, 0);
    onAdd?.({
      title: form.title.trim(),
      note: form.note.trim(),
      type: form.type,
      plant_id: form.plant_id==="all" ? null : form.plant_id,
      date: dt,
    });
    setForm({ ...form, title:"", note:"" });
  }

  const dayLabel = format(selected, "EEEE, d. LLLL yyyy", { locale: de });
  const dayKey = format(selected, "yyyy-MM-dd");
  const dayEvents = byDay[dayKey] || [];

  return (
    <div className="cal">
      <div className="cal-toolbar">
        <button className="btn ghost" onClick={()=>setCursor(subMonths(cursor,1))}>◀</button>
        <div className="cal-month">{format(cursor, "LLLL yyyy", { locale: de })}</div>
        <button className="btn ghost" onClick={()=>setCursor(addMonths(cursor,1))}>▶</button>
        <select className="input" style={{maxWidth:220}} value={plantFilter} onChange={e=>setPlantFilter(e.target.value)}>
          <option value="all">Alle Pflanzen</option>
          {plants.map(p=>(
            <option key={p.id} value={p.id}>{p.emoji ? `${p.emoji} `:""}{p.name}</option>
          ))}
        </select>
        <button className="btn" onClick={()=>{ setCursor(new Date()); setSelected(new Date()); }}>Heute</button>
      </div>

      <div className="cal-grid">
        {["Mo","Di","Mi","Do","Fr","Sa","So"].map(d => <div key={d} className="cal-h">{d}</div>)}

        {days.map(d=>{
          const key = format(d, "yyyy-MM-dd");
          const inMonth = isSameMonth(d, cursor);
          const isSel = isSameDay(d, selected);
          const eventsHere = byDay[key] || [];
          return (
            <div key={key} className={`cal-cell ${inMonth?"":"muted"} ${isSel?"sel":""}`}
                 onClick={()=>setSelected(d)}>
              <div className="cal-date">{format(d,"d")}</div>
              <div className="cal-dots">
                {eventsHere.slice(0,6).map((ev,i)=>(
                  <span key={i} title={`${TASK_TYPES[ev.type]?.label || ""} · ${ev.title}`}
                        className="dot" style={{background:TASK_TYPES[ev.type]?.color}}/>
                ))}
                {eventsHere.length>6 && <span className="more">+{eventsHere.length-6}</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="card" style={{marginTop:16}}>
        <h3 style={{marginTop:0}}>{dayLabel}</h3>

        <ul className="ev-list">
          {dayEvents.length===0 && <li className="empty">Keine Einträge.</li>}
          {dayEvents.map(ev=>{
            const p = plants.find(x=>String(x.id)===String(ev.plant_id));
            const t = TASK_TYPES[ev.type] || {};
            return (
              <li key={ev.id || ev._localId}>
                <div>
                  <div className="ev-title">
                    <span className="ev-tag" style={{background:t.color || "#bbb"}}>{t.icon || "•"}</span>
                    {t.label ? `${t.label}: ` : ""}{ev.title}
                  </div>
                  <div className="subtitle" style={{marginTop:2}}>
                    {p ? `${p.emoji? p.emoji+" " : ""}${p.name} • ` : ""}{new Date(ev.date).toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})}
                  </div>
                  {ev.note && <div className="ev-note">{ev.note}</div>}
                </div>
                {onDelete && <button className="btn ghost" onClick={()=>onDelete(ev.id || ev._localId)}>Löschen</button>}
              </li>
            );
          })}
        </ul>

        <form onSubmit={submit} className="ev-form">
          <select className="input" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
            {TYPE_KEYS.map(k=> <option key={k} value={k}>{TASK_TYPES[k].icon} {TASK_TYPES[k].label}</option>)}
          </select>
          <select className="input" value={form.plant_id} onChange={e=>setForm(f=>({...f,plant_id:e.target.value}))}>
            <option value="all">Ohne Pflanze</option>
            {plants.map(p=><option key={p.id} value={p.id}>{p.emoji?`${p.emoji} `:""}{p.name}</option>)}
          </select>
          <input className="input" type="time" value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))}/>
          <input className="input" placeholder="Titel" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/>
          <input className="input" placeholder="Notiz (optional)" value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))}/>
          <button className="btn" type="submit">Hinzufügen</button>
        </form>
      </div>
    </div>
  );
}
