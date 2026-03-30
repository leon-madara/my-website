import {
  MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { usePageFlipSound } from "../../hooks/usePageFlipSound";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  getPortfolioProjectHref,
  portfolioProjects
} from "./portfolioContent";
import { PortfolioEntrance } from "./PortfolioEntrance";
import { TabbedCaseStudyProject } from "./portfolio.types";

interface TabbedCaseStudyRouteProps {
  project: TabbedCaseStudyProject;
  showEntrance?: boolean;
}

export function TabbedCaseStudyRoute({
  project,
  showEntrance = false
}: TabbedCaseStudyRouteProps) {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const activeSectionRef = useRef<HTMLDivElement | null>(null);
  const contentBodyRef = useRef<HTMLDivElement | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [entranceReady, setEntranceReady] = useState(!showEntrance);
  const [navHovered, setNavHovered] = useState(false);

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
  const currentSectionIndex = project.sections.findIndex(
    (section) => section.id === resolvedState.section.id
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
    if (typeof window.scrollTo === "function") {
      try {
        window.scrollTo({ top: 0 });
      } catch {
        // jsdom does not implement window scrolling.
      }
    }
  }, [location.pathname, resolvedState.page.id, resolvedState.section.id]);

  useEffect(() => {
    if (!contentBodyRef.current) {
      return;
    }

    contentBodyRef.current.scrollTop = 0;
  }, [location.pathname, resolvedState.page.id, resolvedState.section.id]);

  useEffect(() => {
    if (typeof activeSectionRef.current?.scrollIntoView === "function") {
      activeSectionRef.current.scrollIntoView({
        block: "nearest",
        inline: "center"
      });
    }
  }, [resolvedState.section.id]);

  const playPageFlip = usePageFlipSound();

  // Auto-collapse global nav into indicator after 2s on mount
  useEffect(() => {
    if (!entranceReady) return;
    const timer = setTimeout(() => {
      document.body.classList.add("nav-is-collapsed");
    }, 2000);
    return () => {
      clearTimeout(timer);
      document.body.classList.remove("nav-is-collapsed");
    };
  }, [entranceReady]);

  // Toggle nav visibility on hover
  useEffect(() => {
    if (navHovered) {
      document.body.classList.add("nav-is-hovered");
    } else {
      document.body.classList.remove("nav-is-hovered");
    }
    return () => {
      document.body.classList.remove("nav-is-hovered");
    };
  }, [navHovered]);

  const navigateTo = useCallback(
    (sectionId: string, pageId: string) => {
      setSearchParams({
        page: pageId,
        section: sectionId
      });
      setOpenDropdownId(null);
      playPageFlip();
    },
    [playPageFlip, setSearchParams]
  );

  const handleSectionButton = (
    event: ReactMouseEvent<HTMLButtonElement>,
    sectionId: string
  ) => {
    event.preventDefault();
    setOpenDropdownId((current) => (current === sectionId ? null : sectionId));
  };

  return (
    <section className="tabbed-case-study">
      {showEntrance ? (
        <PortfolioEntrance isActive onReadyChange={setEntranceReady} />
      ) : null}

      {/* Hover zone: catches mouse over the fixed nav area to reveal nav */}
      <div
        aria-hidden="true"
        className="portfolio-nav-hover-zone"
        onMouseEnter={() => setNavHovered(true)}
        onMouseLeave={() => setNavHovered(false)}
      />

      <div
        className={`portfolio-workspace ${entranceReady ? "is-ready" : "is-hidden"}`}
      >
        <header className="portfolio-workspace__top-shell">
          <div aria-hidden="true" className="portfolio-workspace__indicator" />
          <div className="portfolio-workspace__nav-collapse">
            <div className="portfolio-workspace__project-shell">
              <p className="portfolio-workspace__eyebrow">Case Studies</p>
              <div
                className="portfolio-project-toggles portfolio-project-toggles--workspace"
                role="navigation"
                aria-label="Portfolio projects"
              >
                {portfolioProjects.map((portfolioProject) => (
                  <Link
                    className={`portfolio-project-toggle ${portfolioProject.slug === project.slug ? "is-active" : ""}`}
                    key={portfolioProject.slug}
                    to={getPortfolioProjectHref(portfolioProject)}
                  >
                    <span className="portfolio-project-toggle__badge">
                      {portfolioProject.badge}
                    </span>
                    <span className="portfolio-project-toggle__label">
                      {portfolioProject.slug === "edumanage"
                        ? "EduManage"
                        : portfolioProject.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </header>

        <div className="portfolio-section-row-shell">
          <div
            className="portfolio-section-row"
            ref={dropdownRef}
            role="navigation"
            aria-label={`${project.title} case study sections`}
          >
            {project.sections.map((section, index) => {
              const sectionState =
                index < currentSectionIndex
                  ? "is-complete"
                  : index === currentSectionIndex
                    ? "is-active"
                    : "is-upcoming";

              return (
                <div
                  className={`portfolio-section-pill ${sectionState} ${openDropdownId === section.id ? "is-open" : ""}`}
                  key={section.id}
                  ref={section.id === resolvedState.section.id ? activeSectionRef : null}
                >
                  <button
                    aria-expanded={openDropdownId === section.id}
                    aria-haspopup="menu"
                    className="portfolio-section-pill__button"
                    onClick={(event) => handleSectionButton(event, section.id)}
                    type="button"
                  >
                    <span className="portfolio-section-pill__indicator">
                      {index < currentSectionIndex ? (
                        <span
                          aria-hidden="true"
                          className="portfolio-section-pill__checkmark"
                        />
                      ) : (
                        <span className="portfolio-section-pill__number">
                          {section.number}
                        </span>
                      )}
                    </span>
                    <span className="portfolio-section-pill__label">
                      {section.label}
                    </span>
                    <span aria-hidden="true" className="portfolio-section-pill__chevron" />
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
              );
            })}
          </div>
        </div>

        <div aria-hidden="true" className="portfolio-workspace__rule">
          <div className="portfolio-section-progress">
            {resolvedState.section.pages.map((page) => (
              <span
                className={`portfolio-section-progress__dot ${page.id === resolvedState.page.id ? "is-active" : ""}`}
                key={page.id}
              />
            ))}
          </div>
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

            <h1 className="portfolio-content-card__title">{project.title}</h1>
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

          <div className="portfolio-content-card__body" ref={contentBodyRef}>
            <span className="portfolio-content-card__section-label">
              {resolvedState.section.label}
            </span>
            <h2 className="portfolio-content-card__page-title">
              {resolvedState.page.title}
            </h2>

            <div className="portfolio-content-card__copy">
              {resolvedState.page.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
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
              aria-label="Pages within the portfolio case study"
            >
              {flattenedPages.map((entry) => (
                <button
                  aria-label={`Open ${entry.page.title}`}
                  className={`portfolio-pagination-dot ${entry.section.id === resolvedState.section.id && entry.page.id === resolvedState.page.id ? "is-active" : ""}`}
                  key={`${entry.section.id}-${entry.page.id}`}
                  onClick={() => navigateTo(entry.section.id, entry.page.id)}
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
      </div>
    </section>
  );
}
