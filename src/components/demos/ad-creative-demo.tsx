"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, RotateCcw, Image, Type, Palette } from "lucide-react";
import Link from "next/link";

interface AdVariant {
  id: string;
  headline: string;
  subtext: string;
  cta: string;
  bg: string;
  textColor: string;
  accentColor: string;
  badge?: string;
}

const AD_VARIANTS: AdVariant[] = [
  {
    id: "a",
    headline: "Summer Sale",
    subtext: "Up to 50% off everything",
    cta: "Shop Now",
    bg: "bg-gradient-to-br from-orange-400 to-rose-500",
    textColor: "text-white",
    accentColor: "bg-white text-rose-600",
    badge: "-50%",
  },
  {
    id: "b",
    headline: "New Collection",
    subtext: "Fresh styles just dropped",
    cta: "Explore",
    bg: "bg-gradient-to-br from-slate-900 to-slate-700",
    textColor: "text-white",
    accentColor: "bg-amber-400 text-slate-900",
    badge: "NEW",
  },
  {
    id: "c",
    headline: "Free Delivery",
    subtext: "On orders over $50",
    cta: "Order Today",
    bg: "bg-gradient-to-br from-emerald-400 to-teal-600",
    textColor: "text-white",
    accentColor: "bg-white text-teal-700",
    badge: "FREE",
  },
];

const FORMATS = [
  { id: "square", label: "Square", aspect: "aspect-square", size: "1080x1080" },
  { id: "story", label: "Story", aspect: "aspect-[9/16]", size: "1080x1920" },
  { id: "landscape", label: "Landscape", aspect: "aspect-video", size: "1920x1080" },
];

interface ABResult {
  variant: string;
  clicks: number;
  impressions: number;
  ctr: number;
}

export function AdCreativeDemo() {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState(0);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [abResults, setAbResults] = useState<ABResult[] | null>(null);

  const variant = AD_VARIANTS[selectedVariant];
  const format = FORMATS[selectedFormat];

  const runABTest = useCallback(() => {
    setIsTestRunning(true);
    setAbResults(null);

    setTimeout(() => {
      const results: ABResult[] = AD_VARIANTS.map((v, i) => {
        const impressions = Math.floor(Math.random() * 3000 + 2000);
        const ctr = Math.random() * 4 + 1.5;
        return {
          variant: v.id.toUpperCase(),
          impressions,
          clicks: Math.floor(impressions * ctr / 100),
          ctr: parseFloat(ctr.toFixed(1)),
        };
      }).sort((a, b) => b.ctr - a.ctr);

      setAbResults(results);
      setIsTestRunning(false);
    }, 2500);
  }, []);

  const reset = useCallback(() => {
    setAbResults(null);
    setIsTestRunning(false);
  }, []);

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
            Create & Test Ad Creatives
          </h3>
          <p className="mt-3 text-wild-dove max-w-lg mx-auto">
            Pick a style, choose a format, and run an A/B test to find the winner
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Ad preview */}
          <div className="flex flex-col items-center">
            {/* Format selector */}
            <div className="flex gap-2 mb-6">
              {FORMATS.map((f, i) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFormat(i)}
                  className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                    selectedFormat === i
                      ? "border-neon-navy bg-neon-navy/5 text-neon-navy"
                      : "border-black/10 text-wild-dove hover:border-neon-navy/20"
                  }`}
                >
                  {f.label}
                  <span className="hidden sm:inline text-[10px] ml-1 opacity-60">({f.size})</span>
                </button>
              ))}
            </div>

            {/* Creative preview */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedVariant}-${selectedFormat}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`relative w-full max-w-[300px] ${format.aspect} ${variant.bg} rounded-2xl overflow-hidden shadow-xl flex flex-col items-center justify-center p-6`}
              >
                {/* Badge */}
                {variant.badge && (
                  <div className={`absolute top-4 right-4 ${variant.accentColor} text-xs font-bold px-2.5 py-1 rounded-full`}>
                    {variant.badge}
                  </div>
                )}

                {/* Content */}
                <div className="text-center">
                  <motion.h4
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className={`text-2xl sm:text-3xl font-bold ${variant.textColor}`}
                  >
                    {variant.headline}
                  </motion.h4>
                  <motion.p
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`mt-2 text-sm ${variant.textColor} opacity-80`}
                  >
                    {variant.subtext}
                  </motion.p>
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`inline-block mt-4 px-5 py-2 rounded-full font-medium text-sm ${variant.accentColor}`}
                  >
                    {variant.cta}
                  </motion.div>
                </div>

                {/* Decorative elements */}
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 translate-y-1/2" />
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls sidebar */}
          <div className="space-y-6">
            {/* Variant picker */}
            <div>
              <p className="text-xs font-medium text-astro-grey uppercase tracking-wider mb-3">
                Ad Variant
              </p>
              <div className="space-y-2">
                {AD_VARIANTS.map((v, i) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(i)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      selectedVariant === i
                        ? "border-neon-navy/30 bg-neon-navy/5"
                        : "border-black/10 hover:border-neon-navy/15"
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-lg ${v.bg} flex items-center justify-center shrink-0`}>
                      <span className="text-[10px] font-bold text-white">{v.id.toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-nebulosity">{v.headline}</p>
                      <p className="text-[10px] text-wild-dove">{v.subtext}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* A/B test */}
            <div className="border-t border-black/5 pt-5">
              <p className="text-xs font-medium text-astro-grey uppercase tracking-wider mb-3">
                A/B Testing
              </p>
              <button
                onClick={runABTest}
                disabled={isTestRunning}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isTestRunning
                    ? "bg-black/5 text-wild-dove cursor-not-allowed"
                    : "bg-neon-navy text-white hover:bg-nebulosity"
                }`}
              >
                <Sparkles className="h-4 w-4" />
                {isTestRunning ? "Running Test..." : "Run A/B Test"}
              </button>

              {/* Results */}
              <AnimatePresence>
                {abResults && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 space-y-2"
                  >
                    {abResults.map((result, i) => (
                      <motion.div
                        key={result.variant}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          i === 0 ? "bg-green-50 border border-green-200" : "bg-gray-50"
                        }`}
                      >
                        <span className={`text-xs font-bold ${i === 0 ? "text-green-700" : "text-gray-500"}`}>
                          {result.variant}
                        </span>
                        <div className="flex-1">
                          <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(result.ctr / 6) * 100}%` }}
                              transition={{ duration: 0.5, delay: i * 0.1 }}
                              className={`h-full rounded-full ${i === 0 ? "bg-green-500" : "bg-gray-400"}`}
                            />
                          </div>
                        </div>
                        <span className={`text-sm font-bold ${i === 0 ? "text-green-700" : "text-gray-600"}`}>
                          {result.ctr}%
                        </span>
                        {i === 0 && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-200 text-green-800 font-bold">
                            WINNER
                          </span>
                        )}
                      </motion.div>
                    ))}
                    <button
                      onClick={reset}
                      className="flex items-center gap-1.5 text-xs text-wild-dove hover:text-neon-navy mt-2 transition-colors"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Run again
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 px-8 py-3.5 bg-neon-navy text-white font-medium rounded-full hover:bg-nebulosity transition-all"
          >
            Create My Ads
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
