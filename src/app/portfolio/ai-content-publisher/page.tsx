import { createPageMetadata } from "@/lib/metadata";
import { PortfolioDetail } from "@/components/portfolio-detail";

export const metadata = createPageMetadata({
  path: "/portfolio/ai-content-publisher",
  title: "AI Content Publisher | Kredance",
  description:
    "Kredance developed an automated content publishing platform with AI integration to streamline content creation and distribution across multiple channels.",
});

export default function AIContentPublisherPage() {
  return (
    <div className="flex-1 bg-white">
      <PortfolioDetail
        title="AI Content Publisher"
        category="AI / Plugins"
        description="Kredance developed an automated content publishing platform with AI integration to streamline content creation and distribution across multiple channels."
        image="https://www.kredance.com/wp-content/uploads/2024/10/pexels-airamdphoto-16450745-495x400.jpg"
        sections={[
          {
            heading: "AI-Powered Content Generation",
            content:
              "The system uses AI to create high-quality, relevant content based on predefined topics, keywords, or trends across articles, blogs, social posts, and product descriptions.",
          },
          {
            heading: "Automated Scheduling & Publishing",
            content:
              "Content distributes across websites, blogs, social media, and newsletters with timing optimization for maximum engagement.",
          },
          {
            heading: "Content Customization",
            content:
              "AI modifies tone, style, and length of content based on the platform to match each channel's requirements.",
          },
          {
            heading: "SEO Optimization",
            content:
              "The platform ensures all content is optimized for search engines, using keyword analysis and trending topics.",
          },
          {
            heading: "Multi-Platform Integration",
            content:
              "Supports X (Twitter), Facebook, Instagram, and LinkedIn with seamless content dissemination capabilities.",
          },
        ]}
        technologies={[
          "AI/ML Content Generation",
          "SEO Keyword Analysis",
          "Multi-Platform Publishing",
          "Social Media APIs",
        ]}
        results={[
          "Significantly reduced content creation time",
          "Consistent output quality across channels",
          "Optimized publishing schedules for engagement",
          "Scalable content distribution",
        ]}
        relatedServices={[
          { title: "AI Automation", href: "/services/ai-automation" },
          { title: "Universal Plugin Solutions", href: "/services/universal-plugin-solutions" },
        ]}
      />
    </div>
  );
}
