import { PortfolioDetail } from "@/components/portfolio-detail";

export const metadata = {
  title: "LinkedIn Data Scraping & Structuring | Kredance",
  description:
    "A project extracting professional profiles and connection data from LinkedIn using Selenium, converting information into structured JSON for analysis.",
};

export default function LinkedInDataScrapingPage() {
  return (
    <div className="flex-1 bg-white">
      <PortfolioDetail
        title="LinkedIn Data Scraping & Structuring"
        category="Data Mining"
        description="A project extracting professional profiles and connection data from LinkedIn using Selenium, converting information into structured JSON for analysis."
        image="https://www.kredance.com/wp-content/uploads/2024/10/pexels-tobias-dziuba-319638-1083792-495x400.jpg"
        sections={[
          {
            heading: "Project Objective",
            content:
              "The initiative aimed to collect detailed LinkedIn profile information, including professional connections, job positions, and related metadata structured as JSON for easy analysis and internal system integration.",
          },
          {
            heading: "Technology Stack",
            content:
              "Web scraping powered by Selenium with ChromeDriver for browser automation, Python with BeautifulSoup for data parsing and transformation, and structured JSON output format.",
          },
          {
            heading: "Challenges Addressed",
            content:
              "Three main obstacles: CAPTCHA and anti-bot detection solved via human-like delays, rotating user-agents, and proxies; dynamic content loading managed through Selenium's JavaScript interaction; and handling large datasets efficiently while respecting rate limits.",
          },
          {
            heading: "Applications",
            content:
              "Market research, competitive analysis, talent acquisition, HR insights, and networking strategy development.",
          },
        ]}
        technologies={[
          "Selenium",
          "ChromeDriver",
          "Python",
          "BeautifulSoup",
          "JSON",
        ]}
        results={[
          "10,000+ profiles scraped",
          "50,000+ first-degree connections extracted",
          "~1.2 GB structured data output",
          "72-hour completion time",
          "99.5% accuracy rate",
        ]}
        relatedServices={[
          { title: "Data Mining & Scraping", href: "/services/data-mining" },
        ]}
      />
    </div>
  );
}
