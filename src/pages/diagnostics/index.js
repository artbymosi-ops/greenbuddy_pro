// src/pages/diagnostics/index.js
import Layout from "@/components/Layout";
import dynamic from "next/dynamic";

const AIChat = dynamic(()=>import("@/components/AIChat"), { ssr:false });

export default function DiagnosticsPage(){
  return (
    <Layout title="Diagnostika">
      <AIChat plantContext={{
        species: "Monstera deliciosa",
        light: "hell, indirekt",
        watering: "alle 5 Tage",
        lastActions: "gesprüht gestern, gedüngt vor 2 Wochen"
      }}/>
    </Layout>
  );
}
