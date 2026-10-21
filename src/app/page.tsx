import { Hero } from "@/components/hero";
import { HomeCampaignFeature } from "@/components/home-campaign-feature";
import { createPageMetadata } from "@/lib/metadata";

const title = "Kredance | Websites & Lead Generation for Ottawa Contractors";

export const metadata = createPageMetadata({
  path: "/",
  title,
  description:
    "Websites for Ottawa contractors and service businesses. Start with a free website review: three practical improvements within one business day, no call required.",
});

export default function Home() {
  return (
    <div className="flex-1 bg-white">
      <Hero />
      <HomeCampaignFeature />
    </div>
  );
}
