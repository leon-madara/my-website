import { useRef } from "react";
import { Link } from "react-router-dom";
import "./about.css";
import {
  certificationItems,
  educationItems,
  experienceItems,
  expertiseItems,
  projectItems,
  skillCategories
} from "./aboutContent";
import { useAboutAnimations } from "./useAboutAnimations";

function SplitTitle({ text }: { text: string }) {
  return (
    <>
      {Array.from(text).map((char, index) => (
        <span className="char-masked" key={`${text}-${index}`}>
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </>
  );
}

export function AboutRoute() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useAboutAnimations(rootRef);

  return (
    <div className="page-content page-content--about" ref={rootRef}>
      <section className="parallax-hero">
        <div aria-hidden="true" className="top-gradient-section" />
        <div className="hero-image-wrapper">
          <img
            alt="Lion illustration representing Leon Madara"
            className="hero-image"
            src="/images/lion1.PNG"
          />
        </div>
        <div className="hero-container">
          <div className="hero-text-wrapper">
            <div className="about-text-container">
              <span className="about-text">About</span>
              <span className="name-text">
                Leon Madara
                <span className="name-underline" />
              </span>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="decorative-shapes about-decorative-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
      </section>

      <section className="about-section what-i-do-section" data-reveal-section>
        <div className="section-content">
          <h2 className="section-title kenyan-gradient">
            <SplitTitle text="About Me" />
          </h2>
          <div className="section-body">
            <p className="intro-text" data-reveal-item>
              Multidisciplinary data analyst and web developer with 3+ years of
              industry experience and a strong foundation in computer science. I
              combine analytical rigor with intuitive interface design to craft
              data-driven applications and dashboards that are functional,
              performant, and user-focused.
            </p>
            <div className="expertise-grid">
              {expertiseItems.map((item) => (
                <article
                  className={
                    item.featured
                      ? "expertise-item expertise-item--featured"
                      : "expertise-item"
                  }
                  data-reveal-item
                  key={item.title}
                >
                  {item.featured ? (
                    <div className="expertise-header">
                      <div className="expertise-icon-wrapper">WEB</div>
                      <h3>{item.title}</h3>
                    </div>
                  ) : (
                    <h3>{item.title}</h3>
                  )}
                  <p>{item.description}</p>
                  {item.tags ? (
                    <div className="expertise-tags">
                      {item.tags.map((tag) => (
                        <span className="tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="about-section skills-section" data-reveal-section>
        <div className="section-content">
          <h2 className="section-title kenyan-gradient">
            <SplitTitle text="Skills & Technologies" />
          </h2>
          <div className="skills-grid">
            {skillCategories.map((category) => (
              <article className="skill-category" data-reveal-item key={category.title}>
                <h3 className="skill-category-title">{category.title}</h3>
                <div className="skill-tags">
                  {category.tags.map((tag) => (
                    <span className="skill-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section experience-section" data-reveal-section>
        <div className="section-content">
          <h2 className="section-title kenyan-gradient">
            <SplitTitle text="Professional Experience" />
          </h2>
          <div className="timeline">
            {experienceItems.map((item) => (
              <article
                className="timeline-item"
                data-reveal-item
                data-role={item.role}
                key={item.title}
              >
                <div aria-hidden="true" className="timeline-marker" />
                <div className="timeline-content">
                  <span className="timeline-date">{item.date}</span>
                  <h3 className="timeline-title">{item.title}</h3>
                  {item.subtitle ? (
                    <p className="timeline-subtitle">{item.subtitle}</p>
                  ) : null}
                  <p className="timeline-location">{item.location}</p>
                  <div className="timeline-reveal">
                    {item.chips.map((chip) => (
                      <span className="timeline-chip" key={chip}>
                        {chip}
                      </span>
                    ))}
                  </div>
                  <details className="timeline-details" open>
                    <summary className="timeline-summary">Highlights</summary>
                    <ul className="timeline-achievements">
                      {item.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  </details>
                  <div className="timeline-links">
                    {item.links.map((link) => (
                      <Link className="timeline-link" key={link.label} to={link.to}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section education-section" data-reveal-section>
        <div className="section-content">
          <h2 className="section-title kenyan-gradient">
            <SplitTitle text="Education" />
          </h2>
          <div className="education-grid">
            {educationItems.map((item) => (
              <article className="education-item" data-reveal-item key={item.degree}>
                <div className="education-icon">EDU</div>
                <h3 className="education-degree">{item.degree}</h3>
                <p className="education-institution">{item.institution}</p>
                {item.honors ? (
                  <p className="education-honors">{item.honors}</p>
                ) : null}
                <span className="education-years">{item.years}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section projects-section" data-reveal-section>
        <div className="section-content">
          <h2 className="section-title kenyan-gradient">
            <SplitTitle text="Featured Projects" />
          </h2>
          <div className="projects-grid">
            {projectItems.map((project) => (
              <article className="project-card" data-reveal-item key={project.title}>
                <div className="project-icon">PRJ</div>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section certifications-section" data-reveal-section>
        <div className="section-content">
          <h2 className="section-title kenyan-gradient">
            <SplitTitle text="Certifications" />
          </h2>
          <div className="certifications-grid">
            {certificationItems.map((certification) => (
              <article
                className="certification-card"
                data-reveal-item
                key={certification.title}
              >
                <div className="cert-header">
                  <div className="cert-logo">
                    {certification.issuer.split(" - ")[0]}
                  </div>
                  <span
                    className={
                      certification.badgeVariant === "verified"
                        ? "verified-badge"
                        : "in-progress-badge"
                    }
                  >
                    {certification.badge}
                  </span>
                </div>
                <h3 className="cert-title">{certification.title}</h3>
                <p className="cert-issuer">{certification.issuer}</p>
                <span className="cert-year">{certification.years}</span>

                <div className="cert-metrics">
                  {certification.metrics.map((metric) => (
                    <div className="metric" key={metric.label}>
                      <span className="metric-value">{metric.value}</span>
                      <span className="metric-label">{metric.label}</span>
                    </div>
                  ))}
                </div>

                <div className="cert-skills">
                  <p className="skills-label">Skills Acquired:</p>
                  <div className="skills-tags">
                    {certification.skills.map((skill) => (
                      <span className="skill-tag" key={skill}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <ul className="cert-topics">
                  {certification.topics.map((topic) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>

                <div className="cert-actions">
                  <a
                    aria-label={`Verify ${certification.title}`}
                    className="btn-verify"
                    href={certification.verifyHref}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Verify Certificate
                  </a>
                  {certification.viewHref ? (
                    <a
                      className="btn-view"
                      href={certification.viewHref}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {certification.viewLabel ?? "View Certificate"}
                    </a>
                  ) : (
                    <span className="btn-view btn-view--disabled">
                      View Certificate
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
