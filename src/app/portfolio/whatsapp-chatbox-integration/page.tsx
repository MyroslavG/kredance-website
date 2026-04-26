import { PortfolioDetail } from "@/components/portfolio-detail";

export const metadata = {
  title: "WhatsApp Chatbox Integration | Kredance",
  description:
    "A messaging system integration for an airport taxi company enabling passengers to book rides and receive real-time updates through WhatsApp.",
};

export default function WhatsAppChatboxIntegrationPage() {
  return (
    <div className="flex-1 bg-white">
      <PortfolioDetail
        title="WhatsApp Chatbox Integration"
        category="Integration"
        description="A messaging system integration for an airport taxi company enabling passengers to book rides and receive real-time updates through WhatsApp."
        image="https://www.kredance.com/wp-content/uploads/2024/10/pexels-anton-8100-46924-495x400.jpg"
        sections={[
          {
            heading: "Project Overview",
            content:
              "The company implemented a chatbox messenger system to enhance customer communication. Passengers can easily book rides, inquire about services, and receive real-time updates through WhatsApp.",
          },
          {
            heading: "User Experience",
            content:
              "The interface prioritizes user-friendliness with instant response capabilities that reduce customer wait times, while the taxi company gains operational efficiency and streamlined booking management.",
          },
        ]}
        technologies={[
          "WhatsApp",
          "Chatbox Messenger",
          "API Integration",
          "Real-Time Messaging",
        ]}
        results={[
          "Enhanced customer communication",
          "Reduced wait times",
          "Improved operational efficiency",
          "Increased customer satisfaction",
        ]}
        relatedServices={[
          { title: "AI Integration", href: "/services/ai-integration" },
        ]}
      />
    </div>
  );
}
