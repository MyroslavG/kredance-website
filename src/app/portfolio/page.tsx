import { createPageMetadata } from "@/lib/metadata";
import { Portfolio } from "@/components/portfolio";
import { portfolioProjects } from "@/lib/portfolio-projects";

export const metadata = createPageMetadata({
  path: "/portfolio",
  title: "Portfolio | Kredance",
  description: "Explore Kredance's website, ecommerce, mobile app and automation projects, including Skyline Flow, Kolo, Queen Cookie and White Beauty Space.",
});

export default function PortfolioPage() {
  return (
    <div className="flex-1 bg-white">
      <Portfolio projects={portfolioProjects} />
    </div>
  );
}
