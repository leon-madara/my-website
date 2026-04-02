import { eduManageProject } from "./eduManageProject";
import { eastleighProject } from "./eastleighProject";
import { legitLogisticsProject } from "./legitLogisticsProject";
import {
  isLegacyAccordionCaseStudyProject,
  isLongformCaseStudyProject,
  isTabbedCaseStudyProject,
  PortfolioProject,
  TabbedCaseStudyProject
} from "./portfolio.types";

export const portfolioProjects: PortfolioProject[] = [
  eastleighProject,
  legitLogisticsProject,
  eduManageProject
];

export const defaultPortfolioProjectSlug = eastleighProject.slug;

export const portfolioProjectMap = Object.fromEntries(
  portfolioProjects.map((project) => [project.slug, project])
) as Record<PortfolioProject["slug"], PortfolioProject>;

export function getPortfolioProject(slug: string) {
  return portfolioProjectMap[slug as keyof typeof portfolioProjectMap];
}

export function getPortfolioLandingProjects() {
  return portfolioProjects;
}

export function getDefaultPortfolioProject(): TabbedCaseStudyProject {
  const defaultProject = portfolioProjects.find(
    (project): project is TabbedCaseStudyProject =>
      isTabbedCaseStudyProject(project) && project.slug === defaultPortfolioProjectSlug
  );

  if (!defaultProject) {
    throw new Error("Default portfolio workspace project is missing.");
  }

  return defaultProject;
}

export function getPortfolioProjectHref(project: PortfolioProject) {
  if (isLongformCaseStudyProject(project)) {
    const firstChapter = project.chapters[0]?.id;
    return firstChapter
      ? `/portfolio/${project.slug}#${firstChapter}`
      : `/portfolio/${project.slug}`;
  }

  if (isLegacyAccordionCaseStudyProject(project)) {
    const firstSection = project.sections[0];
    const firstPage = firstSection.pages[0];
    const search = `?section=${firstSection.id}&page=${firstPage.id}`;
    return `/portfolio/${project.slug}${search}`;
  }

  const firstSection = project.sections[0];
  const firstPage = firstSection.pages[0];
  const search = `?section=${firstSection.id}&page=${firstPage.id}`;

  return project.slug === defaultPortfolioProjectSlug
    ? `/portfolio${search}`
    : `/portfolio/${project.slug}${search}`;
}
