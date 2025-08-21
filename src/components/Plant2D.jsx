import { useEffect, useMemo, useRef } from "react";

/** 2D Monstera – realistickejší tvar s fenestráciou, tvár nad kvetináčom */
export default function Plant2D({ state, lastAction, sound = true }) {
  const level = Math.max(1, state?.level || 1);
  const mood = state?.mood || "happy";
  const fenLevel = Math.min(5, Math.floor(level / 2)); // viac dier s levelom

  // krátke „bľabotanie“ so zvukom pri zmene nálady/akcii
  useEffect(() => {
    if (!sound) return;
    let stopped = false;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.type = "sine";
    o.frequency.value = mood === "sad" ? 180 : mood === "happy" ? 420 : 260;
    g.gain.value = 0.0001;
    o.start();
    let i = 0;
    const t = setInterval(() => {
      if (stopped) return;
      g.gain.setTargetAtTime(0.08, ctx.currentTime, 0.005);
      setTimeout(() => g.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.005), 120);
      o.frequency.setTargetAtTime(o.frequency.value + (Math.random() * 80 - 40), ctx.currentTime, 0.01);
      if (++i > 10) {
        clearInterval(t);
        try { o.stop(); ctx.close(); } catch {}
      }
    }, 160);
    return () => { stopped = true; try { o.stop(); ctx.close(); } catch {} };
  }, [mood, lastAction, sound]);

  const leafFill   = mood === "sad" ? "#77c18a" : "#33c374";
  const leafStroke = mood === "sad" ? "#2b7c4e" : "#1a8e57";

  return (
                        import MonsteraAvatar from "@/components/MonsteraAvatar";

<MonsteraAvatar
  size={320}
  level={plant.level}      // číslo z tvojho state
  mood={plant.mood}        // "happy" | "neutral" | "sad" | "talk"
  wind={0.6}
/>
