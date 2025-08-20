// src/pages/api/chat.js
export const config = { api: { bodyParser: { sizeLimit: "10mb" } } };

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini"; // môžeš zmeniť vo Verceli

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { messages = [], context = {}, images = [] } = req.body || {};

    // Bezpečnostné minimum: zreťazíme text + obrázky do messages pre OpenAI
    const lastUser = messages.filter(m => m.role === "user").slice(-1)[0]?.content || "";
    const languageHint = detectLang(lastUser) || "de";

    const system = `
Du bist "Greenbuddy", ein freundlicher, präziser Pflanzen-Coach für Zimmerpflanzen.
Antworte in der Sprache der letzten Nutzer-Nachricht; wenn unklar, antworte auf Deutsch.
Ziele:
- Stelle zuerst 1–3 klärende Fragen, wenn Infos chýbajú (Licht, Gießrhythmus, Substrat, Temperatur, Zugluft).
- Dann gib priorisierte Diagnose-Hypothesen (am häufigsten -> am zriedkavejšie) s krátkymi symptomami.
- Daj konkrétne kroky: heute / diese Woche / langfristig.
- Zahrň rozsahy: frekvencia zálievky, množstvo svetla (lux/okno), vlhkosť %, teploty.
- Ak je problém nebezpečný (huba, hniloba), varuj a navrhni izoláciu/karanténu.
- Pri obrázkoch ohodnoť, čo vidíš (listy, škodcovia, machule...).
- Nakoniec ponúkni krátky "Pflege-Plan" (bullet points) a checklist.
- Krátke, praktické, bez zbytočnej omáčky.

Output formát:
- krátka odpoveď (odseky + • bullets), bez JSON.
`;

    // Vstavané obrázky (image_url) – AI ich vie zohľadniť
    const userContent = [];
    // text
    userContent.push({ type: "text", text: lastUser || "Hallo! Hilfe mit meiner Pflanze, bitte." });
    // images (absolute alebo public supabase URLs)
    for (const url of images) {
      if (typeof url === "string" && url.startsWith("http")) {
        userContent.push({ type: "image_url", image_url: { url, detail: "low" } });
      }
    }

    const payload = {
      model: MODEL,
      temperature: 0.4,
      messages: [
        { role: "system", content: system },
        // voliteľný kontext z tvojej appky (napr. užívateľove rastliny)
        ...(context?.plant
          ? [{
              role: "system",
              content: `Kontext Nutzerpflanze: Art=${context.plant.species||"Unbekannt"}, Standort=${context.plant.light||"?"}, Gießen=${context.plant.watering||"?"}, Letzte Aktionen=${context.plant.lastActions||"?"}`
            }]
          : []),
        // históriu (assistant/user) nechávame
        ...messages.filter(m => m.role === "assistant" || m.role === "user").slice(-6).map(m => ({
          role: m.role,
          content: m.content
        })),
        // aktuálny vstup ako multimodal
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

// veľmi jednoduchá jazyková heuristika
function detectLang(s="") {
  const t = s.toLowerCase();
  if (/[äöüß]/.test(t) || /\b(warum|pflanze|gießen|gie\u00dfen|dünger|düngen|blatt|gelb)\b/.test(t)) return "de";
  if (/\b(why|plant|water|fertilizer|leaf)\b/.test(t)) return "en";
  if (/[áéíóúýčďěňřšťůž]/.test(t)) return "sk";
  if (/[áéíóúĺľňťž]/.test(t)) return "sk";
  return "de";
}
