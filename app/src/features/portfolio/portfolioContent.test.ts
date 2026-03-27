import { getPortfolioProject, portfolioProjects } from "./portfolioContent";
import {
  isLongformCaseStudyProject,
  isTabbedCaseStudyProject
} from "./portfolio.types";

describe("portfolioContent", () => {
  it("resolves every configured project slug", () => {
    expect(portfolioProjects).toHaveLength(3);

    for (const project of portfolioProjects) {
      expect(getPortfolioProject(project.slug)?.title).toBe(project.title);
    }
  });

  it("keeps Eastleigh and Legit Logistics in the tabbed template and EduManage in the long-form template", () => {
    const eastleigh = getPortfolioProject("eastleigh");
    const legit = getPortfolioProject("legit-logistics");
    const eduManage = getPortfolioProject("edumanage");

    expect(eastleigh && isTabbedCaseStudyProject(eastleigh)).toBe(true);
    expect(legit && isTabbedCaseStudyProject(legit)).toBe(true);
    expect(eduManage && isLongformCaseStudyProject(eduManage)).toBe(true);

    if (eastleigh && isTabbedCaseStudyProject(eastleigh)) {
      expect(eastleigh.sections[0].id).toBe("details");
      expect(eastleigh.sections[0].pages[0].id).toBe("overview");
    }

    if (eduManage && isLongformCaseStudyProject(eduManage)) {
      expect(eduManage.chapters.map((chapter) => chapter.id)).toEqual([
        "crisis",
        "complexity",
        "approach",
        "architecture",
        "results",
        "learnings"
      ]);
    }
  });
});
