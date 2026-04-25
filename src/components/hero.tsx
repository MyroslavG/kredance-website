"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Globe,
  Bot,
  Smartphone,
  ShoppingCart,
  Search,
  Megaphone,
  Shield,
  Palette,
} from "lucide-react";

const capabilities = [
  {
    icon: Bot,
    title: "AI Automation",
    description:
      "Streamline operations with intelligent automation, chatbots, and AI-powered workflows that save time and reduce costs.",
  },
  {
    icon: Globe,
    title: "Website Development",
    description:
      "Custom-built, responsive websites that look stunning and perform flawlessly across every device and browser.",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    description:
      "Native and cross-platform mobile apps designed to engage users and extend your digital reach.",
  },
  {
    icon: ShoppingCart,
    title: "Ecommerce Solutions",
    description:
      "End-to-end online store development with secure payments, inventory management, and conversion optimization.",
  },
  {
    icon: Search,
    title: "SEO & Analytics",
    description:
      "Data-driven search engine optimization that boosts visibility and drives qualified organic traffic to your site.",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    description:
      "Strategic advertising campaigns across Google, social media, and more to maximize your ROI and brand awareness.",
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    description:
      "Comprehensive security audits, penetration testing, and protection strategies to safeguard your digital assets.",
  },
  {
    icon: Palette,
    title: "Design & Branding",
    description:
      "Eye-catching UI/UX design, brand identity, and creative assets that make a lasting impression.",
  },
];

export function Hero() {
  return (
    <section className="bg-white">
      {/* Mobile video - full screen, sides cropped */}
      <div className="relative sm:hidden w-full h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/mobile_hero_video.mp4`} type="video/mp4" />
        </video>
        {/* Scroll indicator - mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs font-medium text-white/80 tracking-widest uppercase">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-5 w-5 text-white/80" />
          </motion.div>
        </motion.div>
      </div>

      {/* Desktop video */}
      <div className="relative hidden sm:block w-full aspect-[16/8] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-top"
        >
          <source src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/hero_video.mp4`} type="video/mp4" />
        </video>
        {/* Scroll indicator - desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs font-medium text-white/80 tracking-widest uppercase">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-5 w-5 text-white/80" />
          </motion.div>
        </motion.div>
      </div>

      {/* Content below the video */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-neon-navy leading-[1.1]">
            We Build Digital
            <br />
            Experiences That
            <br />
            Drive Growth
          </h1>

          <p className="mt-8 max-w-2xl mx-auto text-lg text-wild-dove leading-relaxed">
            From AI automation to custom websites, SEO, and eCommerce &mdash; Kredance
            delivers end-to-end digital solutions that transform how businesses operate and grow.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-neon-navy text-sunset font-medium rounded-full hover:bg-nebulosity transition-all"
            >
              Start a Project
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-neon-navy/20 text-neon-navy/70 font-medium rounded-full hover:bg-neon-navy/5 hover:text-neon-navy transition-all"
            >
              Explore Services
            </Link>
          </div>
        </motion.div>
      </div>

      {/* What We Do - Capabilities Grid */}
      <div className="bg-neon-navy">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <p className="text-sm font-medium text-sunset/60 tracking-widest uppercase mb-4">
              What We Do
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
              Everything Your Business
              <br />
              Needs to Thrive Online
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-base text-white/50 leading-relaxed">
              We combine strategy, design, and technology to deliver solutions that move the needle.
              Whether you&apos;re launching from scratch or scaling to new heights, we&apos;ve got you covered.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all"
              >
                <div className="h-10 w-10 rounded-xl bg-sunset/10 flex items-center justify-center mb-4">
                  <cap.icon className="h-5 w-5 text-sunset/80" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {cap.title}
                </h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  {cap.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 text-sm font-medium text-sunset/70 hover:text-sunset transition-colors"
            >
              View all services
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Stats / Social proof strip */}
      <div className="bg-white border-t border-black/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center"
          >
            {[
              { value: "30+", label: "Projects Delivered" },
              { value: "20+", label: "Happy Clients" },
              { value: "15+", label: "Services Offered" },
              { value: "24/7", label: "Support Available" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl sm:text-5xl font-bold text-neon-navy">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-wild-dove">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
