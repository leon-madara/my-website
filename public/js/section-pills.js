/**
 * Section Pills Navigation System
 * Implements horizontal section pills with dropdowns for portfolio case study navigation
 * 
 * Requirements: 1.4, 1.5, 2.1, 2.3, 2.4, 2.5, 2.6
 */

// ====================================
// SECTION CONFIGURATION DATA STRUCTURE
// Requirement 2.6: Maintain existing sub-page structure
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
// SECTION PILLS STATE
// ====================================

const SectionPillsState = {
    currentSection: 'details',
    currentPage: 0,
    openDropdown: null  // Currently open dropdown section key
};

// ====================================
// DOM CACHE FOR SECTION PILLS
// ====================================

const SectionPillsDOM = {
    pillsRow: null,
    pills: null,
    dropdowns: null,
    dropdownLinks: null
};

// ====================================
// INITIALIZATION
// ====================================

/**
 * Initialize the section pills navigation system
 */
function initSectionPills() {
    console.log('Initializing section pills navigation...');
    
    // Cache DOM elements
    cacheSectionPillsDOM();
    
    if (!SectionPillsDOM.pillsRow) {
        console.warn('Section pills row not found, skipping initialization');
        return;
    }
    
    // Setup event listeners
    setupPillClickListeners();
    setupDropdownLinkListeners();
    setupOutsideClickListener();
    
    // Set initial active state
    updateActivePill(SectionPillsState.currentSection);
    
    console.log('Section pills navigation initialized');
}

/**
 * Cache section pills DOM elements
 */
function cacheSectionPillsDOM() {
    SectionPillsDOM.pillsRow = document.querySelector('.section-pills-row');
    SectionPillsDOM.pills = document.querySelectorAll('.section-pill');
    SectionPillsDOM.dropdowns = document.querySelectorAll('.pill-dropdown');
    SectionPillsDOM.dropdownLinks = document.querySelectorAll('.pill-dropdown .dropdown-link');
    
    console.log('Section pills DOM cached:', {
        pillsRow: !!SectionPillsDOM.pillsRow,
        pills: SectionPillsDOM.pills.length,
        dropdowns: SectionPillsDOM.dropdowns.length,
        dropdownLinks: SectionPillsDOM.dropdownLinks.length
    });
}

// ====================================
// DROPDOWN TOGGLE FUNCTIONALITY
// Requirements: 1.4, 2.1, 2.4, 2.5
// ====================================

/**
 * Setup click listeners for section pills
 * Requirement 1.4: Click to display dropdown
 * Requirement 2.5: Close previous dropdown when opening new one
 */
function setupPillClickListeners() {
    SectionPillsDOM.pills.forEach(pill => {
        pill.addEventListener('click', function(e) {
            // Prevent click from propagating to document (which would close dropdown)
            e.stopPropagation();
            
            const sectionKey = this.dataset.section;
            console.log(`Section pill clicked: ${sectionKey}`);
            
            // Toggle dropdown for this pill
            toggleDropdown(sectionKey, this);
        });
    });
}

/**
 * Toggle dropdown for a section pill
 * @param {string} sectionKey - The section key
 * @param {HTMLElement} pillElement - The pill button element
 */
function toggleDropdown(sectionKey, pillElement) {
    const isCurrentlyOpen = SectionPillsState.openDropdown === sectionKey;
    
    // Close all dropdowns first (Requirement 2.5)
    closeAllDropdowns();
    
    // If this dropdown wasn't open, open it
    if (!isCurrentlyOpen) {
        openDropdown(sectionKey, pillElement);
    }
}

/**
 * Open a dropdown for a section
 * Requirement 2.1: Display dropdown below clicked tab
 * @param {string} sectionKey - The section key
 * @param {HTMLElement} pillElement - The pill button element
 */
function openDropdown(sectionKey, pillElement) {
    const dropdown = pillElement.querySelector('.pill-dropdown');
    
    if (!dropdown) {
        console.warn(`No dropdown found for section: ${sectionKey}`);
        return;
    }
    
    // Update state
    SectionPillsState.openDropdown = sectionKey;
    
    // Add open class to pill
    pillElement.classList.add('open');
    pillElement.setAttribute('aria-expanded', 'true');
    
    // Show dropdown
    dropdown.classList.add('visible');
    
    console.log(`Dropdown opened: ${sectionKey}`);
}

