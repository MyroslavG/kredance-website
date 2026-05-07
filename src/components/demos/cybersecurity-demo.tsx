"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ShieldCheck, ShieldAlert, AlertTriangle, ArrowRight, RotateCcw, Lock, Globe } from "lucide-react";
import Link from "next/link";

type CheckStatus = "pending" | "running" | "pass" | "warning" | "fail";

interface SecurityCheck {
  id: string;
  label: string;
  status: CheckStatus;
  detail?: string;
}

const INITIAL_CHECKS: SecurityCheck[] = [
  { id: "ssl", label: "SSL Certificate", status: "pending" },
  { id: "firewall", label: "Firewall Rules", status: "pending" },
  { id: "sqli", label: "SQL Injection", status: "pending" },
  { id: "xss", label: "XSS Protection", status: "pending" },
  { id: "headers", label: "Security Headers", status: "pending" },
  { id: "auth", label: "Authentication", status: "pending" },
];

const RESULTS: Record<string, { status: "pass" | "warning" | "fail"; detail: string }> = {
  ssl: { status: "pass", detail: "Valid certificate, expires in 245 days" },
  firewall: { status: "pass", detail: "All ports secured, WAF active" },
  sqli: { status: "fail", detail: "2 endpoints vulnerable to injection" },
  xss: { status: "warning", detail: "CSP header missing on 1 route" },
  headers: { status: "warning", detail: "X-Frame-Options not set" },
  auth: { status: "pass", detail: "MFA enabled, sessions expire correctly" },
};

const SCORE = 78;

function getScoreColor(score: number) {
  if (score >= 90) return "text-emerald-500";
  if (score >= 70) return "text-amber-500";
  return "text-red-500";
}

function getGaugeColor(score: number) {
  if (score >= 90) return "from-emerald-400 to-emerald-600";
  if (score >= 70) return "from-amber-400 to-amber-600";
  return "from-red-400 to-red-600";
}

function StatusIcon({ status }: { status: CheckStatus }) {
  switch (status) {
    case "pass":
      return <ShieldCheck className="h-4 w-4 text-emerald-500" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case "fail":
      return <ShieldAlert className="h-4 w-4 text-red-500" />;
    case "running":
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Shield className="h-4 w-4 text-neon-navy/60" />
        </motion.div>
      );
    default:
      return <Shield className="h-4 w-4 text-wild-dove/40" />;
  }
}

