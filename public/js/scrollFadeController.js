/**
 * Scroll Fade Controller
 * Reusable component for fade-in/fade-out behavior on scroll
 * 
 * Features:
 * - Fades out elements when scrolling down
 * - Keeps elements visible when scrolling up
 * - Fades in elements after scroll stops (with configurable delay)
 * 
 * @param {Object} options - Configuration options
 * @param {string|NodeList|Array} options.targets - CSS selector(s) or element(s) to control
 * @param {number} options.fadeDelay - Delay in ms before fading in after scroll stops (default: 1500)
 * @param {number} options.fadeDuration - Duration of fade transition in ms (default: 300)
 * @param {number} options.scrollThreshold - Minimum scroll distance to trigger fade (default: 10)
 * @param {string} options.hiddenClass - CSS class to apply when hidden (default: 'scroll-fade-hidden')
 * @param {string} options.targetClass - CSS class to apply to targets (default: 'scroll-fade-target')
 */
function initScrollFadeController(options = {}) {
    // Default configuration
    const config = {
        targets: options.targets || [],
        fadeDelay: options.fadeDelay || 1500,
        fadeDuration: options.fadeDuration || 300,
        scrollThreshold: options.scrollThreshold || 10,
        hiddenClass: options.hiddenClass || 'scroll-fade-hidden',
        targetClass: options.targetClass || 'scroll-fade-target'
    };

    // Validate targets
    if (!config.targets || (typeof config.targets === 'string' && config.targets.length === 0)) {
        console.warn('⚠️ ScrollFadeController: No targets provided');
        return null;
    }

    // Get elements
    let elements = [];
    if (typeof config.targets === 'string') {
        // Single CSS selector string
        elements = Array.from(document.querySelectorAll(config.targets));
    } else if (config.targets instanceof NodeList) {
        // NodeList of elements
        elements = Array.from(config.targets);
    } else if (Array.isArray(config.targets)) {
        // Array of selectors or elements
        config.targets.forEach(target => {
            if (typeof target === 'string') {
                // CSS selector string
                const found = document.querySelectorAll(target);
                elements.push(...Array.from(found));
            } else if (target instanceof Element) {
                // DOM element
                elements.push(target);
            }
        });
    } else if (config.targets instanceof Element) {
        // Single DOM element
        elements = [config.targets];
    }

    if (elements.length === 0) {
        console.warn('⚠️ ScrollFadeController: No valid elements found');
        return null;
    }

    console.log(`🔄 ScrollFadeController: Initializing for ${elements.length} element(s)`);

    // Apply target class to all elements
    elements.forEach(el => {
        if (!el.classList.contains(config.targetClass)) {
            el.classList.add(config.targetClass);
        }
    });

    // State tracking
    let lastScrollY = window.scrollY || window.pageYOffset;
    let scrollTimeout = null;
    let isHidden = false;

    /**
     * Show elements (fade in)
     */
    function showElements() {
        if (!isHidden) return; // Already visible
        isHidden = false;
        elements.forEach(el => {
            el.classList.remove(config.hiddenClass);
        });
        console.log('📈 ScrollFadeController: Showing elements');
    }

    /**
     * Hide elements (fade out)
     */
    function hideElements() {
        if (isHidden) return; // Already hidden
        isHidden = true;
        elements.forEach(el => {
            el.classList.add(config.hiddenClass);
        });
        console.log('📉 ScrollFadeController: Hiding elements');
    }

    /**
     * Handle scroll event
     */
    function handleScroll() {
        const currentScrollY = window.scrollY || window.pageYOffset;
        const scrollDelta = currentScrollY - lastScrollY;

        // Always update lastScrollY
        lastScrollY = currentScrollY;

        // Clear existing timeout on any scroll
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
            scrollTimeout = null;
        }

        // Only act if scroll delta exceeds threshold
        if (Math.abs(scrollDelta) < config.scrollThreshold) {
            return;
        }

        if (scrollDelta > 0) {
            // Scrolling down - hide elements
            hideElements();
            
            // Set timeout to show elements after scroll stops
            scrollTimeout = setTimeout(() => {
                showElements();
                console.log(`✨ ScrollFadeController: Scroll stopped - showing elements after ${config.fadeDelay}ms`);
            }, config.fadeDelay);
        } else {
            // Scrolling up - always show elements immediately
            showElements();
        }
    }

    // Throttle scroll events for performance
    let ticking = false;
    function throttledHandleScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }

    // Add scroll event listener
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });

    // Initialize: show elements on page load
    showElements();

    // Return controller object for potential cleanup
    return {
        show: showElements,
        hide: hideElements,
        destroy: () => {
            window.removeEventListener('scroll', throttledHandleScroll);
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            elements.forEach(el => {
                el.classList.remove(config.hiddenClass, config.targetClass);
            });
            console.log('🗑️ ScrollFadeController: Destroyed');
        }
    };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = initScrollFadeController;
}

