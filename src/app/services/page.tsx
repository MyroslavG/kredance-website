import { Services } from "@/components/services";

export const metadata = {
  title: "Services | Kredance",
  description: "Explore our full suite of digital services - from AI automation and web development to SEO, eCommerce, and cybersecurity.",
};

export default function ServicesPage() {
  return (
    <div className="flex-1 bg-white">
      <Services />
    </div>
  );
}
