"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Type, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const COLOR_PALETTES = [
  {
    name: "Modern",
    colors: ["#1E293B", "#3B82F6", "#E2E8F0", "#F8FAFC", "#0EA5E9"],
    bg: "bg-slate-50",
    accent: "text-blue-500",
    cardBg: "bg-slate-800",
    cardText: "text-white",
  },
  {
    name: "Warm",
    colors: ["#78350F", "#D97706", "#FEF3C7", "#FFFBEB", "#F59E0B"],
    bg: "bg-amber-50",
    accent: "text-amber-600",
    cardBg: "bg-amber-900",
    cardText: "text-amber-50",
  },
  {
    name: "Bold",
    colors: ["#4C1D95", "#A855F7", "#EDE9FE", "#FAF5FF", "#EC4899"],
    bg: "bg-purple-50",
    accent: "text-purple-600",
    cardBg: "bg-purple-900",
    cardText: "text-white",
  },
];

const FONT_PAIRINGS = [
  { name: "Sans/Serif", heading: "font-sans", body: "font-serif", label: "Clean & Classic" },
  { name: "All Sans", heading: "font-sans", body: "font-sans", label: "Modern & Minimal" },
  { name: "Serif/Sans", heading: "font-serif", body: "font-sans", label: "Editorial" },
];

export function DesignDemo() {
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [fontIndex, setFontIndex] = useState(0);

  const palette = COLOR_PALETTES[paletteIndex];
  const font = FONT_PAIRINGS[fontIndex];

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-sm font-medium tracking-widest uppercase text-astro-grey mb-3">
            Interactive Demo
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-neon-navy">
            Design Your Brand
          </h3>
          <p className="mt-3 text-wild-dove max-w-lg mx-auto">
            Explore color palettes and font pairings to see how your brand could come to life
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Controls */}
          <div className="flex flex-col gap-6">
            {/* Color Palette Picker */}
            <div>
              <p className="text-xs font-medium text-astro-grey uppercase tracking-wider mb-3 flex items-center gap-2">
                <Palette className="h-3.5 w-3.5" />
                Color Palette
              </p>
              <div className="flex flex-col gap-2">
                {COLOR_PALETTES.map((p, i) => (
                  <button
                    key={p.name}
                    onClick={() => setPaletteIndex(i)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                      paletteIndex === i
                        ? "border-neon-navy bg-neon-navy/5 shadow-sm"
                        : "border-black/10 hover:border-neon-navy/20"
                    }`}
                  >
                    <div className="flex gap-1">
                      {p.colors.map((color, ci) => (
                        <div
                          key={ci}
                          className="h-5 w-5 rounded-full border border-black/10"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className={`text-sm font-medium ${paletteIndex === i ? "text-neon-navy" : "text-nebulosity"}`}>
                      {p.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font Pairing Picker */}
            <div>
              <p className="text-xs font-medium text-astro-grey uppercase tracking-wider mb-3 flex items-center gap-2">
                <Type className="h-3.5 w-3.5" />
                Font Pairing
              </p>
              <div className="flex flex-col gap-2">
                {FONT_PAIRINGS.map((f, i) => (
                  <button
                    key={f.name}
                    onClick={() => setFontIndex(i)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all ${
                      fontIndex === i
                        ? "border-neon-navy bg-neon-navy/5 shadow-sm"
                        : "border-black/10 hover:border-neon-navy/20"
                    }`}
                  >
                    <span className={`text-sm font-medium ${fontIndex === i ? "text-neon-navy" : "text-nebulosity"}`}>
                      {f.name}
                    </span>
                    <span className="text-xs text-wild-dove">{f.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Brand Board Preview */}
          <div className="min-h-[450px] rounded-2xl border border-black/10 bg-sunset/20 overflow-hidden p-6 sm:p-8 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${paletteIndex}-${fontIndex}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`w-full max-w-[480px] rounded-2xl ${palette.bg} p-6 sm:p-8 shadow-lg border border-black/5`}
              >
                {/* Logo Placeholder */}
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: palette.colors[0] }}
                  >
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className={`text-lg font-bold ${font.heading}`} style={{ color: palette.colors[0] }}>
                      Acme Studio
                    </p>
                    <p className={`text-xs ${font.body}`} style={{ color: palette.colors[1] }}>
                      Creative Agency
                    </p>
                  </div>
                </div>

                {/* Color Swatches */}
                <div className="mb-6">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-astro-grey mb-2">
                    Color Palette
                  </p>
                  <div className="flex gap-2">
                    {palette.colors.map((color, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div
                          className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg border border-black/10 shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-[9px] text-wild-dove font-mono">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Typography Sample */}
                <div className="mb-6">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-astro-grey mb-2">
                    Typography
                  </p>
                  <div className="rounded-lg bg-white/80 border border-black/5 p-4">
                    <p className={`text-xl font-bold mb-1 ${font.heading}`} style={{ color: palette.colors[0] }}>
                      The quick brown fox
                    </p>
                    <p className={`text-sm leading-relaxed ${font.body}`} style={{ color: palette.colors[0] + "CC" }}>
                      jumps over the lazy dog. Great typography makes great design feel effortless and intentional.
                    </p>
                  </div>
                </div>

                {/* Mock Business Card */}
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-astro-grey mb-2">
                    Business Card
                  </p>
                  <div
                    className={`rounded-xl p-5 shadow-md ${palette.cardText}`}
                    style={{ backgroundColor: palette.colors[0] }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`text-sm font-bold ${font.heading}`}>Jane Doe</p>
                        <p className={`text-xs opacity-70 ${font.body}`}>Creative Director</p>
                      </div>
                      <div
                        className="h-7 w-7 rounded-md flex items-center justify-center"
                        style={{ backgroundColor: palette.colors[1] }}
                      >
                        <Sparkles className="h-3.5 w-3.5 text-white" />
                      </div>
                    </div>
                    <div className={`mt-4 flex flex-col gap-0.5 text-[10px] opacity-60 ${font.body}`}>
                      <span>jane@acmestudio.com</span>
                      <span>+1 (555) 123-4567</span>
                      <span>acmestudio.com</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <p className="text-sm text-wild-dove mb-4">
            Ready to build a brand identity that stands out?
          </p>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 px-8 py-3.5 bg-neon-navy text-white font-medium rounded-full hover:bg-nebulosity transition-all"
          >
            Start Your Brand
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
