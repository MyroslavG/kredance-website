"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  Globe,
  ShoppingBag,
  MonitorSmartphone,
  MessageSquare,
  Puzzle,
  Clock,
  Layers,
} from "lucide-react";
import Link from "next/link";

type Platform = "wordpress" | "shopify" | "chrome" | "slack";

interface PlatformConfig {
  label: string;
  icon: typeof Globe;
  features: string[];
}

const PLATFORMS: Record<Platform, PlatformConfig> = {
  wordpress: {
    label: "WordPress",
    icon: Globe,
    features: [
      "Custom Post Types",
      "API Integration",
      "Admin Dashboard",
      "User Roles",
      "Caching",
    ],
  },
  shopify: {
    label: "Shopify",
    icon: ShoppingBag,
    features: [
      "Product Sync",
      "Custom Checkout",
      "Loyalty Program",
      "Email Notifications",
      "Analytics",
    ],
  },
  chrome: {
    label: "Chrome",
    icon: MonitorSmartphone,
    features: [
      "Tab Management",
      "Content Scraping",
      "UI Overlay",
      "Storage Sync",
      "Notifications",
    ],
  },
  slack: {
    label: "Slack",
    icon: MessageSquare,
    features: [
      "Custom Commands",
      "Webhooks",
      "Message Formatting",
      "OAuth",
      "Scheduled Messages",
    ],
  },
};

function getComplexity(count: number): { label: string; percent: number; color: string } {
  if (count <= 1) return { label: "Simple", percent: 20, color: "bg-emerald-500" };
  if (count <= 2) return { label: "Simple", percent: 35, color: "bg-emerald-500" };
  if (count <= 3) return { label: "Moderate", percent: 55, color: "bg-amber-500" };
  if (count <= 4) return { label: "Advanced", percent: 75, color: "bg-orange-500" };
  return { label: "Advanced", percent: 95, color: "bg-red-500" };
}

function getTimeline(count: number): string {
  if (count <= 1) return "1-2 weeks";
  if (count <= 2) return "2-3 weeks";
  if (count <= 3) return "3-5 weeks";
  if (count <= 4) return "5-7 weeks";
  return "7-10 weeks";
}

export function PluginDemo() {
  const [activePlatform, setActivePlatform] = useState<Platform>("wordpress");
  const [selectedFeatures, setSelectedFeatures] = useState<Record<Platform, string[]>>({
    wordpress: [],
    shopify: [],
    chrome: [],
    slack: [],
  });

  const currentFeatures = selectedFeatures[activePlatform];
  const complexity = getComplexity(currentFeatures.length);
  const platform = PLATFORMS[activePlatform];
  const PlatformIcon = platform.icon;

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) => {
      const current = prev[activePlatform];
      const updated = current.includes(feature)
        ? current.filter((f) => f !== feature)
        : [...current, feature];
      return { ...prev, [activePlatform]: updated };
    });
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
            Configure Your Plugin
          </h3>
          <p className="mt-3 text-wild-dove max-w-lg mx-auto">
            Pick a platform, select features, and see how your custom plugin takes shape
          </p>
        </motion.div>

        {/* Platform Tabs */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {(Object.keys(PLATFORMS) as Platform[]).map((key) => {
            const p = PLATFORMS[key];
            const Icon = p.icon;
            return (
              <button
                key={key}
                onClick={() => setActivePlatform(key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activePlatform === key
                    ? "bg-neon-navy text-white shadow-md"
                    : "bg-sunset/30 text-nebulosity hover:bg-sunset/50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Feature Checklist */}
          <motion.div
            key={activePlatform}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-black/10 bg-sunset/20 p-6"
          >
            <p className="text-xs font-medium text-astro-grey uppercase tracking-wider mb-4">
              Select Features for {platform.label}
            </p>
            <div className="space-y-3">
              {platform.features.map((feature) => {
                const isSelected = currentFeatures.includes(feature);
                return (
                  <button
                    key={feature}
                    onClick={() => toggleFeature(feature)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-neon-navy/30 bg-neon-navy/5 shadow-sm"
                        : "border-black/10 bg-white hover:border-neon-navy/20 hover:shadow-sm"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-neon-navy border-neon-navy"
                          : "border-black/20 bg-white"
                      }`}
                    >
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            <Check className="h-3 w-3 text-white" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isSelected ? "text-neon-navy" : "text-nebulosity"
                      }`}
                    >
                      {feature}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Complexity Meter */}
            <div className="mt-6 pt-5 border-t border-black/5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-astro-grey uppercase tracking-wider">
                  Complexity
                </p>
                <span
                  className={`text-xs font-semibold ${
                    complexity.percent <= 35
                      ? "text-emerald-600"
                      : complexity.percent <= 55
                      ? "text-amber-600"
                      : "text-orange-600"
                  }`}
                >
                  {complexity.label}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-black/5 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${complexity.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${currentFeatures.length > 0 ? complexity.percent : 0}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>

          {/* Preview Card */}
          <div className="flex items-start justify-center lg:justify-start">
            <motion.div
              layout
              className="w-full max-w-[320px] rounded-2xl border border-black/10 bg-white shadow-lg overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-neon-navy px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <PlatformIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {currentFeatures.length > 0
                        ? `${platform.label} Plugin`
                        : "Your Plugin"}
                    </p>
                    <p className="text-white/60 text-xs">{platform.label} Extension</p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4">
                {/* Feature Count */}
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-sunset/40 flex items-center justify-center">
                    <Layers className="h-4 w-4 text-neon-navy" />
                  </div>
                  <div>
                    <p className="text-xs text-wild-dove">Features</p>
                    <p className="text-sm font-semibold text-nebulosity">
                      {currentFeatures.length} selected
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-sunset/40 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-neon-navy" />
                  </div>
                  <div>
                    <p className="text-xs text-wild-dove">Est. Timeline</p>
                    <p className="text-sm font-semibold text-nebulosity">
                      {currentFeatures.length > 0 ? getTimeline(currentFeatures.length) : "--"}
                    </p>
                  </div>
                </div>

                {/* Complexity Badge */}
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-sunset/40 flex items-center justify-center">
                    <Puzzle className="h-4 w-4 text-neon-navy" />
                  </div>
                  <div>
                    <p className="text-xs text-wild-dove">Complexity</p>
                    <p className="text-sm font-semibold text-nebulosity">
                      {currentFeatures.length > 0 ? complexity.label : "--"}
                    </p>
                  </div>
                </div>

                {/* Selected Features List */}
                <AnimatePresence>
                  {currentFeatures.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="pt-3 border-t border-black/5"
                    >
                      <p className="text-xs text-wild-dove mb-2">Includes:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {currentFeatures.map((feature) => (
                          <motion.span
                            key={feature}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="text-[11px] font-medium px-2 py-1 rounded-full bg-neon-navy/5 text-neon-navy border border-neon-navy/10"
                          >
                            {feature}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>

        {/* CTA */}
        <AnimatePresence>
          {currentFeatures.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-10 text-center"
            >
              <p className="text-sm text-wild-dove mb-4">
                Ready to bring your plugin to life? Let&apos;s talk.
              </p>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-8 py-3.5 bg-neon-navy text-white font-medium rounded-full hover:bg-nebulosity transition-all"
              >
                Build My Plugin
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
