import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabaseClient'

export default function Reset() {
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError(''); setMsg('')
    const { data, error } = await supabase.auth.updateUser({ password })
    if (error) setError(error.message)
    else setMsg('Passwort geändert. Du kannst dich jetzt anmelden.')
  }

  return (
    <main className="app">
      <div className="center">
        <div className="card" style={{maxWidth:420}}>
          <h1>Neues Passwort</h1>
          <form onSubmit={onSubmit} className="list">
            <input className="input" type="password" placeholder="Neues Passwort" value={password} onChange={e=>setPassword(e.target.value)} required/>
            {error && <div className="toast">{error}</div>}
            {msg && <div className="toast">{msg}</div>}
            <button className="btn">Speichern</button>
          </form>
        </div>
      </div>
    </main>
  )
}
