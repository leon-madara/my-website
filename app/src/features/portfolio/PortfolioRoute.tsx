import { Link, useParams } from "react-router-dom";
import { LongformCaseStudyRoute } from "./LongformCaseStudyRoute";
import { LegacyAccordionCaseStudyRoute } from "./LegacyAccordionCaseStudyRoute";
import { PortfolioBackground } from "./PortfolioBackground";
import "./portfolio.css";
import {
  getDefaultPortfolioProject,
  getPortfolioProject
} from "./portfolioContent";
import {
  isLegacyAccordionCaseStudyProject,
  isLongformCaseStudyProject,
  isTabbedCaseStudyProject
} from "./portfolio.types";
import { TabbedCaseStudyRoute } from "./TabbedCaseStudyRoute";

function PortfolioNotFound() {
  return (
    <section className="portfolio-not-found shell-card">
      <p className="portfolio-not-found__eyebrow">Portfolio</p>
      <h1>Case study not found.</h1>
      <p>
        The requested portfolio route does not exist in the React migration yet.
        Use the portfolio index to jump back into the canonical routed version.
      </p>
      <Link className="btn-primary portfolio-action-button" to="/portfolio">
        Return to portfolio
      </Link>
    </section>
  );
}

export function PortfolioRoute() {
  const { projectSlug } = useParams();
  const project = projectSlug ? getPortfolioProject(projectSlug) : null;
  const defaultProject = getDefaultPortfolioProject();
  const isTabbedRoute =
    !projectSlug ||
    (project &&
      (isTabbedCaseStudyProject(project) || isLegacyAccordionCaseStudyProject(project)));
  const routeVariantClass = isTabbedRoute
    ? "portfolio-route--tabbed"
    : project && isLongformCaseStudyProject(project)
      ? "portfolio-route--longform"
      : "portfolio-route--not-found";
  const backgroundVariant = projectSlug
    ? project?.template === "legacy-accordion-case-study"
      ? "tabbed-case-study"
      : project?.template ?? "tabbed-case-study"
    : "tabbed-case-study";

  return (
    <div className={`portfolio-route ${routeVariantClass}`}>
      <PortfolioBackground variant={backgroundVariant} />

      {!projectSlug ? (
        <TabbedCaseStudyRoute project={defaultProject} showEntrance />
      ) : project && isTabbedCaseStudyProject(project) ? (
        <TabbedCaseStudyRoute project={project} />
      ) : project && isLegacyAccordionCaseStudyProject(project) ? (
        <LegacyAccordionCaseStudyRoute project={project} />
      ) : project && isLongformCaseStudyProject(project) ? (
        <LongformCaseStudyRoute project={project} />
      ) : (
        <PortfolioNotFound />
      )}
    </div>
  );
}
