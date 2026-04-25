import { PortfolioDetail } from "@/components/portfolio-detail";

export const metadata = {
  title: "ConsoleGroup Web & Marketing | Kredance",
  description:
    "Kredance developed a modern, responsive website and comprehensive digital marketing campaign for ConsoleGroup.",
};

export default function ConsoleGroupPage() {
  return (
    <div className="flex-1 bg-white">
      <PortfolioDetail
        title="ConsoleGroup Web & Marketing"
        category="Website"
        description="Kredance developed a modern, responsive website and comprehensive digital marketing campaign for ConsoleGroup."
        image="https://www.kredance.com/wp-content/uploads/2024/10/ss-495x400.png"
        sections={[
          {
            heading: "Project Overview",
            content:
              "A modern responsive website was developed to showcase ConsoleGroup's brand, services, and client resources. Key features include a well-organized service section, secure client portal for personalized access, and a content hub for industry insights.",
          },
          {
            heading: "Marketing Campaign",
            content:
              "A comprehensive marketing campaign was launched to strengthen ConsoleGroup's digital presence, including targeted SEO strategies, content development, social media advertising, and keyword-focused optimization.",
          },
        ]}
        technologies={[
          "SEO",
          "Social Media Advertising",
          "Content Development",
          "Responsive Web Design",
        ]}
        results={[
          "Increased organic traffic through SEO",
          "Enhanced visibility and client engagement",
          "Expanded client base",
          "Generated new business leads",
        ]}
      />
    </div>
  );
}
