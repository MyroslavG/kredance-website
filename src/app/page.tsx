import { Hero } from "@/components/hero";
import { HomeCampaignFeature } from "@/components/home-campaign-feature";
import { createPageMetadata } from "@/lib/metadata";

const title = "Kredance | Websites, Campaigns & Automation";

export const metadata = createPageMetadata({
  path: "/",
  title,
  description:
    "Creative websites, campaigns, and automation built around your business. Start with a free website review: three practical improvements within one business day.",
});

export default function Home() {
  return (
    <div className="flex-1 bg-white">
      <Hero />
      <HomeCampaignFeature />
    </div>
  );
}
