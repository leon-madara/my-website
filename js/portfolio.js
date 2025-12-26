/**
 * Portfolio Page - Interactive Case Study System
 * Phase 6: Final Polish & Optimization
 */

// ====================================
// SOUND MANAGER
// ====================================

class SoundManager {
    constructor() {
        this.volume = 0.4; // Lower volume for subtlety
        this.sounds = {};
        
        // Load user preference
        const savedPreference = this.loadPreference();
        
        // Check for reduced motion preference (accessibility)
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // If user has explicitly saved a preference, respect it unless reduced motion is required
        // Otherwise, default to enabled (true) unless reduced motion is detected
        if (prefersReducedMotion) {
            this.enabled = false;
            // Save the reduced motion preference so UI reflects it
            this.savePreference();
        } else {
            // Use saved preference, or default to true if no preference exists
            this.enabled = savedPreference !== null ? savedPreference : true;
        }
        
        this.loadSounds();
    }

    loadSounds() {
        // Create audio elements for each sound
        // Using data URIs for simple click sounds (will work without external files)

        // Page flip sound (simple click)
        this.sounds.pageFlip = new Audio();
        this.sounds.pageFlip.src = 'sounds/soundFlipping.mp3';
        this.sounds.pageFlip.volume = this.volume;

        // Project switch sound (deeper whoosh)
        this.sounds.projectSwitch = new Audio();
        this.sounds.projectSwitch.volume = this.volume * 0.8;

        // Accordion toggle sound (soft click)
        this.sounds.accordionToggle = new Audio();
        this.sounds.accordionToggle.volume = this.volume * 0.6;

        // Note: Page flip sound is loaded from sounds/soundFlipping.mp3
        // Other sound files can be added to sounds/ directory when available
        // Uncomment the lines below once you add the other sound files:
        // this.sounds.projectSwitch.src = 'sounds/project-switch.mp3';
        // this.sounds.accordionToggle.src = 'sounds/accordion-toggle.mp3';

        console.log('Sound system initialized (add sound files to sounds/ directory to enable audio)');
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
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/cc19ce43-43fb-4433-9807-0ffc3752730d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'portfolio.js:166',message:'SoundManager initialized',data:{soundManagerExists:!!soundManager,enabled:soundManager?.enabled},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

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

    // Setup content page overscroll page flip (all pages)
    setupContentPageOverscrollFlip();

    // Setup sound controls (Phase 5)
    setupSoundControls();

    // Collapse header to free up vertical space
    collapsePortfolioHeaderSection();

    console.log('Portfolio initialization complete');
    
    // #region agent log
    // Check button state after a delay to see if something changes it
    setTimeout(() => {
        const delayedCheck = document.querySelector('.sound-toggle-btn');
        if (delayedCheck) {
            const delayedStyle = window.getComputedStyle(delayedCheck);
            const rect = delayedCheck.getBoundingClientRect();
            const bodyStyle = window.getComputedStyle(document.body);
            fetch('http://127.0.0.1:7243/ingest/cc19ce43-43fb-4433-9807-0ffc3752730d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'portfolio.js:194',message:'Delayed button state check (2s after init)',data:{exists:!!delayedCheck,opacity:delayedStyle.opacity,visibility:delayedStyle.visibility,display:delayedStyle.display,position:delayedStyle.position,zIndex:delayedStyle.zIndex,offsetParent:!!delayedCheck.offsetParent,getBoundingClientRect:{top:rect.top,right:rect.right,bottom:rect.bottom,left:rect.left,width:rect.width,height:rect.height},bodyOverflow:bodyStyle.overflow,bodyHeight:bodyStyle.height,bodyPosition:bodyStyle.position,bodyTransform:bodyStyle.transform},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        } else {
            fetch('http://127.0.0.1:7243/ingest/cc19ce43-43fb-4433-9807-0ffc3752730d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'portfolio.js:194',message:'Delayed check: button not found',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        }
    }, 2000);
    // #endregion
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

    // Completion badge
    DOM.completionBadge = document.getElementById('completion-percentage');

    console.log('DOM elements cached:', {
        projectToggles: DOM.projectToggles.length,
        accordionItems: DOM.accordionItems.length,
        contentPages: DOM.contentPages.length,
        pageDots: DOM.pageDots.length
    });
}

function collapsePortfolioHeaderSection() {
    if (!document.body.classList.contains('portfolio-page')) return;

    requestAnimationFrame(() => {
        document.body.classList.add('portfolio-header-collapsed');
    });
}

// ====================================
// PROJECT TOGGLE INITIALIZATION
// ====================================

function initializeProjectToggle() {
    console.log('Initializing project toggle...');

    // Load initial project content
    if (typeof PortfolioContentLoader !== 'undefined') {
        PortfolioContentLoader.loadProjectContent(PortfolioState.currentProject);
    }

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

    // Initialize accordion content heights for smooth transitions
    DOM.accordionItems.forEach((item, index) => {
        const content = item.querySelector('.accordion-content');
        const header = item.querySelector('.accordion-header');

        if (!content || !header) return;

        // Set initial state based on active class
        if (item.classList.contains('active')) {
            // Set max-height to scrollHeight for smooth transitions
            content.style.maxHeight = content.scrollHeight + 'px';
            content.style.opacity = '1';
            header.setAttribute('aria-expanded', 'true');
        } else {
            // Collapsed state
            content.style.maxHeight = '0';
            content.style.opacity = '0';
            header.setAttribute('aria-expanded', 'false');
        }
    });

    // Build page-to-chapter mapping for auto-sync
    buildPageToChapterMap();

    // Initialize progress circles
    updateChapterProgress(PortfolioState.currentPage);
    
    // Initialize overall completion
    updateOverallCompletion(PortfolioState.currentPage);
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
        header.addEventListener('click', function(e) {
            e.stopPropagation();

            const accordionItem = this.closest('.accordion-item');
            const content = accordionItem.querySelector('.accordion-content');
            const isActive = accordionItem.classList.contains('active');

            console.log(`Accordion header clicked: ${accordionItem.dataset.chapter}, currently active: ${isActive}`);

            // Toggle active state with smooth height transition
            if (isActive) {
                // Collapse
                accordionItem.classList.remove('active');
                this.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = '0';
                content.style.opacity = '0';
            } else {
                // Expand
                accordionItem.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.opacity = '1';

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

            // Update overall completion (based on expanded sections)
            updateOverallCompletion(PortfolioState.currentPage);
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

        // Update progress circles
        updateChapterProgress(currentPage);
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

    // Add page transition fade effect when triggered from accordion
    if (fromAccordion) {
        // Start with fade out and slight translate
        targetPage.style.opacity = '0';
        targetPage.style.transform = 'translateX(20px)';
    }

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
    } else {
        // Animate page entrance after scroll starts
        setTimeout(() => {
            targetPage.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            targetPage.style.opacity = '1';
            targetPage.style.transform = 'translateX(0)';
        }, 100);
    }

    // Update progress circles after scroll completes
    setTimeout(() => {
        updateChapterProgress(pageIndex);
    }, 350);

    // Reset scrolling flag after animation completes
    setTimeout(() => {
        PortfolioState.isScrolling = false;
    }, 600); // Match scroll animation duration
}

// ====================================
// PROGRESS CIRCLE UPDATES
// ====================================

function updateChapterProgress(currentPageIndex) {
    if (!DOM.accordionItems) return;

    DOM.accordionItems.forEach(item => {
        const chapterLinks = item.querySelectorAll('.accordion-link');
        if (chapterLinks.length === 0) return;

        // Get all page indices for this chapter
        const chapterPages = Array.from(chapterLinks).map(link =>
            parseInt(link.dataset.page)
        );

        const minPage = Math.min(...chapterPages);
        const maxPage = Math.max(...chapterPages);
        const chapterLength = maxPage - minPage + 1;

        // Calculate progress percentage
        let progress = 0;
        if (currentPageIndex >= minPage && currentPageIndex <= maxPage) {
            // Currently viewing a page in this chapter
            progress = ((currentPageIndex - minPage + 1) / chapterLength) * 100;
        } else if (currentPageIndex > maxPage) {
            // Already passed this chapter
            progress = 100;
        }
        // If currentPageIndex < minPage, progress stays 0

        // Update progress circle
        const progressCircleFill = item.querySelector('.progress-circle-fill');
        const progressText = item.querySelector('.progress-text');

        if (progressCircleFill && progressText) {
            const circumference = 88; // 2πr = 2 × π × 14 ≈ 88
            const offset = circumference - (progress / 100) * circumference;

            // Animate the progress circle
            progressCircleFill.style.strokeDashoffset = offset;
            progressText.textContent = `${Math.round(progress)}%`;
        }
    });

    // Update overall completion percentage
    updateOverallCompletion(currentPageIndex);
}

// ====================================
// OVERALL COMPLETION CALCULATION
// ====================================

function updateOverallCompletion(currentPageIndex) {
    if (!DOM.accordionItems || !DOM.completionBadge) return;

    let totalPages = 0;
    let completedPages = 0;

    DOM.accordionItems.forEach(item => {
        const chapterLinks = item.querySelectorAll('.accordion-link');
        if (chapterLinks.length === 0) return;

        const chapterPages = Array.from(chapterLinks).map(link =>
            parseInt(link.dataset.page)
        );

        const minPage = Math.min(...chapterPages);
        const maxPage = Math.max(...chapterPages);
        const chapterLength = maxPage - minPage + 1;

        totalPages += chapterLength;

        // Count completed pages in this chapter
        if (currentPageIndex >= maxPage) {
            // Entire chapter completed
            completedPages += chapterLength;
        } else if (currentPageIndex >= minPage) {
            // Partially completed
            completedPages += (currentPageIndex - minPage + 1);
        }
    });

    // Calculate overall percentage
    const overallProgress = totalPages > 0 ? Math.round((completedPages / totalPages) * 100) : 0;

    // Update completion badge
    if (DOM.completionBadge) {
        DOM.completionBadge.textContent = `${overallProgress}%`;
    }
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

    // Load new project content
    if (typeof PortfolioContentLoader !== 'undefined') {
        PortfolioContentLoader.loadProjectContent(newProjectNumber);
    }
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
        const accordionNav = document.querySelector('.accordion-nav');

        if (!contentWrapper) {
            resolve();
            return;
        }

        // Apply blinking animation to both accordion-nav and content-wrapper
        const animationStyle = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Animate content-wrapper
        contentWrapper.style.transition = animationStyle;
        contentWrapper.style.opacity = '0';
        contentWrapper.style.transform = 'scale(0.95)';
        
        // Animate accordion-nav if it exists
        if (accordionNav) {
            accordionNav.style.transition = animationStyle;
            accordionNav.style.opacity = '0';
            accordionNav.style.transform = 'scale(0.95)';
        }

        setTimeout(resolve, 400);
    });
}

function animateProjectEnter() {
    return new Promise((resolve) => {
        const contentWrapper = DOM.contentWrapper;
        const accordionNav = document.querySelector('.accordion-nav');

        if (!contentWrapper) {
            resolve();
            return;
        }

        // Start both elements from scaled/opacity state
        const startStyle = 'scale(0.95)';
        contentWrapper.style.transform = startStyle;
        contentWrapper.style.opacity = '0';
        
        if (accordionNav) {
            accordionNav.style.transform = startStyle;
            accordionNav.style.opacity = '0';
        }

        // Force reflow
        contentWrapper.offsetHeight;

        // Animate both to normal position
        setTimeout(() => {
            const animationStyle = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            
            contentWrapper.style.transition = animationStyle;
            contentWrapper.style.opacity = '1';
            contentWrapper.style.transform = 'scale(1)';
            
            if (accordionNav) {
                accordionNav.style.transition = animationStyle;
                accordionNav.style.opacity = '1';
                accordionNav.style.transform = 'scale(1)';
            }

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
        // Check if wheel event originated inside a content page
        const contentPage = e.target.closest('.content-page');

        // Determine scroll intent (vertical vs horizontal)
        const isVerticalIntent = Math.abs(e.deltaY) > Math.abs(e.deltaX);

        // If inside a content page with vertical intent, check if page can scroll
        if (contentPage && isVerticalIntent) {
            const { scrollTop, scrollHeight, clientHeight } = contentPage;
            const canScrollUp = scrollTop > 0;
            const canScrollDown = scrollTop + clientHeight < scrollHeight - 1; // 1px tolerance

            // Scrolling down and can scroll down -> let browser handle it
            if (e.deltaY > 0 && canScrollDown) {
                return; // Don't preventDefault, allow native vertical scroll
            }

            // Scrolling up and can scroll up -> let browser handle it
            if (e.deltaY < 0 && canScrollUp) {
                return; // Don't preventDefault, allow native vertical scroll
            }

            // At bottom scrolling down -> let overscroll controller handle it
            if (!canScrollDown && e.deltaY > 0) {
                // Overscroll controller will handle this via its own wheel listener
                // Still prevent default to avoid horizontal scroll interference
                e.preventDefault();
                return;
            }

            // At top scrolling up -> let overscroll controller handle it
            if (!canScrollUp && e.deltaY < 0) {
                // Overscroll controller will handle this via its own wheel listener
                // Still prevent default to avoid horizontal scroll interference
                e.preventDefault();
                return;
            }
        }

        // Default behavior: convert wheel to horizontal scroll
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
// CONTENT PAGE OVERSCROLL PAGE FLIP
// ====================================

/**
 * Sets up overscroll resistance and page-flip for all content pages.
 * When user scrolls past bottom/top, opacity fades as resistance (Option B),
 * and after 100px threshold, triggers a GSAP page-flip animation.
 * Supports both directions: next page (bottom) and previous page (top).
 */
function setupContentPageOverscrollFlip() {
    if (!DOM.contentPages || DOM.contentPages.length === 0) {
        console.log('No content pages found, skipping overscroll setup');
        return;
    }

    console.log('Setting up content page overscroll flip...');

    // Configuration
    const RESISTANCE_THRESHOLD = 100; // px before triggering flip
    const RESISTANCE_FACTOR = 0.35;   // How much of deltaY to accumulate (resistance)
    const MAX_OPACITY_FADE = 0.15;    // Max opacity reduction (1 -> 0.85)

    // Shared state (only one page can overscroll at a time)
    let overscrollPx = 0;
    let isOverscrolling = false;
    let isFlipping = false;
    let resetTimeout = null;
    let overscrollDirection = null; // 'next' or 'prev'
    let activeOverscrollPage = null; // The page currently being overscrolled

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /**
     * Reset overscroll state and restore opacity
     */
    function resetOverscroll() {
        if (overscrollPx === 0 && !isOverscrolling) return;

        const pageToReset = activeOverscrollPage;
        
        isOverscrolling = false;
        overscrollPx = 0;
        overscrollDirection = null;
        activeOverscrollPage = null;

        // Animate opacity back to 1
        if (pageToReset) {
            if (typeof gsap !== 'undefined') {
                gsap.to(pageToReset, {
                    opacity: 1,
                    duration: 0.25,
                    ease: 'power2.out'
                });
            } else {
                pageToReset.style.opacity = '1';
            }
        }
    }

    /**
     * Trigger the page flip animation
     * @param {string} direction - 'next' or 'prev'
     */
    function triggerPageFlip(direction) {
        if (isFlipping) return;

        const currentPageIndex = PortfolioState.currentPage;
        const targetPageIndex = direction === 'next' ? currentPageIndex + 1 : currentPageIndex - 1;

        // Check if target page exists
        if (!DOM.contentPages[targetPageIndex]) {
            console.log(`No ${direction} page available for flip`);
            resetOverscroll();
            return;
        }

        isFlipping = true;
        const currentPage = DOM.contentPages[currentPageIndex];
        const targetPage = DOM.contentPages[targetPageIndex];

        console.log(`Triggering page flip (${direction}): ${currentPageIndex} -> ${targetPageIndex}`);

        // Play page flip sound
        if (soundManager) {
            soundManager.playPageFlip();
        }

        // Reduced motion: just navigate without animation
        if (prefersReducedMotion || typeof gsap === 'undefined') {
            resetOverscroll();
            scrollToPage(targetPageIndex, false);
            isFlipping = false;
            return;
        }

        // Prevent scroll interference during animation
        PortfolioState.isScrolling = true;

        // Set initial state for target page based on direction
        // Next: target comes from right (x: 100%)
        // Prev: target comes from left (x: -100%)
        const targetStartX = direction === 'next' ? '100%' : '-100%';
        const currentEndX = direction === 'next' ? '-100%' : '100%';

        gsap.set(targetPage, {
            x: targetStartX,
            opacity: 1,
            visibility: 'visible'
        });

        // Create GSAP timeline for page flip
        const flipTimeline = gsap.timeline({
            onComplete: () => {
                // Clear transforms on both pages
                gsap.set(currentPage, { clearProps: 'x,opacity' });
                gsap.set(targetPage, { clearProps: 'x' });

                // Scroll horizontal container to target page position
                const scrollLeft = targetPage.offsetLeft;
                DOM.horizontalPages.scrollLeft = scrollLeft;

                // Update state
                PortfolioState.currentPage = targetPageIndex;

                // Update UI indicators
                updatePageIndicators(targetPageIndex);
                syncAccordionWithPage(targetPageIndex);

                // Update progress circles
                setTimeout(() => {
                    updateChapterProgress(targetPageIndex);
                }, 100);

                // Reset flags
                isFlipping = false;
                isOverscrolling = false;
                overscrollPx = 0;
                overscrollDirection = null;
                activeOverscrollPage = null;

                setTimeout(() => {
                    PortfolioState.isScrolling = false;
                }, 100);

                console.log('Page flip complete');
            }
        });

        // Animate: current page slides out, target page slides in
        flipTimeline
            .to(currentPage, {
                x: currentEndX,
                opacity: 0.7,
                duration: 0.5,
                ease: 'power2.inOut'
            }, 0)
            .to(targetPage, {
                x: '0%',
                opacity: 1,
                duration: 0.5,
                ease: 'power2.inOut'
            }, 0);
    }

    /**
     * Create wheel handler for a specific content page
     * @param {HTMLElement} contentPage - The content page element
     */
    function createOverscrollWheelHandler(contentPage) {
        return function handleOverscrollWheel(e) {
            // Skip if already flipping or global scroll is in progress
            if (isFlipping || PortfolioState.isScrolling) return;

            // Only handle vertical scroll intent
            if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;

            const { scrollTop, scrollHeight, clientHeight } = contentPage;
            const atBottom = scrollTop + clientHeight >= scrollHeight - 1; // 1px tolerance
            const atTop = scrollTop <= 1; // 1px tolerance

            const scrollingDown = e.deltaY > 0;
            const scrollingUp = e.deltaY < 0;

            // Determine if we should trigger overscroll
            const shouldOverscrollNext = atBottom && scrollingDown;
            const shouldOverscrollPrev = atTop && scrollingUp;

            // If direction changed while overscrolling, reset
            if (isOverscrolling) {
                if ((overscrollDirection === 'next' && scrollingUp) ||
                    (overscrollDirection === 'prev' && scrollingDown)) {
                    resetOverscroll();
                    return;
                }
            }

            // Not at an edge or scrolling in wrong direction
            if (!shouldOverscrollNext && !shouldOverscrollPrev) {
                return;
            }

            // At edge, scrolling in the right direction - accumulate overscroll
            e.preventDefault();
            e.stopPropagation();

            isOverscrolling = true;
            overscrollDirection = shouldOverscrollNext ? 'next' : 'prev';
            activeOverscrollPage = contentPage;

            // Clear any pending reset
            if (resetTimeout) {
                clearTimeout(resetTimeout);
                resetTimeout = null;
            }

            // Accumulate with resistance factor (use absolute value of deltaY)
            overscrollPx = Math.min(overscrollPx + (Math.abs(e.deltaY) * RESISTANCE_FACTOR), RESISTANCE_THRESHOLD);

            // Calculate progress (0 to 1)
            const progress = overscrollPx / RESISTANCE_THRESHOLD;

            // Apply Option B: opacity fade
            const newOpacity = 1 - (progress * MAX_OPACITY_FADE);

            if (typeof gsap !== 'undefined') {
                gsap.set(contentPage, { opacity: newOpacity });
            } else {
                contentPage.style.opacity = newOpacity;
            }

            // Check if threshold reached
            if (overscrollPx >= RESISTANCE_THRESHOLD) {
                triggerPageFlip(overscrollDirection);
            } else {
                // Set a timeout to reset if user stops scrolling
                resetTimeout = setTimeout(() => {
                    if (!isFlipping) {
                        resetOverscroll();
                    }
                }, 500);
            }
        };
    }

    // Attach wheel listener to each content page
    DOM.contentPages.forEach((contentPage, index) => {
        const handler = createOverscrollWheelHandler(contentPage);
        contentPage.addEventListener('wheel', handler, { passive: false });
    });

    console.log(`Content page overscroll flip setup complete (${DOM.contentPages.length} pages)`);
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
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/cc19ce43-43fb-4433-9807-0ffc3752730d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'portfolio.js:1318',message:'setupSoundControls called',data:{soundManagerExists:!!soundManager},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    // Ensure soundManager is initialized
    if (!soundManager) {
        console.warn('SoundManager not initialized, cannot create sound controls');
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/cc19ce43-43fb-4433-9807-0ffc3752730d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'portfolio.js:1322',message:'Early return: soundManager is null',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        return;
    }

    // Check if button already exists (prevent duplicates)
    const existingButton = document.querySelector('.sound-toggle-btn');
    if (existingButton) {
        console.log('Sound toggle button already exists, skipping creation');
        updateSoundControlUI(soundManager.enabled);
        return;
    }

    // Create sound toggle button
    const soundToggle = document.createElement('button');
    soundToggle.className = 'sound-toggle-btn';
    soundToggle.setAttribute('aria-label', 'Toggle sound effects');
    soundToggle.setAttribute('data-sound-enabled', soundManager.enabled.toString());
    soundToggle.innerHTML = soundManager.enabled ? '🔊' : '🔇';
    soundToggle.title = `Sound: ${soundManager.enabled ? 'ON' : 'OFF'} (Press M to toggle)`;

    // Add click listener
    soundToggle.addEventListener('click', () => {
        const enabled = soundManager.toggle();
        updateSoundControlUI(enabled);
    });

    // Ensure button is immediately visible (before any animations)
    soundToggle.style.opacity = '1';
    soundToggle.style.visibility = 'visible';
    soundToggle.style.display = 'flex';
    soundToggle.style.position = 'fixed';
    soundToggle.style.bottom = '2rem';
    soundToggle.style.right = '2rem';
    soundToggle.style.zIndex = '10001'; // Higher than entrance container (10000)
    soundToggle.style.pointerEvents = 'auto';

    // Add to page (bottom right corner)
    document.body.appendChild(soundToggle);
    // #region agent log
    const computedStyle = window.getComputedStyle(soundToggle);
    fetch('http://127.0.0.1:7243/ingest/cc19ce43-43fb-4433-9807-0ffc3752730d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'portfolio.js:1357',message:'Button appended to DOM',data:{opacity:computedStyle.opacity,visibility:computedStyle.visibility,display:computedStyle.display,zIndex:computedStyle.zIndex,offsetParent:!!soundToggle.offsetParent},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion

    // Set initial visual state
    updateSoundControlUI(soundManager.enabled);
    
    // Force a reflow to ensure the button is rendered
    void soundToggle.offsetHeight;
    
    // Ensure button is visible even if entrance animation is still running
    const ensureButtonVisible = () => {
        const btn = document.querySelector('.sound-toggle-btn');
        if (btn) {
            btn.style.opacity = '1';
            btn.style.visibility = 'visible';
            btn.style.display = 'flex';
            btn.style.zIndex = '10001';
            btn.style.pointerEvents = 'auto';
        }
    };
    
    // Check immediately and after entrance completes
    ensureButtonVisible();
    setTimeout(ensureButtonVisible, 100);
    setTimeout(ensureButtonVisible, 500);
    setTimeout(ensureButtonVisible, 2000);
    
    // Also ensure visibility when entrance completes
    const checkEntranceComplete = setInterval(() => {
        if (document.body.classList.contains('entrance-complete')) {
            ensureButtonVisible();
            clearInterval(checkEntranceComplete);
        }
    }, 100);
    
    // Clear interval after 10 seconds to prevent infinite loop
    setTimeout(() => clearInterval(checkEntranceComplete), 10000);

    // Verify button is in DOM and visible
    const verifyButton = document.querySelector('.sound-toggle-btn');
    if (verifyButton) {
        const finalStyle = window.getComputedStyle(verifyButton);
        console.log(`Sound controls initialized - Sound is ${soundManager.enabled ? 'ON' : 'OFF'}`);
        console.log('Sound toggle button created and visible:', {
            exists: !!verifyButton,
            visible: verifyButton.offsetParent !== null,
            opacity: finalStyle.opacity,
            zIndex: finalStyle.zIndex
        });
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/cc19ce43-43fb-4433-9807-0ffc3752730d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'portfolio.js:1364',message:'Button verification after creation',data:{exists:!!verifyButton,visible:verifyButton.offsetParent!==null,opacity:finalStyle.opacity,visibility:finalStyle.visibility,display:finalStyle.display,zIndex:finalStyle.zIndex},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
    } else {
        console.error('Sound toggle button was not created successfully');
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/cc19ce43-43fb-4433-9807-0ffc3752730d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'portfolio.js:1373',message:'Button verification failed',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
    }
}

function updateSoundControlUI(enabled) {
    const soundToggle = document.querySelector('.sound-toggle-btn');
    if (soundToggle) {
        soundToggle.innerHTML = enabled ? '🔊' : '🔇';
        soundToggle.title = `Sound: ${enabled ? 'ON' : 'OFF'} (Press M to toggle)`;
        soundToggle.setAttribute('aria-label', `Sound effects ${enabled ? 'enabled' : 'disabled'}`);
        soundToggle.setAttribute('data-sound-enabled', enabled.toString());
        
        // Add visual feedback class for styling
        if (enabled) {
            soundToggle.classList.remove('sound-muted');
            soundToggle.classList.add('sound-enabled');
        } else {
            soundToggle.classList.remove('sound-enabled');
            soundToggle.classList.add('sound-muted');
        }
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
 * Ensure all animated elements are visible
 * Fallback for when GSAP is disabled or not loaded
 */
function ensureElementsVisible() {
    const elements = [
        '.portfolio-title .letter',
        '.project-toggle-btn',
        '.accordion-item',
        '.content-page',
        '.page-dot',
        '.sound-toggle-btn',
        '.header-logo',
        '.accordion-link',
        '.code-element'
    ];

    elements.forEach(selector => {
        const els = document.querySelectorAll(selector);
        els.forEach(el => {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
            el.style.transform = 'none';
        });
    });

    console.log('✅ All portfolio elements ensured visible');
}

/**
 * Initialize GSAP and ScrollTrigger
 * Enhanced polish with scroll-triggered animations
 */
function initGSAPAnimations() {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/cc19ce43-43fb-4433-9807-0ffc3752730d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'portfolio.js:1476',message:'initGSAPAnimations called',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        console.log('⚠️ Reduced motion preference detected - GSAP animations disabled');
        ensureElementsVisible(); // Ensure all elements are visible
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/cc19ce43-43fb-4433-9807-0ffc3752730d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'portfolio.js:1483',message:'Reduced motion detected, returning early',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
        return;
    }

    // Check if GSAP is available
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('⚠️ GSAP or ScrollTrigger not loaded - ensuring elements remain visible');
        ensureElementsVisible(); // Ensure all elements are visible even without GSAP
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/cc19ce43-43fb-4433-9807-0ffc3752730d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'portfolio.js:1490',message:'GSAP not available, returning early',data:{gsapExists:typeof gsap!=='undefined',scrollTriggerExists:typeof ScrollTrigger!=='undefined'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
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
        // Ensure letters are visible first, then animate
        gsap.set(titleLetters, { opacity: 1 });

        gsap.from(titleLetters, {
            duration: 0.6,
            opacity: 0,
            y: -20,
            rotationX: -90,
            stagger: {
                each: 0.03,
                from: "start",
                ease: "power2.out"
            },
            ease: "back.out(1.7)",
            delay: 0.1
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
            ease: "sine.inOut",
            delay: 0.8
        });
    }

    // ====================================
    // 2. PROJECT TOGGLE BUTTONS - Entrance Animation
    // ====================================
    const projectToggles = document.querySelectorAll('.project-toggle-btn');

    if (projectToggles.length > 0) {
        // Ensure buttons are visible first
        gsap.set(projectToggles, { opacity: 1 });

        gsap.from(projectToggles, {
            duration: 0.5,
            opacity: 0,
            scale: 0.9,
            y: 15,
            stagger: 0.08,
            ease: "back.out(1.5)",
            delay: 0.2
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
        // Ensure accordion items are visible first
        gsap.set(accordionItems, { opacity: 1 });

        gsap.from(accordionItems, {
            duration: 0.4,
            opacity: 0,
            x: -20,
            stagger: 0.05,
            ease: "power2.out",
            delay: 0.3
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
    // 4. CONTENT PAGES - Simple Initial Fade In
    // ====================================
    // Note: Disabled ScrollTrigger for horizontal scroll compatibility
    // Pages will have a simple initial fade-in only
    const contentPages = document.querySelectorAll('.content-page');

    if (contentPages.length > 0) {
        // Ensure pages are visible first
        gsap.set(contentPages, { opacity: 1 });

        contentPages.forEach((page, index) => {
            // Only animate the first visible page
            if (index === 0) {
                gsap.from(page, {
                    opacity: 0,
                    x: 20,
                    duration: 0.5,
                    ease: "power2.out",
                    delay: 0.4
                });
            }
        });
    }

    // ====================================
    // 4A. OVERVIEW PAGE - Neumorphic Entrance Animations
    // ====================================
    const overviewPage = document.querySelector('#overview');

    if (overviewPage) {
        const tl = gsap.timeline({ delay: 0.5 });

        // Title with Kenyan gradient - subtle reveal
        const pageTitle = overviewPage.querySelector('.page-title.kenyan-gradient');
        if (pageTitle) {
            gsap.set(pageTitle, { opacity: 1 });
            tl.from(pageTitle, {
                opacity: 0,
                y: 15,
                duration: 0.3,
                ease: 'power2.out'
            });
        }

        // Subtitle fade in
        const pageSubtitle = overviewPage.querySelector('.page-subtitle');
        if (pageSubtitle) {
            gsap.set(pageSubtitle, { opacity: 1 });
            tl.from(pageSubtitle, {
                opacity: 0,
                y: 10,
                duration: 0.3,
                ease: 'power2.out'
            }, '-=0.1');
        }

        // Content paragraph
        const contentParagraph = overviewPage.querySelector('.page-content > p');
        if (contentParagraph) {
            gsap.set(contentParagraph, { opacity: 1 });
            tl.from(contentParagraph, {
                opacity: 0,
                y: 10,
                duration: 0.3,
                ease: 'power2.out'
            }, '-=0.1');
        }

        // Info cards with stagger and neumorphic float effect
        const infoItems = overviewPage.querySelectorAll('.info-item');
        if (infoItems.length > 0) {
            // Ensure info items are visible first
            gsap.set(infoItems, { opacity: 1 });

            tl.from(infoItems, {
                opacity: 0,
                y: 20,
                scale: 0.95,
                duration: 0.3,
                stagger: 0.08,
                ease: 'power2.out'
            }, '-=0.2');

            // Add subtle hover float animation
            infoItems.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    if (!prefersReducedMotion) {
                        gsap.to(item, {
                            y: -6,
                            duration: 0.3,
                            ease: 'power2.out'
                        });
                    }
                });

                item.addEventListener('mouseleave', () => {
                    if (!prefersReducedMotion) {
                        gsap.to(item, {
                            y: 0,
                            duration: 0.3,
                            ease: 'power2.out'
                        });
                    }
                });
            });
        }
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
        // Ensure indicators are visible first
        gsap.set(pageIndicators, { opacity: 1 });

        gsap.from(pageIndicators, {
            opacity: 0,
            scale: 0,
            duration: 0.3,
            stagger: 0.03,
            ease: "back.out(1.7)",
            delay: 0.5
        });
    }

    // ====================================
    // 7. SOUND TOGGLE BUTTON - Entrance
    // ====================================
    const soundToggle = document.querySelector('.sound-toggle-btn');
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/cc19ce43-43fb-4433-9807-0ffc3752730d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'portfolio.js:1793',message:'Looking for sound toggle button in initGSAPAnimations',data:{buttonExists:!!soundToggle},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion

    if (soundToggle) {
        const beforeStyle = window.getComputedStyle(soundToggle);
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/cc19ce43-43fb-4433-9807-0ffc3752730d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'portfolio.js:1795',message:'Button found, before animation setup',data:{opacity:beforeStyle.opacity,visibility:beforeStyle.visibility,display:beforeStyle.display},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        // Ensure button is visible first (critical for fallback)
        soundToggle.style.opacity = '1';
        soundToggle.style.visibility = 'visible';
        soundToggle.style.display = 'flex';
        
        // Only animate if GSAP is available and motion is not reduced
        if (!prefersReducedMotion) {
            gsap.set(soundToggle, { opacity: 1, visibility: 'visible' });

            gsap.from(soundToggle, {
                opacity: 0,
                scale: 0,
                rotation: -90,
                duration: 0.4,
                ease: "back.out(1.7)",
                delay: 0.6,
                onStart: () => {
                    // #region agent log
                    fetch('http://127.0.0.1:7243/ingest/cc19ce43-43fb-4433-9807-0ffc3752730d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'portfolio.js:1805',message:'GSAP animation started',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
                    // #endregion
                },
                onComplete: () => {
                    // Ensure visibility after animation
                    soundToggle.style.opacity = '1';
                    soundToggle.style.visibility = 'visible';
                    const afterStyle = window.getComputedStyle(soundToggle);
                    // #region agent log
                    fetch('http://127.0.0.1:7243/ingest/cc19ce43-43fb-4433-9807-0ffc3752730d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'portfolio.js:1812',message:'GSAP animation completed',data:{opacity:afterStyle.opacity,visibility:afterStyle.visibility},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
                    // #endregion
                }
            });

            // Add pulsing attention effect
            gsap.to(soundToggle, {
                boxShadow: "0 0 20px rgba(0, 107, 63, 0.6)",
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: 1
            });
        } else {
            // #region agent log
            fetch('http://127.0.0.1:7243/ingest/cc19ce43-43fb-4433-9807-0ffc3752730d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'portfolio.js:1828',message:'Reduced motion, skipping animation',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
            // #endregion
        }
    } else {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/cc19ce43-43fb-4433-9807-0ffc3752730d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'portfolio.js:1829',message:'Button not found in initGSAPAnimations',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
    }

    // ====================================
    // 8. HEADER LOGO - Subtle Animation
    // ====================================
    const headerLogo = document.querySelector('.header-logo');

    if (headerLogo) {
        // Ensure logo is visible first
        gsap.set(headerLogo, { opacity: 1 });

        gsap.from(headerLogo, {
            opacity: 0,
            rotation: -5,
            scale: 0.95,
            duration: 0.5,
            ease: "back.out(1.7)",
            delay: 0.05
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

// Initialize GSAP animations AFTER main portfolio initialization
// This ensures proper element setup before animations run
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for main portfolio init to complete
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/cc19ce43-43fb-4433-9807-0ffc3752730d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'portfolio.js:1904',message:'Scheduling initGSAPAnimations (DOMContentLoaded)',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
        setTimeout(initGSAPAnimations, 100);
    });
} else {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/cc19ce43-43fb-4433-9807-0ffc3752730d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'portfolio.js:1907',message:'Scheduling initGSAPAnimations (immediate)',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    setTimeout(initGSAPAnimations, 100);
}
