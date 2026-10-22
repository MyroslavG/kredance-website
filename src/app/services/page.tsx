import { createPageMetadata } from "@/lib/metadata";
import { Services } from "@/components/services";

export const metadata = createPageMetadata({
  path: "/services",
  title: "Services | Kredance",
  description: "Explore websites and advertising from Kredance, with SEO, eCommerce, design, and automation to support your project.",
});

export default function ServicesPage() {
  return (
    <div className="flex-1 bg-white">
      <Services />
    </div>
  );
}
