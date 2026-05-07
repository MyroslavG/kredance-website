"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, ShoppingCart, Briefcase, Home, ArrowRight, Play, Download, FileText, Code, Wifi } from "lucide-react";
import Link from "next/link";

type DataSource = "ecommerce" | "jobs" | "realestate";

interface DataRow {
  id: number;
  columns: string[];
}

const SOURCE_OPTIONS: { key: DataSource; label: string; icon: typeof ShoppingCart }[] = [
  { key: "ecommerce", label: "E-commerce Prices", icon: ShoppingCart },
  { key: "jobs", label: "Job Listings", icon: Briefcase },
  { key: "realestate", label: "Real Estate", icon: Home },
];

const MOCK_DATA: Record<DataSource, { headers: string[]; rows: string[][] }> = {
  ecommerce: {
    headers: ["Product", "Price", "Rating", "Stock"],
    rows: [
      ["Wireless Headphones Pro", "$149.99", "4.8", "In Stock"],
      ["Mechanical Keyboard RGB", "$89.50", "4.6", "In Stock"],
      ["Ultra-Wide Monitor 34\"", "$499.00", "4.9", "Low Stock"],
      ["Ergonomic Mouse Pad XL", "$24.99", "4.3", "In Stock"],
      ["USB-C Docking Station", "$179.00", "4.7", "In Stock"],
      ["Noise Cancelling Earbuds", "$199.99", "4.5", "Out of Stock"],
      ["Portable SSD 1TB", "$109.00", "4.8", "In Stock"],
      ["Webcam 4K Ultra HD", "$129.99", "4.4", "In Stock"],
      ["Smart Desk Lamp", "$59.99", "4.2", "In Stock"],
      ["Laptop Stand Aluminum", "$44.50", "4.6", "Low Stock"],
    ],
  },
  jobs: {
    headers: ["Title", "Company", "Location", "Salary"],
    rows: [
      ["Senior Frontend Developer", "TechCorp Inc.", "Remote", "$130k-$160k"],
      ["Data Scientist", "AI Solutions Ltd.", "New York, NY", "$140k-$175k"],
      ["Product Manager", "StartupXYZ", "San Francisco, CA", "$125k-$155k"],
      ["DevOps Engineer", "CloudScale", "Remote", "$120k-$150k"],
      ["UX Designer", "DesignHub", "Austin, TX", "$95k-$120k"],
      ["Backend Engineer (Go)", "FinTech Pro", "Chicago, IL", "$135k-$165k"],
      ["ML Engineer", "DataVerse", "Remote", "$150k-$185k"],
      ["Full Stack Developer", "WebAgency", "Seattle, WA", "$110k-$140k"],
      ["Security Analyst", "CyberShield", "Washington, DC", "$115k-$145k"],
      ["iOS Developer", "AppWorks", "Remote", "$125k-$155k"],
    ],
  },
  realestate: {
    headers: ["Address", "Price", "Beds/Baths", "Sq Ft"],
    rows: [
      ["1247 Oak Street, Portland", "$485,000", "3/2", "1,850"],
      ["89 Maple Avenue, Denver", "$625,000", "4/3", "2,400"],
      ["332 Pine Road, Austin", "$390,000", "2/2", "1,200"],
      ["5501 Cedar Lane, Seattle", "$875,000", "4/3", "2,800"],
      ["17 Birch Court, Nashville", "$340,000", "3/2", "1,650"],
      ["420 Elm Drive, Raleigh", "$295,000", "2/1", "1,100"],
      ["8900 Willow Way, Phoenix", "$445,000", "3/2", "1,950"],
      ["233 Spruce Blvd, Miami", "$720,000", "4/3", "2,600"],
      ["67 Ash Street, Charlotte", "$365,000", "3/2", "1,500"],
      ["1100 Redwood Terrace, Boise", "$410,000", "3/2", "1,750"],
    ],
  },
};

