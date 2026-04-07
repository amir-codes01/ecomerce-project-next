"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  Shield,
  TrendingUp,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Slide {
  _id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  badge?: string;
  badgeColor?: string;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const slides: Slide[] = [
  {
    _id: 1,
    title: "Summer Collection 2026",
    subtitle: "Up to 50% Off",
    description:
      "Discover the latest trends in fashion with our exclusive summer collection. Limited time offer!",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
    ctaText: "Shop Now",
    ctaLink: "/shop",
    badge: "HOT DEAL",
    badgeColor: "bg-red-500",
  },
  {
    _id: 2,
    title: "Premium Electronics",
    subtitle: "Next-Gen Technology",
    description:
      "Experience cutting-edge technology with our premium electronics. Free shipping on all orders!",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&q=80",
    ctaText: "Explore Electronics",
    ctaLink: "/categories/electronics",
    badge: "NEW ARRIVALS",
    badgeColor: "bg-blue-500",
  },
  {
    _id: 3,
    title: "Home & Living",
    subtitle: "Transform Your Space",
    description:
      "Create your dream home with our curated collection of furniture and decor.",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80",
    ctaText: "Shop Home Decor",
    ctaLink: "/categories/home-living",
    badge: "BESTSELLERS",
    badgeColor: "bg-purple-500",
  },
];

const features: Feature[] = [
  {
    icon: <Truck className="h-5 w-5" />,
    title: "Free Shipping",
    description: "On orders over $50",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Secure Payment",
    description: "100% secure transactions",
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "24/7 Support",
    description: "Dedicated customer service",
  },
  {
    icon: <TrendingUp className="h-5 w-5" />,
    title: "Best Prices",
    description: "Price match guarantee",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [touchStart, setTouchStart] = useState(0);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };
  return (
    <section className="relative bg-linear-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div
        className=" relative h-150 md:h-175 lg:h-[80vh] min-h-125"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 z-0">
              <Image
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-transparent dark:from-black/80 dark:via-black/60" />
            </div>
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
              <div className="max-w-2xl ">
                {slides[currentSlide].badge && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span
                      className={`inline-block px-3 py-1 ${slides[currentSlide].badgeColor} text-white text-xs font-semibold rounded-full mb-4`}
                    >
                      {slides[currentSlide].badge}
                    </span>
                  </motion.div>
                )}

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-blue-400 dark:text-blue-300 font-semibold text-sm md:text-base uppercase tracking-wide mb-2"
                >
                  {slides[currentSlide].subtitle}
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
                >
                  {slides[currentSlide].title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-200 text-base md:text-lg mb-8 max-w-lg"
                >
                  {slides[currentSlide].description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link
                    href={slides[currentSlide].ctaLink}
                    className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all transform hover:scale-105 shadow-lg"
                  >
                    {slides[currentSlide].ctaText}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-white" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 md:p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-white" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentSlide(index);
                setTimeout(() => setIsAutoPlaying(true), 5000);
              }}
              className={`transition-all rounded-full focus:outline-none focus:ring-2 focus:ring-white ${
                currentSlide === index
                  ? "w-8 h-2 bg-white"
                  : "w-2 h-2 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      <div className="relative z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center gap-3 justify-center md:justify-start"
              >
                <div className="text-blue-600 dark:text-blue-400">
                  {feature.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 hidden md:block z-20"
      >
        <div className="flex flex-col items-center gap-2 text-white/60 text-xs">
          <span>Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-5 h-8 border-2 border-white/60 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-2 bg-white/60 rounded-full mt-1"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
