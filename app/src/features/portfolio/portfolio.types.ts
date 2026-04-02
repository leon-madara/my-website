export interface PortfolioSeo {
  title: string;
  description: string;
  keywords: string[];
}

export interface PortfolioHero {
  eyebrow: string;
  intro: string;
}

export interface PortfolioLinkSet {
  github?: string;
  live?: string;
  demo?: string;
}

export interface PortfolioPageMetric {
  label: string;
  value: string;
  description?: string;
}

export interface PortfolioPageCallout {
  title: string;
  body: string;
}

export interface PortfolioPage {
  id: string;
  title: string;
  body: string[];
  media?: {
    label: string;
    hint: string;
  };
  metrics?: PortfolioPageMetric[];
  callouts?: PortfolioPageCallout[];
}

export interface PortfolioSection {
  id: string;
  label: string;
  number: string;
  pages: PortfolioPage[];
}

export interface PortfolioChapterStat {
  value: string;
  label: string;
  context?: string;
}

export interface PortfolioChapterCard {
  title: string;
  body: string;
  eyebrow?: string;
}

export type PortfolioBlock =
  | {
      type: "text";
      lead?: string;
      paragraphs: string[];
    }
  | {
      type: "stat-grid";
      items: PortfolioChapterStat[];
    }
  | {
      type: "bullet-list";
      title: string;
      items: string[];
    }
  | {
      type: "cards";
      title?: string;
      items: PortfolioChapterCard[];
    }
  | {
      type: "sequence";
      title: string;
      items: Array<{
        step: string;
        title: string;
        description: string;
      }>;
    };

export interface PortfolioChapter {
  id: string;
  label: string;
  blocks: PortfolioBlock[];
}

interface PortfolioProjectBase {
  slug: string;
  badge: string;
  title: string;
  tagline: string;
  status: string;
  timeline: string;
  role: string;
  techStack: string[];
  links: PortfolioLinkSet;
  hero: PortfolioHero;
  seo: PortfolioSeo;
}

export interface TabbedCaseStudyProject extends PortfolioProjectBase {
  template: "tabbed-case-study";
  preview: {
    summary: string;
    highlights: string[];
  };
  sections: PortfolioSection[];
}

export interface LegacyAccordionCaseStudyProject extends PortfolioProjectBase {
  template: "legacy-accordion-case-study";
  preview: {
    summary: string;
    highlights: string[];
  };
  sections: PortfolioSection[];
}

export interface LongformCaseStudyProject extends PortfolioProjectBase {
  template: "longform-case-study";
  preview: {
    summary: string;
    highlights: string[];
  };
  chapters: PortfolioChapter[];
}

export type PortfolioProject =
  | TabbedCaseStudyProject
  | LegacyAccordionCaseStudyProject
  | LongformCaseStudyProject;

export function isTabbedCaseStudyProject(
  project: PortfolioProject
): project is TabbedCaseStudyProject {
  return project.template === "tabbed-case-study";
}

export function isLegacyAccordionCaseStudyProject(
  project: PortfolioProject
): project is LegacyAccordionCaseStudyProject {
  return project.template === "legacy-accordion-case-study";
}

export function isLongformCaseStudyProject(
  project: PortfolioProject
): project is LongformCaseStudyProject {
  return project.template === "longform-case-study";
}
