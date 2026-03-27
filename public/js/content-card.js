/**
 * Content Card JavaScript Module
 * Implements content rendering and pagination for the portfolio case study redesign
 * 
 * Requirements: 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 4.4, 8.3, 8.4, 8.5, 8.6
 */

// ====================================
// PROJECT DATA STRUCTURE
// Requirements: 3.2, 3.3, 3.4, 3.5, 3.6
// ====================================

const PROJECTS = {
    1: {
        id: 'eastleigh',
        title: 'Eastleigh Turf Flow',
        tagline: 'Full-stack e-commerce platform for a professional turf installation business.',
        status: 'Production-Ready',
        timeline: '3 weeks',
        role: 'Full Stack Developer',
        techStack: [
            'React 18 with TypeScript',
            'Supabase backend with RLS',
            'Tailwind CSS UI',
            'CI/CD via Vercel'
        ],
        // Page content organized by section and page
        content: {
            // Section: Project Details
            'details': {
                'overview': {
                    title: 'Overview',
                    html: `
                        <p>Modern, full-stack e-commerce platform designed for a professional turf installation business in Kenya. Built with React 18, TypeScript, and Supabase, this production-ready application transforms the traditional turf sales process through interactive product showcases, broker authentication systems, and seamless order management.</p>
                        <h3>Key Highlights</h3>
                        <ul>
                            <li><strong>Interactive Product Showcase</strong> - Featured products with pricing, specs, and testimonials</li>
                            <li><strong>Broker Authentication Portal</strong> - Secure login with phone OTP and role-based access</li>
                            <li><strong>Responsive Design</strong> - Mobile-first with 60fps animations</li>
                            <li><strong>Cloud Backend</strong> - Supabase for auth, database, and storage</li>
                        </ul>
                    `
                },
                'role-timeline': {
                    title: 'Role & Timeline',
                    html: `
                        <h3>My Role</h3>
                        <p>As the <strong>Full Stack Developer</strong>, I was responsible for the entire application lifecycle from requirements gathering to deployment.</p>
                        <h3>Timeline Breakdown</h3>
                        <ul>
                            <li><strong>Week 1:</strong> Requirements & Design - Competitive analysis, user interviews, component architecture planning, UI/UX wireframing</li>
                            <li><strong>Week 2:</strong> Core Development - Product showcase implementation, broker authentication system, responsive layout development, Supabase integration</li>
                            <li><strong>Week 3:</strong> Polish & Deployment - Animation refinements, performance optimization, cross-browser testing, production deployment</li>
                        </ul>
                    `
                },
                'tech-stack': {
                    title: 'Tech Stack',
                    html: `
                        <h3>Frontend</h3>
                        <ul>
                            <li><strong>React 18</strong> - Component-based architecture with hooks</li>
                            <li><strong>TypeScript</strong> - 97%+ coverage for type safety</li>
                            <li><strong>Vite</strong> - Lightning-fast dev server and optimized builds</li>
                            <li><strong>Tailwind CSS + shadcn/ui</strong> - Modern, accessible component library</li>
                            <li><strong>Framer Motion</strong> - Smooth 60fps animations</li>
                        </ul>
                        <h3>Backend</h3>
                        <ul>
                            <li><strong>Supabase</strong> - PostgreSQL database, authentication, and storage</li>
                            <li><strong>Row-Level Security</strong> - Data protection at the database level</li>
                        </ul>
                    `
                }
            },
            // Section: Problem
            'problem': {
                'challenge': {
                    title: 'The Challenge',
                    html: `
                        <p>Local turf installation businesses face critical challenges in the digital marketplace:</p>
                        <ul>
                            <li><strong>Visual Trust Gap</strong> - Customers struggle to visualize transformation results</li>
                            <li><strong>Static Presentations</strong> - Traditional websites fail to engage modern consumers</li>
                            <li><strong>Complex Ordering</strong> - Manual processes create friction and errors</li>
                            <li><strong>Poor Mobile Experience</strong> - Despite 68% mobile traffic, most sites aren't optimized</li>
                            <li><strong>No Broker System</strong> - No digital system for managing wholesale broker relationships</li>
                        </ul>
                    `
                },
                'pain-points': {
                    title: 'Pain Points',
                    html: `
                        <h3>Customer Pain Points</h3>
                        <ul>
                            <li>Difficulty comparing turf options and pricing</li>
                            <li>No way to visualize end results before purchase</li>
                            <li>Complicated ordering process requiring phone calls</li>
                        </ul>
                        <h3>Business Pain Points</h3>
                        <ul>
                            <li>Manual order processing leading to errors</li>
                            <li>No centralized broker management system</li>
                            <li>Lost sales due to poor mobile experience</li>
                        </ul>
                    `
                }
            },
            // Section: Goal
            'goal': {
                'objectives': {
                    title: 'Objectives',
                    html: `
                        <h3>Primary Objectives</h3>
                        <ul>
                            <li>Create an engaging, interactive product showcase</li>
                            <li>Implement secure broker authentication system</li>
                            <li>Build mobile-first responsive design</li>
                            <li>Establish cloud-based order management</li>
                        </ul>
                        <h3>Technical Goals</h3>
                        <ul>
                            <li>Achieve 97%+ TypeScript coverage</li>
                            <li>Maintain 60fps animation performance</li>
                            <li>Ensure sub-2-second page load times</li>
                        </ul>
                    `
                },
                'success-criteria': {
                    title: 'Success Criteria',
                    html: `
                        <h3>Measurable Success Metrics</h3>
                        <ul>
                            <li><strong>TypeScript Coverage:</strong> 97%+ (achieved)</li>
                            <li><strong>Component Reusability:</strong> 85%+ modular architecture</li>
                            <li><strong>Page Load Time:</strong> Under 2 seconds</li>
                            <li><strong>Mobile Responsive:</strong> 100% coverage</li>
                        </ul>
                    `
                }
            },
            // Section: Impact
            'impact': {
                'metrics': {
                    title: 'Metrics & Results',
                    html: `
                        <h3>Key Performance Indicators</h3>
                        <div class="metrics-grid">
                            <div class="metric-item">
                                <span class="metric-value">97%+</span>
                                <span class="metric-label">TypeScript Coverage</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-value">85%+</span>
                                <span class="metric-label">Component Reusability</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-value">&lt;2s</span>
                                <span class="metric-label">Page Load Time</span>
                            </div>
                            <div class="metric-item">
                                <span class="metric-value">100%</span>
                                <span class="metric-label">Mobile Responsive</span>
                            </div>
                        </div>
                    `
                },
                'user-feedback': {
                    title: 'User Feedback',
                    html: `
                        <h3>Research Insights</h3>
                        <blockquote>"I want to see what it would actually look like" - Customer Interview</blockquote>
                        <p>This insight directly led to the interactive product showcase feature.</p>
                        <h3>Broker Feedback</h3>
                        <p>Brokers expressed need for a digital portal for wholesale orders, which drove the authentication system design.</p>
                    `
                }
            },
            // Section: Early Adoption
            'adoption': {
                'beta-testing': {
                    title: 'Beta Testing',
                    html: `
                        <h3>Testing Approach</h3>
                        <p>Conducted user testing with 5 potential customers to validate the product showcase and ordering flow.</p>
                        <h3>Key Findings</h3>
                        <ul>
                            <li>Users appreciated transparent pricing display</li>
                            <li>Mobile experience exceeded expectations</li>
                            <li>Broker portal streamlined wholesale ordering</li>
                        </ul>
                    `
                },
                'iterations': {
                    title: 'Iterations',
                    html: `
                        <h3>Design Iterations</h3>
                        <ul>
                            <li><strong>V1:</strong> Basic product grid with static images</li>
                            <li><strong>V2:</strong> Added interactive hover states and animations</li>
                            <li><strong>V3:</strong> Implemented testimonials and social proof</li>
                        </ul>
                    `
                }
            },
            // Section: Testing
            'testing': {
                'qa-process': {
                    title: 'QA Process',
                    html: `
                        <h3>Quality Assurance Strategy</h3>
                        <ul>
                            <li><strong>TypeScript:</strong> Caught 15+ bugs during development</li>
                            <li><strong>Cross-browser Testing:</strong> Chrome, Firefox, Safari, Edge</li>
                            <li><strong>Mobile Testing:</strong> iOS Safari, Android Chrome</li>
                            <li><strong>Performance Testing:</strong> Lighthouse audits</li>
                        </ul>
                    `
                },
                'usability': {
                    title: 'Usability Testing',
                    html: `
                        <h3>User Testing Sessions</h3>
                        <p>Conducted 5 user testing sessions with target customers.</p>
                        <h3>Key Improvements</h3>
                        <ul>
                            <li>Simplified checkout flow based on user feedback</li>
                            <li>Added clearer call-to-action buttons</li>
                            <li>Improved mobile navigation</li>
                        </ul>
                    `
                }
            },
            // Section: Final Designs
            'designs': {
                'ui-showcase': {
                    title: 'UI Showcase',
                    html: `
                        <h3>Design Highlights</h3>
                        <p>The final design features a clean, modern aesthetic with emphasis on product imagery and clear pricing.</p>
                        <ul>
                            <li>Hero section with featured products</li>
                            <li>Interactive product cards with hover effects</li>
                            <li>Testimonial carousel for social proof</li>
                            <li>Responsive navigation with mobile menu</li>
                        </ul>
                    `
                },
                'design-system': {
                    title: 'Design System',
                    html: `
                        <h3>Component Library</h3>
                        <p>Built on shadcn/ui with custom Tailwind CSS configuration.</p>
                        <h3>Key Components</h3>
                        <ul>
                            <li>Product cards with consistent styling</li>
                            <li>Form inputs with validation states</li>
                            <li>Button variants (primary, secondary, ghost)</li>
                            <li>Modal dialogs for authentication</li>
                        </ul>
                    `
                }
            },
            // Section: Development
            'development': {
                'architecture': {
                    title: 'Architecture',
                    html: `
                        <h3>System Architecture</h3>
                        <p>Full-stack application with React 18 frontend, Supabase backend, and cloud storage.</p>
                        <h3>Key Architectural Decisions</h3>
                        <ul>
                            <li><strong>React 18 over Next.js:</strong> No SSR needed, simpler deployment</li>
                            <li><strong>Supabase over custom backend:</strong> Built-in auth saved 2+ weeks</li>
                            <li><strong>shadcn/ui over Material-UI:</strong> Smaller bundle, full customization</li>
                        </ul>
                    `
                },
                'implementation': {
                    title: 'Implementation',
                    html: `
                        <h3>Development Highlights</h3>
                        <ul>
                            <li>Component-based architecture with 85%+ reusability</li>
                            <li>Type-safe Supabase integration</li>
                            <li>Responsive grid with Tailwind CSS breakpoints</li>
                            <li>Framer Motion for smooth animations</li>
                        </ul>
                    `
                }
            },
            // Section: Future Steps
            'future': {
                'roadmap': {
                    title: 'Roadmap',
                    html: `
                        <h3>Planned Features</h3>
                        <ul>
                            <li>Shopping cart and checkout system</li>
                            <li>Real-time inventory management</li>
                            <li>Customer review submission</li>
                            <li>Analytics dashboard for admin</li>
                        </ul>
                    `
                },
                'enhancements': {
                    title: 'Planned Enhancements',
                    html: `
                        <h3>Technical Improvements</h3>
                        <ul>
                            <li>AI-powered product recommendations</li>
                            <li>Advanced search and filtering</li>
                            <li>Push notifications for order updates</li>
                            <li>Integration with payment gateways</li>
                        </ul>
                    `
                }
            }
        }
    },
    2: {
        id: 'legit-logistics',
        title: 'Legit Logistics',
        tagline: 'Owner-operated delivery operations platform with quote, tracking, and dispatch workflows.',
        status: 'Production-Ready',
        timeline: 'Phased rollout',
        role: 'Full Stack Developer',
        techStack: [
            'React 18 with TypeScript',
            'Supabase with realtime data',
            'TanStack Query + validated forms',
            'Public tracking + driver proof workflow'
        ],
        content: {
            'details': {
                'overview': {
                    title: 'Overview',
                    html: `
                        <p>Legit Logistics is an owner-operated delivery operations platform built for a New England logistics business. It combines a polished public brand with the real workflows that matter: quote review, dispatch operations, public tracking, and proof-of-delivery.</p>
                        <h3>Key Highlights</h3>
                        <ul>
                            <li><strong>Service-led logistics experience</strong> with same-day, regional, final mile, small-move, and construction offerings</li>
                            <li><strong>Quote workflow</strong> with review, accept, decline, and counter-offer states</li>
                            <li><strong>Public tracking</strong> that activates only after delivery confirmation</li>
                            <li><strong>Admin + driver operations</strong> with status updates, photo proof, and signatures</li>
                        </ul>
                    `
                },
                'role-timeline': {
                    title: 'Role & Timeline',
                    html: `
                        <h3>My Role</h3>
                        <p>As the <strong>Full Stack Developer</strong>, I designed and implemented the public experience and the operational core: the quote flow, admin dashboard, tracking routes, and driver proof interactions.</p>
                        <h3>Timeline Breakdown</h3>
                        <ul>
                            <li><strong>Phase 1:</strong> Brand story, services positioning, quote CTA, and public trust signals</li>
                            <li><strong>Phase 2:</strong> Admin dashboard, delivery creation, job detail, and share tools</li>
                            <li><strong>Phase 3:</strong> Public tracking, order lookup, and driver proof-of-delivery workflow</li>
                            <li><strong>Phase 4:</strong> Reliability, responsive polish, and production-readiness documentation</li>
                        </ul>
                    `
                },
                'tech-stack': {
                    title: 'Tech Stack',
                    html: `
                        <h3>Frontend</h3>
                        <ul>
                            <li><strong>React 18</strong> for public and admin experiences</li>
                            <li><strong>TypeScript</strong> for type-safe flows and UI state</li>
                            <li><strong>Tailwind CSS + shadcn/ui</strong> for responsive, accessible interface primitives</li>
                        </ul>
                        <h3>Platform</h3>
                        <ul>
                            <li><strong>Supabase</strong> for auth, data, storage, and live updates</li>
                            <li><strong>TanStack Query</strong> for server-state orchestration</li>
                            <li><strong>React Hook Form + Zod</strong> for validated quote and delivery forms</li>
                        </ul>
                    `
                }
            },
            'problem': {
                'challenge': {
                    title: 'Industry Context',
                    html: `
                        <p>Delivery businesses often rely on disconnected tools for quotes, dispatching, tracking, and proof collection. That creates friction for customers and slows down operations.</p>
                        <ul>
                            <li><strong>Quotes and dispatch</strong> are often disconnected</li>
                            <li><strong>Status visibility</strong> is inconsistent and manual</li>
                            <li><strong>Proof collection</strong> is easy to lose or delay</li>
                            <li><strong>Customer trust</strong> suffers when updates feel premature or vague</li>
                        </ul>
                    `
                },
                'pain-points': {
                    title: 'Friction Points',
                    html: `
                        <h3>Customer Pain Points</h3>
                        <ul>
                            <li>Not knowing when tracking is actually trustworthy</li>
                            <li>Needing flexibility around quote pricing and delivery requirements</li>
                            <li>Wanting a cleaner view of delivery progress without repeated phone calls</li>
                        </ul>
                        <h3>Operations Pain Points</h3>
                        <ul>
                            <li>No single dashboard for job creation and monitoring</li>
                            <li>Drivers need mobile-friendly proof capture</li>
                            <li>Special handling instructions can get lost between handoffs</li>
                        </ul>
                    `
                }
            },
            'goal': {
                'objectives': {
                    title: 'Objectives',
                    html: `
                        <h3>Primary Objectives</h3>
                        <ul>
                            <li>Connect quote review, dispatch, tracking, and proof in one workflow</li>
                            <li>Give dispatchers a fast admin dashboard for creating and managing jobs</li>
                            <li>Support trustworthy customer tracking and mobile-friendly driver proof</li>
                        </ul>
                    `
                },
                'success-criteria': {
                    title: 'Success Criteria',
                    html: `
                        <h3>Measurable Success Signals</h3>
                        <ul>
                            <li><strong>15,000+ deliveries completed</strong></li>
                            <li><strong>99.2% on-time rate</strong></li>
                            <li><strong>&lt;2 minute job creation</strong></li>
                            <li><strong>500+ business clients</strong></li>
                        </ul>
                    `
                }
            },
            'impact': {
                'metrics': {
                    title: 'Metrics & Results',
                    html: `
                        <h3>Key Performance Indicators</h3>
                        <div class="metrics-grid">
                            <div class="metric-item"><span class="metric-value">15,000+</span><span class="metric-label">Deliveries Completed</span></div>
                            <div class="metric-item"><span class="metric-value">99.2%</span><span class="metric-label">On-Time Rate</span></div>
                            <div class="metric-item"><span class="metric-value">500+</span><span class="metric-label">Business Clients</span></div>
                            <div class="metric-item"><span class="metric-value">&lt;2 min</span><span class="metric-label">Job Creation</span></div>
                        </div>
                    `
                },
                'user-feedback': {
                    title: 'Operational Value',
                    html: `
                        <p>Legit Logistics creates a more trustworthy customer journey while making dispatch operations easier to run. Quote review, delivery creation, tracking visibility, and proof-of-delivery all live inside one connected product story.</p>
                    `
                }
            },
            'adoption': {
                'beta-testing': {
                    title: 'User Research',
                    html: `
                        <p>Customer feedback reinforced the trust-first model. People preferred receiving tracking only after a delivery was confirmed, and business clients appreciated having room to discuss price through the counter-offer workflow.</p>
                    `
                },
                'iterations': {
                    title: 'Workflow Validation',
                    html: `
                        <ul>
                            <li>Admin dashboard flows were documented and manually validated</li>
                            <li>Driver controls were refined for smaller touch screens</li>
                            <li>Tracking share tools were tied closely to real delivery confirmation</li>
                        </ul>
                    `
                }
            },
            'testing': {
                'qa-process': {
                    title: 'Strategy',
                    html: `
                        <h3>Quality Assurance Strategy</h3>
                        <ul>
                            <li>Manual verification of quote, tracking, admin, and driver flows</li>
                            <li>Build and TypeScript verification for production readiness</li>
                            <li>Responsive checks across desktop and mobile</li>
                        </ul>
                    `
                },
                'usability': {
                    title: 'Reliability',
                    html: `
                        <p>The documented admin milestone shipped with zero TypeScript errors, a successful production build, and live operational updates through Supabase.</p>
                    `
                }
            },
            'designs': {
                'ui-showcase': {
                    title: 'Customer Experience',
                    html: `
                        <p>The customer-facing experience blends strong logistics branding with clear service packaging and conversion-focused calls to action.</p>
                    `
                },
                'design-system': {
                    title: 'Admin Dashboard',
                    html: `
                        <p>The operational layer centers on a tabbed admin dashboard with delivery creation, job detail review, tracking link sharing, and workflow progression.</p>
                    `
                }
            },
            'development': {
                'architecture': {
                    title: 'Architecture',
                    html: `
                        <h3>System Architecture</h3>
                        <p>The product combines public marketing routes, quote review pages, order lookup, public tracking, an authenticated admin dashboard, and driver interactions.</p>
                    `
                },
                'implementation': {
                    title: 'Implementation',
                    html: `
                        <h3>Development Highlights</h3>
                        <ul>
                            <li>Connected quote-to-delivery workflow instead of isolated pages</li>
                            <li>Trust-first tracking reveal aligned with real dispatch confirmation</li>
                            <li>Mobile-friendly proof capture for field operations</li>
                        </ul>
                    `
                }
            },
            'future': {
                'roadmap': {
                    title: 'Roadmap',
                    html: `
                        <h3>Planned Features</h3>
                        <ul>
                            <li>Driver assignment tools</li>
                            <li>SMS and email notification automation</li>
                            <li>Route optimization and dispatch analytics</li>
                        </ul>
                    `
                },
                'enhancements': {
                    title: 'Key Learnings',
                    html: `
                        <h3>Project Learnings</h3>
                        <ul>
                            <li>Tracking timing matters as much as tracking detail</li>
                            <li>Admin-first visibility reduces operational friction quickly</li>
                            <li>Mobile proof capture is central to logistics UX</li>
                        </ul>
                    `
                }
            }
        }
    }

};


