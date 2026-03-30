import { Link } from "react-router-dom";
import { RoleSequence } from "./RoleSequence";
import { useHomeViewportLock } from "./useHomeViewportLock";

export function HomeRoute() {
  useHomeViewportLock();

  return (
    <div className="page-content page-content--home">
      <section aria-label="Hero introduction" className="hero-section">
        <div className="hero-content">
          <p className="greeting">Hi, I&apos;m</p>
          <h1 className="name">Leon Madara</h1>
          <RoleSequence />
          <p className="description">
            I design and build delightful digital products with a Kenyan twist,
            blending professional polish with playful interactions and
            performance-focused engineering.
          </p>
          <div className="location-container">
            <div className="location-pin-wrapper">
              <svg
                aria-hidden="true"
                className="location-pin"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5Z" />
              </svg>
              <span className="pulse-ring" />
              <span className="pulse-ring" />
            </div>
            <p className="location">Nairobi, Kenya</p>
          </div>
          <div className="action-buttons">
            <Link className="btn-primary" to="/portfolio">
              View Projects
            </Link>
            <Link className="btn-secondary" to="/contact">
              Contact Me
            </Link>
          </div>
          <div aria-hidden="true" className="decorative-lines">
            <span className="line line-black" />
            <span className="line line-red" />
            <span className="line line-green" />
          </div>
        </div>
        <div aria-hidden="true" className="decorative-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
      </section>
    </div>
  );
}
