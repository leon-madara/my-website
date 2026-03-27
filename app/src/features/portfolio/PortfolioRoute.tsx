import { useParams } from "react-router-dom";
import { PageIntro } from "../../shared/PageIntro";

export function PortfolioRoute() {
  const { projectSlug } = useParams();

  return (
    <div className="page-content">
      <PageIntro
        eyebrow="Wave 2"
        title={
          projectSlug
            ? `Project route scaffold: ${projectSlug}`
            : "Portfolio migration will build on typed source data"
        }
        summary="The portfolio route now shares the global React shell while keeping the live portfolio untouched. The next portfolio work will connect typed data from portfolio_src to real routed content."
      >
        <div className="panel-grid">
          <article className="panel">
            <h2>Canonical source</h2>
            <p>
              `portfolio_src` is the baseline for project data and adapters.
              `public/portfolio_build` becomes generated output only.
            </p>
          </article>
          <article className="panel">
            <h2>Target routes</h2>
            <p>
              `/portfolio` will own the portfolio shell, and
              `/portfolio/:projectSlug` will render individual case studies.
            </p>
          </article>
        </div>
      </PageIntro>
    </div>
  );
}
