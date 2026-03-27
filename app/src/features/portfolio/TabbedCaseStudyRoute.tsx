import {
  MouseEvent as ReactMouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { TabbedCaseStudyProject } from "./portfolio.types";

interface TabbedCaseStudyRouteProps {
  project: TabbedCaseStudyProject;
}

export function TabbedCaseStudyRoute({
  project
}: TabbedCaseStudyRouteProps) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const prefersReducedMotion = useReducedMotion();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const resolvedState = useMemo(() => {
    const fallbackSection = project.sections[0];
    const requestedSectionId = searchParams.get("section");
    const section =
      project.sections.find((item) => item.id === requestedSectionId) ??
      fallbackSection;

    const requestedPageId = searchParams.get("page");
    const page =
      section.pages.find((item) => item.id === requestedPageId) ??
      section.pages[0];

    return {
      section,
      page,
      needsNormalization:
        requestedSectionId !== section.id || requestedPageId !== page.id
    };
  }, [project.sections, searchParams]);

  const flattenedPages = useMemo(
    () =>
      project.sections.flatMap((section) =>
        section.pages.map((page) => ({
          page,
          section
        }))
      ),
    [project.sections]
  );

  const currentIndex = flattenedPages.findIndex(
    (entry) =>
      entry.section.id === resolvedState.section.id &&
      entry.page.id === resolvedState.page.id
  );
  const previousEntry = currentIndex > 0 ? flattenedPages[currentIndex - 1] : null;
  const nextEntry =
    currentIndex >= 0 && currentIndex < flattenedPages.length - 1
      ? flattenedPages[currentIndex + 1]
      : null;

  useEffect(() => {
    if (!resolvedState.needsNormalization) {
      return;
    }

    setSearchParams(
      {
        page: resolvedState.page.id,
        section: resolvedState.section.id
      },
      { replace: true }
    );
  }, [
    resolvedState.needsNormalization,
    resolvedState.page.id,
    resolvedState.section.id,
    setSearchParams
  ]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (dropdownRef.current?.contains(event.target as Node)) {
        return;
      }

      setOpenDropdownId(null);
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isFormField =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        target?.isContentEditable;

      if (isFormField) {
        return;
      }

      if (event.key === "ArrowLeft" && previousEntry) {
        event.preventDefault();
        setSearchParams({
          page: previousEntry.page.id,
          section: previousEntry.section.id
        });
      }

      if (event.key === "ArrowRight" && nextEntry) {
        event.preventDefault();
        setSearchParams({
          page: nextEntry.page.id,
          section: nextEntry.section.id
        });
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [nextEntry, previousEntry, setSearchParams]);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [
    location.pathname,
    prefersReducedMotion,
    resolvedState.page.id,
    resolvedState.section.id
  ]);

  const navigateTo = (sectionId: string, pageId: string) => {
    setSearchParams({
      page: pageId,
      section: sectionId
    });
    setOpenDropdownId(null);
  };

  const handleSectionButton = (
    event: ReactMouseEvent<HTMLButtonElement>,
    sectionId: string
  ) => {
    event.preventDefault();
    setOpenDropdownId((current) => (current === sectionId ? null : sectionId));
  };

  return (
    <section className="tabbed-case-study">
      <header className="portfolio-project-header shell-card">
        <p className="portfolio-project-header__eyebrow">{project.hero.eyebrow}</p>
        <h1 className="portfolio-project-header__title">{project.title}</h1>
        <p className="portfolio-project-header__intro">{project.hero.intro}</p>

        <div
          className="portfolio-project-toggles portfolio-project-toggles--compact"
          role="navigation"
          aria-label="Portfolio projects"
        >
          <Link
            className="portfolio-project-toggle"
            to="/portfolio/eastleigh?section=details&page=overview"
          >
            <span className="portfolio-project-toggle__badge">01</span>
            <span className="portfolio-project-toggle__label">Eastleigh Turf Flow</span>
          </Link>
          <Link
            className="portfolio-project-toggle"
            to="/portfolio/legit-logistics?section=details&page=overview"
          >
            <span className="portfolio-project-toggle__badge">02</span>
            <span className="portfolio-project-toggle__label">Legit Logistics</span>
          </Link>
          <Link className="portfolio-project-toggle" to="/portfolio/edumanage#crisis">
            <span className="portfolio-project-toggle__badge">03</span>
            <span className="portfolio-project-toggle__label">EduManage SMS</span>
          </Link>
        </div>
      </header>

      <div
        className="portfolio-section-row"
        ref={dropdownRef}
        role="navigation"
        aria-label={`${project.title} case study sections`}
      >
        {project.sections.map((section) => (
          <div
            className={`portfolio-section-pill ${section.id === resolvedState.section.id ? "is-active" : ""} ${openDropdownId === section.id ? "is-open" : ""}`}
            key={section.id}
          >
            <button
              aria-expanded={openDropdownId === section.id}
              aria-haspopup="menu"
              className="portfolio-section-pill__button"
              onClick={(event) => handleSectionButton(event, section.id)}
              type="button"
            >
              <span className="portfolio-section-pill__number">{section.number}</span>
              <span className="portfolio-section-pill__label">{section.label}</span>
              <span aria-hidden="true" className="portfolio-section-pill__chevron">
                ▾
              </span>
            </button>

            <div className="portfolio-section-pill__dropdown" role="menu">
              {section.pages.map((page) => (
                <button
                  className={`portfolio-section-pill__link ${page.id === resolvedState.page.id && section.id === resolvedState.section.id ? "is-active" : ""}`}
                  key={page.id}
                  onClick={() => navigateTo(section.id, page.id)}
                  role="menuitem"
                  type="button"
                >
                  {page.title}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <article className="portfolio-content-card shell-card">
        <header className="portfolio-content-card__header">
          <div className="portfolio-content-card__header-row">
            <span className="portfolio-status-badge">{project.status}</span>
            <div className="portfolio-content-card__meta">
              <span>
                <strong>Timeline</strong>
                {project.timeline}
              </span>
              <span>
                <strong>Role</strong>
                {project.role}
              </span>
            </div>
          </div>

          <h2 className="portfolio-content-card__title">{project.title}</h2>
          <p className="portfolio-content-card__tagline">{project.tagline}</p>

          <div className="portfolio-tech-pills" role="list">
            {project.techStack.map((tech) => (
              <span className="portfolio-tech-pill" key={tech} role="listitem">
                {tech}
              </span>
            ))}
          </div>
        </header>

        <div className="portfolio-content-card__divider" />

        <div className="portfolio-content-card__body">
          <span className="portfolio-content-card__section-label">
            {resolvedState.section.label}
          </span>
          <h3 className="portfolio-content-card__page-title">
            {resolvedState.page.title}
          </h3>

          <div className="portfolio-content-card__copy">
            {resolvedState.page.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {resolvedState.page.metrics?.length ? (
            <div className="portfolio-metric-grid" role="list">
              {resolvedState.page.metrics.map((metric) => (
                <article
                  className="portfolio-metric-card"
                  key={metric.label}
                  role="listitem"
                >
                  <span className="portfolio-metric-card__value">{metric.value}</span>
                  <span className="portfolio-metric-card__label">{metric.label}</span>
                  {metric.description ? (
                    <p className="portfolio-metric-card__description">
                      {metric.description}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          ) : null}

          {resolvedState.page.callouts?.length ? (
            <div className="portfolio-callout-grid" role="list">
              {resolvedState.page.callouts.map((callout) => (
                <article
                  className="portfolio-callout-card"
                  key={callout.title}
                  role="listitem"
                >
                  <h4>{callout.title}</h4>
                  <p>{callout.body}</p>
                </article>
              ))}
            </div>
          ) : null}

          {resolvedState.page.media ? (
            <figure className="portfolio-media-placeholder">
              <div className="portfolio-media-placeholder__box">
                <span>{resolvedState.page.media.label}</span>
                <small>{resolvedState.page.media.hint}</small>
              </div>
            </figure>
          ) : null}

          <div className="portfolio-content-card__links">
            {project.links.live ? (
              <a href={project.links.live} rel="noopener noreferrer" target="_blank">
                Visit live product
              </a>
            ) : null}
            {project.links.github ? (
              <a
                href={project.links.github}
                rel="noopener noreferrer"
                target="_blank"
              >
                View repository
              </a>
            ) : null}
          </div>
        </div>

        <footer className="portfolio-content-card__footer">
          <button
            className="portfolio-pagination-button"
            disabled={!previousEntry}
            onClick={() => {
              if (previousEntry) {
                navigateTo(previousEntry.section.id, previousEntry.page.id);
              }
            }}
            type="button"
          >
            &lt; Previous
          </button>

          <div
            className="portfolio-pagination-dots"
            role="tablist"
            aria-label="Pages within the current section"
          >
            {resolvedState.section.pages.map((page) => (
              <button
                aria-label={`Open ${page.title}`}
                className={`portfolio-pagination-dot ${page.id === resolvedState.page.id ? "is-active" : ""}`}
                key={page.id}
                onClick={() => navigateTo(resolvedState.section.id, page.id)}
                role="tab"
                type="button"
              />
            ))}
          </div>

          <button
            className="portfolio-pagination-button"
            disabled={!nextEntry}
            onClick={() => {
              if (nextEntry) {
                navigateTo(nextEntry.section.id, nextEntry.page.id);
              }
            }}
            type="button"
          >
            Next &gt;
          </button>
        </footer>
      </article>
    </section>
  );
}
