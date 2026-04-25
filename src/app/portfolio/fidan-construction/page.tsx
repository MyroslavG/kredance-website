import { PortfolioDetail } from "@/components/portfolio-detail";

export const metadata = {
  title: "Fidan Construction Website | Kredance",
  description:
    "Kredance developed a comprehensive website for Fidan Construction, an Ottawa-based demolition and restoration company, with SEO and Google Ads implementation.",
};

export default function FidanConstructionPage() {
  return (
    <div className="flex-1 bg-white">
      <PortfolioDetail
        title="Fidan Construction Website"
        category="Website"
        description="Kredance developed a comprehensive website for Fidan Construction, an Ottawa-based demolition and restoration company, with SEO and Google Ads implementation."
        image="https://www.kredance.com/wp-content/uploads/2025/03/fidan1-495x400.png"
        sections={[
          {
            heading: "Company Overview",
            content:
              "Fidan Construction offers demolition, renovation, cleaning, asbestos removal, 24/7 emergency restoration, and mold removal services in Ottawa, Ontario. Established in 2018.",
          },
          {
            heading: "Website Design & Development",
            content:
              "The site features user-friendly navigation with sections for services, projects, and contact information. The design emphasizes usability and showcases the company's commitment to quality and customer satisfaction.",
          },
          {
            heading: "SEO Strategy",
            content:
              "Keyword optimization with location-specific terms like 'demolition services Ottawa' and 'mold removal Ottawa,' local SEO with Google My Business profile, and content marketing addressing customer questions.",
          },
          {
            heading: "Google Ads Campaign",
            content:
              "Targeted paid advertising campaigns focused on service-related and geographic keywords to attract qualified leads and convert them into satisfied customers.",
          },
        ]}
        technologies={[
          "Google My Business",
          "Google Ads",
          "SEO Optimization",
          "Responsive Web Design",
        ]}
        results={[
          "Well-positioned to serve the Ottawa community",
          "Integrated digital marketing strategies",
          "Enhanced online presence and lead generation",
        ]}
      />
    </div>
  );
}
