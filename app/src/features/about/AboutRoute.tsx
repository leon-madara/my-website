import { Helmet } from "react-helmet-async";
import { useRef } from "react";
import { siteConfig } from "../../siteConfig";
import "./about.css";
import { AboutPage } from "./AboutPage";
import { useAboutHeroImageRandomizer } from "./hooks/useAboutHeroImageRandomizer";
import { useAboutHeroMotion } from "./hooks/useAboutHeroMotion";
import { useAboutSectionReveal } from "./hooks/useAboutSectionReveal";
import { useAboutShellBehavior } from "./hooks/useAboutShellBehavior";

export function AboutRoute() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { contentClassName } = useAboutShellBehavior();

  useAboutSectionReveal(rootRef);
  useAboutHeroMotion(rootRef);
  useAboutHeroImageRandomizer(rootRef);

  return (
    <>
      <Helmet>
        <title>About — Leon Madara</title>
        <meta name="description" content="Over a decade of experience in web development, data analysis, and UI/UX design. Based in Nairobi, Kenya. Founder of Code by Leon." />
        <link rel="canonical" href={`${siteConfig.baseUrl}/about`} />
        <meta property="og:title" content="About — Leon Madara" />
        <meta property="og:description" content="Over a decade of experience in web development, data analysis, and UI/UX design. Based in Nairobi, Kenya. Founder of Code by Leon." />
        <meta property="og:url" content={`${siteConfig.baseUrl}/about`} />
      </Helmet>
      <AboutPage contentClassName={contentClassName} rootRef={rootRef} />
    </>
  );
}
