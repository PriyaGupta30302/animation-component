import ServicesStack from "@/components/ServicesStack";
import SelectedWork from "@/components/SelectedWork";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[#fcfcfc] overflow-x-clip">
      <ServicesStack />
      <SelectedWork />
      <ServicesStack />
    </main>
  );
}
