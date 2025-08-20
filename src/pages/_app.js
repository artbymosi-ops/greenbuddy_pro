import "@/styles/globals.css";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  // Voliteľné: PWA service worker (nevadí, ak /sw.js nemáš)
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
