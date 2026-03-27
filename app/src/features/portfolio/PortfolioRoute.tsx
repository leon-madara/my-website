import { Link, useParams } from "react-router-dom";
import { LongformCaseStudyRoute } from "./LongformCaseStudyRoute";
import { PortfolioBackground } from "./PortfolioBackground";
import { PortfolioLanding } from "./PortfolioLanding";
import "./portfolio.css";
import {
  getPortfolioLandingProjects,
  getPortfolioProject
} from "./portfolioContent";
import {
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

  return (
    <div className="portfolio-route">
      <PortfolioBackground variant={project?.template ?? "landing"} />

      {!projectSlug ? (
        <PortfolioLanding projects={getPortfolioLandingProjects()} />
      ) : project && isTabbedCaseStudyProject(project) ? (
        <TabbedCaseStudyRoute project={project} />
      ) : project && isLongformCaseStudyProject(project) ? (
        <LongformCaseStudyRoute project={project} />
      ) : (
        <PortfolioNotFound />
      )}
    </div>
  );
}
