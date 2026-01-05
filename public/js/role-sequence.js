/**
 * Hero Role Scramble Sequence Controller
 * 
 * Cycles through role titles with subtle scramble text effect using GSAP ScrambleTextPlugin.
 * 
 * Timeline:
 * - Role 1: shown on load, hold 5s
 * - Scramble 1.5s to Role 2, hold 3s
 * - Scramble 1.5s to Role 3, hold 3s
 * - Scramble 1.5s to Role 4, hold 3s
 * - Loop back to Role 1 (scramble 1.5s, hold 5s) and repeat
 * 
 * Features:
 * - GSAP ScrambleTextPlugin-powered text scrambling
 * - Single element approach (no stacked elements)
 * - Pauses on visibility change (tab hidden)
 * - Respects prefers-reduced-motion
 * - Graceful fallbacks for errors or missing plugins
 * - Cleanup on page unload
 */

class RoleSequenceController {
    constructor() {
        // Configuration
        this.config = {
            containerSelector: '.role-sequence',
            scrambleDuration: 1.5,     // seconds for scramble transition
            role1HoldTime: 5,          // seconds to hold role 1 (first display)
            otherHoldTime: 3,          // seconds to hold roles 2, 3, 4
            // ScrambleTextPlugin configuration (subtle animation)
            scrambleConfig: {
                chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ",
                revealDelay: 0.5,
                speed: 0.4,
                delimiter: ""
            }
        };

        // Role data array (stored in JavaScript instead of DOM)
        this.roles = [
            "Full Stack AI Developer",
            "AI Engineer",
            "Web Developer & Designer",
            "Graphic Designer"
        ];

        // State
        this.container = null;
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
            
            // Get DOM element
            this.container = document.querySelector(this.config.containerSelector);
            
            if (!this.container) {
                console.warn('RoleSequence: Container not found, skipping animation');
                return;
            }

            // Check for GSAP availability
            if (typeof gsap === 'undefined') {
                console.warn('RoleSequence: GSAP not available, showing fallback');
                this.showFallback();
                return;
            }

            // Check for ScrambleTextPlugin availability
            if (typeof ScrambleTextPlugin === 'undefined') {
                console.warn('RoleSequence: ScrambleTextPlugin not available, showing fallback');
                this.showFallback();
                return;
            }

            // Register ScrambleTextPlugin if needed
            try {
                gsap.registerPlugin(ScrambleTextPlugin);
            } catch (error) {
                // Plugin may already be registered, or registration may not be needed
                console.log('RoleSequence: ScrambleTextPlugin registration:', error.message || 'already registered or not required');
            }

            // If reduced motion is preferred, show only first role and skip animation
            if (this.reducedMotion) {
                console.info('RoleSequence: Reduced motion preferred, showing static role');
                this.showFallback();
                return;
            }

            // Ensure container has initial text
            if (!this.container.textContent.trim()) {
                this.container.textContent = this.roles[0];
            }

            // Setup event listeners
            this.setupEventListeners();

            // Start the animation sequence
            this.startSequence();

            console.log('RoleSequence: Controller initialized with', this.roles.length, 'roles');

        } catch (error) {
            console.error('RoleSequence: Setup error:', error);
            this.showFallback();
        }
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

        const roles = this.roles;
        const scrambleDuration = this.config.scrambleDuration;
        const role1Hold = this.config.role1HoldTime;
        const otherHold = this.config.otherHoldTime;
        const scrambleConfig = this.config.scrambleConfig;

        // Timeline structure:
        // [Hold role1 5s] → [Scramble to role2 1.5s] → [Hold 3s] → [Scramble to role3 1.5s] → [Hold 3s] → [Scramble to role4 1.5s] → [Hold 3s] → [Scramble to role1 1.5s] → repeat

        // Initial hold for role 1 (5 seconds)
        this.timeline.to({}, { duration: role1Hold });

        // Transition through each role
        for (let i = 0; i < roles.length; i++) {
            const nextIndex = (i + 1) % roles.length;
            const nextRole = roles[nextIndex];
            
            // Determine hold time for next role
            const holdTime = nextIndex === 0 ? role1Hold : otherHold;

            // Scramble to next role
            this.timeline.to(this.container, {
                duration: scrambleDuration,
                scrambleText: {
                    text: nextRole,
                    chars: scrambleConfig.chars,
                    revealDelay: scrambleConfig.revealDelay,
                    speed: scrambleConfig.speed,
                    delimiter: scrambleConfig.delimiter
                },
                ease: 'none', // ScrambleTextPlugin handles its own easing
                onStart: () => {
                    // Update current index
                    this.currentIndex = nextIndex;
                },
                onComplete: () => {
                    // Update ARIA label when scramble completes
                    this.updateAriaLabel(nextRole);
                }
            }, `scramble${i}`);

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
    updateAriaLabel(roleText) {
        if (this.container && roleText) {
            const cleanText = roleText.trim().replace(/\s+/g, ' ');
            this.container.setAttribute('aria-label', cleanText);
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
            
            // Set text to first role
            this.container.textContent = this.roles[0];
            this.currentIndex = 0;
            
            // Update ARIA
            this.updateAriaLabel(this.roles[0]);
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
        if (this.roles[this.currentIndex]) {
            return this.roles[this.currentIndex];
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
