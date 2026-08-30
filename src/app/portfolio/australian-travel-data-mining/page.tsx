import { createPageMetadata } from "@/lib/metadata";
import { PortfolioDetail } from "@/components/portfolio-detail";

export const metadata = createPageMetadata({
  path: "/portfolio/australian-travel-data-mining",
  title: "Australian Travel Resource Data Mining | Kredance",
  description:
    "A comprehensive data mining initiative aggregating travel information from multiple sources to create an integrated database for Australian destinations.",
});

export default function AustralianTravelDataMiningPage() {
  return (
    <div className="flex-1 bg-white">
      <PortfolioDetail
        title="Australian Travel Resource Data Mining"
        category="Data Mining"
        description="A comprehensive data mining initiative aggregating travel information from multiple sources to create an integrated database for Australian destinations."
        image="https://www.kredance.com/wp-content/uploads/2024/10/aus-495x400.png"
        sections={[
          {
            heading: "Data Mining & Aggregation",
            content:
              "Extracted diverse travel data including itineraries, lodging details, transportation options, and activity recommendations from various Australian tourism websites.",
          },
          {
            heading: "Cross-Platform Data Collection",
            content:
              "Information sourced from airline websites, hotel booking portals, and local tourism resources to ensure comprehensive database coverage.",
          },
          {
            heading: "Data Structuring",
            content:
              "Collected information organized into a structured, user-friendly format, optimized for efficient search and usability.",
          },
        ]}
        technologies={[
          "Web Scraping",
          "Data Extraction",
          "Data Aggregation",
          "Database Optimization",
        ]}
        results={[
          "Enhanced platform delivery of travel insights",
          "Integrated travel database created",
          "Comprehensive coverage across airlines, hotels, and tourism",
          "Structured data optimized for search",
        ]}
        relatedServices={[
          { title: "Data Mining & Scraping", href: "/services/data-mining" },
        ]}
      />
    </div>
  );
}
