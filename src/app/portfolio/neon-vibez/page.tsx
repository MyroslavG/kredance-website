import { createPageMetadata } from "@/lib/metadata";
import { PortfolioDetail } from "@/components/portfolio-detail";

export const metadata = createPageMetadata({
  path: "/portfolio/neon-vibez",
  title: "Neon Vibez Website | Kredance",
  description:
    "A modern brand website built to showcase products with bold, visually engaging design and smooth user experience.",
});

export default function NeonVibezPage() {
  return (
    <div className="flex-1 bg-white">
      <PortfolioDetail
        title="Neon Vibez Website"
        category="Website"
        description="A modern brand website built to showcase products with bold, visually engaging design and smooth user experience."
        image="https://www.kredance.com/wp-content/uploads/2026/01/Neon-Vibez-Logo-411x400.png"
        sections={[
          {
            heading: "Project Overview",
            content:
              "A modern brand website built to showcase products with bold, visually engaging design and smooth UX. The site was developed with performance and clarity in mind, featuring clean navigation, mobile optimization, and a layout designed to convert visitors into customers.",
          },
          {
            heading: "Design & Development",
            content:
              "The website features a striking visual identity with carefully crafted typography, color schemes, and imagery that perfectly captures the Neon Vibez brand. Every element was designed to create an immersive browsing experience.",
          },
        ]}
        technologies={[
          "WordPress",
          "Google Analytics",
          "Google Tag Manager",
          "Responsive Design",
          "Google Fonts",
        ]}
        results={[
          "High-quality design reflecting brand identity",
          "Optimized performance across all devices",
          "Clean navigation enhancing user experience",
        ]}
        liveUrl="https://neonvibez.ca"
        relatedServices={[
          { title: "Website Development", href: "/services/website-development" },
          { title: "Design", href: "/services/design" },
        ]}
      />
    </div>
  );
}
