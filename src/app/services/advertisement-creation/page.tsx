import { ServiceDetail } from "@/components/service-detail";

export const metadata = {
  title: "Advertisement Creation | Kredance",
  description:
    "Eye-catching ad campaigns across all platforms. Kredance creates data-driven advertisements that convert viewers into loyal customers.",
};

export default function AdvertisementCreationPage() {
  return (
    <div className="flex-1 bg-white">
      <ServiceDetail
        title="Advertisement Creation"
        subtitle="Campaigns That Convert"
        description="At Kredance, we craft high-impact advertising campaigns that cut through the noise and drive measurable results. From social media ads to display networks and video content, our team blends creative storytelling with data-driven targeting to maximize your return on every dollar spent."
        features={[
          {
            title: "Social Media Advertising",
            description:
              "Targeted campaigns across Facebook, Instagram, LinkedIn, and TikTok designed to reach your ideal audience with precision and drive meaningful engagement.",
          },
          {
            title: "Display & Programmatic Ads",
            description:
              "Visually striking banner and display ads distributed through programmatic networks to maximize reach and retarget visitors across the web.",
          },
          {
            title: "Video Ad Production",
            description:
              "Scroll-stopping video content optimized for every platform, from 6-second bumper ads to long-form brand storytelling that builds lasting connections.",
          },
          {
            title: "A/B Testing & Optimization",
            description:
              "Continuous creative testing across headlines, visuals, and calls-to-action to identify top-performing variations and improve conversion rates over time.",
          },
          {
            title: "Audience Research & Targeting",
            description:
              "Deep-dive audience analysis using demographic, behavioral, and psychographic data to build laser-focused targeting profiles for every campaign.",
          },
          {
            title: "Performance Analytics",
            description:
              "Comprehensive reporting dashboards that track impressions, clicks, conversions, and ROI so you always know exactly how your ad spend is performing.",
          },
        ]}
        process={[
          {
            step: "1",
            title: "Discovery & Strategy",
            description:
              "We learn your brand, goals, and audience to develop a tailored advertising strategy aligned with your business objectives.",
          },
          {
            step: "2",
            title: "Creative Development",
            description:
              "Our designers and copywriters produce compelling ad creatives, from static visuals to animated and video formats.",
          },
          {
            step: "3",
            title: "Launch & Targeting",
            description:
              "Campaigns go live with precise audience targeting, bid strategies, and placement optimization across chosen platforms.",
          },
          {
            step: "4",
            title: "Optimize & Scale",
            description:
              "We monitor performance daily, refine targeting, test new creatives, and scale winning campaigns to maximize your results.",
          },
        ]}
      />
    </div>
  );
}
