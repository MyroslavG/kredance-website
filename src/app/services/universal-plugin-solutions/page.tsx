import { createPageMetadata } from "@/lib/metadata";
import { ServiceDetail } from "@/components/service-detail";
import { PluginDemo } from "@/components/demos/plugin-demo";

export const metadata = createPageMetadata({
  path: "/services/universal-plugin-solutions",
  title: "Universal Plugin Solutions | Kredance",
  description:
    "Custom WordPress plugins, Shopify apps, browser extensions, and platform integrations built by Kredance to extend your technology and automate workflows.",
});

export default function UniversalPluginSolutionsPage() {
  return (
    <div className="flex-1 bg-white">
      <ServiceDetail
        title="Universal Plugin Solutions"
        subtitle="Extend Any Platform, Automate Any Workflow"
        description="Off-the-shelf plugins rarely fit perfectly. Kredance designs and develops custom plugins, apps, and extensions for WordPress, Shopify, Chrome, and virtually any platform - giving your business the exact functionality it needs without compromise or bloat."
        features={[
          {
            title: "WordPress Plugin Development",
            description:
              "Custom WordPress plugins built to your specifications - from advanced form builders and membership systems to complex API integrations and admin tools.",
          },
          {
            title: "Shopify App Development",
            description:
              "Tailored Shopify apps that add unique storefront features, automate order workflows, sync inventory, or connect to your existing business systems.",
          },
          {
            title: "Browser Extensions",
            description:
              "Chrome, Firefox, and Edge extensions that boost productivity, scrape data, or enhance web-based workflows for your team or customers.",
          },
          {
            title: "Custom API Integrations",
            description:
              "Connect disparate tools and platforms with custom middleware and API integrations that keep your data flowing and your processes automated.",
          },
          {
            title: "Third-Party Platform Plugins",
            description:
              "Extensions for platforms like Jira, Slack, HubSpot, and more - built to fit seamlessly into the tools your team already uses every day.",
          },
          {
            title: "Maintenance & Updates",
            description:
              "Ongoing compatibility updates, security patches, and feature enhancements to keep your plugins running smoothly as platforms evolve.",
          },
        ]}
        process={[
          {
            step: "1",
            title: "Discovery",
            description:
              "We map out the functionality you need, the platforms involved, and any constraints to define a clear scope and architecture.",
          },
          {
            step: "2",
            title: "Design & Prototype",
            description:
              "Interactive wireframes and technical specs are shared for your approval before a single line of production code is written.",
          },
          {
            step: "3",
            title: "Development & Testing",
            description:
              "Agile sprints with regular demos, rigorous cross-browser and cross-platform testing, and thorough code reviews at every stage.",
          },
          {
            step: "4",
            title: "Deployment & Support",
            description:
              "We handle publishing to marketplaces or private distribution, then provide ongoing maintenance and feature updates as needed.",
          },
        ]}
        relatedProjects={[
          { title: "Shopify Loyalty Program Plugin", href: "/portfolio/shopify-loyalty-plugin", image: "https://www.kredance.com/wp-content/uploads/2024/10/pexels-shoper-pl-550490863-17485352-495x400.jpg" },
          { title: "AI User Activity Plugin", href: "/portfolio/ai-user-activity-plugin", image: "https://www.kredance.com/wp-content/uploads/2024/10/pexels-pixabay-265667-495x400.jpg" },
          { title: "Hide & Seek Chrome Extension", href: "/portfolio/hide-seek-chrome-extension", image: "https://www.kredance.com/wp-content/uploads/2024/10/chrome-495x400.jpg" },
          { title: "AI Content Publisher", href: "/portfolio/ai-content-publisher", image: "https://www.kredance.com/wp-content/uploads/2024/10/pexels-airamdphoto-16450745-495x400.jpg" },
        ]}
        demo={<PluginDemo />}
      />
    </div>
  );
}
