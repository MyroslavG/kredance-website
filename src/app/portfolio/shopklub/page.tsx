import { PortfolioDetail } from "@/components/portfolio-detail";

export const metadata = {
  title: "ShopKlub Lead Generation | Kredance",
  description:
    "A UK-based platform connecting users with exclusive discounts from luxury retailers, designed to make luxury shopping accessible while driving lead generation.",
};

export default function ShopklubPage() {
  return (
    <div className="flex-1 bg-white">
      <PortfolioDetail
        title="ShopKlub Lead Generation"
        category="Ecommerce"
        description="A UK-based platform connecting users with exclusive discounts from luxury retailers, designed to make luxury shopping accessible while driving lead generation."
        image="https://www.kredance.com/wp-content/uploads/2014/12/logo-e1729615458837.png"
        sections={[
          {
            heading: "How ShopKlub Operates",
            content:
              "Users discover hidden discounts from luxury brands and premium boutiques, offering significant savings on high-end products. Discounts serve as part of lead generation, collecting user data and driving traffic and conversions for partner boutiques.",
          },
          {
            heading: "Impact",
            content:
              "Successfully blended the allure of luxury shopping with smart savings, positioning ShopKlub as a valuable tool for boutiques seeking to attract high-end customers. Made luxury goods more accessible while providing a strategic approach to growing leads.",
          },
        ]}
        technologies={[
          "Design",
          "Advertisement Creation",
          "AI Automation",
          "Lead Generation Strategy",
        ]}
        results={[
          "Connected luxury retailers with customers",
          "Established as lead generation tool for boutiques",
          "Made luxury goods more accessible",
          "Drove traffic and conversions for partners",
        ]}
      />
    </div>
  );
}
