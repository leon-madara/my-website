/**
 * Portfolio Page - Interactive Case Study System
 * Phase 6: Final Polish & Optimization
 */

// ====================================
// SOUND MANAGER
// ====================================

class SoundManager {
    constructor() {
        this.enabled = this.loadPreference();
        this.volume = 0.4; // Lower volume for subtlety
        this.sounds = {};
        this.loadSounds();

        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.enabled = false;
        }
    }

    loadSounds() {
        // Create audio elements for each sound
        // Using data URIs for simple click sounds (will work without external files)

        // Page flip sound (simple click)
        this.sounds.pageFlip = new Audio();
        this.sounds.pageFlip.volume = this.volume;

        // Project switch sound (deeper whoosh)
        this.sounds.projectSwitch = new Audio();
        this.sounds.projectSwitch.volume = this.volume * 0.8;

        // Accordion toggle sound (soft click)
        this.sounds.accordionToggle = new Audio();
        this.sounds.accordionToggle.volume = this.volume * 0.6;

        // Use actual sound files
        this.sounds.pageFlip.src = 'sounds/soundFlipping.mp3';
        this.sounds.projectSwitch.src = 'sounds/lionRoaring.mp3';
        this.sounds.accordionToggle.src = 'sounds/lionRoar.mp3';

        console.log('Sounds loaded (will use external files if available)');
    }

    play(soundName) {
        if (!this.enabled || !this.sounds[soundName]) return;

        // Clone and play to allow overlapping sounds
        const sound = this.sounds[soundName].cloneNode();
        sound.volume = this.volume;

        sound.play().catch(err => {
            // Fail silently if sound file doesn't exist
            console.log(`Sound playback failed for ${soundName}:`, err.message);
        });
    }

    playPageFlip() {
        this.play('pageFlip');
    }

    playProjectSwitch() {
        this.play('projectSwitch');
    }

    playAccordionToggle() {
        this.play('accordionToggle');
    }

    toggle() {
        this.enabled = !this.enabled;
        this.savePreference();
        console.log(`Sound ${this.enabled ? 'enabled' : 'disabled'}`);
        return this.enabled;
    }

    loadPreference() {
        const saved = localStorage.getItem('portfolioSoundEnabled');
        return saved === null ? true : saved === 'true';
    }

    savePreference() {
        localStorage.setItem('portfolioSoundEnabled', this.enabled);
    }

    setVolume(level) {
        this.volume = Math.max(0, Math.min(1, level));
        Object.values(this.sounds).forEach(sound => {
            sound.volume = this.volume;
        });
    }
}

// ====================================
// GLOBAL STATE
// ====================================

const PortfolioState = {
    currentProject: 2, // Default to project 2 (Delivah)
    currentPage: 0,
    isAnimating: false,
    soundEnabled: true,
    soundVolume: 0.6,
    isScrolling: false, // Prevent scroll event loops
    pageToChapterMap: {}, // Maps page index to chapter/subsection

    // Touch/Swipe state
    touchStartX: 0,
    touchStartY: 0,
    touchEndX: 0,
    touchEndY: 0,
    isSwiping: false
};

// Initialize Sound Manager
let soundManager = null;

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
    console.log('Portfolio page loaded');

    // Initialize Sound Manager (Phase 5)
    soundManager = new SoundManager();

    // Cache DOM elements
    cacheDOMElements();

    // Initialize components
    initializeProjectToggle();
    initializeAccordion();
    initializeHorizontalScroll();
    initializePageIndicators();

    // Setup event listeners
    setupEventListeners();

    // Setup advanced scroll features (Phase 3)
    setupTouchGestures();
    setupMouseWheelScroll();

    // Setup sound controls (Phase 5)
    setupSoundControls();

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

    // Build page-to-chapter mapping for auto-sync
    buildPageToChapterMap();
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

            // Start project switch animation
            switchProject(projectNumber);
        });
    });
}

// ====================================
// ACCORDION LISTENERS
// ====================================

