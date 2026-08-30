"use client";

import { motion } from "framer-motion";
import { Target, Lightbulb, Users, Zap } from "lucide-react";

const values = [
  {
    icon: Zap,
    title: "Innovation First",
    description:
      "We leverage cutting-edge AI and automation to deliver solutions that keep you ahead of the curve.",
  },
  {
    icon: Target,
    title: "Results Driven",
    description:
      "Every project is measured by real business outcomes - more traffic, higher conversions, better efficiency.",
  },
  {
    icon: Users,
    title: "Client Partnership",
    description:
      "We work as an extension of your team, understanding your vision and translating it into digital reality.",
  },
  {
    icon: Lightbulb,
    title: "Smart Solutions",
    description:
      "From strategy to execution, we craft intelligent solutions tailored to your unique business needs.",
  },
];

export function About() {
  return (
    <section className="pt-32 pb-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-xs font-medium tracking-widest uppercase text-astro-grey">
              About Us
            </span>
            <h1 className="mt-4 text-4xl lg:text-5xl font-bold tracking-tight text-nebulosity leading-[1.15]">
              Your Digital Growth
              <br />
              <span className="text-neon-navy">Partner</span>
            </h1>
            <p className="mt-6 text-lg text-wild-dove leading-relaxed">
              Kredance is a full-service digital agency specializing in AI automation,
              custom web development, SEO, eCommerce, and digital marketing. We combine
              technical expertise with creative strategy to help businesses thrive in
              the digital landscape.
            </p>
            <p className="mt-4 text-lg text-wild-dove leading-relaxed">
              Our team of experts brings together decades of experience in software
              engineering, data science, design, and marketing to deliver solutions that
              are not just beautiful but measurably effective.
            </p>
          </motion.div>

          {/* Right column - values */}
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group p-6 rounded-2xl bg-sunset/50 hover:bg-neon-navy transition-all duration-500 cursor-default"
              >
                <div className="h-10 w-10 rounded-xl bg-neon-navy/10 group-hover:bg-sunset/20 flex items-center justify-center transition-colors duration-500">
                  <value.icon className="h-5 w-5 text-neon-navy group-hover:text-sunset transition-colors duration-500" />
                </div>
                <h3 className="mt-4 font-semibold text-nebulosity group-hover:text-sunset transition-colors duration-500">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm text-wild-dove group-hover:text-sunset/70 leading-relaxed transition-colors duration-500">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
