import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import Layout from '@/components/Layout';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function AdminHome() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email === ADMIN_EMAIL) setAllowed(true);
      else window.location.href = '/admin/login';
    })();
  }, []);

  if (!allowed) return null;

  return (
    <Layout>
      <main className="app container">
        <h1 className="title">Admin</h1>
        <p className="subtitle">Willkommen im Admin-Bereich.</p>
        {/* sem potom doplníme správy, moderovanie fóra, atď. */}
      </main>
    </Layout>
  );
}
