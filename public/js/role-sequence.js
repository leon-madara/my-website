/**
 * Hero Role Morph Sequence Controller
 *
 * Cycles through role titles with a two-layer morphing text effect.
 *
 * Timeline:
 * - Role 1: shown on load, hold 5s
 * - Morph 1.45s to Role 2, hold 3s
 * - Morph 1.45s to Role 3, hold 3s
 * - Morph 1.45s to Role 4, hold 3s
 * - Loop back to Role 1 and repeat
 */

class RoleSequenceController {
    constructor() {
        this.config = {
            containerSelector: '.role-sequence',
            currentTextSelector: '.role-sequence__text--current',
            nextTextSelector: '.role-sequence__text--next',
            screenReaderTextSelector: '.role-sequence__sr-text',
            morphDuration: 1450,
            role1HoldTime: 5000,
            otherHoldTime: 3000,
            filterId: 'role-sequence-threshold'
        };

        this.roles = [
            'Full Stack AI Developer',
            'AI Engineer',
            'Web Developer & Designer',
            'Graphic Designer'
        ];

        this.container = null;
        this.currentText = null;
        this.nextText = null;
        this.screenReaderText = null;
        this.motionQuery = null;
        this.currentIndex = 0;
        this.nextIndex = 1;
        this.phase = 'hold';
        this.phaseElapsed = 0;
        this.rafId = null;
        this.lastTimestamp = null;
        this.isPaused = false;
        this.isDestroyed = false;
        this.reducedMotion = false;
        this.hasStarted = false;

        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleMotionPreferenceChange = this.handleMotionPreferenceChange.bind(this);
        this.animate = this.animate.bind(this);
        this.destroy = this.destroy.bind(this);

        this.init();
    }

