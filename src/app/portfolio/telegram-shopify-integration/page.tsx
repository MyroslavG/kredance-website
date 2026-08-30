import { createPageMetadata } from "@/lib/metadata";
import { PortfolioDetail } from "@/components/portfolio-detail";

export const metadata = createPageMetadata({
  path: "/portfolio/telegram-shopify-integration",
  title: "Telegram × Shopify Integration | Kredance",
  description:
    "Kredance developed a seamless connection between Shopify and a custom Telegram bot for real-time customer engagement and order notifications.",
});

export default function TelegramShopifyIntegrationPage() {
  return (
    <div className="flex-1 bg-white">
      <PortfolioDetail
        title="Telegram × Shopify Integration"
        category="Integration"
        description="Kredance developed a seamless connection between Shopify and a custom Telegram bot for real-time customer engagement and order notifications."
        image="https://www.kredance.com/wp-content/uploads/2024/10/pexels-asphotograpy-887751-495x400.jpg"
        sections={[
          {
            heading: "Automated Order Notifications",
            content:
              "The bot sends automated alerts including order confirmations, shipping updates, and delivery tracking directly to customers via Telegram.",
          },
          {
            heading: "Customer Support Integration",
            content:
              "Customers can ask questions and receive instant responses without leaving the Telegram app, creating an efficient support channel.",
          },
          {
            heading: "Custom Commands",
            content:
              "Implemented commands allowing customers to quickly check their order status or browse product catalogs directly from the chat interface.",
          },
          {
            heading: "Personalized Alerts",
            content:
              "The integration provides product recommendations and promotional messages based on customer behavior and purchase history.",
          },
        ]}
        technologies={[
          "Shopify",
          "Telegram",
          "Custom Bot Development",
          "API Integration",
        ]}
        results={[
          "Improved customer satisfaction with immediate updates",
          "Streamlined store-to-customer communication",
          "Real-time order tracking via messaging",
          "Enhanced engagement through personalized alerts",
        ]}
        relatedServices={[
          { title: "Ecommerce Shop Development", href: "/services/ecommerce" },
          { title: "AI Integration", href: "/services/ai-integration" },
        ]}
      />
    </div>
  );
}
