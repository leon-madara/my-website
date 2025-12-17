/**
 * Hero Role Fade Sequence Controller
 * 
 * Cycles through role titles with smooth GSAP-powered fades.
 * 
 * Timeline:
 * - Role 1: shown on load, hold 5s
 * - Fade 2s to Role 2, hold 3s
 * - Fade 2s to Role 3, hold 3s
 * - Fade 2s to Role 4, hold 3s
 * - Loop back to Role 1 (fade 2s, hold 5s) and repeat
 * 
 * Features:
 * - GSAP-powered smooth opacity fades
 * - Pauses on visibility change (tab hidden)
 * - Respects prefers-reduced-motion
 * - Graceful fallbacks for errors or missing GSAP
 * - Cleanup on page unload
 */

class RoleSequenceController {
    constructor() {
        // Configuration
        this.config = {
            containerSelector: '.role-sequence',
            itemSelector: '.role-item',
            activeClass: 'active',
            fadeDuration: 2,        // seconds for fade transition
            role1HoldTime: 5,       // seconds to hold role 1 (first display)
            otherHoldTime: 3,       // seconds to hold roles 2, 3, 4
        };

        // State
        this.container = null;
        this.roleItems = [];
        this.currentIndex = 0;
        this.timeline = null;
        this.isPaused = false;
        this.isDestroyed = false;
        this.reducedMotion = false;

        // Bind methods for event listeners
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
        this.destroy = this.destroy.bind(this);

        this.init();
    }

    /**
     * Initialize the controller
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    /**
     * Setup the animation system
     */
    setup() {
        try {
            // Check for prefers-reduced-motion
            this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            // Get DOM elements
            this.container = document.querySelector(this.config.containerSelector);
            
            if (!this.container) {
                console.warn('RoleSequence: Container not found, skipping animation');
                return;
            }

            this.roleItems = Array.from(this.container.querySelectorAll(this.config.itemSelector));

            if (this.roleItems.length < 2) {
                console.warn('RoleSequence: Less than 2 role items found, skipping animation');
                this.showFallback();
                return;
            }

            // Check for GSAP availability
            if (typeof gsap === 'undefined') {
                console.warn('RoleSequence: GSAP not available, showing fallback');
                this.showFallback();
                return;
            }

            // If reduced motion is preferred, show only first role and skip animation
            if (this.reducedMotion) {
                console.info('RoleSequence: Reduced motion preferred, showing static role');
                this.showFallback();
                return;
            }

            // Initialize styles
            this.initializeStyles();

            // Setup event listeners
            this.setupEventListeners();

            // Start the animation sequence
            this.startSequence();

            console.log('RoleSequence: Controller initialized with', this.roleItems.length, 'roles');

        } catch (error) {
            console.error('RoleSequence: Setup error:', error);
            this.showFallback();
        }
    }

    /**
     * Initialize inline styles for animation
     */
    initializeStyles() {
        this.roleItems.forEach((item, index) => {
            if (index === 0) {
                // First item starts visible
                gsap.set(item, { 
                    opacity: 1, 
                    visibility: 'visible',
                    position: 'relative'
                });
                item.classList.add(this.config.activeClass);
            } else {
                // Other items start hidden
                gsap.set(item, { 
                    opacity: 0, 
                    visibility: 'hidden',
                    position: 'absolute'
                });
                item.classList.remove(this.config.activeClass);
            }
        });
    }

    /**
     * Setup event listeners for visibility and cleanup
     */
    setupEventListeners() {
        // Pause/resume on visibility change
        document.addEventListener('visibilitychange', this.handleVisibilityChange);

        // Cleanup on page unload
        window.addEventListener('beforeunload', this.handleBeforeUnload);
        window.addEventListener('pagehide', this.handleBeforeUnload);

        // Listen for reduced motion preference changes
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (motionQuery.addEventListener) {
            motionQuery.addEventListener('change', (e) => {
                if (e.matches) {
                    this.destroy();
                    this.showFallback();
                }
            });
        }
    }

    /**
     * Handle page visibility changes (tab switching)
     */
    handleVisibilityChange() {
        if (this.isDestroyed) return;

        if (document.hidden) {
            this.pause();
        } else {
            this.resume();
        }
    }

    /**
     * Handle page unload - cleanup
     */
    handleBeforeUnload() {
        this.destroy();
    }

    /**
     * Start the animation sequence
     */
    startSequence() {
        if (this.isDestroyed) return;

        this.buildTimeline();
    }

