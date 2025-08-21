import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import Link from "next/link";

export default function AdminHome() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    // jednoduchá lokálna kontrola – nastavuje ju /admin/login
    const ok =
      typeof window !== "undefined" && localStorage.getItem("gb_isAdmin") === "true";
    const mail =
      typeof window !== "undefined" && localStorage.getItem("gb_admin_email");

    if (!ok) {
      router.replace("/admin/login");
      return;
    }
    setAdminEmail(mail || "admin@greenbuddy.app");
    setReady(true);
  }, [router]);

  if (!ready) return null;

  return (
    <Layout title="Admin">
      <div className="grid" style={{ gap: 16 }}>
        {/* Hlavička */}
        <section className="card">
          <div className="badge"><span className="dot"></span> Adminbereich</div>
          <h1 style={{ marginTop: 8 }}>Willkommen, Admin</h1>
          <p className="subtitle">
            Eingeloggt als <b>{adminEmail}</b>. Verwalte Community, Gutscheine und System.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
            <Link className="btn" href="/forum">Zum Forum</Link>
            <button
              className="btn ghost"
              onClick={() => {
                localStorage.removeItem("gb_isAdmin");
                localStorage.removeItem("gb_admin_email");
                router.push("/admin/login");
              }}
            >
              Abmelden
            </button>
          </div>
        </section>

        {/* Moderácia fóra */}
        <section className="card">
          <h2 className="title">Moderation – gemeldete Beiträge</h2>
          <p className="subtitle">
            Hier erscheinen Beiträge/Kommentare, die Nutzer gemeldet haben (Platzhalter).
          </p>
          {/* TODO: napojenie na Supabase tabuľky posts/comments + reports */}
          <ul className="ev-list">
            <li className="empty">Noch keine Meldungen. 🎉</li>
          </ul>

          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button className="btn subtle">Neu laden</button>
            <button className="btn ghost">Einstellungen</button>
          </div>
        </section>

        {/* Kupóny */}
        <section className="card">
          <h2 className="title">Gutscheine</h2>
          <p className="subtitle">Vergib Codes nach Leveln (XP) oder manuell.</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Demo: Coupon gespeichert (später Supabase).");
            }}
            className="grid-2"
          >
            <div>
              <label className="label">Code</label>
              <input className="input" placeholder="z. B. GREEN10" required />
            </div>
            <div>
              <label className="label">Level ab</label>
              <input className="input" type="number" min="1" placeholder="z. B. 3" required />
            </div>
            <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8 }}>
              <button className="btn" type="submit">Speichern</button>
              <button
                className="btn ghost"
                type="button"
                onClick={() => alert("Demo: Liste anzeigen")}
              >
                Liste anzeigen
              </button>
            </div>
          </form>
        </section>

        {/* Systém */}
        <section className="card">
          <h2 className="title">System</h2>
          <ul className="ev-list">
            <li>
              <div>
                <div className="ev-title">Wartungsmodus</div>
                <div className="ev-note">App nur für Admins sichtbar.</div>
              </div>
              <button
                className="btn ghost"
                onClick={() => alert("Demo: Wartungsmodus umgeschaltet")}
              >
                Umschalten
              </button>
            </li>
            <li>
              <div>
                <div className="ev-title">Logs</div>
                <div className="ev-note">Fehler- und Ereignisprotokolle ansehen.</div>
              </div>
              <button
                className="btn ghost"
                onClick={() => alert("Demo: Logs öffnen")}
              >
                Öffnen
              </button>
            </li>
          </ul>
        </section>
      </div>
    </Layout>
  );
}
