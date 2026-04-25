import { PortfolioDetail } from "@/components/portfolio-detail";

export const metadata = {
  title: "National Car Washing Security | Kredance",
  description:
    "Kredance completed a security project for a nationwide car wash service that suffered DDoS attacks and data loss, implementing protective measures to restore operations.",
};

export default function CarWashingSecurityPage() {
  return (
    <div className="flex-1 bg-white">
      <PortfolioDetail
        title="National Car Washing Security"
        category="Cybersecurity"
        description="Kredance completed a security project for a nationwide car wash service that suffered DDoS attacks and data loss, implementing protective measures to restore operations."
        image="https://www.kredance.com/wp-content/uploads/2024/10/pexels-bertellifotografia-28993080-1-495x400.jpg"
        sections={[
          {
            heading: "Blocking DDoS Attacks",
            content:
              "The service faced repeated DDoS attacks causing downtime. Response included traffic analysis to identify malicious patterns, deployment of cloud-based security tools and network defenses, and enhanced firewall configuration with improved rulesets.",
          },
          {
            heading: "Data Recovery",
            content:
              "Critical data was compromised during attacks. Recovery involved identifying viable backups, restoring customer information and transaction logs, and implementing automated real-time backup systems stored securely off-site.",
          },
          {
            heading: "Cloudflare Migration",
            content:
              "Migration to Cloudflare provided built-in DDoS mitigation, Web Application Firewall protection against SQL injections and cross-site scripting, and global CDN services improving performance.",
          },
        ]}
        technologies={[
          "DDoS Mitigation",
          "Cloud Security",
          "Cloudflare CDN & WAF",
          "Automated Backup Systems",
        ]}
        results={[
          "100% uptime with no service disruptions",
          "All critical data restored with robust backup protection",
          "Improved website speed and reliability",
        ]}
      />
    </div>
  );
}
