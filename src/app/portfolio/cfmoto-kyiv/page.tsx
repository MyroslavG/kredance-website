import { createPageMetadata } from "@/lib/metadata";
import { PortfolioDetail } from "@/components/portfolio-detail";

export const metadata = createPageMetadata({
  path: "/portfolio/cfmoto-kyiv",
  title: "CFMoto Kyiv | Kredance",
  description:
    "Kredance rebuilt the official CFMoto dealer website for the Kyiv region, implementing SEO strategies and mobile-first architecture to increase organic traffic and lead generation.",
});

export default function CFMotoKyivPage() {
  return (
    <div className="flex-1 bg-white">
      <PortfolioDetail
        title="CFMoto Kyiv"
        category="Website"
        description="Kredance rebuilt the official CFMoto dealer website for the Kyiv region, implementing SEO strategies and mobile-first architecture to increase organic traffic and lead generation."
        image="https://www.kredance.com/wp-content/uploads/2026/02/cfmoto-495x400.jpg"
        sections={[
          {
            heading: "The Challenge",
            content:
              "The original site struggled with mobile usability, thin product descriptions, and poor search rankings for buyer-intent keywords. The interface was difficult to navigate on smaller screens, limiting the audience of mobile researchers.",
          },
          {
            heading: "Architecture & Website Building",
            content:
              "The team restructured the site using mobile-first design principles. Key technical improvements included image optimization using WebP formats, custom filtering systems for vehicle specifications, and Product/LocalBusiness schema markup implementation.",
          },
          {
            heading: "SEO Strategy",
            content:
              "Rather than pursuing broad keywords, the strategy focused on specific buyer-intent queries like 'high-performance CFMoto ATVs for off-road racing' and 'affordable CFMoto quad bikes for beginners' with comprehensive content and strategic internal linking.",
          },
          {
            heading: "Post-Purchase Engagement",
            content:
              "Service department pages were optimized for maintenance-related searches, positioning the dealership as a complete partner throughout vehicle ownership.",
          },
        ]}
        technologies={[
          "WordPress",
          "WebP Optimization",
          "Schema Markup",
          "Google Analytics",
          "Mobile-First Design",
        ]}
        results={[
          "Increased organic visibility and search rankings",
          "Improved traffic quality and targeting",
          "Measurable uptick in showroom visits",
          "Growth in test-drive request conversions",
        ]}
        relatedServices={[
          { title: "Website Development", href: "/services/website-development" },
          { title: "Website SEO", href: "/services/website-seo" },
        ]}
      />
    </div>
  );
}
