"use client";

import { useRef, useState, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle,
  GraduationCap,
  Lightbulb,
  Loader2,
  Mail,
  Newspaper,
  Workflow,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
const EMAILJS_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_INSIGHTS_TEMPLATE_ID || "template_c7mv3gp";
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

type Status = "idle" | "sending" | "sent" | "error";

const focusAreas = [
  {
    icon: GraduationCap,
    title: "Practical AI Workshops",
    description:
      "Hands-on sessions that show teams how to use AI tools, prompts, automations, and integrations in real business workflows.",
  },
  {
    icon: Workflow,
    title: "Automation Playbooks",
    description:
      "Clear examples of how to remove repetitive work from operations, sales, marketing, reporting, and support processes.",
  },
  {
    icon: Newspaper,
    title: "News That Matters",
    description:
      "Short updates on AI, software, and digital platforms with context on what is useful for growing businesses.",
  },
];

const learningTracks = [
  "AI basics for founders and operators",
  "Workflow automation with low-code and custom tools",
  "Chatbots, agents, and customer support systems",
  "Marketing automation and content operations",
  "Data cleanup, reporting, and decision support",
  "Safe adoption, team training, and AI policy",
];

export function Insights() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!formRef.current) return;

    setStatus("sending");
    try {
      const formData = new FormData(formRef.current);
      const fromName = String(formData.get("from_name") || "").trim();
      const fromEmail = String(formData.get("from_email") || "").trim();
      const interest = String(formData.get("interest") || "AI workshops");
      const note = String(formData.get("message") || "").trim();
      const subject = "New Insights signup";
      const message = note || "No additional note provided.";

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          subject,
          title: subject,
          from_name: fromName,
          name: fromName,
          from_email: fromEmail,
          email: fromEmail,
          reply_to: fromEmail,
          interest,
          source_page: "Insights",
          consent: "Yes, subscribed to Kredance AI and workshop emails.",
          message,
          note,
        },
        EMAILJS_PUBLIC_KEY,
      );
      setStatus("sent");
      formRef.current.reset();
    } catch (error) {
      console.error("EmailJS insights signup failed", error);
      setStatus("error");
    }
  }

  return (
    <>
      <section className="relative overflow-hidden bg-nebulosity pt-32 pb-20 lg:pb-24">
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.86fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-xs font-medium uppercase tracking-widest text-astro-grey">
                Insights
              </span>
              <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                AI insights, workshops, and automation know-how
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-sunset/55">
                A Kredance knowledge hub for business owners and teams who want
                to understand what AI can actually do, which automations are
                worth building, and how to adopt new tools without wasting time.
                Coding has never been easier to learn, realize, and use to make
                ideas happen in a short period of time.
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#signup"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-sunset px-8 py-3.5 text-sm font-medium text-neon-navy transition-all hover:bg-white"
                >
                  Join the List
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <Link
                  href="/services/ai-automation"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-8 py-3.5 text-sm font-medium text-white/65 transition-all hover:bg-white/5 hover:text-white"
                >
                  Explore AI Automation
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="aspect-[4/3] w-full object-cover opacity-85"
              >
                <source src="/hero_video.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-nebulosity/45" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-sunset/80 backdrop-blur-md">
                  <Calendar className="h-3.5 w-3.5" />
                  Workshops and updates
                </div>
                <p className="mt-4 max-w-sm text-xl font-semibold leading-snug text-white">
                  Learn what to automate first, what to ignore, and how to turn
                  AI into daily leverage.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="text-xs font-medium uppercase tracking-widest text-astro-grey">
              What We Share
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-neon-navy sm:text-4xl">
              Useful signal for teams exploring AI
            </h2>
            <p className="mt-5 text-base leading-relaxed text-wild-dove">
              The goal is simple: share practical knowledge that helps people
              make better decisions about AI, automation, software, and digital
              operations.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {focusAreas.map((area, i) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.45,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="rounded-2xl border border-black/5 bg-sunset/35 p-6 transition-all hover:border-neon-navy/15 hover:bg-sunset/55"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neon-navy">
                  <area.icon className="h-5 w-5 text-sunset" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-nebulosity">
                  {area.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-wild-dove">
                  {area.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sunset/30 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1fr] lg:items-start">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-xs font-medium uppercase tracking-widest text-astro-grey">
                Workshops
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-neon-navy sm:text-4xl">
                Built for people who want to use AI at work
              </h2>
              <p className="mt-5 text-base leading-relaxed text-wild-dove">
                Sessions can be shaped for founders, internal teams, sales and
                marketing groups, operations teams, or leaders who need a clear
                map before investing in automation.
              </p>
              <p className="mt-4 text-base leading-relaxed text-wild-dove">
                We also show how modern AI tools can make coding more
                approachable, so people can move from a rough idea to a working
                prototype faster than ever before.
              </p>
              <div className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm text-nebulosity shadow-sm shadow-black/5">
                <Lightbulb className="h-5 w-5 text-neon-navy" />
                <span>
                  Bring one messy process. Leave with a practical automation
                  plan.
                </span>
              </div>
            </motion.div>

            <div className="grid gap-3 sm:grid-cols-2">
              {learningTracks.map((track, i) => (
                <motion.div
                  key={track}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex min-h-24 items-start gap-3 rounded-2xl bg-white p-5 shadow-sm shadow-black/5"
                >
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-neon-navy/70" />
                  <p className="text-sm font-medium leading-relaxed text-nebulosity">
                    {track}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="signup" className="scroll-mt-24 bg-nebulosity py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.84fr_1fr] lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <Mail className="h-6 w-6 text-sunset" />
              </div>
              <span className="mt-7 block text-xs font-medium uppercase tracking-widest text-astro-grey">
                Stay in the loop
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Get workshop invites and AI automation notes
              </h2>
              <p className="mt-5 text-base leading-relaxed text-sunset/50">
                Leave your email and we&apos;ll send practical AI tips, new
                workshop dates, and occasional examples of automations that are
                actually worth building.
              </p>
            </motion.div>

            <motion.form
              ref={formRef}
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-sm sm:p-8"
            >
              <input type="hidden" name="subject" value="New Insights signup" />
              <input type="hidden" name="source_page" value="Insights" />

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-sunset/60">
                    Name
                  </label>
                  <Input
                    name="from_name"
                    required
                    placeholder="Your name"
                    className="h-11 rounded-xl border-white/10 bg-white/5 text-sunset placeholder:text-sunset/30 focus:border-sunset/30"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-sunset/60">
                    Email
                  </label>
                  <Input
                    name="from_email"
                    type="email"
                    required
                    placeholder="you@company.com"
                    className="h-11 rounded-xl border-white/10 bg-white/5 text-sunset placeholder:text-sunset/30 focus:border-sunset/30"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm text-sunset/60">
                  Main interest
                </label>
                <select
                  name="interest"
                  defaultValue="AI workshops"
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-sunset outline-none transition-colors focus:border-sunset/30 focus:ring-3 focus:ring-sunset/20"
                >
                  <option className="text-nebulosity">AI workshops</option>
                  <option className="text-nebulosity">Automation ideas</option>
                  <option className="text-nebulosity">AI news and tools</option>
                  <option className="text-nebulosity">Team training</option>
                </select>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm text-sunset/60">
                  What would you like to learn?
                </label>
                <Textarea
                  name="message"
                  rows={4}
                  placeholder="Tell us what you want to automate or learn next."
                  className="rounded-xl border-white/10 bg-white/5 text-sunset placeholder:text-sunset/30 focus:border-sunset/30"
                />
              </div>

              <label className="mt-5 flex items-start gap-3 text-sm leading-relaxed text-sunset/50">
                <input
                  type="checkbox"
                  name="consent"
                  value="yes"
                  required
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 accent-sunset"
                />
                <span>
                  I agree to receive Kredance emails about AI, automation,
                  workshops, and related services.
                </span>
              </label>

              <button
                type="submit"
                disabled={status === "sending"}
                className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sunset px-8 py-3.5 text-sm font-medium text-neon-navy transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "sending" ? (
                  <>
                    Joining...
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Join the Insights List
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              {status === "sent" && (
                <div className="mt-4 flex items-center gap-2 text-sm text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  You&apos;re on the list. We&apos;ll be in touch soon.
                </div>
              )}
              {status === "error" && (
                <div className="mt-4 flex items-center gap-2 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  Something went wrong. Please try again or email us directly.
                </div>
              )}

              <p className="mt-5 text-xs leading-relaxed text-sunset/35">
                You can unsubscribe anytime. For details, review our{" "}
                <Link href="/privacy" className="text-sunset/60 hover:text-sunset">
                  Privacy Policy
                </Link>
                .
              </p>
            </motion.form>
          </div>
        </div>
      </section>

      <section className="bg-white py-18 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-neon-navy p-8 sm:p-10 lg:flex-row lg:items-center">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-sunset/60">
                <BookOpen className="h-4 w-4" />
                AI and automation knowledge sharing
              </div>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Want a private workshop for your team?
              </h2>
            </div>
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-sunset px-8 py-3.5 text-sm font-medium text-neon-navy transition-all hover:bg-white"
            >
              Talk to Kredance
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
