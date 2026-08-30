import { createPageMetadata } from "@/lib/metadata";
import { PortfolioDetail } from "@/components/portfolio-detail";

export const metadata = createPageMetadata({
  path: "/portfolio/eboss-recruitment-crm",
  title: "eBoss Recruitment CRM Mobile App | Kredance",
  description:
    "A mobile recruitment platform helping recruiters manage candidate profiles, communicate with clients, and track job applications from a single interface.",
});

export default function EbossRecruitmentCrmPage() {
  return (
    <div className="flex-1 bg-white">
      <PortfolioDetail
        title="eBoss Recruitment CRM Mobile App"
        category="Mobile App"
        description="A mobile recruitment platform helping recruiters manage candidate profiles, communicate with clients, and track job applications from a single interface."
        image="https://www.kredance.com/wp-content/uploads/2024/10/pexels-karolina-grabowska-4968535-495x400.jpg"
        sections={[
          {
            heading: "Project Overview",
            content:
              "The app streamlines recruitment by keeping recruiters connected and efficient remotely. It consolidates candidate management, client communication, and application tracking into one unified mobile system.",
          },
          {
            heading: "Key Features",
            content:
              "Real-time access to recruitment database, instant messaging for seamless communication, advanced candidate search and filtering, task management tools for workflow organization, and mobile accessibility for remote recruitment work.",
          },
        ]}
        technologies={[
          "Mobile App Development",
          "iOS Development",
          "Real-Time Database",
          "Messaging Integration",
        ]}
        results={[
          "Streamlined recruitment workflows",
          "Remote access to candidate database",
          "Efficient communication with clients",
          "Organized task management on-the-go",
        ]}
        relatedServices={[
          { title: "Mobile App Development", href: "/services/mobile-app-development" },
        ]}
      />
    </div>
  );
}
