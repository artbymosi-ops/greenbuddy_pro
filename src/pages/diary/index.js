import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

export default function DiaryPage() {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem("gb_diary") || "[]"));
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    plant: "Monstera",
    height: "",
    note: "",
  });

  useEffect(() => { localStorage.setItem("gb_diary", JSON.stringify(items)); }, [items]);

  function addEntry(e) {
    e.preventDefault();
    setItems((p) => [{ id: Date.now(), ...form }, ...p]);
    setForm((f) => ({ ...f, height: "", note: "" }));
  }
  const del = (id) => setItems((p) => p.filter((x) => x.id !== id));

  return (
    <Layout title="Tagebuch">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Pflanzen-Tagebuch</h2>

        <form onSubmit={addEntry} className="ev-form" style={{ marginTop: 12 }}>
          <div className="diary-grid">
            <label className="label">Datum
              <input className="input" type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
            </label>
            <label className="label">Pflanze
              <select className="input" value={form.plant} onChange={(e) => setForm((f) => ({ ...f, plant: e.target.value }))}>
                <option>Monstera</option><option>Ficus</option><option>Pothos</option>
              </select>
            </label>
            <label className="label">Höhe (cm)
              <input className="input" type="number" min="0" step="0.5" value={form.height} onChange={(e) => setForm((f) => ({ ...f, height: e.target.value }))} />
            </label>
          </div>

          <label className="label" style={{ marginTop: 8 }}>Notiz
            <textarea className="input" rows={3} value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} />
          </label>

          <div style={{ marginTop: 8 }}>
            <button className="btn" type="submit" aria-label="Speichern">💾</button>
          </div>
        </form>

        <ul className="ev-list" style={{ marginTop: 12 }}>
          {items.length === 0 && <li className="empty">Žiadne záznamy</li>}
          {items.map((it) => (
            <li key={it.id}>
              <div>
                <div className="ev-title">{it.date} • {it.plant} {it.height ? `• ${it.height} cm` : ""}</div>
                {it.note && <div className="ev-note">{it.note}</div>}
              </div>
              <button className="btn subtle" onClick={() => del(it.id)} title="Zmazať">🗑️</button>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
