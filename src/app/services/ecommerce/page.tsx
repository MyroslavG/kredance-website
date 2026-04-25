import { ServiceDetail } from "@/components/service-detail";

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
      />
    </div>
  );
}
