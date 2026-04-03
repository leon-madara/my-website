import type { AboutIntroContent, ExpertiseItem } from "../about.types";
import { SectionTitle } from "./SectionTitle";
import { ExpertiseCard } from "./cards/ExpertiseCard";

export interface AboutIntroSectionProps {
  content: AboutIntroContent;
  expertiseItems: ExpertiseItem[];
}

export function AboutIntroSection({
  content,
  expertiseItems
}: AboutIntroSectionProps) {
  return (
    <section
      className="about-section what-i-do-section"
      data-reveal-section
      id="what-i-do-section"
    >
      <div className="section-content">
        <SectionTitle title={content.eyebrow} />
        <div className="section-body">
          <p className="intro-text" data-reveal-item>
            {content.summary}
          </p>
          <div className="expertise-grid">
            {expertiseItems.map((item) => (
              <div
                className={
                  item.featured
                    ? "expertise-grid__item expertise-grid__item--featured"
                    : "expertise-grid__item"
                }
                data-reveal-item
                key={item.title}
              >
                <ExpertiseCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
