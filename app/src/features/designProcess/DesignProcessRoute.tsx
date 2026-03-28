import { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../theme/ThemeProvider";
import "./designProcess.css";

function useIsMobile(query = "(max-width: 768px)") {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);

    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export function DesignProcessRoute() {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  const heroSrc = useMemo(() => {
    if (isMobile) {
      return theme === "dark"
        ? "/designProcess/DesignProcessMobileDark.svg"
        : "/designProcess/DesignProcessMobile.svg";
    }

    return theme === "dark"
      ? "/designProcess/DesignProcessDarkMode.svg"
      : "/designProcess/DesignProcess.svg";
  }, [isMobile, theme]);

  return (
    <div className="page-content page-content--design-process">
      <header className="dp-hero" aria-label="My Design Process hero">
        <h1 className="sr-only">My Design Process</h1>
        <img
          alt=""
          className="dp-hero-image"
          decoding="async"
          src={heroSrc}
        />
        <div aria-hidden="true" className="dp-hero-note">
          <span>MY</span>
          <span>DESIGN</span>
        </div>
      </header>

      <section className="dp-section dp-section--intro" aria-label="Intro">
        <div className="dp-container">
          <h2 className="dp-h2">My Design Process</h2>
          <p className="dp-lead">
            I start with clarity, build a visual direction, research until the
            architecture is concrete, then iterate fast with AI without giving
            up human judgment.
          </p>
        </div>
      </section>
    </div>
  );
}

