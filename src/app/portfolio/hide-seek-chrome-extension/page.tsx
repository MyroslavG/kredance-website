import { PortfolioDetail } from "@/components/portfolio-detail";

export const metadata = {
  title: "Hide & Seek Chrome Extension | Kredance",
  description:
    "A browser plugin for SymfonyLabs that integrates eBoss Recruitment CRM with LinkedIn via API, enabling automatic data synchronization for recruiters.",
};

export default function HideSeekChromeExtensionPage() {
  return (
    <div className="flex-1 bg-white">
      <PortfolioDetail
        title="Hide & Seek Chrome Extension"
        category="AI / Plugins"
        description="A browser plugin for SymfonyLabs that integrates eBoss Recruitment CRM with LinkedIn via API, enabling automatic data synchronization for recruiters."
        image="https://www.kredance.com/wp-content/uploads/2024/10/chrome-495x400.jpg"
        sections={[
          {
            heading: "Overview",
            content:
              "A powerful tool designed for recruiters and HR professionals, transforming the way they handle data. Seamlessly connects eBoss Recruitment CRM with LinkedIn through API integration, facilitating automatic candidate profile synchronization.",
          },
          {
            heading: "Core Benefits",
            content:
              "Automates tedious recruitment tasks, reduces manual data entry requirements, improves overall accuracy in candidate management, boosts efficiency and productivity, and enhances connectivity between systems.",
          },
        ]}
        technologies={[
          "Chrome Extension",
          "LinkedIn API",
          "eBoss CRM Integration",
          "Data Synchronization",
        ]}
        results={[
          "Eliminates repetitive recruitment tasks",
          "More efficient workflow for HR teams",
          "Seamless candidate profile management across platforms",
        ]}
      />
    </div>
  );
}
