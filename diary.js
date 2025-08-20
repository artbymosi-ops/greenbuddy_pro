import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { supabase } from '@/utils/supabaseClient'

export default function DiaryPage(){
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [image, setImage] = useState(null)
  const [entries, setEntries] = useState([])

  useEffect(()=>{ supabase.auth.getUser().then(({data})=> setUser(data.user || null)) },[])
  useEffect(()=>{
    if(!user) return
    supabase.from('diary_entries').select('*').eq('user_id', user.id).order('created_at', {ascending:false}).then(({data})=> setEntries(data||[]))
  },[user])

  async function upload() {
    if (!user || !image) return
    const file = image
    const path = `${user.id}/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('diary').upload(path, file, { upsert:false })
    if (error) return alert(error.message)
    const { data: publicUrl } = supabase.storage.from('diary').getPublicUrl(path)
    const { data } = await supabase.from('diary_entries').insert({ user_id:user.id, title, note, photo_url: publicUrl.publicUrl }).select().single()
    setEntries([data, ...entries])
    setTitle(''); setNote(''); setImage(null)
  }

  return (
    <Layout onLogout={async()=>{await supabase.auth.signOut(); location.href='/auth/login'}}>
      <h1>Tagebuch</h1>
      <div className="card">
        <input className="input" placeholder="Titel" value={title} onChange={e=>setTitle(e.target.value)}/>
        <textarea className="input" placeholder="Notiz" value={note} onChange={e=>setNote(e.target.value)}></textarea>
        <input type="file" accept="image/*" onChange={e=>setImage(e.target.files?.[0]||null)} />
        <button className="btn" onClick={upload}>Eintrag speichern</button>
      </div>

      <div className="grid cols-2" style={{marginTop:12}}>
        {entries.map(e=>(
          <div key={e.id} className="card">
            {e.photo_url && <img src={e.photo_url} style={{width:'100%',borderRadius:12}}/>}
            <h3>{e.title}</h3>
            <p>{e.note}</p>
            <small className="muted">{new Date(e.created_at).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </Layout>
  )
}
