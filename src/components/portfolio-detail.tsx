"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowLeft, ExternalLink } from "lucide-react";

interface RelatedService {
  title: string;
  href: string;
}

interface PortfolioDetailProps {
  title: string;
  category: string;
  description: string;
  image?: string;
  sections: {
    heading: string;
    content: string;
  }[];
  technologies?: string[];
  results?: string[];
  relatedServices?: RelatedService[];
  liveUrl?: string;
}

export function PortfolioDetail({
  title,
  category,
  description,
  image,
  sections,
  technologies,
  results,
  relatedServices,
  liveUrl,
}: PortfolioDetailProps) {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-24 bg-neon-navy overflow-hidden">
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
              href="/portfolio"
              className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mb-8"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All Projects
            </Link>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-sm font-medium tracking-widest uppercase text-sunset/50 mb-4"
            >
              {category}
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
            {liveUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="mt-8"
              >
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-8 py-3.5 bg-sunset text-neon-navy font-medium rounded-full hover:bg-white transition-all"
                >
                  Visit Live Site
                  <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content sections */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          {sections.map((section, i) => (
            <motion.div
              key={section.heading}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mb-12 last:mb-0"
            >
              <h2 className="text-2xl font-bold text-neon-navy mb-4">
                {section.heading}
              </h2>
              <p className="text-wild-dove leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Technologies & Results */}
      {(technologies?.length || results?.length) && (
        <section className="py-24 bg-sunset/30">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              {technologies && technologies.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-xl font-bold text-neon-navy mb-6">
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-4 py-2 text-sm font-medium rounded-full bg-neon-navy text-sunset"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
              {results && results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h3 className="text-xl font-bold text-neon-navy mb-6">
                    Key Results
                  </h3>
                  <ul className="space-y-3">
                    {results.map((result) => (
                      <li
                        key={result}
                        className="flex items-start gap-3 text-wild-dove"
                      >
                        <div className="mt-1.5 h-2 w-2 rounded-full bg-neon-navy flex-shrink-0" />
                        <span className="leading-relaxed">{result}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Related Services */}
      {relatedServices && relatedServices.length > 0 && (
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
                Services Used
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-neon-navy">
                Related Services
              </h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedServices.map((service, i) => (
                <motion.div
                  key={service.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <Link
                    href={service.href}
                    className="group flex items-center justify-between p-5 rounded-2xl border border-black/5 hover:border-neon-navy/15 hover:bg-neon-navy/[0.02] transition-all duration-300"
                  >
                    <span className="font-semibold text-nebulosity group-hover:text-neon-navy transition-colors">
                      {service.title}
                    </span>
                    <ArrowRight className="h-4 w-4 text-wild-dove group-hover:text-neon-navy group-hover:translate-x-1 transition-all" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-neon-navy p-10 sm:p-16"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.03] rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-sunset/5 rounded-full translate-y-1/2 -translate-x-1/4" />

            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Want Something Similar?
              </h2>
              <p className="text-white/40 mb-8 leading-relaxed">
                Let&apos;s discuss how we can bring your vision to life with the
                same level of quality and attention to detail.
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
                  href="/portfolio"
                  className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/10 text-white/60 font-medium rounded-full hover:bg-white/5 hover:text-white transition-all"
                >
                  View All Projects
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
