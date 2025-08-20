import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { supabase } from '@/utils/supabaseClient'

export default function ForumPage(){
  const [user, setUser] = useState(null)
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [posts, setPosts] = useState([])

  useEffect(()=>{ supabase.auth.getUser().then(({data})=> setUser(data.user || null)) },[])
  useEffect(()=>{
    supabase.from('forum_posts').select('*').eq('hidden', false).order('created_at', {ascending:false}).then(({data})=> setPosts(data||[]))
  },[])

  async function createPost() {
    if (!user) return alert('Bitte einloggen.')
    let url = null
    if (image) {
      const path = `${user.id}/${Date.now()}-${image.name}`
      const { error } = await supabase.storage.from('forum').upload(path, image, { upsert:false })
      if (error) return alert(error.message)
      url = supabase.storage.from('forum').getPublicUrl(path).data.publicUrl
    }
    const nickname = user.user_metadata?.nickname || 'Gast'
    const { data, error } = await supabase.from('forum_posts').insert({ user_id:user.id, nickname, content, image_url:url }).select().single()
    if (!error) { setPosts([data, ...posts]); setContent(''); setImage(null) }
  }

  async function like(post){
    if (!user) return
    await supabase.from('forum_likes').insert({ user_id:user.id, post_id:post.id }).catch(()=>{})
    setPosts(ps=> ps.map(p=> p.id===post.id ? {...p, likes_count:(p.likes_count||0)+1 } : p))
  }

  async function report(post){
    await supabase.from('forum_reports').insert({ post_id: post.id, user_id: user?.id, reason: 'Unangemessen' })
    alert('Gemeldet – danke!')
  }

  return (
    <Layout onLogout={async()=>{await supabase.auth.signOut(); location.href='/auth/login'}}>
      <h1>Forum</h1>
      <div className="card">
        <textarea className="input" placeholder="Teile ein Foto, Tipp oder Frage…" value={content} onChange={e=>setContent(e.target.value)}></textarea>
        <input type="file" accept="image/*" onChange={e=>setImage(e.target.files?.[0]||null)} />
        <button className="btn" onClick={createPost}>Posten</button>
      </div>

      <div className="list" style={{marginTop:12}}>
        {posts.map(p=>(
          <div className="card" key={p.id}>
            <div className="row" style={{justifyContent:'space-between'}}>
              <div className="row"><div className="badge">{p.nickname||'Gast'}</div><small className="muted" style={{marginLeft:8}}>{new Date(p.created_at).toLocaleString()}</small></div>
              <div className="row"><button className="menuBtn" onClick={()=>like(p)}>👍 {p.likes_count||0}</button><button className="menuBtn" onClick={()=>report(p)}>Melden</button></div>
            </div>
            {p.image_url && <img src={p.image_url} style={{width:'100%',borderRadius:12, marginTop:8}}/>}
            <p style={{whiteSpace:'pre-wrap'}}>{p.content}</p>
          </div>
        ))}
      </div>
    </Layout>
  )
}
