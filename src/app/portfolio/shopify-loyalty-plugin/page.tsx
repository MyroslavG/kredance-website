import { PortfolioDetail } from "@/components/portfolio-detail";

export const metadata = {
  title: "Shopify Loyalty Program Plugin | Kredance",
  description:
    "A Shopify plugin enabling merchants to build personalized loyalty programs where customers earn points for purchases, referrals, and engagement.",
};

export default function ShopifyLoyaltyPluginPage() {
  return (
    <div className="flex-1 bg-white">
      <PortfolioDetail
        title="Shopify Loyalty Program Plugin"
        category="AI / Plugins"
        description="A Shopify plugin enabling merchants to build personalized loyalty programs where customers earn points for purchases, referrals, and engagement."
        image="https://www.kredance.com/wp-content/uploads/2024/10/pexels-shoper-pl-550490863-17485352-495x400.jpg"
        sections={[
          {
            heading: "Key Features",
            content:
              "The plugin offers a flexible point structure where merchants define how points are earned and redeemed including bonus points during promotions, tiered membership levels to incentivize engagement, seamless integration with existing Shopify stores, real-time analytics with insights on customer engagement, and customizable email and in-app notifications.",
          },
          {
            heading: "Impact",
            content:
              "The solution enhances customer retention and drives increased sales through purchase incentives. Implementation strengthens merchant-customer relationships, building brand loyalty and supporting long-term business growth.",
          },
        ]}
        technologies={[
          "Shopify",
          "Plugin Development",
          "Real-Time Analytics",
          "Email Automation",
        ]}
        results={[
          "Enhanced customer retention",
          "Increased repeat purchases",
          "Stronger brand loyalty through incentives",
          "Real-time engagement measurement",
        ]}
        relatedServices={[
          { title: "Ecommerce Shop Development", href: "/services/ecommerce" },
          { title: "Universal Plugin Solutions", href: "/services/universal-plugin-solutions" },
          { title: "AI Automation", href: "/services/ai-automation" },
        ]}
      />
    </div>
  );
}
