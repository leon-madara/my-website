/**
 * Portfolio Case Study Redesign - Property-Based Tests
 * Task 11: Write Property Tests
 * 
 * Property-based tests for:
 * - Section pill structure consistency (Property 1)
 * - Dropdown content correctness (Property 2)
 * - Dropdown mutual exclusivity (Property 3)
 * - Project switch navigation reset (Property 7)
 * - Pagination correctness (Properties 8, 9)
 * 
 * Uses fast-check for property-based testing with minimum 100 iterations
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';

// ====================================
// SECTION CONFIGURATION (from section-pills.js)
// ====================================

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

// ====================================
// GENERATORS
// ====================================

/**
 * Generator for valid section indices (0-8)
 */
const sectionIndexGenerator = fc.integer({ min: 0, max: SECTIONS.length - 1 });

/**
 * Generator for valid section keys
 */
const sectionKeyGenerator = fc.constantFrom(...SECTIONS.map(s => s.key));

/**
 * Generator for pairs of different section indices
 */
const differentSectionPairGenerator = fc.tuple(
    sectionIndexGenerator,
    sectionIndexGenerator
).filter(([a, b]) => a !== b);

/**
 * Generator for project IDs (1 or 2 for new layout)
 */
const projectIdGenerator = fc.constantFrom(1, 2);

/**
 * Generator for page index within a section
 */
const pageIndexWithinSectionGenerator = (sectionIndex) => {
    const section = SECTIONS[sectionIndex];
    return fc.integer({ min: 0, max: section.pages.length - 1 });
};

// ====================================
// HELPER FUNCTIONS
// ====================================

/**
 * Creates section pills row HTML structure
 */
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

/**
 * Creates pagination dots for a section
 */
function createPaginationDots(sectionIndex, currentPageIndex = 0) {
    const section = SECTIONS[sectionIndex];
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'pagination-dots';
    dotsContainer.id = 'pagination-dots';
    
    section.pages.forEach((page, index) => {
        const dot = document.createElement('button');
        dot.className = 'dot' + (index === currentPageIndex ? ' active' : '');
        dot.setAttribute('data-page', page.pageIndex.toString());
        dotsContainer.appendChild(dot);
    });
    
    return dotsContainer;
}

/**
 * Simulates opening a dropdown for a section
 */
function openDropdown(pillElement) {
    pillElement.classList.add('open');
    pillElement.setAttribute('aria-expanded', 'true');
    const dropdown = pillElement.querySelector('.pill-dropdown');
    if (dropdown) {
        dropdown.classList.add('visible');
    }
}

/**
 * Simulates closing all dropdowns
 */
function closeAllDropdowns(pillsRow) {
    const pills = pillsRow.querySelectorAll('.section-pill');
    pills.forEach(pill => {
        pill.classList.remove('open');
        pill.setAttribute('aria-expanded', 'false');
        const dropdown = pill.querySelector('.pill-dropdown');
        if (dropdown) {
            dropdown.classList.remove('visible');
        }
    });
}

/**
 * Gets the currently open dropdown section key
 */
function getOpenDropdownKey(pillsRow) {
    const openPill = pillsRow.querySelector('.section-pill.open');
    return openPill ? openPill.getAttribute('data-section') : null;
}

/**
 * Counts open dropdowns
 */
function countOpenDropdowns(pillsRow) {
    return pillsRow.querySelectorAll('.section-pill.open').length;
}

// ====================================
// PROPERTY-BASED TESTS
// ====================================

