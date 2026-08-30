"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Robert Ward",
    role: "Sales Director, eBoss Recruitment Software Solutions",
    content:
      "Working with Myro was excellent from start to finish. He quickly understood our requirements, adapted to challenges, and delivered high-quality solutions. Clear communication, attention to detail, and a collaborative approach made the entire project seamless.",
    rating: 5,
  },
  {
    name: "Oleksa Voznyak",
    role: "Founder, CBTO Software Solutions",
    content:
      "Kredance played a key role in developing our mobile platform. Their React Native expertise allowed us to create a dynamic, user-friendly app that was both robust and scalable.",
    rating: 5,
  },
  {
    name: "Emmanuel Akintayo",
    role: "Founder, ByteRoll",
    content:
      "Kredance is an exceptional AI integration expert. Their work on our AI-powered tools was revolutionary — combining AI knowledge with cloud integration (AWS and GCP) to give us a significant edge in the market.",
    rating: 5,
  },
  {
    name: "Nazar Simkiv",
    role: "Founder, SymfonyLab",
    content:
      "Working with Kredance has been transformative. From seamless full-stack development to efficiently managing cloud services, they handled every task with precision and elevated our application performance.",
    rating: 5,
  },
  {
    name: "Matthew Garwolinski",
    role: "Founder, Dzikus Media",
    content:
      "Myroslav sat down with me for hours to understand my vision and brought it to life. He checked in throughout the process to ensure it matched my ideas. The result was better than I could ever imagine.",
    rating: 5,
  },
  {
    name: "Tamara Osadcha",
    role: "Founder, Tamar Film",
    content:
      "Myroslav has been incredibly helpful — always performing his work quickly and attentively. He assisted me with tasks I had struggled with for a long time. Respectful, patient, and highly skilled.",
    rating: 5,
  },
  {
    name: "Danna Ramirez",
    role: "Founder, Eleve Design",
    content:
      "Myroslav took the time to understand my vision, stayed in constant communication, and delivered a modern, high-quality website that exceeded my expectations. Outstanding customer service and technical expertise.",
    rating: 5,
  },
  {
    name: "Mykyta Zakharchenko",
    role: "Co-Founder, The Wow Camp",
    content:
      "Myroslav didn't just build pages — he deeply understood the business behind the website. He translated complex ideas into a clean, intuitive, and high-converting user experience. The site looks beautiful and works brilliantly.",
    rating: 5,
  },
  {
    name: "Olena Gulyansky",
    role: "Founder, Beauty Stories",
    content:
      "Kredance delivered a fast and well-structured Shopify setup. Clear communication made the whole process simple and stress-free.",
    rating: 5,
  },
  {
    name: "Ian Zhang",
    role: "Co-Founder, AUX",
    content:
      "The Aux app came together faster than expected, and the whole process was super straightforward. Great experience from start to launch.",
    rating: 5,
  },
  {
    name: "Hezekiah Francois",
    role: "Founder, Neon Vibez",
    content:
      "The new site gave our brand a real upgrade. It's visually strong, easy to navigate, and makes a great first impression.",
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
          <h1 className="mt-4 text-4xl lg:text-5xl font-bold tracking-tight text-nebulosity leading-[1.15]">
            Trusted by <span className="text-neon-navy">Ambitious</span> Teams
          </h1>
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
