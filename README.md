# Greenbuddy – Pro (Next.js + Supabase)

Funkcie: DE UI, Tamagotchi Monstera, AI Chat (OpenAI), Auth (Login/Registrácia/Reset), Kalender, Tagebuch (foto upload), Forum (posty/koment/like/report), Inbox kódy, Konto, Admin moderácia.

## Nasadenie
1. Vytvor Supabase projekt → zaznač `NEXT_PUBLIC_SUPABASE_URL` a `NEXT_PUBLIC_SUPABASE_ANON_KEY` do `.env.local`.
2. V Supabase → SQL editor → vlož obsah `supabase_schema.sql` (tabuľky + RLS + storage buckets).
3. Vercel → Project → pridaj env vars z `.env.local` + `OPENAI_API_KEY`.
4. Deploy.

## Lokálne
```
npm i
cp .env.local.example .env.local
# doplň kľúče
npm run dev
```

## Admin
- /admin/login (dočasné údaje z env: ADMIN_USERNAME/ADMIN_PASSWORD, default admin/admin)
