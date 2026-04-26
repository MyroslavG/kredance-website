import { PortfolioDetail } from "@/components/portfolio-detail";

export const metadata = {
  title: "Beauty Stories Shopify Store | Kredance",
  description:
    "Kredance developed a modern, user-friendly e-commerce platform for Beauty Stories using Shopify, focusing on brand identity and seamless shopping experience.",
};

export default function BeautyStoriesPage() {
  return (
    <div className="flex-1 bg-white">
      <PortfolioDetail
        title="Beauty Stories Shopify Store"
        category="Ecommerce"
        description="Kredance developed a modern, user-friendly e-commerce platform for Beauty Stories using Shopify, focusing on brand identity and seamless shopping experience."
        image="https://www.kredance.com/wp-content/uploads/2026/01/logo-e1768229610282-495x400.jpg"
        sections={[
          {
            heading: "Project Objective",
            content:
              "The objective was to establish a modern, easy-to-use e-commerce store reflecting the brand's identity while delivering a smooth shopping experience, with emphasis on infrastructure for online sales expansion.",
          },
          {
            heading: "Implementation",
            content:
              "Complete Shopify store configuration and theme customization with responsive layout design ensuring clean, professional appearance across devices. UX optimization including navigation, product categorization, and purchasing workflows.",
          },
          {
            heading: "Technical Setup",
            content:
              "Secure payment processing with shipping and tax configuration, essential operational integrations, and SEO implementation covering optimized page structure, metadata, and performance tuning.",
          },
        ]}
        technologies={[
          "Shopify",
          "Google Analytics",
          "Google Tag Manager",
          "SEO Optimization",
        ]}
        results={[
          "Ready-to-sell digital storefront operational",
          "Scalable architecture for growth",
          "Improved search engine visibility",
          "Faster load times achieved",
        ]}
        liveUrl="https://beautystories.ca/"
        relatedServices={[
          { title: "Ecommerce Shop Development", href: "/services/ecommerce" },
          { title: "Website SEO", href: "/services/website-seo" },
        ]}
      />
    </div>
  );
}
