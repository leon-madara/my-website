import type { ExpertiseItem } from "../../about.types";

export interface ExpertiseCardProps {
  item: ExpertiseItem;
}

export function ExpertiseCard({ item }: ExpertiseCardProps) {
  const articleClassName = item.featured
    ? "expertise-item expertise-item--featured"
    : "expertise-item";

  return (
    <article className={articleClassName}>
      {item.featured ? (
        <div className="expertise-header">
          <div className="expertise-icon-wrapper">
            <span className="expertise-icon">{item.icon ?? "💻"}</span>
          </div>
          <h3>{item.title}</h3>
        </div>
      ) : (
        <>
          {item.icon ? <div className="expertise-icon">{item.icon}</div> : null}
          <h3>{item.title}</h3>
        </>
      )}
      <p>{item.description}</p>
      {item.tags?.length ? (
        <div className="expertise-tags">
          {item.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}
