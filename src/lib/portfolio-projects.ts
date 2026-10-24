import { portfolioAdditions } from "@/lib/portfolio-additions";

export interface PortfolioProject {
  title: string;
  category: string;
  description: string;
  link: string;
  image?: {
    src: string;
    alt: string;
  };
}

const existingProjects: PortfolioProject[] = [
  {
    "title": "CFMoto Kyiv",
    "category": "Website",
    "description": "Accelerated the digital presence of CFMoto Kyiv with a high-performance website and digital strategy.",
    "link": "/portfolio/cfmoto-kyiv"
  },
  {
    "title": "DzvinSki",
    "category": "Website",
    "description": "Accelerated the digital presence of DzvinSki through modern web design and brand positioning.",
    "link": "/portfolio/dzvinski"
  },
  {
    "title": "Neon Vibez Website",
    "category": "Website",
    "description": "A website showcasing custom neon signs, personalized designs and ready-made collections for Neon Vibez.",
    "link": "/portfolio/neon-vibez"
  },
  {
    "title": "AUX Mobile App",
    "category": "Mobile App",
    "description": "A social music app for sharing what you listen to and discussing it with friends.",
    "link": "/portfolio/aux-mobile-app"
  },
  {
    "title": "Beauty Stories Shopify Store",
    "category": "Ecommerce",
    "description": "A Shopify storefront for Beauty Stories, bringing its beauty product catalog and online shopping experience together.",
    "link": "/portfolio/beauty-stories"
  },
  {
    "title": "Zahid Power Motors",
    "category": "Ecommerce",
    "description": "Built a complete digital solution for an automotive business with ecommerce capabilities.",
    "link": "/portfolio/zahid-power-motors"
  },
  {
    "title": "Tamar Film Website",
    "category": "Website",
    "description": "Created a cinematic website for Tamar Film that showcases their productions and brand.",
    "link": "/portfolio/tamar-film-website"
  },
  {
    "title": "Elevé Design Website",
    "category": "Website",
    "description": "A portfolio website for Elevé Design, presenting the studio and its work.",
    "link": "/portfolio/eleve-design-website"
  },
  {
    "title": "The Wow Camp Website",
    "category": "Website",
    "description": "Developed a vibrant promotional website for The Wow Camp event organization.",
    "link": "/portfolio/the-wow-camp-website"
  },
  {
    "title": "Fidan Construction Website",
    "category": "Website",
    "description": "Built a professional website for Fidan Construction showcasing their projects and services.",
    "link": "/portfolio/fidan-construction"
  },
  {
    "title": "AI Content Publisher",
    "category": "AI / Plugins",
    "description": "Built an automated content publishing system with AI capabilities for intelligent scheduling and optimization.",
    "link": "/portfolio/ai-content-publisher"
  },
  {
    "title": "Telegram × Shopify Integration",
    "category": "Integration",
    "description": "Integrated Telegram with Shopify for real-time customer engagement and order notifications.",
    "link": "/portfolio/telegram-shopify-integration"
  },
  {
    "title": "ConsoleGroup Web & Marketing",
    "category": "Website",
    "description": "Delivered an integrated website development and marketing campaign for ConsoleGroup.",
    "link": "/portfolio/consolegroup"
  },
  {
    "title": "Shopify Loyalty Program Plugin",
    "category": "AI / Plugins",
    "description": "Developed a customizable loyalty program plugin for Shopify to boost customer retention.",
    "link": "/portfolio/shopify-loyalty-plugin"
  },
  {
    "title": "WhatsApp Chatbox Integration",
    "category": "Integration",
    "description": "Built a seamless WhatsApp chatbox integration for an airport taxi transportation service.",
    "link": "/portfolio/whatsapp-chatbox-integration"
  },
  {
    "title": "AI User Activity Analysis Plugin",
    "category": "AI / Plugins",
    "description": "Created an AI-powered WordPress plugin that monitors and secures user interactions in real-time.",
    "link": "/portfolio/ai-user-activity-plugin"
  },
  {
    "title": "Restaurant PDF Menu Design",
    "category": "Design",
    "description": "Created a professional PDF menu design for Quality Color Printing's restaurant client.",
    "link": "/portfolio/restaurant-menu-design"
  },
  {
    "title": "AI-Powered Video Ad Generation",
    "category": "AI / Plugins",
    "description": "Revolutionized automated content creation with AI-powered video ad generation technology.",
    "link": "/portfolio/ai-video-ad-generation"
  },
  {
    "title": "National Car Washing Security",
    "category": "Cybersecurity",
    "description": "Secured the national car washing self-support service with comprehensive cybersecurity solutions.",
    "link": "/portfolio/car-washing-security"
  },
  {
    "title": "LinkedIn Data Scraping & Structuring",
    "category": "Data Mining",
    "description": "Built a scalable LinkedIn data scraping solution with structured JSON output for business intelligence.",
    "link": "/portfolio/linkedin-data-scraping"
  },
  {
    "title": "eBoss Recruitment CRM Mobile App",
    "category": "Mobile App",
    "description": "Developed a feature-rich mobile CRM app for eBoss Recruitment to manage candidates on the go.",
    "link": "/portfolio/eboss-recruitment-crm"
  },
  {
    "title": "Dzikus Media Mobile App",
    "category": "Mobile App",
    "description": "Built a cross-platform news mobile app for Dzikus Media with real-time content delivery.",
    "link": "/portfolio/dzikus-media-app"
  },
  {
    "title": "Large-Scale CV Processing",
    "category": "AI / Plugins",
    "description": "Automated large-scale CV processing for a recruitment software company using AI-powered parsing.",
    "link": "/portfolio/cv-processing"
  },
  {
    "title": "Talent Connect Website",
    "category": "Website",
    "description": "Developed a professional website for Talent Connect, a recruitment and staffing platform.",
    "link": "/portfolio/talent-connect"
  },
  {
    "title": "Green-Agro Website & Brand Advertising",
    "category": "Website",
    "description": "Delivered website development and brand advertising for Green-Agro, an agricultural business.",
    "link": "/portfolio/green-agro"
  },
  {
    "title": "Hide & Seek Chrome Extension",
    "category": "AI / Plugins",
    "description": "Developed a Chrome extension that enhances browsing privacy and content management.",
    "link": "/portfolio/hide-seek-chrome-extension"
  },
  {
    "title": "IAMQR Mobile App with AI",
    "category": "Mobile App",
    "description": "Built a mobile app for Amuser Inc. with AI capabilities for QR code generation and scanning.",
    "link": "/portfolio/iamqr"
  },
  {
    "title": "BRP Reseller Truck Advertising",
    "category": "Design",
    "description": "Designed eye-catching truck advertising wraps for a BRP reseller to boost brand visibility.",
    "link": "/portfolio/brp-truck-advertising"
  },
  {
    "title": "ShopKlub Lead Generation",
    "category": "Ecommerce",
    "description": "Drove lead generation for ShopKlub through luxury discount strategies and digital marketing.",
    "link": "/portfolio/shopklub"
  },
  {
    "title": "Australian Travel Resource Data Mining",
    "category": "Data Mining",
    "description": "Executed a large-scale data mining project for an Australian national travel resource platform.",
    "link": "/portfolio/australian-travel-data-mining"
  }
];

