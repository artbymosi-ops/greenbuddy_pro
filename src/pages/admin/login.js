  import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import Layout from '@/components/Layout';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL; // nastav v .env

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    if (email !== ADMIN_EMAIL) {
      setError('Kein Admin-Konto.');
      await supabase.auth.signOut();
      return;
    }
    window.location.href = '/admin';
  }

  return (
    <Layout>
      <main className="app">
        <div className="center">
          <div className="card" style={{ maxWidth: 420, width: '100%' }}>
            <h1 className="title" style={{ marginBottom: 8 }}>Admin Login</h1>
            <form onSubmit={onSubmit} className="list">
              <input className="input" type="email" placeholder="Admin E-Mail"
                     value={email} onChange={e => setEmail(e.target.value)} required />
              <input className="input" type="password" placeholder="Passwort"
                     value={password} onChange={e => setPassword(e.target.value)} required />
              {error && <div className="toast">{error}</div>}
              <button className="btn" disabled={loading}>{loading ? '…' : 'Login'}</button>
            </form>
          </div>
        </div>
      </main>
    </Layout>
  );
}
