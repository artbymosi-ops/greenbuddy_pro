    // src/pages/plant.js
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Plant2D from "@/components/Plant2D";

const Plant3D = dynamic(() => import("@/components/Plant3D"), { ssr: false });

export default function PlantPage() {
  const [mode, setMode] = useState("2d");
  const [st, setSt] = useState({
    hydration: 100,
    nutrients: 60,
    spray: 90,
    xp: 0,
    level: 1,
    mood: "happy",
    size: 0,
  });
  const [lastAction, setLastAction] = useState(null);

  // … (tvoje water/feed/spray/repot a level-up logiky)

  return (
    <Layout title="Meine Pflanze">
      {/* … tvoje UI */}
      {mode === "2d" ? (
        <Plant2D state={st} lastAction={lastAction} />
      ) : (
        <Plant3D state={st} lastAction={lastAction} />
      )}
      {/* … zvyšok */}
    </Layout>
  );
        }
