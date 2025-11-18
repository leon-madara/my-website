// Portfolio Projects Data - Structured from comprehensive documentation

const projectsData = {
    eastleigh: {
        id: 'eastleigh',
        name: 'Eastleigh Turf Flow',
        tagline: 'Interactive Landing Page | TypeScript',
        status: 'Live & Maintained',
        timeline: '3 weeks',

        quickStats: {
            duration: '2 weeks',
            status: 'Live',
            techStack: 'TypeScript, GitHub Pages, Modular CSS',
            impact: 'Increased engagement time',
            completionRate: 'Unique selling point vs competitors'
        },

        hero: {
            role: 'UX/UI Designer & Frontend Developer',
            client: 'Local Turf Installation Business',
            duration: '2 weeks',
            status: 'Live'
        },

        challenge: {
            title: 'Challenge',
            problems: [
                'Homeowners hesitate to invest in turf services',
                'Lack of visual proof of transformation',
                'Uncertainty about ROI',
                'Difficulty trusting service quality'
            ]
        },

        solution: {
            title: 'Solution',
            description: 'Interactive landing page with before/after slider',
            benefits: [
                'Visually demonstrates real transformations',
                'Engages users through touch-friendly interaction',
                'Builds trust and drives conversions'
            ]
        },

        features: [
            {
                feature: 'Interactive Slider',
                impact: '60fps animations, mobile-first UX',
                icon: '🎯'
            },
            {
                feature: 'Conversion-Optimized Layout',
                impact: 'Strategic CTAs, social proof',
                icon: '📈'
            },
            {
                feature: 'Responsive Design',
                impact: 'Seamless experience across devices',
                icon: '📱'
            },
            {
                feature: 'Fast Load Times',
                impact: 'Image optimization, lazy loading',
                icon: '⚡'
            }
        ],

        research: {
            userInsights: [
                'User Interviews: "I want to see what it would actually look like" → Slider became hero element',
                'Competitive Analysis: Most competitors use static galleries → I differentiated with interactivity',
                'Mobile Behavior: 68% of searches on mobile → Prioritized touch UX'
            ]
        },

        technicalArchitecture: {
            stack: ['TypeScript', 'GitHub Pages', 'Modular CSS'],
            architecture: [
                'TypeScript: Type safety, maintainability',
                'GitHub Pages: Free hosting, CI/CD',
                'Modular Components: Easy updates and scalability'
            ]
        },

        results: {
            metrics: [
                'Increased engagement time',
                'Higher trust and lead quality',
                'Unique selling point vs. competitors'
            ]
        },

        designPrinciples: [
            'Immediate Value: Users see transformation instantly',
            'Low Friction: One intuitive interaction',
            'Professional Aesthetic: Nature-inspired palette, clean layout'
        ],

        futureEnhancements: [
            'Multi-gallery showcase',
            'Testimonials section',
            'Interactive pricing comparison',
            'Analytics integration'
        ],

        learnings: [
            'Interactive storytelling > static content',
            'TypeScript caught 12+ bugs pre-deployment',
            'User research directly shaped design decisions'
        ],

        links: {
            live: 'https://leon-madara.github.io/eastleigh-turf-flow/',
            github: 'https://github.com/leon-madara/eastleigh-turf-flow/',
            demo: null
        },

        overview: {
            hero: 'Modern, conversion-focused landing page for a professional turf installation and lawn care service. Built with TypeScript and deployed on GitHub Pages, this project demonstrates the power of interactive web design in driving customer engagement and sales conversions.',

            problem: 'Local service businesses, particularly in the lawn care and turf installation industry, face a critical problem: potential customers struggle to visualize the transformation their property could undergo. Static before/after images don\'t effectively demonstrate the dramatic improvements that professional turf installation can provide, leading to lower conversion rates, customer hesitation, difficulty justifying premium pricing, and reduced trust in service quality.',

            solution: 'Eastleigh Turf Flow addresses these challenges through an interactive before/after slider that allows visitors to actively engage with transformation imagery. This hands-on approach builds immediate trust, increases engagement time, reduces decision friction, and improves conversion rates through interactive storytelling.',

            keyFeatures: [
                {
                    icon: '⭐',
                    title: 'Interactive Before/After Slider',
                    description: 'Signature feature that empowers visitors to drag horizontally to reveal transformation, see instant visual proof, and engage actively rather than passively scroll'
                },
                {
                    icon: '🎯',
                    title: 'Conversion-Optimized Design',
                    description: 'Clear call-to-action buttons strategically placed, trust-building social proof elements, mobile-first responsive layout, and fast loading times for better SEO'
                },
                {
                    icon: '⚡',
                    title: 'Modern Tech Stack',
                    description: 'TypeScript for type-safe code maintainability, GitHub Pages for zero-cost hosting with continuous deployment, and modular architecture that\'s easy to update and scale'
                },
                {
                    icon: '📱',
                    title: 'Mobile-First Approach',
                    description: '68% of landscape service searches happen on mobile - prioritized touch interactions and mobile-first design with smooth 60fps animations'
                },
                {
                    icon: '🔍',
                    title: 'User Research-Driven',
                    description: 'Built after analyzing 15 competitor websites and interviewing 5 potential customers about their decision-making process'
                }
            ]
        },

        technical: {
            stack: [
                { name: 'TypeScript', version: 'Latest', purpose: 'Type-safe code for maintainability' },
                { name: 'HTML5/CSS3', version: 'Modern', purpose: 'Semantic markup and responsive styling' },
                { name: 'Vanilla JavaScript', version: 'ES6+', purpose: 'Interactive slider functionality' },
                { name: 'GitHub Pages', version: 'CI/CD', purpose: 'Automated deployment and hosting' }
            ],

            architecture: 'Component-based development with modular architecture. The interactive slider uses CSS transforms for buttery-smooth 60fps animations, avoiding position changes for better performance. Touch event handlers provide seamless mobile experience with proper gesture detection.',

            keyDecisions: [
                {
                    question: 'Why TypeScript?',
                    answer: 'Catch errors during development, not in production. Better IDE support and code documentation. Easier refactoring and maintenance. Professional codebase standards.'
                },
                {
                    question: 'Why GitHub Pages?',
                    answer: 'Free hosting for portfolio projects. Automatic deployment on push to main. Custom domain support for future enhancement. Version history and rollback capabilities.'
                },
                {
                    question: 'Performance Strategy',
                    answer: 'Implemented progressive image loading and proper compression resulting in 40% faster initial load time. Used CSS transforms instead of position changes for smooth animations.'
                }
            ],

            challenges: [
                {
                    challenge: 'Smooth Slider Performance',
                    problem: 'Initial implementation had janky animations on mobile',
                    solution: 'Implemented CSS transforms instead of position changes, added debouncing',
                    result: 'Buttery-smooth 60fps animations'
                },
                {
                    challenge: 'Image Loading Performance',
                    problem: 'Large before/after images slowed initial page load',
                    solution: 'Implemented progressive image loading and proper compression',
                    result: '40% faster initial load time'
                },
                {
                    challenge: 'Touch vs. Mouse Interactions',
                    problem: 'Slider worked on desktop but felt unnatural on touch devices',
                    solution: 'Implemented separate touch event handlers with proper gesture detection',
                    result: 'Seamless experience across all input methods'
                }
            ]
        },

        impact: {
            metrics: [
                { label: 'Engagement Increase', value: 'Projected 40%+', description: 'Interactive elements keep users on page longer' },
                { label: 'Trust Building', value: 'High', description: 'Transparent before/after comparisons build credibility' },
                { label: 'Qualified Leads', value: 'Improved', description: 'Users who interact with slider are more likely to convert' },
                { label: 'Load Time', value: '40% faster', description: 'Optimized images and progressive loading' }
            ],

            businessValue: 'This isn\'t just a landing page—it\'s a conversion tool that solves a real business problem. By understanding the psychology of service purchases and implementing an intuitive interactive solution, Eastleigh Turf Flow demonstrates how thoughtful web development can directly impact business outcomes.',

            testimonials: []
        },

        process: {
            research: [
                'Analyzed 15 competitor websites and identified gaps',
                'Interviewed 5 potential customers about decision-making process',
                'Key insight: "I want to see what it would actually look like" came up repeatedly',
                'Studied conversion rate optimization for service businesses'
            ],

            methodology: 'Planning First: Wireframes and user flow mapping. Component-Based Development: Built reusable, modular components. Mobile-First: Started with mobile design, scaled up. Iterative Testing: Continuous testing across devices and browsers.',

            timeline: [
                { phase: 'Week 1', tasks: 'Market research, competitor analysis, user interviews' },
                { phase: 'Week 2', tasks: 'Technical prototyping, design iteration, wireframing' },
                { phase: 'Week 3', tasks: 'Development, testing, optimization, deployment' }
            ],

            lessonsLearned: [
                'User Engagement > Static Content: Interactive elements dramatically increase engagement',
                'Performance Matters: Every millisecond counts on mobile devices',
                'Research Drives Design: User interviews revealed the critical importance of visual proof',
                'TypeScript Benefits: Type safety caught 12+ bugs before deployment'
            ]
        }
    },

    delivah: {
        id: 'delivah',
        name: 'Delivah Dispatch Hub',
        tagline: 'Enterprise Freight Logistics Platform | React + TypeScript + Supabase',
        status: 'Production-Ready',
        timeline: '8 weeks',

        quickStats: {
            duration: '8 weeks',
            status: 'Active Development',
            techStack: 'React 18, TypeScript, Supabase, Tailwind CSS',
            impact: '85% faster onboarding',
            commission: '3% (vs 15-25% industry standard)'
        },

        links: {
            live: 'https://sdelivahfreightlogistics.com',
            github: 'https://github.com/leon-madara/delivah-dispatch-hub/',
            demo: null
        },

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

        quickStats: {
            duration: '3 months',
            status: 'Production-Ready',
            techStack: 'React, TypeScript, FastAPI, PostgreSQL, Docker',
            impact: '99.9% time reduction (2-3 weeks → 45 seconds)',
            compliance: '100% TSC compliance'
        },

        links: {
            live: null,
            github: 'https://github.com/leon-madara/school-management-system/',
            demo: null
        },

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

            businessValue: 'This isn\'t just a scheduling system—it\'s a comprehensive solution that transforms how Kenyan schools manage their most critical operational process. By combining advanced algorithms with deep domain knowledge, EduManage SMS demonstrates how thoughtful software engineering can solve real-world problems while delivering measurable business value. The technical challenges—solving NP-hard problems, ensuring regulatory compliance, and optimizing for performance—combined with the business impact of saving schools 6-9 weeks annually, make this a compelling demonstration of full-stack development capabilities.',

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
                'Algorithm Complexity vs. Real-World Constraints: Theoretical optimal solutions don\'t always work in practice',
                'Performance Engineering Matters: Every millisecond counts when targeting <60 second generation time',
                'User Experience for Complex Operations: 45-second processes need clear progress indicators',
                'Regulatory Compliance Drives Architecture: TSC regulations directly shaped algorithm constraints',
                'Data Quality Drives Success: Comprehensive validation saved countless debugging hours'
            ]
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = projectsData;
}
