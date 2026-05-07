"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  FileText,
  MessageSquare,
  Server,
  Brain,
  Cpu,
  Wrench,
  Globe,
  LayoutDashboard,
  Mail,
  MessageCircle,
  ArrowRight,
  Play,
  CheckCircle2,
  Loader2,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface PipelineSelection {
  input: string | null;
  model: string | null;
  output: string | null;
}

type ProcessingStage = "idle" | "input" | "processing" | "output" | "complete";

const INPUT_SOURCES = [
  { id: "crm", label: "CRM Data", icon: Database, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
  { id: "documents", label: "Documents", icon: FileText, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/30" },
  { id: "chat", label: "Customer Chat", icon: MessageSquare, color: "text-green-400", bg: "bg-green-500/10 border-green-500/30" },
  { id: "database", label: "Database", icon: Server, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/30" },
];

const AI_MODELS = [
  { id: "gpt4", label: "GPT-4", icon: Brain, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" },
  { id: "claude", label: "Claude", icon: Cpu, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" },
  { id: "custom", label: "Custom Model", icon: Wrench, color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/30" },
];

const OUTPUT_DESTINATIONS = [
  { id: "api", label: "API Response", icon: Globe, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/30" },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/30" },
  { id: "email", label: "Email", icon: Mail, color: "text-red-400", bg: "bg-red-500/10 border-red-500/30" },
  { id: "slack", label: "Slack", icon: MessageCircle, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/30" },
];

const SAMPLE_OUTPUTS: Record<string, Record<string, string>> = {
  crm: {
    api: "{ \"lead_score\": 87, \"sentiment\": \"positive\", \"recommended_action\": \"Schedule follow-up call within 48hrs\", \"deal_probability\": \"72%\" }",
    dashboard: "Lead Score: 87/100 | Sentiment: Positive | Next Action: Follow-up call | Pipeline Stage: Negotiation",
    email: "Subject: High-Priority Lead Alert\n\nNew lead scored 87/100. Customer sentiment is positive. Recommended: Schedule follow-up within 48 hours.",
    slack: "#sales-alerts: New high-priority lead detected (Score: 87). Sentiment: Positive. Action: Schedule follow-up call within 48hrs.",
  },
  documents: {
    api: "{ \"summary\": \"Q3 revenue up 23%. Key risks: supply chain delays. Recommendation: Increase inventory buffer by 15%.\", \"confidence\": 0.94 }",
    dashboard: "Document Summary: Q3 revenue +23% | Risk Level: Medium | Key Insight: Supply chain delays | Action: Increase inventory buffer",
    email: "Subject: Document Analysis Complete\n\nKey findings: Q3 revenue increased 23%. Primary risk identified: supply chain delays. Suggested action: increase buffer.",
    slack: "#reports: Document analyzed. Summary: Q3 revenue +23%, supply chain risk flagged. Confidence: 94%. See full report in dashboard.",
  },
  chat: {
    api: "{ \"intent\": \"billing_inquiry\", \"sentiment\": \"frustrated\", \"priority\": \"high\", \"suggested_response\": \"Acknowledge issue, offer 10% credit\" }",
    dashboard: "Intent: Billing Inquiry | Sentiment: Frustrated | Priority: High | Resolution: Offer credit + escalate to billing team",
    email: "Subject: Escalation - Frustrated Customer\n\nCustomer intent: billing inquiry. Sentiment: frustrated. Suggested: acknowledge issue and offer 10% account credit.",
    slack: "#support-escalations: Frustrated customer detected. Intent: billing inquiry. Priority: HIGH. Suggested: offer 10% credit. Auto-escalating.",
  },
  database: {
    api: "{ \"anomalies_detected\": 3, \"pattern\": \"usage_spike\", \"affected_users\": 1247, \"recommendation\": \"Scale infrastructure by 20%\" }",
    dashboard: "Anomalies: 3 detected | Pattern: Usage spike | Affected: 1,247 users | Action: Scale infrastructure +20%",
    email: "Subject: Database Anomaly Alert\n\n3 anomalies detected. Pattern: usage spike affecting 1,247 users. Recommendation: scale infrastructure by 20%.",
    slack: "#engineering: Database anomaly alert. 3 spikes detected, 1,247 users affected. Auto-recommendation: scale infra by 20%. Review needed.",
  },
};

export function AIIntegrationDemo() {
  const [selection, setSelection] = useState<PipelineSelection>({
    input: null,
    model: null,
    output: null,
  });
  const [stage, setStage] = useState<ProcessingStage>("idle");

  const isPipelineComplete = selection.input && selection.model && selection.output;

  const runPipeline = useCallback(() => {
    if (!isPipelineComplete) return;
    setStage("input");
    setTimeout(() => setStage("processing"), 1200);
    setTimeout(() => setStage("output"), 2800);
    setTimeout(() => setStage("complete"), 3800);
  }, [isPipelineComplete]);

  const reset = useCallback(() => {
    setSelection({ input: null, model: null, output: null });
    setStage("idle");
  }, []);

  const getStageStatus = (targetStage: "input" | "processing" | "output") => {
    const order: ProcessingStage[] = ["idle", "input", "processing", "output", "complete"];
    const currentIndex = order.indexOf(stage);
    const targetIndex = order.indexOf(targetStage);

    if (currentIndex > targetIndex) return "done";
    if (currentIndex === targetIndex) return "active";
    return "pending";
  };

  const sampleOutput =
    selection.input && selection.output
      ? SAMPLE_OUTPUTS[selection.input]?.[selection.output] || ""
      : "";

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
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-wild-dove bg-astro-grey/30 px-4 py-1.5 rounded-full mb-4">
            Interactive Demo
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-neon-navy">
            AI Pipeline Builder
          </h2>
          <p className="mt-4 text-base sm:text-lg text-nebulosity max-w-2xl mx-auto">
            Configure your AI integration in three steps. Select an input source, choose your AI model, and pick an output destination to see how data flows through your pipeline.
          </p>
        </motion.div>

        {/* Pipeline Builder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          {/* Three Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 lg:gap-8">
            {/* Input Source */}
            <div className="relative">
              <div className={`rounded-2xl border-2 p-5 transition-all duration-300 ${
                getStageStatus("input") === "active"
                  ? "border-blue-400 bg-blue-50 shadow-lg shadow-blue-100"
                  : getStageStatus("input") === "done"
                  ? "border-green-400 bg-green-50"
                  : "border-astro-grey/40 bg-white"
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neon-navy">
                    1. Input Source
                  </h3>
                  {getStageStatus("input") === "active" && (
                    <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                  )}
                  {getStageStatus("input") === "done" && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {INPUT_SOURCES.map((source) => {
                    const Icon = source.icon;
                    const isSelected = selection.input === source.id;
                    return (
                      <button
                        key={source.id}
                        onClick={() => stage === "idle" && setSelection((s) => ({ ...s, input: source.id }))}
                        disabled={stage !== "idle"}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? `${source.bg} scale-[1.02] shadow-sm`
                            : "border-transparent bg-astro-grey/10 hover:bg-astro-grey/20 hover:scale-[1.01]"
                        } ${stage !== "idle" ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                      >
                        <Icon className={`h-5 w-5 ${isSelected ? source.color : "text-nebulosity"}`} />
                        <span className={`text-xs font-medium ${isSelected ? "text-neon-navy" : "text-nebulosity"}`}>
                          {source.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Connector Arrow (desktop) */}
              <div className="hidden md:flex absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-10 items-center">
                <motion.div
                  animate={{
                    opacity: getStageStatus("input") === "done" ? 1 : 0.3,
                    scale: getStageStatus("input") === "active" ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 0.5, repeat: getStageStatus("input") === "active" ? Infinity : 0 }}
                >
                  <ArrowRight className={`h-5 w-5 ${
                    getStageStatus("input") === "done" ? "text-green-500" : "text-astro-grey"
                  }`} />
                </motion.div>
              </div>

              {/* Connector Arrow (mobile) */}
              <div className="flex md:hidden justify-center my-2">
                <motion.div
                  animate={{
                    opacity: getStageStatus("input") === "done" ? 1 : 0.3,
                  }}
                  className="rotate-90"
                >
                  <ArrowRight className={`h-5 w-5 ${
                    getStageStatus("input") === "done" ? "text-green-500" : "text-astro-grey"
                  }`} />
                </motion.div>
              </div>
            </div>

            {/* AI Model */}
            <div className="relative">
              <div className={`rounded-2xl border-2 p-5 transition-all duration-300 ${
                getStageStatus("processing") === "active"
                  ? "border-amber-400 bg-amber-50 shadow-lg shadow-amber-100"
                  : getStageStatus("processing") === "done"
                  ? "border-green-400 bg-green-50"
                  : "border-astro-grey/40 bg-white"
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neon-navy">
                    2. AI Model
                  </h3>
                  {getStageStatus("processing") === "active" && (
                    <Loader2 className="h-4 w-4 text-amber-500 animate-spin" />
                  )}
                  {getStageStatus("processing") === "done" && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {AI_MODELS.map((model) => {
                    const Icon = model.icon;
                    const isSelected = selection.model === model.id;
                    return (
                      <button
                        key={model.id}
                        onClick={() => stage === "idle" && setSelection((s) => ({ ...s, model: model.id }))}
                        disabled={stage !== "idle"}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? `${model.bg} scale-[1.01] shadow-sm`
                            : "border-transparent bg-astro-grey/10 hover:bg-astro-grey/20 hover:scale-[1.01]"
                        } ${stage !== "idle" ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                      >
                        <Icon className={`h-5 w-5 ${isSelected ? model.color : "text-nebulosity"}`} />
                        <span className={`text-sm font-medium ${isSelected ? "text-neon-navy" : "text-nebulosity"}`}>
                          {model.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Processing animation */}
                <AnimatePresence>
                  {getStageStatus("processing") === "active" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-amber-200"
                    >
                      <div className="flex items-center gap-2">
                        <Zap className="h-3.5 w-3.5 text-amber-500" />
                        <span className="text-xs text-amber-700 font-medium">Processing data...</span>
                      </div>
                      <div className="mt-2 h-1.5 bg-amber-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-amber-400 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1.6, ease: "linear" }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Connector Arrow (desktop) */}
              <div className="hidden md:flex absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-10 items-center">
                <motion.div
                  animate={{
                    opacity: getStageStatus("processing") === "done" ? 1 : 0.3,
                    scale: getStageStatus("output") === "active" ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 0.5, repeat: getStageStatus("output") === "active" ? Infinity : 0 }}
                >
                  <ArrowRight className={`h-5 w-5 ${
                    getStageStatus("processing") === "done" ? "text-green-500" : "text-astro-grey"
                  }`} />
                </motion.div>
              </div>

              {/* Connector Arrow (mobile) */}
              <div className="flex md:hidden justify-center my-2">
                <motion.div
                  animate={{
                    opacity: getStageStatus("processing") === "done" ? 1 : 0.3,
                  }}
                  className="rotate-90"
                >
                  <ArrowRight className={`h-5 w-5 ${
                    getStageStatus("processing") === "done" ? "text-green-500" : "text-astro-grey"
                  }`} />
                </motion.div>
              </div>
            </div>

            {/* Output Destination */}
            <div className="relative">
              <div className={`rounded-2xl border-2 p-5 transition-all duration-300 ${
                getStageStatus("output") === "active"
                  ? "border-indigo-400 bg-indigo-50 shadow-lg shadow-indigo-100"
                  : getStageStatus("output") === "done"
                  ? "border-green-400 bg-green-50"
                  : "border-astro-grey/40 bg-white"
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neon-navy">
                    3. Output Destination
                  </h3>
                  {getStageStatus("output") === "active" && (
                    <Loader2 className="h-4 w-4 text-indigo-500 animate-spin" />
                  )}
                  {getStageStatus("output") === "done" && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {OUTPUT_DESTINATIONS.map((dest) => {
                    const Icon = dest.icon;
                    const isSelected = selection.output === dest.id;
                    return (
                      <button
                        key={dest.id}
                        onClick={() => stage === "idle" && setSelection((s) => ({ ...s, output: dest.id }))}
                        disabled={stage !== "idle"}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? `${dest.bg} scale-[1.02] shadow-sm`
                            : "border-transparent bg-astro-grey/10 hover:bg-astro-grey/20 hover:scale-[1.01]"
                        } ${stage !== "idle" ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                      >
                        <Icon className={`h-5 w-5 ${isSelected ? dest.color : "text-nebulosity"}`} />
                        <span className={`text-xs font-medium ${isSelected ? "text-neon-navy" : "text-nebulosity"}`}>
                          {dest.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-nebulosity">
              {stage === "idle" && !isPipelineComplete && "Select an option from each stage to configure your pipeline."}
              {stage === "idle" && isPipelineComplete && "Pipeline configured! Click \"Test Pipeline\" to simulate the data flow."}
              {stage === "input" && "Ingesting data from source..."}
              {stage === "processing" && "AI model analyzing and transforming data..."}
              {stage === "output" && "Delivering results to destination..."}
              {stage === "complete" && "Pipeline executed successfully!"}
            </div>
            <div className="flex gap-3">
              {stage !== "idle" && (
                <button
                  onClick={reset}
                  className="px-5 py-2.5 rounded-full text-sm font-medium border border-astro-grey/40 text-nebulosity hover:bg-astro-grey/10 transition-colors"
                >
                  Reset
                </button>
              )}
              <button
                onClick={runPipeline}
                disabled={!isPipelineComplete || stage !== "idle"}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  isPipelineComplete && stage === "idle"
                    ? "bg-neon-navy text-white hover:bg-neon-navy/90 shadow-lg shadow-neon-navy/20"
                    : "bg-astro-grey/20 text-wild-dove cursor-not-allowed"
                }`}
              >
                <Play className="h-4 w-4" />
                Test Pipeline
              </button>
            </div>
          </div>

          {/* Sample Output Result */}
          <AnimatePresence>
            {stage === "complete" && sampleOutput && (
              <motion.div
                initial={{ opacity: 0, y: 20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-8"
              >
                <div className="rounded-2xl border-2 border-green-400 bg-green-50 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <h4 className="text-sm font-bold uppercase tracking-wider text-green-800">
                      Pipeline Output
                    </h4>
                  </div>
                  <div className="bg-white rounded-xl border border-green-200 p-4 font-mono text-xs sm:text-sm text-neon-navy leading-relaxed whitespace-pre-wrap break-words">
                    {sampleOutput}
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-green-700">
                    <span>Latency: 142ms</span>
                    <span>Tokens: 87</span>
                    <span>Confidence: 94%</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-14 text-center"
        >
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 bg-neon-navy text-white font-semibold text-base sm:text-lg rounded-full hover:bg-neon-navy/90 transition-all shadow-lg shadow-neon-navy/20"
          >
            Build My AI Pipeline
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
