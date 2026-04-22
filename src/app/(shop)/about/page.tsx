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
import Image from "next/image";
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
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-r ${stat.color} mb-4 mx-auto shadow-lg`}
                >
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                  alt="Our team working together"
                  width={600}
                  height={500}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">
                      Trusted Partner
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Certified Excellence
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Our Journey
              </h2>
              <div className="w-20 h-1 bg-blue-600 mb-6"></div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                Founded in 2020, ShopHub started with a simple idea: to create
                an online shopping experience that puts customers first. What
                began as a small team of passionate individuals has grown into a
                thriving community of shoppers and sellers.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Today, we're proud to serve millions of customers worldwide,
                offering a curated selection of high-quality products at
                competitive prices. Our commitment to excellence, innovation,
                and customer satisfaction drives everything we do.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {values.map((value, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <value.icon className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {value.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {value.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                To empower people worldwide by providing a seamless, secure, and
                enjoyable online shopping experience. We strive to connect
                quality products with happy customers, while fostering a
                community built on trust and innovation.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                To become the world's most trusted and innovative e-commerce
                platform, revolutionizing the way people shop and setting new
                standards for customer experience, sustainability, and
                technological advancement.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
