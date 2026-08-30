"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const categories = ["All", "Website", "Ecommerce", "Mobile App", "AI / Plugins", "Integration", "Design", "Cybersecurity", "Data Mining"];

const projects = [
  {
    title: "CFMoto Kyiv",
    category: "Website",
    description:
      "Accelerated the digital presence of CFMoto Kyiv with a high-performance website and digital strategy.",
    image: "https://www.kredance.com/wp-content/uploads/2026/02/cfmoto-495x400.jpg",
    link: "/portfolio/cfmoto-kyiv",
    gradient: "from-neon-navy to-neon-navy/80",
  },
  {
    title: "DzvinSki",
    category: "Website",
    description:
      "Accelerated the digital presence of DzvinSki through modern web design and brand positioning.",
    image: "https://www.kredance.com/wp-content/uploads/2026/01/bereg-495x400.png",
    link: "/portfolio/dzvinski",
    gradient: "from-astro-grey to-astro-grey/80",
  },
  {
    title: "Neon Vibez Website",
    category: "Website",
    description:
      "Designed and developed a visually striking website for the Neon Vibez brand.",
    image: "https://www.kredance.com/wp-content/uploads/2026/01/Neon-Vibez-Logo-411x400.png",
    link: "/portfolio/neon-vibez",
    gradient: "from-red-inferno to-red-inferno/80",
  },
  {
    title: "AUX Mobile App",
    category: "Mobile App",
    description:
      "Built a cross-platform mobile application delivering a seamless user experience for AUX.",
    image: "https://www.kredance.com/wp-content/uploads/2026/01/icon-495x400.png",
    link: "/portfolio/aux-mobile-app",
    gradient: "from-nebulosity to-nebulosity/80",
  },
  {
    title: "Beauty Stories Shopify Store",
    category: "Ecommerce",
    description:
      "Developed a high-converting Shopify store for Beauty Stories with optimized checkout flows.",
    image: "https://www.kredance.com/wp-content/uploads/2026/01/logo-e1768229610282-495x400.jpg",
    link: "/portfolio/beauty-stories",
    gradient: "from-neon-navy to-astro-grey",
  },
  {
    title: "Zahid Power Motors",
    category: "Ecommerce",
    description:
      "Built a complete digital solution for an automotive business with ecommerce capabilities.",
    image: "https://www.kredance.com/wp-content/uploads/2026/01/zpm-495x400.png",
    link: "/portfolio/zahid-power-motors",
    gradient: "from-astro-grey to-wild-dove",
  },
  {
    title: "Tamar Film Website",
    category: "Website",
    description:
      "Created a cinematic website for Tamar Film that showcases their productions and brand.",
    image: "https://www.kredance.com/wp-content/uploads/2025/12/tamarfilm_logo-e1766688086840-495x400.jpg",
    link: "/portfolio/tamar-film-website",
    gradient: "from-neon-navy to-neon-navy/80",
  },
  {
    title: "Eleve Design Website",
    category: "Website",
    description:
      "Designed and built a sleek portfolio website for the Eleve Design studio.",
    image: "https://www.kredance.com/wp-content/uploads/2025/12/elevedesign_logo-495x400.jpg",
    link: "/portfolio/eleve-design-website",
    gradient: "from-red-inferno to-red-inferno/80",
  },
  {
    title: "The Wow Camp Website",
    category: "Website",
    description:
      "Developed a vibrant promotional website for The Wow Camp event organization.",
    image: "https://www.kredance.com/wp-content/uploads/2025/12/thewowcamp_logo-1-495x400.jpg",
    link: "/portfolio/the-wow-camp-website",
    gradient: "from-astro-grey to-astro-grey/80",
  },
  {
    title: "Fidan Construction Website",
    category: "Website",
    description:
      "Built a professional website for Fidan Construction showcasing their projects and services.",
    image: "https://www.kredance.com/wp-content/uploads/2025/03/fidan1-495x400.png",
    link: "/portfolio/fidan-construction",
    gradient: "from-nebulosity to-nebulosity/80",
  },
  {
    title: "AI Content Publisher",
    category: "AI / Plugins",
    description:
      "Built an automated content publishing system with AI capabilities for intelligent scheduling and optimization.",
    image: "https://www.kredance.com/wp-content/uploads/2024/10/pexels-airamdphoto-16450745-495x400.jpg",
    link: "/portfolio/ai-content-publisher",
    gradient: "from-neon-navy to-astro-grey",
  },
  {
    title: "Telegram × Shopify Integration",
    category: "Integration",
    description:
      "Integrated Telegram with Shopify for real-time customer engagement and order notifications.",
    image: "https://www.kredance.com/wp-content/uploads/2024/10/pexels-asphotograpy-887751-495x400.jpg",
    link: "/portfolio/telegram-shopify-integration",
    gradient: "from-astro-grey to-wild-dove",
  },
  {
    title: "ConsoleGroup Web & Marketing",
    category: "Website",
    description:
      "Delivered an integrated website development and marketing campaign for ConsoleGroup.",
    image: "https://www.kredance.com/wp-content/uploads/2024/10/ss-495x400.png",
    link: "/portfolio/consolegroup",
    gradient: "from-neon-navy to-neon-navy/80",
  },
  {
    title: "Shopify Loyalty Program Plugin",
    category: "AI / Plugins",
    description:
      "Developed a customizable loyalty program plugin for Shopify to boost customer retention.",
    image: "https://www.kredance.com/wp-content/uploads/2024/10/pexels-shoper-pl-550490863-17485352-495x400.jpg",
    link: "/portfolio/shopify-loyalty-plugin",
    gradient: "from-red-inferno to-red-inferno/80",
  },
  {
    title: "WhatsApp Chatbox Integration",
    category: "Integration",
    description:
      "Built a seamless WhatsApp chatbox integration for an airport taxi transportation service.",
    image: "https://www.kredance.com/wp-content/uploads/2024/10/pexels-anton-8100-46924-495x400.jpg",
    link: "/portfolio/whatsapp-chatbox-integration",
    gradient: "from-nebulosity to-nebulosity/80",
  },
  {
    title: "AI User Activity Analysis Plugin",
    category: "AI / Plugins",
    description:
      "Created an AI-powered WordPress plugin that monitors and secures user interactions in real-time.",
    image: "https://www.kredance.com/wp-content/uploads/2024/10/pexels-pixabay-265667-495x400.jpg",
    link: "/portfolio/ai-user-activity-plugin",
    gradient: "from-neon-navy to-astro-grey",
  },
  {
    title: "Restaurant PDF Menu Design",
    category: "Design",
    description:
      "Created a professional PDF menu design for Quality Color Printing's restaurant client.",
    image: "https://www.kredance.com/wp-content/uploads/2024/10/viber_image_2024-10-23_13-47-57-299-495x400.png",
    link: "/portfolio/restaurant-menu-design",
    gradient: "from-red-inferno to-red-inferno/80",
  },
  {
    title: "AI-Powered Video Ad Generation",
    category: "AI / Plugins",
    description:
      "Revolutionized automated content creation with AI-powered video ad generation technology.",
    image: "https://www.kredance.com/wp-content/uploads/2024/10/pexels-asphotograpy-887751-495x400.jpg",
    link: "/portfolio/ai-video-ad-generation",
    gradient: "from-neon-navy to-neon-navy/80",
  },
  {
    title: "National Car Washing Security",
    category: "Cybersecurity",
    description:
      "Secured the national car washing self-support service with comprehensive cybersecurity solutions.",
    image: "https://www.kredance.com/wp-content/uploads/2024/10/pexels-bertellifotografia-28993080-1-495x400.jpg",
    link: "/portfolio/car-washing-security",
    gradient: "from-astro-grey to-astro-grey/80",
  },
  {
    title: "LinkedIn Data Scraping & Structuring",
    category: "Data Mining",
    description:
      "Built a scalable LinkedIn data scraping solution with structured JSON output for business intelligence.",
    image: "https://www.kredance.com/wp-content/uploads/2024/10/pexels-tobias-dziuba-319638-1083792-495x400.jpg",
    link: "/portfolio/linkedin-data-scraping",
    gradient: "from-nebulosity to-nebulosity/80",
  },
  {
    title: "eBoss Recruitment CRM Mobile App",
    category: "Mobile App",
    description:
      "Developed a feature-rich mobile CRM app for eBoss Recruitment to manage candidates on the go.",
    image: "https://www.kredance.com/wp-content/uploads/2024/10/pexels-karolina-grabowska-4968535-495x400.jpg",
    link: "/portfolio/eboss-recruitment-crm",
    gradient: "from-neon-navy to-astro-grey",
  },
  {
    title: "Dzikus Media Mobile App",
    category: "Mobile App",
    description:
      "Built a cross-platform news mobile app for Dzikus Media with real-time content delivery.",
    image: "https://www.kredance.com/wp-content/uploads/2024/10/logo_dzikus-495x400.png",
    link: "/portfolio/dzikus-media-app",
    gradient: "from-astro-grey to-wild-dove",
  },
  {
    title: "Large-Scale CV Processing",
    category: "AI / Plugins",
    description:
      "Automated large-scale CV processing for a recruitment software company using AI-powered parsing.",
    image: "https://www.kredance.com/wp-content/uploads/2024/10/pexels-cottonbro-7439127-495x400.jpg",
    link: "/portfolio/cv-processing",
    gradient: "from-red-inferno to-red-inferno/80",
  },
  {
    title: "Talent Connect Website",
    category: "Website",
    description:
      "Developed a professional website for Talent Connect, a recruitment and staffing platform.",
    image: "https://www.kredance.com/wp-content/uploads/2024/10/screencapture-talent-connect-pro-en-2024-10-08-15_14_17-e1728389780496-495x400.png",
    link: "/portfolio/talent-connect",
    gradient: "from-neon-navy to-neon-navy/80",
  },
  {
    title: "Green-Agro Website & Brand Advertising",
    category: "Website",
    description:
      "Delivered website development and brand advertising for Green-Agro, an agricultural business.",
    image: "https://www.kredance.com/wp-content/uploads/2024/10/greenagr-e1729533961289-495x400.png",
    link: "/portfolio/green-agro",
    gradient: "from-nebulosity to-nebulosity/80",
  },
  {
    title: "Hide & Seek Chrome Extension",
    category: "AI / Plugins",
    description:
      "Developed a Chrome extension that enhances browsing privacy and content management.",
    image: "https://www.kredance.com/wp-content/uploads/2024/10/chrome-495x400.jpg",
    link: "/portfolio/hide-seek-chrome-extension",
    gradient: "from-astro-grey to-astro-grey/80",
  },
  {
    title: "IAMQR Mobile App with AI",
    category: "Mobile App",
    description:
      "Built a mobile app for Amuser Inc. with AI capabilities for QR code generation and scanning.",
    image: "https://www.kredance.com/wp-content/uploads/2024/10/DALL-E-2024-04-10-20.19.16-Create-a-logo-for-IAmQR-that-embodies-a-transition-from-a-QR-code-to-the-head-of-a-person-in-strict-black-and-white.-Begin-with-elements-of-a-QR-co-768x768-1-495x400.webp",
    link: "/portfolio/iamqr",
    gradient: "from-neon-navy to-astro-grey",
  },
  {
    title: "BRP Reseller Truck Advertising",
    category: "Design",
    description:
      "Designed eye-catching truck advertising wraps for a BRP reseller to boost brand visibility.",
    image: "https://www.kredance.com/wp-content/uploads/2024/10/pexels-amar-12983282-495x400.jpg",
    link: "/portfolio/brp-truck-advertising",
    gradient: "from-red-inferno to-red-inferno/80",
  },
  {
    title: "ShopKlub Lead Generation",
    category: "Ecommerce",
    description:
      "Drove lead generation for ShopKlub through luxury discount strategies and digital marketing.",
    image: "https://www.kredance.com/wp-content/uploads/2014/12/logo-e1729615458837.png",
    link: "/portfolio/shopklub",
    gradient: "from-astro-grey to-wild-dove",
  },
  {
    title: "Australian Travel Resource Data Mining",
    category: "Data Mining",
    description:
      "Executed a large-scale data mining project for an Australian national travel resource platform.",
    image: "https://www.kredance.com/wp-content/uploads/2024/10/aus-495x400.png",
    link: "/portfolio/australian-travel-data-mining",
    gradient: "from-neon-navy to-neon-navy/80",
  },
];

