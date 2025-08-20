export function detectLang(text, fallback = process.env.DEFAULT_LANG || 'de') {
  if (!text) return fallback
  const t = text.toLowerCase()
  if (/[äöüß]/.test(t) || /(und|oder|pflanze|gießen|düngen)/.test(t)) return 'de'
  if (/[áéíóúýčďĺľňôŕšťž]/.test(t) || /(ako|prečo|zalievať)/.test(t)) return 'sk'
  if (/[áéíóúñü]/.test(t) || /(y|de|la|el)/.test(t)) return 'es'
  if (/[àâçéèêëîïôùûüÿœ]/.test(t) || /(et|ou|plante)/.test(t)) return 'fr'
  return fallback
}
