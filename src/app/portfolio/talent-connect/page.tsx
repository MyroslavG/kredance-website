import { createPageMetadata } from "@/lib/metadata";
import { PortfolioDetail } from "@/components/portfolio-detail";

export const metadata = createPageMetadata({
  path: "/portfolio/talent-connect",
  title: "Talent Connect Website | Kredance",
  description:
    "Kredance developed a job market platform connecting seekers and employers using rapid development methods to minimize costs while maintaining professional functionality.",
});

export default function TalentConnectPage() {
  return (
    <div className="flex-1 bg-white">
      <PortfolioDetail
        title="Talent Connect Website"
        category="Website"
        description="Kredance developed a job market platform connecting seekers and employers using rapid development methods to minimize costs while maintaining professional functionality."
        image="https://www.kredance.com/wp-content/uploads/2024/10/screencapture-talent-connect-pro-en-2024-10-08-15_14_17-e1728389780496-495x400.png"
        sections={[
          {
            heading: "Project Overview",
            content:
              "The team utilized the Weblium platform with rapid development capabilities to reduce expenses and accelerate deployment, benefiting from pre-built templates and cost-efficient integrated hosting.",
          },
          {
            heading: "SEO Optimization",
            content:
              "Strategy encompassed keyword research targeting recruitment sectors, optimized on-page elements including meta tags and keyword-rich content, and continuous performance monitoring resulting in significant organic traffic increases.",
          },
          {
            heading: "Ad Campaign",
            content:
              "Digital advertising combined Google Ads and Facebook Ads to increase exposure and drive targeted traffic, with targeted ad copy and ongoing optimization.",
          },
        ]}
        technologies={[
          "Weblium",
          "Google Ads",
          "Facebook Ads",
          "SEO Optimization",
        ]}
        results={[
          "40% increase in leads within first month",
          "Significant organic traffic increase within weeks",
          "Enhanced user engagement and job postings",
          "Cost savings reallocated toward marketing",
        ]}
        relatedServices={[
          { title: "Website Development", href: "/services/website-development" },
          { title: "Website SEO", href: "/services/website-seo" },
          { title: "Google Ads", href: "/services/google-ads" },
        ]}
      />
    </div>
  );
}
