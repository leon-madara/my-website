import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PortfolioEntrance } from "./PortfolioEntrance";
import {
  isLegacyAccordionCaseStudyProject,
  isLongformCaseStudyProject,
  isTabbedCaseStudyProject,
  PortfolioProject
} from "./portfolio.types";

interface PortfolioLandingProps {
  projects: PortfolioProject[];
}

function getProjectHref(project: PortfolioProject) {
  if (project.slug === "edumanage") {
    return "/edumanage.html";
  }

  if (isTabbedCaseStudyProject(project) || isLegacyAccordionCaseStudyProject(project)) {
    const firstSection = project.sections[0];
    const firstPage = firstSection.pages[0];
    return `/portfolio/${project.slug}?section=${firstSection.id}&page=${firstPage.id}`;
  }

  return `/portfolio/${project.slug}#${project.chapters[0]?.id ?? ""}`;
}

export function PortfolioLanding({ projects }: PortfolioLandingProps) {
  const [selectedSlug, setSelectedSlug] = useState(projects[0]?.slug ?? "");
  const [entranceReady, setEntranceReady] = useState(false);

  const selectedProject = useMemo(
    () => projects.find((project) => project.slug === selectedSlug) ?? projects[0],
    [projects, selectedSlug]
  );

  if (!selectedProject) {
    return null;
  }

  const chapterPreview = isTabbedCaseStudyProject(selectedProject)
    ? selectedProject.sections.map((section) => ({
        id: section.id,
        label: section.label,
        href: `/portfolio/${selectedProject.slug}?section=${section.id}&page=${section.pages[0].id}`
      }))
    : isLegacyAccordionCaseStudyProject(selectedProject)
      ? selectedProject.sections.map((section) => ({
          id: section.id,
          label: section.label,
          href:
            selectedProject.slug === "edumanage"
              ? `/edumanage.html#${section.id}`
              : `/portfolio/${selectedProject.slug}?section=${section.id}&page=${section.pages[0].id}`
        }))
    : selectedProject.chapters.map((chapter) => ({
        id: chapter.id,
        label: chapter.label,
        href: `/portfolio/${selectedProject.slug}#${chapter.id}`
      }));

  return (
    <section className="portfolio-landing">
      <PortfolioEntrance isActive onReadyChange={setEntranceReady} />

      <div
        className={`portfolio-landing__shell ${entranceReady ? "is-ready" : "is-hidden"}`}
      >
        <header className="portfolio-hero-card shell-card">
          <p className="portfolio-hero-card__eyebrow">Wave 2</p>
          <h1 className="portfolio-hero-card__title kenyan-gradient">
            Portfolio case studies, now routed in React.
          </h1>
          <p className="portfolio-hero-card__summary">
            The portfolio migration keeps the identity of the live experience,
            but turns the old in-place content swapping into real routes. Projects
            01 and 02 share a paged case-study template, while Project 03 keeps
            its legacy accordion-style structure.
          </p>
        </header>

        <div className="portfolio-project-toggles" role="tablist" aria-label="Portfolio projects">
          {projects.map((project) => (
            <button
              aria-controls={`project-preview-${project.slug}`}
              aria-selected={project.slug === selectedSlug}
              className={`portfolio-project-toggle ${project.slug === selectedSlug ? "is-active" : ""}`}
              key={project.slug}
              onClick={() => setSelectedSlug(project.slug)}
              role="tab"
              type="button"
            >
              <span className="portfolio-project-toggle__badge">{project.badge}</span>
              <span className="portfolio-project-toggle__label">{project.title}</span>
            </button>
          ))}
        </div>

        <div className="portfolio-landing__grid">
          <article
            className="portfolio-preview-card shell-card"
            id={`project-preview-${selectedProject.slug}`}
            role="tabpanel"
          >
            <div className="portfolio-preview-card__meta">
              <span className="portfolio-status-badge">{selectedProject.status}</span>
              <div className="portfolio-preview-card__details">
                <span>
                  <strong>Timeline</strong>
                  {selectedProject.timeline}
                </span>
                <span>
                  <strong>Role</strong>
                  {selectedProject.role}
                </span>
              </div>
            </div>

            <h2 className="portfolio-preview-card__title">{selectedProject.title}</h2>
            <p className="portfolio-preview-card__tagline">{selectedProject.tagline}</p>
            <p className="portfolio-preview-card__body">
              {selectedProject.preview.summary}
            </p>

            <div className="portfolio-tech-pills" role="list">
              {selectedProject.techStack.map((tech) => (
                <span className="portfolio-tech-pill" key={tech} role="listitem">
                  {tech}
                </span>
              ))}
            </div>

            <div className="portfolio-section-preview" aria-label="Case study sections">
              {chapterPreview.map((item) => (
                <Link
                  className="portfolio-section-preview__pill"
                  key={item.id}
                  to={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="portfolio-preview-card__actions">
              {selectedProject.slug === "edumanage" ? (
                <a className="btn-primary portfolio-action-button" href="/edumanage.html">
                  Open case study
                </a>
              ) : (
                <Link className="btn-primary portfolio-action-button" to={getProjectHref(selectedProject)}>
                  Open case study
                </Link>
              )}
              {selectedProject.links.live ? (
                <a
                  className="btn-secondary portfolio-action-button"
                  href={selectedProject.links.live}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Visit live product
                </a>
              ) : selectedProject.links.github ? (
                <a
                  className="btn-secondary portfolio-action-button"
                  href={selectedProject.links.github}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  View repository
                </a>
              ) : null}
            </div>
          </article>

          <aside className="portfolio-side-panel shell-card" aria-label="Project quick notes">
            <h2 className="portfolio-side-panel__title">Project highlights</h2>
            <ul className="portfolio-highlight-list">
              {selectedProject.preview.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>

            <div className="portfolio-side-panel__stack">
              {projects.map((project) => (
                project.slug === "edumanage" ? (
                  <a
                    className="portfolio-mini-card"
                    href="/edumanage.html"
                    key={project.slug}
                  >
                    <span className="portfolio-mini-card__badge">{project.badge}</span>
                    <div>
                      <h3>{project.title}</h3>
                      <p>{project.preview.highlights[0]}</p>
                      <span className="portfolio-mini-card__template">Vanilla case study</span>
                    </div>
                  </a>
                ) : (
                  <Link
                    className="portfolio-mini-card"
                    key={project.slug}
                    to={getProjectHref(project)}
                  >
                    <span className="portfolio-mini-card__badge">{project.badge}</span>
                    <div>
                      <h3>{project.title}</h3>
                      <p>{project.preview.highlights[0]}</p>
                      {isLongformCaseStudyProject(project) ? (
                        <span className="portfolio-mini-card__template">Long-form case study</span>
                      ) : isLegacyAccordionCaseStudyProject(project) ? (
                        <span className="portfolio-mini-card__template">Legacy accordion case study</span>
                      ) : (
                        <span className="portfolio-mini-card__template">Tabbed case study</span>
                      )}
                    </div>
                  </Link>
                )
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
