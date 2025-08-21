export default function ActionButton({ id, icon, label, cooldownSec=0, lastTs, onClick }) {
  const now = Date.now();
  const left = lastTs ? Math.max(0, cooldownSec*1000 - (now - lastTs)) : 0;
  const disabled = left>0;
  const mm = Math.ceil(left/60000);

  return (
    <button
      className={`btn ${disabled?"ghost":""}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={disabled ? `Dostupné o ${mm} min` : label}
      style={{display:"inline-flex",gap:8,alignItems:"center"}}
    >
      <span style={{fontSize:22, lineHeight:1}}>{icon}</span>
      <span style={{fontWeight:600}}>{disabled ? `${mm}m` : label}</span>
    </button>
  );
}
