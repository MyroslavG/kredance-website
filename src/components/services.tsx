"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Megaphone,
  Bot,
  Puzzle,
  Shield,
  Database,
  Search,
  Palette,
  ShoppingCart,
  BarChart3,
  Smartphone,
  Package,
  Plug,
  Globe,
  TrendingUp,
} from "lucide-react";

const services = [
  {
    icon: Globe,
    name: "Websites",
    href: "/services/website-development",
    description: "Distinctive websites that explain what you do and make it easy to get in touch.",
  },
  {
    icon: Megaphone,
    name: "Advertising",
    href: "/services/advertisement-creation",
    description: "Ad creative and campaigns built around your offer, audience, and next enquiry.",
  },
  {
    icon: Megaphone,
    name: "Facebook Lead Generation",
    href: "/services/facebook-lead-generation",
    description: "Video ads, thoughtful lead forms, and automated notifications that connect enquiries to your team.",
  },
  {
    icon: BarChart3,
    name: "Google Ads Specialist",
    href: "/services/google-ads",
    description: "Search campaigns that connect your services with people already looking for them.",
  },
  {
    icon: TrendingUp,
    name: "Website SEO",
    href: "/services/website-seo",
    description: "Data-driven SEO strategies that improve rankings and drive organic traffic.",
  },
  {
    icon: ShoppingCart,
    name: "Ecommerce Shop Development",
    href: "/services/ecommerce",
    description: "High-converting online stores built for scale, speed, and seamless checkout.",
  },
  {
    icon: Palette,
    name: "Design",
    href: "/services/design",
    description: "Beautiful, functional design systems that elevate your brand across every touchpoint.",
  },
  {
    icon: Smartphone,
    name: "Mobile App Development",
    href: "/services/mobile-app-development",
    description: "Native and cross-platform mobile apps that deliver exceptional user experiences.",
  },
  {
    icon: Bot,
    name: "AI Automation",
    href: "/services/ai-automation",
    description: "Intelligent automation solutions that streamline operations and boost productivity.",
  },
  {
    icon: Puzzle,
    name: "AI Integration",
    href: "/services/ai-integration",
    description: "Seamlessly embed AI capabilities into your existing tech stack and workflows.",
  },
  {
    icon: Shield,
    name: "Cybersecurity Services",
    href: "/services/cybersecurity",
    description: "Protect your digital assets with enterprise-grade security solutions and monitoring.",
  },
  {
    icon: Database,
    name: "Data Migration",
    href: "/services/data-migration",
    description: "Smooth, secure data transitions between platforms with zero downtime or data loss.",
  },
  {
    icon: Search,
    name: "Data Mining & Scraping",
    href: "/services/data-mining",
    description: "Extract valuable insights from the web with compliant, scalable data collection.",
  },
  {
    icon: Package,
    name: "Small Business IT Package",
    href: "/services/small-business-it",
    description: "All-in-one IT solutions tailored for small businesses at accessible price points.",
  },
  {
    icon: Plug,
    name: "Universal Plugin Solutions",
    href: "/services/universal-plugin-solutions",
    description: "Custom plugins and extensions that extend your platform's capabilities.",
  },
];

export function Services() {
  return (
    <section className="pt-32 pb-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-nebulosity leading-[1.15]">
            Everything You Need to
            <br />
            <span className="text-neon-navy">Succeed Online</span>
          </h1>
          <p className="mt-6 text-lg text-wild-dove leading-relaxed">
            Start with a website or an advertising campaign. We can bring in SEO,
            design, and automation where your project needs them.
          </p>
        </motion.div>

        <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, i) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.4,
                delay: (i % 6) * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                href={service.href}
                className="group flex items-start gap-4 p-5 rounded-2xl hover:bg-sunset/60 transition-all duration-300"
              >
                <div className="flex-shrink-0 h-11 w-11 rounded-xl bg-neon-navy/5 group-hover:bg-neon-navy flex items-center justify-center transition-all duration-300">
                  <service.icon className="h-5 w-5 text-neon-navy group-hover:text-sunset transition-colors duration-300" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-nebulosity text-sm">
                      {service.name}
                    </h2>
                    <ArrowRight className="h-4 w-4 text-wild-dove/0 group-hover:text-neon-navy transition-all group-hover:translate-x-1" />
                  </div>
                  <p className="mt-1.5 text-sm text-wild-dove leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 border-t border-nebulosity/10 pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div><h2 className="text-lg font-medium text-nebulosity">Still shaping the brief?</h2><p className="mt-2 text-sm text-wild-dove">Start with practical guides to planning a website or a connected campaign.</p></div>
          <Link href="/guides" className="inline-flex items-center gap-2 text-sm font-medium text-nebulosity hover:underline underline-offset-4">Explore the guides <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}
