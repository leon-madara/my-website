import { TabbedCaseStudyProject } from "./portfolio.types";

export const eastleighProject: TabbedCaseStudyProject = {
  template: "tabbed-case-study",
  slug: "eastleigh",
  badge: "01",
  title: "Eastleigh Turf Flow",
  tagline:
    "Full-stack e-commerce platform for a professional turf installation business.",
  status: "Production-Ready",
  timeline: "3 weeks",
  role: "Full Stack Developer",
  techStack: [
    "React 18 with TypeScript",
    "Supabase backend with RLS",
    "Tailwind CSS UI",
    "CI/CD via Vercel"
  ],
  links: {
    github: "https://github.com/leon-madara/eastleigh-turf-flow/"
  },
  hero: {
    eyebrow: "Case Study 01",
    intro:
      "Eastleigh Turf Flow turns a trust-heavy local service into a polished digital buying journey with interactive product discovery, broker workflows, and mobile-first performance."
  },
  seo: {
    title: "Eastleigh Turf Flow | Leon Madara",
    description:
      "Case study covering the research, architecture, product design, and launch strategy behind Eastleigh Turf Flow.",
    keywords: ["Eastleigh Turf Flow", "portfolio", "e-commerce", "Supabase"]
  },
  preview: {
    summary:
      "A full-stack storefront and broker portal built to make product trust, pricing clarity, and mobile responsiveness feel native to the business.",
    highlights: [
      "Interactive product showcase",
      "Broker authentication portal",
      "Mobile-first product discovery",
      "Type-safe cloud architecture"
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
            "Eastleigh Turf Flow is a modern, full-stack e-commerce platform designed for a professional turf installation business in Kenya. It transforms the traditional turf sales process through interactive product showcases, broker authentication systems, and seamless order management."
          ]
        },
        {
          id: "role-timeline",
          title: "Role & Team",
          body: [
            "As the lead developer, I was responsible for the full lifecycle: from UI/UX design to backend architecture. The project was executed over a 3-week sprint, focusing on rapid delivery of a production-ready MVP."
          ],
          callouts: [
            {
              title: "Primary Role",
              body: "Full-stack development with frontend, backend integration, and launch support."
            },
            {
              title: "Delivery Mode",
              body: "Short-cycle implementation with reusable component architecture from day one."
            }
          ]
        },
        {
          id: "tech-stack",
          title: "Tech Stack",
          body: [
            "React 18, TypeScript, Vite, Supabase, Tailwind CSS, shadcn/ui, and Framer Motion gave the product a fast iteration loop, strong type safety, and a polished UI foundation without adding unnecessary infrastructure."
          ],
          callouts: [
            {
              title: "Frontend",
              body: "React 18, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion."
            },
            {
              title: "Platform",
              body: "Supabase auth, database, storage, and deployment-friendly build tooling."
            }
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
            "Local turf businesses face a 'Visual Trust Gap' where customers struggle to see results from static images. Potential customers often abandon sites due to lack of transparency in pricing and complex booking flows."
          ]
        },
        {
          id: "pain-points",
          title: "Market Reality",
          body: [
            "Research consistently shows the majority of searches happen on mobile, yet current competitor sites had poor mobile UX, slow loading times, and broken layouts on handheld devices."
          ],
          callouts: [
            {
              title: "Customer Friction",
              body: "Low-confidence browsing, weak visualization, and too much hidden information."
            },
            {
              title: "Business Friction",
              body: "No structured broker flow and no cloud-backed foundation for scaling the relationship side."
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
            "The goal was to build a trustworthy, mobile-first platform that showcased product quality clearly, surfaced pricing without friction, and created a secure broker workflow for wholesale relationships."
          ]
        },
        {
          id: "success-criteria",
          title: "Success Metrics",
          body: [
            "The platform needed to stay under a 2-second load time, hit 95%+ TypeScript coverage, and deliver a fully responsive experience across desktop, tablet, and mobile."
          ],
          metrics: [
            {
              label: "Reusable Components",
              value: "85%+",
              description: "Deliberate emphasis on long-term maintainability."
            },
            {
              label: "Load Experience",
              value: "<2s",
              description: "Optimized Vite output and focused asset loading."
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
          title: "Results",
          body: [
            "The final product delivered a professional e-commerce experience with fast load times, strong type safety, and a responsive interface that made pricing, product details, and broker access feel clear and reliable."
          ],
          metrics: [
            {
              label: "Page Load",
              value: "<2s",
              description: "Fast entry into the experience."
            },
            {
              label: "Mobile Coverage",
              value: "100%",
              description: "Responsive layouts across the full surface."
            },
            {
              label: "Type Safety",
              value: "97%+",
              description: "Compile-time protection across key workflows."
            }
          ]
        },
        {
          id: "business-value",
          title: "Business Value",
          body: [
            "Eastleigh Turf Flow gave the business a more credible digital presence, reduced trust friction for new customers, and created a practical broker workflow that can support growth without adding manual overhead."
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
          title: "User Research",
          body: [
            "Competitive review and customer interviews pointed to the same need: better visual proof, clearer pricing, and a mobile-first experience that felt trustworthy from the first interaction."
          ]
        },
        {
          id: "feedback",
          title: "Initial Feedback",
          body: [
            "User testing revealed strong early trust signals. Interactive product cards, transparent pricing, and the mobile-first flow all made the business feel more professional and more credible."
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
          title: "Performance",
          body: [
            "Cross-browser testing, mobile checks, and performance audits kept the experience stable under real network conditions. The final build held a fast load profile while preserving motion polish."
          ]
        },
        {
          id: "iterations",
          title: "QA Strategy",
          body: [
            "Quality assurance focused on the places that could break trust fastest: authentication, broker access, responsive layouts, and the reliability of Supabase-backed workflows."
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
          title: "Product Showcase",
          body: [
            "The final showcase focused on clear product cards, transparent specifications, and a visual rhythm that helped customers scan quickly while building confidence in the service."
          ]
        },
        {
          id: "design-system",
          title: "Broker Portal",
          body: [
            "The broker portal introduced secure phone OTP authentication, role-based access, and a clean workflow for wholesale relationships. It gave the business an operational layer instead of another static marketing page."
          ],
          callouts: [
            {
              title: "Mobile-first",
              body: "Designed for the traffic reality rather than retrofitted later."
            },
            {
              title: "Professional Clarity",
              body: "Clear hierarchy, transparent product details, and accessible interactions."
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
          title: "Tech Stack",
          body: [
            "React 18, TypeScript, Vite, Supabase, Tailwind CSS, shadcn/ui, and Framer Motion formed the core stack. The system stayed fast to build, strongly typed, and lightweight enough for a production-ready MVP."
          ]
        },
        {
          id: "implementation",
          title: "Architecture",
          body: [
            "The architecture was intentionally modular: reusable components on the frontend, Supabase for auth and data, and clear type-safe contracts between UI and backend. That kept the product adaptable without over-engineering it."
          ],
          callouts: [
            {
              title: "Supabase Types",
              body: "Wrapper patterns and typed data contracts reduced runtime uncertainty."
            },
            {
              title: "Responsive Grid",
              body: "Product cards scale from single-column mobile to multi-column desktop without losing rhythm."
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
            "Next steps include cart and checkout flows, richer inventory visibility, customer accounts, and deeper analytics, all building on the reusable foundation already in place."
          ]
        },
        {
          id: "learnings",
          title: "Lessons",
          body: [
            "TypeScript made rapid iteration safer, mobile-first design proved essential, and transparency around pricing and product detail did most of the trust-building work. The product succeeded because it felt credible, not because it felt crowded."
          ]
        }
      ]
    }
  ]
};
