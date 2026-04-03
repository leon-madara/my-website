import type { ProjectItem } from "../../about.types";

export interface ProjectCardProps {
  item: ProjectItem;
}

export function ProjectCard({ item }: ProjectCardProps) {
  return (
    <article className="project-card">
      <div className="project-icon">{item.icon ?? "💻"}</div>
      <h3 className="project-title">{item.title}</h3>
      <p className="project-description">{item.description}</p>
      <div className="project-tags">
        {item.tags.map((tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
