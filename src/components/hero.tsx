"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const shapes = [
  // Floating circles
  { type: "circle", size: 300, x: "8%", y: "12%", duration: 20, delay: 0, opacity: 0.04 },
  { type: "circle", size: 200, x: "75%", y: "8%", duration: 25, delay: 2, opacity: 0.03 },
  { type: "circle", size: 400, x: "60%", y: "65%", duration: 22, delay: 1, opacity: 0.03 },
  { type: "circle", size: 150, x: "20%", y: "70%", duration: 18, delay: 3, opacity: 0.05 },
  // Floating squares (rotated)
  { type: "square", size: 180, x: "85%", y: "40%", duration: 28, delay: 0.5, opacity: 0.03 },
  { type: "square", size: 120, x: "10%", y: "45%", duration: 24, delay: 2.5, opacity: 0.04 },
  { type: "square", size: 220, x: "45%", y: "80%", duration: 26, delay: 1.5, opacity: 0.03 },
  // Floating triangles (via border trick rendered as divs)
  { type: "triangle", size: 160, x: "30%", y: "15%", duration: 22, delay: 1, opacity: 0.04 },
  { type: "triangle", size: 120, x: "70%", y: "75%", duration: 20, delay: 3, opacity: 0.03 },
  // Rings (circle outlines)
  { type: "ring", size: 250, x: "50%", y: "20%", duration: 30, delay: 0, opacity: 0.04 },
  { type: "ring", size: 180, x: "15%", y: "85%", duration: 26, delay: 2, opacity: 0.03 },
  { type: "ring", size: 350, x: "80%", y: "55%", duration: 32, delay: 1, opacity: 0.025 },
  // Small dots
  { type: "dot", size: 8, x: "25%", y: "30%", duration: 15, delay: 0, opacity: 0.1 },
  { type: "dot", size: 6, x: "65%", y: "25%", duration: 12, delay: 1, opacity: 0.08 },
  { type: "dot", size: 10, x: "40%", y: "60%", duration: 18, delay: 2, opacity: 0.07 },
  { type: "dot", size: 7, x: "80%", y: "20%", duration: 14, delay: 0.5, opacity: 0.09 },
  { type: "dot", size: 5, x: "55%", y: "85%", duration: 16, delay: 3, opacity: 0.08 },
  // Hexagons (via clip-path)
  { type: "hexagon", size: 140, x: "92%", y: "15%", duration: 24, delay: 1, opacity: 0.03 },
  { type: "hexagon", size: 100, x: "5%", y: "60%", duration: 20, delay: 2.5, opacity: 0.04 },
];

function Shape({ type, size, opacity }: { type: string; size: number; opacity: number }) {
  const base = "absolute";
  const color = "#131936";

  if (type === "circle") {
    return (
      <div
        className={base}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: color,
          opacity,
        }}
      />
    );
  }

  if (type === "square") {
    return (
      <div
        className={base}
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.12,
          backgroundColor: color,
          opacity,
          transform: "rotate(45deg)",
        }}
      />
    );
  }

  if (type === "triangle") {
    return (
      <div
        className={base}
        style={{
          width: 0,
          height: 0,
          borderLeft: `${size / 2}px solid transparent`,
          borderRight: `${size / 2}px solid transparent`,
          borderBottom: `${size * 0.866}px solid ${color}`,
          opacity,
        }}
      />
    );
  }

  if (type === "ring") {
    return (
      <div
        className={base}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: `1.5px solid ${color}`,
          opacity,
        }}
      />
    );
  }

  if (type === "dot") {
    return (
      <div
        className={base}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: color,
          opacity,
        }}
      />
    );
  }

  if (type === "hexagon") {
    return (
      <div
        className={base}
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          opacity,
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        }}
      />
    );
  }

  return null;
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Animated geometric shapes */}
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ left: shape.x, top: shape.y }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -20, 0, 15, 0],
            x: [0, 10, 0, -10, 0],
            rotate: [0, shape.type === "square" ? 90 : shape.type === "ring" ? 180 : 15, 0],
          }}
          transition={{
            opacity: { duration: 1.5, delay: shape.delay },
            scale: { duration: 1.5, delay: shape.delay },
            y: { duration: shape.duration, repeat: Infinity, ease: "easeInOut", delay: shape.delay },
            x: { duration: shape.duration * 1.3, repeat: Infinity, ease: "easeInOut", delay: shape.delay },
            rotate: { duration: shape.duration * 2, repeat: Infinity, ease: "easeInOut", delay: shape.delay },
          }}
        >
          <Shape type={shape.type} size={shape.size} opacity={shape.opacity} />
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-neon-navy leading-[1.1]"
        >
          We Build Digital
          <br />
          Experiences That
          <br />
          Drive Growth
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-2xl mx-auto text-lg text-wild-dove leading-relaxed"
        >
          From AI automation to custom websites, SEO, and eCommerce &mdash; Kredance
          delivers end-to-end digital solutions that transform how businesses operate and grow.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
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
        </motion.div>
      </div>
    </section>
  );
}
