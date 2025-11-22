/**
 * About Page - Parallax Scroll Animation
 * Leon Madara Portfolio
 * Using GSAP ScrollTrigger for smooth, performant animations
 */

// Wait for DOM and GSAP to load
document.addEventListener('DOMContentLoaded', () => {
    console.log('========================================');
    console.log('🎬 ANIMATION INITIALIZATION STARTED');
    console.log('========================================');
    console.log('Timestamp:', new Date().toISOString());
    console.log('User Agent:', navigator.userAgent);
    console.log('Viewport:', `${window.innerWidth}x${window.innerHeight}`);
    console.log('About page loaded, initializing parallax...');

    // Check if GSAP and ScrollTrigger are available
    console.log('Checking GSAP library availability...');
    if (typeof gsap === 'undefined') {
        console.error('❌ GSAP library failed to load from CDN. Activating fallback mode.');
        console.error('Context: GSAP library not found in global scope');
        console.log('Fallback mode: All content will be displayed immediately without animations.');
        activateFallbackMode('GSAP library not loaded');
        return;
    }
    console.log('✓ GSAP library loaded successfully');
    console.log('GSAP version:', gsap.version);

    console.log('Checking ScrollTrigger plugin availability...');
    if (typeof ScrollTrigger === 'undefined') {
        console.error('❌ ScrollTrigger plugin failed to load from CDN. Activating fallback mode.');
        console.error('Context: ScrollTrigger plugin not found in global scope');
        console.log('Fallback mode: All content will be displayed immediately without animations.');
        activateFallbackMode('ScrollTrigger plugin not loaded');
        return;
    }
    console.log('✓ ScrollTrigger plugin loaded successfully');

    // Register ScrollTrigger plugin
    console.log('Registering ScrollTrigger plugin with GSAP...');
    try {
        gsap.registerPlugin(ScrollTrigger);
        console.log('✓ ScrollTrigger plugin registered successfully');
    } catch (error) {
        console.error('❌ Failed to register ScrollTrigger plugin:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        console.log('Activating fallback mode due to plugin registration failure.');
        activateFallbackMode('ScrollTrigger registration failed');
        return;
    }

    // Check for reduced motion preference
    console.log('Checking accessibility preferences...');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        console.log('⚠️ Reduced motion preference detected');
        console.log('Accessibility mode: Using simplified animations');
        fallbackNoAnimation();
        return;
    }
    console.log('✓ No reduced motion preference detected');

    // Initialize parallax animation with error handling
    console.log('Starting parallax hero initialization...');
    try {
        initParallaxHero();
    } catch (error) {
        console.error('❌ Error during parallax initialization:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        console.log('Activating fallback mode due to initialization error.');
        activateFallbackMode('Initialization error: ' + error.message);
    }
});

/**
 * Initialize Parallax Hero Animation
 */
function initParallaxHero() {

    // Get elements
    const heroContainer = document.getElementById('hero-container');
    const sectionTitle = document.getElementById('section-title');
    const sectionBody = document.getElementById('section-body');
    const whatIDoSection = document.getElementById('what-i-do-section');
    const expertiseItems = document.querySelectorAll('.expertise-item');

    // Validate elements exist with detailed error logging
    const requiredElements = {
        'hero-container': heroContainer,
        'section-title': sectionTitle,
        'section-body': sectionBody,
        'what-i-do-section': whatIDoSection
    };

    const missingElements = [];
    for (const [elementId, element] of Object.entries(requiredElements)) {
        if (!element) {
            missingElements.push(elementId);
            console.error(`Required element not found: #${elementId}`);
        }
    }

    if (missingElements.length > 0) {
        console.error(`❌ Parallax initialization failed. Missing ${missingElements.length} required element(s): ${missingElements.join(', ')}`);
        console.error('Context: DOM validation failed during initialization');
        activateFallbackMode(`Missing required DOM elements: ${missingElements.join(', ')}`);
        return;
    }

    console.log('✓ All required DOM elements found and validated');
    console.log('Element validation results:', {
        heroContainer: '✓',
        sectionTitle: '✓',
        sectionBody: '✓',
        whatIDoSection: '✓',
        expertiseItems: `✓ (${expertiseItems.length} cards)`
    });
    console.log('Creating animation timeline...');

    // Detect mobile device
    const isMobile = window.innerWidth <= 768;
    console.log('Device detection:', {
        isMobile: isMobile,
        viewportWidth: window.innerWidth,
        breakpoint: '768px'
    });

    // Adjust animation parameters for mobile
    const scaleTarget = isMobile ? 0.25 : 0.35;
    const translateTarget = isMobile ? '-120vw' : '-150vw';
    const scrubSpeed = isMobile ? 0.5 : 1;
    
    console.log('Animation parameters configured:', {
        scaleTarget: scaleTarget,
        translateTarget: translateTarget,
        scrubSpeed: scrubSpeed,
        deviceType: isMobile ? 'mobile' : 'desktop'
    });

    // ========================================
    // CREATE MASTER TIMELINE
    // ========================================

    console.log('========================================');
    console.log('📊 CREATING MASTER TIMELINE');
    console.log('========================================');
    
    let masterTimeline;
    try {
        const scrollTriggerConfig = {
            trigger: '.parallax-hero',
            start: 'top top',       // When hero top hits viewport top (start of scroll)
            end: '+=100%',          // Scroll distance relative to trigger height (100vh)
            scrub: scrubSpeed,      // Smooth scrubbing
            pin: true,              // Pin the hero section while animating
            anticipatePin: 1,       // Smooth pin start
            markers: false,         // Set to true for debugging
            invalidateOnRefresh: true, // Recalculate on resize

            // Callbacks for debugging
            onEnter: () => {
                console.log('🎯 ScrollTrigger Event: onEnter');
                console.log('Animation state: Parallax animation started');
                console.log('Scroll direction: Forward (entering trigger zone)');
            },
            onLeave: () => {
                console.log('🎯 ScrollTrigger Event: onLeave');
                console.log('Animation state: Parallax animation completed');
                console.log('Scroll direction: Forward (leaving trigger zone)');
            },
            onEnterBack: () => {
                console.log('🎯 ScrollTrigger Event: onEnterBack');
                console.log('Animation state: Scrolling back up');
                console.log('Scroll direction: Backward (re-entering trigger zone)');
            },
            onLeaveBack: () => {
                console.log('🎯 ScrollTrigger Event: onLeaveBack');
                console.log('Animation state: Back to hero');
                console.log('Scroll direction: Backward (leaving trigger zone)');
            },

            onUpdate: (self) => {
                // Optional: Log progress for debugging
                // Uncomment for detailed scroll progress tracking
                // console.log('Scroll progress:', (self.progress * 100).toFixed(1) + '%');
            }
        };
        
        console.log('ScrollTrigger configuration:', {
            trigger: '.parallax-hero',
            start: scrollTriggerConfig.start,
            end: scrollTriggerConfig.end,
            scrub: scrollTriggerConfig.scrub,
            pin: scrollTriggerConfig.pin,
            markers: scrollTriggerConfig.markers
        });
        
        masterTimeline = gsap.timeline({
            scrollTrigger: scrollTriggerConfig
        });
        
        console.log('✓ Master timeline created successfully');
        console.log('Timeline ID:', masterTimeline.data ? masterTimeline.data.id : 'N/A');
    } catch (error) {
        console.error('❌ Failed to create GSAP timeline:', error);
        console.error('Error context:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        throw new Error('Timeline creation failed: ' + error.message);
    }

    // ========================================
    // ANIMATION SEQUENCE (All simultaneous)
    // ========================================

    console.log('========================================');
    console.log('🎨 ADDING ANIMATIONS TO TIMELINE');
    console.log('========================================');

    try {
        // 1. Hero Container: Scale down & slide left
        console.log('Adding animation 1/5: Hero container transform');
        console.log('  - Target: #hero-container');
        console.log('  - Properties: scale, translateX');
        console.log('  - Values: scale(' + scaleTarget + '), translateX(' + translateTarget + ')');
        console.log('  - Timeline position: 0 (simultaneous start)');
        console.log('  - Note: Vertical position maintained by ScrollTrigger pin');
        
        masterTimeline.to(heroContainer, {
            scale: scaleTarget,
            x: translateTarget,
            duration: 1,
            ease: 'power2.inOut',
            onStart: () => {
                console.log('▶️ Animation started: Hero scaling & sliding');
                console.log('  Current scale: 1 → Target: ' + scaleTarget);
                console.log('  Current x: 0 → Target: ' + translateTarget);
            },
            onComplete: () => {
                console.log('✓ Animation complete: Hero container transform');
            }
        }, 0); // Start at timeline position 0

        // 2. Section Container: Fade in during hero animation
        console.log('Adding animation 2/5: Section container fade');
        console.log('  - Target: #what-i-do-section');
        console.log('  - Properties: opacity');
        console.log('  - From: opacity(0)');
        console.log('  - To: opacity(1)');
        console.log('  - Timeline position: 0.3 (starts early)');
        
        masterTimeline.fromTo(whatIDoSection,
            {
                opacity: 0
            },
            {
                opacity: 1,
                duration: 0.6,
                ease: 'power2.out'
            },
            0.3 // Start early in the animation
        );

        // 3. Section Title: Fade in from back
        console.log('Adding animation 3/5: Section title reveal');
        console.log('  - Target: #section-title');
        console.log('  - Properties: opacity, scale, y');
        console.log('  - From: opacity(0), scale(0.9), y(-30)');
        console.log('  - To: opacity(1), scale(1), y(0)');
        console.log('  - Timeline position: 0.5 (starts halfway through)');
        
        masterTimeline.fromTo(sectionTitle,
            {
                opacity: 0,
                scale: 0.9,
                y: -30
            },
            {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
                onStart: () => {
                    console.log('▶️ Animation started: Title fading in');
                },
                onComplete: () => {
                    console.log('✓ Animation complete: Section title reveal');
                }
            },
            0.5 // Start halfway through the animation
        );

        // 4. Section Body: Slide up from below
        console.log('Adding animation 4/5: Section body reveal');
        console.log('  - Target: #section-body');
        console.log('  - Properties: opacity, y');
        console.log('  - From: opacity(0), y(50)');
        console.log('  - To: opacity(1), y(0)');
        console.log('  - Timeline position: 0.6 (slightly delayed)');
        
        masterTimeline.fromTo(sectionBody,
            {
                opacity: 0,
                y: 50
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
                onStart: () => {
                    console.log('▶️ Animation started: Body sliding up');
                },
                onComplete: () => {
                    console.log('✓ Animation complete: Section body reveal');
                }
            },
            0.6 // Start slightly after title
        );

        // ========================================
        // EXPERTISE CARDS: Stagger animation
        // ========================================
        if (expertiseItems.length > 0) {
            console.log('Adding animation 5/5: Expertise cards stagger');
            console.log('  - Target: .expertise-item (count: ' + expertiseItems.length + ')');
            console.log('  - Properties: opacity, y');
            console.log('  - From: opacity(0), y(30)');
            console.log('  - To: opacity(1), y(0)');
            console.log('  - Stagger: 0.15s between cards');
            console.log('  - Timeline position: 0.7 (delayed start)');
            
            masterTimeline.fromTo(expertiseItems,
                {
                    opacity: 0,
                    y: 30
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.15,      // 0.15s delay between each card
                    ease: 'power2.out',
                    onComplete: () => {
                        console.log('✓ Animation complete: All ' + expertiseItems.length + ' expertise cards animated');
                    }
                },
                0.7 // Start later in the timeline
            );
        } else {
            console.warn('⚠️ No expertise cards found - skipping card animations');
        }

        console.log('========================================');
        console.log('✅ ANIMATION INITIALIZATION COMPLETE');
        console.log('========================================');
        console.log('Total animations added: 5');
        console.log('Timeline duration:', masterTimeline.duration() + 's');
        console.log('Active ScrollTriggers:', ScrollTrigger.getAll().length);
        console.log('Animation state: Ready and waiting for scroll');
        console.log('========================================');
    } catch (error) {
        console.error('❌ Error adding animations to timeline:', error);
        console.error('Error context:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        throw new Error('Animation sequence failed: ' + error.message);
    }

    // ========================================
    // RESPONSIVE: Refresh on resize
    // ========================================

    console.log('Setting up viewport resize handler...');
    console.log('Note: ScrollTrigger handles resize automatically with invalidateOnRefresh');
    
    // ScrollTrigger automatically handles resize events when invalidateOnRefresh is true
    // Manual refresh is only needed for custom logic or dynamic parameter changes
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        // Log resize event for debugging
        console.log('========================================');
        console.log('📐 VIEWPORT RESIZE DETECTED');
        console.log('========================================');
        console.log('Viewport dimensions:', {
            width: window.innerWidth,
            height: window.innerHeight,
            timestamp: new Date().toISOString()
        });

        // Clear previous timeout to debounce
        clearTimeout(resizeTimeout);
        console.log('Debounce timer reset - waiting 250ms...');
        
        // Debounced resize handler (250ms timeout)
        resizeTimeout = setTimeout(() => {
            console.log('Debounced resize handler executing...');
            
            // Detect if device type changed (mobile/desktop)
            const wasMobile = scaleTarget === 0.25;
            const isNowMobile = window.innerWidth <= 768;
            
            if (wasMobile !== isNowMobile) {
                console.log('⚠️ Device type changed:', {
                    from: wasMobile ? 'mobile' : 'desktop',
                    to: isNowMobile ? 'mobile' : 'desktop',
                    breakpoint: '768px',
                    currentWidth: window.innerWidth + 'px'
                });
                console.log('Note: ScrollTrigger will auto-refresh with invalidateOnRefresh: true');
            } else {
                console.log('Device type unchanged:', isNowMobile ? 'mobile' : 'desktop');
            }
            
            // Log active ScrollTrigger count
            const activeTriggers = ScrollTrigger.getAll();
            console.log('Active ScrollTriggers:', activeTriggers.length);
            
            // Log each trigger's configuration
            activeTriggers.forEach((trigger, index) => {
                console.log(`  Trigger ${index + 1}:`, {
                    element: trigger.trigger ? trigger.trigger.id : 'unknown',
                    start: trigger.vars.start,
                    end: trigger.vars.end,
                    scrub: trigger.vars.scrub
                });
            });
            
            console.log('Resize handling complete');
            console.log('========================================');
            
        }, 250); // 250ms debounce timeout
    });
    
    console.log('✓ Resize handler registered successfully');
}

/**
 * Activate Fallback Mode
 * Called when GSAP/ScrollTrigger fails to load or encounters errors
 * Ensures all content remains accessible without animations
 * 
 * @param {string} reason - The reason for activating fallback mode
 */
function activateFallbackMode(reason) {
    console.log('========================================');
    console.log('FALLBACK MODE ACTIVATED');
    console.log('Reason:', reason);
    console.log('========================================');
    console.log('All content will be displayed immediately with full opacity.');
    console.log('Animations are disabled, but all content remains accessible.');

    // Get all elements that would normally be animated
    const whatIDoSection = document.getElementById('what-i-do-section');
    const sectionTitle = document.getElementById('section-title');
    const sectionBody = document.getElementById('section-body');
    const expertiseItems = document.querySelectorAll('.expertise-item');
    const heroContainer = document.getElementById('hero-container');

    // Display all content immediately with opacity 1
    if (whatIDoSection) {
        whatIDoSection.style.opacity = '1';
        whatIDoSection.style.visibility = 'visible';
    }

    if (sectionTitle) {
        sectionTitle.style.opacity = '1';
        sectionTitle.style.transform = 'none';
        sectionTitle.style.visibility = 'visible';
    }

    if (sectionBody) {
        sectionBody.style.opacity = '1';
        sectionBody.style.transform = 'none';
        sectionBody.style.visibility = 'visible';
    }

    // Ensure expertise cards are visible
    expertiseItems.forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'none';
        item.style.visibility = 'visible';
    });

    // Keep hero container visible (no animation)
    if (heroContainer) {
        heroContainer.style.transform = 'none';
        heroContainer.style.opacity = '1';
    }

    console.log('Fallback mode complete - all content is now visible and accessible');
    console.log('Total elements made visible:', 
        [whatIDoSection, sectionTitle, sectionBody, heroContainer].filter(el => el).length + 
        expertiseItems.length
    );
}

