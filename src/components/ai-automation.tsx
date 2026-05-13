"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Cpu, BarChart3, Workflow, ArrowRight, Play, Mail, FileText, FolderOpen } from "lucide-react";
import Link from "next/link";
import { GmailAutomationDemo } from "./demos/gmail-automation-demo";
import { StatementsAutomationDemo } from "./demos/statements-automation-demo";
import { FileOrganizerDemo } from "./demos/file-organizer-demo";

const features = [
  {
    icon: Bot,
    title: "AI Chatbots & Assistants",
    description:
      "Custom AI-powered chatbots that handle customer inquiries, qualify leads, and provide 24/7 support with human-like conversations.",
  },
  {
    icon: Workflow,
    title: "Process Automation",
    description:
      "Streamline repetitive business processes with intelligent automation that reduces costs and eliminates human error.",
  },
  {
    icon: BarChart3,
    title: "Predictive Analytics",
    description:
      "Harness your data with AI-driven insights that forecast trends, optimize operations, and identify growth opportunities.",
  },
  {
    icon: Cpu,
    title: "Custom AI Integration",
    description:
      "Seamlessly integrate AI capabilities into your existing systems, from content generation to decision-making engines.",
  },
];

const DEMO_TABS = [
  { id: "gmail", label: "Gmail Sorting", icon: Mail },
  { id: "statements", label: "Statement Extraction", icon: FileText },
  { id: "files", label: "File Organizer", icon: FolderOpen },
] as const;

type DemoTab = (typeof DEMO_TABS)[number]["id"];

export function AIAutomation() {
  const [activeDemo, setActiveDemo] = useState<DemoTab>("gmail");

  return (
    <section className="pt-32 pb-24 bg-nebulosity relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-neon-navy/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-inferno/5 rounded-full blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="text-xs font-medium tracking-widest uppercase text-astro-grey">
            AI Automation
          </span>
          <h2 className="mt-4 text-4xl lg:text-5xl font-bold tracking-tight text-sunset leading-[1.15]">
            Supercharge Your Business
            <br />
            with <span className="text-astro-grey">AI</span>
          </h2>
          <p className="mt-6 text-lg text-sunset/50 leading-relaxed">
            We build custom AI solutions that automate workflows, enhance decision-making,
            and unlock new possibilities for your business.
          </p>

          <motion.a
            href="#try-it"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="group inline-flex items-center gap-3 mt-10 px-10 py-4 bg-blue-500 text-white font-semibold text-lg rounded-full hover:bg-blue-400 transition-all shadow-lg shadow-blue-500/25"
          >
            <Play className="h-5 w-5" />
            See It in Action
          </motion.a>
        </motion.div>

        {/* Demo Selector Tabs */}
        <div id="try-it" className="scroll-mt-32">
          <div className="mt-16 flex flex-wrap justify-center gap-2 sm:gap-3">
            {DEMO_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeDemo === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveDemo(tab.id)}
                  className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                      : "bg-white/5 text-sunset/60 border border-white/10 hover:bg-white/10 hover:text-sunset"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Demo */}
          {activeDemo === "gmail" && <GmailAutomationDemo />}
          {activeDemo === "statements" && <StatementsAutomationDemo />}
          {activeDemo === "files" && <FileOrganizerDemo />}
        </div>

        {/* Services */}
        <div className="mt-24 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-500"
            >
              <div className="h-12 w-12 rounded-xl bg-neon-navy flex items-center justify-center">
                <feature.icon className="h-6 w-6 text-sunset" />
              </div>
              <h3 className="mt-5 font-semibold text-sunset">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm text-sunset/40 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 px-8 py-3.5 bg-sunset text-neon-navy font-medium rounded-full hover:bg-white transition-all"
          >
            Discuss Your AI Project
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
