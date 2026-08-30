import { createPageMetadata } from "@/lib/metadata";
import { About } from "@/components/about";

export const metadata = createPageMetadata({
  path: "/about",
  title: "About Us | Kredance",
  description: "Learn about Kredance - your digital growth partner specializing in AI automation, custom web development, SEO, and digital marketing.",
});

export default function AboutPage() {
  return (
    <div className="flex-1 bg-white">
      <About />
    </div>
  );
}
