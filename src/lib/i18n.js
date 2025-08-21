// src/lib/i18n.js
const KEY = "gb_lang";

const dict = {
  de: {
    badge: "Neu • Virtuelle Pflanze",
    h1: "Greenbuddy – deine spielerische Pflanzen-App",
    lead:
      "Pflege deine virtuelle Monstera, lerne die richtige Pflege für echte Pflanzen, plane Gießtermine und teile deinen Fortschritt.",
    ctaStart: "Loslegen",
    ctaLogin: "Anmelden",
    ctaSignup: "Registrieren",
    admin: "Admin? Hier einloggen",
  },
  sk: {
    badge: "Nové • Virtuálna rastlinka",
    h1: "Greenbuddy – tvoje hravé rastlinky v mobile",
    lead:
      "Staraj sa o virtuálnu Monsteru, nauč sa správnu starostlivosť o skutočné rastliny, plánuj zálievku a zdieľaj pokroky.",
    ctaStart: "Začať",
    ctaLogin: "Prihlásiť",
    ctaSignup: "Registrovať",
    admin: "Admin? Tu sa prihlás",
  },
};

export function getLang() {
  if (typeof window === "undefined") return "de";
  return localStorage.getItem(KEY) || "de";
}
export function setLang(lang) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, lang);
  window.dispatchEvent(new CustomEvent("gb_lang_change", { detail: lang }));
}
export function t(key) {
  const lang = getLang();
  return dict[lang]?.[key] ?? dict.de[key] ?? key;
}
export const langs = [
  { code: "de", label: "Deutsch" },
  { code: "sk", label: "Slovenčina" },
];
