import { useEffect, useMemo, useRef, useState } from 'react'
import Layout from '@/components/Layout'
import Plant from '@/components/Plant'
import { supabase } from '@/utils/supabaseClient'
import { detectLang } from '@/utils/lang'

const XP_PER_ACTION = 8
const XP_FOR_LEVEL = (lvl)=> 40 + (lvl-1)*25

export default function AppPage(){
  const [user, setUser] = useState(null)
  useEffect(()=>{
    supabase.auth.getUser().then(({data})=> setUser(data.user || null))
  }, [])

  const [s, setS] = useState(()=>({ water:100, food:60, spray:90, xp:52, level:1, pests:false, disease:false }))
  const [msgs, setMsgs] = useState([{role:'assistant', content:'Hallo, ich bin Greenbuddy 🌿 Frag mich alles zur Pflege!'}])
  const inputRef = useRef(null)
  const [pending, setPending] = useState(false)

  useEffect(()=>{
    if (!user) return
    ;(async()=>{
      const { data } = await supabase.from('plant_states').select('*').eq('user_id', user.id).maybeSingle()
      if (data) setS(data.state)
    })()
  }, [user])

  useEffect(()=>{
    if (!user) return
    supabase.from('plant_states').upsert({ user_id:user.id, state:s, updated_at:new Date().toISOString() })
  }, [user, s])

  useEffect(()=>{
    const t = setInterval(()=>{
      setS(s=>{
        const decay = 1
        const pestsPenalty = s.pests ? 1 : 0
        const diseasePenalty = s.disease ? 1 : 0
        let next = {
          ...s,
          water: Math.max(0, s.water - decay - pestsPenalty),
          food: Math.max(0, s.food - (decay*0.6|0) - diseasePenalty),
          spray: Math.max(0, s.spray - (decay*0.4|0)),
          xp: Math.max(0, s.xp - (s.water<20 || s.food<20 ? 1 : 0))
        }
        if (next.xp >= XP_FOR_LEVEL(next.level)) { next.level += 1; next.xp = 0 }
        return next
      })
    }, 60_000)
    return ()=>clearInterval(t)
  }, [])

  const mood = useMemo(()=>{
    const avg = (s.water + s.food + s.spray)/3
    if (s.pests || s.disease || avg < 35) return 'sad'
    if (avg > 70) return 'happy'
    return 'neutral'
  }, [s])

  function bump(key, delta, note){
    setS(prev => ({ ...prev, [key]: Math.max(0, Math.min(100, prev[key] + delta)), xp: prev.xp + XP_PER_ACTION }))
    if (note) setMsgs(m => [...m, {role:'assistant', content: note}])
    // Vergabe von Codes bei Level-Meilensteinen
    const milestones = [2,4,6,8]
    if (milestones.includes(s.level)) grantCode()
  }

  async function grantCode(){
    if (!user) return
    const code = 'GB-' + Math.random().toString(36).slice(2,8).toUpperCase()
    await supabase.from('inbox_codes').insert({ user_id:user.id, code, level_awarded: s.level })
  }

  async function send(){
    const content = inputRef.current.value.trim()
    if (!content) return
    inputRef.current.value = ''
    setMsgs(m=>[...m, {role:'user', content}])
    setPending(true)
    try {
      const lang = detectLang(content, 'de')
      const r = await fetch('/api/chat', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ message: content, stats: s, lang })
      })
      const data = await r.json()
      const reply = data.reply || 'Entschuldige, keine Antwort möglich.'
      setMsgs(m=>[...m, {role:'assistant', content:reply}])
      if ('speechSynthesis' in window) { const u = new SpeechSynthesisUtterance(reply); u.lang = lang==='sk'?'sk-SK':'de-DE'; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u) }
      if (data.patchStats) setS(v=>({ ...v, ...data.patchStats }))
    } finally { setPending(false) }
  }

  async function logout(){ await supabase.auth.signOut(); window.location.href='/auth/login' }

  return (
    <Layout user={user} onLogout={logout}>
      <section className="center" style={{marginBottom:10}}>
        <Plant level={s.level} mood={mood} pests={s.pests} disease={s.disease} />
        <p className="small muted">Stimmung: <b>{mood}</b> • Level <b>{s.level}</b> • XP <b>{s.xp}/{XP_FOR_LEVEL(s.level)}</b></p>
      </section>

      <section className="grid cols-3">
        <Card title="Hydration" value={s.water} />
        <Card title="Nährstoffe" value={s.food} />
        <Card title="Spray" value={s.spray} />
      </section>

      <div className="row" style={{flexWrap:'wrap', gap:10, margin:'14px 0'}}>
        <button className="btn" onClick={()=>bump('water', +14, 'Danke fürs Gießen! 💧')}>Gießen</button>
        <button className="btn" onClick={()=>bump('food', +12, 'Lecker Dünger! 🌱')}>Düngen</button>
        <button className="btn" onClick={()=>{ setS(v=>({...v, spray: Math.min(100, v.spray+10), pests:false })); setMsgs(m=>[...m,{role:'assistant', content:'Spray wirkt – Schädlinge weg 🐞➡️🚫'}])}}>Sprühen</button>
        <button className="btn alt" onClick={()=>{ setS(v=>({...v, pests: Math.random()<.5, disease: Math.random()<.4 })); setMsgs(m=>[...m,{role:'assistant', content:'Oh nein, Stress! Hilf mir schnell 🙈'}])}}>Problem simulieren</button>
      </div>

      <section className="card">
        <h2>Chat mit Greenbuddy</h2>
        <div className="chatlog">
          {msgs.map((m,i)=>(<div key={i} className={`msg ${m.role==='assistant'?'bot':'user'}`}>{m.content}</div>))}
          {pending && <div className="msg bot">Denke nach…</div>}
        </div>
        <div className="row" style={{marginTop:10}}>
          <input ref={inputRef} className="input" placeholder="Frag nach Pflege, Gießen, Schädlingen …" onKeyDown={(e)=>e.key==='Enter'&&send()} />
          <button className="btn" onClick={send}>Senden</button>
        </div>
      </section>
    </Layout>
  )
}

function Card({title, value}){
  return (<div className="card"><div className="row" style={{justifyContent:'space-between'}}><b>{title}</b><span className="badge">{value}/100</span></div></div>)
}
