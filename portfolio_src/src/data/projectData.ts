import type { ProjectData } from '../types/portfolio.types';

/**
 * Portfolio Projects Data
 * 
 * This is YOUR content - it contains information about YOUR projects.
 * This data is separate from the design/UI components from portfolio-showcase.
 * 
 * 🔒 PROTECTED: DO NOT sync this file from portfolio-showcase.
 * 🔒 PROTECTED: DO NOT overwrite this file during automated syncs.
 * 
 * This file is listed in .syncignore to prevent accidental overwrites.
 * 
 * @see ../types/portfolio.types.ts - Type definitions
 * @see ../adapters/portfolioAdapter.ts - Transforms this data for showcase components
 */

export const projectsData: ProjectData = {
  eastleigh: {
    id: 'eastleigh',
    name: 'Eastleigh Turf Flow',
    tagline: 'Modern E-Commerce Platform | React 18 + TypeScript + Supabase',
    status: 'Production-Ready',
    timeline: '3 weeks',
    caseStudy: true,

    quickStats: {
      duration: '3 weeks',
      status: 'Production-Ready',
      techStack: 'React 18, TypeScript, Vite, Supabase, Tailwind CSS, shadcn/ui',
      impact: 'Full-stack e-commerce with broker authentication',
      typeScriptCoverage: '97%+'
    },

    hero: {
      role: 'Full Stack Developer',
      client: 'Professional Turf Installation Business',
      duration: '3 weeks',
      status: 'Production-Ready'
    },

    challenge: {
      title: 'Challenge',
      problems: [
        'Visual trust gap - customers struggle to visualize transformation',
        'Static presentations fail to engage modern consumers',
        'Complex ordering process creates friction',
        'Poor mobile experience despite 68% mobile traffic',
        'No digital system for managing wholesale broker relationships'
      ]
    },

    solution: {
      title: 'Solution',
      description: 'Full-stack e-commerce platform with interactive product showcase and broker authentication',
      benefits: [
        'Interactive product cards with detailed specifications',
        'Secure broker portal with multi-role authentication',
        'Mobile-first responsive design with smooth animations',
        'Cloud-based order and user management system'
      ]
    },

    features: [
      {
        feature: 'Interactive Product Showcase',
        impact: 'Featured products with pricing, specs, and testimonials',
        icon: '🎯'
      },
      {
        feature: 'Broker Authentication Portal',
        impact: 'Secure login with phone OTP and role-based access',
        icon: '🔐'
      },
      {
        feature: 'Responsive Design',
        impact: 'Mobile-first with 60fps animations',
        icon: '📱'
      },
      {
        feature: 'Cloud Backend',
        impact: 'Supabase for auth, database, and storage',
        icon: '☁️'
      }
    ],

    research: {
      userInsights: [
        'Analyzed 15 competitor websites - only 40% mobile responsive',
        'User Interviews: "I want to see what it would actually look like" → Interactive showcase',
        'Mobile Behavior: 68% of searches on mobile → Mobile-first architecture',
        'Broker feedback: Need digital portal for wholesale orders → Authentication system'
      ]
    },

    technicalArchitecture: {
      stack: ['React 18', 'TypeScript', 'Vite', 'Supabase', 'Tailwind CSS', 'shadcn/ui', 'Framer Motion'],
      architecture: [
        'React 18: Component-based architecture with hooks',
        'TypeScript: 97%+ coverage for type safety',
        'Vite: Lightning-fast dev server and optimized builds',
        'Supabase: PostgreSQL database, authentication, and storage',
        'Tailwind CSS + shadcn/ui: Modern, accessible component library',
        'Framer Motion: Smooth 60fps animations'
      ]
    },

    results: {
      metrics: [
        'Professional e-commerce platform with broker management',
        'Type-safe codebase preventing runtime errors',
        'Mobile-optimized reaching 68% of traffic',
        'Secure authentication with role-based access'
      ]
    },

    designPrinciples: [
      'Mobile-First: 68% of traffic comes from mobile devices',
      'Type Safety: TypeScript prevents bugs before deployment',
      'Component Reusability: 85%+ reusable components',
      'Professional UI: shadcn/ui for accessible, beautiful design'
    ],

    futureEnhancements: [
      'Shopping cart and checkout system',
      'Real-time inventory management',
      'Customer review submission',
      'Analytics dashboard for admin',
      'AI-powered product recommendations'
    ],

    learnings: [
      'TypeScript is essential for scaling - caught 15+ bugs during development',
      'Component libraries accelerate development - shadcn/ui saved 2+ weeks',
      'Mobile-first is non-negotiable - 68% of traffic from mobile',
      'Supabase accelerates MVP - saved 2+ weeks vs custom backend'
    ],

    links: {
      live: null,
      github: 'https://github.com/leon-madara/eastleigh-turf-flow/',
      demo: null
    },

    overview: {
      hero: 'Modern, full-stack e-commerce platform designed for a professional turf installation business in Kenya. Built with React 18, TypeScript, and Supabase, this production-ready application transforms the traditional turf sales process through interactive product showcases, broker authentication systems, and seamless order management.',

      problem: 'Local turf installation businesses face critical challenges: visual trust gap where customers struggle to visualize transformation results, static presentations that fail to engage, complex ordering creating friction, poor mobile experience despite 68% mobile traffic, and no digital system for managing wholesale broker relationships.',

      solution: 'Eastleigh Turf Flow delivers a modern web application combining interactive product showcase with featured products and detailed specifications, secure broker authentication system with phone OTP and role-based access, responsive mobile-first design with smooth animations, and cloud infrastructure using Supabase for authentication, database, and storage.',

      keyFeatures: [
        {
          icon: '🎯',
          title: 'Interactive Product Showcase',
          description: 'Featured products with detailed specifications, transparent pricing (KES per m²), feature lists with visual indicators, smooth animations on scroll, and call-to-action buttons'
        },
        {
          icon: '🔐',
          title: 'Secure Broker Portal',
          description: 'Phone OTP authentication via Supabase, multi-role system (BROKER/ADMIN), pending approval workflow, session management with auto-refresh, and encrypted authentication'
        },
        {
          icon: '📱',
          title: 'Mobile-First Design',
          description: 'Responsive breakpoints (mobile/tablet/desktop), touch-optimized interactions, flexible grid layouts, adaptive typography, and 60fps animations with Framer Motion'
        },
        {
          icon: '⚡',
          title: 'Modern Tech Stack',
          description: 'React 18 component architecture, TypeScript 97%+ coverage, Vite for lightning-fast builds, Supabase cloud backend, Tailwind CSS + shadcn/ui components'
        },
        {
          icon: '💬',
          title: 'Customer Testimonials',
          description: '5-star rating display, customer names and locations, product purchased information, quote-style presentation building social proof'
        }
      ]
    },

    technical: {
      stack: [
        { name: 'React', version: '18+', purpose: 'Modern component-based architecture' },
        { name: 'TypeScript', version: '97%+ coverage', purpose: 'Type safety and developer experience' },
        { name: 'Vite', version: 'Latest', purpose: 'Lightning-fast dev server and builds' },
        { name: 'Supabase', version: 'Latest', purpose: 'Backend (PostgreSQL, Auth, Storage)' },
        { name: 'Tailwind CSS', version: '3.x', purpose: 'Utility-first styling system' },
        { name: 'shadcn/ui', version: 'Latest', purpose: 'Accessible component library' },
        { name: 'Framer Motion', version: 'Latest', purpose: 'Smooth animations' }
      ],

      architecture: 'Full-stack application with React 18 frontend, Supabase backend, and cloud storage. Component-based architecture with 85%+ reusability. Authentication flow: Phone OTP request → OTP verification → User profile creation → Role assignment → Pending approval → Admin approval. Database schema includes user_profiles table with role-based access control and orders table for transaction management.',

      keyDecisions: [
        {
          question: 'Why React 18 over Next.js?',
          answer: 'No SSR needed for this use case. Familiar ecosystem with large talent pool. Concurrent rendering for better UX. Simpler deployment without server requirements.'
        },
        {
          question: 'Why Supabase over custom backend?',
          answer: 'Built-in authentication saved 2+ weeks. PostgreSQL database with real-time capabilities. Cost-effective with generous free tier. Auto-generated TypeScript types. Row-Level Security for data protection.'
        },
        {
          question: 'Why 97%+ TypeScript coverage?',
          answer: 'Prevented 15+ potential runtime errors during development. Type safety enabled confident refactoring. Self-documenting interfaces reduced onboarding time. Better IDE support and autocomplete.'
        },
        {
          question: 'Why shadcn/ui over Material-UI?',
          answer: 'Copy-paste components with full customization. Built on Radix UI primitives for accessibility. Smaller bundle size. No vendor lock-in. Beautiful default styling with Tailwind CSS.'
        }
      ],

      challenges: [
        {
          challenge: 'Type-Safe Supabase Integration',
          problem: 'Supabase client needed proper TypeScript typing for auth and database operations',
          solution: 'Created comprehensive type definitions and wrapper functions for all Supabase operations',
          result: '100% type coverage for Supabase, preventing runtime errors'
        },
        {
          challenge: 'Responsive Product Grid',
          problem: 'Product cards needed to look great on all screen sizes from mobile to desktop',
          solution: 'Implemented responsive grid with Tailwind CSS breakpoints (1 column mobile, 3 columns desktop)',
          result: 'Seamless experience across all devices with proper touch interactions'
        },
        {
          challenge: 'Animation Performance',
          problem: 'Needed smooth animations without impacting performance on mobile devices',
          solution: 'Used Framer Motion with optimized animation properties and CSS-based animations',
          result: 'Buttery-smooth 60fps animations even on lower-end devices'
        }
      ]
    },

    impact: {
      metrics: [
        { label: 'TypeScript Coverage', value: '97%+', description: 'Prevented 15+ runtime errors' },
        { label: 'Component Reusability', value: '85%+', description: 'Modular architecture' },
        { label: 'Page Load Time', value: '<2s', description: 'Vite optimization' },
        { label: 'Mobile Responsive', value: '100%', description: 'Mobile-first design' }
      ],

      businessValue: 'Eastleigh Turf Flow demonstrates the ability to build modern, full-stack e-commerce platforms that combine professional UI/UX, secure authentication, and cloud infrastructure. The project showcases expertise in React 18, TypeScript, Supabase, and modern web development practices while solving real business problems through technology.',

      testimonials: []
    },

    process: {
      research: [
        'Analyzed 15 turf installation websites in Kenya',
        'Competitive gaps: 40% mobile responsive, 20% transparent pricing, 13% interactive elements',
        'Interviewed 5 potential customers about decision-making process',
        'Key insight: "I want to see what it would actually look like" → Interactive showcase',
        'Broker feedback: Need digital portal for wholesale orders → Authentication system'
      ],

      methodology: 'Week 1: Requirements & Design - Competitive analysis, user interviews, component architecture planning, UI/UX wireframing. Week 2: Core Development - Product showcase implementation, broker authentication system, responsive layout development, Supabase integration. Week 3: Polish & Deployment - Animation refinements, performance optimization, cross-browser testing, production deployment.',

      timeline: [
        { phase: 'Week 1', tasks: 'Requirements gathering, competitive analysis, user interviews, architecture planning' },
        { phase: 'Week 2', tasks: 'Product showcase, broker authentication, Supabase integration, responsive layouts' },
        { phase: 'Week 3', tasks: 'Animation polish, performance optimization, testing, deployment preparation' }
      ],

      lessonsLearned: [
        'TypeScript is Essential for Scaling: Caught 15+ bugs during development, enabled confident refactoring',
        'Component Libraries Accelerate Development: shadcn/ui saved 2+ weeks of UI development',
        'Mobile-First is Non-Negotiable: 68% of traffic comes from mobile devices',
        'Supabase Accelerates MVP: Saved 2+ weeks vs building custom backend',
        'Transparency Builds Trust: Showing prices upfront reduces friction and increases confidence'
      ]
    }
  },

  delivah: {
    id: 'delivah',
    name: 'Delivah Dispatch Hub',
    tagline: 'Enterprise Freight Logistics Platform | React + TypeScript + Supabase',
    status: 'Production-Ready',
    timeline: '8 weeks',
    caseStudy: true,

    quickStats: {
      duration: '8 weeks',
      status: 'Active Development',
      techStack: 'React 18, TypeScript, Supabase, Tailwind CSS',
      impact: '85% faster onboarding',
      commission: '3% (vs 15-25% industry standard)'
    },

    hero: {
      role: 'Full Stack Developer',
      client: 'Delivah Freight Logistics',
      duration: '8 weeks',
      status: 'Production-Ready'
    },

    links: {
      live: 'https://sdelivahfreightlogistics.com',
      github: 'https://github.com/leon-madara/delivah-dispatch-hub/',
      demo: null
    },

    features: [
      {
        feature: '3% Commission Model',
        impact: 'Industry-disrupting pricing vs standard 15-25%',
        icon: '💰'
      },
      {
        feature: 'Enterprise Document Management',
        impact: '50MB uploads with 98% success rate',
        icon: '📄'
      },
      {
        feature: 'Multi-Layer Security',
        impact: 'Supabase Auth with RLS policies',
        icon: '🔐'
      },
      {
        feature: 'Automated Email System',
        impact: '98% inbox delivery rate',
        icon: '📧'
      }
    ],

    overview: {
      hero: 'Enterprise-grade freight logistics management platform built for Delivah Freight Logistics, offering just 3% commission rates. This full-stack TypeScript application (97.2% coverage) streamlines freight operations for carriers, dispatchers, and shippers across multiple freight categories.',

      problem: 'The freight logistics industry operates in a highly competitive, margin-sensitive environment where brokers and carriers face numerous operational challenges: High commission rates (15-25%) erode carrier profits, manual paperwork delays load confirmations, poor rate negotiation leaves money on the table, fragmented communication between stakeholders, lack of transparency in load tracking, and complex compliance requirements with no centralized platform.',

      solution: 'Delivah Dispatch Hub delivers an industry-leading 3% commission rate, best rate negotiations securing top-paying loads, automated broker/shipper credit checks, complete paperwork automation, digital sign & secure confirmations, centralized registration system, and secure document storage with compliance-ready file management.',

      keyFeatures: [
        {
          icon: '💰',
          title: '3% Commission Model',
          description: 'Industry-disrupting 3% commission vs standard 15-25%, maximizing carrier profitability with high volume strategy'
        },
        {
          icon: '📄',
          title: 'Enterprise Document Management',
          description: '50MB file uploads with retry mechanism, 98% upload success rate, multi-format support (PDF, DOC, DOCX, JPG, PNG), automatic expiration tracking'
        },
        {
          icon: '🔐',
          title: 'Multi-Layer Security',
          description: 'Supabase Auth with session management, Row-Level Security policies, file validation and virus scanning, encrypted document storage'
        },
        {
          icon: '📧',
          title: 'Automated Email System',
          description: 'Carrier registration notifications, document upload confirmations, application status updates, load assignment alerts - 98% inbox delivery'
        },
        {
          icon: '⚡',
          title: 'Real-Time Operations',
          description: 'Digital carrier registration (30 min vs 3-5 days), instant credit checks, automated compliance tracking, live status updates'
        }
      ]
    },

    technical: {
      stack: [
        { name: 'React', version: '18+', purpose: 'Modern component-based architecture' },
        { name: 'TypeScript', version: '97.2% coverage', purpose: 'Enterprise-grade type safety' },
        { name: 'Vite', version: 'Latest', purpose: 'Lightning-fast development server' },
        { name: 'Supabase', version: 'Latest', purpose: 'Backend (PostgreSQL, Auth, Storage)' },
        { name: 'Tailwind CSS', version: '3.x', purpose: 'Utility-first styling system' },
        { name: 'shadcn/ui', version: 'Latest', purpose: 'Accessible component library' },
        { name: 'TanStack Query', version: 'Latest', purpose: 'Server state management' }
      ],

      architecture: 'Multi-page application with public pages (Home, About, Services, Contact), carrier portal (Registration, Document Upload, Profile Management), admin dashboard (Authentication, Carrier Management, Document Verification, Load Dispatch), and core infrastructure (Supabase integration, Storage System, Email Service, Security Layer).',

      keyDecisions: [
        {
          question: 'Why Supabase over custom backend?',
          answer: 'PostgreSQL for relational freight data, built-in authentication system, real-time subscriptions for live updates, storage for carrier documents, row-level security for data protection, and cost-effective at scale. Accelerated MVP by 3 months.'
        },
        {
          question: 'Why 97.2% TypeScript coverage?',
          answer: 'Prevented 20+ potential runtime errors during development. Type safety enabled confident refactoring of auth system. Self-documenting interfaces reduced onboarding time. Types caught bugs related to missing MC numbers and incorrect document types.'
        },
        {
          question: 'File Upload Reliability Strategy',
          answer: 'Three-tier retry system with automatic retry on network errors (up to 3 attempts), exponential backoff delay (1s, 2s, 4s), timeout protection (30 seconds max), and user-friendly error messages. Result: 98% upload success rate even on 3G connections.'
        }
      ],

      challenges: [
        {
          challenge: 'Reliable File Uploads for Large Documents',
          problem: 'Carriers upload 10-50MB insurance certificates that frequently failed on slow connections',
          solution: 'Sophisticated retry mechanism with exponential backoff, timeout protection, and network error detection',
          result: '95% upload success rate even on 3G connections'
        },
        {
          challenge: 'Admin Authentication Security',
          problem: 'Need secure admin access without complex authentication flow',
          solution: 'Supabase Auth with persistent session management, real-time auth state monitoring, automatic redirect on session expiration',
          result: 'Secure, seamless admin experience with zero unauthorized access attempts'
        },
        {
          challenge: 'Email Deliverability',
          problem: 'Registration confirmations ending up in spam folders',
          solution: 'SPF/DKIM/DMARC configuration, SendGrid integration with established sender reputation, proper email formatting',
          result: '98% inbox delivery rate, 42% open rate (from 18%)'
        }
      ]
    },

    impact: {
      metrics: [
        { label: 'Onboarding Time', value: '85% faster', description: 'From 3-5 days to same-day approval' },
        { label: 'Commission Rate', value: '3% vs 15-25%', description: '12-22% lower than industry standard' },
        { label: 'Upload Success', value: '98%', description: 'Even on 3G connections' },
        { label: 'Email Delivery', value: '98%', description: 'Inbox placement rate' },
        { label: 'Document Storage', value: '$5K saved/year', description: 'Eliminated physical file cabinets' }
      ],

      businessValue: 'Delivah Dispatch Hub demonstrates the ability to build mission-critical business platforms that combine modern technology, robust security, and operational excellence to deliver measurable business value in competitive industries. The 3% commission model is only sustainable through technological efficiency.',

      testimonials: []
    },

    process: {
      research: [
        'Spoke with 8 independent carriers about pain points',
        'Top issues: Insurance certificates (90%), W9 forms (75%), MC Authority verification (60%), Credit checks (55%)',
        'Analyzed competitor pricing: average 18-22% commission',
        'Question explored: "Why 3% commission when competitors charge 15-25%?" - Answer: High volume at low margin vs low volume at high margin'
      ],

      methodology: 'Phase 1: Business Requirements Gathering (Week 1) - Analyzed freight brokerage workflows. Phase 2: Technical Architecture Design (Week 2) - Designed multi-page application structure. Phase 3: Core Feature Development (Weeks 3-6) - Implemented registration, uploads, admin dashboard. Phase 4: Security Hardening (Week 7). Phase 5: Email Integration (Week 8). Phase 6: Testing & Refinement (Weeks 9-10).',

      timeline: [
        { phase: 'Weeks 1-2', tasks: 'Requirements gathering, technical architecture, database schema design' },
        { phase: 'Weeks 3-6', tasks: 'Core feature development: registration, document upload, admin dashboard' },
        { phase: 'Week 7', tasks: 'Security hardening: RLS policies, file validation, CORS configuration' },
        { phase: 'Week 8', tasks: 'Email integration: templates, triggers, deliverability optimization' },
        { phase: 'Weeks 9-10', tasks: 'UAT with carriers, admin workflow validation, security testing' }
      ],

      lessonsLearned: [
        'TypeScript Catches Problems Before Users See Them: 97.2% coverage prevented 20+ runtime errors',
        'File Upload Reliability is Mission-Critical: Retry mechanism increased success from 60% to 98%',
        'Authentication Must Be Invisible When Right: Session persistence prevents frustrating re-logins',
        'Disruptive Pricing Requires Operational Excellence: 3% commission only works with efficiency',
        'Email Deliverability Affects Business Outcomes: Proper authentication increased opens by 124%'
      ]
    }
  },

  edumanage: {
    id: 'edumanage',
    name: 'EduManage SMS',
    tagline: 'AI-Powered Automated Timetable Generator | React + FastAPI + PostgreSQL',
    status: 'Production-Ready',
    timeline: '3 months',
    caseStudy: true,

    quickStats: {
      duration: '3 months',
      status: 'Production-Ready',
      techStack: 'React, TypeScript, FastAPI, PostgreSQL, Docker',
      impact: '99.9% time reduction (2-3 weeks → 45 seconds)',
      compliance: '100% TSC compliance'
    },

    hero: {
      role: 'Full Stack Developer',
      client: 'Kenyan Secondary Schools (CBC)',
      duration: '3 months',
      status: 'Production-Ready'
    },

    links: {
      live: null,
      github: 'https://github.com/leon-madara/school-management-system/',
      demo: null
    },

    features: [
      {
        feature: 'Intelligent Elective Clustering',
        impact: 'Dynamic group formation with parallel scheduling',
        icon: '🤖'
      },
      {
        feature: 'TSC Compliance Engine',
        impact: '100% regulatory compliance automatically',
        icon: '✅'
      },
      {
        feature: 'Sub-60-Second Generation',
        impact: '45.2 seconds average for 270 students',
        icon: '⚡'
      },
      {
        feature: 'Comprehensive Validation',
        impact: 'Hard and soft constraint satisfaction',
        icon: '📊'
      }
    ],

    overview: {
      hero: 'Production-ready, AI-powered automated timetable generation system specifically designed for Kenyan secondary schools implementing the Competency-Based Curriculum (CBC). This enterprise-grade full-stack solution transforms the traditional manual scheduling process from 2-3 weeks into an intelligent automated generation system completing in just 45 seconds.',

      problem: 'Kenyan secondary schools implementing CBC face an unprecedented scheduling crisis: Manual process inefficiency (6-9 weeks annually), elective clustering problem (810 unique combinations across 270 students), TSC regulatory compliance (25 periods/week, 6/day maximum with zero tolerance), resource optimization crisis (expensive specialized facilities underutilized), scalability limitations beyond 300 students, and high 15-20% conflict rate requiring manual resolution.',

      solution: 'EduManage SMS solves the complex elective clustering through dynamic group formation and parallel scheduling, ensures 100% TSC compliance through real-time validation, optimizes resource utilization by intelligently allocating specialized rooms, scales seamlessly from 270 to 500+ students, eliminates human error through comprehensive validation, and generates complete conflict-free timetables in under 60 seconds.',

      keyFeatures: [
        {
          icon: '🤖',
          title: 'Intelligent Elective Clustering Algorithm',
          description: 'Advanced constraint satisfaction engine that dynamically groups students with similar elective choices, handles parallel scheduling, manages capacity splitting, resolves conflicts, and optimizes in real-time'
        },
        {
          icon: '✅',
          title: 'TSC Compliance Engine',
          description: 'Real-time validation prevents workload violations, balances distribution evenly (average 22.5 periods/week), enforces regulatory compliance automatically, and maintains complete audit trail'
        },
        {
          icon: '⚡',
          title: 'Sub-60-Second Generation',
          description: 'Solves NP-hard problem in 45.2 seconds average with 85% elective satisfaction rate, 100% TSC compliance across all 24 teachers, and scalable architecture supporting 500+ students'
        },
        {
          icon: '📊',
          title: 'Comprehensive Validation Suite',
          description: 'Hard constraints (must satisfy): no double-booking, capacity limits, TSC compliance. Soft constraints (optimize): morning priority (92.9%), room utilization, workload balance'
        },
        {
          icon: '📤',
          title: 'Multi-Format Export System',
          description: 'Professional PDF generation for printing, Excel export for manual adjustments, CSV output for data analysis, JSON API for third-party integrations'
        }
      ]
    },

    technical: {
      stack: [
        { name: 'React', version: '18+', purpose: 'Modern frontend with TypeScript' },
        { name: 'TypeScript', version: 'Full coverage', purpose: 'Type safety for complex logic' },
        { name: 'FastAPI', version: 'Python 3.11', purpose: 'High-performance async API' },
        { name: 'PostgreSQL', version: '15 with JSONB', purpose: 'Flexible data storage' },
        { name: 'Docker', version: 'Multi-container', purpose: 'Scalable deployment' },
        { name: 'NumPy/Pandas', version: 'Latest', purpose: 'Algorithm optimization' }
      ],

      architecture: 'System architecture: React Frontend (TypeScript) ↔ FastAPI Backend (Python) ↔ PostgreSQL DB (JSONB) → Algorithm Engine (Constraint CSP). Project structure includes frontend dashboard components, backend API endpoints, algorithm engine with constraint satisfaction solver, and Docker infrastructure.',

      keyDecisions: [
        {
          question: 'Why FastAPI + Python?',
          answer: 'Automatic API documentation with OpenAPI/Swagger. Async support for handling long-running algorithm operations. Rich ecosystem for data processing and algorithm development. Easy integration with existing Python algorithm code.'
        },
        {
          question: 'Why PostgreSQL with JSONB?',
          answer: 'ACID compliance for critical scheduling data. JSONB provides flexibility for complex timetable structures. Excellent performance for both relational and document queries. Strong consistency guarantees for multi-user environments.'
        },
        {
          question: 'How to achieve sub-60-second generation?',
          answer: 'Constraint pruning to reduce search space. Parallel processing for independent operations. Intelligent backtracking to avoid dead ends. NumPy/Pandas optimization for mathematical operations. Result: 45.2 seconds average generation time.'
        }
      ],

      challenges: [
        {
          challenge: 'Elective Clustering Complexity',
          problem: 'Students choosing Visual Arts + German + Computer Science created impossible scheduling conflicts',
          solution: 'Dynamic group formation with parallel scheduling across multiple time slots',
          result: '85% elective satisfaction rate with zero student double-booking'
        },
        {
          challenge: 'TSC Compliance Enforcement',
          problem: 'Teachers exceeding 25 periods/week or 6 periods/day limits',
          solution: 'Real-time workload tracking with automatic constraint validation during generation',
          result: '100% TSC compliance across all 24 teachers with balanced workloads'
        },
        {
          challenge: 'Algorithm Performance Optimization',
          problem: 'Initial algorithm took 3+ minutes for 270 students, exceeding target',
          solution: 'Implemented constraint pruning, parallel processing, and intelligent backtracking',
          result: '45.2 second generation time (25% under 60-second target)'
        }
      ]
    },

    impact: {
      metrics: [
        { label: 'Time Savings', value: '99.9%', description: 'From 2-3 weeks to 45 seconds' },
        { label: 'TSC Compliance', value: '100%', description: 'Across all 24 teachers' },
        { label: 'Conflict Reduction', value: '15-20% → <1%', description: 'Near-zero scheduling conflicts' },
        { label: 'Cost Savings', value: '$2K-5K/year', description: 'Eliminated administrative costs' },
        { label: 'Elective Satisfaction', value: '85%', description: 'Target: 95% in next iteration' }
      ],

      businessValue: "This isn't just a scheduling system—it's a comprehensive solution that transforms how Kenyan schools manage their most critical operational process. By combining advanced algorithms with deep domain knowledge, EduManage SMS demonstrates how thoughtful software engineering can solve real-world problems while delivering measurable business value. The technical challenges—solving NP-hard problems, ensuring regulatory compliance, and optimizing for performance—combined with the business impact of saving schools 6-9 weeks annually, make this a compelling demonstration of full-stack development capabilities.",

      testimonials: []
    },

    process: {
      research: [
        'Analyzed Kenyan education system documentation (KICD, TSC regulations)',
        'Studied constraint satisfaction algorithms and timetabling research',
        'Interviewed 3 school administrators about current processes',
        'Question explored: "How does CBC differ from traditional 8-4-4?" - Answer: CBC introduces complex elective clustering with 3-block structure'
      ],

      methodology: 'Algorithm-First Development: Built core constraint satisfaction engine before UI. Data-Driven Design: Used real school data (270 students, 24 teachers) for testing. Iterative Validation: Continuous testing with comprehensive validation suite. Performance Optimization: Targeted <60 second generation time from day one. User-Centric Interface: Designed for non-technical school administrators.',

      timeline: [
        { phase: 'Weeks 1-2', tasks: 'Domain research, algorithm analysis, technical prototyping' },
        { phase: 'Weeks 3-4', tasks: 'Data analysis (270 students, 810 combinations), optimization opportunities' },
        { phase: 'Weeks 4-5', tasks: 'User interface design, CSV upload workflows, timetable visualization' },
        { phase: 'Weeks 6-12', tasks: 'Algorithm implementation, testing, optimization, deployment preparation' }
      ],

      lessonsLearned: [
        'Domain Knowledge is Critical: Understanding Kenyan education system was essential for algorithm design',
        "Algorithm Complexity vs. Real-World Constraints: Theoretical optimal solutions don't always work in practice",
        'Performance Engineering Matters: Every millisecond counts when targeting <60 second generation time',
        'User Experience for Complex Operations: 45-second processes need clear progress indicators',
        'Regulatory Compliance Drives Architecture: TSC regulations directly shaped algorithm constraints',
        'Data Quality Drives Success: Comprehensive validation saved countless debugging hours'
      ]
    }
  }
};

/**
 * Default export for convenience
 */
export default projectsData;
