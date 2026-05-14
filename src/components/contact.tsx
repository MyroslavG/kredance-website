"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, ArrowRight, CheckCircle, AlertCircle, Loader2, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

type Status = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!formRef.current) return;

    setStatus("sending");
    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY,
      );
      setStatus("sent");
      formRef.current.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
    {/* Calendly Booking Section */}
    <section className="pt-32 pb-24 bg-nebulosity relative overflow-hidden">
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-sunset/60" />
            <span className="text-xs font-medium tracking-widest uppercase text-astro-grey">
              Book a Call
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-sunset">
            Schedule a Free Consultation
          </h2>
          <p className="mt-4 text-lg text-sunset/50 max-w-2xl mx-auto">
            Prefer to talk it through? Book a 30-minute call and let&apos;s discuss your project.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl overflow-hidden border border-white/5"
        >
          <CalendlyEmbed />
        </motion.div>
      </div>
    </section>

    {/* Contact Form Section */}
    <section className="pb-24 bg-nebulosity relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-neon-navy/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-inferno/10 rounded-full blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-xs font-medium tracking-widest uppercase text-astro-grey">
              Contact
            </span>
            <h2 className="mt-4 text-4xl lg:text-5xl font-bold tracking-tight text-sunset leading-[1.15]">
              Let&apos;s Build Something
              <br />
              <span className="text-astro-grey">Great Together</span>
            </h2>
            <p className="mt-6 text-lg text-sunset/50 leading-relaxed">
              Ready to transform your digital presence? Tell us about your project
              and we&apos;ll get back to you within 24 hours.
            </p>

            <div className="mt-12 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-white/5 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-sunset/60" />
                </div>
                <div>
                  <div className="text-sm text-sunset/40">Email</div>
                  <div className="text-sunset font-medium">myroslav@kredance.com</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-white/5 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-sunset/60" />
                </div>
                <div>
                  <div className="text-sm text-sunset/40">Phone</div>
                  <div className="text-sunset font-medium">+1 (438) 497-3894</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-white/5 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-sunset/60" />
                </div>
                <div>
                  <div className="text-sm text-sunset/40">Location</div>
                  <div className="text-sunset font-medium">Ottawa, ON</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-5 p-8 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-sunset/60 mb-2">Name</label>
                  <Input
                    name="from_name"
                    required
                    placeholder="Your name"
                    className="bg-white/5 border-white/10 text-sunset placeholder:text-sunset/30 focus:border-sunset/30 rounded-xl h-11"
                  />
                </div>
                <div>
                  <label className="block text-sm text-sunset/60 mb-2">Email</label>
                  <Input
                    name="from_email"
                    type="email"
                    required
                    placeholder="you@company.com"
                    className="bg-white/5 border-white/10 text-sunset placeholder:text-sunset/30 focus:border-sunset/30 rounded-xl h-11"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-sunset/60 mb-2">Subject</label>
                <Input
                  name="subject"
                  required
                  placeholder="Project inquiry"
                  className="bg-white/5 border-white/10 text-sunset placeholder:text-sunset/30 focus:border-sunset/30 rounded-xl h-11"
                />
              </div>
              <div>
                <label className="block text-sm text-sunset/60 mb-2">Message</label>
                <Textarea
                  name="message"
                  required
                  placeholder="Tell us about your project..."
                  rows={5}
                  className="bg-white/5 border-white/10 text-sunset placeholder:text-sunset/30 focus:border-sunset/30 rounded-xl resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="group w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-sunset text-neon-navy font-medium rounded-full hover:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "sending" ? (
                  <>
                    Sending...
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Send Message
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {status === "sent" && (
                <div className="flex items-center gap-2 text-sm text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  Message sent! We&apos;ll get back to you soon.
                </div>
              )}
              {status === "error" && (
                <div className="flex items-center gap-2 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  Something went wrong. Please try again or email us directly.
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
    </>
  );
}

function CalendlyEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="calendly-inline-widget"
      data-url="https://calendly.com/kredance/30min"
      style={{ minWidth: "320px", height: "700px" }}
    />
  );
}
