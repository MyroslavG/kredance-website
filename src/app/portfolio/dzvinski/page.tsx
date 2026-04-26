import { PortfolioDetail } from "@/components/portfolio-detail";

export const metadata = {
  title: "DzvinSki | Kredance",
  description:
    "Kredance developed a conversion-focused website for DzvinSki, a ski and snowboard rental network in the Carpathians, emphasizing fast booking pathways and SEO optimization.",
};

export default function DzvinSkiPage() {
  return (
    <div className="flex-1 bg-white">
      <PortfolioDetail
        title="DzvinSki"
        category="Website"
        description="Kredance developed a conversion-focused website for DzvinSki, a ski and snowboard rental network in the Carpathians, emphasizing fast booking pathways and SEO optimization."
        image="https://www.kredance.com/wp-content/uploads/2026/01/bereg-495x400.png"
        sections={[
          {
            heading: "The Challenge",
            content:
              "The Bukovel ski market demands instant answers. Users need pricing, rental locations, online booking capability, and transfer assistance within minutes, primarily on mobile devices.",
          },
          {
            heading: "Rental-First Navigation",
            content:
              "Organized the site around actual search behavior with conversion-focused pages: equipment rental, pricing, online booking, and customer reviews — each aligned to specific decision stages.",
          },
          {
            heading: "Long-Tail SEO Strategy",
            content:
              "Targeted specific phrases like 'ski rental in Carpathians,' 'rental prices with discounts,' 'online equipment booking,' and 'kids ski rental' rather than generic keywords.",
          },
          {
            heading: "Multi-Language Structure",
            content:
              "Supports Ukrainian, English, Romanian, and Russian to expand organic reach across tourist and local segments.",
          },
        ]}
        technologies={[
          "WordPress",
          "Google Analytics",
          "Google Tag Manager",
          "Contact Form 7",
          "Multi-Language Support",
        ]}
        results={[
          "Users land on directly relevant pages",
          "Dedicated booking journey replaces generic contact processes",
          "Reviews provide social proof at decision points",
          "Scalable structure enables location and seasonal expansion",
        ]}
        relatedServices={[
          { title: "Website Development", href: "/services/website-development" },
          { title: "Website SEO", href: "/services/website-seo" },
        ]}
      />
    </div>
  );
}
