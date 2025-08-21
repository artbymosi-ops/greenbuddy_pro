import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/utils/supabaseClient'
import Layout from "@/components/Layout";
export default function Page(){ return <Layout title="Názov"><div className="card"><h2>Názov</h2><p>Obsah príde neskôr.</p></div></Layout>; }
export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e){
    e.preventDefault()
    setLoading(true); setError('')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) setError(error.message)
    else window.location.href = '/app'
  }

  return (
    <main className="app">
      <div className="center">
        <div className="card" style={{maxWidth:420, width:'100%'}}>
          <h1>Einloggen</h1>
          <p className="small muted">Melde dich mit E-Mail und Passwort an.</p>
          <form onSubmit={onSubmit} className="list">
            <input className="input" type="email" placeholder="E-Mail" value={email} onChange={e=>setEmail(e.target.value)} required />
            <input className="input" type="password" placeholder="Passwort" value={password} onChange={e=>setPassword(e.target.value)} required />
            {error && <div className="toast">{error}</div>}
            <button className="btn" disabled={loading}>{loading?'…':'Login'}</button>
          </form>
          <hr className="sep" />
          <div className="row">
            <Link href="/auth/register" className="link">Registrieren</Link>
            <Link href="/auth/forgot" className="link" style={{marginLeft:'auto'}}>Passwort vergessen?</Link>
          </div>
          <div style={{marginTop:16}}>
            <Link href="/admin/login" className="small muted">Admin Login</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
