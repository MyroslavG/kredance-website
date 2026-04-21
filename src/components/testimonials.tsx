"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "CEO, TechVentures",
    content:
      "Kredance transformed our entire digital presence. Their AI automation solutions cut our operational costs by 60% and their website redesign increased conversions significantly.",
    rating: 5,
  },
  {
    name: "James Rodriguez",
    role: "Founder, ShopNova",
    content:
      "The ecommerce platform they built handles thousands of daily transactions seamlessly. Their attention to detail and understanding of UX is outstanding.",
    rating: 5,
  },
  {
    name: "Emily Chen",
    role: "Marketing Director, Pulse Media",
    content:
      "Their SEO and Google Ads expertise doubled our organic traffic in just 4 months. The team is responsive, data-driven, and genuinely invested in our success.",
    rating: 5,
  },
  {
    name: "David Okonkwo",
    role: "CTO, FinEdge",
    content:
      "The AI integration Kredance built into our platform was a game-changer. Their technical depth and ability to deliver on complex requirements is unmatched.",
    rating: 5,
  },
];

export function Testimonials() {
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
          <span className="text-xs font-medium tracking-widest uppercase text-astro-grey">
            Testimonials
          </span>
          <h2 className="mt-4 text-4xl lg:text-5xl font-bold tracking-tight text-nebulosity leading-[1.15]">
            Trusted by <span className="text-neon-navy">Ambitious</span> Teams
          </h2>
          <p className="mt-6 text-lg text-wild-dove leading-relaxed">
            Don&apos;t just take our word for it &mdash; here&apos;s what our clients have to say.
          </p>
        </motion.div>

        <div className="mt-20 grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="p-8 rounded-2xl bg-sunset/40 border border-sunset hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="h-4 w-4 fill-neon-navy text-neon-navy"
                  />
                ))}
              </div>
              <p className="mt-4 text-nebulosity/80 leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-neon-navy flex items-center justify-center">
                  <span className="text-sm font-semibold text-sunset">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-nebulosity">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-wild-dove">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
