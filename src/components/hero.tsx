"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
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
    href: "/services/ai-automation",
    description:
      "Streamline operations with intelligent automation, chatbots, and AI-powered workflows that save time and reduce costs.",
  },
  {
    icon: Globe,
    title: "Website Development",
    href: "/services/website-development",
    description:
      "Custom-built, responsive websites that look stunning and perform flawlessly across every device and browser.",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    href: "/services/mobile-app-development",
    description:
      "Native and cross-platform mobile apps designed to engage users and extend your digital reach.",
  },
  {
    icon: ShoppingCart,
    title: "Ecommerce Solutions",
    href: "/services/ecommerce",
    description:
      "End-to-end online store development with secure payments, inventory management, and conversion optimization.",
  },
  {
    icon: Search,
    title: "SEO & Analytics",
    href: "/services/website-seo",
    description:
      "Data-driven search engine optimization that boosts visibility and drives qualified organic traffic to your site.",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    href: "/services/advertisement-creation",
    description:
      "Strategic advertising campaigns across Google, social media, and more to maximize your ROI and brand awareness.",
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    href: "/services/cybersecurity",
    description:
      "Comprehensive security audits, penetration testing, and protection strategies to safeguard your digital assets.",
  },
  {
    icon: Palette,
    title: "Design & Branding",
    href: "/services/design",
    description:
      "Eye-catching UI/UX design, brand identity, and creative assets that make a lasting impression.",
  },
];

export function Hero() {
  return (
    <section className="bg-white">
      {/* The browser selects one source for the current viewport. */}
      <div className="w-full aspect-[9/16] sm:aspect-[16/7] sm:max-h-[720px] overflow-hidden bg-neon-navy">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/hero-poster.jpg"
          className="block w-full h-full object-cover"
        >
          <source
            src="/mobile_hero_video.mp4"
            type="video/mp4"
            media="(max-width: 639px)"
          />
          <source
            src="/hero_video_1080p.mp4"
            type="video/mp4"
            media="(min-width: 1280px)"
          />
          <source src="/hero_video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content below the video */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neon-navy leading-[1.1]">
            Websites, apps, and automation for your business.
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-wild-dove leading-relaxed">
            We design and build the tools your business needs to grow.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              data-placement="hero"
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-neon-navy text-sunset font-medium rounded-full hover:bg-nebulosity transition-all"
            >
              Discuss your project
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/portfolio"
              data-placement="hero"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-neon-navy/20 text-neon-navy/70 font-medium rounded-full hover:bg-neon-navy/5 hover:text-neon-navy transition-all"
            >
              View our work
            </Link>
          </div>
        </div>
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
              We combine strategy, design, and technology to deliver solutions
              that move the needle. Whether you&apos;re launching from scratch
              or scaling to new heights, we&apos;ve got you covered.
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
              >
                <Link
                  href={cap.href}
                  data-track="service_click"
                  data-service={cap.href.split("/").at(-1)}
                  data-placement="card"
                  aria-label={cap.title}
                  className="group block h-full p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white transition-colors"
                >
                  <div className="h-10 w-10 rounded-xl bg-sunset/10 flex items-center justify-center mb-4">
                    <cap.icon
                      aria-hidden="true"
                      className="h-5 w-5 text-sunset/80"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {cap.title}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed">
                    {cap.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Already have a website?
              </h3>
              <p className="mt-2 text-sm text-white/70">
                Get three practical improvements. No call required.
              </p>
              <p className="mt-3 text-sm text-white/70">
                In the trades?{" "}
                <Link
                  href="/websites-for-contractors"
                  className="text-sunset underline underline-offset-4"
                >
                  Explore websites for Ottawa contractors.
                </Link>
              </p>
            </div>
            <Link
              href="/contact?intent=review&service=website-development#inquiry-form"
              data-placement="review"
              className="inline-flex items-center justify-center gap-2 self-start shrink-0 rounded-full bg-sunset px-6 py-3 font-medium text-neon-navy hover:bg-white transition-colors"
            >
              Get a free website review
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
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
              { value: "50+", label: "Projects Delivered" },
              { value: "40+", label: "Happy Clients" },
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
