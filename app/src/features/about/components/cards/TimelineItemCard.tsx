import { Link } from "react-router-dom";
import type { ExperienceItem } from "../../about.types";

export interface TimelineItemCardProps {
  item: ExperienceItem;
}

export function TimelineItemCard({ item }: TimelineItemCardProps) {
  return (
    <article className="timeline-item" data-role={item.role}>
      <div aria-hidden="true" className="timeline-marker" />
      <div className="timeline-content">
        <span className="timeline-date">{item.date}</span>
        <h3 className="timeline-title">{item.title}</h3>
        {item.subtitle ? <p className="timeline-subtitle">{item.subtitle}</p> : null}
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
  );
}
