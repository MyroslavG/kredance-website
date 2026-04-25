import { ServiceDetail } from "@/components/service-detail";

export const metadata = {
  title: "AI Integration | Kredance",
  description:
    "Seamlessly embed AI capabilities into your existing tech stack. Kredance integrates cutting-edge AI models and tools into your workflows.",
};

export default function AIIntegrationPage() {
  return (
    <div className="flex-1 bg-white">
      <ServiceDetail
        title="AI Integration"
        subtitle="Embed Intelligence Everywhere"
        description="Kredance bridges the gap between powerful AI capabilities and your existing business systems. We integrate large language models, computer vision, and machine learning tools directly into your tech stack, so your team can leverage AI without rebuilding from scratch."
        features={[
          {
            title: "LLM & GPT Integration",
            description:
              "Connect OpenAI, Claude, and other large language models to your applications for intelligent text generation, summarization, and conversational interfaces.",
          },
          {
            title: "API Development & Connectivity",
            description:
              "Custom API layers that connect AI services to your CRM, ERP, databases, and third-party platforms with secure, reliable data pipelines.",
          },
          {
            title: "Computer Vision Solutions",
            description:
              "Image recognition, object detection, and visual inspection systems integrated into your workflows for quality control, asset management, and more.",
          },
          {
            title: "Voice & Speech AI",
            description:
              "Speech-to-text, text-to-speech, and voice assistant integrations that enable natural language interactions across your products and services.",
          },
          {
            title: "Recommendation Engines",
            description:
              "Personalized recommendation systems that analyze user behavior and preferences to surface relevant products, content, or actions in real time.",
          },
          {
            title: "RAG & Knowledge Systems",
            description:
              "Retrieval-augmented generation pipelines that ground AI responses in your proprietary data, ensuring accurate and context-aware outputs.",
          },
        ]}
        process={[
          {
            step: "1",
            title: "Assessment",
            description:
              "We evaluate your current tech stack, data infrastructure, and business goals to identify the best AI integration opportunities.",
          },
          {
            step: "2",
            title: "Architecture",
            description:
              "Our team designs a scalable integration architecture, selecting the right AI models and defining data flows between systems.",
          },
          {
            step: "3",
            title: "Implementation",
            description:
              "We build the integration layer, connect APIs, configure models, and ensure seamless data exchange across your platforms.",
          },
          {
            step: "4",
            title: "Validation & Support",
            description:
              "Thorough testing, performance benchmarking, and ongoing support to ensure your AI integrations remain reliable and effective.",
          },
        ]}
      />
    </div>
  );
}
