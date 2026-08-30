import { createPageMetadata } from "@/lib/metadata";
import { ServiceDetail } from "@/components/service-detail";
import { DesignDemo } from "@/components/demos/design-demo";

export const metadata = createPageMetadata({
  path: "/services/design",
  title: "Design | Kredance",
  description:
    "Elevate your brand with Kredance's professional design services. UI/UX design, brand identity, logo design, marketing materials, and scalable design systems.",
});

export default function DesignPage() {
  return (
    <div className="flex-1 bg-white">
      <ServiceDetail
        title="Design"
        subtitle="Where Aesthetics Meet Strategy"
        description="Great design is more than pixels — it is your brand's first impression, your product's usability, and your customer's experience. Kredance's design team crafts visually stunning, strategically grounded work that elevates every touchpoint of your business."
        features={[
          {
            title: "UI/UX Design",
            description:
              "User-centered interface design backed by research and testing. We create intuitive digital experiences that delight users and drive conversions.",
          },
          {
            title: "Brand Identity",
            description:
              "Comprehensive brand systems including visual language, tone of voice, color palettes, and typography that make your business instantly recognizable.",
          },
          {
            title: "Logo Design",
            description:
              "Distinctive, versatile logos crafted through an iterative process — from initial concepts through refinement to final delivery in every format you need.",
          },
          {
            title: "Marketing Materials",
            description:
              "Print and digital collateral including brochures, social media assets, presentations, and advertising creatives that maintain brand consistency.",
          },
          {
            title: "Design Systems",
            description:
              "Scalable component libraries and style guides that ensure visual consistency across your entire product ecosystem as your team and product grow.",
          },
          {
            title: "Prototyping & Testing",
            description:
              "Interactive prototypes that bring concepts to life before development begins, validated through real user testing to reduce risk and rework.",
          },
        ]}
        process={[
          {
            step: "1",
            title: "Research & Brief",
            description:
              "We immerse ourselves in your brand, audience, and competitive landscape to establish a clear creative direction.",
          },
          {
            step: "2",
            title: "Concept Exploration",
            description:
              "Multiple creative directions are explored and presented, with mood boards and initial concepts for your review and feedback.",
          },
          {
            step: "3",
            title: "Design & Iterate",
            description:
              "The chosen direction is refined through collaborative iteration, incorporating your feedback at every stage until the design is pixel-perfect.",
          },
          {
            step: "4",
            title: "Deliver & Support",
            description:
              "Final assets are delivered in all required formats with comprehensive guidelines, plus ongoing support for future needs.",
          },
        ]}
        relatedProjects={[
          { title: "BRP Truck Advertising", href: "/portfolio/brp-truck-advertising", image: "https://www.kredance.com/wp-content/uploads/2024/10/pexels-amar-12983282-495x400.jpg" },
          { title: "Restaurant PDF Menu Design", href: "/portfolio/restaurant-menu-design", image: "https://www.kredance.com/wp-content/uploads/2024/10/viber_image_2024-10-23_13-47-57-299-495x400.png" },
          { title: "Neon Vibez Website", href: "/portfolio/neon-vibez", image: "https://www.kredance.com/wp-content/uploads/2026/01/Neon-Vibez-Logo-411x400.png" },
        ]}
        demo={<DesignDemo />}
      />
    </div>
  );
}
