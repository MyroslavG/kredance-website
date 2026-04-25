import { PortfolioDetail } from "@/components/portfolio-detail";

export const metadata = {
  title: "AI User Activity Analysis Plugin | Kredance",
  description:
    "A WordPress plugin with AI-driven analysis that monitors user behavior, identifies suspicious activity, and provides real-time security insights.",
};

export default function AIUserActivityPluginPage() {
  return (
    <div className="flex-1 bg-white">
      <PortfolioDetail
        title="AI User Activity Analysis Plugin"
        category="AI / Plugins"
        description="A WordPress plugin with AI-driven analysis that monitors user behavior, identifies suspicious activity, and provides real-time security insights."
        image="https://www.kredance.com/wp-content/uploads/2024/10/pexels-pixabay-265667-495x400.jpg"
        sections={[
          {
            heading: "Project Overview",
            content:
              "The plugin tracks and analyzes user interactions on WordPress websites, detecting anomalies and potential security threats using AI-powered analysis.",
          },
          {
            heading: "Admin Dashboard",
            content:
              "A dedicated admin dashboard enables administrators to review activity logs and monitor user behavior patterns in real-time, with comprehensive activity trails and detailed logging.",
          },
        ]}
        technologies={[
          "WordPress",
          "AI-Powered Analysis",
          "Real-Time Monitoring",
          "Security Analytics",
        ]}
        results={[
          "Real-time activity monitoring for website security",
          "Quick detection of potential threats and anomalies",
          "Comprehensive activity trails and logging",
          "Enhanced administrator visibility into user behavior",
        ]}
      />
    </div>
  );
}
