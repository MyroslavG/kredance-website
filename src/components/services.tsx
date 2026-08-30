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
  Newspaper,
  Package,
  Plug,
  Globe,
  TrendingUp,
} from "lucide-react";

const services = [
  {
    icon: Megaphone,
    name: "Advertisement Creation",
    href: "/services/advertisement-creation",
    description: "Eye-catching ad campaigns across all platforms that convert viewers into customers.",
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
    icon: Palette,
    name: "Design",
    href: "/services/design",
    description: "Beautiful, functional design systems that elevate your brand across every touchpoint.",
  },
  {
    icon: ShoppingCart,
    name: "Ecommerce Shop Development",
    href: "/services/ecommerce",
    description: "High-converting online stores built for scale, speed, and seamless checkout.",
  },
  {
    icon: BarChart3,
    name: "Google Ads Specialist",
    href: "/services/google-ads",
    description: "Maximize ROI with expertly managed Google Ads campaigns and optimization.",
  },
  {
    icon: Smartphone,
    name: "Mobile App Development",
    href: "/services/mobile-app-development",
    description: "Native and cross-platform mobile apps that deliver exceptional user experiences.",
  },
  {
    icon: Newspaper,
    name: "News",
    href: "/services/news",
    description: "Stay updated with the latest in tech, AI, and digital marketing insights.",
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
  {
    icon: Globe,
    name: "Website Development",
    href: "/services/website-development",
    description: "Fast, responsive, and beautiful websites built with the latest technologies.",
  },
  {
    icon: TrendingUp,
    name: "Website SEO",
    href: "/services/website-seo",
    description: "Data-driven SEO strategies that improve rankings and drive organic traffic.",
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
          <span className="text-xs font-medium tracking-widest uppercase text-astro-grey">
            Our Services
          </span>
          <h1 className="mt-4 text-4xl lg:text-5xl font-bold tracking-tight text-nebulosity leading-[1.15]">
            Everything You Need to
            <br />
            <span className="text-neon-navy">Succeed Online</span>
          </h1>
          <p className="mt-6 text-lg text-wild-dove leading-relaxed">
            From concept to launch and beyond, we offer a comprehensive suite of
            digital services to power your business growth.
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
                    <h3 className="font-semibold text-nebulosity text-sm">
                      {service.name}
                    </h3>
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
      </div>
    </section>
  );
}
