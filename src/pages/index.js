import Layout from "@/components/Layout";
import Link from "next/link";
import { t } from "@/lib/i18n";

function Mascot() {
  // jednoduchý „milý“ maskot – CSS ho zafarbí do témy
  return (
    <div className="buddy" aria-hidden>
      <div className="leaf left"></div>
      <div className="leaf right"></div>
      <div className="stem"></div>
      <div className="pot"></div>
    </div>
  );
}

export default function Home() {
  return (
    <Layout title="Greenbuddy">
      <section className="hero card">
        <div>
          <div className="badge"><span className="dot"></span> {t("badge")}</div>
          <h1>{t("h1")}</h1>
          <p className="subtitle">{t("lead")}</p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 14 }}>
            <Link className="btn" href="/plants">{t("ctaStart")}</Link>
            <Link className="btn ghost" href="/auth/login">{t("ctaLogin")}</Link>
            <Link className="btn subtle" href="/auth/register">{t("ctaSignup")}</Link>
          </div>

          <p className="subtitle" style={{ marginTop: 12 }}>
            <Link href="/admin">{t("admin")}</Link>
          </p>
        </div>

        <div className="hero-visual">
          <Mascot />
        </div>
      </section>
    </Layout>
  );
  }
