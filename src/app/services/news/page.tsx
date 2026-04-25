import { ServiceDetail } from "@/components/service-detail";

export const metadata = {
  title: "News & Insights | Kredance",
  description:
    "Stay ahead of the curve with Kredance's coverage of tech news, AI breakthroughs, digital marketing trends, and actionable industry insights.",
};

export default function NewsPage() {
  return (
    <div className="flex-1 bg-white">
      <ServiceDetail
        title="News & Insights"
        subtitle="Stay Informed, Stay Ahead"
        description="Kredance's news hub delivers timely coverage of the technologies and trends shaping the digital landscape. From AI breakthroughs and algorithm updates to emerging marketing strategies, our team distills the noise into actionable insights so you can make smarter business decisions."
        features={[
          {
            title: "Tech Industry Coverage",
            description:
              "In-depth reporting on the latest developments in software, cloud computing, and emerging technologies that impact your business.",
          },
          {
            title: "AI & Machine Learning Updates",
            description:
              "Stay current on AI advancements, new model releases, and practical applications of machine learning across industries.",
          },
          {
            title: "Digital Marketing Trends",
            description:
              "Analysis of shifting consumer behaviors, platform algorithm changes, and the strategies top brands are using to grow online.",
          },
          {
            title: "Industry Deep Dives",
            description:
              "Long-form analysis and expert commentary on the forces reshaping e-commerce, SaaS, healthcare tech, and more.",
          },
          {
            title: "Tool & Platform Reviews",
            description:
              "Honest, hands-on evaluations of the tools, platforms, and services that can give your business a competitive edge.",
          },
          {
            title: "Actionable Takeaways",
            description:
              "Every article includes clear next steps and recommendations you can apply to your own digital strategy immediately.",
          },
        ]}
        process={[
          {
            step: "1",
            title: "Research",
            description:
              "Our editorial team monitors hundreds of sources daily to identify the stories that matter most to digital businesses.",
          },
          {
            step: "2",
            title: "Analysis",
            description:
              "We go beyond headlines, adding expert context and data-driven analysis to help you understand the real impact.",
          },
          {
            step: "3",
            title: "Publication",
            description:
              "Content is reviewed for accuracy and clarity before being published on our blog and distributed to subscribers.",
          },
          {
            step: "4",
            title: "Engagement",
            description:
              "We welcome reader feedback and questions, fostering a community of informed digital professionals.",
          },
        ]}
      />
    </div>
  );
}
