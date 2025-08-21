// src/components/Plant2D.jsx
import React, { useEffect } from "react";
import MonsteraToon from "@/components/MonsteraToon";

// ...
<MonsteraToon
  level={state.level}
  mood={state.alive ? (isNight() ? "neutral" : "happy") : "sad"}
  wind={0.25}
  face="leaf"           // alebo "pot", ako chceš
  size={380}
/>

export default function Plant2D({ state, lastAction, sound = true }) {
  const level = Math.max(1, state?.level ?? 1);
  const mood = state?.mood ?? "happy";

  // veľmi jemný zvuk pri akcii/nálade (bez knižníc)
  useEffect(() => {
    if (!sound) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = mood === "sad" ? 180 : mood === "happy" ? 420 : 260;
      gain.gain.value = 0.0001;
      osc.start();

      let i = 0;
      const t = setInterval(() => {
        gain.gain.setTargetAtTime(0.08, ctx.currentTime, 0.005);
        setTimeout(
          () => gain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.01),
          120
        );
        if (++i > 8) {
          clearInterval(t);
          try { osc.stop(); ctx.close(); } catch {}
        }
      }, 160);

      return () => {
        clearInterval(t);
        try { osc.stop(); ctx.close(); } catch {}
      };
    } catch {}
  }, [mood, lastAction, sound]);

      `}</style>
    </div>
  );
}