// ====================================
// CONTENT CARD STATE
// ====================================

const ContentCardState = {
    currentProject: 1,
    currentSection: 'details',
    currentPageId: 'overview'
};

// ====================================
// DOM CACHE FOR CONTENT CARD
// ====================================

const ContentCardDOM = {
    card: null,
    statusBadge: null,
    metaTimeline: null,
    metaRole: null,
    projectTitle: null,
    projectTagline: null,
    techStackPills: null,
    sectionLabel: null,
    pageTitle: null,
    pageContent: null,
    paginationPrev: null,
    paginationNext: null,
    paginationDots: null
};

// ====================================
// INITIALIZATION
// ====================================

/**
 * Initialize the content card system
 */
function initContentCard() {
    console.log('Initializing content card...');
    
    // Cache DOM elements
    cacheContentCardDOM();
    
    if (!ContentCardDOM.card) {
        console.warn('Content card not found, skipping initialization');
        return;
    }
    
    // Setup pagination event listeners
    setupPaginationListeners();
    
    // Render initial content
    renderProjectHeader(ContentCardState.currentProject);
    renderPageContent(ContentCardState.currentSection, ContentCardState.currentPageId);
    
    // Set initial layout visibility based on current project
    // Requirements: 3.1 - Show new layout for Projects 1 and 2
    updateLayoutVisibility(ContentCardState.currentProject);
    
    console.log('Content card initialized');
}

