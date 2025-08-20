import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { supabase } from '@/utils/supabaseClient'

export default function InboxPage(){
  const [user, setUser] = useState(null)
  const [codes, setCodes] = useState([])
  useEffect(()=>{ supabase.auth.getUser().then(({data})=> setUser(data.user || null)) },[])
  useEffect(()=>{
    if(!user) return
    supabase.from('inbox_codes').select('*').eq('user_id', user.id).order('created_at',{ascending:false}).then(({data})=> setCodes(data||[]))
  },[user])

  return (
    <Layout onLogout={async()=>{await supabase.auth.signOut(); location.href='/auth/login'}}>
      <h1>Inbox</h1>
      <div className="list">
        {codes.map(c=>(
          <div className="card row" key={c.id} style={{justifyContent:'space-between'}}>
            <div>
              <div><b>Code:</b> {c.code}</div>
              <small className="muted">Level {c.level_awarded} • {new Date(c.created_at).toLocaleString()}</small>
            </div>
            <button className="btn" onClick={()=>navigator.clipboard.writeText(c.code)}>Kopieren</button>
          </div>
        ))}
        {!codes.length && <div className="card">Noch keine Codes – steigere dein Level! 🎁</div>}
      </div>
    </Layout>
  )
}