    /**
     * Build the GSAP timeline for the role sequence
     */
    buildTimeline() {
        // Kill any existing timeline
        if (this.timeline) {
            this.timeline.kill();
        }

        this.timeline = gsap.timeline({
            repeat: -1,  // Infinite loop
            onComplete: () => {
                // This won't fire due to infinite loop, but here for safety
            }
        });

        const items = this.roleItems;
        const fadeDuration = this.config.fadeDuration;
        const role1Hold = this.config.role1HoldTime;
        const otherHold = this.config.otherHoldTime;

        // Role 1 is already showing, so we start with hold time
        // Timeline structure:
        // [Hold role1 5s] -> [Fade to role2 2s] -> [Hold 3s] -> [Fade to role3 2s] -> [Hold 3s] -> [Fade to role4 2s] -> [Hold 3s] -> [Fade to role1 2s] -> repeat

        // Initial hold for role 1 (5 seconds)
        this.timeline.to({}, { duration: role1Hold });

        // Transition through each role
        for (let i = 0; i < items.length; i++) {
            const currentItem = items[i];
            const nextIndex = (i + 1) % items.length;
            const nextItem = items[nextIndex];
            
            // Determine hold time for next role
            const holdTime = nextIndex === 0 ? role1Hold : otherHold;

            // Cross-fade: fade out current, fade in next
            this.timeline.add(() => {
                this.updateAriaLabel(nextItem);
            });

            // Fade out current item
            this.timeline.to(currentItem, {
                opacity: 0,
                duration: fadeDuration,
                ease: 'power2.inOut',
                onStart: () => {
                    // Prepare next item for fade in
                    gsap.set(nextItem, { 
                        visibility: 'visible',
                        position: 'absolute' 
                    });
                },
                onComplete: () => {
                    currentItem.classList.remove(this.config.activeClass);
                    gsap.set(currentItem, { 
                        visibility: 'hidden',
                        position: 'absolute'
                    });
                }
            }, `fade${i}`);

            // Fade in next item (overlapping with fade out for smooth cross-fade)
            this.timeline.to(nextItem, {
                opacity: 1,
                duration: fadeDuration,
                ease: 'power2.inOut',
                onComplete: () => {
                    nextItem.classList.add(this.config.activeClass);
                    gsap.set(nextItem, { position: 'relative' });
                    this.currentIndex = nextIndex;
                }
            }, `fade${i}`);

            // Hold time for the new role (only if not the last iteration before loop)
            // The loop will handle role 1's hold automatically
            if (nextIndex !== 0) {
                this.timeline.to({}, { duration: holdTime });
            }
        }
    }

    /**
     * Update ARIA label for accessibility
     */
    updateAriaLabel(activeItem) {
        if (this.container && activeItem) {
            const roleText = activeItem.textContent.trim().replace(/\s+/g, ' ');
            this.container.setAttribute('aria-label', roleText);
        }
    }

    /**
     * Pause the animation
     */
    pause() {
        if (this.timeline && !this.isPaused) {
            this.timeline.pause();
            this.isPaused = true;
            console.log('RoleSequence: Paused');
        }
    }

    /**
     * Resume the animation
     */
    resume() {
        if (this.timeline && this.isPaused && !this.isDestroyed) {
            this.timeline.resume();
            this.isPaused = false;
            console.log('RoleSequence: Resumed');
        }
    }

    /**
     * Show fallback state (only first role visible, no animation)
     */
    showFallback() {
        if (this.container) {
            this.container.classList.add('no-animation');
        }

        this.roleItems.forEach((item, index) => {
            if (index === 0) {
                item.style.opacity = '1';
                item.style.visibility = 'visible';
                item.style.position = 'relative';
                item.style.display = 'block';
                item.classList.add(this.config.activeClass);
            } else {
                item.style.opacity = '0';
                item.style.visibility = 'hidden';
                item.style.display = 'none';
            }
        });

        // Update ARIA
        if (this.container && this.roleItems.length > 0) {
            const roleText = this.roleItems[0].textContent.trim().replace(/\s+/g, ' ');
            this.container.setAttribute('aria-label', roleText);
        }
    }

    /**
     * Destroy the controller and clean up
     */
    destroy() {
        if (this.isDestroyed) return;

        this.isDestroyed = true;

        // Kill GSAP timeline
        if (this.timeline) {
            this.timeline.kill();
            this.timeline = null;
        }

        // Remove event listeners
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
        window.removeEventListener('pagehide', this.handleBeforeUnload);

        console.log('RoleSequence: Controller destroyed');
    }

    /**
     * Get current role index
     */
    getCurrentIndex() {
        return this.currentIndex;
    }

    /**
     * Get current role text
     */
    getCurrentRoleText() {
        if (this.roleItems[this.currentIndex]) {
            return this.roleItems[this.currentIndex].textContent.trim().replace(/\s+/g, ' ');
        }
        return '';
    }
}

// Initialize the controller when script loads
let roleSequenceController = null;

// Only initialize if on a page with the role sequence
if (document.querySelector('.role-sequence')) {
    roleSequenceController = new RoleSequenceController();
} else {
    // Wait for DOM and check again
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (document.querySelector('.role-sequence')) {
                roleSequenceController = new RoleSequenceController();
            }
        });
    }
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RoleSequenceController;
}
