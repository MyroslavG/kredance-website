"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, TrendingUp, ArrowRight, BarChart3, Target, DollarSign, Eye, MousePointer } from "lucide-react";
import Link from "next/link";

interface Keyword {
  term: string;
  position: number;
  volume: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

const KEYWORDS: Keyword[] = [
  { term: "best coffee shop near me", position: 47, volume: "12.1K", difficulty: "Medium" },
  { term: "artisan coffee delivery", position: 32, volume: "5.4K", difficulty: "Easy" },
  { term: "organic coffee beans online", position: 58, volume: "8.7K", difficulty: "Hard" },
  { term: "coffee subscription box", position: 25, volume: "14.2K", difficulty: "Medium" },
];

const AD_PREVIEW = {
  headline: "Premium Organic Coffee | Free Shipping",
  url: "www.yourcoffee.com/shop",
  description: "Hand-roasted artisan beans delivered fresh to your door. Subscribe & save 20%.",
};

export function SeoAdsDemo() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimized, setOptimized] = useState(false);
  const [keywords, setKeywords] = useState(KEYWORDS);
  const [adClicks, setAdClicks] = useState(0);
  const [adImpressions, setAdImpressions] = useState(0);
  const [tab, setTab] = useState<"seo" | "ads">("seo");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const runOptimization = useCallback(() => {
    setIsOptimizing(true);
    setTimeout(() => {
      setKeywords((prev) =>
        prev.map((kw) => ({
          ...kw,
          position: Math.max(1, Math.floor(kw.position * 0.3 + Math.random() * 3)),
        }))
      );
      setOptimized(true);
      setIsOptimizing(false);
    }, 2000);
  }, []);

  const runAdCampaign = useCallback(() => {
    setAdClicks(0);
    setAdImpressions(0);
    let impressionCount = 0;
    let clickCount = 0;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      impressionCount += Math.floor(Math.random() * 50 + 20);
      clickCount += Math.floor(Math.random() * 5 + 1);
      setAdImpressions(impressionCount);
      setAdClicks(clickCount);

      if (impressionCount > 1000) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 200);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const reset = useCallback(() => {
    setKeywords(KEYWORDS);
    setOptimized(false);
    setIsOptimizing(false);
    setAdClicks(0);
    setAdImpressions(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
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
            SEO & Ads Performance
          </h3>
          <p className="mt-3 text-wild-dove max-w-lg mx-auto">
            Watch keyword rankings climb and ad campaigns generate real-time results
          </p>
        </motion.div>

        {/* Tab toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-full border border-black/10 p-1">
            <button
              onClick={() => setTab("seo")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                tab === "seo" ? "bg-neon-navy text-white" : "text-wild-dove hover:text-neon-navy"
              }`}
            >
              <span className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                SEO Rankings
              </span>
            </button>
            <button
              onClick={() => setTab("ads")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                tab === "ads" ? "bg-neon-navy text-white" : "text-wild-dove hover:text-neon-navy"
              }`}
            >
              <span className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Google Ads
              </span>
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {tab === "seo" ? (
            <motion.div
              key="seo"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="max-w-3xl mx-auto"
            >
              {/* Keyword table */}
              <div className="rounded-2xl border border-black/10 overflow-hidden">
                <div className="bg-sunset/30 px-4 sm:px-6 py-4 flex items-center justify-between">
                  <h4 className="font-semibold text-neon-navy text-sm sm:text-base">Keyword Rankings</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={reset}
                      className="text-xs text-wild-dove hover:text-neon-navy transition-colors px-3 py-1.5 rounded-full border border-black/10"
                    >
                      Reset
                    </button>
                    <button
                      onClick={runOptimization}
                      disabled={isOptimizing || optimized}
                      className={`text-xs px-4 py-1.5 rounded-full font-medium transition-all ${
                        isOptimizing || optimized
                          ? "bg-black/5 text-wild-dove cursor-not-allowed"
                          : "bg-neon-navy text-white hover:bg-nebulosity"
                      }`}
                    >
                      {isOptimizing ? "Optimizing..." : optimized ? "Optimized" : "Run SEO"}
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-black/5">
                  {keywords.map((kw, i) => (
                    <motion.div
                      key={kw.term}
                      className="px-4 sm:px-6 py-3 flex items-center gap-4"
                      animate={optimized ? { backgroundColor: ["rgba(34,197,94,0.05)", "transparent"] } : {}}
                      transition={{ duration: 1, delay: i * 0.15 }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-nebulosity truncate">{kw.term}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] sm:text-xs text-wild-dove">{kw.volume}/mo</span>
                          <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium ${
                            kw.difficulty === "Easy" ? "bg-green-100 text-green-700" :
                            kw.difficulty === "Medium" ? "bg-amber-100 text-amber-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            {kw.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <motion.span
                          key={kw.position}
                          initial={{ scale: 1.3, color: "#22c55e" }}
                          animate={{ scale: 1, color: kw.position <= 10 ? "#22c55e" : "#6b7280" }}
                          className="text-lg font-bold"
                        >
                          #{kw.position}
                        </motion.span>
                        {optimized && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-[10px] text-green-600 font-medium"
                          >
                            Page 1
                          </motion.p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {optimized && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-sm text-green-600 font-medium mt-4"
                >
                  All keywords moved to page 1 of Google
                </motion.p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="ads"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="max-w-3xl mx-auto"
            >
              {/* Ad preview */}
              <div className="rounded-2xl border border-black/10 overflow-hidden">
                <div className="bg-sunset/30 px-4 sm:px-6 py-4 flex items-center justify-between">
                  <h4 className="font-semibold text-neon-navy text-sm sm:text-base">Ad Campaign</h4>
                  <button
                    onClick={runAdCampaign}
                    className="text-xs px-4 py-1.5 rounded-full font-medium bg-neon-navy text-white hover:bg-nebulosity transition-all"
                  >
                    Launch Campaign
                  </button>
                </div>

                <div className="p-4 sm:p-6">
                  {/* Google ad mockup */}
                  <div className="rounded-xl border border-black/10 p-4 mb-6 bg-white">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold">Ad</span>
                      <span className="text-xs text-green-700">{AD_PREVIEW.url}</span>
                    </div>
                    <p className="text-base font-medium text-blue-700 hover:underline cursor-pointer">
                      {AD_PREVIEW.headline}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {AD_PREVIEW.description}
                    </p>
                  </div>

                  {/* Live metrics */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 sm:p-4 rounded-xl bg-blue-50 text-center">
                      <Eye className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                      <motion.p
                        key={adImpressions}
                        className="text-lg sm:text-xl font-bold text-blue-700"
                      >
                        {adImpressions.toLocaleString()}
                      </motion.p>
                      <p className="text-[10px] sm:text-xs text-blue-500">Impressions</p>
                    </div>
                    <div className="p-3 sm:p-4 rounded-xl bg-green-50 text-center">
                      <MousePointer className="h-4 w-4 text-green-500 mx-auto mb-1" />
                      <motion.p
                        key={adClicks}
                        className="text-lg sm:text-xl font-bold text-green-700"
                      >
                        {adClicks}
                      </motion.p>
                      <p className="text-[10px] sm:text-xs text-green-500">Clicks</p>
                    </div>
                    <div className="p-3 sm:p-4 rounded-xl bg-purple-50 text-center">
                      <DollarSign className="h-4 w-4 text-purple-500 mx-auto mb-1" />
                      <p className="text-lg sm:text-xl font-bold text-purple-700">
                        {adImpressions > 0 ? ((adClicks / adImpressions) * 100).toFixed(1) : "0.0"}%
                      </p>
                      <p className="text-[10px] sm:text-xs text-purple-500">CTR</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-10 text-center"
        >
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 px-8 py-3.5 bg-neon-navy text-white font-medium rounded-full hover:bg-nebulosity transition-all"
          >
            Boost My Rankings
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
