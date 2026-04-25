import { PortfolioDetail } from "@/components/portfolio-detail";

export const metadata = {
  title: "IAMQR Mobile App with AI | Kredance",
  description:
    "A mobile application enabling users to share personal data through QR code technology, incorporating AI-powered features for content generation and enhancement.",
};

export default function IamqrPage() {
  return (
    <div className="flex-1 bg-white">
      <PortfolioDetail
        title="IAMQR Mobile App with AI"
        category="Mobile App"
        description="A mobile application enabling users to share personal data through QR code technology, incorporating AI-powered features for content generation and enhancement."
        image="https://www.kredance.com/wp-content/uploads/2024/10/DALL-E-2024-04-10-20.19.16-Create-a-logo-for-IAmQR-that-embodies-a-transition-from-a-QR-code-to-the-head-of-a-person-in-strict-black-and-white.-Begin-with-elements-of-a-QR-co-768x768-1-495x400.webp"
        sections={[
          {
            heading: "Project Overview",
            content:
              "The client sought a digital solution allowing users to create personalized QR codes for CVs and contact details, integrate AI tools for content generation, and provide a modern alternative to traditional business cards.",
          },
          {
            heading: "Our Solution",
            content:
              "The app includes instant QR code generation linked to personal data, AI-powered content generation to create and edit CVs, customization and privacy controls for shared information, and cross-platform compatibility on smartphones.",
          },
        ]}
        technologies={[
          "Mobile App Development",
          "AI Integration",
          "QR Code Generation",
          "Content Management",
        ]}
        results={[
          "Modern alternative to traditional business cards",
          "AI-driven CV creation and optimization",
          "User-controlled privacy for shared data",
          "Cross-platform compatibility",
        ]}
      />
    </div>
  );
}
