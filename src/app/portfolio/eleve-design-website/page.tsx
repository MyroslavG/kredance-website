import { PortfolioDetail } from "@/components/portfolio-detail";

export const metadata = {
  title: "Eleve Design Website | Kredance",
  description:
    "Kredance created a modern website for Eleve Design, a Canadian design-build brand specializing in custom cabinetry and kitchen solutions.",
};

export default function EleveDesignWebsitePage() {
  return (
    <div className="flex-1 bg-white">
      <PortfolioDetail
        title="Eleve Design Website"
        category="Website"
        description="Kredance created a modern website for Eleve Design, a Canadian design-build brand specializing in custom cabinetry and kitchen solutions."
        image="https://www.kredance.com/wp-content/uploads/2025/12/elevedesign_logo-495x400.jpg"
        sections={[
          {
            heading: "Website Design & Development",
            content:
              "The website features a clean, minimalist design that reflects the brand's high-end positioning. The site emphasizes intuitive navigation allowing visitors to explore products, design philosophy, and contact details.",
          },
          {
            heading: "SEO Strategy",
            content:
              "Three core SEO initiatives: keyword optimization with terms like 'custom cabinetry' and 'kitchen design Canada'; local SEO with Google Business Profile; and content marketing about design processes, materials, and craftsmanship.",
          },
        ]}
        technologies={[
          "WordPress",
          "Google Analytics",
          "Google Business Profile",
        ]}
        results={[
          "Website live and fully operational",
          "Structured layouts showcasing brand craftsmanship",
          "Enhanced local search visibility",
        ]}
      />
    </div>
  );
}
