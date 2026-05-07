"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Mail,
  Server,
  Monitor,
  Headphones,
  Check,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface ServiceOption {
  id: string;
  label: string;
  icon: typeof Globe;
  tiers: Tier[];
}

interface Tier {
  id: string;
  label: string;
  monthly: number;
  oneTime: number;
}

const SERVICES: ServiceOption[] = [
  {
    id: "domain",
    label: "Domain Name",
    icon: Globe,
    tiers: [{ id: "domain-standard", label: "Custom Domain", monthly: 12, oneTime: 0 }],
  },
  {
    id: "email",
    label: "Business Email",
    icon: Mail,
    tiers: [
      { id: "email-5", label: "5 Inboxes", monthly: 30, oneTime: 0 },
      { id: "email-10", label: "10 Inboxes", monthly: 60, oneTime: 0 },
      { id: "email-25", label: "25 Inboxes", monthly: 150, oneTime: 0 },
    ],
  },
  {
    id: "hosting",
    label: "Web Hosting",
    icon: Server,
    tiers: [
      { id: "hosting-basic", label: "Basic", monthly: 15, oneTime: 0 },
      { id: "hosting-pro", label: "Pro", monthly: 39, oneTime: 0 },
    ],
  },
  {
    id: "website",
    label: "Website Design",
    icon: Monitor,
    tiers: [
      { id: "website-1", label: "1-Page Site", monthly: 0, oneTime: 299 },
      { id: "website-5", label: "5-Page Site", monthly: 0, oneTime: 799 },
    ],
  },
  {
    id: "support",
    label: "IT Support",
    icon: Headphones,
    tiers: [
      { id: "support-email", label: "Email Support", monthly: 49, oneTime: 0 },
      { id: "support-priority", label: "Priority Support", monthly: 149, oneTime: 0 },
    ],
  },
];

interface Selection {
  serviceId: string;
  tierId: string;
}

export function SmallBusinessDemo() {
  const [selections, setSelections] = useState<Selection[]>([]);

  const toggleService = (serviceId: string, tierId: string) => {
    setSelections((prev) => {
      const existing = prev.find((s) => s.serviceId === serviceId);
      if (existing && existing.tierId === tierId) {
        // Deselect
        return prev.filter((s) => s.serviceId !== serviceId);
      }
      if (existing) {
        // Switch tier
        return prev.map((s) =>
          s.serviceId === serviceId ? { serviceId, tierId } : s
        );
      }
      // Add new
      return [...prev, { serviceId, tierId }];
    });
  };

  const isSelected = (serviceId: string, tierId: string) =>
    selections.some((s) => s.serviceId === serviceId && s.tierId === tierId);

  const isServiceActive = (serviceId: string) =>
    selections.some((s) => s.serviceId === serviceId);

  const totalMonthly = selections.reduce((sum, sel) => {
    const service = SERVICES.find((s) => s.id === sel.serviceId);
    const tier = service?.tiers.find((t) => t.id === sel.tierId);
    return sum + (tier?.monthly ?? 0);
  }, 0);

  const totalOneTime = selections.reduce((sum, sel) => {
    const service = SERVICES.find((s) => s.id === sel.serviceId);
    const tier = service?.tiers.find((t) => t.id === sel.tierId);
    return sum + (tier?.oneTime ?? 0);
  }, 0);

  const selectedItems = selections.map((sel) => {
    const service = SERVICES.find((s) => s.id === sel.serviceId)!;
    const tier = service.tiers.find((t) => t.id === sel.tierId)!;
    return { service, tier };
  });

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-sm font-medium tracking-widest uppercase text-astro-grey mb-3">
            Interactive Demo
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-neon-navy">
            Build Your IT Package
          </h3>
          <p className="mt-3 text-wild-dove max-w-lg mx-auto">
            Toggle services on and off to see your estimated monthly cost in real time
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-8">
          {/* Left - Service Options */}
          <div className="space-y-4">
            {SERVICES.map((service) => {
              const Icon = service.icon;
              const active = isServiceActive(service.id);
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-xl border p-4 sm:p-5 transition-all ${
                    active
                      ? "border-neon-navy/30 bg-neon-navy/[0.02] shadow-sm"
                      : "border-black/10 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${
                        active ? "bg-neon-navy/10" : "bg-sunset/40"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          active ? "text-neon-navy" : "text-astro-grey"
                        }`}
                      />
                    </div>
                    <span className="text-sm font-semibold text-nebulosity">
                      {service.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {service.tiers.map((tier) => {
                      const selected = isSelected(service.id, tier.id);
                      return (
                        <button
                          key={tier.id}
                          onClick={() => toggleService(service.id, tier.id)}
                          className={`relative px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                            selected
                              ? "border-neon-navy bg-neon-navy text-white shadow-sm"
                              : "border-black/10 bg-white text-wild-dove hover:border-neon-navy/30 hover:text-neon-navy"
                          }`}
                        >
                          <span>{tier.label}</span>
                          <span className="ml-2 opacity-70">
                            {tier.monthly > 0
                              ? `$${tier.monthly}/mo`
                              : `$${tier.oneTime}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right - Summary & Price */}
          <div className="lg:sticky lg:top-8 self-start">
            <div className="rounded-2xl border border-black/10 bg-sunset/20 p-6 space-y-5">
              <h4 className="text-sm font-semibold text-neon-navy uppercase tracking-wider">
                Your Package
              </h4>

              {/* Checklist */}
              <div className="min-h-[140px]">
                <AnimatePresence mode="popLayout">
                  {selectedItems.length === 0 ? (
                    <motion.p
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-wild-dove"
                    >
                      Select services on the left to build your package
                    </motion.p>
                  ) : (
                    selectedItems.map(({ service, tier }) => (
                      <motion.div
                        key={tier.id}
                        initial={{ opacity: 0, x: -10, height: 0 }}
                        animate={{ opacity: 1, x: 0, height: "auto" }}
                        exit={{ opacity: 0, x: 10, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex items-center gap-2.5 py-1.5"
                      >
                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-neon-navy/10">
                          <Check className="h-3 w-3 text-neon-navy" />
                        </div>
                        <span className="text-sm text-nebulosity font-medium">
                          {service.label}
                        </span>
                        <span className="text-xs text-wild-dove ml-auto">
                          {tier.label}
                        </span>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Pricing */}
              <div className="border-t border-black/10 pt-4 space-y-3">
                <div className="flex items-end justify-between">
                  <span className="text-xs text-astro-grey uppercase tracking-wider">
                    Monthly Estimate
                  </span>
                  <motion.span
                    key={totalMonthly}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold text-neon-navy"
                  >
                    ${totalMonthly}
                    <span className="text-sm font-normal text-wild-dove">
                      /mo
                    </span>
                  </motion.span>
                </div>
                {totalOneTime > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-end justify-between"
                  >
                    <span className="text-xs text-astro-grey uppercase tracking-wider">
                      One-Time Setup
                    </span>
                    <motion.span
                      key={totalOneTime}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-lg font-bold text-nebulosity"
                    >
                      ${totalOneTime}
                    </motion.span>
                  </motion.div>
                )}
              </div>

              {/* CTA */}
              <AnimatePresence>
                {selections.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                  >
                    <Link
                      href="/contact"
                      className="group flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-neon-navy text-white font-medium rounded-full hover:bg-nebulosity transition-all"
                    >
                      Get My Package
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
