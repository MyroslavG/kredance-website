import { createPageMetadata } from "@/lib/metadata";
import { PortfolioDetail } from "@/components/portfolio-detail";

export const metadata = createPageMetadata({
  path: "/portfolio/cv-processing",
  title: "Large-Scale CV Processing | Kredance",
  description:
    "Kredance optimized the handling of thousands of CVs through streamlined data extraction, classification, and parsing for a recruitment software company.",
});

export default function CvProcessingPage() {
  return (
    <div className="flex-1 bg-white">
      <PortfolioDetail
        title="Large-Scale CV Processing"
        category="AI / Plugins"
        description="Kredance optimized the handling of thousands of CVs through streamlined data extraction, classification, and parsing for a recruitment software company."
        image="https://www.kredance.com/wp-content/uploads/2024/10/pexels-cottonbro-7439127-495x400.jpg"
        sections={[
          {
            heading: "Project Overview",
            content:
              "Kredance completed a massive CV processing project for a recruitment software company, optimizing the handling of thousands of CVs in a single batch. The solution streamlined data extraction, classification, and parsing.",
          },
          {
            heading: "Impact",
            content:
              "The system ensures efficient, accurate, and scalable processing to meet the high-volume demands of modern recruitment platforms, improving candidate-to-job opportunity matching speed and effectiveness.",
          },
        ]}
        technologies={[
          "Data Extraction",
          "Document Classification",
          "AI Parsing",
          "Batch Processing",
        ]}
        results={[
          "Optimized handling of thousands of CVs in batches",
          "Improved candidate-to-job matching speed",
          "Scalable processing for high-volume demands",
          "Accurate data extraction and classification",
        ]}
        relatedServices={[
          { title: "AI Automation", href: "/services/ai-automation" },
          { title: "Data Mining & Scraping", href: "/services/data-mining" },
        ]}
      />
    </div>
  );
}
