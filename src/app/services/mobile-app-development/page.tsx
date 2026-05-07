import { ServiceDetail } from "@/components/service-detail";
import { MobileAppDemo } from "@/components/demos/mobile-app-demo";

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
        relatedProjects={[
          { title: "AUX Mobile App", href: "/portfolio/aux-mobile-app", image: "https://www.kredance.com/wp-content/uploads/2026/01/icon-495x400.png" },
          { title: "eBoss Recruitment CRM", href: "/portfolio/eboss-recruitment-crm", image: "https://www.kredance.com/wp-content/uploads/2024/10/pexels-karolina-grabowska-4968535-495x400.jpg" },
          { title: "Dzikus Media Mobile App", href: "/portfolio/dzikus-media-app", image: "https://www.kredance.com/wp-content/uploads/2024/10/logo_dzikus-495x400.png" },
          { title: "IAMQR Mobile App", href: "/portfolio/iamqr", image: "https://www.kredance.com/wp-content/uploads/2024/10/DALL-E-2024-04-10-20.19.16-Create-a-logo-for-IAmQR-that-embodies-a-transition-from-a-QR-code-to-the-head-of-a-person-in-strict-black-and-white.-Begin-with-elements-of-a-QR-co-768x768-1-495x400.webp" },
        ]}
        demo={<MobileAppDemo />}
      />
    </div>
  );
}
