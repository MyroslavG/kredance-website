"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { PortfolioProject } from "@/lib/portfolio-projects";

const categories = ["All", "Website", "Ecommerce", "Mobile App", "AI / Plugins", "Integration", "Design", "Cybersecurity", "Data Mining"];

export function Portfolio({ projects }: { projects: PortfolioProject[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const filtered = activeCategory === "All"
    ? projects
    : projects.filter((project) => project.category === activeCategory);

  return (
    <section className="pt-32 pb-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="text-xs font-medium tracking-widest uppercase text-nebulosity/70">Portfolio</span>
          <h1 className="mt-4 text-4xl lg:text-5xl font-bold tracking-tight text-nebulosity leading-[1.15]">
            Featured <span className="text-neon-navy">Work</span>
          </h1>
          <p className="mt-6 text-lg text-nebulosity/70 leading-relaxed">
            Websites, stores, mobile apps and custom software from the Kredance portfolio.
          </p>
        </motion.div>

        <div role="group" aria-label="Filter projects by service" className="mt-12 flex flex-wrap items-center justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={activeCategory === category}
              aria-controls="portfolio-projects"
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-navy ${
                activeCategory === category
                  ? "bg-neon-navy text-sunset"
                  : "text-nebulosity/70 hover:text-nebulosity hover:bg-nebulosity/5"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <p role="status" className="mt-6 text-center text-sm text-nebulosity/70">
          {filtered.length} {filtered.length === 1 ? "project" : "projects"}
          {activeCategory !== "All" && ` in ${activeCategory}`}
        </p>

        <motion.div id="portfolio-projects" layout className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, index) => (
              <motion.div
                key={project.link}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.16) }}
              >
                <Link
                  href={project.link}
                  className="group flex h-full flex-col rounded-2xl border border-neon-navy/10 p-7 transition-colors hover:border-neon-navy/30 hover:bg-sunset/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-navy"
                >
                  <span className="text-xs font-medium text-nebulosity/70 uppercase tracking-wider">
                    {project.category}
                  </span>
                  <h2 className="mt-3 text-xl font-semibold text-nebulosity group-hover:text-neon-navy transition-colors">
                    {project.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm text-nebulosity/70 leading-relaxed">{project.description}</p>
                  <span className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-neon-navy">
                    View project
                    <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
