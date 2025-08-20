import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/utils/supabaseClient'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError(''); setMsg('')
    if (!accepted) { setError('Bitte Datenschutz akzeptieren.'); return }
    const { data, error } = await supabase.auth.signUp({
      email, password, options:{ data:{ nickname } }
    })
    if (error) setError(error.message)
    else setMsg('Bitte bestätige deine E-Mail, um dein Konto zu aktivieren.')
  }

  return (
    <main className="app">
      <div className="center">
        <div className="card" style={{maxWidth:480, width:'100%'}}>
          <h1>Registrieren</h1>
          <form onSubmit={onSubmit} className="list">
            <input className="input" type="text" placeholder="Nickname" value={nickname} onChange={e=>setNickname(e.target.value)} required/>
            <input className="input" type="email" placeholder="E-Mail" value={email} onChange={e=>setEmail(e.target.value)} required/>
            <input className="input" type="password" placeholder="Passwort" value={password} onChange={e=>setPassword(e.target.value)} required/>
            <label className="row" style={{alignItems:'flex-start'}}>
              <input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)} style={{marginTop:4}}/>
              <span>Ich akzeptiere die <a className="link" href="#" target="_blank">Datenschutzerklärung</a>.</span>
            </label>
            {error && <div className="toast">{error}</div>}
            {msg && <div className="toast">{msg}</div>}
            <button className="btn">Konto erstellen</button>
          </form>
          <hr className="sep"/>
          <Link href="/auth/login" className="link">Schon ein Konto? Einloggen</Link>
        </div>
      </div>
    </main>
  )
}
