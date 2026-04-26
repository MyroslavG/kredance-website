import { ServiceDetail } from "@/components/service-detail";

export const metadata = {
  title: "Small Business IT Package | Kredance",
  description:
    "Get your business online fast with Kredance's all-in-one IT package - domain registration, professional email, hosting, a starter website, and ongoing support.",
};

export default function SmallBusinessItPage() {
  return (
    <div className="flex-1 bg-white">
      <ServiceDetail
        title="Small Business IT Package"
        subtitle="Everything You Need to Launch and Grow"
        description="Starting or scaling a small business shouldn't mean juggling a dozen vendors. Kredance's Small Business IT Package bundles domain registration, professional email, reliable hosting, a polished starter website, and dedicated support into a single, affordable plan so you can focus on what you do best."
        features={[
          {
            title: "Domain Registration & Management",
            description:
              "We secure and manage your ideal domain name, handle DNS configuration, and ensure seamless renewals so your online identity is always protected.",
          },
          {
            title: "Professional Email Setup",
            description:
              "Custom branded email addresses (you@yourbusiness.com) configured with Google Workspace or Microsoft 365 for a credible, professional presence.",
          },
          {
            title: "Reliable Web Hosting",
            description:
              "Fast, secure hosting with SSL certificates, daily backups, and 99.9% uptime so your website is always available to customers.",
          },
          {
            title: "Starter Website",
            description:
              "A clean, mobile-responsive website with up to five pages, designed to showcase your services, capture leads, and rank on search engines.",
          },
          {
            title: "Ongoing Technical Support",
            description:
              "Dedicated support from real people who know your setup. Get help with updates, troubleshooting, and questions whenever you need it.",
          },
          {
            title: "Security & Maintenance",
            description:
              "Proactive monitoring, software updates, and security patches to keep your digital infrastructure safe and running smoothly.",
          },
        ]}
        process={[
          {
            step: "1",
            title: "Consultation",
            description:
              "We learn about your business, goals, and technical needs to recommend the right configuration for your IT setup.",
          },
          {
            step: "2",
            title: "Setup & Configuration",
            description:
              "Our team registers your domain, provisions hosting, configures email, and builds your starter website - typically within one week.",
          },
          {
            step: "3",
            title: "Review & Launch",
            description:
              "You review everything, request changes, and once approved we take your new digital presence live with zero downtime.",
          },
          {
            step: "4",
            title: "Ongoing Support",
            description:
              "After launch, we provide continuous maintenance, monitoring, and support so your technology never holds you back.",
          },
        ]}
        relatedProjects={[
          { title: "ConsoleGroup Web & Marketing", href: "/portfolio/consolegroup", image: "https://www.kredance.com/wp-content/uploads/2024/10/ss-495x400.png" },
          { title: "Fidan Construction", href: "/portfolio/fidan-construction", image: "https://www.kredance.com/wp-content/uploads/2025/03/fidan1-495x400.png" },
          { title: "Eleve Design Website", href: "/portfolio/eleve-design-website", image: "https://www.kredance.com/wp-content/uploads/2025/12/elevedesign_logo-495x400.jpg" },
        ]}
      />
    </div>
  );
}
