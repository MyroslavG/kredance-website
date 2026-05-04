"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

interface Feature {
  title: string;
  description: string;
}

interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

interface RelatedProject {
  title: string;
  href: string;
  image: string;
}

interface ServiceDetailProps {
  title: string;
  subtitle: string;
  description: string;
  features: Feature[];
  process: ProcessStep[];
  relatedProjects?: RelatedProject[];
}

export function ServiceDetail({
  title,
  subtitle,
  description,
  features,
  process,
  relatedProjects,
}: ServiceDetailProps) {
  return (
    <>
      {/* Hero — full-width dark banner */}
      <section className="relative pt-32 pb-24 bg-neon-navy overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/[0.02] rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-inferno/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-sunset/5 rounded-full blur-2xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mb-8"
            >
              <ArrowRight className="h-3.5 w-3.5 rotate-180" />
              All Services
            </Link>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-sm font-medium tracking-widest uppercase text-sunset/50 mb-4"
            >
              {subtitle}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]"
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-6 text-lg text-white/50 leading-relaxed max-w-2xl"
            >
              {description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-8 py-3.5 bg-sunset text-neon-navy font-medium rounded-full hover:bg-white transition-all"
              >
                Get Started
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/10 text-white/60 font-medium rounded-full hover:bg-white/5 hover:text-white transition-all"
              >
                Explore Services
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features — interactive selectable cards */}
      <FeaturesSection features={features} />

      {/* Process — timeline style */}
      <section className="py-24 bg-sunset/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(19,25,54,0.03),transparent_70%)]" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm font-medium tracking-widest uppercase text-astro-grey mb-4">
              How It Works
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neon-navy">
              Our Process
            </h2>
          </motion.div>

          {/* Desktop timeline */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute top-8 left-0 right-0 h-px bg-neon-navy/10" />

              <div className="grid grid-cols-4 gap-8">
                {process.map((step, i) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.15,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="relative"
                  >
                    {/* Step number node */}
                    <div className="relative z-10 flex items-center justify-center h-16 w-16 rounded-2xl bg-neon-navy text-sunset font-bold text-xl mb-6 shadow-lg shadow-neon-navy/10">
                      {step.step}
                    </div>
                    <h3 className="font-semibold text-nebulosity text-lg mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-wild-dove leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile/tablet timeline */}
          <div className="lg:hidden space-y-8">
            {process.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex gap-5"
              >
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-neon-navy text-sunset font-bold text-lg flex-shrink-0">
                    {step.step}
                  </div>
                  {i < process.length - 1 && (
                    <div className="w-px flex-1 bg-neon-navy/10 mt-3" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="font-semibold text-nebulosity text-lg mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-wild-dove leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {relatedProjects && relatedProjects.length > 0 && (
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <p className="text-sm font-medium tracking-widest uppercase text-astro-grey mb-4">
                Our Work
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-neon-navy">
                Related Projects
              </h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProjects.map((project, i) => (
                <motion.div
                  key={project.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <Link
                    href={project.href}
                    className="group flex items-center justify-between p-5 rounded-2xl border border-black/5 hover:border-neon-navy/15 hover:bg-neon-navy/[0.02] transition-all duration-300"
                  >
                    <span className="font-semibold text-nebulosity group-hover:text-neon-navy transition-colors">
                      {project.title}
                    </span>
                    <ArrowRight className="h-4 w-4 text-wild-dove group-hover:text-neon-navy group-hover:translate-x-1 transition-all" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA — bold design */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-neon-navy p-10 sm:p-16"
          >
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.03] rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-sunset/5 rounded-full translate-y-1/2 -translate-x-1/4" />

            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-white/40 mb-8 leading-relaxed">
                Let&apos;s discuss how our {title.toLowerCase()} services can help
                your business grow. Get in touch for a free consultation.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 px-8 py-3.5 bg-sunset text-neon-navy font-medium rounded-full hover:bg-white transition-all"
                >
                  Start a Project
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/10 text-white/60 font-medium rounded-full hover:bg-white/5 hover:text-white transition-all"
                >
                  View All Services
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

function FeaturesSection({ features }: { features: Feature[] }) {
  const [active, setActive] = useState(0);

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium tracking-widest uppercase text-astro-grey mb-4">
            Capabilities
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-neon-navy">
            What We Offer
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10">
          {/* Left — card list */}
          <div className="flex flex-col gap-3">
            {features.map((feature, i) => (
              <motion.button
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onClick={() => setActive(i)}
                className={`group relative text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  active === i
                    ? "bg-neon-navy border-neon-navy shadow-lg shadow-neon-navy/10"
                    : "bg-white border-black/5 hover:border-neon-navy/15 hover:bg-neon-navy/[0.02]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle
                    className={`h-5 w-5 flex-shrink-0 transition-colors duration-300 ${
                      active === i ? "text-sunset/70" : "text-neon-navy/30 group-hover:text-neon-navy/60"
                    }`}
                  />
                  <h3
                    className={`font-semibold text-base transition-colors duration-300 ${
                      active === i ? "text-white" : "text-nebulosity"
                    }`}
                  >
                    {feature.title}
                  </h3>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Right — expanded detail */}
          <div className="relative min-h-[280px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="p-8 sm:p-10 rounded-3xl bg-sunset/30 border border-black/5 w-full"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-neon-navy flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-sunset" />
                  </div>
                  <h3 className="text-xl font-bold text-neon-navy">
                    {features[active].title}
                  </h3>
                </div>
                <p className="text-wild-dove leading-relaxed text-base">
                  {features[active].description}
                </p>
                <div className="mt-6">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-2 text-sm font-medium text-neon-navy hover:text-nebulosity transition-colors"
                  >
                    Discuss this with us
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
