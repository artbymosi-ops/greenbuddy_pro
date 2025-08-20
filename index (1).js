import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'

export default function Admin(){
  const [posts, setPosts] = useState([])
  useEffect(()=>{
    if (localStorage.getItem('gb_admin')!=='1') { window.location.href='/admin/login'; return }
    supabase.from('forum_posts').select('*').order('created_at',{ascending:false}).then(({data})=> setPosts(data||[]))
  },[])

  async function toggleHidden(p){
    await supabase.from('forum_posts').update({ hidden: !p.hidden }).eq('id', p.id)
    setPosts(ps=> ps.map(x=> x.id===p.id? {...x, hidden:!x.hidden}: x))
  }

  return (
    <main className="app">
      <h1>Admin – Moderation</h1>
      <table className="card">
        <thead><tr><th>Datum</th><th>Autor</th><th>Text</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {posts.map(p=>(
            <tr key={p.id}>
              <td>{new Date(p.created_at).toLocaleString()}</td>
              <td>{p.nickname||'Gast'}</td>
              <td style={{maxWidth:420}}>{p.content}</td>
              <td>{p.hidden?'Versteckt':'Sichtbar'}</td>
              <td><button className="btn" onClick={()=>toggleHidden(p)}>{p.hidden?'Einblenden':'Verbergen'}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
