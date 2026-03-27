interface PortfolioBackgroundProps {
  variant: "landing" | "tabbed-case-study" | "longform-case-study";
}

export function PortfolioBackground({ variant }: PortfolioBackgroundProps) {
  return (
    <>
      <div
        aria-hidden="true"
        className={`portfolio-background portfolio-background--${variant}`}
      />
      <div aria-hidden="true" className="portfolio-code-elements">
        <span className="portfolio-code portfolio-code--1">&lt;/&gt;</span>
        <span className="portfolio-code portfolio-code--2">{"{ }"}</span>
        <span className="portfolio-code portfolio-code--3">[ ]</span>
        <span className="portfolio-code portfolio-code--4">=&gt;</span>
        <span className="portfolio-code portfolio-code--5">( )</span>
        <span className="portfolio-code portfolio-code--6">#</span>
      </div>
      <div
        aria-hidden="true"
        className={`portfolio-floating-shapes portfolio-floating-shapes--${variant}`}
      >
        <span className="portfolio-shape portfolio-shape--1" />
        <span className="portfolio-shape portfolio-shape--2" />
        <span className="portfolio-shape portfolio-shape--3" />
        <span className="portfolio-shape portfolio-shape--4" />
      </div>
    </>
  );
}