function setupAccordionListeners() {
    // Header click to expand/collapse + scroll to first page
    DOM.accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordionItem = this.closest('.accordion-item');
            const isActive = accordionItem.classList.contains('active');

            console.log(`Accordion header clicked: ${accordionItem.dataset.chapter}, currently active: ${isActive}`);

            // Toggle active state
            if (isActive) {
                // Collapse
                accordionItem.classList.remove('active');
                this.setAttribute('aria-expanded', 'false');
            } else {
                // Expand
                accordionItem.classList.add('active');
                this.setAttribute('aria-expanded', 'true');

                // Auto-scroll to first page in this chapter
                const firstLink = accordionItem.querySelector('.accordion-link');
                if (firstLink) {
                    const pageIndex = parseInt(firstLink.dataset.page);

                    // Small delay to allow expansion animation to start
                    setTimeout(() => {
                        updateActiveAccordionLink(firstLink);
                        scrollToPage(pageIndex, true); // true = from accordion
                    }, 100);
                }
            }

            // Play accordion toggle sound
            if (soundManager) {
                soundManager.playAccordionToggle();
            }
        });
    });

    // Link click to navigate to page
    DOM.accordionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const pageIndex = parseInt(this.dataset.page);
            console.log(`Accordion link clicked: page ${pageIndex}`);

            // Ensure parent accordion is expanded
            const accordionItem = this.closest('.accordion-item');
            if (!accordionItem.classList.contains('active')) {
                accordionItem.classList.add('active');
                const header = accordionItem.querySelector('.accordion-header');
                if (header) {
                    header.setAttribute('aria-expanded', 'true');
                }
            }

            // Update active link
            updateActiveAccordionLink(this);

            // Scroll to page
            scrollToPage(pageIndex, true); // true = from accordion

            // Play page flip sound
            if (soundManager) {
                soundManager.playPageFlip();
            }
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

            // Play page flip sound
            if (soundManager) {
                soundManager.playPageFlip();
            }
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

        // M key to toggle sound
        if (e.key === 'm' || e.key === 'M') {
            if (soundManager) {
                const enabled = soundManager.toggle();
                updateSoundControlUI(enabled);
            }
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

    // Play page flip sound
    if (soundManager) {
        soundManager.playPageFlip();
    }
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
    if (!DOM.horizontalPages || PortfolioState.isScrolling) return;

    const scrollLeft = DOM.horizontalPages.scrollLeft;
    const pageWidth = DOM.horizontalPages.clientWidth;
    const currentPage = Math.round(scrollLeft / pageWidth);

    // Update state if changed
    if (currentPage !== PortfolioState.currentPage) {
        PortfolioState.currentPage = currentPage;
        console.log(`Page changed to: ${currentPage}`);

        // Update page indicators
        updatePageIndicators(currentPage);

        // Sync with accordion - auto-expand and highlight
        syncAccordionWithPage(currentPage);
    }
}

// ====================================
// PAGE SCROLLING
// ====================================

function scrollToPage(pageIndex, fromAccordion = false) {
    if (!DOM.horizontalPages || !DOM.contentPages[pageIndex]) {
        console.error(`Cannot scroll to page ${pageIndex}`);
        return;
    }

    // Prevent scroll event loop
    PortfolioState.isScrolling = true;

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

    // Only sync accordion if NOT triggered from accordion
    // (to prevent circular updates)
    if (!fromAccordion) {
        syncAccordionWithPage(pageIndex);
    }

    // Reset scrolling flag after animation completes
    setTimeout(() => {
        PortfolioState.isScrolling = false;
    }, 600); // Match scroll animation duration
}

// ====================================
// PROJECT SWITCHING (Phase 4)
// ====================================

async function switchProject(newProjectNumber) {
    console.log(`Switching from project ${PortfolioState.currentProject} to ${newProjectNumber}`);

    // Set animating flag
    PortfolioState.isAnimating = true;

    // Phase 1: Fade out current content
    await animateProjectExit();

    // Phase 2: Update project data
    PortfolioState.currentProject = newProjectNumber;
    updateProjectToggleUI(newProjectNumber);

    // TODO: Load new project content here
    // For now, we'll just reset to first page
    PortfolioState.currentPage = 0;

    // Phase 3: Scroll to first page instantly (no animation)
    if (DOM.horizontalPages) {
        DOM.horizontalPages.scrollLeft = 0;
    }

    // Reset accordion to first item
    resetAccordionState();

    // Phase 4: Fade in new content
    await animateProjectEnter();

    // Reset animating flag
    PortfolioState.isAnimating = false;

    console.log(`Project switch to ${newProjectNumber} complete`);

    // Play project switch sound
    if (soundManager) {
        soundManager.playProjectSwitch();
    }
}

