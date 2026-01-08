/**
 * Portfolio Type Definitions
 * 
 * These types define the structure of YOUR project data (content layer).
 * They will be mapped to showcase component interfaces via adapters.
 * 
 * @fileoverview Type definitions for portfolio content and showcase components
 */

// ============================================================================
// Core Project Types (Your Content)
// ============================================================================

export interface ProjectData {
  eastleigh: ProjectInfo;
  delivah: ProjectInfo;
  edumanage: ProjectInfo;
}

export interface ProjectInfo {
  id: string;
  name: string;
  tagline: string;
  status: 'Production-Ready' | 'Beta' | 'Active Development' | 'In Progress';
  timeline: string;
  caseStudy: boolean;
  
  quickStats: QuickStats;
  hero: HeroSection;
  challenge?: ChallengeSection;
  solution?: SolutionSection;
  features: Feature[];
  research?: ResearchSection;
  technicalArchitecture?: TechnicalArchitecture;
  results?: ResultsSection;
  designPrinciples?: string[];
  futureEnhancements?: string[];
  learnings?: string[];
  links: ProjectLinks;
  
  // Main content sections
  overview: OverviewSection;
  technical: TechnicalSection;
  impact: ImpactSection;
  process: ProcessSection;
}

// ============================================================================
// Section Types
// ============================================================================

export interface QuickStats {
  duration: string;
  status: string;
  techStack: string;
  impact: string;
  [key: string]: string; // Allow additional custom stats
}

export interface HeroSection {
  role: string;
  client: string;
  duration: string;
  status: string;
}

export interface ChallengeSection {
  title: string;
  problems: string[];
}

export interface SolutionSection {
  title: string;
  description: string;
  benefits: string[];
}

export interface Feature {
  feature: string;
  impact: string;
  icon: string;
}

export interface ResearchSection {
  userInsights: string[];
}

export interface TechnicalArchitecture {
  stack: string[];
  architecture: string[];
}

export interface ResultsSection {
  metrics: string[];
}

export interface ProjectLinks {
  live: string | null;
  github: string;
  demo: string | null;
}

// ============================================================================
// Overview Section
// ============================================================================

export interface OverviewSection {
  hero: string;
  problem: string;
  solution: string;
  keyFeatures: KeyFeature[];
}

export interface KeyFeature {
  icon: string;
  title: string;
  description: string;
}

// ============================================================================
// Technical Section
// ============================================================================

export interface TechnicalSection {
  stack: TechStackItem[];
  architecture: string;
  keyDecisions: KeyDecision[];
  challenges: TechnicalChallenge[];
}

export interface TechStackItem {
  name: string;
  version: string;
  purpose: string;
}

export interface KeyDecision {
  question: string;
  answer: string;
}

export interface TechnicalChallenge {
  challenge: string;
  problem: string;
  solution: string;
  result: string;
}

// ============================================================================
// Impact Section
// ============================================================================

export interface ImpactSection {
  metrics: ImpactMetric[];
  businessValue: string;
  testimonials: Testimonial[];
}

export interface ImpactMetric {
  label: string;
  value: string;
  description: string;
}

export interface Testimonial {
  quote?: string;
  author?: string;
  role?: string;
  company?: string;
}

// ============================================================================
// Process Section
// ============================================================================

export interface ProcessSection {
  research: string[];
  methodology: string;
  timeline: TimelinePhase[];
  lessonsLearned: string[];
}

export interface TimelinePhase {
  phase: string;
  tasks: string;
}

// ============================================================================
// Showcase Component Interface (Design Layer)
// ============================================================================

/**
 * These interfaces match the portfolio-showcase component expectations.
 * This is the format that showcase components consume.
 */

export interface ShowcaseProject {
  id: string;
  badge: string;
  title: string;
  summary: string;
  timeline: string;
  role: string;
  status: string;
  highlights: string[];
  link?: string;
  sections: ShowcaseSection[];
}

export interface ShowcaseSection {
  id: string;
  title: string;
  pages: ShowcasePage[];
}

export interface ShowcasePage {
  id: number;
  title: string;
  content: string;
  image?: string;
}

// ============================================================================
// Adapter Return Type
// ============================================================================

export interface AdaptedPortfolioData {
  projects: ShowcaseProject[];
  projectsMap: Record<string, ShowcaseProject>;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Extract project IDs as a union type
 */
export type ProjectId = 'eastleigh' | 'delivah' | 'edumanage';

/**
 * Make all properties of an interface optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Type guard to check if a value is a valid ProjectId
 */
export function isProjectId(value: string): value is ProjectId {
  return ['eastleigh', 'delivah', 'edumanage'].includes(value);
}