// ====================================
// LAYOUT VISIBILITY TOGGLE
// Task 9.2: Toggle visibility based on active project
// Requirements: 3.1 - Content card spans full width
// ====================================

/**
 * Update layout visibility based on active project
 * Shows new layout (section pills + content card) for Projects 1 and 2
 * Keeps accordion code available for potential future use
 * @param {number} projectNumber - The project number (1, 2, or 3)
 */
function updateLayoutVisibility(projectNumber) {
    const body = document.body;
    
    // Projects 1 and 2 use the new layout (section pills + content card)
    // Project 3 (EduManage) redirects to its own page, but if somehow accessed,
    // it would use the old layout
    if (projectNumber === 1 || projectNumber === 2) {
        body.classList.add('new-layout-active');
        console.log(`Layout: New layout active for Project ${projectNumber}`);
    } else {
        body.classList.remove('new-layout-active');
        console.log(`Layout: Old layout active for Project ${projectNumber}`);
    }
}

/**
 * Check if new layout is currently active
 * @returns {boolean} True if new layout is active
 */
function isNewLayoutActive() {
    return document.body.classList.contains('new-layout-active');
}

/**
 * Cache content card DOM elements
 */
function cacheContentCardDOM() {
    ContentCardDOM.card = document.getElementById('content-card');
    ContentCardDOM.statusBadge = document.getElementById('status-badge');
    ContentCardDOM.metaTimeline = document.getElementById('meta-timeline');
    ContentCardDOM.metaRole = document.getElementById('meta-role');
    ContentCardDOM.projectTitle = document.getElementById('project-title');
    ContentCardDOM.projectTagline = document.getElementById('project-tagline');
    ContentCardDOM.techStackPills = document.getElementById('tech-stack-pills');
    ContentCardDOM.sectionLabel = document.getElementById('section-label');
    ContentCardDOM.pageTitle = document.getElementById('card-page-title');
    ContentCardDOM.pageContent = document.getElementById('card-page-content');
    ContentCardDOM.paginationPrev = document.getElementById('pagination-prev');
    ContentCardDOM.paginationNext = document.getElementById('pagination-next');
    ContentCardDOM.paginationDots = document.getElementById('pagination-dots');
    
    console.log('Content card DOM cached:', {
        card: !!ContentCardDOM.card,
        statusBadge: !!ContentCardDOM.statusBadge,
        pageContent: !!ContentCardDOM.pageContent,
        paginationDots: !!ContentCardDOM.paginationDots
    });
}