function animateProjectExit() {
    return new Promise((resolve) => {
        const contentWrapper = DOM.contentWrapper;

        if (!contentWrapper) {
            resolve();
            return;
        }

        // Add exit animation class
        contentWrapper.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        contentWrapper.style.opacity = '0';
        contentWrapper.style.transform = 'scale(0.95) translateX(-30px)';

        setTimeout(resolve, 400);
    });
}

function animateProjectEnter() {
    return new Promise((resolve) => {
        const contentWrapper = DOM.contentWrapper;

        if (!contentWrapper) {
            resolve();
            return;
        }

        // Start from right side
        contentWrapper.style.transform = 'scale(0.95) translateX(30px)';
        contentWrapper.style.opacity = '0';

        // Force reflow
        contentWrapper.offsetHeight;

        // Animate to normal position
        setTimeout(() => {
            contentWrapper.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            contentWrapper.style.opacity = '1';
            contentWrapper.style.transform = 'scale(1) translateX(0)';

            setTimeout(resolve, 500);
        }, 50);
    });
}

function resetAccordionState() {
    // Collapse all accordion items
    DOM.accordionItems.forEach(item => {
        item.classList.remove('active');
        const header = item.querySelector('.accordion-header');
        if (header) {
            header.setAttribute('aria-expanded', 'false');
        }
    });

    // Expand first item
    if (DOM.accordionItems[0]) {
        DOM.accordionItems[0].classList.add('active');
        const header = DOM.accordionItems[0].querySelector('.accordion-header');
        if (header) {
            header.setAttribute('aria-expanded', 'true');
        }
    }

    // Activate first link
    if (DOM.accordionLinks[0]) {
        updateActiveAccordionLink(DOM.accordionLinks[0]);
    }

    // Update page indicators
    updatePageIndicators(0);
}

// ====================================
// TOUCH GESTURES (Phase 3)
// ====================================

function setupTouchGestures() {
    if (!DOM.horizontalPages) return;

    console.log('Setting up touch gestures...');

    DOM.horizontalPages.addEventListener('touchstart', handleTouchStart, { passive: true });
    DOM.horizontalPages.addEventListener('touchmove', handleTouchMove, { passive: false });
    DOM.horizontalPages.addEventListener('touchend', handleTouchEnd, { passive: true });
}

function handleTouchStart(e) {
    PortfolioState.touchStartX = e.touches[0].clientX;
    PortfolioState.touchStartY = e.touches[0].clientY;
    PortfolioState.isSwiping = false;
}

function handleTouchMove(e) {
    if (!PortfolioState.touchStartX || !PortfolioState.touchStartY) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;

    const deltaX = Math.abs(currentX - PortfolioState.touchStartX);
    const deltaY = Math.abs(currentY - PortfolioState.touchStartY);

    // Detect if swiping horizontally (prevent vertical scroll)
    if (deltaX > deltaY && deltaX > 10) {
        PortfolioState.isSwiping = true;
        e.preventDefault(); // Prevent vertical scroll
    }
}

function handleTouchEnd(e) {
    PortfolioState.touchEndX = e.changedTouches[0].clientX;
    PortfolioState.touchEndY = e.changedTouches[0].clientY;

    handleSwipe();

    // Reset
    PortfolioState.touchStartX = 0;
    PortfolioState.touchStartY = 0;
    PortfolioState.isSwiping = false;
}

function handleSwipe() {
    const deltaX = PortfolioState.touchStartX - PortfolioState.touchEndX;
    const deltaY = Math.abs(PortfolioState.touchStartY - PortfolioState.touchEndY);

    // Minimum swipe distance (50px)
    const minSwipeDistance = 50;

    // Ensure horizontal swipe (not vertical)
    if (Math.abs(deltaX) < minSwipeDistance || deltaY > Math.abs(deltaX)) {
        return;
    }

    console.log(`Swipe detected: deltaX = ${deltaX}px`);

    // Swipe left (next page)
    if (deltaX > 0) {
        navigatePage('next');
    }
    // Swipe right (previous page)
    else {
        navigatePage('prev');
    }
}

