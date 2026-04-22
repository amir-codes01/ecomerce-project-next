"use client";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  CheckCircle,
  Clock,
  Globe,
  Headphones,
  Heart,
  RefreshCw,
  Shield,
  ShoppingBag,
  Star,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const stats = [
    {
      icon: Users,
      value: "50K+",
      label: "Happy Customers",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: ShoppingBag,
      value: "100K+",
      label: "Products Sold",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Globe,
      value: "25+",
      label: "Countries Served",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Star,
      value: "4.8",
      label: "Customer Rating",
      color: "from-yellow-500 to-orange-500",
    },
  ];

  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "Free shipping on all orders over $100",
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure payment methods",
      color: "bg-green-100 dark:bg-green-900/30 text-green-600",
    },
    {
      icon: RefreshCw,
      title: "Easy Returns",
      description: "30-day return policy",
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Dedicated customer support team",
      color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600",
    },
    {
      icon: Award,
      title: "Quality Guarantee",
      description: "Premium quality products",
      color: "bg-red-100 dark:bg-red-900/30 text-red-600",
    },
    {
      icon: Clock,
      title: "Fast Delivery",
      description: "Quick shipping worldwide",
      color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600",
    },
  ];

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
      bio: "Former e-commerce executive with 15+ years of experience",
      social: { linkedin: "#", twitter: "#" },
    },
    {
      name: "Michael Chen",
      role: "Head of Operations",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
      bio: "Supply chain expert ensuring smooth deliveries",
      social: { linkedin: "#", twitter: "#" },
    },
    {
      name: "Emily Rodriguez",
      role: "Creative Director",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
      bio: "Award-winning designer with an eye for trends",
      social: { linkedin: "#", twitter: "#" },
    },
    {
      name: "David Kim",
      role: "Tech Lead",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
      bio: "Tech innovator building seamless experiences",
      social: { linkedin: "#", twitter: "#" },
    },
  ];

  const milestones = [
    {
      year: "2020",
      title: "Company Founded",
      description: "Started with a vision to revolutionize online shopping",
    },
    {
      year: "2021",
      title: "First Milestone",
      description: "Reached 10,000 happy customers",
    },
    {
      year: "2022",
      title: "Global Expansion",
      description: "Expanded to 15 countries worldwide",
    },
    {
      year: "2023",
      title: "Award Winner",
      description: "Recognized as best e-commerce platform",
    },
    {
      year: "2024",
      title: "Innovation Hub",
      description: "Launched AI-powered shopping assistant",
    },
  ];

  const values = [
    {
      title: "Customer First",
      description: "Our customers are at the heart of everything we do",
      icon: Heart,
    },
    {
      title: "Innovation",
      description: "Constantly evolving to serve you better",
      icon: TrendingUp,
    },
    {
      title: "Integrity",
      description: "Honest and transparent in all our dealings",
      icon: CheckCircle,
    },
    {
      title: "Excellence",
      description: "Striving for perfection in every detail",
      icon: Award,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <section className="relative overflow-hidden bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Story</h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              We're on a mission to transform the way people shop online, making
              it more convenient, secure, and enjoyable for everyone.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105"
              >
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