// ====================================
// CONTENT RENDERING FUNCTIONS
// Requirements: 3.2-3.8, 4.4
// ====================================

/**
 * Render the project header (status, metadata, title, tagline, tech stack)
 * @param {number} projectNumber - The project number (1 or 2)
 */
function renderProjectHeader(projectNumber) {
    const project = PROJECTS[projectNumber];
    if (!project) {
        console.error(`Project ${projectNumber} not found`);
        return;
    }
    
    // Update status badge (Requirement 3.2)
    if (ContentCardDOM.statusBadge) {
        ContentCardDOM.statusBadge.textContent = project.status;
    }
    
    // Update metadata (Requirement 3.3)
    if (ContentCardDOM.metaTimeline) {
        ContentCardDOM.metaTimeline.textContent = project.timeline;
    }
    if (ContentCardDOM.metaRole) {
        ContentCardDOM.metaRole.textContent = project.role;
    }
    
    // Update project title (Requirement 3.4)
    if (ContentCardDOM.projectTitle) {
        ContentCardDOM.projectTitle.textContent = project.title;
    }
    
    // Update project tagline (Requirement 3.5)
    if (ContentCardDOM.projectTagline) {
        ContentCardDOM.projectTagline.textContent = project.tagline;
    }
    
    // Render tech stack pills (Requirement 3.6, 4.4)
    renderTechStackPills(project.techStack);
    
    console.log(`Project header rendered for: ${project.title}`);
}

