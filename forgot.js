import { useState } from 'react'
import { supabase } from '@/utils/supabaseClient'
import Link from 'next/link'

export default function Forgot() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError(''); setMsg('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window!=='undefined' ? `${window.location.origin}/auth/reset` : undefined
    })
    if (error) setError(error.message)
    else setMsg('E-Mail zum Zurücksetzen wurde gesendet.')
  }

  return (
    <main className="app">
      <div className="center">
        <div className="card" style={{maxWidth:480}}>
          <h1>Passwort vergessen</h1>
          <form onSubmit={onSubmit} className="list">
            <input className="input" type="email" placeholder="E-Mail" value={email} onChange={e=>setEmail(e.target.value)} required/>
            {error && <div className="toast">{error}</div>}
            {msg && <div className="toast">{msg}</div>}
            <button className="btn">E-Mail senden</button>
          </form>
          <hr className="sep"/>
          <Link href="/auth/login" className="link">Zurück zum Login</Link>
        </div>
      </div>
    </main>
  )
}
