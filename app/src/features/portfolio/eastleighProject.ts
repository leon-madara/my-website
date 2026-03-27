import { TabbedCaseStudyProject } from "./portfolio.types";

export const eastleighProject: TabbedCaseStudyProject = {
  template: "tabbed-case-study",
  slug: "eastleigh",
  badge: "01",
  title: "Eastleigh Turf Flow",
  tagline:
    "Modern e-commerce platform for a professional turf installation business.",
  status: "Production-Ready",
  timeline: "3 weeks",
  role: "Full Stack Developer",
  techStack: [
    "React 18",
    "TypeScript",
    "Supabase",
    "Tailwind CSS",
    "shadcn/ui",
    "Framer Motion"
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
            "Eastleigh Turf Flow is a modern web application designed for a Kenyan turf installation business that needed more than a brochure site. The goal was to make product quality, pricing, and trust legible at first glance.",
            "The experience combines a polished storefront with business tooling: customers can explore featured turf products, while wholesale partners get a secure path into broker-specific workflows."
          ],
          metrics: [
            {
              label: "Timeline",
              value: "3 weeks",
              description: "Rapid build from discovery through product polish."
            },
            {
              label: "Type Coverage",
              value: "97%+",
              description: "Strict TypeScript across the application."
            },
            {
              label: "Target Surface",
              value: "Mobile-first",
              description: "Built for the majority-mobile traffic profile."
            }
          ]
        },
        {
          id: "role-timeline",
          title: "Role & Timeline",
          body: [
            "I owned the project end to end: research, architecture, UI implementation, Supabase integration, and production hardening. The build was intentionally phased so the most trust-sensitive parts of the customer journey shipped first.",
            "Week one focused on requirements and UI structure, week two on authentication and data integration, and week three on motion, responsiveness, and launch-readiness."
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
            "React 18 and TypeScript anchor the application, with Vite keeping iteration fast and builds lean. Supabase handles authentication, PostgreSQL, and storage so the product can move like a polished MVP without bespoke infrastructure overhead.",
            "Tailwind CSS, shadcn/ui, and Framer Motion round out the UI system, providing accessible building blocks and smooth interaction design without fighting the speed of the project."
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
            "The existing business presentation created a visual trust gap. Customers struggled to imagine the finished result, pricing felt hidden, and the digital journey did not reflect the quality of the physical service.",
            "On top of that, the team needed a broker workflow for wholesale relationships, which meant the product had to support both customer-facing merchandising and privileged operational access."
          ]
        },
        {
          id: "pain-points",
          title: "Pain Points",
          body: [
            "Research showed that static before-and-after storytelling was not enough. People wanted to understand the actual product options, the expected transformation, and the cost frame before starting a conversation.",
            "The second pain point was operational: broker interactions were happening outside a coherent digital system, making approval and relationship management harder than it needed to be."
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
            "The product needed to communicate quality immediately, support product exploration on mobile devices, and create a secure path for broker users without making the public experience feel heavy.",
            "That translated into three concrete goals: better visual trust, faster product discovery, and a cloud-backed workflow that could support real business operations instead of a static marketing shell."
          ]
        },
        {
          id: "success-criteria",
          title: "Success Criteria",
          body: [
            "The experience had to look professional on any screen size, feel trustworthy in its pricing and product detail, and keep the broker path clearly separated from public browsing.",
            "From an engineering perspective, the project also needed a strongly typed codebase and reusable component structure so later iterations would be cheaper and safer."
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
          title: "Results & Metrics",
          body: [
            "The finished build demonstrates a professional e-commerce experience that brings pricing, product specifications, and mobile usability into a single clear narrative.",
            "The biggest technical win was how much risk TypeScript removed during development. The codebase stayed flexible, but refactors could happen with confidence instead of guesswork."
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
            "Eastleigh Turf Flow proves the business can present itself as modern, reliable, and operationally capable. It reads like a real product, not an aspirational concept.",
            "That matters because the work is doing two jobs at once: converting curious buyers with better storytelling and giving wholesale relationships a more credible digital home."
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
            "Competitive review surfaced a weak market baseline: many comparable sites were not even properly mobile responsive, and transparent product information was rare.",
            "Interviews made the design direction obvious. People wanted to see what the finished outcome could look like, understand the product options, and trust the business before taking the next step."
          ]
        },
        {
          id: "feedback",
          title: "Signals from the Market",
          body: [
            "Mobile behavior drove the architecture more than aesthetics did. With most search traffic arriving on phones, the interface had to feel native to thumb-first exploration from the start.",
            "Broker conversations also validated the need for a secure digital path rather than another manual, off-platform relationship process."
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
            "Testing centered on the realities most likely to hurt trust: authentication edges, responsive breakpoints, navigation clarity, and type-safe Supabase integration.",
            "The quality bar was not only visual. The experience needed to feel stable and professional under common user flows, especially around account and broker interactions."
          ]
        },
        {
          id: "iterations",
          title: "Iterations",
          body: [
            "The strongest iteration loop came from simplifying complexity rather than adding flourishes. Product cards, broker states, and navigation wording were all refined to make the experience feel more self-explanatory.",
            "That discipline kept the app polished without turning it into a UI experiment that would be harder to maintain later."
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
            "The final UI emphasizes clear product cards, transparent specifications, and visual rhythm that supports scanning. Motion is present, but it serves comprehension rather than novelty.",
            "Everything in the visual system is trying to close the trust gap: price visibility, product detail, responsive spacing, and a professional tone throughout."
          ]
        },
        {
          id: "design-system",
          title: "Design Principles",
          body: [
            "The interface follows a few durable principles: mobile-first layout, reusable components, strong type-backed UI contracts, and a visual style that feels premium without overdecorating.",
            "shadcn/ui and Tailwind gave the system speed, but the real value came from using them to create a consistent, business-appropriate experience."
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
          title: "Architecture",
          body: [
            "The system is deliberately pragmatic: React on the frontend, Supabase for auth and data, and a reusable component structure that keeps future expansion within reach.",
            "That architecture kept the launch lightweight while still giving the product room to evolve into a more fully operational platform."
          ]
        },
        {
          id: "implementation",
          title: "Implementation Highlights",
          body: [
            "The trickiest implementation work sat at the intersection of type safety, responsive layout, and auth flows. Those are the places where a product can feel polished in demos but brittle in reality if the foundations are weak.",
            "Solving them early meant the final experience felt calm and coherent, even though the project moved quickly."
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
            "The strongest next steps are transactional and operational: cart and checkout flows, inventory visibility, richer admin analytics, and deeper customer account experiences.",
            "Because the current build already has a clear component and platform foundation, those additions can extend the product instead of requiring a rewrite."
          ]
        },
        {
          id: "learnings",
          title: "Key Learnings",
          body: [
            "TypeScript was not optional once the feature count grew. It made refactoring realistic and caught issues before they turned into production instability.",
            "The other big lesson was strategic: for small businesses, a fast, trustworthy, mobile-first experience can matter more than feature volume if the product tells the right story cleanly."
          ]
        }
      ]
    }
  ]
};
