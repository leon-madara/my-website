import type { CertificationItem } from "../../about.types";

export interface CertificationCardProps {
  item: CertificationItem;
}

function getIssuerLabel(item: CertificationItem) {
  return item.issuerLabel ?? item.issuer.split(" - ")[0];
}

export function CertificationCard({ item }: CertificationCardProps) {
  return (
    <article className="certification-card">
      <div className="cert-header">
        <div className="cert-logo">{getIssuerLabel(item)}</div>
        <span
          className={
            item.badgeVariant === "verified"
              ? "verified-badge"
              : "in-progress-badge"
          }
        >
          {item.badge}
        </span>
      </div>
      <h3 className="cert-title">{item.title}</h3>
      <p className="cert-issuer">{item.issuer}</p>
      <span className="cert-year">{item.years}</span>

      <div className="cert-metrics">
        {item.metrics.map((metric) => (
          <div className="metric" key={metric.label}>
            <span className="metric-value">{metric.value}</span>
            <span className="metric-label">{metric.label}</span>
          </div>
        ))}
      </div>

      <div className="cert-skills">
        <p className="skills-label">Skills Acquired:</p>
        <div className="skills-tags">
          {item.skills.map((skill) => (
            <span className="skill-tag" key={skill}>
              {skill}
            </span>
          ))}
        </div>
      </div>

      <ul className="cert-topics">
        {item.topics.map((topic) => (
          <li key={topic}>{topic}</li>
        ))}
      </ul>

      <div className="cert-actions">
        <a
          aria-label={`Verify ${item.title}`}
          className="btn-verify"
          href={item.verifyHref}
          rel="noopener noreferrer"
          target="_blank"
        >
          Verify Certificate
        </a>
        {item.viewHref ? (
          <a
            className="btn-view"
            href={item.viewHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            {item.viewLabel ?? "View Certificate"}
          </a>
        ) : (
          <span className="btn-view btn-view--disabled">View Certificate</span>
        )}
      </div>
    </article>
  );
}
