// src/components/LangSwitch.jsx
import { useEffect, useState } from "react";
import { getLang, setLang, langs } from "@/lib/i18n";

export default function LangSwitch() {
  const [lang, setL] = useState(getLang());

  useEffect(() => {
    const onChange = (e) => setL(e.detail);
    window.addEventListener("gb_lang_change", onChange);
    return () => window.removeEventListener("gb_lang_change", onChange);
  }, []);

  return (
    <select
      className="input"
      style={{ width: 140, padding: "8px 10px", height: 40 }}
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      aria-label="Sprache"
    >
      {langs.map((l) => (
        <option key={l.code} value={l.code}>{l.label}</option>
      ))}
    </select>
  );
}
