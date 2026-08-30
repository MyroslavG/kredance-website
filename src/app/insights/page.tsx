import { createPageMetadata } from "@/lib/metadata";
import { Insights } from "@/components/insights";

export const metadata = createPageMetadata({
  path: "/insights",
  title: "Insights | Kredance",
  description:
    "AI insights, workshops, news, and automation knowledge sharing from Kredance. Join the list for practical updates and workshop invitations.",
});

export default function InsightsPage() {
  return (
    <div className="flex-1 bg-white">
      <Insights />
    </div>
  );
}
