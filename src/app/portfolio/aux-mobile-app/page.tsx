import { PortfolioDetail } from "@/components/portfolio-detail";

export const metadata = {
  title: "AUX Mobile App | Kredance",
  description:
    "A social media mobile app that lets people share the music they love and connect through messages, built with a focus on usability and performance.",
};

export default function AuxMobileAppPage() {
  return (
    <div className="flex-1 bg-white">
      <PortfolioDetail
        title="AUX Mobile App"
        category="Mobile App"
        description="A social media mobile app that lets people share the music they love and connect through messages, built with a focus on usability and performance."
        image="https://www.kredance.com/wp-content/uploads/2026/01/icon-495x400.png"
        sections={[
          {
            heading: "Project Overview",
            content:
              "Aux is a social media mobile app that lets people share the music they love and connect through messages. The application enables users to post favorite tracks, discover other listeners' music, and initiate discussions.",
          },
          {
            heading: "Development Approach",
            content:
              "Development prioritized usability and performance with smooth navigation, fast interactions, and a clean interface design for natural sharing and messaging experiences.",
          },
          {
            heading: "Services Provided",
            content:
              "Mobile App Development, Design, AI Integration, and AI Automation were all part of the comprehensive service package delivered to bring Aux from concept to launch.",
          },
        ]}
        technologies={[
          "Mobile App Development",
          "UI/UX Design",
          "AI Integration",
          "Cross-Platform Development",
        ]}
        results={[
          "Complete mobile product from concept through launch",
          "Seamless music sharing and messaging experience",
          "Clean, intuitive interface design",
        ]}
        relatedServices={[
          { title: "Mobile App Development", href: "/services/mobile-app-development" },
          { title: "AI Integration", href: "/services/ai-integration" },
        ]}
      />
    </div>
  );
}
