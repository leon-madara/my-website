/**
 * AI/Logo Animation Controller
 * 
 * Controls the switching animation between "AI" text and the logo icon.
 * - First minute: switches every 5 seconds
 * - After first minute: switches every 20 seconds
 * 
 * Animation behavior:
 * - Elements scale DOWN when becoming invisible
 * - Elements scale UP when becoming visible
 * 
 * Easing curves used:
 * - ease: cubic-bezier(.25, .1, .25, 1)
 */

class AIAnimationController {
    constructor() {
        this.aiText = null;
        this.aiLogo = null;
        this.isShowingAI = true;
        this.startTime = Date.now();
        this.animationTimeout = null;
        this.transitionDuration = 400; // ms for transition

        // Cubic-bezier easing curves
        this.easingCurves = {
            ease: 'cubic-bezier(.25, .1, .25, 1)',
            linear: 'cubic-bezier(0, 0, 1, 1)',
            easeIn: 'cubic-bezier(.42, 0, 1, 1)',
            easeOut: 'cubic-bezier(0, 0, .58, 1)',
            easeInOut: 'cubic-bezier(.42, 0, .58, 1)'
        };

        // Default easing for animations
        this.easing = this.easingCurves.ease;

        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.aiText = document.querySelector('.ai-text');
        this.aiLogo = document.querySelector('.ai-logo-pulse');

        if (!this.aiText || !this.aiLogo) {
            console.warn('AI Animation: Required elements not found');
            return;
        }

        // Remove CSS animations - we'll control this with JS
        this.aiText.style.animation = 'none';
        this.aiLogo.style.animation = 'none';

        // Set initial state - AI text visible (scaled up), logo hidden (scaled down)
        this.showAI(false);

        // Start the switching cycle
        this.startTime = Date.now();
        this.scheduleNextSwitch();

        console.log('AI Animation Controller initialized');
    }

    /**
     * Get the current interval based on elapsed time
     * First minute: 5 seconds
     * After first minute: 20 seconds
     */
    getCurrentInterval() {
        const elapsedMs = Date.now() - this.startTime;
        const oneMinuteMs = 60 * 1000;

        if (elapsedMs < oneMinuteMs) {
            return 5000; // 5 seconds
        } else {
            return 20000; // 20 seconds
        }
    }

    scheduleNextSwitch() {
        if (this.animationTimeout) {
            clearTimeout(this.animationTimeout);
        }

        const interval = this.getCurrentInterval();

        this.animationTimeout = setTimeout(() => {
            this.performSwitch();
            this.scheduleNextSwitch();
        }, interval);
    }

    performSwitch() {
        if (this.isShowingAI) {
            this.showLogo();
        } else {
            this.showAI();
        }
    }

    /**
     * Show AI text (scale up) and hide logo (scale down)
     */
    showAI(animate = true) {
        if (!this.aiText || !this.aiLogo) return;

        this.isShowingAI = true;

        const transition = animate
            ? `opacity ${this.transitionDuration}ms ${this.easing}, transform ${this.transitionDuration}ms ${this.easing}`
            : 'none';

        this.aiText.style.transition = transition;
        this.aiLogo.style.transition = transition;

        // Show AI text - scale UP to visible
        this.aiText.style.opacity = '1';
        this.aiText.style.transform = 'scale(1)';

        // Hide logo - scale DOWN to invisible
        this.aiLogo.style.opacity = '0';
        this.aiLogo.style.transform = 'translate(-50%, -50%) scale(0.5)';
    }

    /**
     * Show logo (scale up) and hide AI text (scale down)
     */
    showLogo(animate = true) {
        if (!this.aiText || !this.aiLogo) return;

        this.isShowingAI = false;

        const transition = animate
            ? `opacity ${this.transitionDuration}ms ${this.easing}, transform ${this.transitionDuration}ms ${this.easing}`
            : 'none';

        this.aiText.style.transition = transition;
        this.aiLogo.style.transition = transition;

        // Hide AI text - scale DOWN to invisible
        this.aiText.style.opacity = '0';
        this.aiText.style.transform = 'scale(0.5)';

        // Show logo - scale UP to visible
        this.aiLogo.style.opacity = '1';
        this.aiLogo.style.transform = 'translate(-50%, -50%) scale(1.2)';
    }

    /**
     * Clean up - stop the animation cycle
     */
    destroy() {
        if (this.animationTimeout) {
            clearTimeout(this.animationTimeout);
            this.animationTimeout = null;
        }
    }

    /**
     * Reset and restart the animation from the beginning
     */
    reset() {
        this.destroy();
        this.startTime = Date.now();
        this.showAI(false);
        this.scheduleNextSwitch();
    }
}

// Initialize the animation controller
const aiAnimationController = new AIAnimationController();

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIAnimationController;
}
