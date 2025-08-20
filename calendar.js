import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { supabase } from '@/utils/supabaseClient'

export default function CalendarPage(){
  const [user, setUser] = useState(null)
  const [events, setEvents] = useState([])
  const [title, setTitle] = useState('Gießen')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')

  useEffect(()=>{ supabase.auth.getUser().then(({data})=> setUser(data.user || null)) },[])
  useEffect(()=>{
    if(!user) return
    supabase.from('calendar_events').select('*').eq('user_id', user.id).order('date', {ascending:true}).then(({data})=> setEvents(data||[]))
  },[user])

  async function addEvent(e){
    e.preventDefault()
    if (!user) return
    const { data, error } = await supabase.from('calendar_events').insert({ user_id:user.id, title, date, note })
    if (!error) setEvents(prev => [...prev, { id:data?.[0]?.id, user_id:user.id, title, date, note }])
  }

  return (
    <Layout onLogout={async()=>{await supabase.auth.signOut(); location.href='/auth/login'}}>
      <h1>Kalender</h1>
      <form className="row" onSubmit={addEvent}>
        <select value={title} onChange={e=>setTitle(e.target.value)} className="input">
          <option>Gießen</option>
          <option>Düngen</option>
          <option>Umtopfen</option>
          <option>Sprühen</option>
        </select>
        <input type="datetime-local" value={date} onChange={e=>setDate(e.target.value)} className="input"/>
        <input placeholder="Notiz (optional)" value={note} onChange={e=>setNote(e.target.value)} className="input"/>
        <button className="btn">Hinzufügen</button>
      </form>

      <div className="card" style={{marginTop:12}}>
        <table>
          <thead><tr><th>Datum</th><th>Typ</th><th>Notiz</th></tr></thead>
          <tbody>
            {events.map(e=>(<tr key={e.id}><td>{new Date(e.date).toLocaleString()}</td><td>{e.title}</td><td>{e.note||''}</td></tr>))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