/**
 * Render tech stack pills
 * @param {string[]} techStack - Array of technology names
 */
function renderTechStackPills(techStack) {
    if (!ContentCardDOM.techStackPills || !techStack) return;
    
    // Clear existing pills
    ContentCardDOM.techStackPills.innerHTML = '';
    
    // Create pills for each technology
    techStack.forEach(tech => {
        const pill = document.createElement('span');
        pill.className = 'tech-pill';
        pill.textContent = tech;
        ContentCardDOM.techStackPills.appendChild(pill);
    });
}

/**
 * Render page content based on section and page
 * @param {string} sectionKey - The section key
 * @param {string} pageId - The page ID within the section
 */
function renderPageContent(sectionKey, pageId) {
    const project = PROJECTS[ContentCardState.currentProject];
    if (!project) return;
    
    // Get section from SECTIONS config (from section-pills.js)
    const section = typeof SECTIONS !== 'undefined' 
        ? SECTIONS.find(s => s.key === sectionKey) 
        : null;
    
    // Update section label (Requirement 3.7)
    if (ContentCardDOM.sectionLabel && section) {
        ContentCardDOM.sectionLabel.textContent = section.label.toUpperCase();
    }
    
    // Get page content
    const sectionContent = project.content[sectionKey];
    const pageContent = sectionContent ? sectionContent[pageId] : null;
    
    if (pageContent) {
        // Update page title (Requirement 3.8)
        if (ContentCardDOM.pageTitle) {
            ContentCardDOM.pageTitle.textContent = pageContent.title;
        }
        
        // Update page content
        if (ContentCardDOM.pageContent) {
            ContentCardDOM.pageContent.innerHTML = pageContent.html;
        }
    } else {
        // Fallback content
        if (ContentCardDOM.pageTitle) {
            ContentCardDOM.pageTitle.textContent = 'Content Coming Soon';
        }
        if (ContentCardDOM.pageContent) {
            ContentCardDOM.pageContent.innerHTML = '<p>This section is under development.</p>';
        }
    }
    
    // Update state
    ContentCardState.currentSection = sectionKey;
    ContentCardState.currentPageId = pageId;
    
    // Update pagination dots
    if (section) {
        updateContentCardPaginationDots(section);
    }
    
    // Update prev/next button states
    updatePaginationButtonStates();
    
    console.log(`Page content rendered: ${sectionKey}/${pageId}`);
}

