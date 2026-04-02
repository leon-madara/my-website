import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { usePageFlipSound } from "../../hooks/usePageFlipSound";
import { getPortfolioProjectHref, portfolioProjects } from "./portfolioContent";
import { LegacyAccordionCaseStudyProject } from "./portfolio.types";

interface LegacyAccordionCaseStudyRouteProps {
  project: LegacyAccordionCaseStudyProject;
}

function prefersReducedMotion() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function LegacyAccordionCaseStudyRoute({
  project
}: LegacyAccordionCaseStudyRouteProps) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pagesContainerRef = useRef<HTMLDivElement | null>(null);
  const pageRefs = useRef<Map<string, HTMLElement>>(new Map());
  const programmaticScrollRef = useRef(false);
  const scrollIdleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);

  const resolvedState = useMemo(() => {
    const fallbackSection = project.sections[0];
    const requestedSectionId = searchParams.get("section");
    const section =
      project.sections.find((item) => item.id === requestedSectionId) ??
      fallbackSection;

    const requestedPageId = searchParams.get("page");
    const page =
      section.pages.find((item) => item.id === requestedPageId) ?? section.pages[0];

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
          section,
          page,
          key: `${section.id}:${page.id}`
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

  const playPageFlip = usePageFlipSound();

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
    setOpenSectionId(resolvedState.section.id);
  }, [resolvedState.section.id]);

  const scrollToActivePage = () => {
    const key = `${resolvedState.section.id}:${resolvedState.page.id}`;
    const target = pageRefs.current.get(key);
    if (!target) return;

    programmaticScrollRef.current = true;
    const behavior = prefersReducedMotion() ? "auto" : "smooth";
    target.scrollIntoView({ behavior, block: "nearest", inline: "start" });

    window.setTimeout(() => {
      programmaticScrollRef.current = false;
    }, behavior === "auto" ? 0 : 350);
  };

  useEffect(() => {
    scrollToActivePage();
    if (pagesContainerRef.current) {
      pagesContainerRef.current.scrollTop = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, resolvedState.page.id, resolvedState.section.id]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isFormField =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        target?.isContentEditable;

      if (isFormField) return;

      if (event.key === "ArrowLeft" && previousEntry) {
        event.preventDefault();
        setSearchParams({
          page: previousEntry.page.id,
          section: previousEntry.section.id
        });
        playPageFlip();
      }

      if (event.key === "ArrowRight" && nextEntry) {
        event.preventDefault();
        setSearchParams({
          page: nextEntry.page.id,
          section: nextEntry.section.id
        });
        playPageFlip();
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [nextEntry, playPageFlip, previousEntry, setSearchParams]);

  useEffect(() => {
    return () => {
      if (scrollIdleTimer.current) {
        clearTimeout(scrollIdleTimer.current);
      }
    };
  }, []);

  const navigateTo = (sectionId: string, pageId: string, replace = false) => {
    setSearchParams(
      {
        page: pageId,
        section: sectionId
      },
      replace ? { replace: true } : undefined
    );
    playPageFlip();
  };

  const handleAccordionHeader = (sectionId: string) => {
    if (openSectionId === sectionId) {
      setOpenSectionId(null);
      return;
    }

    setOpenSectionId(sectionId);
    const targetSection = project.sections.find((section) => section.id === sectionId);
    const firstPage = targetSection?.pages[0];
    if (targetSection && firstPage) {
      navigateTo(targetSection.id, firstPage.id);
    }
  };

  const handleHorizontalScroll = () => {
    if (programmaticScrollRef.current) return;
    if (!pagesContainerRef.current) return;

    if (scrollIdleTimer.current) {
      clearTimeout(scrollIdleTimer.current);
    }

    scrollIdleTimer.current = setTimeout(() => {
      const container = pagesContainerRef.current;
      if (!container) return;
      const width = container.clientWidth || 1;
      const index = Math.round(container.scrollLeft / width);
      const entry = flattenedPages[Math.max(0, Math.min(index, flattenedPages.length - 1))];
      if (!entry) return;

      if (
        entry.section.id !== resolvedState.section.id ||
        entry.page.id !== resolvedState.page.id
      ) {
        navigateTo(entry.section.id, entry.page.id, true);
      }
    }, 120);
  };

  const overallCompletion = useMemo(() => {
    const denominator = Math.max(1, flattenedPages.length - 1);
    const numerator = Math.max(0, currentIndex);
    return Math.min(100, Math.round((numerator / denominator) * 100));
  }, [currentIndex, flattenedPages.length]);

  return (
    <section className="legacy-accordion-case-study">
      <div className="portfolio-workspace is-ready">
        <header className="portfolio-workspace__top-shell">
          <div className="portfolio-workspace__nav-collapse">
            <div className="portfolio-workspace__project-shell">
              <p className="portfolio-workspace__eyebrow">Case Studies</p>
              <div
                className="portfolio-project-toggles portfolio-project-toggles--workspace"
                role="navigation"
                aria-label="Portfolio projects"
              >
                {portfolioProjects.map((portfolioProject) => (
                  portfolioProject.slug === "edumanage" ? (
                    <a
                      className={`portfolio-project-toggle ${portfolioProject.slug === project.slug ? "is-active" : ""}`}
                      href="/edumanage.html"
                      key={portfolioProject.slug}
                    >
                      <span className="portfolio-project-toggle__badge">
                        {portfolioProject.badge}
                      </span>
                      <span className="portfolio-project-toggle__label">
                        EduManage
                      </span>
                    </a>
                  ) : (
                    <Link
                      className={`portfolio-project-toggle ${portfolioProject.slug === project.slug ? "is-active" : ""}`}
                      key={portfolioProject.slug}
                      to={getPortfolioProjectHref(portfolioProject)}
                    >
                      <span className="portfolio-project-toggle__badge">
                        {portfolioProject.badge}
                      </span>
                      <span className="portfolio-project-toggle__label">
                        {portfolioProject.title}
                      </span>
                    </Link>
                  )
                ))}
              </div>
            </div>
          </div>
        </header>

        <div className="content-wrapper">
          <aside className="accordion-nav" aria-label={`${project.title} navigation`}>
            <div className="accordion-nav-header">
              <p className="accordion-nav-title">Chapters</p>
              <div className="accordion-completion-badge" aria-label="Completion">
                <span className="completion-percentage">{overallCompletion}%</span>
                <span className="completion-label">Done</span>
              </div>
            </div>

            <div className="accordion-menu">
              {project.sections.map((section) => {
                const isActive = section.id === resolvedState.section.id;
                const isOpen = openSectionId === section.id;
                const activePageIndex = section.pages.findIndex(
                  (page) =>
                    isActive && page.id === resolvedState.page.id
                );
                const progressFraction =
                  !isActive
                    ? 0
                    : Math.max(0, activePageIndex + 1) / Math.max(1, section.pages.length);
                const circumference = 2 * Math.PI * 10.5;
                const dash = progressFraction * circumference;
                const remaining = circumference - dash;
                const percent = Math.round(progressFraction * 100);

                return (
                  <div
                    className={`accordion-item ${isOpen ? "active" : ""}`}
                    key={section.id}
                  >
                    <button
                      className="accordion-header"
                      onClick={() => handleAccordionHeader(section.id)}
                      type="button"
                    >
                      <span className="progress-circle" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="28" height="28">
                          <circle
                            className="progress-circle-bg"
                            cx="12"
                            cy="12"
                            r="10.5"
                          />
                          {progressFraction > 0 ? (
                            <circle
                              className="progress-circle-fill"
                              cx="12"
                              cy="12"
                              r="10.5"
                              strokeDasharray={`${dash} ${remaining}`}
                              strokeDashoffset={circumference * 0.25}
                            />
                          ) : null}
                        </svg>
                        <span className="progress-text">{percent}</span>
                      </span>
                      <span className="accordion-title">{section.label}</span>
                      <svg
                        className="accordion-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    <div className="accordion-content">
                      {section.pages.map((page) => (
                        <button
                          className={`accordion-link ${isActive && page.id === resolvedState.page.id ? "active" : ""}`}
                          key={page.id}
                          onClick={() => navigateTo(section.id, page.id)}
                          type="button"
                        >
                          {page.title}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="legacy-accordion-actions">
              <Link className="btn-secondary portfolio-action-button" to="/portfolio">
                Back to portfolio
              </Link>
              {project.links.github ? (
                <a
                  className="btn-primary portfolio-action-button"
                  href={project.links.github}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  View repository
                </a>
              ) : null}
            </div>
          </aside>

          <div className="content-area">
            <h1 className="sr-only">{project.title}</h1>
            <div
              className="horizontal-pages"
              onScroll={handleHorizontalScroll}
              ref={pagesContainerRef}
            >
              {flattenedPages.map((entry) => {
                const key = entry.key;
                const isActive =
                  entry.section.id === resolvedState.section.id &&
                  entry.page.id === resolvedState.page.id;

                return (
                  <article
                    aria-label={`${entry.section.label}: ${entry.page.title}`}
                    className="content-page"
                    data-is-active={isActive ? "true" : "false"}
                    key={key}
                    ref={(node) => {
                      if (node) {
                        pageRefs.current.set(key, node);
                      } else {
                        pageRefs.current.delete(key);
                      }
                    }}
                  >
                    <p className="page-subtitle">
                      <strong>{project.title}</strong>
                      {"  "}
                      <span>{project.tagline}</span>
                    </p>
                    <h2 className="page-title kenyan-gradient">{entry.page.title}</h2>
                    <div className="page-content">
                      {entry.page.body.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="page-indicators" role="tablist" aria-label="Pages">
              {flattenedPages.map((entry) => (
                <button
                  aria-label={`Open ${entry.page.title}`}
                  className={`page-dot ${entry.section.id === resolvedState.section.id && entry.page.id === resolvedState.page.id ? "active" : ""}`}
                  key={entry.key}
                  onClick={() => navigateTo(entry.section.id, entry.page.id)}
                  role="tab"
                  type="button"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