export function CybersecurityDemo() {
  const [checks, setChecks] = useState<SecurityCheck[]>(INITIAL_CHECKS);
  const [scanning, setScanning] = useState(false);
  const [complete, setComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const runScan = useCallback(() => {
    setScanning(true);
    setComplete(false);
    setProgress(0);
    setChecks(INITIAL_CHECKS);

    const delays = [600, 1400, 2200, 3000, 3800, 4600];
    const totalDuration = 5200;

    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, totalDuration / 50);

    timeoutsRef.current.push(progressInterval as unknown as ReturnType<typeof setTimeout>);

    // Stagger each check
    INITIAL_CHECKS.forEach((check, index) => {
      // Set to running
      const runTimeout = setTimeout(() => {
        setChecks((prev) =>
          prev.map((c) => (c.id === check.id ? { ...c, status: "running" } : c))
        );
      }, delays[index] - 400);
      timeoutsRef.current.push(runTimeout);

      // Set result
      const resultTimeout = setTimeout(() => {
        const result = RESULTS[check.id];
        setChecks((prev) =>
          prev.map((c) =>
            c.id === check.id
              ? { ...c, status: result.status, detail: result.detail }
              : c
          )
        );
      }, delays[index]);
      timeoutsRef.current.push(resultTimeout);
    });

    // Complete
    const completeTimeout = setTimeout(() => {
      setScanning(false);
      setComplete(true);
      setProgress(100);
      clearInterval(progressInterval);
    }, totalDuration);
    timeoutsRef.current.push(completeTimeout);
  }, []);

  const reset = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setChecks(INITIAL_CHECKS);
    setScanning(false);
    setComplete(false);
    setProgress(0);
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
            Security Scanner
          </h3>
          <p className="mt-3 text-wild-dove max-w-lg mx-auto">
            Run a simulated security audit to see how we identify vulnerabilities and protect your business
          </p>
        </motion.div>

        {/* Scan Panel */}
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-black/10 bg-sunset/20 overflow-hidden"
          >
            {/* Panel Header */}
            <div className="px-6 py-4 border-b border-black/5 flex items-center gap-3">
              <Globe className="h-4 w-4 text-neon-navy/60" />
              <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-black/10">
                <Lock className="h-3 w-3 text-emerald-500" />
                <span className="text-sm text-nebulosity">https://example-business.com</span>
              </div>
            </div>

            {/* Panel Body */}
            <div className="p-6">
              {/* Progress Bar */}
              {(scanning || complete) && (
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs text-wild-dove mb-2">
                    <span>{scanning ? "Scanning..." : "Scan Complete"}</span>
                    <span>{Math.min(progress, 100)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-black/5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-neon-navy to-neon-navy/70"
                      initial={{ width: "0%" }}
                      animate={{ width: `${Math.min(progress, 100)}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              {/* Checks List */}
              {(scanning || complete) && (
                <div className="space-y-2 mb-6">
                  {checks.map((check) => (
                    <motion.div
                      key={check.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                        check.status === "pending"
                          ? "border-black/5 bg-white/50"
                          : check.status === "running"
                          ? "border-neon-navy/20 bg-neon-navy/5"
                          : check.status === "pass"
                          ? "border-emerald-200 bg-emerald-50"
                          : check.status === "warning"
                          ? "border-amber-200 bg-amber-50"
                          : "border-red-200 bg-red-50"
                      }`}
                    >
                      <StatusIcon status={check.status} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-nebulosity">{check.label}</p>
                        {check.detail && (
                          <p className={`text-xs mt-0.5 ${
                            check.status === "pass"
                              ? "text-emerald-600"
                              : check.status === "warning"
                              ? "text-amber-600"
                              : "text-red-600"
                          }`}>
                            {check.detail}
                          </p>
                        )}
                      </div>
                      {check.status !== "pending" && check.status !== "running" && (
                        <span className={`text-xs font-medium uppercase tracking-wider ${
                          check.status === "pass"
                            ? "text-emerald-500"
                            : check.status === "warning"
                            ? "text-amber-500"
                            : "text-red-500"
                        }`}>
                          {check.status}
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Score Gauge */}
              <AnimatePresence>
                {complete && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="flex flex-col items-center py-6 border-t border-black/5"
                  >
                    <p className="text-xs font-medium text-astro-grey uppercase tracking-wider mb-3">
                      Overall Security Score
                    </p>
                    <div className="relative w-32 h-32 mb-3">
                      {/* Background circle */}
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          className="text-black/5"
                        />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="none"
                          stroke="url(#scoreGradient)"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${SCORE * 2.64} ${264 - SCORE * 2.64}`}
                          initial={{ strokeDasharray: "0 264" }}
                          animate={{ strokeDasharray: `${SCORE * 2.64} ${264 - SCORE * 2.64}` }}
                          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                        />
                        <defs>
                          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#d97706" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                          className={`text-3xl font-bold ${getScoreColor(SCORE)}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          {SCORE}
                        </motion.span>
                        <span className="text-xs text-wild-dove">/100</span>
                      </div>
                    </div>
                    <p className="text-sm text-wild-dove text-center max-w-xs">
                      Your site has <span className="font-medium text-amber-600">moderate vulnerabilities</span> that should be addressed to prevent data breaches.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3">
                {!scanning && !complete && (
                  <motion.button
                    onClick={runScan}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-neon-navy text-white font-medium rounded-full hover:bg-nebulosity transition-colors"
                  >
                    <Shield className="h-4 w-4" />
                    Run Security Scan
                  </motion.button>
                )}
                {complete && (
                  <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-wild-dove border border-black/10 rounded-full hover:border-neon-navy/20 hover:text-neon-navy transition-all"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Scan Again
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <AnimatePresence>
          {complete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-10 text-center"
            >
              <p className="text-sm text-wild-dove mb-4">
                Don&apos;t leave your business exposed. Let our team secure your systems.
              </p>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-8 py-3.5 bg-neon-navy text-white font-medium rounded-full hover:bg-nebulosity transition-all"
              >
                Secure My Business
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
