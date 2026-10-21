import { createPageMetadata } from "@/lib/metadata";
import { ServiceDetail } from "@/components/service-detail";
import { WebsiteBuilderDemo } from "@/components/demos/website-builder-demo";

export const metadata = createPageMetadata({
  path: "/services/website-development",
  title: "Website Design & Development | Kredance",
  description:
    "Website design and development around your business, content, and customer journey. Discuss a new website or get three practical improvements for your current site.",
});

export default function WebsiteDevelopmentPage() {
  return (
    <div className="flex-1 bg-white">
      <ServiceDetail
        title="Website Development"
        subtitle="Designed around your business. Built for your customers."
        description="We plan, design, and build a website around your content and the action you want visitors to take. Pages, integrations, and launch support are agreed before work begins."
        primaryCtaLabel="Discuss my website"
        secondaryCta={{
          label: "Get a free website review",
          href: "/contact?service=website-development&intent=review#inquiry-form",
        }}
        features={[
          {
            title: "Pages with a Clear Purpose",
            description:
              "We organize your services, work, and contact information into pages that help visitors understand your business and find their next step.",
          },
          {
            title: "Responsive Design",
            description:
              "Layouts, navigation, and forms designed for phones and larger screens, with checks across common screen sizes and browsers.",
          },
          {
            title: "Performance Optimization",
            description:
              "We optimize images, loading, and rendering, then check performance before launch to identify issues that could slow visitors down.",
          },
          {
            title: "Content You Can Update",
            description:
              "When you need to manage content, we include a suitable editing system in the scope and show your team how to update the agreed pages.",
          },
          {
            title: "Forms & Useful Integrations",
            description:
              "Enquiry forms, booking tools, or other integrations can be included around your workflow. We agree on the connections and test them before handoff.",
          },
          {
            title: "Accessibility & Standards",
            description:
              "We build with structured headings, labelled forms, and keyboard navigation, and check the agreed customer journeys for accessibility issues.",
          },
        ]}
        process={[
          {
            step: "1",
            title: "Agree on the Scope",
            description:
              "We define the goals, pages, content, integrations, timeline, and revisions before work begins, so you know what is included.",
          },
          {
            step: "2",
            title: "Review the Design",
            description:
              "You review the proposed layout and key screens before we build, with a clear opportunity to give feedback on the direction.",
          },
          {
            step: "3",
            title: "Build & Test",
            description:
              "We build the site and share a preview. Before launch, we check mobile layouts, forms, links, and the integrations included in your project.",
          },
          {
            step: "4",
            title: "Launch & Handoff",
            description:
              "We publish the site, verify the key customer journeys, and walk you through managing it. Ongoing support and improvements are agreed as part of the scope.",
          },
        ]}
        relatedProjects={[
          { title: "Skyline Flow Website & Ads", href: "/portfolio/skyline-flow" },
          { title: "White Beauty Space Website & SEO", href: "/portfolio/white-beauty-space" },
          { title: "Neon Vibez Website", href: "/portfolio/neon-vibez", image: "https://www.kredance.com/wp-content/uploads/2026/01/Neon-Vibez-Logo-411x400.png" },
          { title: "Tamar Film Website", href: "/portfolio/tamar-film-website", image: "https://www.kredance.com/wp-content/uploads/2025/12/tamarfilm_logo-e1766688086840-495x400.jpg" },
          { title: "Fidan Construction", href: "/portfolio/fidan-construction", image: "https://www.kredance.com/wp-content/uploads/2025/03/fidan1-495x400.png" },
          { title: "ConsoleGroup", href: "/portfolio/consolegroup", image: "https://www.kredance.com/wp-content/uploads/2024/10/ss-495x400.png" },
        ]}
        demo={<WebsiteBuilderDemo />}
      />
    </div>
  );
}