/**
 * Close all open dropdowns
 * Requirement 2.4: Close dropdown when clicking outside
 */
function closeAllDropdowns() {
    SectionPillsDOM.pills.forEach(pill => {
        pill.classList.remove('open');
        pill.setAttribute('aria-expanded', 'false');
        
        const dropdown = pill.querySelector('.pill-dropdown');
        if (dropdown) {
            dropdown.classList.remove('visible');
        }
    });
    
    SectionPillsState.openDropdown = null;
}

/**
 * Setup listener to close dropdowns when clicking outside
 * Requirement 2.4: Close dropdown when clicking outside
 */
function setupOutsideClickListener() {
    document.addEventListener('click', function(e) {
        // Check if click is outside any section pill
        const clickedPill = e.target.closest('.section-pill');
        
        if (!clickedPill && SectionPillsState.openDropdown !== null) {
            console.log('Click outside detected, closing dropdowns');
            closeAllDropdowns();
        }
    });
    
    // Also close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && SectionPillsState.openDropdown !== null) {
            console.log('Escape pressed, closing dropdowns');
            closeAllDropdowns();
        }
    });
}

// ====================================
// SUB-PAGE NAVIGATION
// Requirements: 2.3, 1.5
// ====================================

/**
 * Setup click listeners for dropdown links
 * Requirement 2.3: Navigate to content and close dropdown
 */
function setupDropdownLinkListeners() {
    SectionPillsDOM.dropdownLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const pageIndex = parseInt(this.dataset.page);
            const pill = this.closest('.section-pill');
            const sectionKey = pill ? pill.dataset.section : null;
            
            console.log(`Dropdown link clicked: section=${sectionKey}, page=${pageIndex}`);
            
            // Navigate to the page
            navigateToSectionPage(sectionKey, pageIndex, this);
        });
    });
}

/**
 * Navigate to a specific section and page
 * @param {string} sectionKey - The section key
 * @param {number} pageIndex - The page index
 * @param {HTMLElement} linkElement - The clicked link element
 */
function navigateToSectionPage(sectionKey, pageIndex, linkElement) {
    // Update state
    SectionPillsState.currentSection = sectionKey;
    SectionPillsState.currentPage = pageIndex;
    
    // Close dropdown (Requirement 2.3)
    closeAllDropdowns();
    
    // Update active pill styling (Requirement 1.5)
    updateActivePill(sectionKey);
    
    // Update active dropdown link
    updateActiveDropdownLink(linkElement);
    
    // Sync with existing portfolio navigation system
    syncWithPortfolioNavigation(sectionKey, pageIndex);
    
    // Update content card if it exists
    updateContentCard(sectionKey, pageIndex);
    
    console.log(`Navigated to section: ${sectionKey}, page: ${pageIndex}`);
}

/**
 * Update active pill styling
 * Requirement 1.5: Apply distinct styling to active section
 * @param {string} sectionKey - The active section key
 */
function updateActivePill(sectionKey) {
    SectionPillsDOM.pills.forEach(pill => {
        if (pill.dataset.section === sectionKey) {
            pill.classList.add('active');
        } else {
            pill.classList.remove('active');
        }
    });
}

/**
 * Update active dropdown link styling
 * @param {HTMLElement} activeLink - The active link element
 */