// Keep the 17 projects attached to the Kredance LinkedIn role in source order.
// Existing projects outside that list remain available below them.
const linkedinOrder = [
  "skyline-flow",
  "kolo-app",
  "queen-cookie",
  "fefa-events",
  "aux-mobile-app",
  "beauty-stories",
  "neon-vibez",
  "tamar-film-website",
  "eleve-design-website",
  "the-wow-camp-website",
  "fidan-construction",
  "dzikus-media-app",
  "help-me-study",
  "kredance-website",
  "frequo-app",
  "white-beauty-space",
  "care-by-vikki"
];

const allProjects: PortfolioProject[] = [
  ...portfolioAdditions.map(({ slug, title, category, description }) => ({
    title, category, description, link: `/portfolio/${slug}`,
  })),
  ...existingProjects,
];
const featuredLinks = new Set(linkedinOrder.map((slug) => `/portfolio/${slug}`));

export const portfolioProjects: PortfolioProject[] = [
  {
    title: "Roofing lead generation",
    category: "Advertising",
    description: "A Facebook video ad, a higher-intent instant form, and a tested Make-to-Telegram handoff for an Ontario roofing business.",
    link: "/portfolio/roofing-lead-generation",
    image: {
      src: "/images/lead-generation-flow.svg",
      alt: "Facebook enquiry flow for a roofing business",
    },
  },
  ...linkedinOrder.map((slug) => {
    const project = allProjects.find((item) => item.link === `/portfolio/${slug}`);
    if (!project) throw new Error(`Missing portfolio project: ${slug}`);
    return project;
  }),
  ...allProjects.filter((project) => !featuredLinks.has(project.link)),
];
