import type { ProjectItem } from "../about.types";
import { SectionTitle } from "./SectionTitle";
import { ProjectCard } from "./cards/ProjectCard";

export interface ProjectsSectionProps {
  title: string;
  items: ProjectItem[];
}

export function ProjectsSection({ title, items }: ProjectsSectionProps) {
  return (
    <section
      className="about-section projects-section"
      data-reveal-section
      id="projects-section"
    >
      <div className="section-content">
        <SectionTitle title={title} />
        <div className="projects-grid">
          {items.map((item, index) => (
            <div
              className={
                index === 0
                  ? "projects-grid__item projects-grid__item--featured"
                  : "projects-grid__item"
              }
              data-reveal-item
              key={item.title}
            >
              <ProjectCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
