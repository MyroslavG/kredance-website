"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Server,
  Cloud,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const SOURCES = [
  { id: "mysql", label: "MySQL", icon: Database },
  { id: "mongodb", label: "MongoDB", icon: Server },
  { id: "csv", label: "Legacy CSV", icon: Database },
];

const DESTINATIONS = [
  { id: "postgresql", label: "PostgreSQL", icon: Database },
  { id: "aws-s3", label: "AWS S3", icon: Cloud },
  { id: "bigquery", label: "Google BigQuery", icon: Server },
];

const VALIDATION_STEPS = [
  "Schema Mapped",
  "Data Validated",
  "Integrity Verified",
];

const TOTAL_RECORDS = 24850;

export function DataMigrationDemo() {
  const [source, setSource] = useState<string | null>(null);
  const [destination, setDestination] = useState<string | null>(null);
  const [isMigrating, setIsMigrating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [recordsMigrated, setRecordsMigrated] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [packets, setPackets] = useState<number[]>([]);

  const canStart = source && destination && !isMigrating && !isComplete;

  const startMigration = useCallback(() => {
    if (!canStart) return;
    setIsMigrating(true);
    setProgress(0);
    setRecordsMigrated(0);
    setCompletedSteps([]);
    setIsComplete(false);
  }, [canStart]);

  // Animate progress
  useEffect(() => {
    if (!isMigrating) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 2;
        if (next >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          setIsMigrating(false);
          return 100;
        }
        return next;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [isMigrating]);

  // Update records and validation steps based on progress
  useEffect(() => {
    setRecordsMigrated(Math.floor((progress / 100) * TOTAL_RECORDS));

    if (progress >= 30 && !completedSteps.includes(0)) {
      setCompletedSteps((prev) => [...prev, 0]);
    }
    if (progress >= 60 && !completedSteps.includes(1)) {
      setCompletedSteps((prev) => [...prev, 1]);
    }
    if (progress >= 90 && !completedSteps.includes(2)) {
      setCompletedSteps((prev) => [...prev, 2]);
    }
  }, [progress, completedSteps]);

  // Spawn animated packets
  useEffect(() => {
    if (!isMigrating) {
      setPackets([]);
      return;
    }

    const interval = setInterval(() => {
      setPackets((prev) => {
        const next = [...prev, Date.now()];
        if (next.length > 5) next.shift();
        return next;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isMigrating]);

  const reset = useCallback(() => {
    setSource(null);
    setDestination(null);
    setIsMigrating(false);
    setProgress(0);
    setRecordsMigrated(0);
    setCompletedSteps([]);
    setIsComplete(false);
    setPackets([]);
  }, []);

  const sourceItem = SOURCES.find((s) => s.id === source);
  const destItem = DESTINATIONS.find((d) => d.id === destination);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-sm font-medium text-wild-dove uppercase tracking-wider mb-2">
            Interactive Demo
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-neon-navy">
            Migration Simulator
          </h2>
          <p className="mt-3 text-astro-grey max-w-xl mx-auto">
            Select a source and destination, then watch your data flow seamlessly
            between systems with full validation.
          </p>
        </motion.div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          {/* Migration flow panels */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
            {/* Source panel */}
            <div className="rounded-xl border border-astro-grey/20 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-wild-dove uppercase tracking-wider mb-3">
                Source
              </p>
              <div className="flex flex-col gap-2">
                {SOURCES.map((s) => {
                  const Icon = s.icon;
                  const isSelected = source === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => !isMigrating && !isComplete && setSource(s.id)}
                      disabled={isMigrating || isComplete}
                      className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-left text-sm transition-all ${
                        isSelected
                          ? "border-neon-navy bg-neon-navy/5 text-neon-navy font-medium"
                          : "border-astro-grey/20 text-astro-grey hover:border-neon-navy/30 hover:bg-neon-navy/[0.02]"
                      } ${isMigrating || isComplete ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Animated flow middle */}
            <div className="relative flex items-center justify-center w-16 sm:w-24 h-40">
              {/* Connection line */}
              <div className="absolute inset-y-[45%] left-0 right-0 h-[2px] bg-astro-grey/20 rounded-full" />

              {/* Animated packets */}
              <AnimatePresence>
                {packets.map((id) => (
                  <motion.div
                    key={id}
                    initial={{ x: -30, opacity: 0, scale: 0.5 }}
                    animate={{ x: 30, opacity: 1, scale: 1 }}
                    exit={{ x: 60, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute w-3 h-3 rounded-full bg-neon-navy shadow-md shadow-neon-navy/30"
                  />
                ))}
              </AnimatePresence>

              {/* Arrow indicator */}
              {(source || destination) && !isMigrating && !isComplete && (
                <ArrowRight className="h-5 w-5 text-astro-grey/40 relative z-10" />
              )}
            </div>

            {/* Destination panel */}
            <div className="rounded-xl border border-astro-grey/20 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-wild-dove uppercase tracking-wider mb-3">
                Destination
              </p>
              <div className="flex flex-col gap-2">
                {DESTINATIONS.map((d) => {
                  const Icon = d.icon;
                  const isSelected = destination === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => !isMigrating && !isComplete && setDestination(d.id)}
                      disabled={isMigrating || isComplete}
                      className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-left text-sm transition-all ${
                        isSelected
                          ? "border-neon-navy bg-neon-navy/5 text-neon-navy font-medium"
                          : "border-astro-grey/20 text-astro-grey hover:border-neon-navy/30 hover:bg-neon-navy/[0.02]"
                      } ${isMigrating || isComplete ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{d.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Progress section */}
          <AnimatePresence>
            {(isMigrating || isComplete) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-8 overflow-hidden"
              >
                {/* Records counter */}
                <div className="text-center mb-4">
                  <p className="text-sm text-wild-dove">Records Migrated</p>
                  <p className="text-2xl sm:text-3xl font-bold text-neon-navy tabular-nums">
                    {recordsMigrated.toLocaleString()}
                    <span className="text-astro-grey text-lg font-normal">
                      {" "}
                      / {TOTAL_RECORDS.toLocaleString()}
                    </span>
                  </p>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3 bg-astro-grey/10 rounded-full overflow-hidden mb-6">
                  <motion.div
                    className="h-full bg-neon-navy rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>

                {/* Validation steps */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-3 sm:gap-6">
                  {VALIDATION_STEPS.map((step, i) => {
                    const isCompleted = completedSteps.includes(i);
                    return (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                          opacity: isCompleted ? 1 : 0.4,
                          y: 0,
                        }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2
                          className={`h-4 w-4 transition-colors ${
                            isCompleted ? "text-green-500" : "text-astro-grey/30"
                          }`}
                        />
                        <span
                          className={`text-sm transition-colors ${
                            isCompleted
                              ? "text-neon-navy font-medium"
                              : "text-astro-grey/50"
                          }`}
                        >
                          {step}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Completion message */}
                {isComplete && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mt-6 text-sm text-green-600 font-medium"
                  >
                    Migration complete! {sourceItem?.label} to {destItem?.label} — all
                    records verified.
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={startMigration}
              disabled={!canStart}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                canStart
                  ? "bg-neon-navy text-white hover:bg-nebulosity shadow-lg shadow-neon-navy/20"
                  : "bg-astro-grey/10 text-astro-grey/40 cursor-not-allowed"
              }`}
            >
              {isMigrating ? "Migrating..." : "Start Migration"}
            </button>

            {(source || destination || isComplete) && (
              <button
                onClick={reset}
                className="flex items-center gap-2 px-5 py-3 rounded-full text-sm text-wild-dove hover:text-neon-navy border border-astro-grey/20 hover:border-neon-navy/30 transition-all"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            )}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 bg-neon-navy text-white font-semibold text-base sm:text-lg rounded-full hover:bg-nebulosity transition-all shadow-lg shadow-neon-navy/10"
          >
            Migrate My Data
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
