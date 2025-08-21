// pages/admin/index.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AdminDashboard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const ok = typeof window !== "undefined" && localStorage.getItem("gb_isAdmin") === "true";
    const mail = typeof window !== "undefined" && localStorage.getItem("gb_admin_email");

    if (!ok) {
      router.replace("/admin/login");
      return;
    }

    setAdminEmail(mail || "admin@greenbuddy.app");
    setReady(true);
  }, [router]);

  if (!ready) return null;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>
      <p>Prihlásený ako: <b>{adminEmail}</b></p>

      <h2>Fórum – moderovanie</h2>
      <p>Tu sa budú zobrazovať nahlásené príspevky.</p>

      <h2>Zľavové kupóny</h2>
      <p>Tu bude správa kupónov (pridanie, odstránenie, úprava).</p>

      <h2>Systém</h2>
      <ul>
        <li>Prepnutie do „Wartungsmodus“ (údržba)</li>
        <li>Prehľad logov</li>
      </ul>

      <button
        onClick={() => {
          localStorage.removeItem("gb_isAdmin");
          localStorage.removeItem("gb_admin_email");
          router.push("/admin/login");
        }}
      >
        Odhlásiť sa
      </button>
    </div>
  );
  }
