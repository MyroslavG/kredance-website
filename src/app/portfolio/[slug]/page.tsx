import { notFound } from "next/navigation";
import { PortfolioDetail } from "@/components/portfolio-detail";
import { createPageMetadata } from "@/lib/metadata";
import { portfolioAdditions } from "@/lib/portfolio-additions";

export const dynamicParams = false;

export function generateStaticParams() {
  return portfolioAdditions.map(({ slug }) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

async function getProject(params: Props["params"]) {
  const { slug } = await params;
  const project = portfolioAdditions.find((item) => item.slug === slug);
  if (!project) notFound();
  return project;
}

export async function generateMetadata({ params }: Props) {
  const project = await getProject(params);
  return createPageMetadata({
    path: `/portfolio/${project.slug}`,
    title: `${project.title} | Kredance`,
    description: project.description,
  });
}

export default async function PortfolioProjectPage({ params }: Props) {
  const project = await getProject(params);
  return (
    <div className="flex-1 bg-white">
      <PortfolioDetail {...project} />
    </div>
  );
}
