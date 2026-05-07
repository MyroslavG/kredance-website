import { ServiceDetail } from "@/components/service-detail";
import { SeoAdsDemo } from "@/components/demos/seo-ads-demo";

export const metadata = {
  title: "Website SEO | Kredance",
  description:
    "Data-driven SEO services from Kredance - on-page optimization, technical SEO, link building, keyword strategy, analytics, and local SEO to grow your organic traffic.",
};

export default function WebsiteSeoPage() {
  return (
    <div className="flex-1 bg-white">
      <ServiceDetail
        title="Website SEO"
        subtitle="Rank Higher, Drive More Organic Traffic"
        description="Kredance's SEO services go far beyond keyword stuffing. We combine technical expertise, content strategy, and data analysis to build sustainable organic growth - helping your site rank for the terms that actually drive revenue, not just vanity metrics."
        features={[
          {
            title: "On-Page Optimization",
            description:
              "Strategic optimization of title tags, meta descriptions, headings, internal links, and content structure to maximize relevance for your target keywords.",
          },
          {
            title: "Technical SEO",
            description:
              "Comprehensive audits and fixes for crawlability, indexation, site speed, Core Web Vitals, structured data, and mobile usability issues.",
          },
          {
            title: "Link Building",
            description:
              "White-hat outreach campaigns that earn high-authority backlinks through guest posts, digital PR, and strategic partnerships.",
          },
          {
            title: "Keyword Strategy",
            description:
              "In-depth keyword research and competitive analysis to identify high-intent, achievable opportunities across every stage of the buyer journey.",
          },
          {
            title: "Analytics & Reporting",
            description:
              "Custom dashboards tracking rankings, organic traffic, conversions, and ROI - with clear monthly reports and strategic recommendations.",
          },
          {
            title: "Local SEO",
            description:
              "Google Business Profile optimization, local citation building, and geo-targeted content strategies to dominate search results in your service areas.",
          },
        ]}
        process={[
          {
            step: "1",
            title: "SEO Audit",
            description:
              "A thorough technical and content audit of your website, competitor landscape, and keyword opportunities to establish a clear baseline.",
          },
          {
            step: "2",
            title: "Strategy Development",
            description:
              "We create a prioritized SEO roadmap with specific targets, timelines, and KPIs aligned to your business objectives.",
          },
          {
            step: "3",
            title: "Implementation",
            description:
              "Our team executes on-page fixes, content optimization, link building campaigns, and technical improvements in coordinated sprints.",
          },
          {
            step: "4",
            title: "Monitor & Refine",
            description:
              "Continuous performance tracking, A/B testing, and strategy refinement to compound your organic growth month over month.",
          },
        ]}
        relatedProjects={[
          { title: "CFMoto Kyiv", href: "/portfolio/cfmoto-kyiv", image: "https://www.kredance.com/wp-content/uploads/2026/02/cfmoto-495x400.jpg" },
          { title: "Tamar Film Website", href: "/portfolio/tamar-film-website", image: "https://www.kredance.com/wp-content/uploads/2025/12/tamarfilm_logo-e1766688086840-495x400.jpg" },
          { title: "ConsoleGroup", href: "/portfolio/consolegroup", image: "https://www.kredance.com/wp-content/uploads/2024/10/ss-495x400.png" },
          { title: "Beauty Stories", href: "/portfolio/beauty-stories", image: "https://www.kredance.com/wp-content/uploads/2026/01/logo-e1768229610282-495x400.jpg" },
          { title: "Talent Connect", href: "/portfolio/talent-connect", image: "https://www.kredance.com/wp-content/uploads/2024/10/screencapture-talent-connect-pro-en-2024-10-08-15_14_17-e1728389780496-495x400.png" },
          { title: "Green-Agro", href: "/portfolio/green-agro", image: "https://www.kredance.com/wp-content/uploads/2024/10/greenagr-e1729533961289-495x400.png" },
        ]}
        demo={<SeoAdsDemo />}
      />
    </div>
  );
}
