import type { AboutHeroContent } from "../about.types";

export interface AboutHeroProps {
  content: AboutHeroContent;
}

export function AboutHero({ content }: AboutHeroProps) {
  return (
    <section className="parallax-hero" id="parallax-hero">
      <div className="hero-image-wrapper">
        <img
          alt={content.imageAlt}
          className="hero-image"
          decoding="async"
          fetchPriority="high"
          loading="eager"
          src={content.imageSrc}
        />
      </div>
      <div className="hero-container">
        <div className="hero-text-wrapper">
          <div className="about-text-container">
            <span className="about-text">{content.eyebrow}</span>
            <span className="name-text">
              {content.name}
              <span className="name-underline" />
            </span>
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="decorative-shapes about-decorative-shapes"
      >
        <div className="shape shape-1" />
        <div className="shape shape-2" />
        <div className="shape shape-3" />
      </div>
    </section>
  );
}
