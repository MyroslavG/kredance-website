import { Hero } from "@/components/hero";
import { HomeCampaignFeature } from "@/components/home-campaign-feature";
import { createPageMetadata } from "@/lib/metadata";

const title = "Kredance | Creative Websites & Advertising";

export const metadata = createPageMetadata({
  path: "/",
  title,
  description:
    "Websites that make an impression. Campaigns that start conversations. Kredance designs websites and creates advertising to help your business get noticed.",
});

export default function Home() {
  return (
    <div className="flex-1 bg-white">
      <Hero />
      <HomeCampaignFeature />
    </div>
  );
}
