export type BadgeVariant = "verified" | "progress";

export interface AboutHeroContent {
  eyebrow: string;
  name: string;
  imageSrc: string;
  imageAlt: string;
}

export interface AboutIntroContent {
  eyebrow: string;
  summary: string;
}

export interface ExpertiseItem {
  title: string;
  description: string;
  tags?: string[];
  featured?: boolean;
  icon?: string;
}

export interface SkillCategory {
  title: string;
  tags: string[];
}

export interface ExperienceLink {
  label: string;
  to: string;
}

export interface ExperienceItem {
  role: "analyst" | "freelance" | "company";
  date: string;
  title: string;
  subtitle?: string;
  location: string;
  chips: string[];
  highlights: string[];
  links: ExperienceLink[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  honors?: string;
  years: string;
  icon?: string;
}

export interface ProjectItem {
  title: string;
  description: string;
  tags: string[];
  icon?: string;
}

export interface CertificationMetric {
  value: string;
  label: string;
}

export interface CertificationItem {
  title: string;
  issuer: string;
  issuerLabel?: string;
  badge: string;
  badgeVariant: BadgeVariant;
  years: string;
  metrics: CertificationMetric[];
  skills: string[];
  topics: string[];
  verifyHref: string;
  viewHref?: string;
  viewLabel?: string;
}
