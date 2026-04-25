import { ServiceDetail } from "@/components/service-detail";

export const metadata = {
  title: "AI Automation | Kredance",
  description:
    "Intelligent automation solutions that streamline operations and boost productivity. Kredance builds custom AI workflows tailored to your business.",
};

export default function AIAutomationPage() {
  return (
    <div className="flex-1 bg-white">
      <ServiceDetail
        title="AI Automation"
        subtitle="Work Smarter, Not Harder"
        description="Kredance helps businesses eliminate repetitive tasks and unlock new efficiencies with intelligent automation. We design and deploy custom AI-powered workflows that reduce manual effort, minimize errors, and free your team to focus on high-value work that drives growth."
        features={[
          {
            title: "Workflow Automation",
            description:
              "End-to-end automation of business processes, from lead nurturing and invoice processing to inventory management, using AI-driven decision logic.",
          },
          {
            title: "Intelligent Chatbots & Assistants",
            description:
              "Custom AI chatbots trained on your data that handle customer inquiries, qualify leads, and provide 24/7 support without human intervention.",
          },
          {
            title: "Document Processing",
            description:
              "Automated extraction, classification, and routing of data from documents, emails, and forms using advanced natural language processing.",
          },
          {
            title: "Predictive Analytics",
            description:
              "Machine learning models that analyze your historical data to forecast trends, detect anomalies, and surface actionable insights for better decisions.",
          },
          {
            title: "Email & Communication Automation",
            description:
              "Smart email sequences, automated responses, and communication workflows that maintain personalization at scale across your customer touchpoints.",
          },
          {
            title: "Custom AI Agent Development",
            description:
              "Purpose-built AI agents that autonomously handle complex, multi-step tasks, from research and data analysis to content generation and reporting.",
          },
        ]}
        process={[
          {
            step: "1",
            title: "Process Audit",
            description:
              "We map your existing workflows, identify bottlenecks, and pinpoint the highest-impact opportunities for automation.",
          },
          {
            step: "2",
            title: "Solution Design",
            description:
              "Our engineers architect a custom automation stack using the right combination of AI models, APIs, and integration tools.",
          },
          {
            step: "3",
            title: "Build & Test",
            description:
              "We develop, train, and rigorously test your automation workflows in a staging environment before going live.",
          },
          {
            step: "4",
            title: "Deploy & Iterate",
            description:
              "Automations are deployed into production with monitoring in place, and we continuously optimize based on real-world performance.",
          },
        ]}
      />
    </div>
  );
}
