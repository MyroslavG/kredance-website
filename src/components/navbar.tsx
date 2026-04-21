"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";

const services = [
  { name: "Advertisement Creation", href: "/services" },
  { name: "AI Automation", href: "/services" },
  { name: "AI Integration", href: "/services" },
  { name: "Cybersecurity Services", href: "/services" },
  { name: "Data Migration", href: "/services" },
  { name: "Data Mining & Scraping", href: "/services" },
  { name: "Design", href: "/services" },
  { name: "Ecommerce Shop Development", href: "/services" },
  { name: "Google Ads Specialist", href: "/services" },
  { name: "Mobile App Development", href: "/services" },
  { name: "News", href: "/services" },
  { name: "Small Business IT Package", href: "/services" },
  { name: "Universal Plugin Solutions", href: "/services" },
  { name: "Website Development", href: "/services" },
  { name: "Website SEO", href: "/services" },
];

const navLinks = [
  { name: "About", href: "/about" },
  { name: "AI Automation", href: "/ai-automation" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Testimonials", href: "/testimonials" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const pathname = usePathname();

  const darkPages = ["/contact", "/ai-automation"];
  const isDarkPage = darkPages.includes(pathname);
  const useLightText = isDarkPage && !scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-sm border-black/5"
          : "bg-transparent border-transparent shadow-none backdrop-blur-0"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative h-8 w-8 rounded-lg bg-neon-navy flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
              <span className="text-sm font-bold text-sunset tracking-tight">K</span>
            </div>
            <span
              className={`text-lg font-semibold tracking-tight transition-colors ${
                useLightText ? "text-sunset" : "text-nebulosity"
              }`}
            >
              Kredance
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            <NavLink href="/about" active={pathname === "/about"} light={useLightText}>
              About
            </NavLink>
            <NavLink href="/ai-automation" active={pathname === "/ai-automation"} light={useLightText}>
              AI Automation
            </NavLink>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <Link
                href="/services"
                className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors rounded-full ${
                  pathname === "/services"
                    ? useLightText
                      ? "bg-sunset text-neon-navy"
                      : "bg-neon-navy text-sunset"
                    : useLightText
                    ? "text-sunset/70 hover:text-sunset hover:bg-white/10"
                    : "text-nebulosity/70 hover:text-nebulosity hover:bg-nebulosity/5"
                }`}
              >
                Services
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    servicesOpen ? "rotate-180" : ""
                  }`}
                />
              </Link>
              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-2"
                  >
                    <div className="w-[520px] rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl shadow-black/5 border border-black/5 p-4 grid grid-cols-2 gap-1">
                      {services.map((service) => (
                        <Link
                          key={service.name}
                          href={service.href}
                          className="px-3 py-2 text-sm text-nebulosity/70 hover:text-nebulosity hover:bg-neon-navy/5 rounded-lg transition-all"
                        >
                          {service.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink href="/portfolio" active={pathname === "/portfolio"} light={useLightText}>
              Portfolio
            </NavLink>
            <NavLink href="/testimonials" active={pathname === "/testimonials"} light={useLightText}>
              Testimonials
            </NavLink>
            <NavLink href="/contact" active={pathname === "/contact"} light={useLightText}>
              Contact
            </NavLink>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={<button className="p-2 rounded-full hover:bg-nebulosity/5 transition-colors" />}
              >
                <Menu className={`h-5 w-5 ${useLightText ? "text-sunset" : "text-nebulosity"}`} />
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white border-l border-black/5 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b border-black/5">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-neon-navy flex items-center justify-center">
                        <span className="text-sm font-bold text-sunset">K</span>
                      </div>
                      <span className="text-lg font-semibold text-nebulosity">Kredance</span>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="flex flex-col gap-1">
                      {navLinks.slice(0, 2).map((link) => (
                        <MobileNavLink
                          key={link.name}
                          href={link.href}
                          active={pathname === link.href}
                          onClick={() => setMobileOpen(false)}
                        >
                          {link.name}
                        </MobileNavLink>
                      ))}

                      {/* Mobile Services Accordion */}
                      <div>
                        <button
                          onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                          className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                            pathname === "/services"
                              ? "text-nebulosity bg-nebulosity/5"
                              : "text-nebulosity/70 hover:text-nebulosity hover:bg-nebulosity/5"
                          }`}
                        >
                          <Link
                            href="/services"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMobileOpen(false);
                            }}
                          >
                            Services
                          </Link>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                              mobileServicesOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {mobileServicesOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 flex flex-col gap-0.5">
                                {services.map((service) => (
                                  <Link
                                    key={service.name}
                                    href={service.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="px-4 py-2 text-sm text-nebulosity/60 hover:text-nebulosity hover:bg-neon-navy/5 rounded-lg transition-colors"
                                  >
                                    {service.name}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {navLinks.slice(2).map((link) => (
                        <MobileNavLink
                          key={link.name}
                          href={link.href}
                          active={pathname === link.href}
                          onClick={() => setMobileOpen(false)}
                        >
                          {link.name}
                        </MobileNavLink>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 border-t border-black/5">
                    <Link
                      href="/contact"
                      onClick={() => setMobileOpen(false)}
                      className="block w-full text-center px-5 py-3 text-sm font-medium bg-neon-navy text-sunset rounded-full hover:bg-neon-navy/90 transition-colors"
                    >
                      Get in Touch
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

function NavLink({
  href,
  children,
  active,
  light,
}: {
  href: string;
  children: React.ReactNode;
  active: boolean;
  light: boolean;
}) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 text-sm font-medium transition-colors rounded-full ${
        active
          ? light
            ? "bg-sunset text-neon-navy"
            : "bg-neon-navy text-sunset"
          : light
          ? "text-sunset/70 hover:text-sunset hover:bg-white/10"
          : "text-nebulosity/70 hover:text-nebulosity hover:bg-nebulosity/5"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  active,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
        active
          ? "text-nebulosity bg-nebulosity/5"
          : "text-nebulosity/70 hover:text-nebulosity hover:bg-nebulosity/5"
      }`}
    >
      {children}
    </Link>
  );
}
