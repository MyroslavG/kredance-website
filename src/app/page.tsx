import { Hero } from "@/components/hero";
import { createPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site";

const title = "Kredance | AI Automation, Web Development & Digital Marketing";

export const metadata = createPageMetadata({
  path: "/",
  title,
  description: siteConfig.description,
});

export default function Home() {
  return (
    <div className="flex-1 bg-white">
      <Hero />
    </div>
  );
}