// ====================================
// MOUSE WHEEL SCROLL (Phase 3)
// ====================================

function setupMouseWheelScroll() {
    if (!DOM.horizontalPages) return;

    console.log('Setting up mouse wheel horizontal scroll...');

    let wheelTimeout;

    DOM.horizontalPages.addEventListener('wheel', function(e) {
        // Only handle horizontal intent or convert vertical to horizontal
        if (Math.abs(e.deltaX) > 0 || Math.abs(e.deltaY) > 0) {
            e.preventDefault();

            // Use deltaY if no horizontal scroll, otherwise use deltaX
            const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

            // Smooth scroll by delta
            this.scrollLeft += delta;

            // Debounce page detection
            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(() => {
                detectCurrentPage();
            }, 150);
        }
    }, { passive: false });
}

// ====================================
// ACCORDION SYNC SYSTEM
// ====================================

function buildPageToChapterMap() {
    // Map each page index to its chapter and link element
    DOM.accordionLinks.forEach(link => {
        const pageIndex = parseInt(link.dataset.page);
        const accordionItem = link.closest('.accordion-item');
        const chapter = accordionItem ? accordionItem.dataset.chapter : null;

        PortfolioState.pageToChapterMap[pageIndex] = {
            chapter: chapter,
            link: link,
            accordionItem: accordionItem
        };
    });

    console.log('Page-to-chapter map built:', PortfolioState.pageToChapterMap);
}

function syncAccordionWithPage(pageIndex) {
    const mapping = PortfolioState.pageToChapterMap[pageIndex];

    if (!mapping) {
        console.warn(`No mapping found for page ${pageIndex}`);
        return;
    }

    console.log(`Syncing accordion with page ${pageIndex}, chapter: ${mapping.chapter}`);

    // Expand the accordion item if not already expanded
    if (mapping.accordionItem && !mapping.accordionItem.classList.contains('active')) {
        mapping.accordionItem.classList.add('active');
        const header = mapping.accordionItem.querySelector('.accordion-header');
        if (header) {
            header.setAttribute('aria-expanded', 'true');
        }
    }

    // Highlight the active link
    if (mapping.link) {
        updateActiveAccordionLink(mapping.link);
    }
}

// ====================================
// SOUND CONTROLS UI (Phase 5)
// ====================================

function setupSoundControls() {
    // Create sound toggle button
    const soundToggle = document.createElement('button');
    soundToggle.className = 'sound-toggle-btn';
    soundToggle.setAttribute('aria-label', 'Toggle sound effects');
    soundToggle.innerHTML = soundManager.enabled ? '🔊' : '🔇';
    soundToggle.title = `Sound: ${soundManager.enabled ? 'ON' : 'OFF'} (Press M to toggle)`;

    // Add click listener
    soundToggle.addEventListener('click', () => {
        const enabled = soundManager.toggle();
        updateSoundControlUI(enabled);
    });

    // Add to page (bottom right corner)
    document.body.appendChild(soundToggle);

    console.log('Sound controls initialized');
}

