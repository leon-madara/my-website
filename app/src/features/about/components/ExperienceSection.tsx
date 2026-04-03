import type { ExperienceItem } from "../about.types";
import { SectionTitle } from "./SectionTitle";
import { TimelineItemCard } from "./cards/TimelineItemCard";

export interface ExperienceSectionProps {
  title: string;
  items: ExperienceItem[];
}

export function ExperienceSection({ title, items }: ExperienceSectionProps) {
  return (
    <section
      className="about-section experience-section"
      data-reveal-section
      id="experience-section"
    >
      <div className="section-content">
        <SectionTitle title={title} />
        <div className="timeline">
          {items.map((item) => (
            <div className="timeline__item" data-reveal-item key={item.title}>
              <TimelineItemCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
