import { PortfolioDetail } from "@/components/portfolio-detail";

export const metadata = {
  title: "Dzikus Media Mobile App | Kredance",
  description:
    "A cutting-edge news application delivering real-time updates with a user-friendly interface and personalized news feeds.",
};

export default function DzikusMediaAppPage() {
  return (
    <div className="flex-1 bg-white">
      <PortfolioDetail
        title="Dzikus Media Mobile App"
        category="Mobile App"
        description="A cutting-edge news application delivering real-time updates with a user-friendly interface and personalized news feeds."
        image="https://www.kredance.com/wp-content/uploads/2024/10/logo_dzikus-495x400.png"
        sections={[
          {
            heading: "Project Overview",
            content:
              "Dzikus Media is a cutting-edge news app designed to deliver real-time news updates directly to mobile devices. With a sleek, user-friendly interface, it ensures a seamless browsing experience, allowing users to stay informed on the go.",
          },
          {
            heading: "Key Features",
            content:
              "Instant push notifications for breaking news, offline reading capabilities, easy sharing options, advanced search and categorization functionality, and personalized news feeds for topic selection.",
          },
        ]}
        technologies={[
          "Mobile App Development",
          "iOS Development",
          "Push Notifications",
          "Offline Storage",
        ]}
        results={[
          "Real-time news delivery to mobile devices",
          "Seamless offline reading experience",
          "Personalized content curation",
          "Intuitive search and categorization",
        ]}
        liveUrl="https://apps.apple.com/ca/app/dzikus/id6736469358"
        relatedServices={[
          { title: "Mobile App Development", href: "/services/mobile-app-development" },
        ]}
      />
    </div>
  );
}
