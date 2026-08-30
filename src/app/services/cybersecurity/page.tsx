import { createPageMetadata } from "@/lib/metadata";
import { ServiceDetail } from "@/components/service-detail";
import { CybersecurityDemo } from "@/components/demos/cybersecurity-demo";

export const metadata = createPageMetadata({
  path: "/services/cybersecurity",
  title: "Cybersecurity Services | Kredance",
  description:
    "Protect your digital assets with enterprise-grade security solutions. Kredance provides comprehensive cybersecurity services from audits to ongoing monitoring.",
});

export default function CybersecurityPage() {
  return (
    <div className="flex-1 bg-white">
      <ServiceDetail
        title="Cybersecurity Services"
        subtitle="Protect What Matters Most"
        description="Kredance delivers enterprise-grade cybersecurity solutions tailored for growing businesses. From vulnerability assessments to real-time threat monitoring, we help you stay ahead of evolving cyber threats and safeguard your data, reputation, and customer trust."
        features={[
          {
            title: "Security Audits & Assessments",
            description:
              "Comprehensive evaluation of your infrastructure, applications, and processes to identify vulnerabilities and compliance gaps before attackers do.",
          },
          {
            title: "Penetration Testing",
            description:
              "Simulated real-world attacks against your systems conducted by certified professionals to uncover exploitable weaknesses and validate your defenses.",
          },
          {
            title: "Threat Monitoring & Response",
            description:
              "24/7 monitoring of your network and endpoints with rapid incident response protocols to detect, contain, and remediate threats in real time.",
          },
          {
            title: "Data Encryption & Access Control",
            description:
              "Implementation of encryption standards, role-based access control, and zero-trust architecture to protect sensitive data at rest and in transit.",
          },
          {
            title: "Compliance & Governance",
            description:
              "Guidance and implementation support for regulatory frameworks including SOC 2, GDPR, HIPAA, and PCI-DSS to keep your business compliant.",
          },
          {
            title: "Security Awareness Training",
            description:
              "Customized training programs that educate your team on phishing, social engineering, and security best practices to reduce human-factor risk.",
          },
        ]}
        process={[
          {
            step: "1",
            title: "Risk Assessment",
            description:
              "We conduct a thorough analysis of your digital environment, identifying assets, threats, and vulnerabilities across your entire attack surface.",
          },
          {
            step: "2",
            title: "Security Planning",
            description:
              "Based on findings, we develop a prioritized security roadmap with clear recommendations, timelines, and resource requirements.",
          },
          {
            step: "3",
            title: "Implementation",
            description:
              "Our team deploys security tools, configures monitoring systems, hardens infrastructure, and establishes incident response procedures.",
          },
          {
            step: "4",
            title: "Ongoing Protection",
            description:
              "Continuous monitoring, regular penetration tests, and quarterly security reviews ensure your defenses evolve alongside emerging threats.",
          },
        ]}
        relatedProjects={[
          { title: "National Car Washing Security", href: "/portfolio/car-washing-security", image: "https://www.kredance.com/wp-content/uploads/2024/10/pexels-bertellifotografia-28993080-1-495x400.jpg" },
          { title: "AI User Activity Plugin", href: "/portfolio/ai-user-activity-plugin", image: "https://www.kredance.com/wp-content/uploads/2024/10/pexels-pixabay-265667-495x400.jpg" },
        ]}
        demo={<CybersecurityDemo />}
      />
    </div>
  );
}
