import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { supabase } from '@/utils/supabaseClient'

export default function AccountPage(){
  const [user, setUser] = useState(null)
  const [nickname, setNickname] = useState('')
  const [avatar, setAvatar] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>{
      const u = data.user; setUser(u)
      setNickname(u?.user_metadata?.nickname || '')
      setAvatarUrl(u?.user_metadata?.avatar_url || '')
    })
  }, [])

  async function save(){
    const updates = { data: { nickname } }
    if (avatar) {
      const path = `${user.id}/${Date.now()}-${avatar.name}`
      const { error } = await supabase.storage.from('avatars').upload(path, avatar, { upsert:true })
      if (!error) {
        const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path)
        updates.data.avatar_url = pub.publicUrl; setAvatarUrl(pub.publicUrl)
      }
    }
    await supabase.auth.updateUser(updates)
    alert('Gespeichert!')
  }

  return (
    <Layout onLogout={async()=>{await supabase.auth.signOut(); location.href='/auth/login'}}>
      <h1>Konto-Einstellungen</h1>
      <div className="card row">
        <img className="avatar" src={avatarUrl || 'https://placehold.co/64x64?text=👤'} />
        <div className="list" style={{flex:1}}>
          <input className="input" placeholder="Nickname" value={nickname} onChange={e=>setNickname(e.target.value)}/>
          <input type="file" accept="image/*" onChange={e=>setAvatar(e.target.files?.[0]||null)} />
          <button className="btn" onClick={save}>Speichern</button>
        </div>
      </div>
    </Layout>
  )
}
