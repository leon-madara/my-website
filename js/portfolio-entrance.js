/**
 * Portfolio Page 3D Entrance Animation
 * Leon Madara Portfolio
 *
 * Features:
 * - 3D box flip transition with PortFolioImageDesign.svg splash screen
 * - Multi-layer parallax depth during flip
 * - Persistent home page backgrounds at reduced opacity
 * - Skip functionality with button state management
 * - Session persistence
 * - Accessibility compliance (reduced motion, keyboard navigation)
 */

class PortfolioEntranceAnimation {
    constructor() {
        // Configuration
        this.config = {
            splashDisplayDuration: 2000,      // 2 seconds
            logoEntranceDuration: 500,        // 0.5 seconds
            flipDuration: 800,                // 0.8 seconds
            cleanupDelay: 500,                // 0.5 seconds
            logoEntranceDelay: 100,           // Start logo after 100ms
            buttonEntranceDelay: 400,         // Start button after 400ms
            sessionStorageKey: 'portfolio_entrance_seen'
        };

        // State
        this.autoSkipTimer = null;
        this.isSkipping = false;
        this.entranceWrapper = null;
        this.skipButton = null;
    }

    /**
     * Initialize the entrance animation
     */
    async init() {
        console.log('🎬 Portfolio Entrance Animation - Initializing...');

        // Check if we should skip the entrance entirely
        if (this.shouldSkipEntrance()) {
            console.log('⏭️ Skipping entrance animation');
            this.showPortfolioImmediately();
            return;
        }

        // Check for reduced motion preference
        if (this.prefersReducedMotion()) {
            console.log('♿ Reduced motion detected - skipping animations');
            this.showPortfolioImmediately();
            return;
        }

        // Check for 3D transform support
        if (!this.supports3DTransforms()) {
            console.warn('⚠️ 3D transforms not supported - skipping entrance');
            this.showPortfolioImmediately();
            return;
        }

        // Build and insert entrance DOM
        this.buildEntranceDOM();

        // Setup event listeners
        this.setupEventListeners();

        // Start the animation sequence
        await this.startEntranceSequence();
    }

    /**
     * Check if entrance should be skipped
     */
    shouldSkipEntrance() {
        try {
            return sessionStorage.getItem(this.config.sessionStorageKey) === 'true';
        } catch (e) {
            console.warn('sessionStorage not available:', e);
            return false;
        }
    }

