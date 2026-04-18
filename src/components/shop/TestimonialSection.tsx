"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface TestimonialSectionProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showNavigation?: boolean;
  showDots?: boolean;
  backgroundColor?: string;
}

export interface Testimonial {
  _id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TestimonialSection({
  title = "What Our Customers Say",
  subtitle = "Join thousands of satisfied customers who trust us for their shopping needs",
  limit = 6,
  autoPlay = true,
  autoPlayInterval = 5000,
  showNavigation = true,
  showDots = true,
  backgroundColor = "bg-gray-50 dark:bg-gray-900",
}: TestimonialSectionProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);

      setTestimonials(getMockTestimonials());
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
      setError("Failed to load testimonials. Please try again later.");
      setTestimonials(getMockTestimonials());
    } finally {
      setLoading(false);
    }
  };

  const getMockTestimonials = (): Testimonial[] => {
    return [
      {
        _id: "1",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        rating: 5,
        comment:
          "Absolutely love my purchase! The quality exceeded my expectations and shipping was super fast. Will definitely be buying from here again.",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: "2",
        name: "Michael Chen",
        email: "michael@example.com",
        rating: 5,
        comment:
          "Great customer service! Had an issue with my order and they resolved it within hours. The product itself is fantastic.",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: "3",
        name: "Emily Rodriguez",
        email: "emily@example.com",
        rating: 4,
        comment:
          "Really happy with my purchase. The attention to detail is impressive. Would recommend to friends and family.",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: "4",
        name: "David Kim",
        email: "david@example.com",
        rating: 5,
        comment:
          "Best online shopping experience I've had. The product arrived earlier than expected and works perfectly.",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: "5",
        name: "Lisa Thompson",
        email: "lisa@example.com",
        rating: 5,
        comment:
          "Amazing quality and great prices. The packaging was beautiful too. Will be ordering again soon!",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: "6",
        name: "James Wilson",
        email: "james@example.com",
        rating: 4,
        comment:
          "Very satisfied with my purchase. The customer support team was very helpful when I had questions.",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  };

  useEffect(() => {
    fetchTestimonials();
  }, [limit]);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && testimonials.length > 0) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, autoPlayInterval);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, testimonials.length, autoPlayInterval]);

  const resetAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, autoPlayInterval);
    }
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    resetAutoPlay();
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + testimonials.length) % testimonials.length,
    );
    resetAutoPlay();
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    resetAutoPlay();
  };

  const pauseAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    setIsAutoPlaying(false);
  };

  const resumeAutoPlay = () => {
    setIsAutoPlaying(true);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <section className={`py-16 ${backgroundColor}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="text-center mb-12">
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded mx-auto animate-pulse"></div>
          </div>

          {/* Testimonials Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-11/12 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && testimonials.length === 0) {
    return (
      <section className={`py-16 ${backgroundColor}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchTestimonials}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }
  if (testimonials.length === 0) {
    return null;
  }
  return (
    <section className={`py-16 ${backgroundColor}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        </div>
        <div className="hidden lg:block">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="p-8 md:p-12">
                    <Quote className="h-12 w-12 text-blue-500 mb-6 opacity-50" />
                    <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      "{testimonials[currentIndex].comment}"
                    </p>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-12 h-12">
                        {testimonials[currentIndex].avatar ? (
                          <Image
                            src={testimonials[currentIndex].avatar!}
                            alt={testimonials[currentIndex].name}
                            fill
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {testimonials[currentIndex].name}
                        </h4>
                        {renderStars(testimonials[currentIndex].rating)}
                      </div>
                    </div>
                  </div>
                  <div className="relative bg-linear-to-br from-blue-500 to-purple-600 p-8 md:p-12 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Quote className="h-20 w-20 mx-auto mb-4 opacity-20" />
                      <p className="text-lg font-semibold">
                        {testimonials.length}+ Happy Customers
                      </p>
                      <p className="text-sm opacity-80">And counting...</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            {showNavigation && testimonials.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  onMouseEnter={pauseAutoPlay}
                  onMouseLeave={resumeAutoPlay}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </button>
                <button
                  onClick={goToNext}
                  onMouseEnter={pauseAutoPlay}
                  onMouseLeave={resumeAutoPlay}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </button>
              </>
            )}
            {showDots && testimonials.length > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    onMouseEnter={pauseAutoPlay}
                    onMouseLeave={resumeAutoPlay}
                    className={`h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? "w-8 bg-blue-600"
                        : "w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="lg:hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.slice(0, 4).map((testimonial, index) => (
              <motion.div
                key={testimonial._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    {testimonial.avatar ? (
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    {renderStars(testimonial.rating)}
                  </div>
                </div>

                <Quote className="h-8 w-8 text-blue-500 mb-3 opacity-30" />
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-4">
                  {testimonial.comment}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {testimonials.length}+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Happy Customers
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                4.8
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Average Rating
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                100%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Satisfaction Rate
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                24/7
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Customer Support
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
