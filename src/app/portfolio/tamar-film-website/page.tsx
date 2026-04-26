import { PortfolioDetail } from "@/components/portfolio-detail";

export const metadata = {
  title: "Tamar Film Website | Kredance",
  description:
    "Kredance developed and optimized a website for Tamar Film, a creative production company specializing in cinematic video and visual content.",
};

export default function TamarFilmWebsitePage() {
  return (
    <div className="flex-1 bg-white">
      <PortfolioDetail
        title="Tamar Film Website"
        category="Website"
        description="Kredance developed and optimized a website for Tamar Film, a creative production company specializing in cinematic video and visual content."
        image="https://www.kredance.com/wp-content/uploads/2025/12/tamarfilm_logo-e1766688086840-495x400.jpg"
        sections={[
          {
            heading: "Website Design & Development",
            content:
              "The site features a visually driven, modern design that reflects the cinematic nature of the brand. It includes clean layouts, immersive visuals, and smooth navigation enabling visitors to explore services, portfolios, and contact details.",
          },
          {
            heading: "SEO Strategy",
            content:
              "Focused SEO approach including keyword optimization for terms like 'video production company' and 'commercial video services,' local SEO with Google Business Profile setup, and content marketing showcasing completed projects and behind-the-scenes content.",
          },
        ]}
        technologies={[
          "Website Design",
          "SEO Optimization",
          "Local Search Optimization",
          "Google Business Profile",
          "Content Marketing",
        ]}
        results={[
          "Live website showcasing cinematic portfolio",
          "Enhanced search visibility for video production terms",
          "Professional brand positioning established",
        ]}
        liveUrl="http://tamarfilm.com/"
        relatedServices={[
          { title: "Website Development", href: "/services/website-development" },
          { title: "Website SEO", href: "/services/website-seo" },
        ]}
      />
    </div>
  );
}
