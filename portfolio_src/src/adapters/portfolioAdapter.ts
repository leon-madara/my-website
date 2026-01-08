import type {
  ProjectData,
  ProjectInfo,
  ShowcaseProject,
  ShowcaseSection,
  ShowcasePage,
  AdaptedPortfolioData,
} from '../types/portfolio.types';

/**
 * Portfolio Data Adapter
 * 
 * This adapter transforms YOUR content data structure into the format
 * expected by portfolio-showcase components.
 * 
 * CONTENT (yours) → ADAPTER → DESIGN COMPONENTS (showcase)
 * 
 * Benefits:
 * - Keeps your data structure independent from showcase
 * - Allows showcase UI updates without breaking your content
 * - Makes it easy to swap out the design layer in the future
 * - Provides a single source of transformation logic
 * 
 * @example
 * ```typescript
 * import { adaptPortfolioData } from './adapters/portfolioAdapter';
 * import projectsData from './data/projectData';
 * 
 * // Transform YOUR content to showcase format
 * const { projects, projectsMap } = adaptPortfolioData(projectsData);
 * 
 * // Use with showcase components
 * <HorizontalScroller sections={projects[0].sections} />
 * ```
 */
class PortfolioAdapter {
  /**
   * Convert a single project from your format to showcase format
   * 
   * @param projectData - Your project data
   * @param badge - Display badge (e.g., '01', '02', '03')
   * @returns Showcase-formatted project
   */
  private adaptProject(
    projectData: ProjectInfo,
    badge: string
  ): ShowcaseProject {
    return {
      id: projectData.id,
      badge,
      title: projectData.name,
      summary: projectData.tagline,
      timeline: projectData.timeline,
      role: projectData.hero.role,
      status: projectData.status,
      highlights: this.extractHighlights(projectData),
      link: projectData.id === 'edumanage' ? 'edumanage.html' : undefined,
      sections: this.adaptSections(projectData),
    };
  }

  /**
   * Extract highlights from technical stack
   * Prioritizes the tech stack array, falls back to quickStats
   * 
   * @param project - Project data
   * @returns Array of highlight strings (max 4)
   */
  private extractHighlights(project: ProjectInfo): string[] {
    // Try to extract from technical stack first
    if (project.technical?.stack) {
      return project.technical.stack.slice(0, 4).map((item) => {
        // Format: "React (18+)" or "TypeScript (97%+ coverage)"
        if (item.version) {
          return `${item.name} (${item.version})`;
        }
        return item.name;
      });
    }

    // Fallback to tech stack string from quickStats
    if (project.quickStats.techStack) {
      return project.quickStats.techStack
        .split(',')
        .map((s) => s.trim())
        .slice(0, 4);
    }

    // Last resort: empty array
    return [];
  }

  /**
   * Convert your content sections to showcase page structure
   * 
   * This method maps your rich content structure to the flat
   * page-based structure expected by showcase components.
   * 
   * @param project - Project data
   * @returns Array of showcase sections with pages
   */
  private adaptSections(project: ProjectInfo): ShowcaseSection[] {
    const sections: ShowcaseSection[] = [];
    let pageCounter = 0;

    // ========================================================================
    // Section 1: Project Details
    // ========================================================================
    sections.push({
      id: 'details',
      title: 'Project Details',
      pages: [
        {
          id: pageCounter++,
          title: 'Overview',
          content: project.overview.hero,
        },
        {
          id: pageCounter++,
          title: 'Role & Team',
          content: `As ${project.hero.role}, I was responsible for delivering this ${project.timeline} project for ${project.hero.client}. Status: ${project.hero.status}.`,
        },
        {
          id: pageCounter++,
          title: 'Timeline',
          content:
            project.process.methodology ||
            `Completed in ${project.timeline}`,
        },
      ],
    });

    // ========================================================================
    // Section 2: Problem
    // ========================================================================
    if (project.challenge || project.overview.problem) {
      const problemPages: ShowcasePage[] = [
        {
          id: pageCounter++,
          title: 'The Challenge',
          content: project.overview.problem,
        },
      ];

      // Add individual problem points as pages
      if (project.challenge?.problems) {
        project.challenge.problems.forEach((problem, idx) => {
          problemPages.push({
            id: pageCounter++,
            title: `Challenge ${idx + 1}`,
            content: problem,
          });
        });
      }

      sections.push({
        id: 'problem',
        title: 'Problem',
        pages: problemPages,
      });
    }

    // ========================================================================
    // Section 3: Goal
    // ========================================================================
    if (project.solution || project.overview.solution) {
      const goalPages: ShowcasePage[] = [
        {
          id: pageCounter++,
          title: 'Objectives',
          content: project.overview.solution,
        },
      ];

      // Add solution benefits as pages
      if (project.solution?.benefits) {
        project.solution.benefits.forEach((benefit, idx) => {
          goalPages.push({
            id: pageCounter++,
            title: `Benefit ${idx + 1}`,
            content: benefit,
          });
        });
      }

      sections.push({
        id: 'goal',
        title: 'Goal',
        pages: goalPages,
      });
    }

    // ========================================================================
    // Section 4: Impact
    // ========================================================================
    if (project.impact) {
      sections.push({
        id: 'impact',
        title: 'Impact',
        pages: [
          {
            id: pageCounter++,
            title: 'Results',
            content: project.impact.metrics
              .map(
                (m) =>
                  `**${m.label}**: ${m.value}\n${m.description}`
              )
              .join('\n\n'),
          },
          {
            id: pageCounter++,
            title: 'Business Value',
            content: project.impact.businessValue,
          },
        ],
      });
    }

    // ========================================================================
    // Section 5: Early Adoption (Research)
    // ========================================================================
    if (project.research || project.process.research) {
      const researchInsights =
        project.research?.userInsights || project.process.research || [];

      sections.push({
        id: 'adoption',
        title: 'Early Adoption',
        pages: [
          {
            id: pageCounter++,
            title: 'User Research',
            content: researchInsights.join('\n\n'),
          },
        ],
      });
    }

    // ========================================================================
    // Section 6: Testing (Challenges)
    // ========================================================================
    if (project.technical?.challenges) {
      sections.push({
        id: 'testing',
        title: 'Testing',
        pages: project.technical.challenges.map((challenge) => ({
          id: pageCounter++,
          title: challenge.challenge,
          content: `**Problem:** ${challenge.problem}\n\n**Solution:** ${challenge.solution}\n\n**Result:** ${challenge.result}`,
        })),
      });
    }

    // ========================================================================
    // Section 7: Final Designs (Key Features)
    // ========================================================================
    if (project.overview.keyFeatures) {
      sections.push({
        id: 'designs',
        title: 'Final Designs',
        pages: project.overview.keyFeatures.map((feature) => ({
          id: pageCounter++,
          title: feature.title,
          content: `${feature.icon} ${feature.description}`,
        })),
      });
    }

    // ========================================================================
    // Section 8: Development (Technical)
    // ========================================================================
    if (project.technical) {
      const techPages: ShowcasePage[] = [
        {
          id: pageCounter++,
          title: 'Tech Stack',
          content: project.technical.stack
            .map(
              (item) =>
                `**${item.name}** (${item.version})\n${item.purpose}`
            )
            .join('\n\n'),
        },
        {
          id: pageCounter++,
          title: 'Architecture',
          content: project.technical.architecture,
        },
      ];

      // Add key decisions as pages
      if (project.technical.keyDecisions) {
        project.technical.keyDecisions.forEach((decision) => {
          techPages.push({
            id: pageCounter++,
            title: decision.question,
            content: decision.answer,
          });
        });
      }

      sections.push({
        id: 'development',
        title: 'Development',
        pages: techPages,
      });
    }

    // ========================================================================
    // Section 9: Future Steps
    // ========================================================================
    if (project.futureEnhancements || project.process.lessonsLearned) {
      const futurePages: ShowcasePage[] = [];

      if (project.futureEnhancements) {
        futurePages.push({
          id: pageCounter++,
          title: 'Roadmap',
          content: project.futureEnhancements.join('\n\n'),
        });
      }

      if (project.process.lessonsLearned) {
        futurePages.push({
          id: pageCounter++,
          title: 'Lessons',
          content: project.process.lessonsLearned.join('\n\n'),
        });
      }

      sections.push({
        id: 'future',
        title: 'Future Steps',
        pages: futurePages,
      });
    }

    return sections;
  }