    /**
     * Check for reduced motion preference
     */
    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /**
     * Check for 3D transform support
     */
    supports3DTransforms() {
        const testElement = document.createElement('div');
        const transformProperties = [
            'transform',
            'webkitTransform',
            'mozTransform',
            'msTransform',
            'oTransform'
        ];

        for (let prop of transformProperties) {
            if (testElement.style[prop] !== undefined) {
                testElement.style[prop] = 'translate3d(1px, 1px, 1px)';
                if (testElement.style[prop] !== '') {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Show portfolio immediately without entrance
     */
    showPortfolioImmediately() {
        document.body.classList.add('entrance-complete');
        console.log('✅ Portfolio ready (no entrance)');
    }

    /**
     * Build entrance DOM structure
     */
    buildEntranceDOM() {
        console.log('🏗️ Building entrance DOM...');

        // Create main wrapper
        this.entranceWrapper = document.createElement('div');
        this.entranceWrapper.id = 'portfolio-entrance-wrapper';
        this.entranceWrapper.className = 'entrance-3d-container';
        this.entranceWrapper.setAttribute('role', 'presentation');
        this.entranceWrapper.setAttribute('aria-hidden', 'true');

        // Build HTML structure - logo only
        this.entranceWrapper.innerHTML = `
            <!-- 3D Flip Scene -->
            <div class="flip-scene-3d">
                <!-- Part A: Splash Face -->
                <div class="flip-face flip-face-front">
                    <div class="splash-content">
                        <img src="images/PortFolioImageDesign.svg"
                             alt="Portfolio Logo"
                             class="splash-logo"
                             loading="eager">
                    </div>
                </div>

                <!-- Part B: Portfolio Face (empty, will reveal existing content) -->
                <div class="flip-face flip-face-back"></div>
            </div>
        `;

        // Insert at beginning of body
        document.body.insertBefore(this.entranceWrapper, document.body.firstChild);

        // Cache skip button reference (null since button removed)
        this.skipButton = null;

        console.log('✅ Entrance DOM built');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        console.log('👂 Setting up event listeners...');

        // Keyboard support (Space/Enter) for skipping
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                if (!this.isSkipping && this.entranceWrapper && !this.entranceWrapper.classList.contains('completed')) {
                    e.preventDefault();
                    this.handleSkipClick();
                }
            }
        });

        console.log('✅ Event listeners ready');
    }

    /**
     * Start the full entrance animation sequence
     */
    async startEntranceSequence() {
        console.log('🎭 Starting entrance sequence...');

        try {
            // Phase A: Logo Entrance (0-0.5s)
            await this.animateLogoEntrance();

            // Phase B: Display Period (0.5-2.5s)
            await this.waitForDisplay();

            // Phase C: 3D Flip (2.5-3.3s)
            await this.animate3DFlip();

            // Phase D: Cleanup (3.3s+)
            await this.cleanup();

        } catch (error) {
            console.error('❌ Error in entrance sequence:', error);
            this.showPortfolioImmediately();
        }
    }

    /**
     * Phase A: Animate logo entrance (scale + fade)
     */
    animateLogoEntrance() {
        return new Promise((resolve) => {
            console.log('▶️ Phase A: Logo entrance');

            const logo = this.entranceWrapper.querySelector('.splash-logo');

            // Animate logo
            setTimeout(() => {
                if (logo) {
                    logo.classList.add('animate-in');
                    console.log('  ✓ Logo animating in');
                }
            }, this.config.logoEntranceDelay);

            // Resolve after entrance completes
            setTimeout(resolve, this.config.logoEntranceDuration);
        });
    }

    /**
     * Phase B: Wait for display period
     */
    waitForDisplay() {
        return new Promise((resolve) => {
            console.log('▶️ Phase B: Display period (2s)');

            // Start auto-skip timer
            this.autoSkipTimer = setTimeout(() => {
                console.log('  ⏱️ Auto-skip timer completed');
                resolve();
            }, this.config.splashDisplayDuration);

            // Store resolve function for manual skip
            this.displayResolve = resolve;
        });
    }

    /**
     * Phase C: Animate 3D flip
     */
    animate3DFlip() {
        return new Promise((resolve) => {
            console.log('▶️ Phase C: 3D flip animation');

            // Apply flipping class to trigger CSS transitions
            this.entranceWrapper.classList.add('flipping');

            // Resolve after flip completes
            setTimeout(() => {
                console.log('  ✓ Flip animation complete');
                resolve();
            }, this.config.flipDuration);
        });
    }

    /**
     * Phase D: Cleanup and show portfolio
     */
    async cleanup() {
        console.log('▶️ Phase D: Cleanup');

        // Mark as completed
        this.entranceWrapper.classList.add('completed');

        // Set session flag
        try {
            sessionStorage.setItem(this.config.sessionStorageKey, 'true');
            console.log('  ✓ Session flag set');
        } catch (e) {
            console.warn('  ⚠️ Could not set session flag:', e);
        }

        // Enable portfolio
        document.body.classList.add('entrance-complete');
        console.log('  ✓ Portfolio enabled');

        // Wait for fade out
        await this.wait(this.config.cleanupDelay);

        // Remove entrance DOM
        if (this.entranceWrapper && this.entranceWrapper.parentNode) {
            this.entranceWrapper.parentNode.removeChild(this.entranceWrapper);
            console.log('  ✓ Entrance DOM removed');
        }

        console.log('✅ Entrance animation complete!');
    }

    /**
     * Handle skip (keyboard triggered)
     */
    handleSkipClick() {
        if (this.isSkipping) return;

        console.log('⏭️ Skip triggered by user');
        this.isSkipping = true;

        // Clear auto-skip timer
        if (this.autoSkipTimer) {
            clearTimeout(this.autoSkipTimer);
            this.autoSkipTimer = null;
        }

        // Resolve display phase immediately
        if (this.displayResolve) {
            this.displayResolve();
        }
    }

    /**
     * Helper: Wait for specified duration
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ========================================
// AUTO-INITIALIZATION
// ========================================

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEntrance);
} else {
    initializeEntrance();
}

async function initializeEntrance() {
    console.log('📦 Portfolio Entrance Script Loaded');

    // Create and initialize animation
    const entrance = new PortfolioEntranceAnimation();
    await entrance.init();
}

// Expose class globally for debugging
window.PortfolioEntranceAnimation = PortfolioEntranceAnimation;

console.log('✅ portfolio-entrance.js loaded successfully');
