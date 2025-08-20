import { NextResponse } from 'next/server'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'})
  const { message, stats, lang='de' } = req.body || {}
  if (!process.env.OPENAI_API_KEY) {
    return res.status(200).json({ reply: lang==='de' ? 'Hallo! Frag mich alles zur Pflanzenpflege 🌿' : 'Ahoj! Pýtaj sa na starostlivosť o rastliny 🌿' })
  }
  const system = `Du bist Greenbuddy, ein freundlicher Assistent für Zimmerpflanzen (Monstera). Antworte in der Sprache des Benutzers (lang=${lang}), ansonsten auf Deutsch.
Pflanzenstatus: Hydration ${stats?.water??'?'}/100, Nährstoffe ${stats?.food??'?'}/100, Spray ${stats?.spray??'?'}/100, Level ${stats?.level??'?'}. 
Wenn Werte niedrig sind, gib konkrete Schritte. Halte Antworten kurz (max. 3 Sätze). Wenn sinnvoll, füge am Ende eine Patch-Anweisung hinzu, z.B. <patch>{"spray":80}</patch>`
  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'Authorization':`Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model:'gpt-4o-mini',
        temperature:0.6,
        messages:[
          { role:'system', content: system },
          { role:'user', content: message || 'Hallo!' }
        ]
      })
    })
    const j = await r.json()
    const text = j?.choices?.[0]?.message?.content ?? (lang==='de' ? 'Keine Antwort verfügbar.' : 'Odpoveď nie je dostupná.')
    let patch = null, reply = text
    const m = text.match(/<patch>(.*?)<\/patch>/s)
    if (m) { reply = text.replace(m[0],'').trim(); try{ patch = JSON.parse(m[1]) }catch{} }
    return res.status(200).json({ reply, patchStats: patch })
  } catch (e) {
    return res.status(500).json({ error:String(e) })
  }
}
