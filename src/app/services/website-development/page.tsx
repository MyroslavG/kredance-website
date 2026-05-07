import { ServiceDetail } from "@/components/service-detail";
import { WebsiteBuilderDemo } from "@/components/demos/website-builder-demo";

export const metadata = {
  title: "Website Development | Kredance",
  description:
    "Custom website development with React, Next.js, and modern frameworks. Kredance builds fast, responsive, and conversion-optimized websites for businesses of every size.",
};

export default function WebsiteDevelopmentPage() {
  return (
    <div className="flex-1 bg-white">
      <ServiceDetail
        title="Website Development"
        subtitle="Modern Sites Built for Speed, Scale, and Conversion"
        description="Your website is the foundation of your digital presence. Kredance builds custom, high-performance websites using React, Next.js, and modern frameworks - engineered for lightning-fast load times, flawless responsiveness, and the flexibility to grow with your business."
        features={[
          {
            title: "React & Next.js Development",
            description:
              "Component-driven architecture with server-side rendering, static generation, and API routes for blazing-fast sites that search engines love.",
          },
          {
            title: "Responsive Design",
            description:
              "Every layout is crafted mobile-first and tested across devices, screen sizes, and browsers to deliver a pixel-perfect experience everywhere.",
          },
          {
            title: "Performance Optimization",
            description:
              "Code splitting, image optimization, lazy loading, and CDN configuration to achieve top Core Web Vitals scores and sub-second load times.",
          },
          {
            title: "CMS Integration",
            description:
              "Headless CMS setups with Sanity, Contentful, Strapi, or WordPress so your team can update content without touching code.",
          },
          {
            title: "Custom Functionality",
            description:
              "From interactive dashboards and client portals to booking systems and real-time data visualizations - we build exactly what your business needs.",
          },
          {
            title: "Accessibility & Standards",
            description:
              "WCAG-compliant, semantic HTML, and best-practice SEO markup baked in from day one so your site is usable and discoverable by everyone.",
          },
        ]}
        process={[
          {
            step: "1",
            title: "Strategy & Planning",
            description:
              "We define your goals, map user journeys, and create a technical blueprint including stack selection and information architecture.",
          },
          {
            step: "2",
            title: "Design & Prototyping",
            description:
              "High-fidelity designs in Figma with interactive prototypes, giving you a clear picture of the final product before development begins.",
          },
          {
            step: "3",
            title: "Development & QA",
            description:
              "Iterative sprints with regular deployments to a staging environment, full cross-browser testing, and performance audits at every milestone.",
          },
          {
            step: "4",
            title: "Launch & Optimization",
            description:
              "Zero-downtime deployment, analytics setup, and post-launch performance monitoring to ensure everything runs flawlessly from day one.",
          },
        ]}
        relatedProjects={[
          { title: "CFMoto Kyiv", href: "/portfolio/cfmoto-kyiv", image: "https://www.kredance.com/wp-content/uploads/2026/02/cfmoto-495x400.jpg" },
          { title: "DzvinSki", href: "/portfolio/dzvinski", image: "https://www.kredance.com/wp-content/uploads/2026/01/bereg-495x400.png" },
          { title: "Neon Vibez Website", href: "/portfolio/neon-vibez", image: "https://www.kredance.com/wp-content/uploads/2026/01/Neon-Vibez-Logo-411x400.png" },
          { title: "Tamar Film Website", href: "/portfolio/tamar-film-website", image: "https://www.kredance.com/wp-content/uploads/2025/12/tamarfilm_logo-e1766688086840-495x400.jpg" },
          { title: "Fidan Construction", href: "/portfolio/fidan-construction", image: "https://www.kredance.com/wp-content/uploads/2025/03/fidan1-495x400.png" },
          { title: "ConsoleGroup", href: "/portfolio/consolegroup", image: "https://www.kredance.com/wp-content/uploads/2024/10/ss-495x400.png" },
        ]}
        demo={<WebsiteBuilderDemo />}
      />
    </div>
  );
}
