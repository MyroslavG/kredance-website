"use client";

import { useState, useEffect, useId, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";

const services = [
  { name: "Facebook Lead Generation", href: "/services/facebook-lead-generation" },
  { name: "Google Ads", href: "/services/google-ads" },
  { name: "Website SEO", href: "/services/website-seo" },
  { name: "Ecommerce", href: "/services/ecommerce" },
  { name: "Automation", href: "/ai-automation" },
];

const navLinks = [
  { name: "Websites", href: "/services/website-development" },
  { name: "Advertising", href: "/services/advertisement-creation" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Guides", href: "/guides" },
  { name: "Contact", href: "/contact" },
];

const moreLinks = [
  { name: "All Services", href: "/services" },
  { name: "Testimonials", href: "/testimonials" },
];

const darkPages = ["/", "/contact", "/ai-automation", "/insights", "/websites-for-contractors"];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const desktopTriggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const pathname = usePathname();
  const activeLink = (href: string) => pathname === href ||
    ((href === "/guides" || href === "/portfolio") && pathname.startsWith(`${href}/`));
  const closeMobile = () => {
    setMobileOpen(false);
    setMobileServicesOpen(false);
  };

  const isDarkPage =
    darkPages.includes(pathname) ||
    (pathname.startsWith("/services/") && pathname !== "/services") ||
    (pathname.startsWith("/portfolio/") && pathname !== "/portfolio");
  const useLight = isDarkPage && !scrolled;

  const logoSrc = useLight
    ? "/white_no_bg.png"
    : "/black_no_bg.png";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!servicesOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!desktopMenuRef.current?.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [servicesOpen]);

  return (
    <motion.nav
      aria-label="Main navigation"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-sm border-black/5"
          : useLight
          ? "bg-black/20 backdrop-blur-md border-transparent"
          : "bg-white/50 backdrop-blur-md border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" aria-label="Kredance home" className="group" onClick={() => setServicesOpen(false)}>
            <img
              src={logoSrc}
              alt="Kredance"
              width={44}
              height={44}
              className="group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                active={activeLink(link.href)}
                light={useLight}
                onClick={() => setServicesOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}
            <div
              ref={desktopMenuRef}
              className="relative"
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setServicesOpen(false);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape" && servicesOpen) {
                  event.preventDefault();
                  setServicesOpen(false);
                  desktopTriggerRef.current?.focus();
                }
              }}
            >
              <button
                ref={desktopTriggerRef}
                type="button"
                aria-expanded={servicesOpen}
                aria-controls={`${menuId}-desktop`}
                onClick={() => setServicesOpen((open) => !open)}
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors rounded-full ${
                  useLight
                    ? "text-white hover:bg-white/10"
                    : "text-nebulosity/70 hover:text-nebulosity hover:bg-nebulosity/5"
                }`}
              >
                More
                <ChevronDown
                  aria-hidden="true"
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    servicesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
                <div
                  id={`${menuId}-desktop`}
                  hidden={!servicesOpen}
                  className="absolute top-full right-0 pt-2"
                >
                  <div className="w-64 max-h-[calc(100dvh-5rem)] overflow-y-auto rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl shadow-black/5 border border-black/5 p-2">
                    <div className="flex flex-col gap-0.5">
                      {[...moreLinks, ...services].map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          aria-current={pathname === link.href ? "page" : undefined}
                          onClick={() => setServicesOpen(false)}
                          className="px-3 py-2 text-sm text-nebulosity/70 hover:text-nebulosity hover:bg-neon-navy/5 rounded-lg transition-colors"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet
              open={mobileOpen}
              onOpenChange={(open) => {
                setMobileOpen(open);
                if (!open) setMobileServicesOpen(false);
              }}
            >
              <SheetTrigger
                render={<button type="button" aria-label="Open menu" className="p-2 rounded-full hover:bg-nebulosity/5 transition-colors" />}
              >
                <Menu aria-hidden="true" className={`h-5 w-5 ${useLight ? "text-white" : "text-nebulosity"}`} />
              </SheetTrigger>
              <SheetContent side="right" className="w-80 max-w-full bg-white border-l border-black/5 p-0">
                <div className="flex flex-col h-full min-h-0">
                  <div className="p-6 border-b border-black/5">
                    <SheetTitle className="sr-only">Navigation</SheetTitle>
                    <img
                      src="/black_no_bg.png"
                      alt="Kredance"
                      width={44}
                      height={44}
                    />
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="flex flex-col gap-1">
                      {navLinks.map((link) => (
                        <MobileNavLink
                          key={link.href}
                          href={link.href}
                          active={activeLink(link.href)}
                          onClick={closeMobile}
                        >
                          {link.name}
                        </MobileNavLink>
                      ))}

                      <div>
                        <button
                          type="button"
                          aria-expanded={mobileServicesOpen}
                          aria-controls={`${menuId}-mobile`}
                          onClick={() => setMobileServicesOpen((open) => !open)}
                          className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-xl text-nebulosity/70 hover:text-nebulosity hover:bg-nebulosity/5 transition-colors"
                        >
                          More
                          <ChevronDown
                            aria-hidden="true"
                            className={`h-4 w-4 transition-transform duration-200 ${
                              mobileServicesOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {mobileServicesOpen && (
                          <motion.div
                            id={`${menuId}-mobile`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 flex flex-col gap-0.5">
                              {[...moreLinks, ...services].map((link) => (
                                <MobileNavLink
                                  key={link.href}
                                  href={link.href}
                                  active={pathname === link.href}
                                  onClick={closeMobile}
                                >
                                  {link.name}
                                </MobileNavLink>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-black/5">
                    <Link
                      href="/contact"
                      onClick={closeMobile}
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
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  active: boolean;
  light: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`whitespace-nowrap px-3 py-2 text-sm font-medium transition-colors rounded-full ${
        active
          ? light
            ? "bg-white/20 text-white"
            : "bg-neon-navy text-sunset"
          : light
          ? "text-white hover:bg-white/10"
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
      aria-current={active ? "page" : undefined}
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