function updateSoundControlUI(enabled) {
    const soundToggle = document.querySelector('.sound-toggle-btn');
    if (soundToggle) {
        soundToggle.innerHTML = enabled ? '🔊' : '🔇';
        soundToggle.title = `Sound: ${enabled ? 'ON' : 'OFF'} (Press M to toggle)`;
        soundToggle.setAttribute('aria-label', `Sound effects ${enabled ? 'enabled' : 'disabled'}`);
    }
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
║   PORTFOLIO PAGE - ALL PHASES COMPLETE   ║
║   Interactive Case Study System          ║
║   ──────────────────────────────────     ║
║   ✓ 100vh Responsive Layout              ║
║   ✓ Multicolored Kenyan Title            ║
║   ✓ Project Toggle System                ║
║   ✓ Accordion Auto-Sync                  ║
║   ✓ Horizontal Page Scrolling            ║
║   ✓ Touch/Swipe Gestures                 ║
║   ✓ Mouse Wheel Navigation               ║
║   ✓ Card Shuffle Animation               ║
║   ✓ Sound System with Controls           ║
║   ✓ Keyboard Navigation (←→, M)          ║
║   ✓ Blurry Kenyan Code Symbols           ║
║   ✓ Accessibility Features               ║
║   ✓ GSAP ScrollTrigger Animations        ║
║   ──────────────────────────────────     ║
║   Ready for content! 🇰🇪✨              ║
╚═══════════════════════════════════════════╝
`);

// ====================================
// PHASE 7: GSAP SCROLL-TRIGGERED ANIMATIONS
// ====================================

/**
 * Initialize GSAP and ScrollTrigger
 * Enhanced polish with scroll-triggered animations
 */
function initGSAPAnimations() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        console.log('⚠️ Reduced motion preference detected - GSAP animations disabled');
        return;
    }

    // Check if GSAP is available
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('⚠️ GSAP or ScrollTrigger not loaded');
        return;
    }

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    console.log('✨ Initializing GSAP ScrollTrigger animations...');

    // ====================================
    // 1. PORTFOLIO TITLE LETTERS - Stagger Animation
    // ====================================
    const titleLetters = document.querySelectorAll('.portfolio-title .letter');

    if (titleLetters.length > 0) {
        gsap.from(titleLetters, {
            duration: 0.8,
            opacity: 0,
            y: -30,
            rotationX: -90,
            stagger: {
                each: 0.05,
                from: "start",
                ease: "power2.out"
            },
            ease: "back.out(1.7)",
            delay: 0.3
        });

        // Add subtle floating animation
        gsap.to(titleLetters, {
            y: -5,
            duration: 2,
            stagger: {
                each: 0.1,
                repeat: -1,
                yoyo: true
            },
            ease: "sine.inOut"
        });
    }

    // ====================================
    // 2. PROJECT TOGGLE BUTTONS - Entrance Animation
    // ====================================
    const projectToggles = document.querySelectorAll('.project-toggle-btn');

    if (projectToggles.length > 0) {
        gsap.from(projectToggles, {
            duration: 0.6,
            opacity: 0,
            scale: 0.8,
            y: 20,
            stagger: 0.1,
            ease: "back.out(1.5)",
            delay: 0.8
        });

        // Add hover scale effect
        projectToggles.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                if (!prefersReducedMotion) {
                    gsap.to(btn, {
                        scale: 1.05,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });

            btn.addEventListener('mouseleave', () => {
                if (!prefersReducedMotion) {
                    gsap.to(btn, {
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });
        });
    }

    // ====================================
    // 3. ACCORDION ITEMS - Sequential Reveal
    // ====================================
    const accordionItems = document.querySelectorAll('.accordion-item');

    if (accordionItems.length > 0) {
        gsap.from(accordionItems, {
            duration: 0.5,
            opacity: 0,
            x: -30,
            stagger: 0.08,
            ease: "power2.out",
            delay: 1.2
        });

        // Accordion expand/collapse animation enhancement
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');
            const icon = item.querySelector('.accordion-icon');

            if (header) {
                header.addEventListener('click', () => {
                    const isExpanded = item.classList.contains('active');

                    if (!prefersReducedMotion) {
                        // Icon rotation
                        gsap.to(icon, {
                            rotation: isExpanded ? 90 : 0,
                            duration: 0.3,
                            ease: "power2.inOut"
                        });
                    }
                });
            }
        });
    }

    // ====================================
    // 4. CONTENT PAGES - Fade In on Scroll
    // ====================================
    const contentPages = document.querySelectorAll('.content-page');

    if (contentPages.length > 0) {
        contentPages.forEach((page, index) => {
            gsap.from(page, {
                scrollTrigger: {
                    trigger: page,
                    containerAnimation: null,
                    start: "left 80%",
                    end: "left 20%",
                    toggleActions: "play none none reverse",
                    // markers: true // Enable for debugging
                },
                opacity: 0,
                x: 50,
                duration: 0.8,
                ease: "power2.out"
            });

            // Page title animation
            const pageTitle = page.querySelector('.page-title');
            if (pageTitle) {
                gsap.from(pageTitle, {
                    scrollTrigger: {
                        trigger: page,
                        containerAnimation: null,
                        start: "left 80%",
                        toggleActions: "play none none reverse"
                    },
                    opacity: 0,
                    y: 30,
                    duration: 0.6,
                    ease: "power2.out",
                    delay: 0.2
                });
            }

            // Page content animation
            const pageContent = page.querySelector('.page-content');
            if (pageContent) {
                gsap.from(pageContent, {
                    scrollTrigger: {
                        trigger: page,
                        containerAnimation: null,
                        start: "left 80%",
                        toggleActions: "play none none reverse"
                    },
                    opacity: 0,
                    y: 20,
                    duration: 0.8,
                    ease: "power2.out",
                    delay: 0.4
                });
            }
        });
    }

    // ====================================
    // 5. CODE SYMBOLS - Parallax Float Effect
    // ====================================
    const codeElements = document.querySelectorAll('.code-element');

    if (codeElements.length > 0) {
        codeElements.forEach((element, index) => {
            // Initial entrance
            gsap.from(element, {
                opacity: 0,
                scale: 0.5,
                duration: 1,
                ease: "power2.out",
                delay: 1.5 + (index * 0.1)
            });

            // Continuous floating parallax
            const speed = 0.5 + (index % 3) * 0.3;
            const distance = 20 + (index % 4) * 10;

            gsap.to(element, {
                y: `+=${distance}`,
                x: `+=${distance * 0.5}`,
                rotation: index % 2 === 0 ? 5 : -5,
                duration: 3 + speed,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: index * 0.2
            });

            // Add subtle scale pulse
            gsap.to(element, {
                scale: 1.1,
                duration: 2 + (index % 3) * 0.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: index * 0.15
            });
        });
    }

    // ====================================
    // 6. PAGE INDICATORS - Smooth Reveal
    // ====================================
    const pageIndicators = document.querySelectorAll('.page-dot');

    if (pageIndicators.length > 0) {
        gsap.from(pageIndicators, {
            opacity: 0,
            scale: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "back.out(1.7)",
            delay: 1.8
        });
    }

    // ====================================
    // 7. SOUND TOGGLE BUTTON - Entrance
    // ====================================
    const soundToggle = document.querySelector('.sound-toggle-btn');

    if (soundToggle) {
        gsap.from(soundToggle, {
            opacity: 0,
            scale: 0,
            rotation: -180,
            duration: 0.6,
            ease: "back.out(1.7)",
            delay: 2
        });

        // Add pulsing attention effect
        gsap.to(soundToggle, {
            boxShadow: "0 0 20px rgba(0, 107, 63, 0.6)",
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }

    // ====================================
    // 8. HEADER LOGO - Subtle Animation
    // ====================================
    const headerLogo = document.querySelector('.header-logo');

    if (headerLogo) {
        gsap.from(headerLogo, {
            opacity: 0,
            rotation: -10,
            scale: 0.9,
            duration: 0.8,
            ease: "back.out(1.7)",
            delay: 0.2
        });
    }

    // ====================================
    // 9. ACCORDION LINKS - Smooth Reveal
    // ====================================
    const accordionLinks = document.querySelectorAll('.accordion-link');

    if (accordionLinks.length > 0) {
        // Add hover effect to accordion links
        accordionLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                if (!prefersReducedMotion) {
                    gsap.to(link, {
                        x: 5,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });

            link.addEventListener('mouseleave', () => {
                if (!prefersReducedMotion) {
                    gsap.to(link, {
                        x: 0,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });
        });
    }

    // ====================================
    // 10. KENYAN GRADIENT - Shimmer Effect
    // ====================================
    const kenyanGradients = document.querySelectorAll('.kenyan-gradient');

    if (kenyanGradients.length > 0) {
        kenyanGradients.forEach(element => {
            gsap.to(element, {
                backgroundPosition: "200% center",
                duration: 3,
                repeat: -1,
                ease: "linear"
            });
        });
    }

    console.log('✅ GSAP ScrollTrigger animations initialized successfully!');
}

// Initialize GSAP animations when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGSAPAnimations);
} else {
    initGSAPAnimations();
}
