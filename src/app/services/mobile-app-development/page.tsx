import { ServiceDetail } from "@/components/service-detail";

export const metadata = {
  title: "Mobile App Development | Kredance",
  description:
    "Build exceptional mobile apps with Kredance. iOS, Android, and cross-platform development using React Native, with app store optimization and ongoing support.",
};

export default function MobileAppDevelopmentPage() {
  return (
    <div className="flex-1 bg-white">
      <ServiceDetail
        title="Mobile App Development"
        subtitle="Apps That Users Love"
        description="Kredance builds mobile applications that combine beautiful design with rock-solid engineering. From native iOS and Android apps to cross-platform solutions with React Native, we deliver performant, scalable mobile experiences that engage users and drive business results."
        features={[
          {
            title: "iOS Development",
            description:
              "Native Swift applications built to Apple's highest standards, leveraging platform-specific capabilities for the best possible user experience on iPhone and iPad.",
          },
          {
            title: "Android Development",
            description:
              "Native Kotlin applications optimized across the Android device ecosystem, with Material Design principles and seamless Google services integration.",
          },
          {
            title: "React Native & Cross-Platform",
            description:
              "Cost-effective cross-platform development that delivers near-native performance on both iOS and Android from a single codebase, accelerating time to market.",
          },
          {
            title: "Backend & API Development",
            description:
              "Scalable cloud backends, RESTful APIs, and real-time services that power your app's data, authentication, notifications, and third-party integrations.",
          },
          {
            title: "App Store Optimization",
            description:
              "Strategic ASO including keyword optimization, compelling store listings, screenshot design, and review management to maximize organic downloads.",
          },
          {
            title: "Ongoing Maintenance & Updates",
            description:
              "Post-launch support including OS compatibility updates, performance monitoring, bug fixes, and feature enhancements to keep your app competitive.",
          },
        ]}
        process={[
          {
            step: "1",
            title: "Discovery & Planning",
            description:
              "We define your app's core value proposition, map user journeys, select the right technology stack, and create a detailed project roadmap.",
          },
          {
            step: "2",
            title: "Design & Prototype",
            description:
              "Interactive wireframes and high-fidelity prototypes are built and tested with real users before a single line of production code is written.",
          },
          {
            step: "3",
            title: "Develop & Test",
            description:
              "Agile development sprints with continuous integration, automated testing, and regular demo builds so you see progress every week.",
          },
          {
            step: "4",
            title: "Launch & Iterate",
            description:
              "We manage the app store submission process, monitor launch metrics, and iterate based on real user feedback and analytics data.",
          },
        ]}
      />
    </div>
  );
}
