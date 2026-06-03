import ServicesStack from "@/components/ServicesStack";
import SelectedWork from "@/components/SelectedWork";
import ArchiveGallery from "@/components/ArchiveGallery";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[#fcfcfc] overflow-x-clip">
      <ServicesStack />
      <SelectedWork />
      <ArchiveGallery />
      <ServicesStack />
    </main>
  );
}
