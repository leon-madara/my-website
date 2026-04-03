import { useRef } from "react";
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

  return <AboutPage contentClassName={contentClassName} rootRef={rootRef} />;
}
