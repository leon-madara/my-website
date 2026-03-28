import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function HomeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function AboutIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function PortfolioIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function ProcessIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="6" cy="6" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="18" cy="18" r="2" />
      <path d="M7.5 7.5l3 3" />
      <path d="M13.5 13.5l3 3" />
    </svg>
  );
}

function ContactIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function GithubIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416C4.421 17.773 3.634 17.404 3.634 17.404c-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.5 11.5 0 0 1 12 5.47c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.562 21.8 24 17.302 24 12 24 5.373 18.627 0 12 0Z" />
    </svg>
  );
}

function LinkedinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.026-3.037-1.851-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.352V9h3.414v1.561h.046c.476-.9 1.636-1.85 3.369-1.85 3.601 0 4.266 2.37 4.266 5.455v6.286ZM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.924 2.065-2.064 2.065ZM7.12 20.452H3.555V9H7.12v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    </svg>
  );
}

function XIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.503 11.24h-6.658l-5.214-6.817-5.965 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.714 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.083 4.126H5.117Z" />
    </svg>
  );
}

export interface SiteRoute {
  title: string;
  path: string;
  summary: string;
  icon: (props: IconProps) => ReactNode;
}

export const siteRoutes: SiteRoute[] = [
  {
    title: "Home",
    path: "/",
    summary: "Hero, theme, nav, and home-specific interactions.",
    icon: HomeIcon
  },
  {
    title: "About",
    path: "/about",
    summary: "GSAP parallax and long-scroll content.",
    icon: AboutIcon
  },
  {
    title: "Portfolio",
    path: "/portfolio",
    summary: "Typed portfolio routes and case studies.",
    icon: PortfolioIcon
  },
  {
    title: "Process",
    path: "/design-process",
    summary: "My design process: research, experimentation, and execution rhythm.",
    icon: ProcessIcon
  },
  {
    title: "Contact",
    path: "/contact",
    summary: "Form, FAQ, live time, and copy interactions.",
    icon: ContactIcon
  }
];

export const sidebarStats = [
  { value: "72.9K", label: "Likes" },
  { value: "828", label: "Projects" },
  { value: "342.9K", label: "Views" }
];

export const socialLinks = [
  {
    title: "GitHub Profile",
    href: "https://github.com/leon-madara",
    icon: GithubIcon
  },
  {
    title: "LinkedIn Profile",
    href: "https://www.linkedin.com/in/leon-madara/",
    icon: LinkedinIcon
  },
  {
    title: "Twitter/X Profile",
    href: "https://twitter.com/leon_madara",
    icon: XIcon
  }
];
