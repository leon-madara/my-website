import type { EducationItem } from "../about.types";
import { SectionTitle } from "./SectionTitle";
import { EducationCard } from "./cards/EducationCard";

export interface EducationSectionProps {
  title: string;
  items: EducationItem[];
}

export function EducationSection({ title, items }: EducationSectionProps) {
  return (
    <section
      className="about-section education-section"
      data-reveal-section
      id="education-section"
    >
      <div className="section-content">
        <SectionTitle title={title} />
        <div className="education-grid">
          {items.map((item) => (
            <div className="education-grid__item" data-reveal-item key={item.degree}>
              <EducationCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
