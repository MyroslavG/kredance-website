import { createPageMetadata } from "@/lib/metadata";
import { ServiceDetail } from "@/components/service-detail";
import { SeoAdsDemo } from "@/components/demos/seo-ads-demo";

export const metadata = createPageMetadata({
  path: "/services/google-ads",
  title: "Google Ads Specialist | Kredance",
  description:
    "Maximize your advertising ROI with Kredance's Google Ads management. Expert PPC campaigns, keyword research, ad optimization, conversion tracking, and remarketing strategies.",
});

export default function GoogleAdsPage() {
  return (
    <div className="flex-1 bg-white">
      <ServiceDetail
        title="Google Ads Specialist"
        subtitle="Maximize Every Advertising Dollar"
        description="Stop wasting ad spend on clicks that don't convert. Kredance's certified Google Ads specialists build, manage, and optimize PPC campaigns that deliver measurable results — driving qualified traffic, lowering cost per acquisition, and scaling your revenue predictably."
        features={[
          {
            title: "PPC Campaign Management",
            description:
              "Full-service campaign setup and management across Search, Display, Shopping, and Performance Max — structured for maximum quality score and ROI.",
          },
          {
            title: "Keyword Research & Strategy",
            description:
              "Deep keyword analysis using proprietary tools and competitive data to target high-intent searches that align with your business goals.",
          },
          {
            title: "Ad Copy Optimization",
            description:
              "Compelling ad copy and creative assets continuously tested and refined through A/B experimentation to improve click-through and conversion rates.",
          },
          {
            title: "Conversion Tracking",
            description:
              "Precise tracking setup across Google Ads, Google Analytics, and your CRM so every lead and sale is attributed correctly to your campaigns.",
          },
          {
            title: "Remarketing Campaigns",
            description:
              "Strategic remarketing audiences that re-engage past visitors with tailored messaging, recovering lost conversions and increasing lifetime value.",
          },
          {
            title: "Reporting & Insights",
            description:
              "Transparent, actionable reports delivered weekly and monthly with clear metrics, trend analysis, and strategic recommendations for continuous improvement.",
          },
        ]}
        process={[
          {
            step: "1",
            title: "Audit & Research",
            description:
              "We audit your current ad accounts, analyze competitors, and conduct thorough keyword research to identify the highest-value opportunities.",
          },
          {
            step: "2",
            title: "Campaign Build",
            description:
              "Campaigns are structured from scratch with optimized ad groups, targeting, bidding strategies, and conversion tracking in place.",
          },
          {
            step: "3",
            title: "Optimize & Scale",
            description:
              "Continuous bid adjustments, negative keyword refinement, and ad testing drive down costs while increasing qualified traffic.",
          },
          {
            step: "4",
            title: "Report & Strategize",
            description:
              "Regular performance reviews and strategy sessions ensure your campaigns evolve with your business goals and market conditions.",
          },
        ]}
        relatedProjects={[
          { title: "Talent Connect", href: "/portfolio/talent-connect", image: "https://www.kredance.com/wp-content/uploads/2024/10/screencapture-talent-connect-pro-en-2024-10-08-15_14_17-e1728389780496-495x400.png" },
          { title: "Green-Agro", href: "/portfolio/green-agro", image: "https://www.kredance.com/wp-content/uploads/2024/10/greenagr-e1729533961289-495x400.png" },
          { title: "Fidan Construction", href: "/portfolio/fidan-construction", image: "https://www.kredance.com/wp-content/uploads/2025/03/fidan1-495x400.png" },
          { title: "ConsoleGroup", href: "/portfolio/consolegroup", image: "https://www.kredance.com/wp-content/uploads/2024/10/ss-495x400.png" },
        ]}
        demo={<SeoAdsDemo />}
      />
    </div>
  );
}