export function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

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
            Portfolio
          </span>
          <h1 className="mt-4 text-4xl lg:text-5xl font-bold tracking-tight text-nebulosity leading-[1.15]">
            Featured <span className="text-neon-navy">Work</span>
          </h1>
          <p className="mt-6 text-lg text-wild-dove leading-relaxed">
            Real projects, real results. Here&apos;s a selection of work we&apos;ve delivered for our clients.
          </p>
        </motion.div>

        {/* Category filters */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-neon-navy text-sunset"
                  : "text-wild-dove hover:text-nebulosity hover:bg-nebulosity/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project grid */}
        <motion.div layout className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link href={project.link} className="group block rounded-2xl border border-transparent p-5 transition-all duration-300 hover:border-neon-navy/20 hover:bg-neon-navy/5 hover:shadow-lg">
                  <div className="relative mb-5 aspect-[495/400] overflow-hidden rounded-xl bg-sunset/40">
                    <Image
                      src={project.image}
                      alt={`${project.title} ${project.category.toLowerCase()} project preview`}
                      fill
                      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-medium text-astro-grey uppercase tracking-wider">
                        {project.category}
                      </span>
                      <h2 className="mt-1 font-semibold text-nebulosity group-hover:text-neon-navy transition-colors">
                        {project.title}
                      </h2>
                      <p className="mt-2 text-sm text-wild-dove leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                    <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-wild-dove opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-neon-navy transition-all duration-300" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
