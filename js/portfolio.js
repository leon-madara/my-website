/**
 * Portfolio Page - Interactive Case Study System
 * Phase 1: Basic Structure Setup
 */

// ====================================
// GLOBAL STATE
// ====================================

const PortfolioState = {
    currentProject: 2, // Default to project 2 (Delivah)
    currentPage: 0,
    isAnimating: false,
    soundEnabled: true,
    soundVolume: 0.6
};

// ====================================
// DOM ELEMENTS
// ====================================

const DOM = {
    // Project toggle buttons
    projectToggles: null,

    // Accordion elements
    accordionItems: null,
    accordionHeaders: null,
    accordionLinks: null,

    // Horizontal pages
    horizontalPages: null,
    contentPages: null,

    // Page indicators
    pageDots: null,

    // Containers
    contentWrapper: null
};

// ====================================
// INITIALIZATION
// ====================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio page loaded - Phase 1');

    // Cache DOM elements
    cacheDOMElements();

    // Initialize components (will be fully implemented in later phases)
    initializeProjectToggle();
    initializeAccordion();
    initializeHorizontalScroll();
    initializePageIndicators();

    // Setup event listeners
    setupEventListeners();

    console.log('Portfolio initialization complete');
});

// ====================================
// DOM CACHING
// ====================================

function cacheDOMElements() {
    // Project toggles
    DOM.projectToggles = document.querySelectorAll('.project-toggle-btn');

    // Accordion
    DOM.accordionItems = document.querySelectorAll('.accordion-item');
    DOM.accordionHeaders = document.querySelectorAll('.accordion-header');
    DOM.accordionLinks = document.querySelectorAll('.accordion-link');

    // Horizontal pages
    DOM.horizontalPages = document.querySelector('.horizontal-pages');
    DOM.contentPages = document.querySelectorAll('.content-page');

    // Page indicators
    DOM.pageDots = document.querySelectorAll('.page-dot');

    // Containers
    DOM.contentWrapper = document.querySelector('.content-wrapper');

    console.log('DOM elements cached:', {
        projectToggles: DOM.projectToggles.length,
        accordionItems: DOM.accordionItems.length,
        contentPages: DOM.contentPages.length,
        pageDots: DOM.pageDots.length
    });
}

// ====================================
// PROJECT TOGGLE INITIALIZATION
// ====================================

function initializeProjectToggle() {
    console.log('Initializing project toggle...');

    // Set initial active state (project 2 is default)
    updateProjectToggleUI(PortfolioState.currentProject);
}

function updateProjectToggleUI(projectNumber) {
    DOM.projectToggles.forEach(btn => {
        const btnProject = parseInt(btn.dataset.project);
        if (btnProject === projectNumber) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// ====================================
// ACCORDION INITIALIZATION
// ====================================

function initializeAccordion() {
    console.log('Initializing accordion...');

    // First item is expanded by default
    // This is already set in HTML, just verify
    const firstItem = DOM.accordionItems[0];
    if (firstItem && !firstItem.classList.contains('active')) {
        firstItem.classList.add('active');
    }
}

// ====================================
// HORIZONTAL SCROLL INITIALIZATION
// ====================================

function initializeHorizontalScroll() {
    console.log('Initializing horizontal scroll...');

    // Ensure we start at the first page
    if (DOM.horizontalPages) {
        DOM.horizontalPages.scrollLeft = 0;
    }
}

// ====================================
// PAGE INDICATORS INITIALIZATION
// ====================================

function initializePageIndicators() {
    console.log('Initializing page indicators...');

    // First dot is active by default
    updatePageIndicators(0);
}

function updatePageIndicators(pageIndex) {
    DOM.pageDots.forEach((dot, index) => {
        if (index === pageIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// ====================================
// EVENT LISTENERS SETUP
// ====================================

function setupEventListeners() {
    console.log('Setting up event listeners...');

    // Project toggle listeners
    setupProjectToggleListeners();

    // Accordion listeners
    setupAccordionListeners();

    // Page indicator listeners
    setupPageIndicatorListeners();

    // Keyboard navigation
    setupKeyboardNavigation();

    // Scroll detection (for page indicators sync)
    setupScrollDetection();
}

// ====================================
// PROJECT TOGGLE LISTENERS
// ====================================

function setupProjectToggleListeners() {
    DOM.projectToggles.forEach(btn => {
        btn.addEventListener('click', function() {
            const projectNumber = parseInt(this.dataset.project);
            console.log(`Project toggle clicked: ${projectNumber}`);

            // Prevent action if already active or animating
            if (projectNumber === PortfolioState.currentProject || PortfolioState.isAnimating) {
                return;
            }

            // Update state
            PortfolioState.currentProject = projectNumber;

            // Update UI
            updateProjectToggleUI(projectNumber);

            // TODO: Phase 4 - Switch project content with animation
            console.log('Project switch will be implemented in Phase 4');
        });
    });
}

// ====================================
// ACCORDION LISTENERS
// ====================================

function setupAccordionListeners() {
    // Header click to expand/collapse
    DOM.accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordionItem = this.closest('.accordion-item');
            const isActive = accordionItem.classList.contains('active');

            console.log(`Accordion header clicked: ${accordionItem.dataset.chapter}, currently active: ${isActive}`);

            // Toggle active state
            if (isActive) {
                accordionItem.classList.remove('active');
                this.setAttribute('aria-expanded', 'false');
            } else {
                accordionItem.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
            }

            // TODO: Phase 2 - Smooth animation and auto-scroll to page
            // TODO: Phase 5 - Play accordion toggle sound
        });
    });

    // Link click to navigate to page
    DOM.accordionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const pageIndex = parseInt(this.dataset.page);
            console.log(`Accordion link clicked: page ${pageIndex}`);

            // Update active link
            updateActiveAccordionLink(this);

            // Scroll to page
            scrollToPage(pageIndex);

            // TODO: Phase 5 - Play page flip sound
        });
    });
}

