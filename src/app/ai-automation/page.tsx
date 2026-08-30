import { createPageMetadata } from "@/lib/metadata";
import { AIAutomation } from "@/components/ai-automation";

export const metadata = createPageMetadata({
  path: "/ai-automation",
  title: "AI Automation | Kredance",
  description: "Supercharge your business with custom AI solutions - chatbots, process automation, predictive analytics, and seamless AI integration.",
});

export default function AIAutomationPage() {
  return (
    <div className="flex-1 bg-nebulosity">
      <AIAutomation />
    </div>
  );
}
