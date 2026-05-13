const techItems = [
  { name: "React", label: "React", mark: "R", tone: "cyan" },
  { name: "Next.js", label: "Next.js", mark: "N", tone: "black" },
  { name: "TypeScript", label: "TypeScript", mark: "TS", tone: "blue" },
  { name: "JavaScript", label: "JavaScript", mark: "JS", tone: "yellow" },
  { name: "Node.js", label: "Node.js", mark: "JS", tone: "green" },
  { name: "Python", label: "Python", mark: "Py", tone: "python" },
  { name: "Tailwind", label: "Tailwind", mark: "~", tone: "sky" },
  { name: "PostgreSQL", label: "PostgreSQL", mark: "Pg", tone: "postgres" },
  { name: "OpenAI", label: "OpenAI", mark: "AI", tone: "openai" },
  { name: "Claude Code", label: "Claude Code", mark: "CC", tone: "claude" },
  { name: "Zen Browser", label: "Zen Browser", mark: "Z", tone: "zen" },
  { name: "Antigravity", label: "Antigravity", mark: "AG", tone: "red" },
  { name: "Kiro", label: "Kiro", mark: "Ki", tone: "violet" },
  { name: "Casa", label: "Casa", mark: "Ca", tone: "casa" },
  { name: "GitHub Copilot", label: "GitHub Copilot", mark: "GH", tone: "github" },
  { name: "Codex", label: "Codex", mark: "Cx", tone: "codex" }
];

const marqueeItems = [...techItems, ...techItems];

export function HomeTechMarquee() {
  return (
    <section className="home-tech-marquee" aria-label="Tech I work with">
      <p className="home-tech-marquee__label">Tech I work with</p>
      <div className="home-tech-marquee__viewport">
        <div className="home-tech-marquee__track" role="list">
          {marqueeItems.map((item, index) => (
            <div
              aria-hidden={index >= techItems.length ? "true" : undefined}
              className="home-tech-marquee__item"
              key={`${item.name}-${index}`}
              role="listitem"
            >
              <span
                aria-hidden="true"
                className={`home-tech-marquee__icon home-tech-marquee__icon--${item.tone}`}
              >
                {item.mark}
              </span>
              <span className="home-tech-marquee__name">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
