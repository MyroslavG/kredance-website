import { ServiceDetail } from "@/components/service-detail";
import { DataMiningDemo } from "@/components/demos/data-mining-demo";

export const metadata = {
  title: "Data Mining & Scraping | Kredance",
  description:
    "Extract actionable insights from the web with Kredance's compliant, scalable data mining and scraping services. Competitive intelligence, market research, and structured data delivery.",
};

export default function DataMiningPage() {
  return (
    <div className="flex-1 bg-white">
      <ServiceDetail
        title="Data Mining & Scraping"
        subtitle="Turn Raw Data Into Strategic Advantage"
        description="At Kredance, we help businesses unlock hidden value from the web. Our data mining and scraping services deliver clean, structured datasets that power smarter decisions — from competitive intelligence to real-time market research — all built on compliant, scalable infrastructure."
        features={[
          {
            title: "Web Scraping at Scale",
            description:
              "Automated extraction of structured data from websites, marketplaces, and directories — handling pagination, authentication, and dynamic content with ease.",
          },
          {
            title: "Competitive Intelligence",
            description:
              "Monitor competitor pricing, product catalogs, reviews, and marketing strategies in real time to stay one step ahead in your market.",
          },
          {
            title: "Market Research Data",
            description:
              "Aggregate industry trends, consumer sentiment, and market signals from thousands of sources into actionable research datasets.",
          },
          {
            title: "Data Cleaning & Enrichment",
            description:
              "Raw data is only as good as its quality. We deduplicate, normalize, and enrich your datasets so they are analysis-ready from day one.",
          },
          {
            title: "Custom Data Pipelines",
            description:
              "End-to-end pipelines that extract, transform, and load data on your schedule — delivered via API, database, or flat files in any format you need.",
          },
          {
            title: "Compliance & Ethics",
            description:
              "Every project follows strict legal and ethical guidelines including robots.txt compliance, rate limiting, and data privacy regulations.",
          },
        ]}
        process={[
          {
            step: "1",
            title: "Discovery",
            description:
              "We identify your target data sources, define output schemas, and establish compliance requirements for the project.",
          },
          {
            step: "2",
            title: "Architecture",
            description:
              "Our engineers design a resilient scraping infrastructure with proxy rotation, error handling, and scheduling built in.",
          },
          {
            step: "3",
            title: "Extraction & QA",
            description:
              "We run the extraction pipeline, validate data quality at every stage, and refine selectors until accuracy targets are met.",
          },
          {
            step: "4",
            title: "Delivery & Monitoring",
            description:
              "Clean datasets are delivered on your preferred schedule with ongoing monitoring, alerting, and maintenance included.",
          },
        ]}
        relatedProjects={[
          { title: "LinkedIn Data Scraping", href: "/portfolio/linkedin-data-scraping", image: "https://www.kredance.com/wp-content/uploads/2024/10/pexels-tobias-dziuba-319638-1083792-495x400.jpg" },
          { title: "Australian Travel Data Mining", href: "/portfolio/australian-travel-data-mining", image: "https://www.kredance.com/wp-content/uploads/2024/10/aus-495x400.png" },
          { title: "Large-Scale CV Processing", href: "/portfolio/cv-processing", image: "https://www.kredance.com/wp-content/uploads/2024/10/pexels-cottonbro-7439127-495x400.jpg" },
        ]}
        demo={<DataMiningDemo />}
      />
    </div>
  );
}
