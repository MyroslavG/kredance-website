import { createPageMetadata } from "@/lib/metadata";
import { Portfolio } from "@/components/portfolio";

export const metadata = createPageMetadata({
  path: "/portfolio",
  title: "Portfolio | Kredance",
  description: "See our featured work - AI-powered platforms, ecommerce solutions, mobile apps, and data dashboards delivering real results.",
});

export default function PortfolioPage() {
  return (
    <div className="flex-1 bg-white">
      <Portfolio />
    </div>
  );
}
