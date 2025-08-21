// src/pages/api/chat.js
export const config = { api: { bodyParser: { sizeLimit: "10mb" } } };

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { messages = [], context = {}, images = [] } = req.body || {};

    const lastUser = messages.filter(m => m.role === "user").slice(-1)[0]?.content || "";
    const languageHint = detectLang(lastUser) || "de";

    const system = `
Du bist "Greenbuddy", ein freundlicher, präziser Pflanzen-Coach für Zimmerpflanzen.
Antworte in der Sprache der letzten Nutzer-Nachricht (fallback Deutsch).
Vorgehen:
- Stelle zuerst 1–3 kurze Klärungsfragen, falls nötig (Licht, Gießrhythmus, Substrat, Temp., Zugluft).
- Gib priorisierte Hypothesen mit typischen Symptomen.
- Nenne konkrete Schritte: heute / diese Woche / langfristig (messbar: ml, % r.F., Lux, °C).
- Warne bei Risiken (Fäulnis, Pilz), schlage Isolation vor.
- Wenn Bilder, beschreibe kurz, was du erkennst.
- Schließe mit einem Mini-Pflegeplan (• bullets).
`;

    // zostavíme multimodal message – akceptuj http aj data: URL
    const userContent = [{ type: "text", text: lastUser || "Hallo! Hilfe mit meiner Pflanze, bitte." }];
    for (const url of images) {
      if (typeof url === "string" && (url.startsWith("http") || url.startsWith("data:"))) {
        userContent.push({ type: "image_url", image_url: { url, detail: "low" } });
      }
    }

    const payload = {
      model: MODEL,
      temperature: 0.4,
      messages: [
        { role: "system", content: system },
        ...(context?.plant
          ? [{
              role: "system",
              content: `Kontext Nutzerpflanze: Art=${context.plant.species||"?"}, Standort=${context.plant.light||"?"}, Gießen=${context.plant.watering||"?"}, Letzte Aktionen=${context.plant.lastActions||"?"}`
            }]
          : []),
        ...messages.filter(m => m.role === "assistant" || m.role === "user").slice(-6),
        { role: "user", content: userContent }
      ]
    };

    const r = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!r.ok) {
      const tx = await r.text();
      return res.status(500).json({ error: "OpenAI error", detail: tx });
    }
    const data = await r.json();
    const text = data?.choices?.[0]?.message?.content || "Entschuldige, ich konnte gerade nichts finden.";
    res.status(200).json({ reply: text, lang: languageHint });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
}

function detectLang(s="") {
  const t = s.toLowerCase();
  if (/[äöüß]/.test(t) || /\b(warum|pflanze|gießen|düngen|blatt|gelb)\b/.test(t)) return "de";
  if (/\b(why|plant|water|fertilizer|leaf)\b/.test(t)) return "en";
  if (/[áéíóúýčďěňřšťůžĺľňť]/.test(t)) return "sk";
  return "de";
}
