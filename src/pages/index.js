import dynamic from "next/dynamic";
const Splash = dynamic(() => import("@/components/Splash"), { ssr: false });

export default function Home() {
  return <Splash next="/auth" />;
}