// ====================================
// PAGINATION FUNCTIONALITY
// Requirements: 8.3, 8.4, 8.5, 8.6
// ====================================

/**
 * Setup pagination event listeners
 */
function setupPaginationListeners() {
    // Previous button handler (Requirement 8.3)
    if (ContentCardDOM.paginationPrev) {
        ContentCardDOM.paginationPrev.addEventListener('click', function() {
            navigatePrevious();
        });
    }
    
    // Next button handler (Requirement 8.4)
    if (ContentCardDOM.paginationNext) {
        ContentCardDOM.paginationNext.addEventListener('click', function() {
            navigateNext();
        });
    }
    
    console.log('Pagination listeners setup complete');
}

/**
 * Navigate to previous page/section
 * Requirement 8.3: Navigate to previous Sub_Page (or previous section's last page if at first page)
 */
function navigatePrevious() {
    if (typeof SECTIONS === 'undefined') return;
    
    const currentSection = SECTIONS.find(s => s.key === ContentCardState.currentSection);
    if (!currentSection) return;
    
    // Find current page index within section
    const currentPageIndex = currentSection.pages.findIndex(p => p.id === ContentCardState.currentPageId);
    
    if (currentPageIndex > 0) {
        // Navigate to previous page in same section
        const prevPage = currentSection.pages[currentPageIndex - 1];
        navigateToContentPage(currentSection.key, prevPage.id);
    } else {
        // Navigate to previous section's last page
        const currentSectionIndex = SECTIONS.findIndex(s => s.key === ContentCardState.currentSection);
        if (currentSectionIndex > 0) {
            const prevSection = SECTIONS[currentSectionIndex - 1];
            const lastPage = prevSection.pages[prevSection.pages.length - 1];
            navigateToContentPage(prevSection.key, lastPage.id);
        }
    }
    
    // Play sound if available
    if (typeof soundManager !== 'undefined' && soundManager) {
        soundManager.playPageFlip();
    }
}

