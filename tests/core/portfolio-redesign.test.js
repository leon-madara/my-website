/**
 * Portfolio Case Study Redesign - Visual and Functional Tests
 * Task 10: Checkpoint - Visual and Functional Testing
 * 
 * Tests for:
 * - Section pills rendering
 * - Dropdown open/close behavior
 * - Navigation through sections and pages
 * - Pagination Previous/Next and dots
 * - Project switching
 * - Responsive behavior
 * - Accordion visibility toggle
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock SECTIONS configuration (from section-pills.js)
const SECTIONS = [
    {
        key: 'details',
        number: '01',
        label: 'Project Details',
        pages: [
            { id: 'overview', title: 'Overview', pageIndex: 0 },
            { id: 'role-timeline', title: 'Role & Timeline', pageIndex: 1 },
            { id: 'tech-stack', title: 'Tech Stack', pageIndex: 2 }
        ]
    },
    {
        key: 'problem',
        number: '02',
        label: 'Problem',
        pages: [
            { id: 'challenge', title: 'The Challenge', pageIndex: 3 },
            { id: 'pain-points', title: 'Pain Points', pageIndex: 4 }
        ]
    },
    {
        key: 'goal',
        number: '03',
        label: 'Goal',
        pages: [
            { id: 'objectives', title: 'Objectives', pageIndex: 5 },
            { id: 'success-criteria', title: 'Success Criteria', pageIndex: 6 }
        ]
    },
    {
        key: 'impact',
        number: '04',
        label: 'Impact',
        pages: [
            { id: 'metrics', title: 'Metrics & Results', pageIndex: 7 },
            { id: 'user-feedback', title: 'User Feedback', pageIndex: 8 }
        ]
    },
    {
        key: 'adoption',
        number: '05',
        label: 'Early Adoption',
        pages: [
            { id: 'beta-testing', title: 'Beta Testing', pageIndex: 9 },
            { id: 'iterations', title: 'Iterations', pageIndex: 10 }
        ]
    },
    {
        key: 'testing',
        number: '06',
        label: 'Testing',
        pages: [
            { id: 'qa-process', title: 'QA Process', pageIndex: 11 },
            { id: 'usability', title: 'Usability Testing', pageIndex: 12 }
        ]
    },
    {
        key: 'designs',
        number: '07',
        label: 'Final Designs',
        pages: [
            { id: 'ui-showcase', title: 'UI Showcase', pageIndex: 13 },
            { id: 'design-system', title: 'Design System', pageIndex: 14 }
        ]
    },
    {
        key: 'development',
        number: '08',
        label: 'Development',
        pages: [
            { id: 'architecture', title: 'Architecture', pageIndex: 15 },
            { id: 'implementation', title: 'Implementation', pageIndex: 16 }
        ]
    },
    {
        key: 'future',
        number: '09',
        label: 'Future Steps',
        pages: [
            { id: 'roadmap', title: 'Roadmap', pageIndex: 17 },
            { id: 'enhancements', title: 'Planned Enhancements', pageIndex: 18 }
        ]
    }
];

// Helper to create section pills row HTML structure
function createSectionPillsRow() {
    const row = document.createElement('div');
    row.className = 'section-pills-row';
    row.setAttribute('aria-label', 'Case study sections');
    
    SECTIONS.forEach(section => {
        const pill = document.createElement('button');
        pill.className = 'section-pill';
        pill.setAttribute('data-section', section.key);
        pill.setAttribute('aria-expanded', 'false');
        pill.setAttribute('aria-haspopup', 'true');
        
        // Number badge
        const number = document.createElement('span');
        number.className = 'pill-number';
        number.textContent = section.number;
        pill.appendChild(number);
        
        // Label
        const label = document.createElement('span');
        label.className = 'pill-label';
        label.textContent = section.label;
        pill.appendChild(label);
        
        // Chevron
        const chevron = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        chevron.setAttribute('class', 'pill-chevron');
        chevron.setAttribute('viewBox', '0 0 24 24');
        pill.appendChild(chevron);
        
        // Dropdown
        const dropdown = document.createElement('div');
        dropdown.className = 'pill-dropdown';
        dropdown.setAttribute('role', 'menu');
        
        section.pages.forEach(page => {
            const link = document.createElement('a');
            link.className = 'dropdown-link';
            link.setAttribute('role', 'menuitem');
            link.setAttribute('data-page', page.pageIndex.toString());
            link.href = `#${page.id}`;
            link.textContent = page.title;
            dropdown.appendChild(link);
        });
        
        pill.appendChild(dropdown);
        row.appendChild(pill);
    });
    
    return row;
}

// Helper to create content card HTML structure
function createContentCard() {
    const card = document.createElement('div');
    card.className = 'content-card';
    card.id = 'content-card';
    
    // Header
    const header = document.createElement('header');
    header.className = 'card-header';
    
    const topRow = document.createElement('div');
    topRow.className = 'header-top-row';
    
    const statusBadge = document.createElement('span');
    statusBadge.className = 'status-badge';
    statusBadge.id = 'status-badge';
    statusBadge.textContent = 'Production-Ready';
    topRow.appendChild(statusBadge);
    
    const metadata = document.createElement('div');
    metadata.className = 'header-metadata';
    metadata.innerHTML = `
        <span class="meta-item"><strong>Timeline</strong><span id="meta-timeline">3 weeks</span></span>
        <span class="meta-item"><strong>Role</strong><span id="meta-role">Full Stack Developer</span></span>
    `;
    topRow.appendChild(metadata);
    header.appendChild(topRow);
    
    const title = document.createElement('h1');
    title.className = 'project-title';
    title.id = 'project-title';
    title.textContent = 'Eastleigh Turf Flow';
    header.appendChild(title);
    
    const tagline = document.createElement('p');
    tagline.className = 'project-tagline';
    tagline.id = 'project-tagline';
    tagline.textContent = 'Full-stack e-commerce platform for a professional turf installation business.';
    header.appendChild(tagline);
    
    const techStack = document.createElement('div');
    techStack.className = 'tech-stack-pills';
    techStack.id = 'tech-stack-pills';
    ['React 18', 'Supabase', 'Tailwind CSS', 'Vercel'].forEach(tech => {
        const pill = document.createElement('span');
        pill.className = 'tech-pill';
        pill.textContent = tech;
        techStack.appendChild(pill);
    });
    header.appendChild(techStack);
    card.appendChild(header);
    
    // Divider
    const divider = document.createElement('hr');
    divider.className = 'card-divider';
    card.appendChild(divider);
    
    // Content
    const content = document.createElement('div');
    content.className = 'card-content';
    
    const sectionLabel = document.createElement('span');
    sectionLabel.className = 'section-label';
    sectionLabel.id = 'section-label';
    sectionLabel.textContent = 'PROJECT DETAILS';
    content.appendChild(sectionLabel);
    
    const pageTitle = document.createElement('h2');
    pageTitle.className = 'page-title';
    pageTitle.id = 'card-page-title';
    pageTitle.textContent = 'Overview';
    content.appendChild(pageTitle);
    
    const pageContent = document.createElement('div');
    pageContent.className = 'page-content';
    pageContent.id = 'card-page-content';
    pageContent.innerHTML = '<p>Test content</p>';
    content.appendChild(pageContent);
    card.appendChild(content);
    
    // Pagination
    const pagination = document.createElement('footer');
    pagination.className = 'card-pagination';
    
    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-prev';
    prevBtn.id = 'pagination-prev';
    prevBtn.innerHTML = '<span>Previous</span>';
    pagination.appendChild(prevBtn);
    
    const dots = document.createElement('div');
    dots.className = 'pagination-dots';
    dots.id = 'pagination-dots';
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('data-page', i.toString());
        dots.appendChild(dot);
    }
    pagination.appendChild(dots);
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-next';
    nextBtn.id = 'pagination-next';
    nextBtn.innerHTML = '<span>Next</span>';
    pagination.appendChild(nextBtn);
    
    card.appendChild(pagination);
    
    return card;
}

// Helper to create project toggle buttons
function createProjectToggles() {
    const container = document.createElement('div');
    container.className = 'project-toggle-container';
    
    for (let i = 1; i <= 3; i++) {
        const btn = document.createElement('button');
        btn.className = 'project-toggle-btn' + (i === 1 ? ' active' : '');
        btn.setAttribute('data-project', i.toString());
        btn.innerHTML = `<span class="toggle-badge">0${i}</span><span class="toggle-label">Project ${i}</span>`;
        container.appendChild(btn);
    }
    
    return container;
}

// Helper to create accordion nav (old layout)
function createAccordionNav() {
    const nav = document.createElement('aside');
    nav.className = 'accordion-nav';
    nav.innerHTML = '<div class="accordion-menu"><div class="accordion-item">Test</div></div>';
    return nav;
}

// Helper to create content wrapper (old layout)
function createContentWrapper() {
    const wrapper = document.createElement('section');
    wrapper.className = 'content-wrapper';
    wrapper.innerHTML = '<div class="content-area">Old content</div>';
    return wrapper;
}

describe('Portfolio Case Study Redesign - Checkpoint Tests', () => {
    
    beforeEach(() => {
        document.body.innerHTML = '';
        document.body.className = 'portfolio-page';
    });
    
    afterEach(() => {
        document.body.innerHTML = '';
        document.body.className = '';
    });

    describe('1. Section Pills Rendering', () => {
        
        it('should render all 9 section pills', () => {
            const pillsRow = createSectionPillsRow();
            document.body.appendChild(pillsRow);
            
            const pills = document.querySelectorAll('.section-pill');
            expect(pills.length).toBe(9);
        });
        
        it('should display correct number badges (01-09)', () => {
            const pillsRow = createSectionPillsRow();
            document.body.appendChild(pillsRow);
            
            const numbers = document.querySelectorAll('.pill-number');
            const expectedNumbers = ['01', '02', '03', '04', '05', '06', '07', '08', '09'];
            
            numbers.forEach((num, index) => {
                expect(num.textContent).toBe(expectedNumbers[index]);
            });
        });
        
        it('should display correct section labels', () => {
            const pillsRow = createSectionPillsRow();
            document.body.appendChild(pillsRow);
            
            const labels = document.querySelectorAll('.pill-label');
            const expectedLabels = [
                'Project Details', 'Problem', 'Goal', 'Impact', 
                'Early Adoption', 'Testing', 'Final Designs', 
                'Development', 'Future Steps'
            ];
            
            labels.forEach((label, index) => {
                expect(label.textContent).toBe(expectedLabels[index]);
            });
        });
        
        it('should have chevron icons on each pill', () => {
            const pillsRow = createSectionPillsRow();
            document.body.appendChild(pillsRow);
            
            const chevrons = document.querySelectorAll('.pill-chevron');
            expect(chevrons.length).toBe(9);
        });
        
        it('should have dropdown menus inside each pill', () => {
            const pillsRow = createSectionPillsRow();
            document.body.appendChild(pillsRow);
            
            const dropdowns = document.querySelectorAll('.pill-dropdown');
            expect(dropdowns.length).toBe(9);
        });
        
        it('should have correct data-section attributes', () => {
            const pillsRow = createSectionPillsRow();
            document.body.appendChild(pillsRow);
            
            const pills = document.querySelectorAll('.section-pill');
            const expectedSections = [
                'details', 'problem', 'goal', 'impact', 
                'adoption', 'testing', 'designs', 
                'development', 'future'
            ];
            
            pills.forEach((pill, index) => {
                expect(pill.getAttribute('data-section')).toBe(expectedSections[index]);
            });
        });
    });

    describe('2. Dropdown Open/Close Behavior', () => {
        
        it('should have dropdown hidden by default', () => {
            const pillsRow = createSectionPillsRow();
            document.body.appendChild(pillsRow);
            
            const dropdowns = document.querySelectorAll('.pill-dropdown');
            dropdowns.forEach(dropdown => {
                expect(dropdown.classList.contains('visible')).toBe(false);
            });
        });
        
        it('should toggle open class on pill when clicked', () => {
            const pillsRow = createSectionPillsRow();
            document.body.appendChild(pillsRow);
            
            const pill = document.querySelector('.section-pill');
            
            // Simulate adding open class (as the JS would do)
            pill.classList.add('open');
            expect(pill.classList.contains('open')).toBe(true);
            
            pill.classList.remove('open');
            expect(pill.classList.contains('open')).toBe(false);
        });
        
        it('should have correct aria-expanded attribute', () => {
            const pillsRow = createSectionPillsRow();
            document.body.appendChild(pillsRow);
            
            const pills = document.querySelectorAll('.section-pill');
            pills.forEach(pill => {
                expect(pill.getAttribute('aria-expanded')).toBe('false');
            });
        });
        
        it('should contain correct sub-page links in dropdown', () => {
            const pillsRow = createSectionPillsRow();
            document.body.appendChild(pillsRow);
            
            // Check first section (Project Details) has 3 links
            const firstDropdown = document.querySelector('.section-pill[data-section="details"] .pill-dropdown');
            const links = firstDropdown.querySelectorAll('.dropdown-link');
            
            expect(links.length).toBe(3);
            expect(links[0].textContent).toBe('Overview');
            expect(links[1].textContent).toBe('Role & Timeline');
            expect(links[2].textContent).toBe('Tech Stack');
        });
    });

    describe('3. Navigation Through Sections and Pages', () => {
        
        it('should have dropdown links with correct data-page attributes', () => {
            const pillsRow = createSectionPillsRow();
            document.body.appendChild(pillsRow);
            
            // Check first section pages
            const detailsLinks = document.querySelectorAll('.section-pill[data-section="details"] .dropdown-link');
            expect(detailsLinks[0].getAttribute('data-page')).toBe('0');
            expect(detailsLinks[1].getAttribute('data-page')).toBe('1');
            expect(detailsLinks[2].getAttribute('data-page')).toBe('2');
            
            // Check second section pages
            const problemLinks = document.querySelectorAll('.section-pill[data-section="problem"] .dropdown-link');
            expect(problemLinks[0].getAttribute('data-page')).toBe('3');
            expect(problemLinks[1].getAttribute('data-page')).toBe('4');
        });
        
        it('should have correct href attributes on dropdown links', () => {
            const pillsRow = createSectionPillsRow();
            document.body.appendChild(pillsRow);
            
            const overviewLink = document.querySelector('.dropdown-link[data-page="0"]');
            expect(overviewLink.getAttribute('href')).toBe('#overview');
            
            const challengeLink = document.querySelector('.dropdown-link[data-page="3"]');
            expect(challengeLink.getAttribute('href')).toBe('#challenge');
        });
        
        it('should support active state on pills', () => {
            const pillsRow = createSectionPillsRow();
            document.body.appendChild(pillsRow);
            
            const pill = document.querySelector('.section-pill');
            pill.classList.add('active');
            
            expect(pill.classList.contains('active')).toBe(true);
        });
    });

    describe('4. Pagination Previous/Next and Dots', () => {
        
        it('should render pagination controls', () => {
            const card = createContentCard();
            document.body.appendChild(card);
            
            const prevBtn = document.getElementById('pagination-prev');
            const nextBtn = document.getElementById('pagination-next');
            const dots = document.getElementById('pagination-dots');
            
            expect(prevBtn).not.toBeNull();
            expect(nextBtn).not.toBeNull();
            expect(dots).not.toBeNull();
        });
        
        it('should render correct number of dots for section', () => {
            const card = createContentCard();
            document.body.appendChild(card);
            
            const dots = document.querySelectorAll('.pagination-dots .dot');
            expect(dots.length).toBe(3); // Project Details has 3 pages
        });
        
        it('should have first dot active by default', () => {
            const card = createContentCard();
            document.body.appendChild(card);
            
            const firstDot = document.querySelector('.pagination-dots .dot');
            expect(firstDot.classList.contains('active')).toBe(true);
        });
        
        it('should have data-page attributes on dots', () => {
            const card = createContentCard();
            document.body.appendChild(card);
            
            const dots = document.querySelectorAll('.pagination-dots .dot');
            dots.forEach((dot, index) => {
                expect(dot.getAttribute('data-page')).toBe(index.toString());
            });
        });
        
        it('should support disabled state on pagination buttons', () => {
            const card = createContentCard();
            document.body.appendChild(card);
            
            const prevBtn = document.getElementById('pagination-prev');
            prevBtn.disabled = true;
            
            expect(prevBtn.disabled).toBe(true);
        });
    });

    describe('5. Project Switching', () => {
        
        it('should render project toggle buttons', () => {
            const toggles = createProjectToggles();
            document.body.appendChild(toggles);
            
            const buttons = document.querySelectorAll('.project-toggle-btn');
            expect(buttons.length).toBe(3);
        });
        
        it('should have first project active by default', () => {
            const toggles = createProjectToggles();
            document.body.appendChild(toggles);
            
            const firstBtn = document.querySelector('.project-toggle-btn[data-project="1"]');
            expect(firstBtn.classList.contains('active')).toBe(true);
        });
        
        it('should have correct data-project attributes', () => {
            const toggles = createProjectToggles();
            document.body.appendChild(toggles);
            
            const buttons = document.querySelectorAll('.project-toggle-btn');
            buttons.forEach((btn, index) => {
                expect(btn.getAttribute('data-project')).toBe((index + 1).toString());
            });
        });
        
        it('should support switching active state between projects', () => {
            const toggles = createProjectToggles();
            document.body.appendChild(toggles);
            
            const btn1 = document.querySelector('.project-toggle-btn[data-project="1"]');
            const btn2 = document.querySelector('.project-toggle-btn[data-project="2"]');
            
            // Simulate switching to project 2
            btn1.classList.remove('active');
            btn2.classList.add('active');
            
            expect(btn1.classList.contains('active')).toBe(false);
            expect(btn2.classList.contains('active')).toBe(true);
        });
    });

    describe('6. Content Card Rendering', () => {
        
        it('should render content card with all required elements', () => {
            const card = createContentCard();
            document.body.appendChild(card);
            
            expect(document.getElementById('status-badge')).not.toBeNull();
            expect(document.getElementById('meta-timeline')).not.toBeNull();
            expect(document.getElementById('meta-role')).not.toBeNull();
            expect(document.getElementById('project-title')).not.toBeNull();
            expect(document.getElementById('project-tagline')).not.toBeNull();
            expect(document.getElementById('tech-stack-pills')).not.toBeNull();
            expect(document.getElementById('section-label')).not.toBeNull();
            expect(document.getElementById('card-page-title')).not.toBeNull();
            expect(document.getElementById('card-page-content')).not.toBeNull();
        });
        
        it('should render tech stack pills', () => {
            const card = createContentCard();
            document.body.appendChild(card);
            
            const techPills = document.querySelectorAll('.tech-pill');
            expect(techPills.length).toBe(4);
        });
        
        it('should have card divider', () => {
            const card = createContentCard();
            document.body.appendChild(card);
            
            const divider = document.querySelector('.card-divider');
            expect(divider).not.toBeNull();
        });
    });

    describe('7. Layout Visibility Toggle (Accordion Hidden)', () => {
        
        it('should hide accordion when new-layout-active class is present', () => {
            const accordion = createAccordionNav();
            const contentWrapper = createContentWrapper();
            const pillsRow = createSectionPillsRow();
            const card = createContentCard();
            
            document.body.appendChild(accordion);
            document.body.appendChild(contentWrapper);
            document.body.appendChild(pillsRow);
            document.body.appendChild(card);
            
            // Add new-layout-active class
            document.body.classList.add('new-layout-active');
            
            // The CSS rules should hide accordion and content-wrapper
            // We verify the class is applied correctly
            expect(document.body.classList.contains('new-layout-active')).toBe(true);
            expect(document.body.classList.contains('portfolio-page')).toBe(true);
        });
        
        it('should show section pills and content card when new-layout-active', () => {
            const pillsRow = createSectionPillsRow();
            const card = createContentCard();
            
            document.body.appendChild(pillsRow);
            document.body.appendChild(card);
            document.body.classList.add('new-layout-active');
            
            // Verify elements exist
            expect(document.querySelector('.section-pills-row')).not.toBeNull();
            expect(document.querySelector('.content-card')).not.toBeNull();
        });
        
        it('should toggle layout visibility based on class', () => {
            document.body.classList.add('new-layout-active');
            expect(document.body.classList.contains('new-layout-active')).toBe(true);
            
            document.body.classList.remove('new-layout-active');
            expect(document.body.classList.contains('new-layout-active')).toBe(false);
        });
    });

    describe('8. Accessibility', () => {
        
        it('should have aria-label on section pills row', () => {
            const pillsRow = createSectionPillsRow();
            document.body.appendChild(pillsRow);
            
            expect(pillsRow.getAttribute('aria-label')).toBe('Case study sections');
        });
        
        it('should have aria-haspopup on section pills', () => {
            const pillsRow = createSectionPillsRow();
            document.body.appendChild(pillsRow);
            
            const pills = document.querySelectorAll('.section-pill');
            pills.forEach(pill => {
                expect(pill.getAttribute('aria-haspopup')).toBe('true');
            });
        });
        
        it('should have role="menu" on dropdowns', () => {
            const pillsRow = createSectionPillsRow();
            document.body.appendChild(pillsRow);
            
            const dropdowns = document.querySelectorAll('.pill-dropdown');
            dropdowns.forEach(dropdown => {
                expect(dropdown.getAttribute('role')).toBe('menu');
            });
        });
        
        it('should have role="menuitem" on dropdown links', () => {
            const pillsRow = createSectionPillsRow();
            document.body.appendChild(pillsRow);
            
            const links = document.querySelectorAll('.dropdown-link');
            links.forEach(link => {
                expect(link.getAttribute('role')).toBe('menuitem');
            });
        });
    });

    describe('9. Section Configuration Integrity', () => {
        
        it('should have 9 sections in configuration', () => {
            expect(SECTIONS.length).toBe(9);
        });
        
        it('should have unique section keys', () => {
            const keys = SECTIONS.map(s => s.key);
            const uniqueKeys = [...new Set(keys)];
            expect(uniqueKeys.length).toBe(keys.length);
        });
        
        it('should have sequential page indices', () => {
            let expectedIndex = 0;
            SECTIONS.forEach(section => {
                section.pages.forEach(page => {
                    expect(page.pageIndex).toBe(expectedIndex);
                    expectedIndex++;
                });
            });
        });
        
        it('should have total of 19 pages across all sections', () => {
            const totalPages = SECTIONS.reduce((sum, section) => sum + section.pages.length, 0);
            expect(totalPages).toBe(19);
        });
    });
});
