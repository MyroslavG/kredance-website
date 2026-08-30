import { createPageMetadata } from "@/lib/metadata";
import { PortfolioDetail } from "@/components/portfolio-detail";

export const metadata = createPageMetadata({
  path: "/portfolio/restaurant-menu-design",
  title: "Restaurant PDF Menu Design | Kredance",
  description:
    "A visually appealing PDF menu designed and optimized for professional color printing, balancing aesthetic appeal with functional design.",
});

export default function RestaurantMenuDesignPage() {
  return (
    <div className="flex-1 bg-white">
      <PortfolioDetail
        title="Restaurant PDF Menu Design"
        category="Design"
        description="A visually appealing PDF menu designed and optimized for professional color printing, balancing aesthetic appeal with functional design."
        image="https://www.kredance.com/wp-content/uploads/2024/10/viber_image_2024-10-23_13-47-57-299-495x400.png"
        sections={[
          {
            heading: "Design Approach",
            content:
              "The team used a clean, well-structured layout balancing text and imagery for readability, high-resolution dish photography, typography aligned with the restaurant's style combining modern and classic elements, and a color palette chosen to complement interior design.",
          },
          {
            heading: "Print-Optimized Design",
            content:
              "The design was built using the CMYK color space ideal for professional printing, optimized at 300 DPI ensuring sharp text and clear images, with proper bleed and margins for a polished edge-to-edge finish.",
          },
        ]}
        technologies={[
          "CMYK Color Model",
          "300 DPI Print Optimization",
          "PDF Format",
          "Typography Design",
        ]}
        results={[
          "Print-ready PDF functioning as brand extension",
          "Enhanced customer dining experience",
          "Edge-to-edge polished finish with sharp imagery",
        ]}
        relatedServices={[
          { title: "Design", href: "/services/design" },
        ]}
      />
    </div>
  );
}
