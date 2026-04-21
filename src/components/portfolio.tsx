"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "AI-Powered E-commerce Platform",
    category: "Ecommerce / AI",
    description:
      "Built a full-scale ecommerce platform with AI-driven product recommendations and automated inventory management.",
    gradient: "from-neon-navy to-neon-navy/80",
  },
  {
    title: "Healthcare Data Dashboard",
    category: "Data Analytics / Design",
    description:
      "Designed and developed a real-time analytics dashboard for healthcare providers with predictive patient insights.",
    gradient: "from-astro-grey to-astro-grey/80",
  },
  {
    title: "Fintech Mobile Application",
    category: "Mobile App / AI",
    description:
      "Cross-platform mobile banking app with AI fraud detection and personalized financial advice.",
    gradient: "from-red-inferno to-red-inferno/80",
  },
  {
    title: "SaaS Marketing Automation",
    category: "AI Automation / SEO",
    description:
      "End-to-end marketing automation platform that increased client conversion rates by 340%.",
    gradient: "from-nebulosity to-nebulosity/80",
  },
  {
    title: "Cybersecurity Operations Center",
    category: "Cybersecurity / AI",
    description:
      "AI-powered threat detection and response system monitoring millions of events in real-time.",
    gradient: "from-neon-navy to-astro-grey",
  },
  {
    title: "Multi-vendor Marketplace",
    category: "Ecommerce / Website",
    description:
      "Scalable multi-vendor marketplace with integrated payments, logistics, and seller analytics.",
    gradient: "from-astro-grey to-wild-dove",
  },
];

export function Portfolio() {
  return (
    <section className="pt-32 pb-24 bg-sunset/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="text-xs font-medium tracking-widest uppercase text-astro-grey">
            Portfolio
          </span>
          <h2 className="mt-4 text-4xl lg:text-5xl font-bold tracking-tight text-nebulosity leading-[1.15]">
            Featured <span className="text-neon-navy">Work</span>
          </h2>
          <p className="mt-6 text-lg text-wild-dove leading-relaxed">
            A selection of projects where we&apos;ve delivered measurable results for our clients.
          </p>
        </motion.div>

        <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: (i % 3) * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group cursor-pointer"
            >
              <div
                className={`relative h-52 rounded-2xl bg-gradient-to-br ${project.gradient} overflow-hidden`}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity duration-300">
                  <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <ExternalLink className="h-5 w-5 text-white" />
                  </div>
                </div>
                {/* Abstract pattern */}
                <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-white/5" />
                <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-white/5" />
              </div>
              <div className="mt-4">
                <span className="text-xs font-medium text-astro-grey uppercase tracking-wider">
                  {project.category}
                </span>
                <h3 className="mt-1 font-semibold text-nebulosity group-hover:text-neon-navy transition-colors">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm text-wild-dove leading-relaxed">
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