function updateActiveAccordionLink(activeLink) {
    DOM.accordionLinks.forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// ====================================
// PAGE INDICATOR LISTENERS
// ====================================

function setupPageIndicatorListeners() {
    DOM.pageDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            console.log(`Page dot clicked: ${index}`);
            scrollToPage(index);

            // TODO: Phase 5 - Play page flip sound
        });
    });
}

// ====================================
// KEYBOARD NAVIGATION
// ====================================

function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Arrow left - previous page
        if (e.key === 'ArrowLeft') {
            navigatePage('prev');
        }

        // Arrow right - next page
        if (e.key === 'ArrowRight') {
            navigatePage('next');
        }

        // TODO: Phase 5 - M key to toggle sound
        if (e.key === 'm' || e.key === 'M') {
            console.log('Sound toggle will be implemented in Phase 5');
        }
    });
}

function navigatePage(direction) {
    const maxPage = DOM.contentPages.length - 1;
    let newPage = PortfolioState.currentPage;

    if (direction === 'prev' && newPage > 0) {
        newPage--;
    } else if (direction === 'next' && newPage < maxPage) {
        newPage++;
    } else {
        return; // Can't navigate further
    }

    console.log(`Keyboard navigation: ${direction} to page ${newPage}`);
    scrollToPage(newPage);

    // TODO: Phase 5 - Play page flip sound
}

// ====================================
// SCROLL DETECTION
// ====================================

function setupScrollDetection() {
    if (!DOM.horizontalPages) return;

    let scrollTimeout;

    DOM.horizontalPages.addEventListener('scroll', function() {
        // Clear existing timeout
        clearTimeout(scrollTimeout);

        // Set new timeout to detect scroll end
        scrollTimeout = setTimeout(() => {
            detectCurrentPage();
        }, 150);
    });
}

function detectCurrentPage() {
    if (!DOM.horizontalPages) return;

    const scrollLeft = DOM.horizontalPages.scrollLeft;
    const pageWidth = DOM.horizontalPages.clientWidth;
    const currentPage = Math.round(scrollLeft / pageWidth);

    // Update state if changed
    if (currentPage !== PortfolioState.currentPage) {
        PortfolioState.currentPage = currentPage;
        console.log(`Page changed to: ${currentPage}`);

        // Update page indicators
        updatePageIndicators(currentPage);

        // TODO: Sync with accordion active link
    }
}

// ====================================
// PAGE SCROLLING
// ====================================

function scrollToPage(pageIndex) {
    if (!DOM.horizontalPages || !DOM.contentPages[pageIndex]) {
        console.error(`Cannot scroll to page ${pageIndex}`);
        return;
    }

    const targetPage = DOM.contentPages[pageIndex];
    const scrollLeft = targetPage.offsetLeft;

    console.log(`Scrolling to page ${pageIndex} at offset ${scrollLeft}px`);

    // Smooth scroll to target page
    DOM.horizontalPages.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
    });

    // Update state
    PortfolioState.currentPage = pageIndex;

    // Update page indicators
    updatePageIndicators(pageIndex);
}

// ====================================
// UTILITY FUNCTIONS
// ====================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ====================================
// CONSOLE INFO
// ====================================

console.log(`
╔═══════════════════════════════════════════╗
║   PORTFOLIO PAGE - PHASE 1 LOADED        ║
║   Interactive Case Study System          ║
║   ──────────────────────────────────     ║
║   Status: Structure Complete ✓           ║
║   Next: Phase 2 - Accordion Functionality║
╚═══════════════════════════════════════════╝
`);
