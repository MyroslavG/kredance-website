import { createPageMetadata } from "@/lib/metadata";
import { ServiceDetail } from "@/components/service-detail";
import { DataMigrationDemo } from "@/components/demos/data-migration-demo";

export const metadata = createPageMetadata({
  path: "/services/data-migration",
  title: "Data Migration | Kredance",
  description:
    "Smooth, secure data transitions between platforms with zero downtime. Kredance handles complex data migrations so you can modernize without disruption.",
});

export default function DataMigrationPage() {
  return (
    <div className="flex-1 bg-white">
      <ServiceDetail
        title="Data Migration"
        subtitle="Move Fast Without Breaking Things"
        description="Kredance specializes in seamless data migration between platforms, databases, and cloud environments. Whether you are modernizing legacy systems, switching vendors, or consolidating data sources, we ensure every record transfers accurately, securely, and with minimal disruption to your operations."
        features={[
          {
            title: "Cloud Migration",
            description:
              "End-to-end migration of your data and applications to AWS, Azure, or Google Cloud with optimized architecture for performance and cost efficiency.",
          },
          {
            title: "Database Migration",
            description:
              "Schema conversion, data transformation, and migration between database systems including SQL Server, PostgreSQL, MongoDB, and more.",
          },
          {
            title: "Legacy System Modernization",
            description:
              "Extract data trapped in outdated systems and migrate it to modern platforms while preserving data integrity and business logic.",
          },
          {
            title: "Data Validation & Cleansing",
            description:
              "Automated validation pipelines that detect inconsistencies, duplicates, and errors during migration to ensure only clean data reaches your new system.",
          },
          {
            title: "Zero-Downtime Migration",
            description:
              "Phased migration strategies with real-time data synchronization that keep your business running uninterrupted throughout the transition.",
          },
          {
            title: "Post-Migration Support",
            description:
              "Comprehensive verification, performance tuning, and team training after migration to ensure a smooth transition and confident adoption.",
          },
        ]}
        process={[
          {
            step: "1",
            title: "Data Discovery",
            description:
              "We inventory your existing data sources, map relationships, and document schemas to build a complete picture of what needs to move.",
          },
          {
            step: "2",
            title: "Migration Planning",
            description:
              "A detailed migration plan is created covering timelines, transformation rules, rollback procedures, and risk mitigation strategies.",
          },
          {
            step: "3",
            title: "Execute & Validate",
            description:
              "Data is migrated in controlled phases with automated validation at each step to catch and resolve issues before they propagate.",
          },
          {
            step: "4",
            title: "Verify & Handoff",
            description:
              "Final reconciliation confirms data completeness and accuracy, followed by documentation and knowledge transfer to your team.",
          },
        ]}
        relatedProjects={[
          { title: "Australian Travel Data Mining", href: "/portfolio/australian-travel-data-mining", image: "https://www.kredance.com/wp-content/uploads/2024/10/aus-495x400.png" },
          { title: "Large-Scale CV Processing", href: "/portfolio/cv-processing", image: "https://www.kredance.com/wp-content/uploads/2024/10/pexels-cottonbro-7439127-495x400.jpg" },
        ]}
        demo={<DataMigrationDemo />}
      />
    </div>
  );
}
