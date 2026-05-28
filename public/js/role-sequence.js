/**
 * Hero Role Crossfade Sequence Controller
 *
 * Cycles through role titles with a two-layer opacity crossfade. Each incoming
 * role carries its own color during the fade so the color transition feels
 * continuous, including the final-to-first loop.
 */

class RoleSequenceController {
    constructor() {
        this.config = {
            containerSelector: '.role-sequence',
            currentTextSelector: '.role-sequence__text--current',
            nextTextSelector: '.role-sequence__text--next',
            screenReaderTextSelector: '.role-sequence__sr-text',
            filterId: 'role-sequence-threshold',
            fadeDuration: 1450,
            holdDuration: 3000,
            maxMorphBlur: 5,
            morphOpacityCurve: 0.55
        };

        this.roles = [
            {
                label: 'Full Stack AI Developer & Designer',
                color: {
                    light: '#ce1126',
                    dark: '#ce1126'
                }
            },
            {
                label: 'AI Integration Engineer',
                color: {
                    light: '#006b3f',
                    dark: '#10cf74'
                }
            },
            {
                label: 'Web Developer & Designer',
                color: {
                    light: '#111111',
                    dark: '#e8edf3'
                }
            },
            {
                label: 'Visual Designer',
                color: {
                    light: '#c8860a',
                    dark: '#f0b84a'
                }
            }
        ];

        this.container = null;
        this.currentText = null;
        this.nextText = null;
        this.screenReaderText = null;
        this.motionQuery = null;
        this.themeObserver = null;
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
        this.handleThemeChange = this.handleThemeChange.bind(this);
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
                return;
            }

            this.currentText = this.container.querySelector(this.config.currentTextSelector);
            this.nextText = this.container.querySelector(this.config.nextTextSelector);
            this.screenReaderText = this.container.querySelector(this.config.screenReaderTextSelector);

            if (!this.currentText || !this.nextText || !this.screenReaderText) {
                this.showFallback();
                return;
            }

            this.motionQuery = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
                ? window.matchMedia('(prefers-reduced-motion: reduce)')
                : null;

            this.reducedMotion = Boolean(this.motionQuery && this.motionQuery.matches);

            this.setupEventListeners();
            this.setupThemeObserver();
            this.injectFilter();
            this.resetVisualState();
            this.measureMaxRoleHeight();
            this.queueFontMeasurement();

            if (this.reducedMotion) {
                this.showFallback();
                return;
            }

            this.startSequence();
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

    setupThemeObserver() {
        if (typeof MutationObserver === 'undefined') {
            return;
        }

        this.themeObserver = new MutationObserver(this.handleThemeChange);
        this.themeObserver.observe(document.documentElement, {
            attributeFilter: ['data-theme'],
            attributes: true
        });

        if (document.body) {
            this.themeObserver.observe(document.body, {
                attributeFilter: ['class'],
                attributes: true
            });
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
        this.startSequence();
    }

    handleThemeChange() {
        this.applyCurrentVisualState();
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
            '0 0 0 10 -3'
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

    startSequence() {
        if (this.isDestroyed || this.reducedMotion || !this.container || typeof window === 'undefined') {
            return;
        }

        this.container.classList.remove('no-animation', 'role-sequence--reduced-motion');
        this.container.classList.add('role-sequence--ready');

        this.hasStarted = true;
        this.isPaused = false;
        this.lastTimestamp = null;
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
            this.applyHoldState();

            if (this.phaseElapsed >= this.config.holdDuration) {
                this.phase = 'fade';
                this.phaseElapsed = 0;
                this.nextIndex = (this.currentIndex + 1) % this.roles.length;
                this.applyCrossfadeState(0);
            }
        } else {
            const fraction = Math.min(this.phaseElapsed / this.config.fadeDuration, 1);
            this.applyCrossfadeState(fraction);

            if (fraction >= 1) {
                this.completeTransition();
            }
        }

        this.rafId = window.requestAnimationFrame(this.animate);
    }

    applyCurrentVisualState() {
        if (this.phase === 'fade') {
            this.applyCrossfadeState(this.phaseElapsed / this.config.fadeDuration);
            return;
        }

        this.applyHoldState();
    }

    applyCrossfadeState(fraction) {
        const clampedFraction = Math.min(Math.max(fraction, 0), 1);
        const easedFraction = clampedFraction * clampedFraction * (3 - 2 * clampedFraction);

        this.setLayer(
            this.currentText,
            this.currentIndex,
            this.getMorphOpacity(1 - easedFraction),
            this.getMorphBlur(1 - clampedFraction)
        );
        this.setLayer(
            this.nextText,
            this.nextIndex,
            this.getMorphOpacity(easedFraction),
            this.getMorphBlur(clampedFraction)
        );
    }

    applyHoldState() {
        this.nextIndex = (this.currentIndex + 1) % this.roles.length;
        this.setLayer(this.currentText, this.currentIndex, 1);
        this.setLayer(this.nextText, this.nextIndex, 0);
    }

    setLayer(element, roleIndex, opacity, blur = 0) {
        const role = this.roles[roleIndex % this.roles.length];

        element.textContent = role.label;
        element.style.filter = blur > 0 ? `blur(${blur.toFixed(3)}px)` : 'none';
        element.style.opacity = String(opacity);
        element.style.setProperty('--role-layer-color', this.getRoleColor(role));
    }

    getMorphBlur(visibilityFraction) {
        const safeFraction = Math.min(Math.max(visibilityFraction, 0.001), 1);
        return Math.min(8 / safeFraction - 8, this.config.maxMorphBlur);
    }

    getMorphOpacity(visibilityFraction) {
        return Math.pow(
            Math.min(Math.max(visibilityFraction, 0), 1),
            this.config.morphOpacityCurve
        );
    }

    completeTransition() {
        this.currentIndex = this.nextIndex;
        this.nextIndex = (this.currentIndex + 1) % this.roles.length;
        this.phase = 'hold';
        this.phaseElapsed = 0;
        this.applyHoldState();
        this.updateAccessibleText(this.getCurrentRoleText());
    }

    resetVisualState() {
        if (!this.currentText || !this.nextText) {
            return;
        }

        this.currentIndex = 0;
        this.nextIndex = 1;
        this.phase = 'hold';
        this.phaseElapsed = 0;
        this.lastTimestamp = null;
        this.applyHoldState();
        this.updateAccessibleText(this.getCurrentRoleText());
    }

    getRoleColor(role) {
        return this.isDarkTheme() ? role.color.dark : role.color.light;
    }

    isDarkTheme() {
        return document.documentElement.getAttribute('data-theme') === 'dark' ||
            (document.body && document.body.classList.contains('dark-theme'));
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
            measurement.textContent = role.label;
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
    }

    resume() {
        if (!this.isPaused || this.isDestroyed || this.reducedMotion || !this.hasStarted) {
            return;
        }

        this.isPaused = false;
        this.lastTimestamp = null;
        this.rafId = window.requestAnimationFrame(this.animate);
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

        this.container.classList.add('no-animation', 'role-sequence--reduced-motion');
        this.container.classList.remove('role-sequence--ready');
        this.stopAnimationFrame();
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

        if (this.themeObserver) {
            this.themeObserver.disconnect();
        }

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
    }

    getCurrentIndex() {
        return this.currentIndex;
    }

    getCurrentRoleText() {
        return this.roles[this.currentIndex]?.label || '';
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