/**
 * Navigate to next page/section
 * Requirement 8.4: Navigate to next Sub_Page (or next section's first page if at last page)
 */
function navigateNext() {
    if (typeof SECTIONS === 'undefined') return;
    
    const currentSection = SECTIONS.find(s => s.key === ContentCardState.currentSection);
    if (!currentSection) return;
    
    // Find current page index within section
    const currentPageIndex = currentSection.pages.findIndex(p => p.id === ContentCardState.currentPageId);
    
    if (currentPageIndex < currentSection.pages.length - 1) {
        // Navigate to next page in same section
        const nextPage = currentSection.pages[currentPageIndex + 1];
        navigateToContentPage(currentSection.key, nextPage.id);
    } else {
        // Navigate to next section's first page
        const currentSectionIndex = SECTIONS.findIndex(s => s.key === ContentCardState.currentSection);
        if (currentSectionIndex < SECTIONS.length - 1) {
            const nextSection = SECTIONS[currentSectionIndex + 1];
            const firstPage = nextSection.pages[0];
            navigateToContentPage(nextSection.key, firstPage.id);
        }
    }
    
    // Play sound if available
    if (typeof soundManager !== 'undefined' && soundManager) {
        soundManager.playPageFlip();
    }
}

/**
 * Navigate to a specific content page
 * @param {string} sectionKey - The section key
 * @param {string} pageId - The page ID
 */
function navigateToContentPage(sectionKey, pageId) {
    // Render the new content
    renderPageContent(sectionKey, pageId);
    
    // Sync with section pills if available
    if (typeof updateActivePill === 'function') {
        updateActivePill(sectionKey);
    }
    
    // Find the page index for syncing with other navigation systems
    if (typeof SECTIONS !== 'undefined') {
        const section = SECTIONS.find(s => s.key === sectionKey);
        if (section) {
            const page = section.pages.find(p => p.id === pageId);
            if (page && typeof navigateToSectionPage === 'function') {
                // Update section pills state without triggering another content update
                if (typeof SectionPillsState !== 'undefined') {
                    SectionPillsState.currentSection = sectionKey;
                    SectionPillsState.currentPage = page.pageIndex;
                }
            }
        }
    }
}

