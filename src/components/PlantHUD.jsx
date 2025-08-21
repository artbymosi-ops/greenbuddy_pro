export default function PlantHUD({ state, setState }) {
  const addXp = (n) => setState((s) => ({ ...s, xp: s.xp + n }));

  const water = () => { setState(s => ({ ...s, hydration: Math.min(100, s.hydration + 18) })); addXp(6); };
  const feed  = () => { setState(s => ({ ...s, nutrients: Math.min(100, s.nutrients + 14) })); addXp(6); };
  const spray = () => { setState(s => ({ ...s, spray: Math.min(100, s.spray + 12) })); addXp(6); };
  const repot = () => { setState(s => ({ ...s, nutrients: Math.min(100, s.nutrients + 10), hydration: Math.max(60, s.hydration - 8) })); addXp(10); };

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <button className="btn"      onClick={water} aria-label="Gießen"  title="Gießen">💧</button>
      <button className="btn"      onClick={feed}  aria-label="Düngen"  title="Düngen">🧪</button>
      <button className="btn"      onClick={spray} aria-label="Sprühen" title="Sprühen">🌫️</button>
      <button className="btn ghost" onClick={repot} aria-label="Umtopfen" title="Umtopfen">🪴</button>
    </div>
  );
}
