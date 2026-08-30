import { createPageMetadata } from "@/lib/metadata";
import { PortfolioDetail } from "@/components/portfolio-detail";

export const metadata = createPageMetadata({
  path: "/portfolio/brp-truck-advertising",
  title: "BRP Reseller Truck Advertising | Kredance",
  description:
    "A large-scale truck wrap design for a BRP reseller, creating an eye-catching mobile advertisement to promote the brand with focus on visibility and recognition.",
});

export default function BrpTruckAdvertisingPage() {
  return (
    <div className="flex-1 bg-white">
      <PortfolioDetail
        title="BRP Reseller Truck Advertising"
        category="Design"
        description="A large-scale truck wrap design for a BRP reseller, creating an eye-catching mobile advertisement to promote the brand with focus on visibility and recognition."
        image="https://www.kredance.com/wp-content/uploads/2024/10/pexels-amar-12983282-495x400.jpg"
        sections={[
          {
            heading: "Design Approach",
            content:
              "Bold and dynamic visuals incorporating high-resolution imagery of ATVs, snowmobiles, and watercraft to highlight product diversity. Brand alignment maintaining BRP's official color scheme, logos, and typography, with layout structured for visibility from distances.",
          },
          {
            heading: "Print-Optimized Design",
            content:
              "Vector-based graphics ensuring all elements remain sharp at large scales, vibrant premium color profiles for bright, attention-grabbing colors in outdoor conditions, and designed for high-quality vinyl wraps ensuring longevity and weather resistance.",
          },
        ]}
        technologies={[
          "Vector Graphics",
          "Print Design",
          "Large-Format Vinyl Wrap",
          "Premium Color Profiling",
        ]}
        results={[
          "Truck wrap functions as a moving billboard",
          "Striking visuals increasing brand awareness",
          "Drives sales among outdoor enthusiasts",
          "Effective multi-product showcase",
        ]}
        relatedServices={[
          { title: "Design", href: "/services/design" },
          { title: "Advertisement Creation", href: "/services/advertisement-creation" },
        ]}
      />
    </div>
  );
}
