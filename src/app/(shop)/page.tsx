import CategoryGrid from "@/components/shop/CategoryGrid";
import HeroSection from "@/components/shop/HeroSection";
import ProductCarousel from "@/components/shop/ProductCarousel";
import TestimonialSection from "@/components/shop/TestimonialSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <ProductCarousel title="Best Sellers" type="bestsellers" limit={6} />
      <ProductCarousel title="New Arrivals" type="new" />
      <TestimonialSection />
    </>
  );
}
