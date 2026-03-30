import { TabbedCaseStudyProject } from "./portfolio.types";

export const legitLogisticsProject: TabbedCaseStudyProject = {
  template: "tabbed-case-study",
  slug: "legit-logistics",
  badge: "02",
  title: "Legit Logistics",
  tagline:
    "Owner-operated delivery operations platform connecting quotes, dispatch, tracking, and proof.",
  status: "Production-Ready",
  timeline: "Phased rollout",
  role: "Full Stack Developer",
  techStack: [
    "React 18 + TypeScript + Supabase",
    "Admin dashboard + driver proof workflow",
    "Public tracking + quote review flow",
    "15,000+ deliveries completed"
  ],
  links: {
    live: "https://legit-logistics.com",
    github: "https://github.com/leon-madara/design-compass.git"
  },
  hero: {
    eyebrow: "Case Study 02",
    intro:
      "Legit Logistics is a trust-first logistics platform built to connect quote review, dispatch operations, public tracking, and proof of delivery in one coherent product."
  },
  seo: {
    title: "Legit Logistics | Leon Madara",
    description:
      "Case study covering the customer journey, operational tooling, and trust-first interaction model behind Legit Logistics.",
    keywords: ["Legit Logistics", "portfolio", "logistics", "dispatch"]
  },
  preview: {
    summary:
      "A connected logistics workflow that makes pricing, dispatch, customer visibility, and delivery proof feel like one product instead of disconnected tools.",
    highlights: [
      "Quote and counter-offer workflow",
      "Admin dispatch dashboard",
      "Public tracking experience",
      "Driver proof-of-delivery flow"
    ]
  },
  sections: [
    {
      id: "details",
      label: "Project Details",
      number: "01",
      pages: [
        {
          id: "overview",
          title: "Overview",
          body: [
            "Legit Logistics combines a polished public-facing brand with real operational tooling. Customers can understand services and review quotes, while dispatchers and drivers move jobs through a coherent internal workflow.",
            "The product is intentionally trust-first: it avoids exposing premature tracking states and focuses on giving each participant the right information at the right moment."
          ],
          metrics: [
            {
              label: "Deliveries",
              value: "15,000+",
              description: "Published product metric for handled jobs."
            },
            {
              label: "On-Time Rate",
              value: "99.2%",
              description: "Reliability surfaced through the live experience."
            },
            {
              label: "Clients",
              value: "500+",
              description: "Business customers supported by the platform."
            }
          ]
        },
        {
          id: "role-timeline",
          title: "Role & Timeline",
          body: [
            "I approached Legit Logistics as a phased full-stack rollout. The public marketing surface, quote review journey, admin tooling, tracking, and driver proof workflow all had to feel related, even though they matured in stages.",
            "That meant treating the information architecture as a product system from the start instead of building disconnected pages and hoping they would later feel unified."
          ],
          callouts: [
            {
              title: "Core Role",
              body: "Full-stack implementation across customer, admin, and driver-facing experiences."
            },
            {
              title: "Timeline",
              body: "Phased rollout from service positioning through operational tooling."
            }
          ]
        },
        {
          id: "tech-stack",
          title: "Tech Stack",
          body: [
            "React 18, TypeScript, and Supabase provide the application core, while Tailwind CSS and accessible UI primitives keep the interface adaptable across public and operational contexts.",
            "TanStack Query, React Hook Form, and Zod support the parts of the product where data freshness and validated input matter most, especially in admin workflows."
          ]
        }
      ]
    },
    {
      id: "problem",
      label: "Problem",
      number: "02",
      pages: [
        {
          id: "challenge",
          title: "The Challenge",
          body: [
            "Many delivery businesses piece together quotes, dispatch, status updates, and proof collection across separate tools. That fragmentation slows operations and makes the customer experience feel less trustworthy.",
            "Legit Logistics needed a system that could serve both the public story of the business and the practical mechanics of moving deliveries through the real world."
          ]
        },
        {
          id: "pain-points",
          title: "Pain Points",
          body: [
            "Customers wanted meaningful updates, not placeholder tracking links that created false confidence. Dispatchers needed one operational surface instead of scattered steps. Drivers needed mobile-friendly controls that respected field realities.",
            "Those pressures made it clear that the platform had to be built around workflow timing and trust, not just feature checklists."
          ],
          callouts: [
            {
              title: "Public Side",
              body: "Service clarity, honest quote review, and trustworthy delivery visibility."
            },
            {
              title: "Operational Side",
              body: "Faster job creation, better monitoring, and simpler proof capture."
            }
          ]
        }
      ]
    },
    {
      id: "goal",
      label: "Goal",
      number: "03",
      pages: [
        {
          id: "objectives",
          title: "Objectives",
          body: [
            "The primary goal was to make the business feel owner-operated, responsive, and operationally credible. That required a product that could move from service discovery to completed delivery without losing narrative or technical coherence.",
            "A second goal was to reduce dispatcher and driver friction by centralizing the job lifecycle into clearer, more focused interfaces."
          ]
        },
        {
          id: "success-criteria",
          title: "Success Criteria",
          body: [
            "Success meant that customers could review quotes clearly, dispatchers could create and monitor jobs quickly, and proof-of-delivery workflows would hold up on mobile in actual field conditions.",
            "It also meant the product had to express a trust-first philosophy: only share delivery visibility when it reflects a real operational state."
          ],
          metrics: [
            {
              label: "Job Creation",
              value: "<2 min",
              description: "Target for creating and sharing deliveries from admin."
            },
            {
              label: "Support Promise",
              value: "24/7",
              description: "Expectation set clearly through the product."
            }
          ]
        }
      ]
    },
    {
      id: "impact",
      label: "Impact",
      number: "04",
      pages: [
        {
          id: "metrics",
          title: "Results & Metrics",
          body: [
            "The product tells a stronger operational story because it connects public trust signals to real workflow states. Customers see clearer service positioning and more honest delivery visibility, while dispatchers get a faster control surface.",
            "The strongest metrics are operational, but the bigger win is experiential: the business now feels coordinated instead of improvised."
          ],
          metrics: [
            {
              label: "Deliveries Completed",
              value: "15,000+",
              description: "Real handled delivery volume."
            },
            {
              label: "On-Time Rate",
              value: "99.2%",
              description: "Operational reliability signal."
            },
            {
              label: "Business Clients",
              value: "500+",
              description: "Commercial customer base supported."
            }
          ]
        },
        {
          id: "business-value",
          title: "Business Value",
          body: [
            "Legit Logistics demonstrates how a small logistics business can pair strong brand presentation with real operational software. It is not just a services site and not just an admin dashboard; it is the connective tissue between them.",
            "That makes the platform valuable as both a customer-facing trust engine and a workflow simplifier for the team running deliveries."
          ]
        }
      ]
    },
    {
      id: "early-adoption",
      label: "Early Adoption",
      number: "05",
      pages: [
        {
          id: "research",
          title: "Research",
          body: [
            "Early product signals showed that people valued timing and honesty over sheer data density. Tracking needed to appear when it was meaningful, and quote negotiation needed room for back-and-forth without feeling chaotic.",
            "On the operations side, stakeholders needed a shared source of truth for pending, active, and completed jobs."
          ]
        },
        {
          id: "feedback",
          title: "Operational Insights",
          body: [
            "Mobile interactions mattered more than expected because both dispatchers and drivers needed to keep work moving in less-than-ideal contexts. That pushed the product toward touch-friendly controls and compact, high-signal layouts.",
            "Those insights shaped the eventual split between public trust-building UI and focused operational workflows."
          ]
        }
      ]
    },
    {
      id: "testing",
      label: "Testing",
      number: "06",
      pages: [
        {
          id: "qa-process",
          title: "QA Process",
          body: [
            "Quality work concentrated on the boundaries where workflow state could become confusing: quote transitions, tracking activation, admin refetch behavior, and proof-of-delivery completion.",
            "The aim was not only preventing defects, but preserving clarity at every state change."
          ]
        },
        {
          id: "iterations",
          title: "Iterations",
          body: [
            "The product improved through interface reduction as much as through new capability. Simplifying job creation, surfacing the right status moments, and keeping driver steps focused made the whole system feel more reliable.",
            "That iterative discipline is what turned multiple surfaces into one product language."
          ]
        }
      ]
    },
    {
      id: "final-designs",
      label: "Final Designs",
      number: "07",
      pages: [
        {
          id: "ui-showcase",
          title: "Interface Showcase",
          body: [
            "The public UI emphasizes service clarity and confidence, while the internal surfaces prioritize speed, hierarchy, and state awareness. The product works because each surface respects its own job without losing the overall brand tone.",
            "That balance is especially visible in the admin dashboard and the customer-facing tracking experience."
          ]
        },
        {
          id: "design-system",
          title: "Design Principles",
          body: [
            "The design system is guided by owner-operated clarity, touch-friendly efficiency, and operational trust. Visual polish matters, but only when it supports those three principles.",
            "As a result, the UI remains calm even when workflows involve many states and roles."
          ],
          callouts: [
            {
              title: "Trust-first",
              body: "Only show tracking when the state truly supports it."
            },
            {
              title: "Mobile-minded",
              body: "Driver and dispatcher flows stay usable on smaller screens."
            }
          ]
        }
      ]
    },
    {
      id: "development",
      label: "Development",
      number: "08",
      pages: [
        {
          id: "architecture",
          title: "Architecture",
          body: [
            "The architecture spans marketing routes, quote review flows, public tracking, an authenticated admin dashboard, and driver-facing status controls. Supabase acts as the backend foundation while React Query keeps operational screens responsive.",
            "This structure makes the product feel unified because state and access rules can be coordinated across public and internal experiences."
          ]
        },
        {
          id: "implementation",
          title: "Implementation Highlights",
          body: [
            "The hardest implementation problems were not purely technical; they were product-shape problems. Tracking timing, mobile proof capture, and admin visibility all required the data model and UI flow to reinforce each other.",
            "Solving those constraints well is what turned the platform into a believable operational tool instead of a collection of demos."
          ],
          callouts: [
            {
              title: "Driver Flow",
              body: "Touch-friendly status progression, photo upload, and signature capture."
            },
            {
              title: "Admin Flow",
              body: "Centralized delivery creation, sharing, and monitoring in one dashboard."
            }
          ]
        }
      ]
    },
    {
      id: "future-steps",
      label: "Future Steps",
      number: "09",
      pages: [
        {
          id: "roadmap",
          title: "Roadmap",
          body: [
            "The clearest next opportunities are dispatch analytics, notification automation, richer pricing data, and more advanced route planning support.",
            "Because the workflow backbone is already in place, future work can focus on operational leverage rather than rebuilding core product structure."
          ]
        },
        {
          id: "learnings",
          title: "Key Learnings",
          body: [
            "Legit Logistics reinforced that trust in logistics UX is mostly about timing and truthfulness. The right information shown at the wrong moment can be more damaging than less information.",
            "It also reinforced how much operational software benefits from the same design care usually reserved for public-facing pages."
          ]
        }
      ]
    }
  ]
};