  /**
   * Main adapter function - converts all projects
   * 
   * @param projectsData - Complete project data
   * @returns Adapted data with projects array and lookup map
   */
  public adaptPortfolioData(
    projectsData: ProjectData
  ): AdaptedPortfolioData {
    const projects: ShowcaseProject[] = [
      this.adaptProject(projectsData.eastleigh, '01'),
      this.adaptProject(projectsData.delivah, '02'),
      this.adaptProject(projectsData.edumanage, '03'),
    ];

    // Create lookup map for easy access by ID
    const projectsMap: Record<string, ShowcaseProject> = {};
    projects.forEach((project) => {
      projectsMap[project.id] = project;
    });

    return {
      projects,
      projectsMap,
    };
  }

  /**
   * Get a single adapted project by ID
   * 
   * @param projectsData - Complete project data
   * @param projectId - ID of project to retrieve
   * @returns Adapted project or undefined if not found
   */
  public getProject(
    projectsData: ProjectData,
    projectId: string
  ): ShowcaseProject | undefined {
    const adapted = this.adaptPortfolioData(projectsData);
    return adapted.projectsMap[projectId];
  }
}

/**
 * Singleton instance of the adapter
 * Use this for all transformations
 */
export const portfolioAdapter = new PortfolioAdapter();

/**
 * Convenience function for adapting portfolio data
 * 
 * @param projectsData - Your project data
 * @returns Adapted data ready for showcase components
 * 
 * @example
 * ```typescript
 * import { adaptPortfolioData } from './adapters/portfolioAdapter';
 * import projectsData from './data/projectData';
 * 
 * const { projects, projectsMap } = adaptPortfolioData(projectsData);
 * 
 * // Access by index
 * const firstProject = projects[0];
 * 
 * // Access by ID
 * const eastleigh = projectsMap['eastleigh'];
 * ```
 */
export function adaptPortfolioData(
  projectsData: ProjectData
): AdaptedPortfolioData {
  return portfolioAdapter.adaptPortfolioData(projectsData);
}

/**
 * Convenience function for getting a single project
 * 
 * @param projectsData - Your project data
 * @param projectId - ID of project to retrieve
 * @returns Adapted project or undefined
 * 
 * @example
 * ```typescript
 * import { getProject } from './adapters/portfolioAdapter';
 * import projectsData from './data/projectData';
 * 
 * const eastleigh = getProject(projectsData, 'eastleigh');
 * if (eastleigh) {
 *   console.log(eastleigh.sections);
 * }
 * ```
 */
export function getProject(
  projectsData: ProjectData,
  projectId: string
): ShowcaseProject | undefined {
  return portfolioAdapter.getProject(projectsData, projectId);
}

/**
 * Default export for convenience
 */
export default portfolioAdapter;
