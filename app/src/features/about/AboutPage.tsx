import type { RefObject } from "react";
import {
  aboutHeroContent,
  aboutIntroContent,
  certificationItems,
  educationItems,
  experienceItems,
  expertiseItems,
  projectItems,
  skillCategories
} from "./aboutContent";
import { AboutHero } from "./components/AboutHero";
import { AboutIntroSection } from "./components/AboutIntroSection";
import { CertificationsSection } from "./components/CertificationsSection";
import { EducationSection } from "./components/EducationSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { SkillsSection } from "./components/SkillsSection";

interface AboutPageProps {
  contentClassName: string;
  rootRef: RefObject<HTMLDivElement | null>;
}

export function AboutPage({ contentClassName, rootRef }: AboutPageProps) {
  return (
    <div className={contentClassName} ref={rootRef}>
      <div aria-hidden="true" className="about-top-gradient" />
      <AboutHero content={aboutHeroContent} />
      <AboutIntroSection content={aboutIntroContent} expertiseItems={expertiseItems} />
      <SkillsSection title="Skills & Technologies" categories={skillCategories} />
      <ExperienceSection title="Professional Experience" items={experienceItems} />
      <EducationSection title="Education" items={educationItems} />
      <ProjectsSection title="Featured Projects" items={projectItems} />
      <CertificationsSection title="Certifications" items={certificationItems} />
    </div>
  );
}
