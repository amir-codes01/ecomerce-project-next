import CategoryGrid from "@/components/shop/CategoryGrid";
import HeroSection from "@/components/shop/HeroSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <CategoryGrid />
    </main>
  );
}
