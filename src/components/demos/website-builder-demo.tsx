"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Type, Image, Layout, Menu, ArrowRight, RotateCcw, Eye, Palette } from "lucide-react";
import Link from "next/link";

interface PageBlock {
  id: string;
  type: "hero" | "features" | "gallery" | "cta" | "navbar";
  label: string;
}

const AVAILABLE_BLOCKS: PageBlock[] = [
  { id: "navbar", type: "navbar", label: "Navigation Bar" },
  { id: "hero", type: "hero", label: "Hero Section" },
  { id: "features", type: "features", label: "Features Grid" },
  { id: "gallery", type: "gallery", label: "Image Gallery" },
  { id: "cta", type: "cta", label: "Call to Action" },
];

const THEMES = [
  { name: "Modern", bg: "bg-slate-900", accent: "bg-blue-500", text: "text-white" },
  { name: "Clean", bg: "bg-white", accent: "bg-emerald-500", text: "text-slate-900" },
  { name: "Bold", bg: "bg-purple-950", accent: "bg-amber-400", text: "text-white" },
];

function BlockPreview({ block, theme }: { block: PageBlock; theme: typeof THEMES[0] }) {
  switch (block.type) {
    case "navbar":
      return (
        <div className={`flex items-center justify-between px-3 py-1.5 ${theme.bg} rounded-t`}>
          <div className={`w-12 h-2 rounded ${theme.accent}`} />
          <div className="flex gap-2">
            <div className="w-6 h-1.5 rounded bg-white/30" />
            <div className="w-6 h-1.5 rounded bg-white/30" />
            <div className="w-6 h-1.5 rounded bg-white/30" />
          </div>
        </div>
      );
    case "hero":
      return (
        <div className={`px-3 py-4 ${theme.bg} flex flex-col items-center gap-1.5`}>
          <div className={`w-24 h-2.5 rounded ${theme.text === "text-white" ? "bg-white/80" : "bg-slate-800"}`} />
          <div className={`w-16 h-1.5 rounded ${theme.text === "text-white" ? "bg-white/30" : "bg-slate-400"}`} />
          <div className={`w-14 h-3 rounded-full ${theme.accent} mt-1`} />
        </div>
      );
    case "features":
      return (
        <div className={`px-3 py-3 ${theme.bg}`}>
          <div className="grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`rounded p-1.5 ${theme.text === "text-white" ? "bg-white/5" : "bg-slate-100"}`}>
                <div className={`w-full h-1.5 rounded ${theme.accent} opacity-60 mb-1`} />
                <div className={`w-full h-1 rounded ${theme.text === "text-white" ? "bg-white/20" : "bg-slate-300"}`} />
              </div>
            ))}
          </div>
        </div>
      );
    case "gallery":
      return (
        <div className={`px-3 py-3 ${theme.bg}`}>
          <div className="grid grid-cols-4 gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`aspect-square rounded ${theme.text === "text-white" ? "bg-white/10" : "bg-slate-200"}`} />
            ))}
          </div>
        </div>
      );
    case "cta":
      return (
        <div className={`px-3 py-3 ${theme.bg} flex flex-col items-center gap-1.5 rounded-b`}>
          <div className={`w-20 h-2 rounded ${theme.text === "text-white" ? "bg-white/60" : "bg-slate-700"}`} />
          <div className={`w-16 h-3 rounded-full ${theme.accent}`} />
        </div>
      );
    default:
      return null;
  }
}

