// Malé, čisté SVG ikonky – farbu zdedia z currentColor
export function WaterIcon(props){ return (
  <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
    <path d="M12 2c3.5 5 6 8.2 6 11a6 6 0 1 1-12 0c0-2.8 2.5-6 6-11z" fill="currentColor"/>
  </svg>
);}
export function FertilizerIcon(props){ return (
  <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
    <path d="M7 3h10l1 3v12a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V6l1-3z" fill="currentColor"/>
    <circle cx="12" cy="11" r="2" fill="#fff" opacity=".9"/>
  </svg>
);}
export function SprayIcon(props){ return (
  <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
    <path d="M9 7h6l1 2v10a3 3 0 0 1-3 3H7V9l2-2z" fill="currentColor"/>
    <circle cx="18" cy="5" r="1.5" fill="currentColor"/>
    <circle cx="20.5" cy="5" r="1" fill="currentColor"/>
    <circle cx="16" cy="5" r="1" fill="currentColor"/>
  </svg>
);}
export function RepotIcon(props){ return (
  <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
    <path d="M5 6h14l-2 9a4 4 0 0 1-4 3H11a4 4 0 0 1-4-3L5 6z" fill="currentColor"/>
    <rect x="7" y="3" width="10" height="2" rx="1" fill="currentColor"/>
  </svg>
);}
export function BugIcon(props){ return (
  <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
    <ellipse cx="12" cy="12" rx="4.5" ry="6" fill="currentColor"/>
    <line x1="7" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="17" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);}