function updateActiveDropdownLink(activeLink) {
    // Remove active from all dropdown links
    SectionPillsDOM.dropdownLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active to the clicked link
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

/**
 * Sync with existing portfolio navigation system
 * @param {string} sectionKey - The section key
 * @param {number} pageIndex - The page index
 */
function syncWithPortfolioNavigation(sectionKey, pageIndex) {
    // Update global PortfolioState if it exists
    if (typeof PortfolioState !== 'undefined') {
        PortfolioState.currentPage = pageIndex;
    }
    
    // Scroll to page using existing function if available
    if (typeof scrollToPage === 'function') {
        scrollToPage(pageIndex, true);
    }
    
    // Sync accordion if it exists
    if (typeof syncAccordionWithPage === 'function') {
        syncAccordionWithPage(pageIndex);
    }
    
    // Play sound if available
    if (typeof soundManager !== 'undefined' && soundManager) {
        soundManager.playPageFlip();
    }
}

/**
 * Update the content card with current section/page info
 * @param {string} sectionKey - The section key
 * @param {number} pageIndex - The page index
 */
function updateContentCard(sectionKey, pageIndex) {
    // Find section config
    const section = SECTIONS.find(s => s.key === sectionKey);
    if (!section) return;
    
    // Find page within section
    const page = section.pages.find(p => p.pageIndex === pageIndex);
    if (!page) return;
    
    // Update section label
    const sectionLabel = document.getElementById('section-label');
    if (sectionLabel) {
        sectionLabel.textContent = section.label.toUpperCase();
    }
    
    // Update page title
    const pageTitle = document.getElementById('card-page-title');
    if (pageTitle) {
        pageTitle.textContent = page.title;
    }
    
    // Sync with content card module if available
    if (typeof syncContentCardWithNavigation === 'function') {
        syncContentCardWithNavigation(sectionKey, pageIndex);
    }
    
    // Update pagination dots
    updatePaginationDots(section, pageIndex);
}

/**
 * Update pagination dots for current section
 * @param {Object} section - The section configuration
 * @param {number} currentPageIndex - The current page index
 */
function updatePaginationDots(section, currentPageIndex) {
    const dotsContainer = document.getElementById('pagination-dots');
    if (!dotsContainer) return;
    
    // Clear existing dots
    dotsContainer.innerHTML = '';
    
    // Create dots for each page in the section
    section.pages.forEach((page, index) => {
        const dot = document.createElement('button');
        dot.className = 'dot';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('data-page', page.pageIndex);
        dot.setAttribute('aria-label', `Page ${index + 1} of ${section.pages.length}`);
        
        if (page.pageIndex === currentPageIndex) {
            dot.classList.add('active');
            dot.setAttribute('aria-selected', 'true');
        } else {
            dot.setAttribute('aria-selected', 'false');
        }
        
        // Add click handler for dot
        dot.addEventListener('click', function() {
            navigateToSectionPage(section.key, page.pageIndex, null);
        });
        
        dotsContainer.appendChild(dot);
    });
}

// ====================================
// UTILITY FUNCTIONS
// ====================================

/**
 * Get section configuration by key
 * @param {string} sectionKey - The section key
 * @returns {Object|null} The section configuration or null
 */
function getSectionByKey(sectionKey) {
    return SECTIONS.find(s => s.key === sectionKey) || null;
}

/**
 * Get section containing a specific page index
 * @param {number} pageIndex - The page index
 * @returns {Object|null} The section configuration or null
 */
function getSectionByPageIndex(pageIndex) {
    return SECTIONS.find(section => 
        section.pages.some(page => page.pageIndex === pageIndex)
    ) || null;
}

/**
 * Reset section pills to initial state (first section, first page)
 * Used when switching projects
 */
function resetSectionPills() {
    SectionPillsState.currentSection = 'details';
    SectionPillsState.currentPage = 0;
    SectionPillsState.openDropdown = null;
    
    closeAllDropdowns();
    updateActivePill('details');
    
    // Update active link in first section's dropdown
    const firstPill = document.querySelector('.section-pill[data-section="details"]');
    if (firstPill) {
        const firstLink = firstPill.querySelector('.dropdown-link[data-page="0"]');
        if (firstLink) {
            updateActiveDropdownLink(firstLink);
        }
    }
    
    // Update content card
    const firstSection = SECTIONS[0];
    if (firstSection) {
        updateContentCard('details', 0);
    }
    
    console.log('Section pills reset to initial state');
}

// ====================================
// INITIALIZE ON DOM READY
// ====================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize section pills after a short delay to ensure other scripts are loaded
    setTimeout(initSectionPills, 100);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SECTIONS,
        SectionPillsState,
        initSectionPills,
        resetSectionPills,
        getSectionByKey,
        getSectionByPageIndex,
        navigateToSectionPage,
        closeAllDropdowns
    };
}

console.log('Section pills module loaded');