    init() {
        if (typeof document === 'undefined') {
            return;
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup(), { once: true });
        } else {
            this.setup();
        }
    }

    setup() {
        try {
            this.container = document.querySelector(this.config.containerSelector);

            if (!this.container) {
                console.warn('RoleSequence: Container not found, skipping animation');
                return;
            }

            this.currentText = this.container.querySelector(this.config.currentTextSelector);
            this.nextText = this.container.querySelector(this.config.nextTextSelector);
            this.screenReaderText = this.container.querySelector(this.config.screenReaderTextSelector);

            if (!this.currentText || !this.nextText || !this.screenReaderText) {
                console.warn('RoleSequence: Required text layers not found, falling back');
                this.showFallback();
                return;
            }

            this.motionQuery = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
                ? window.matchMedia('(prefers-reduced-motion: reduce)')
                : null;

            this.reducedMotion = Boolean(this.motionQuery && this.motionQuery.matches);

            this.injectFilter();
            this.setupEventListeners();
            this.resetVisualState();
            this.measureMaxRoleHeight();
            this.queueFontMeasurement();

            if (this.reducedMotion) {
                console.info('RoleSequence: Reduced motion preferred, showing static role');
                this.showFallback();
                return;
            }

            this.startSequence();

            console.log('RoleSequence: Controller initialized with', this.roles.length, 'roles');
        } catch (error) {
            console.error('RoleSequence: Setup error:', error);
            this.showFallback();
        }
    }

    setupEventListeners() {
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        window.addEventListener('beforeunload', this.handleBeforeUnload);
        window.addEventListener('pagehide', this.handleBeforeUnload);
        window.addEventListener('resize', this.handleResize);
        window.addEventListener('orientationchange', this.handleResize);

        if (!this.motionQuery) {
            return;
        }

        if (typeof this.motionQuery.addEventListener === 'function') {
            this.motionQuery.addEventListener('change', this.handleMotionPreferenceChange);
        } else if (typeof this.motionQuery.addListener === 'function') {
            this.motionQuery.addListener(this.handleMotionPreferenceChange);
        }
    }

    handleMotionPreferenceChange(event) {
        this.reducedMotion = Boolean(event && event.matches);

        if (this.reducedMotion) {
            this.stopAnimationFrame();
            this.showFallback();
            return;
        }

        this.resetVisualState();
        this.startSequence(true);
    }

    handleVisibilityChange() {
        if (this.isDestroyed) {
            return;
        }

        if (document.hidden) {
            this.pause();
        } else {
            this.resume();
        }
    }

    handleBeforeUnload() {
        this.destroy();
    }

    handleResize() {
        if (this.isDestroyed || !this.container) {
            return;
        }

        const remeasure = () => this.measureMaxRoleHeight();

        if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
            window.requestAnimationFrame(remeasure);
        } else {
            remeasure();
        }
    }

    queueFontMeasurement() {
        if (!document.fonts || !document.fonts.ready || typeof document.fonts.ready.then !== 'function') {
            return;
        }

        document.fonts.ready.then(() => {
            if (!this.isDestroyed) {
                this.measureMaxRoleHeight();
            }
        }).catch(() => {
            // Ignore font loading issues; fallback measurements are already in place.
        });
    }

    injectFilter() {
        if (document.getElementById(this.config.filterId)) {
            return;
        }

        const svg = this.createSvgElement('svg');
        const defs = this.createSvgElement('defs');
        const filter = this.createSvgElement('filter');
        const colorMatrix = this.createSvgElement('feColorMatrix');

        svg.setAttribute('id', `${this.config.filterId}-svg`);
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
        svg.setAttribute('width', '0');
        svg.setAttribute('height', '0');
        svg.style.position = 'fixed';

        filter.setAttribute('id', this.config.filterId);

        colorMatrix.setAttribute('in', 'SourceGraphic');
        colorMatrix.setAttribute('type', 'matrix');
        colorMatrix.setAttribute(
            'values',
            '1 0 0 0 0 ' +
            '0 1 0 0 0 ' +
            '0 0 1 0 0 ' +
            '0 0 0 255 -140'
        );

        filter.appendChild(colorMatrix);
        defs.appendChild(filter);
        svg.appendChild(defs);

        const target = document.body || document.documentElement;
        if (target) {
            target.appendChild(svg);
        }
    }

    createSvgElement(tagName) {
        if (typeof document.createElementNS === 'function') {
            return document.createElementNS('http://www.w3.org/2000/svg', tagName);
        }

        return document.createElement(tagName);
    }

    startSequence(resetState = false) {
        if (this.isDestroyed || this.reducedMotion || !this.container || typeof window === 'undefined') {
            return;
        }

        if (resetState) {
            this.currentIndex = 0;
            this.nextIndex = 1;
            this.phase = 'hold';
            this.phaseElapsed = 0;
            this.lastTimestamp = null;
            this.isPaused = false;
            this.resetVisualState();
        }

        this.container.classList.remove('no-animation', 'role-sequence--reduced-motion');
        this.container.classList.add('role-sequence--ready');

        this.hasStarted = true;
        this.stopAnimationFrame();
        this.rafId = window.requestAnimationFrame(this.animate);
    }

    animate(timestamp) {
        if (this.isDestroyed || this.isPaused || this.reducedMotion) {
            return;
        }

        if (this.lastTimestamp === null) {
            this.lastTimestamp = timestamp;
            this.rafId = window.requestAnimationFrame(this.animate);
            return;
        }

        const delta = timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;
        this.phaseElapsed += delta;

        if (this.phase === 'hold') {
            this.applyCooldownState();

            if (this.phaseElapsed >= this.getHoldDuration(this.currentIndex)) {
                this.phase = 'morph';
                this.phaseElapsed = 0;
                this.nextIndex = (this.currentIndex + 1) % this.roles.length;
                this.currentText.textContent = this.roles[this.currentIndex];
                this.nextText.textContent = this.roles[this.nextIndex];
            }
        } else {
            const fraction = Math.min(this.phaseElapsed / this.config.morphDuration, 1);
            this.applyMorphState(fraction);

            if (fraction >= 1) {
                this.completeTransition();
            }
        }

        this.rafId = window.requestAnimationFrame(this.animate);
    }

    applyMorphState(fraction) {
        const safeFraction = Math.max(fraction, 0.0001);
        const inverseFraction = Math.max(1 - fraction, 0.0001);

        this.container.classList.add('role-sequence--ready');

        this.nextText.style.filter = `blur(${Math.min(8 / safeFraction - 8, 100)}px)`;
        this.nextText.style.opacity = `${Math.pow(safeFraction, 0.4)}`;

        this.currentText.style.filter = `blur(${Math.min(8 / inverseFraction - 8, 100)}px)`;
        this.currentText.style.opacity = `${Math.pow(inverseFraction, 0.4)}`;
    }

    applyCooldownState() {
        this.currentText.textContent = this.roles[this.currentIndex];
        this.nextText.textContent = this.roles[this.nextIndex];
        this.currentText.style.filter = 'none';
        this.currentText.style.opacity = '1';
        this.nextText.style.filter = 'none';
        this.nextText.style.opacity = '0';
    }

    completeTransition() {
        this.currentIndex = this.nextIndex;
        this.nextIndex = (this.currentIndex + 1) % this.roles.length;
        this.phase = 'hold';
        this.phaseElapsed = 0;
        this.resetVisualState();
        this.updateAccessibleText(this.roles[this.currentIndex]);
    }

    resetVisualState() {
        if (!this.currentText || !this.nextText) {
            return;
        }

        this.currentText.textContent = this.roles[this.currentIndex];
        this.nextText.textContent = this.roles[this.nextIndex];
        this.currentText.style.filter = 'none';
        this.currentText.style.opacity = '1';
        this.nextText.style.filter = 'none';
        this.nextText.style.opacity = '0';
        this.updateAccessibleText(this.roles[this.currentIndex]);
    }

    updateAccessibleText(roleText) {
        if (!this.container || !roleText) {
            return;
        }

        const cleanText = roleText.trim().replace(/\s+/g, ' ');

        if (this.screenReaderText) {
            this.screenReaderText.textContent = cleanText;
        }

        this.container.setAttribute('aria-label', cleanText);
    }

    getHoldDuration(index) {
        return index === 0 ? this.config.role1HoldTime : this.config.otherHoldTime;
    }

    measureMaxRoleHeight() {
        if (!this.container) {
            return;
        }

        const measurement = document.createElement('span');
        measurement.className = 'role-sequence__text role-sequence__measure';
        measurement.setAttribute('aria-hidden', 'true');
        measurement.style.position = 'static';
        measurement.style.display = 'block';
        measurement.style.opacity = '1';
        measurement.style.filter = 'none';
        measurement.style.visibility = 'hidden';

        let maxHeight = 0;

        this.container.appendChild(measurement);

        this.roles.forEach((role) => {
            measurement.textContent = role;
            const rect = typeof measurement.getBoundingClientRect === 'function'
                ? measurement.getBoundingClientRect()
                : { height: 0 };
            const height = rect.height || measurement.offsetHeight || 0;
            maxHeight = Math.max(maxHeight, height);
        });

        this.container.removeChild(measurement);

        if (maxHeight > 0) {
            this.container.style.setProperty('--role-sequence-height', `${Math.ceil(maxHeight)}px`);
        }
    }

    pause() {
        if (this.isPaused || this.reducedMotion || this.isDestroyed) {
            return;
        }

        this.isPaused = true;
        this.stopAnimationFrame();
        this.lastTimestamp = null;
        console.log('RoleSequence: Paused');
    }

    resume() {
        if (!this.isPaused || this.isDestroyed || this.reducedMotion || !this.hasStarted) {
            return;
        }

        this.isPaused = false;
        this.lastTimestamp = null;
        this.rafId = window.requestAnimationFrame(this.animate);
        console.log('RoleSequence: Resumed');
    }

    stopAnimationFrame() {
        if (this.rafId !== null && typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function') {
            window.cancelAnimationFrame(this.rafId);
        }

        this.rafId = null;
    }

    showFallback() {
        if (!this.container || !this.currentText || !this.nextText) {
            return;
        }

        this.currentIndex = 0;
        this.nextIndex = 1;
        this.phase = 'hold';
        this.phaseElapsed = 0;
        this.container.classList.add('no-animation', 'role-sequence--reduced-motion');
        this.container.classList.remove('role-sequence--ready');
        this.stopAnimationFrame();
        this.lastTimestamp = null;
        this.isPaused = false;
        this.resetVisualState();
        this.measureMaxRoleHeight();
    }

    destroy() {
        if (this.isDestroyed) {
            return;
        }

        this.isDestroyed = true;
        this.stopAnimationFrame();

        if (typeof document !== 'undefined') {
            document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        }

        if (typeof window !== 'undefined') {
            window.removeEventListener('beforeunload', this.handleBeforeUnload);
            window.removeEventListener('pagehide', this.handleBeforeUnload);
            window.removeEventListener('resize', this.handleResize);
            window.removeEventListener('orientationchange', this.handleResize);
        }

        if (this.motionQuery) {
            if (typeof this.motionQuery.removeEventListener === 'function') {
                this.motionQuery.removeEventListener('change', this.handleMotionPreferenceChange);
            } else if (typeof this.motionQuery.removeListener === 'function') {
                this.motionQuery.removeListener(this.handleMotionPreferenceChange);
            }
        }

        console.log('RoleSequence: Controller destroyed');
    }

    getCurrentIndex() {
        return this.currentIndex;
    }

    getCurrentRoleText() {
        return this.roles[this.currentIndex] || '';
    }
}

let roleSequenceController = null;

if (typeof document !== 'undefined') {
    if (document.querySelector('.role-sequence')) {
        roleSequenceController = new RoleSequenceController();
    } else if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (document.querySelector('.role-sequence')) {
                roleSequenceController = new RoleSequenceController();
            }
        }, { once: true });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = RoleSequenceController;
}
