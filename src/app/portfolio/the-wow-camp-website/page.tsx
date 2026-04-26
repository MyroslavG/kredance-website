import { PortfolioDetail } from "@/components/portfolio-detail";

export const metadata = {
  title: "The Wow Camp Website | Kredance",
  description:
    "Kredance built a website for The Wow Camp, a youth-focused summer camp in Ottawa, to showcase leadership programs and facilitate parent engagement.",
};

export default function TheWowCampWebsitePage() {
  return (
    <div className="flex-1 bg-white">
      <PortfolioDetail
        title="The Wow Camp Website"
        category="Website"
        description="Kredance built a website for The Wow Camp, a youth-focused summer camp in Ottawa, to showcase leadership programs and facilitate parent engagement."
        image="https://www.kredance.com/wp-content/uploads/2025/12/thewowcamp_logo-1-495x400.jpg"
        sections={[
          {
            heading: "Website Design & Development",
            content:
              "The site features a bright, engaging, and youth-friendly aesthetic reflecting the camp's energetic spirit. Navigation enables easy exploration of program details, schedules, philosophy, and registration information.",
          },
          {
            heading: "SEO Strategy",
            content:
              "Keyword optimization with terms like 'summer camp Canada' and 'youth leadership camp,' local SEO with Google Business Profile, and content marketing about camp activities and child development.",
          },
        ]}
        technologies={[
          "WordPress",
          "Google Business Profile",
          "SEO Optimization",
        ]}
        results={[
          "Website live and fully operational",
          "Effective communication of camp's mission",
          "Enhanced reach to families through targeted visibility",
        ]}
        liveUrl="https://www.thewowcamp.com/"
        relatedServices={[
          { title: "Website Development", href: "/services/website-development" },
          { title: "Website SEO", href: "/services/website-seo" },
        ]}
      />
    </div>
  );
}
