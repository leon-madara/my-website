import type { SkillCategory } from "../about.types";
import { SectionTitle } from "./SectionTitle";
import { SkillCategoryCard } from "./cards/SkillCategoryCard";

export interface SkillsSectionProps {
  title: string;
  categories: SkillCategory[];
}

export function SkillsSection({ title, categories }: SkillsSectionProps) {
  return (
    <section
      className="about-section skills-section"
      data-reveal-section
      id="skills-section"
    >
      <div className="section-content">
        <SectionTitle title={title} />
        <div className="skills-grid">
          {categories.map((category) => (
            <div className="skills-grid__item" data-reveal-item key={category.title}>
              <SkillCategoryCard category={category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
