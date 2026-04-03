export interface SectionTitleProps {
  title: string;
  className?: string;
  split?: boolean;
}

export function SectionTitle({
  title,
  className = "",
  split = true
}: SectionTitleProps) {
  const titleClassName = ["section-title", "kenyan-gradient", className]
    .filter(Boolean)
    .join(" ");

  if (!split) {
    return <h2 className={titleClassName}>{title}</h2>;
  }

  return (
    <h2 aria-label={title} className={titleClassName}>
      <span aria-hidden="true">
        {Array.from(title).map((char, index) => (
          <span className="char-masked" key={`${title}-${index}`}>
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
      <span className="sr-only">{title}</span>
    </h2>
  );
}
