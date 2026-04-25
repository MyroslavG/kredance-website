"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="bg-white">
      {/* Mobile video - full screen, sides cropped */}
      <div className="sm:hidden w-full h-screen overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/mobile_hero_video.mp4`} type="video/mp4" />
        </video>
      </div>

      {/* Desktop video */}
      <div className="hidden sm:block w-full aspect-[16/8] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-top"
        >
          <source src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/hero_video.mp4`} type="video/mp4" />
        </video>
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
    </section>
  );
}
