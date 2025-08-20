// src/components/CalendarMonth.jsx
import { useMemo, useState } from "react";
import {
  addMonths, subMonths, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek, eachDayOfInterval,
  isSameMonth, isSameDay, format
} from "date-fns";
import de from "date-fns/locale/de";

export default function CalendarMonth({ events = [], onAdd, onDelete }) {
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState(new Date());
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  // dni zobrazené v mriežke (6 týždňov)
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const end   = endOfWeek(endOfMonth(cursor),   { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  // udalosti podľa dňa
  const byDay = useMemo(() => {
    const map = {};
    for (const ev of events) {
      const key = format(new Date(ev.date), "yyyy-MM-dd");
      (map[key] ||= []).push(ev);
    }
    return map;
  }, [events]);

  function addEvent(e) {
    e.preventDefault();
    if (!title?.trim()) return;
    onAdd?.({
      title: title.trim(),
      note: note.trim(),
      date: selected, // Date objekt
    });
    setTitle("");
    setNote("");
  }

  return (
    <div className="cal">
      <div className="cal-toolbar">
        <button className="btn ghost" onClick={() => setCursor(subMonths(cursor, 1))}>◀</button>
        <div className="cal-month">{format(cursor, "LLLL yyyy", { locale: de })}</div>
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
                {dayEvents.slice(0,4).map((ev, i) => <span key={i} title={ev.title} className="dot"/>)}
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
