import { createPageMetadata } from "@/lib/metadata";
import { PortfolioDetail } from "@/components/portfolio-detail";

export const metadata = createPageMetadata({
  path: "/portfolio/ai-video-ad-generation",
  title: "AI-Powered Video Ad Generation | Kredance",
  description:
    "An AI-powered solution using advanced algorithms to automate high-quality video advertisement creation, streamlining production and enabling rapid scaling.",
});

export default function AIVideoAdGenerationPage() {
  return (
    <div className="flex-1 bg-white">
      <PortfolioDetail
        title="AI-Powered Video Ad Generation"
        category="AI / Plugins"
        description="An AI-powered solution using advanced algorithms to automate high-quality video advertisement creation, streamlining production and enabling rapid scaling."
        image="https://www.kredance.com/wp-content/uploads/2024/10/pexels-asphotograpy-887751-495x400.jpg"
        sections={[
          {
            heading: "Project Overview",
            content:
              "The initiative focused on automating creation of tailored video advertisements through cutting-edge AI techniques. The system generates visually appealing content specifically optimized for target demographics.",
          },
          {
            heading: "Impact",
            content:
              "The AI-powered approach significantly decreases both production timelines and expenses while improving personalization and campaign effectiveness, enabling businesses to scale their video advertising rapidly.",
          },
        ]}
        technologies={[
          "Advanced AI Algorithms",
          "AI-Driven Automation",
          "Personalization Optimization",
          "Target Audience Analysis",
        ]}
        results={[
          "Reduced production time",
          "Decreased costs",
          "Enhanced personalization",
          "Improved campaign effectiveness",
          "Rapid scalability",
        ]}
        relatedServices={[
          { title: "AI Automation", href: "/services/ai-automation" },
          { title: "Advertisement Creation", href: "/services/advertisement-creation" },
        ]}
      />
    </div>
  );
}
