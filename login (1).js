import { useState } from 'react'

export default function AdminLogin(){
  const [u,setU]=useState(''); const [p,setP]=useState(''); const [e,setE]=useState('')
  function submit(evn){
    evn.preventDefault(); setE('')
    const U = process.env.ADMIN_USERNAME || 'admin'
    const P = process.env.ADMIN_PASSWORD || 'admin'
    if (u===U && p===P) { localStorage.setItem('gb_admin','1'); window.location.href='/admin' }
    else setE('Falsche Zugangsdaten.')
  }
  return (
    <main className="app center">
      <div className="card" style={{maxWidth:420}}>
        <h1>Admin-Login</h1>
        <form onSubmit={submit} className="list">
          <input className="input" placeholder="Benutzername" value={u} onChange={e=>setU(e.target.value)}/>
          <input className="input" placeholder="Passwort" type="password" value={p} onChange={e=>setP(e.target.value)}/>
          {e && <div className="toast">{e}</div>}
          <button className="btn">Login</button>
        </form>
      </div>
    </main>
  )
}
