// src/pages/_app.js
import '@/styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
// hore:
const [lastAction, setLastAction] = useState(null);

// ...
const water = ()=>{ setSt(s=>({ ...s, hydration:Math.min(100,s.hydration+18)})); addXp(6); setLastAction('water'); };
const feed  = ()=>{ setSt(s=>({ ...s, nutrients:Math.min(100,s.nutrients+14)})); addXp(6); setLastAction('feed'); };
const spray = ()=>{ setSt(s=>({ ...s, spray:Math.min(100,s.spray+12)})); addXp(6); setLastAction('spray'); };
const repot = ()=>{ setSt(s=>({ ...s, nutrients:Math.min(100,s.nutrients+10), hydration:Math.max(60,s.hydration-8)})); addXp(10); setLastAction('repot'); };

// v JSX:
<Plant state={st} pulse={pulse} lastAction={lastAction} />
import Plant3D from "@/components/Plant3D";
// ...
const [lastAction, setLastAction] = useState(null);
// pri akciách:
const water = ()=>{ /* ...update state... */ setLastAction('water'); };
const feed  = ()=>{ /* ... */ setLastAction('feed');  };
const spray = ()=>{ /* ... */ setLastAction('spray'); };
const repot = ()=>{ /* ... */ setLastAction('repot'); };
// render:
<Plant3D state={st} lastAction={lastAction}/>