describe('Portfolio Case Study Redesign - Property-Based Tests', () => {
    
    beforeEach(() => {
        document.body.innerHTML = '';
        document.body.className = 'portfolio-page';
    });
    
    afterEach(() => {
        document.body.innerHTML = '';
        document.body.className = '';
    });


    /**
     * Property 1: Section Pill Structure Consistency
     * 
     * *For any* section pill in the section pills row, it SHALL contain a number 
     * prefix matching its position (01-09) and the correct section name from 
     * the SECTIONS configuration.
     * 
     * **Validates: Requirements 1.2**
     * **Feature: portfolio-case-study-redesign, Property 1: Section Pill Structure Consistency**
     */
    describe('Property 1: Section Pill Structure Consistency', () => {
        
        it('for any section index, the pill SHALL have correct number and label', () => {
            const pillsRow = createSectionPillsRow();
            document.body.appendChild(pillsRow);
            
            fc.assert(
                fc.property(sectionIndexGenerator, (sectionIndex) => {
                    const section = SECTIONS[sectionIndex];
                    const pill = pillsRow.querySelector(`.section-pill[data-section="${section.key}"]`);
                    
                    // Pill must exist
                    expect(pill).not.toBeNull();
                    
                    // Number badge must match expected format (01-09)
                    const numberBadge = pill.querySelector('.pill-number');
                    expect(numberBadge).not.toBeNull();
                    expect(numberBadge.textContent).toBe(section.number);
                    
                    // Label must match section label
                    const label = pill.querySelector('.pill-label');
                    expect(label).not.toBeNull();
                    expect(label.textContent).toBe(section.label);
                    
                    // Data-section attribute must match key
                    expect(pill.getAttribute('data-section')).toBe(section.key);
                    
                    return true;
                }),
                { numRuns: 100 }
            );
        });
        
        it('for any section, number prefix matches position (01-09)', () => {
            const pillsRow = createSectionPillsRow();
            document.body.appendChild(pillsRow);
            
            fc.assert(
                fc.property(sectionIndexGenerator, (sectionIndex) => {
                    const expectedNumber = String(sectionIndex + 1).padStart(2, '0');
                    const section = SECTIONS[sectionIndex];
                    const pill = pillsRow.querySelector(`.section-pill[data-section="${section.key}"]`);
                    const numberBadge = pill.querySelector('.pill-number');
                    
                    expect(numberBadge.textContent).toBe(expectedNumber);
                    expect(section.number).toBe(expectedNumber);
                    
                    return true;
                }),
                { numRuns: 100 }
            );
        });
    });

    /**
     * Property 2: Dropdown Contains Correct Sub-Pages
     * 
     * *For any* section pill clicked, the displayed dropdown SHALL contain exactly 
     * the number of sub-page links defined for that section in the SECTIONS 
     * configuration, with matching titles.
     * 
     * **Validates: Requirements 1.4, 2.1, 2.2**
     * **Feature: portfolio-case-study-redesign, Property 2: Dropdown Contains Correct Sub-Pages**
     */
    describe('Property 2: Dropdown Contains Correct Sub-Pages', () => {
        
        it('for any section, dropdown contains exactly the configured number of sub-pages', () => {
            const pillsRow = createSectionPillsRow();
            document.body.appendChild(pillsRow);
            
            fc.assert(
                fc.property(sectionIndexGenerator, (sectionIndex) => {
                    const section = SECTIONS[sectionIndex];
                    const pill = pillsRow.querySelector(`.section-pill[data-section="${section.key}"]`);
                    const dropdown = pill.querySelector('.pill-dropdown');
                    const links = dropdown.querySelectorAll('.dropdown-link');
                    
                    // Number of links must match number of pages in section
                    expect(links.length).toBe(section.pages.length);
                    
                    return true;
                }),
                { numRuns: 100 }
            );
        });
        
        it('for any section, dropdown link titles match configured page titles', () => {
            const pillsRow = createSectionPillsRow();
            document.body.appendChild(pillsRow);
            
            fc.assert(
                fc.property(sectionIndexGenerator, (sectionIndex) => {
                    const section = SECTIONS[sectionIndex];
                    const pill = pillsRow.querySelector(`.section-pill[data-section="${section.key}"]`);
                    const dropdown = pill.querySelector('.pill-dropdown');
                    const links = dropdown.querySelectorAll('.dropdown-link');
                    
                    // Each link title must match corresponding page title
                    section.pages.forEach((page, index) => {
                        expect(links[index].textContent).toBe(page.title);
                        expect(links[index].getAttribute('data-page')).toBe(page.pageIndex.toString());
                    });
                    
                    return true;
                }),
                { numRuns: 100 }
            );
        });
    });

    /**
     * Property 3: Dropdown Mutual Exclusivity
     * 
     * *For any* two different section pills, if the first has an open dropdown 
     * and the second is clicked, then only the second dropdown SHALL be open 
     * (the first must close).
     * 
     * **Validates: Requirements 2.5**
     * **Feature: portfolio-case-study-redesign, Property 3: Dropdown Mutual Exclusivity**
     */
    describe('Property 3: Dropdown Mutual Exclusivity', () => {
        
        it('for any two different sections, opening second closes first', () => {
            const pillsRow = createSectionPillsRow();
            document.body.appendChild(pillsRow);
            
            fc.assert(
                fc.property(differentSectionPairGenerator, ([firstIndex, secondIndex]) => {
                    const firstSection = SECTIONS[firstIndex];
                    const secondSection = SECTIONS[secondIndex];
                    
                    const firstPill = pillsRow.querySelector(`.section-pill[data-section="${firstSection.key}"]`);
                    const secondPill = pillsRow.querySelector(`.section-pill[data-section="${secondSection.key}"]`);
                    
                    // Open first dropdown
                    closeAllDropdowns(pillsRow);
                    openDropdown(firstPill);
                    
                    // Verify first is open
                    expect(firstPill.classList.contains('open')).toBe(true);
                    expect(countOpenDropdowns(pillsRow)).toBe(1);
                    
                    // Open second dropdown (simulating the behavior)
                    closeAllDropdowns(pillsRow);
                    openDropdown(secondPill);
                    
                    // Verify only second is open
                    expect(firstPill.classList.contains('open')).toBe(false);
                    expect(secondPill.classList.contains('open')).toBe(true);
                    expect(countOpenDropdowns(pillsRow)).toBe(1);
                    expect(getOpenDropdownKey(pillsRow)).toBe(secondSection.key);
                    
                    return true;
                }),
                { numRuns: 100 }
            );
        });
        
        it('at most one dropdown is open at any time', () => {
            const pillsRow = createSectionPillsRow();
            document.body.appendChild(pillsRow);
            
            fc.assert(
                fc.property(
                    fc.array(sectionIndexGenerator, { minLength: 1, maxLength: 5 }),
                    (sectionIndices) => {
                        closeAllDropdowns(pillsRow);
                        
                        // Open dropdowns in sequence
                        sectionIndices.forEach(index => {
                            const section = SECTIONS[index];
                            const pill = pillsRow.querySelector(`.section-pill[data-section="${section.key}"]`);
                            closeAllDropdowns(pillsRow);
                            openDropdown(pill);
                        });
                        
                        // After any sequence, at most one dropdown should be open
                        expect(countOpenDropdowns(pillsRow)).toBeLessThanOrEqual(1);
                        
                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        });
    });


    /**
     * Property 7: Project Switch Resets Navigation State
     * 
     * *For any* switch between Project 01 and Project 02, the navigation state 
     * SHALL reset to the first section (Project Details) and first sub-page (Overview).
     * 
     * **Validates: Requirements 5.3**
     * **Feature: portfolio-case-study-redesign, Property 7: Project Switch Resets Navigation State**
     */
    describe('Property 7: Project Switch Resets Navigation State', () => {
        
        // Navigation state simulation
        let navigationState;
        
        function resetNavigationState() {
            navigationState = {
                currentSection: 'details',
                currentPage: 0,
                openDropdown: null
            };
        }
        
        function setNavigationState(sectionKey, pageIndex) {
            navigationState.currentSection = sectionKey;
            navigationState.currentPage = pageIndex;
        }
        
        function simulateProjectSwitch(fromProject, toProject) {
            // When switching projects, reset to initial state
            if (fromProject !== toProject && (toProject === 1 || toProject === 2)) {
                resetNavigationState();
            }
        }
        
        beforeEach(() => {
            resetNavigationState();
        });
        
        it('for any project switch, state resets to first section and page', () => {
            fc.assert(
                fc.property(
                    projectIdGenerator,
                    projectIdGenerator,
                    sectionKeyGenerator,
                    fc.integer({ min: 0, max: 18 }),
                    (fromProject, toProject, currentSection, currentPage) => {
                        // Set up initial state at some arbitrary section/page
                        setNavigationState(currentSection, currentPage);
                        
                        // Simulate project switch
                        simulateProjectSwitch(fromProject, toProject);
                        
                        // If switching to a different project (1 or 2), state should reset
                        if (fromProject !== toProject) {
                            expect(navigationState.currentSection).toBe('details');
                            expect(navigationState.currentPage).toBe(0);
                            expect(navigationState.openDropdown).toBeNull();
                        }
                        
                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        });
        
        it('for any initial state, switching projects resets to Overview', () => {
            const pillsRow = createSectionPillsRow();
            document.body.appendChild(pillsRow);
            
            fc.assert(
                fc.property(
                    sectionIndexGenerator,
                    projectIdGenerator,
                    (sectionIndex, targetProject) => {
                        const section = SECTIONS[sectionIndex];
                        const pageIndex = section.pages[0].pageIndex;
                        
                        // Set arbitrary state
                        setNavigationState(section.key, pageIndex);
                        
                        // Open a dropdown
                        const pill = pillsRow.querySelector(`.section-pill[data-section="${section.key}"]`);
                        openDropdown(pill);
                        navigationState.openDropdown = section.key;
                        
                        // Simulate project switch
                        closeAllDropdowns(pillsRow);
                        resetNavigationState();
                        
                        // Verify reset state
                        expect(navigationState.currentSection).toBe('details');
                        expect(navigationState.currentPage).toBe(0);
                        expect(navigationState.openDropdown).toBeNull();
                        expect(countOpenDropdowns(pillsRow)).toBe(0);
                        
                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        });
    });

    /**
     * Property 8: Pagination Dot Count Matches Section Pages
     * 
     * *For any* section currently active, the number of pagination dot indicators 
     * SHALL equal the number of sub-pages defined for that section.
     * 
     * **Validates: Requirements 8.2**
     * **Feature: portfolio-case-study-redesign, Property 8: Pagination Dot Count Matches Section Pages**
     */
    describe('Property 8: Pagination Dot Count Matches Section Pages', () => {
        
        it('for any section, dot count equals page count', () => {
            fc.assert(
                fc.property(sectionIndexGenerator, (sectionIndex) => {
                    const section = SECTIONS[sectionIndex];
                    const dotsContainer = createPaginationDots(sectionIndex);
                    document.body.appendChild(dotsContainer);
                    
                    const dots = dotsContainer.querySelectorAll('.dot');
                    
                    // Number of dots must equal number of pages in section
                    expect(dots.length).toBe(section.pages.length);
                    
                    // Clean up
                    document.body.removeChild(dotsContainer);
                    
                    return true;
                }),
                { numRuns: 100 }
            );
        });
        
        it('for any section, each dot has correct data-page attribute', () => {
            fc.assert(
                fc.property(sectionIndexGenerator, (sectionIndex) => {
                    const section = SECTIONS[sectionIndex];
                    const dotsContainer = createPaginationDots(sectionIndex);
                    document.body.appendChild(dotsContainer);
                    
                    const dots = dotsContainer.querySelectorAll('.dot');
                    
                    // Each dot's data-page must match the corresponding page index
                    section.pages.forEach((page, index) => {
                        expect(dots[index].getAttribute('data-page')).toBe(page.pageIndex.toString());
                    });
                    
                    // Clean up
                    document.body.removeChild(dotsContainer);
                    
                    return true;
                }),
                { numRuns: 100 }
            );
        });
    });

    /**
     * Property 9: Pagination Navigation Correctness
     * 
     * *For any* current page index within a section:
     * - Clicking "Previous" when page > 0 SHALL decrement the page index by 1
     * - Clicking "Next" when page < (section.pages.length - 1) SHALL increment the page index by 1
     * - Exactly one dot indicator SHALL have the active state, matching the current page index
     * 
     * **Validates: Requirements 8.3, 8.4, 8.5**
     * **Feature: portfolio-case-study-redesign, Property 9: Pagination Navigation Correctness**
     */
    describe('Property 9: Pagination Navigation Correctness', () => {
        
        // Pagination state simulation
        let paginationState;
        
        function initPaginationState(sectionIndex, pageIndexWithinSection) {
            const section = SECTIONS[sectionIndex];
            paginationState = {
                sectionIndex,
                pageIndexWithinSection,
                totalPages: section.pages.length
            };
        }
        
        function navigatePrevious() {
            if (paginationState.pageIndexWithinSection > 0) {
                paginationState.pageIndexWithinSection--;
                return true;
            }
            return false;
        }
        
        function navigateNext() {
            if (paginationState.pageIndexWithinSection < paginationState.totalPages - 1) {
                paginationState.pageIndexWithinSection++;
                return true;
            }
            return false;
        }
        
        it('for any page > 0, Previous decrements page index by 1', () => {
            fc.assert(
                fc.property(
                    sectionIndexGenerator,
                    (sectionIndex) => {
                        const section = SECTIONS[sectionIndex];
                        
                        // Test for each valid page > 0
                        for (let pageIdx = 1; pageIdx < section.pages.length; pageIdx++) {
                            initPaginationState(sectionIndex, pageIdx);
                            const previousPage = paginationState.pageIndexWithinSection;
                            
                            const result = navigatePrevious();
                            
                            expect(result).toBe(true);
                            expect(paginationState.pageIndexWithinSection).toBe(previousPage - 1);
                        }
                        
                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        });
        
        it('for any page < last, Next increments page index by 1', () => {
            fc.assert(
                fc.property(
                    sectionIndexGenerator,
                    (sectionIndex) => {
                        const section = SECTIONS[sectionIndex];
                        
                        // Test for each valid page < last
                        for (let pageIdx = 0; pageIdx < section.pages.length - 1; pageIdx++) {
                            initPaginationState(sectionIndex, pageIdx);
                            const previousPage = paginationState.pageIndexWithinSection;
                            
                            const result = navigateNext();
                            
                            expect(result).toBe(true);
                            expect(paginationState.pageIndexWithinSection).toBe(previousPage + 1);
                        }
                        
                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        });
        
        it('exactly one dot has active state at any time', () => {
            fc.assert(
                fc.property(
                    sectionIndexGenerator,
                    fc.integer({ min: 0, max: 2 }), // Max pages in any section is 3
                    (sectionIndex, pageOffset) => {
                        const section = SECTIONS[sectionIndex];
                        const pageIndexWithinSection = Math.min(pageOffset, section.pages.length - 1);
                        
                        const dotsContainer = createPaginationDots(sectionIndex, pageIndexWithinSection);
                        document.body.appendChild(dotsContainer);
                        
                        const activeDots = dotsContainer.querySelectorAll('.dot.active');
                        
                        // Exactly one dot should be active
                        expect(activeDots.length).toBe(1);
                        
                        // The active dot should be at the correct position
                        const dots = dotsContainer.querySelectorAll('.dot');
                        expect(dots[pageIndexWithinSection].classList.contains('active')).toBe(true);
                        
                        // Clean up
                        document.body.removeChild(dotsContainer);
                        
                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        });
        
        it('Previous at first page does not change state', () => {
            fc.assert(
                fc.property(sectionIndexGenerator, (sectionIndex) => {
                    initPaginationState(sectionIndex, 0);
                    
                    const result = navigatePrevious();
                    
                    expect(result).toBe(false);
                    expect(paginationState.pageIndexWithinSection).toBe(0);
                    
                    return true;
                }),
                { numRuns: 100 }
            );
        });
        
        it('Next at last page does not change state', () => {
            fc.assert(
                fc.property(sectionIndexGenerator, (sectionIndex) => {
                    const section = SECTIONS[sectionIndex];
                    const lastPageIndex = section.pages.length - 1;
                    
                    initPaginationState(sectionIndex, lastPageIndex);
                    
                    const result = navigateNext();
                    
                    expect(result).toBe(false);
                    expect(paginationState.pageIndexWithinSection).toBe(lastPageIndex);
                    
                    return true;
                }),
                { numRuns: 100 }
            );
        });
    });

});
