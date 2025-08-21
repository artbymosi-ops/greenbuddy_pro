import Splash from "@/components/Splash";

export default function Home() {
  // ak by si chcela zobraziť splash iba 1×, použi:
  // if (typeof window !== "undefined" && localStorage.getItem("gb_seen_splash")) {
  //   return <RedirectToAuth />;
  // }
  return <Splash next="/auth" />;
}

// jednoduchý fallback ak chceš riešiť “len 1×”
function RedirectToAuth(){
  if (typeof window !== "undefined") {
    window.location.replace("/auth");
  }
  return null;
}
