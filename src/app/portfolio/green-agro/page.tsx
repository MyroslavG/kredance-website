import { PortfolioDetail } from "@/components/portfolio-detail";

export const metadata = {
  title: "Green-Agro Website & Brand Advertising | Kredance",
  description:
    "Kredance partnered with a leading Ukrainian food ingredient supplier to develop their website and execute strategic advertising campaigns on Facebook and Google.",
};

export default function GreenAgroPage() {
  return (
    <div className="flex-1 bg-white">
      <PortfolioDetail
        title="Green-Agro Website & Brand Advertising"
        category="Website"
        description="Kredance partnered with a leading Ukrainian food ingredient supplier to develop their website and execute strategic advertising campaigns on Facebook and Google."
        image="https://www.kredance.com/wp-content/uploads/2024/10/greenagr-e1729533961289-495x400.png"
        sections={[
          {
            heading: "Website Development",
            content:
              "Created a modern, user-friendly site featuring professional design, responsive functionality across all devices, a comprehensive searchable product catalog, bilingual support in Ukrainian and English, and SEO optimization for food industry keywords.",
          },
          {
            heading: "Facebook Campaigns",
            content:
              "Visually appealing ads showcasing products and services with advanced targeting of food manufacturers, suppliers, and B2B clients, plus regular performance monitoring and optimization.",
          },
          {
            heading: "Google Ads Campaign",
            content:
              "Search and Display ads targeting potential customers with keyword research for food ingredients and supply chain services, geotargeting focused on key regions, and continuous refinement based on performance data.",
          },
        ]}
        technologies={[
          "Facebook Ads",
          "Google Ads",
          "SEO",
          "Responsive Web Design",
          "Bilingual Implementation",
        ]}
        results={[
          "Increased brand visibility and customer engagement",
          "Substantial uptick in web traffic",
          "Successful lead generation expanding client network",
          "Strengthened market position in food ingredients",
        ]}
        relatedServices={[
          { title: "Website Development", href: "/services/website-development" },
          { title: "Website SEO", href: "/services/website-seo" },
          { title: "Advertisement Creation", href: "/services/advertisement-creation" },
        ]}
      />
    </div>
  );
}
