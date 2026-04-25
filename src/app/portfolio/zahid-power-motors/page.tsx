import { PortfolioDetail } from "@/components/portfolio-detail";

export const metadata = {
  title: "Zahid Power Motors | Kredance",
  description:
    "Kredance built an ecommerce site for Zahid Power Motors, a premium Ukrainian powersports dealer, combining high-performance development with specialized SEO strategies.",
};

export default function ZahidPowerMotorsPage() {
  return (
    <div className="flex-1 bg-white">
      <PortfolioDetail
        title="Zahid Power Motors"
        category="Ecommerce"
        description="Kredance built an ecommerce site for Zahid Power Motors, a premium Ukrainian powersports dealer, combining high-performance development with specialized SEO strategies."
        image="https://www.kredance.com/wp-content/uploads/2026/01/zpm-495x400.png"
        sections={[
          {
            heading: "The Vision",
            content:
              "Zahid Power Motors operates as a premium Ukrainian off-road and extreme sports retailer representing brands including BRP (Can-Am, Sea-Doo, Ski-Doo), KTM, Husqvarna, and CFMOTO. Kredance developed their website as both a high-converting shop and community resource.",
          },
          {
            heading: "Technical Solution",
            content:
              "Implementation focused on multi-brand navigation, a dynamic parts catalog for original spare parts and tuning accessories, and service booking integration for maintenance and diagnostics.",
          },
          {
            heading: "SEO Strategy",
            content:
              "Optimization targeted long-tail keywords across extreme adventure gear, expert off-road support, brand-specific authority, and niche accessories like Finntrail gear and ToBe equipment.",
          },
        ]}
        technologies={[
          "WordPress",
          "WooCommerce",
          "Google Analytics",
          "Contact Form 7",
        ]}
        results={[
          "Increased organic visibility for competitive search terms",
          "Enhanced ranking for brand-specific dealer services",
          "Strengthened connection between physical showroom and digital presence",
        ]}
      />
    </div>
  );
}