export function DataMiningDemo() {
  const [source, setSource] = useState<DataSource>("ecommerce");
  const [extractedRows, setExtractedRows] = useState<DataRow[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const rowIndexRef = useRef(0);

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const startExtraction = useCallback(() => {
    cleanup();
    setExtractedRows([]);
    setIsExtracting(true);
    setIsComplete(false);
    setElapsedTime(0);
    rowIndexRef.current = 0;

    const data = MOCK_DATA[source];

    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 100);
    }, 100);

    intervalRef.current = setInterval(() => {
      const idx = rowIndexRef.current;
      if (idx >= data.rows.length) {
        cleanup();
        setIsExtracting(false);
        setIsComplete(true);
        return;
      }
      setExtractedRows((prev) => [
        ...prev,
        { id: idx, columns: data.rows[idx] },
      ]);
      rowIndexRef.current += 1;
    }, 600);
  }, [source, cleanup]);

  const resetDemo = useCallback(() => {
    cleanup();
    setExtractedRows([]);
    setIsExtracting(false);
    setIsComplete(false);
    setElapsedTime(0);
    rowIndexRef.current = 0;
  }, [cleanup]);

  const handleSourceChange = useCallback((newSource: DataSource) => {
    if (isExtracting) return;
    setSource(newSource);
    setExtractedRows([]);
    setIsComplete(false);
    setElapsedTime(0);
    rowIndexRef.current = 0;
  }, [isExtracting]);

  const recordCount = extractedRows.length;
  const dataSize = (recordCount * 0.42).toFixed(1);
  const formattedTime = (elapsedTime / 1000).toFixed(1);
  const headers = MOCK_DATA[source].headers;

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
            Data Extraction Preview
          </h3>
          <p className="mt-3 text-wild-dove max-w-lg mx-auto">
            Watch our scraper pull structured data from any source in real-time
          </p>
        </motion.div>

        {/* Source Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {SOURCE_OPTIONS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => handleSourceChange(key)}
              disabled={isExtracting}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border text-sm font-medium transition-all ${
                source === key
                  ? "border-neon-navy bg-neon-navy/5 text-neon-navy"
                  : "border-black/10 text-wild-dove hover:border-neon-navy/20 hover:text-nebulosity"
              } ${isExtracting ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Stats Counters */}
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
          <div className="text-center px-3 py-2 rounded-lg bg-sunset/30 border border-black/5">
            <p className="text-lg font-bold text-neon-navy">{recordCount}</p>
            <p className="text-xs text-wild-dove">Records</p>
          </div>
          <div className="text-center px-3 py-2 rounded-lg bg-sunset/30 border border-black/5">
            <p className="text-lg font-bold text-neon-navy">{formattedTime}s</p>
            <p className="text-xs text-wild-dove">Elapsed</p>
          </div>
          <div className="text-center px-3 py-2 rounded-lg bg-sunset/30 border border-black/5">
            <p className="text-lg font-bold text-neon-navy">{dataSize} KB</p>
            <p className="text-xs text-wild-dove">Data Size</p>
          </div>
        </div>

        {/* Results Table */}
        <div className="rounded-2xl border border-black/10 overflow-hidden bg-white shadow-sm max-w-4xl mx-auto">
          {/* Table Header */}
          <div className="bg-neon-navy/5 border-b border-black/10 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-neon-navy/60" />
              <span className="text-sm font-medium text-nebulosity">
                {SOURCE_OPTIONS.find((s) => s.key === source)?.label} Scraper
              </span>
            </div>
            {isExtracting && (
              <span className="flex items-center gap-1.5 text-xs text-neon-navy font-medium">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Extracting...
              </span>
            )}
            {isComplete && (
              <span className="text-xs text-green-600 font-medium">Complete</span>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/5">
                  {headers.map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-2.5 text-xs font-semibold text-astro-grey uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {extractedRows.map((row) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, x: -20, backgroundColor: "rgba(99,102,241,0.08)" }}
                      animate={{ opacity: 1, x: 0, backgroundColor: "rgba(99,102,241,0)" }}
                      transition={{ duration: 0.4 }}
                      className="border-b border-black/5 last:border-0"
                    >
                      {row.columns.map((col, i) => (
                        <td key={i} className="px-4 py-2.5 text-nebulosity whitespace-nowrap">
                          {col}
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {extractedRows.length === 0 && !isExtracting && (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Wifi className="h-8 w-8 text-neon-navy/20" />
                <p className="text-sm text-wild-dove">
                  Select a source and start extraction to see results
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-6">
          {!isExtracting && !isComplete && (
            <button
              onClick={startExtraction}
              className="flex items-center gap-2 px-6 py-3 bg-neon-navy text-white font-medium rounded-full hover:bg-nebulosity transition-all active:scale-95"
            >
              <Play className="h-4 w-4" />
              Start Extraction
            </button>
          )}
          {isExtracting && (
            <button
              onClick={resetDemo}
              className="flex items-center gap-2 px-6 py-3 border border-black/10 text-wild-dove font-medium rounded-full hover:border-neon-navy/20 transition-all"
            >
              Stop
            </button>
          )}
        </div>

        {/* Export Section */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 max-w-md mx-auto"
            >
              <p className="text-sm font-medium text-nebulosity text-center mb-4">
                Export your data
              </p>
              <div className="flex justify-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/10 text-sm font-medium text-nebulosity hover:border-neon-navy/30 hover:bg-neon-navy/5 transition-all">
                  <FileText className="h-4 w-4 text-neon-navy/60" />
                  CSV
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/10 text-sm font-medium text-nebulosity hover:border-neon-navy/30 hover:bg-neon-navy/5 transition-all">
                  <Code className="h-4 w-4 text-neon-navy/60" />
                  JSON
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/10 text-sm font-medium text-nebulosity hover:border-neon-navy/30 hover:bg-neon-navy/5 transition-all">
                  <Download className="h-4 w-4 text-neon-navy/60" />
                  API
                </button>
              </div>

              <div className="mt-6 flex flex-col items-center gap-2">
                <button
                  onClick={resetDemo}
                  className="text-xs text-wild-dove hover:text-neon-navy transition-colors"
                >
                  Run again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-wild-dove mb-4">
            Need custom data pipelines at scale? Let us handle the complexity.
          </p>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 px-8 py-3.5 bg-neon-navy text-white font-medium rounded-full hover:bg-nebulosity transition-all"
          >
            Start Extracting Data
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
