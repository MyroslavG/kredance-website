import { ServiceDetail } from "@/components/service-detail";
import { EcommerceDemo } from "@/components/demos/ecommerce-demo";

export const metadata = {
  title: "Ecommerce Shop Development | Kredance",
  description:
    "Launch and scale your online store with Kredance. Shopify, WooCommerce, and custom ecommerce solutions with payment integration, inventory management, and conversion optimization.",
};

export default function EcommercePage() {
  return (
    <div className="flex-1 bg-white">
      <ServiceDetail
        title="Ecommerce Shop Development"
        subtitle="Build Stores That Sell"
        description="Kredance builds high-converting online stores engineered for growth. Whether you need a Shopify storefront, a WooCommerce build, or a fully custom ecommerce platform, we deliver fast, secure, and beautifully designed shopping experiences that turn browsers into buyers."
        features={[
          {
            title: "Shopify Development",
            description:
              "Custom Shopify themes, app integrations, and Shopify Plus solutions tailored to your brand — built for performance and ease of management.",
          },
          {
            title: "WooCommerce Solutions",
            description:
              "Flexible WordPress-powered stores with custom plugins, advanced product configurations, and seamless content-commerce integration.",
          },
          {
            title: "Custom Store Builds",
            description:
              "When off-the-shelf platforms fall short, we build bespoke ecommerce solutions with headless architectures and custom checkout flows.",
          },
          {
            title: "Payment Integration",
            description:
              "Secure, PCI-compliant payment processing with support for Stripe, PayPal, Apple Pay, and region-specific gateways to maximize checkout completion.",
          },
          {
            title: "Inventory Management",
            description:
              "Real-time inventory tracking, multi-warehouse support, and automated stock alerts integrated directly into your store and fulfillment workflow.",
          },
          {
            title: "Conversion Optimization",
            description:
              "Data-driven UX improvements, A/B testing, and performance tuning that reduce cart abandonment and increase average order value.",
          },
        ]}
        process={[
          {
            step: "1",
            title: "Strategy & Planning",
            description:
              "We analyze your products, audience, and revenue goals to recommend the right platform, features, and integration strategy.",
          },
          {
            step: "2",
            title: "Design & Build",
            description:
              "Custom storefront design and development with mobile-first responsiveness, fast load times, and intuitive navigation.",
          },
          {
            step: "3",
            title: "Integrate & Test",
            description:
              "Payment gateways, shipping providers, inventory systems, and marketing tools are integrated and rigorously tested end to end.",
          },
          {
            step: "4",
            title: "Launch & Grow",
            description:
              "We handle the launch, monitor performance, and provide ongoing optimization to help your store scale with confidence.",
          },
        ]}
        relatedProjects={[
          { title: "Beauty Stories Shopify Store", href: "/portfolio/beauty-stories", image: "https://www.kredance.com/wp-content/uploads/2026/01/logo-e1768229610282-495x400.jpg" },
          { title: "Zahid Power Motors", href: "/portfolio/zahid-power-motors", image: "https://www.kredance.com/wp-content/uploads/2026/01/zpm-495x400.png" },
          { title: "Telegram × Shopify Integration", href: "/portfolio/telegram-shopify-integration", image: "https://www.kredance.com/wp-content/uploads/2024/10/pexels-asphotograpy-887751-495x400.jpg" },
          { title: "ShopKlub Lead Generation", href: "/portfolio/shopklub", image: "https://www.kredance.com/wp-content/uploads/2014/12/logo-e1729615458837.png" },
          { title: "Shopify Loyalty Program Plugin", href: "/portfolio/shopify-loyalty-plugin", image: "https://www.kredance.com/wp-content/uploads/2024/10/pexels-shoper-pl-550490863-17485352-495x400.jpg" },
        ]}
        demo={<EcommerceDemo />}
      />
    </div>
  );
}
