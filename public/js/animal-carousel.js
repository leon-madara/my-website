/**
 * Animal Carousel Module
 * Dynamic image carousel for the About page
 * Changes images based on scroll position and idle time
 */

const AnimalCarousel = {
    // Configuration
    images: [
        'images/lion1.PNG',
        'images/lion2.png',
        'images/giraffe1.png',
        'images/frog1.png',
        'images/frog2.png'
    ],
    altTexts: [
        'Lion portrait - Leon Madara',
        'Lion portrait alternate - Leon Madara',
        'Giraffe portrait - Leon Madara',
        'Frog portrait - Leon Madara',
        'Frog portrait alternate - Leon Madara'
    ],
    
    // State
    currentIndex: 0,
    idleTimer: null,
    idleTimeout: 20000, // 20 seconds
    isAnimating: false,
    observer: null,
    lastSectionIndex: -1,
    preloadedImages: [],
    prefersReducedMotion: false,
    
    // Sections to observe for scroll transitions
    sectionSelectors: [
        '.parallax-hero',
        '.what-i-do-section',
        '.skills-section',
        '.experience-section',
        '.education-section',
        '.projects-section',
        '.certifications-section'
    ],

    /**
     * Initialize the carousel
     */
    init() {
        console.log('🦁 Animal Carousel: Initializing...');
        
        // Check for reduced motion preference
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (this.prefersReducedMotion) {
            console.log('⚠️ Animal Carousel: Reduced motion preference detected');
        }
        
        // Get the carousel image element
        this.imageElement = document.getElementById('carousel-image');
        if (!this.imageElement) {
            console.error('❌ Animal Carousel: Image element #carousel-image not found');
            return;
        }
        
        // Preload all images
        this.preloadImages();
        
        // Setup Intersection Observer for section detection
        this.setupScrollObserver();
        
        // Start idle timer
        this.startIdleTimer();
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => this.cleanup());
        
        console.log('✓ Animal Carousel: Initialized successfully');
    },

    /**
     * Preload all carousel images
     */
    preloadImages() {
        console.log('🦁 Animal Carousel: Preloading images...');
        
        const loadPromises = this.images.map((src, index) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    console.log(`✓ Preloaded: ${src}`);
                    this.preloadedImages[index] = img;
                    resolve(img);
                };
                img.onerror = () => {
                    console.error(`❌ Failed to preload: ${src}`);
                    reject(new Error(`Failed to load ${src}`));
                };
                img.src = src;
            });
        });
        
        Promise.allSettled(loadPromises).then(results => {
            const loaded = results.filter(r => r.status === 'fulfilled').length;
            const failed = results.filter(r => r.status === 'rejected').length;
            console.log(`🦁 Animal Carousel: Preloaded ${loaded}/${this.images.length} images (${failed} failed)`);
            
            // Filter out failed images
            if (failed > 0) {
                const validImages = [];
                const validAltTexts = [];
                results.forEach((result, index) => {
                    if (result.status === 'fulfilled') {
                        validImages.push(this.images[index]);
                        validAltTexts.push(this.altTexts[index]);
                    }
                });
                
                if (validImages.length > 0) {
                    this.images = validImages;
                    this.altTexts = validAltTexts;
                    console.log(`🦁 Animal Carousel: Continuing with ${this.images.length} valid images`);
                } else {
                    console.error('❌ Animal Carousel: All images failed to load');
                }
            }
        });
    },

    /**
     * Change to the next/previous image with animation
     * @param {number} direction - 1 for next, -1 for previous
     */
    changeImage(direction) {
        // Prevent concurrent transitions
        if (this.isAnimating) {
            console.log('🦁 Animal Carousel: Animation in progress, skipping');
            return;
        }
        
        if (!this.imageElement || this.images.length === 0) {
            console.warn('⚠️ Animal Carousel: Cannot change image - missing element or images');
            return;
        }
        
        this.isAnimating = true;
        
        // Calculate new index with wraparound
        const newIndex = (this.currentIndex + direction + this.images.length) % this.images.length;
        console.log(`🦁 Animal Carousel: Changing from ${this.currentIndex} to ${newIndex} (direction: ${direction})`);
        
        // Get animation duration based on reduced motion preference
        const duration = this.prefersReducedMotion ? 0.01 : 0.3;
        
        // Check if GSAP is available
        if (typeof gsap !== 'undefined') {
            // GSAP fade out
            gsap.to(this.imageElement, {
                opacity: 0,
                scale: 0.95,
                duration: duration,
                ease: 'power2.in',
                onComplete: () => {
                    // Swap image
                    this.imageElement.src = this.images[newIndex];
                    this.imageElement.alt = this.altTexts[newIndex];
                    this.imageElement.setAttribute('aria-label', this.altTexts[newIndex]);
                    this.currentIndex = newIndex;
                    
                    // GSAP fade in
                    gsap.to(this.imageElement, {
                        opacity: 1,
                        scale: 1,
                        duration: duration,
                        ease: 'power2.out',
                        onComplete: () => {
                            this.isAnimating = false;
                            console.log(`✓ Animal Carousel: Image changed to ${this.images[newIndex]}`);
                        }
                    });
                }
            });
        } else {
            // Fallback: instant swap
            this.imageElement.src = this.images[newIndex];
            this.imageElement.alt = this.altTexts[newIndex];
            this.imageElement.setAttribute('aria-label', this.altTexts[newIndex]);
            this.currentIndex = newIndex;
            this.isAnimating = false;
            console.log(`✓ Animal Carousel: Image changed to ${this.images[newIndex]} (no GSAP)`);
        }
        
        // Reset idle timer after image change
        this.resetIdleTimer();
    },

    /**
     * Start the idle timer (20 seconds)
     */
    startIdleTimer() {
        this.idleTimer = setTimeout(() => {
            console.log('🦁 Animal Carousel: Idle timer triggered - advancing image');
            this.changeImage(1);
            // Restart timer for continuous cycling when idle
            this.startIdleTimer();
        }, this.idleTimeout);
    },

    /**
     * Reset the idle timer
     */
    resetIdleTimer() {
        if (this.idleTimer) {
            clearTimeout(this.idleTimer);
            this.idleTimer = null;
        }
        this.startIdleTimer();
    },

    /**
     * Setup Intersection Observer for section detection
     */
    setupScrollObserver() {
        // Check for Intersection Observer support
        if (!('IntersectionObserver' in window)) {
            console.warn('⚠️ Animal Carousel: IntersectionObserver not supported, using scroll fallback');
            this.setupScrollFallback();
            return;
        }
        
        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px', // Trigger when section is centered
            threshold: 0
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionIndex = this.sectionSelectors.findIndex(
                        sel => entry.target.matches(sel)
                    );
                    
                    if (sectionIndex !== -1 && sectionIndex !== this.lastSectionIndex) {
                        const direction = sectionIndex > this.lastSectionIndex ? 1 : -1;
                        console.log(`🦁 Animal Carousel: Section changed from ${this.lastSectionIndex} to ${sectionIndex}`);
                        
                        // Only change image if we've actually moved sections (not on initial load)
                        if (this.lastSectionIndex !== -1) {
                            this.changeImage(direction);
                        }
                        
                        this.lastSectionIndex = sectionIndex;
                        this.resetIdleTimer();
                    }
                }
            });
        }, observerOptions);
        
        // Observe all sections
        this.sectionSelectors.forEach(selector => {
            const section = document.querySelector(selector);
            if (section) {
                this.observer.observe(section);
                console.log(`✓ Animal Carousel: Observing ${selector}`);
            } else {
                console.warn(`⚠️ Animal Carousel: Section not found: ${selector}`);
            }
        });
    },

    /**
     * Fallback scroll handler for browsers without IntersectionObserver
     */
    setupScrollFallback() {
        let lastScrollY = window.scrollY;
        let scrollTimeout = null;
        
        const handleScroll = () => {
            // Debounce
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            
            scrollTimeout = setTimeout(() => {
                const currentScrollY = window.scrollY;
                const direction = currentScrollY > lastScrollY ? 1 : -1;
                
                // Simple threshold-based detection
                const scrollDelta = Math.abs(currentScrollY - lastScrollY);
                if (scrollDelta > window.innerHeight * 0.3) {
                    this.changeImage(direction);
                    lastScrollY = currentScrollY;
                }
                
                this.resetIdleTimer();
            }, 100);
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    },

    /**
     * Cleanup timers and observers
     */
    cleanup() {
        console.log('🦁 Animal Carousel: Cleaning up...');
        
        if (this.idleTimer) {
            clearTimeout(this.idleTimer);
            this.idleTimer = null;
        }
        
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
        
        console.log('✓ Animal Carousel: Cleanup complete');
    }
};

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimalCarousel;
}
