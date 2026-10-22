import { createPageMetadata } from "@/lib/metadata";
import { ServiceDetail } from "@/components/service-detail";

export const metadata = createPageMetadata({
  path: "/services/advertisement-creation",
  title: "Advertising — Facebook, Google Ads & Creative | Kredance",
  description:
    "Facebook lead campaigns, Google Ads, and ad creative built around your offer. Explore our work and discuss your campaign with Kredance.",
});

export default function AdvertisementCreationPage() {
  return (
    <div className="flex-1 bg-white">
      <ServiceDetail
        title="Advertising"
        subtitle="The right message. A clear next step."
        description="Facebook lead campaigns, Google Ads, and creative made around your offer. We connect the ad to a clear next step, whether that’s an enquiry form or your website."
        primaryCtaLabel="Discuss my campaign"
        secondaryCta={{
          label: "See a campaign we built",
          href: "/portfolio/prime-metal-roofing#the-ad",
        }}
        features={[
          {
            title: "Facebook Lead Campaigns",
            description:
              "A campaign built around your offer, with video creative, an enquiry form, and a tested handoff to your team.",
          },
          {
            title: "Google Search Ads",
            description:
              "Keyword research, ad copy, campaign setup, and conversion tracking for people searching for your services.",
          },
          {
            title: "Ad Creative",
            description:
              "Copy, static designs, and video edits using your brand and project assets, prepared for the placements agreed in your brief.",
          },
          {
            title: "Tracking & Review",
            description:
              "We agree what counts as a useful enquiry, check tracking and lead delivery, and use the available campaign data to guide the next changes.",
          },
        ]}
        process={[
          {
            step: "1",
            title: "Agree on the Plan",
            description:
              "We define your offer, audience, channel, scope, and budget. Advertising spend is separate from our work and paid through your ad account.",
          },
          {
            step: "2",
            title: "Review the Creative",
            description:
              "You review the message, visuals, and call to action before launch. We confirm what assets and account access are needed.",
          },
          {
            step: "3",
            title: "Build & Test",
            description:
              "We set up the agreed campaign and check its destination, tracking, and enquiry flow with test submissions where relevant.",
          },
          {
            step: "4",
            title: "Launch & Review",
            description:
              "We launch with the approved budget and review the available results. Ongoing management, reporting, and creative updates are agreed in the scope.",
          },
        ]}
        relatedProjects={[
          { title: "Prime Metal Roofing — Facebook Lead Generation", href: "/portfolio/prime-metal-roofing", image: "/images/prime-metal-roofing-poster.jpg" },
          { title: "Fidan Construction — Website & Google Ads", href: "/portfolio/fidan-construction" },
          { title: "Skyline Flow Website & Ads", href: "/portfolio/skyline-flow" },
        ]}
      />
    </div>
  );
}
