import { eduManageProject } from "./eduManageProject";
import { eastleighProject } from "./eastleighProject";
import { legitLogisticsProject } from "./legitLogisticsProject";
import { PortfolioProject } from "./portfolio.types";

export const portfolioProjects: PortfolioProject[] = [
  eastleighProject,
  legitLogisticsProject,
  eduManageProject
];

export const portfolioProjectMap = Object.fromEntries(
  portfolioProjects.map((project) => [project.slug, project])
) as Record<PortfolioProject["slug"], PortfolioProject>;

export function getPortfolioProject(slug: string) {
  return portfolioProjectMap[slug as keyof typeof portfolioProjectMap];
}

export function getPortfolioLandingProjects() {
  return portfolioProjects;
}
