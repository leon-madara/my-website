import type { EducationItem } from "../../about.types";

export interface EducationCardProps {
  item: EducationItem;
}

export function EducationCard({ item }: EducationCardProps) {
  return (
    <article className="education-item">
      <div className="education-icon">{item.icon ?? "🎓"}</div>
      <h3 className="education-degree">{item.degree}</h3>
      <p className="education-institution">{item.institution}</p>
      {item.honors ? <p className="education-honors">{item.honors}</p> : null}
      <span className="education-years">{item.years}</span>
    </article>
  );
}