export function WebsiteBuilderDemo() {
  const [placedBlocks, setPlacedBlocks] = useState<PageBlock[]>([]);
  const [themeIndex, setThemeIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const theme = THEMES[themeIndex];

  const addBlock = useCallback((block: PageBlock) => {
    if (placedBlocks.find((b) => b.id === block.id)) return;
    setPlacedBlocks((prev) => [...prev, block]);
  }, [placedBlocks]);

  const removeBlock = useCallback((id: string) => {
    setPlacedBlocks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const reset = useCallback(() => {
    setPlacedBlocks([]);
    setShowPreview(false);
  }, []);

  const getBlockIcon = (type: string) => {
    switch (type) {
      case "navbar": return Menu;
      case "hero": return Type;
      case "features": return Layout;
      case "gallery": return Image;
      case "cta": return ArrowRight;
      default: return Layout;
    }
  };

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
            Build Your Page Layout
          </h3>
          <p className="mt-3 text-wild-dove max-w-lg mx-auto">
            Drag sections to arrange your page, pick a theme, and preview the result
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar - blocks palette */}
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            <p className="text-xs font-medium text-astro-grey uppercase tracking-wider hidden lg:block mb-1">
              Page Sections
            </p>
            {AVAILABLE_BLOCKS.map((block) => {
              const Icon = getBlockIcon(block.type);
              const placed = placedBlocks.find((b) => b.id === block.id);
              return (
                <button
                  key={block.id}
                  onClick={() => addBlock(block)}
                  disabled={!!placed}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-left transition-all shrink-0 ${
                    placed
                      ? "border-black/5 bg-black/[0.02] opacity-40 cursor-not-allowed"
                      : "border-black/10 bg-white hover:border-neon-navy/30 hover:shadow-sm cursor-pointer active:scale-95"
                  }`}
                >
                  <Icon className="h-4 w-4 text-neon-navy/60" />
                  <span className="text-sm font-medium text-nebulosity">{block.label}</span>
                </button>
              );
            })}

            {/* Theme picker */}
            <div className="lg:mt-4 lg:pt-4 lg:border-t border-black/5">
              <p className="text-xs font-medium text-astro-grey uppercase tracking-wider hidden lg:block mb-2">
                Theme
              </p>
              <div className="flex gap-2">
                {THEMES.map((t, i) => (
                  <button
                    key={t.name}
                    onClick={() => setThemeIndex(i)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                      themeIndex === i
                        ? "border-neon-navy bg-neon-navy/5 text-neon-navy"
                        : "border-black/10 text-wild-dove hover:border-neon-navy/20"
                    }`}
                  >
                    <div className={`h-3 w-3 rounded-full ${t.accent}`} />
                    <span className="hidden sm:inline">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 lg:mt-auto">
              <button
                onClick={reset}
                className="flex items-center gap-1.5 text-xs text-wild-dove hover:text-neon-navy transition-colors px-3 py-2 rounded-lg border border-black/10 hover:border-neon-navy/20"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
              {placedBlocks.length > 0 && (
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-1.5 text-xs font-medium text-neon-navy px-3 py-2 rounded-lg border border-neon-navy/20 bg-neon-navy/5 hover:bg-neon-navy/10 transition-colors"
                >
                  <Eye className="h-3 w-3" />
                  {showPreview ? "Edit" : "Preview"}
                </button>
              )}
            </div>
          </div>

          {/* Canvas / Preview */}
          <div className="min-h-[350px] sm:min-h-[400px] rounded-2xl border border-black/10 bg-sunset/20 overflow-hidden relative">
            {placedBlocks.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6">
                <Layout className="h-8 w-8 text-neon-navy/20" />
                <p className="text-sm text-wild-dove text-center">
                  Tap sections on the left to build your page layout
                </p>
              </div>
            ) : showPreview ? (
              /* Preview mode */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex items-center justify-center p-6"
              >
                <div className="w-full max-w-[280px] rounded-xl overflow-hidden shadow-2xl border border-black/10">
                  {placedBlocks.map((block) => (
                    <BlockPreview key={block.id} block={block} theme={theme} />
                  ))}
                </div>
              </motion.div>
            ) : (
              /* Edit mode - reorderable list */
              <div className="p-4 sm:p-6">
                <Reorder.Group
                  axis="y"
                  values={placedBlocks}
                  onReorder={setPlacedBlocks}
                  className="space-y-2"
                >
                  {placedBlocks.map((block) => {
                    const Icon = getBlockIcon(block.type);
                    return (
                      <Reorder.Item
                        key={block.id}
                        value={block}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-black/10 shadow-sm cursor-grab active:cursor-grabbing active:shadow-md"
                      >
                        <div className="flex items-center gap-1 text-wild-dove">
                          <div className="flex flex-col gap-0.5">
                            <div className="w-3 h-0.5 rounded bg-current opacity-40" />
                            <div className="w-3 h-0.5 rounded bg-current opacity-40" />
                            <div className="w-3 h-0.5 rounded bg-current opacity-40" />
                          </div>
                        </div>
                        <Icon className="h-4 w-4 text-neon-navy/60" />
                        <span className="text-sm font-medium text-nebulosity flex-1">
                          {block.label}
                        </span>
                        <button
                          onClick={() => removeBlock(block.id)}
                          className="text-wild-dove hover:text-red-500 transition-colors p-1"
                        >
                          <span className="text-xs">x</span>
                        </button>
                      </Reorder.Item>
                    );
                  })}
                </Reorder.Group>

                {/* Live mini-preview */}
                <div className="mt-6 flex justify-center">
                  <div className="w-full max-w-[200px] rounded-lg overflow-hidden border border-black/10 shadow-sm scale-90">
                    {placedBlocks.map((block) => (
                      <BlockPreview key={block.id} block={block} theme={theme} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA after interaction */}
        <AnimatePresence>
          {placedBlocks.length >= 3 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 text-center"
            >
              <p className="text-sm text-wild-dove mb-4">
                Like what you see? We build production-ready sites just like this.
              </p>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-8 py-3.5 bg-neon-navy text-white font-medium rounded-full hover:bg-nebulosity transition-all"
              >
                Build My Website
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
