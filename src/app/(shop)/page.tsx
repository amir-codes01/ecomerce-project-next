// app/(shop)/page.tsx

import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
// import FeaturedProducts from "@/components/home/FeaturedProducts";
import FlashSale from "@/components/home/FlashSale";
import NewArrivals from "@/components/home/NewArrivals";
import BestSellers from "@/components/home/BestSellers";
import PromoBanner from "@/components/home/PromoBanner";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import Navbar from "@/components/layout/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <div className="space-y-10">
        <Hero />
        <Categories />
        {/* <FeaturedProducts /> */}
        <FlashSale />
        <NewArrivals />
        <BestSellers />
        <PromoBanner />
        <Testimonials />
        <Newsletter />
      </div>
    </>
  );
}
