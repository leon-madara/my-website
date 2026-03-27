import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LongformCaseStudyProject, PortfolioBlock } from "./portfolio.types";
import { useEduManageAnimations } from "./useEduManageAnimations";

interface LongformCaseStudyRouteProps {
  project: LongformCaseStudyProject;
}

function renderBlock(block: PortfolioBlock) {
  switch (block.type) {
    case "text":
      return (
        <div className="portfolio-longform-block portfolio-longform-block--text">
          {block.lead ? <p className="portfolio-longform-block__lead">{block.lead}</p> : null}
          {block.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      );
    case "stat-grid":
      return (
        <div className="portfolio-longform-stat-grid" role="list">
          {block.items.map((item) => (
            <article className="portfolio-longform-stat-card" key={item.label} role="listitem">
              <span className="portfolio-longform-stat-card__value">{item.value}</span>
              <span className="portfolio-longform-stat-card__label">{item.label}</span>
              {item.context ? (
                <p className="portfolio-longform-stat-card__context">{item.context}</p>
              ) : null}
            </article>
          ))}
        </div>
      );
    case "bullet-list":
      return (
        <div className="portfolio-longform-list-card">
          <h4>{block.title}</h4>
          <ul>
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      );
    case "cards":
      return (
        <div className="portfolio-longform-card-group">
          {block.title ? <h4>{block.title}</h4> : null}
          <div className="portfolio-longform-card-grid" role="list">
            {block.items.map((item) => (
              <article className="portfolio-longform-card" key={item.title} role="listitem">
                {item.eyebrow ? (
                  <span className="portfolio-longform-card__eyebrow">{item.eyebrow}</span>
                ) : null}
                <h5>{item.title}</h5>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      );
    case "sequence":
      return (
        <div className="portfolio-longform-sequence">
          <h4>{block.title}</h4>
          <div className="portfolio-longform-sequence__items" role="list">
            {block.items.map((item) => (
              <article className="portfolio-longform-sequence__item" key={item.step} role="listitem">
                <span className="portfolio-longform-sequence__step">{item.step}</span>
                <div>
                  <h5>{item.title}</h5>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      );
    default:
      return null;
  }
}

export function LongformCaseStudyRoute({
  project
}: LongformCaseStudyRouteProps) {
  const location = useLocation();
  const rootRef = useRef<HTMLElement | null>(null);
  const [activeChapterId, setActiveChapterId] = useState(project.chapters[0]?.id ?? "");

  useEduManageAnimations(rootRef);

  const chapterIds = useMemo(
    () => project.chapters.map((chapter) => chapter.id),
    [project.chapters]
  );

  useEffect(() => {
    const requestedChapter = location.hash.replace("#", "");
    if (requestedChapter && chapterIds.includes(requestedChapter)) {
      setActiveChapterId(requestedChapter);
      window.requestAnimationFrame(() => {
        document.getElementById(requestedChapter)?.scrollIntoView({
          behavior: "auto",
          block: "start"
        });
      });
    }
  }, [chapterIds, location.hash]);

  useEffect(() => {
    const sections = project.chapters
      .map((chapter) => document.getElementById(chapter.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio);

        if (visibleEntries.length === 0) {
          return;
        }

        const nextActiveId = visibleEntries[0].target.id;
        setActiveChapterId(nextActiveId);
        window.history.replaceState({}, "", `${location.pathname}#${nextActiveId}`);
      },
      {
        rootMargin: "-18% 0px -55% 0px",
        threshold: [0.25, 0.5, 0.75]
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, [location.pathname, project.chapters]);

  return (
    <section className="portfolio-longform" ref={rootRef}>
      <aside className="portfolio-longform-nav shell-card">
        <p className="portfolio-longform-nav__eyebrow">{project.badge}</p>
        <h2 className="portfolio-longform-nav__title">{project.title}</h2>
        <nav aria-label={`${project.title} chapter navigation`}>
          {project.chapters.map((chapter) => (
            <a
              className={`portfolio-longform-nav__link ${chapter.id === activeChapterId ? "is-active" : ""}`}
              href={`#${chapter.id}`}
              key={chapter.id}
            >
              {chapter.label}
            </a>
          ))}
        </nav>

        <div className="portfolio-longform-nav__actions">
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

      <article className="portfolio-longform-article">
        <header className="portfolio-longform-hero shell-card">
          <p className="portfolio-longform-hero__eyebrow" data-hero-reveal>
            {project.hero.eyebrow}
          </p>
          <h1 className="portfolio-longform-hero__title" data-hero-reveal>
            {project.title}
          </h1>
          <p className="portfolio-longform-hero__tagline" data-hero-reveal>
            {project.tagline}
          </p>
          <div className="portfolio-longform-hero__meta" data-hero-reveal>
            <span>
              <strong>Timeline</strong>
              {project.timeline}
            </span>
            <span>
              <strong>Role</strong>
              {project.role}
            </span>
            <span>
              <strong>Status</strong>
              {project.status}
            </span>
          </div>
          <div className="portfolio-tech-pills" data-hero-reveal role="list">
            {project.techStack.map((tech) => (
              <span className="portfolio-tech-pill" key={tech} role="listitem">
                {tech}
              </span>
            ))}
          </div>
        </header>

        <div className="portfolio-longform-mobile-nav" role="navigation" aria-label="EduManage chapters">
          {project.chapters.map((chapter) => (
            <a
              className={`portfolio-longform-mobile-nav__pill ${chapter.id === activeChapterId ? "is-active" : ""}`}
              href={`#${chapter.id}`}
              key={chapter.id}
            >
              {chapter.label}
            </a>
          ))}
        </div>

        {project.chapters.map((chapter) => (
          <section
            className="portfolio-longform-chapter shell-card"
            data-portfolio-reveal
            id={chapter.id}
            key={chapter.id}
          >
            <div className="portfolio-longform-chapter__header">
              <span className="portfolio-longform-chapter__label">{chapter.label}</span>
              <h2>{chapter.label}</h2>
            </div>

            <div className="portfolio-longform-chapter__content">
              {chapter.blocks.map((block, index) => (
                <div key={`${chapter.id}-${block.type}-${index}`}>{renderBlock(block)}</div>
              ))}
            </div>
          </section>
        ))}

        <footer className="portfolio-longform-footer shell-card">
          <p>
            EduManage stays deliberately long-form in React because the case study
            reads best as an editorial narrative, not as a paged content carousel.
          </p>
          <div className="portfolio-longform-footer__actions">
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
                Open repository
              </a>
            ) : null}
          </div>
        </footer>
      </article>
    </section>
  );
}