/**
 * Update pagination dots for current section
 * Requirement 8.2, 8.5: Dot indicators showing current page position
 * @param {Object} section - The section configuration
 */
function updateContentCardPaginationDots(section) {
    if (!ContentCardDOM.paginationDots || !section) return;
    
    // Clear existing dots
    ContentCardDOM.paginationDots.innerHTML = '';
    
    // Create dots for each page in the section (Requirement 8.2)
    section.pages.forEach((page, index) => {
        const dot = document.createElement('button');
        dot.className = 'dot';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('data-page-id', page.id);
        dot.setAttribute('aria-label', `Page ${index + 1} of ${section.pages.length}: ${page.title}`);
        
        // Highlight current page (Requirement 8.5)
        if (page.id === ContentCardState.currentPageId) {
            dot.classList.add('active');
            dot.setAttribute('aria-selected', 'true');
        } else {
            dot.setAttribute('aria-selected', 'false');
        }
        
        // Add click handler for dot (Requirement 8.6)
        dot.addEventListener('click', function() {
            navigateToContentPage(section.key, page.id);
            
            // Play sound if available
            if (typeof soundManager !== 'undefined' && soundManager) {
                soundManager.playPageFlip();
            }
        });
        
        ContentCardDOM.paginationDots.appendChild(dot);
    });
}

/**
 * Update prev/next button disabled states
 */
function updatePaginationButtonStates() {
    if (typeof SECTIONS === 'undefined') return;
    
    const currentSectionIndex = SECTIONS.findIndex(s => s.key === ContentCardState.currentSection);
    const currentSection = SECTIONS[currentSectionIndex];
    if (!currentSection) return;
    
    const currentPageIndex = currentSection.pages.findIndex(p => p.id === ContentCardState.currentPageId);
    
    // Check if at very first page
    const isFirstPage = currentSectionIndex === 0 && currentPageIndex === 0;
    
    // Check if at very last page
    const isLastPage = currentSectionIndex === SECTIONS.length - 1 && 
                       currentPageIndex === currentSection.pages.length - 1;
    
    // Update button states
    if (ContentCardDOM.paginationPrev) {
        ContentCardDOM.paginationPrev.disabled = isFirstPage;
    }
    if (ContentCardDOM.paginationNext) {
        ContentCardDOM.paginationNext.disabled = isLastPage;
    }
}

// ====================================
// PROJECT SWITCHING INTEGRATION
// ====================================

/**
 * Switch to a different project and reset content card
 * @param {number} projectNumber - The project number (1 or 2)
 */
function switchContentCardProject(projectNumber) {
    if (!PROJECTS[projectNumber]) {
        console.error(`Project ${projectNumber} not found`);
        return;
    }
    
    // Update state
    ContentCardState.currentProject = projectNumber;
    ContentCardState.currentSection = 'details';
    ContentCardState.currentPageId = 'overview';
    
    // Update layout visibility based on project
    // Task 9.2: Toggle visibility based on active project
    // Requirements: 3.1 - Show new layout for Projects 1 and 2
    updateLayoutVisibility(projectNumber);
    
    // Re-render header and content
    renderProjectHeader(projectNumber);
    renderPageContent('details', 'overview');
    
    console.log(`Content card switched to project ${projectNumber}`);
}

/**
 * Sync content card with section pills navigation
 * Called from section-pills.js when navigation occurs
 * @param {string} sectionKey - The section key
 * @param {number} pageIndex - The page index
 */
function syncContentCardWithNavigation(sectionKey, pageIndex) {
    if (typeof SECTIONS === 'undefined') return;
    
    const section = SECTIONS.find(s => s.key === sectionKey);
    if (!section) return;
    
    const page = section.pages.find(p => p.pageIndex === pageIndex);
    if (!page) return;
    
    // Update content without triggering navigation loop
    ContentCardState.currentSection = sectionKey;
    ContentCardState.currentPageId = page.id;
    
    renderPageContent(sectionKey, page.id);
}

// ====================================
// INITIALIZE ON DOM READY
// ====================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize content card after a short delay to ensure other scripts are loaded
    setTimeout(initContentCard, 150);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PROJECTS,
        ContentCardState,
        initContentCard,
        renderProjectHeader,
        renderPageContent,
        navigatePrevious,
        navigateNext,
        switchContentCardProject,
        syncContentCardWithNavigation,
        updateLayoutVisibility,
        isNewLayoutActive
    };
}

console.log('Content card module loaded');
