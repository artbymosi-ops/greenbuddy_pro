import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // demo heslo – neskôr nahradiť Supabase auth alebo backend
    if (email === "admin@greenbuddy.app" && password === "admin123") {
      localStorage.setItem("gb_isAdmin", "true");
      localStorage.setItem("gb_admin_email", email);
      router.push("/admin");
    } else {
      setError("Ungültige Zugangsdaten.");
    }
  };

  return (
    <Layout title="Admin Login">
      <div className="flex-center" style={{ minHeight: "70vh" }}>
        <form className="card" style={{ maxWidth: 400, width: "100%" }} onSubmit={handleLogin}>
          <h1 className="title" style={{ marginBottom: 8 }}>
            Admin Login
          </h1>
          <p className="subtitle">Bitte melde dich mit deinen Admin-Zugangsdaten an.</p>

          {error && <div className="alert error">{error}</div>}

          <div className="form-group">
            <label className="label">E-Mail</label>
            <input
              className="input"
              type="email"
              placeholder="admin@greenbuddy.app"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Passwort</label>
            <input
              className="input"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn" type="submit" style={{ width: "100%", marginTop: 12 }}>
            Einloggen
              <button
  className="btn ghost"
  onClick={async () => {
    // zmaž cookie na serveri
    await fetch("/api/admin/session", { method: "DELETE" });
    // vyčisti aj lokálne indície (pre UI)
    localStorage.removeItem("gb_isAdmin");
    localStorage.removeItem("gb_admin_email");
    router.push("/admin/login");
  }}
>
  Abmelden
</button>
          </button>
        </form>
      </div>
    </Layout>
  );
}