/**
 * Fallback: No animation mode
 * Shows all content immediately for accessibility/errors
 * Used for reduced motion preference
 */
function fallbackNoAnimation() {
    console.log('Running fallback mode - showing all content immediately');

    const whatIDoSection = document.getElementById('what-i-do-section');
    const sectionTitle = document.getElementById('section-title');
    const sectionBody = document.getElementById('section-body');
    const expertiseItems = document.querySelectorAll('.expertise-item');

    // Show all elements immediately
    if (whatIDoSection) whatIDoSection.style.opacity = '1';
    if (sectionTitle) {
        sectionTitle.style.opacity = '1';
        sectionTitle.style.transform = 'none';
    }
    if (sectionBody) {
        sectionBody.style.opacity = '1';
        sectionBody.style.transform = 'none';
    }

    expertiseItems.forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'none';
    });

    console.log('Fallback mode complete - all content visible');
}

/**
 * Debug function: Toggle ScrollTrigger markers
 * Call from browser console: toggleMarkers()
 */
window.toggleMarkers = function () {
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.getAll().forEach(trigger => {
            trigger.vars.markers = !trigger.vars.markers;
        });
        ScrollTrigger.refresh();
        console.log('ScrollTrigger markers toggled');
    }
};

/**
 * Debug function: Log all ScrollTrigger instances
 * Call from browser console: logScrollTriggers()
 */
window.logScrollTriggers = function () {
    if (typeof ScrollTrigger !== 'undefined') {
        const triggers = ScrollTrigger.getAll();
        console.log(`Active ScrollTriggers: ${triggers.length}`);
        triggers.forEach((trigger, index) => {
            console.log(`Trigger ${index + 1}:`, {
                trigger: trigger.trigger,
                start: trigger.vars.start,
                end: trigger.vars.end,
                scrub: trigger.vars.scrub
            });
        });
    }
};

// Log initialization
console.log('≡ƒô£ about-parallax.js loaded');
