import type { ReactNode } from "react";

interface PageIntroProps {
  eyebrow: string;
  title: string;
  summary: string;
  children?: ReactNode;
}

export function PageIntro({
  eyebrow,
  title,
  summary,
  children
}: PageIntroProps) {
  return (
    <section className="page-intro shell-card">
      <p className="page-intro__eyebrow">{eyebrow}</p>
      <h1 className="page-intro__title">{title}</h1>
      <p className="page-intro__summary">{summary}</p>
      {children}
    </section>
  );
}
