import type { SkillCategory } from "../../about.types";

export interface SkillCategoryCardProps {
  category: SkillCategory;
}

export function SkillCategoryCard({ category }: SkillCategoryCardProps) {
  return (
    <article className="skill-category">
      <h3 className="skill-category-title">{category.title}</h3>
      <div className="skill-tags">
        {category.tags.map((tag) => (
          <span className="skill-tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
