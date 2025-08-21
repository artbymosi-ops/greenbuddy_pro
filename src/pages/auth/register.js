import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabaseClient';
import Layout from '@/components/Layout';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true); setMsg(''); setError('');
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else setMsg('Überprüfe bitte deine E-Mail, um die Registrierung zu bestätigen.');
  }

  return (
    <Layout>
      <main className="app">
        <div className="center">
          <div className="card" style={{ maxWidth: 420, width: '100%' }}>
            <h1 className="title" style={{ marginBottom: 8 }}>Registrieren</h1>
            <p className="subtitle">Erstelle einen neuen Account.</p>

            <form onSubmit={onSubmit} className="list">
              <input className="input" type="email" placeholder="E-Mail"
                     value={email} onChange={e => setEmail(e.target.value)} required />
              <input className="input" type="password" placeholder="Passwort"
                     value={password} onChange={e => setPassword(e.target.value)} required />

              {error && <div className="toast">{error}</div>}
              {msg && <div className="toast success">{msg}</div>}

              <button className="btn" disabled={loading}>{loading ? '…' : 'Registrieren'}</button>
            </form>

            <div style={{ marginTop: 12 }}>
              <Link href="/auth/login" className="link">Ich habe schon einen Account</Link>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
  }
