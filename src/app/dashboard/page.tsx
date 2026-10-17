import { createPageMetadata } from "@/lib/metadata";
import { LeadDashboard } from "@/components/lead-dashboard";
export const metadata = {
  ...createPageMetadata({
    path: "/dashboard",
    title: "Private Lead Dashboard | Kredance",
    description:
      "Private Kredance workspace for inquiries, follow-ups, and website engagement.",
  }),
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};
export default function DashboardPage() {
  return <LeadDashboard />;
}
