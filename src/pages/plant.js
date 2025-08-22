import Layout from "@/components/Layout";
import Plant2D from "@/components/Plant2D";

export default function PlantPage() {
  return (
    <Layout title="Meine Pflanze">
      <main style={{ padding: 16, maxWidth: 960, margin: "0 auto" }}>
        <section className="card" style={{ marginBottom: 16 }}>
          <Plant2D />
        </section>
      </main>
    </Layout>
  );
}
