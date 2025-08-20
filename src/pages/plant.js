import Plant from "@/components/Plant";

export default function PlantPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-900 to-black text-white">
      <h1 className="text-3xl mb-6">Moja virtuálna Monstera 🌿</h1>
      
      <Plant hydration={70} nutrition={60} xp={120} level={2} pests={0} />
    </div>
  );
}
