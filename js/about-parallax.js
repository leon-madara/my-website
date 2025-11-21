/**
 * About Page - Parallax Scroll Animation
 * Leon Madara Portfolio
 * Using GSAP ScrollTrigger for smooth, performant animations
 */

// Wait for DOM and GSAP to load
document.addEventListener('DOMContentLoaded', () => {
    console.log('About page loaded, initializing parallax...');

    // Check if GSAP and ScrollTrigger are available
    if (typeof gsap === 'undefined') {
        console.error('GSAP not loaded - parallax animation disabled');
        fallbackNoAnimation();
        return;
    }

    if (typeof ScrollTrigger === 'undefined') {
        console.error('ScrollTrigger not loaded - parallax animation disabled');
        fallbackNoAnimation();
        return;
    }

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        console.log('Reduced motion detected - using simplified animations');
        fallbackNoAnimation();
        return;
    }

    // Initialize parallax animation
    initParallaxHero();
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

    // Validate elements exist
    if (!heroContainer || !sectionTitle || !sectionBody || !whatIDoSection) {
        console.error('Required elements not found - aborting parallax');
        fallbackNoAnimation();
        return;
    }

    console.log('All elements found, creating animation timeline...');

    // Detect mobile device
    const isMobile = window.innerWidth <= 768;

    // Adjust animation parameters for mobile
    const scaleTarget = isMobile ? 0.25 : 0.35;
    const translateTarget = isMobile ? '-120vw' : '-150vw';
    const scrubSpeed = isMobile ? 0.5 : 1;

    // ========================================
    // CREATE MASTER TIMELINE
    // ========================================

    const masterTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: whatIDoSection,
            start: 'top bottom',    // When section top hits viewport bottom
            end: 'top top',         // When section top hits viewport top
            scrub: scrubSpeed,      // Smooth scrubbing
            markers: false,         // Set to true for debugging

            // Callbacks for debugging
            onEnter: () => console.log('Parallax animation started'),
            onLeave: () => console.log('Parallax animation completed'),
            onEnterBack: () => console.log('Scrolling back up'),
            onLeaveBack: () => console.log('Back to hero'),

            onUpdate: (self) => {
                // Optional: Log progress for debugging
                // console.log('Scroll progress:', (self.progress * 100).toFixed(1) + '%');
            }
        }
    });

    // ========================================
    // ANIMATION SEQUENCE (All simultaneous)
    // ========================================

    // 1. Hero Container: Scale down & slide left
    masterTimeline.to(heroContainer, {
        scale: scaleTarget,
        x: translateTarget,
        duration: 1,
        ease: 'power2.inOut',
        onStart: () => console.log('Hero scaling & sliding...'),
        onComplete: () => console.log('Hero animation complete')
    }, 0); // Start at timeline position 0

    // 2. Section Title: Fade in from back
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
            duration: 1,
            ease: 'power2.out',
            onStart: () => console.log('Title fading in...'),
            onComplete: () => console.log('Title animation complete')
        },
        0 // Start at timeline position 0 (simultaneous)
    );

    // 3. Section Body: Slide up from below
    masterTimeline.fromTo(sectionBody,
        {
            opacity: 0,
            y: 50
        },
        {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            onStart: () => console.log('Body sliding up...'),
            onComplete: () => console.log('Body animation complete')
        },
        0 // Start at timeline position 0 (simultaneous)
    );

    // 4. Section Container: Fade in
    masterTimeline.fromTo(whatIDoSection,
        {
            opacity: 0
        },
        {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out'
        },
        0 // Start at timeline position 0 (simultaneous)
    );

    // ========================================
    // EXPERTISE CARDS: Stagger animation
    // ========================================

    if (expertiseItems.length > 0) {
        masterTimeline.fromTo(expertiseItems,
            {
                opacity: 0,
                y: 30
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.15,      // 0.15s delay between each card
                ease: 'power2.out',
                onComplete: () => console.log('All expertise cards animated')
            },
            0.3 // Start slightly after main content (0.3s into timeline)
        );
    }

    console.log('✅ Parallax hero animation initialized successfully');

    // ========================================
    // RESPONSIVE: Refresh on resize
    // ========================================

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            ScrollTrigger.refresh();
            console.log('ScrollTrigger refreshed after resize');
        }, 250);
    });
}

/**
 * Fallback: No animation mode
 * Shows all content immediately for accessibility/errors
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
console.log('📜 about-parallax.js loaded');
