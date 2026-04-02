/**
 * Theme Toggle Landscape Web Component
 * Reusable custom element for theme switching with day/night landscape
 * Usage: <theme-toggle-landscape></theme-toggle-landscape>
 */
class ThemeToggleLandscape extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.currentTheme = this.getSavedTheme();
        this.transitionTimer = null;
        this.button = null;

        this.timings = {
            transition: 860,
            reducedTransition: 260
        };

        this.handlePointerDown = this.handlePointerDown.bind(this);
        this.handleGlobalKeyDown = this.handleGlobalKeyDown.bind(this);
        this.handleToggleClick = this.handleToggleClick.bind(this);
        this.handleReducedMotionChange = this.handleReducedMotionChange.bind(this);
    }

    connectedCallback() {
        this.render();
        this.button = this.shadowRoot.querySelector('#themeToggle');
        this.reducedMotionQuery = this.createMediaQuery('(prefers-reduced-motion: reduce)');

        this.syncReducedMotionPreference();
        this.applyThemeState(this.currentTheme, { persist: false, emitEvent: false });
        this.attachEventListeners();
    }

    disconnectedCallback() {
        if (this.button) {
            this.button.removeEventListener('pointerdown', this.handlePointerDown);
            this.button.removeEventListener('click', this.handleToggleClick);
        }

        window.removeEventListener('keydown', this.handleGlobalKeyDown, true);
        this.removeMediaQueryListener(this.reducedMotionQuery, this.handleReducedMotionChange);
        this.clearTransitionTimer();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    --toggle-height: var(--header-control-height, 2.5rem);
                    --toggle-width: calc(var(--toggle-height) * 2.08);
                    --edge-gap: calc(var(--toggle-height) * 0.08);
                    --thumb-size: calc(var(--toggle-height) - (var(--edge-gap) * 2));
                    --slide-duration: 470ms;
                    --slide-fade-duration: 180ms;
                    --slide-fade-delay: 300ms;
                    --scenic-set-duration: 300ms;
                    --scenic-set-delay: 160ms;
                    --scenic-rise-duration: 380ms;
                    --scenic-rise-delay: 170ms;
                    --stars-duration: 190ms;
                    --stars-delay: 320ms;
                    display: inline-block;
                    position: fixed;
                    top: var(--header-control-top, 25px);
                    right: var(--header-side-offset, 2rem);
                    z-index: 9999;
                }

                .theme-toggle-wrapper {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: var(--toggle-width);
                    height: var(--toggle-height);
                    cursor: pointer;
                    overflow: hidden;
                    border-radius: 9999px;
                    border: 2px solid #0adf86;
                    background: transparent;
                    padding: 0;
                    margin: 0;
                    pointer-events: auto;
                    outline: none;
                    -webkit-tap-highlight-color: transparent;
                    box-shadow: 0 12px 26px rgba(10, 223, 134, 0.18);
                    transition: box-shadow 0.35s ease, border-color 0.35s ease;
                }

                .theme-toggle-wrapper:focus {
                    outline: none;
                    box-shadow: none;
                }

                .theme-toggle-wrapper[data-input-method="keyboard"]:focus,
                .theme-toggle-wrapper:focus-visible {
                    outline: 2px solid transparent;
                    outline-offset: 2px;
                    box-shadow: 0 0 0 2px hsl(var(--ring, 155 100% 21%)), 0 12px 26px rgba(10, 223, 134, 0.18);
                }

                .theme-toggle-wrapper[data-input-method="pointer"]:focus-visible {
                    outline: none;
                    box-shadow: 0 12px 26px rgba(10, 223, 134, 0.18);
                }

                .theme-toggle-scene {
                    position: absolute;
                    inset: 0;
                    overflow: hidden;
                    border-radius: inherit;
                    isolation: isolate;
                }

                .theme-toggle-sky {
                    position: absolute;
                    inset: 0;
                    background:
                        radial-gradient(circle at 26% 28%, rgba(255, 240, 163, 0.78) 0%, rgba(255, 240, 163, 0) 30%),
                        linear-gradient(180deg, #48b8ee 0%, #76dcf0 34%, #f1cf80 100%);
                    transition: background 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }

                :host([data-theme="night"]) .theme-toggle-sky {
                    background:
                        radial-gradient(circle at 78% 20%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 32%),
                        linear-gradient(180deg, #181e3c 0%, #2c2b56 42%, #201f36 100%);
                }

                .theme-toggle-stars {
                    position: absolute;
                    inset: 0;
                    opacity: 0;
                    transition: opacity 0.2s ease;
                    z-index: 1;
                }

                :host([data-theme="night"]) .theme-toggle-stars {
                    opacity: 1;
                }

                .star {
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    border-radius: 9999px;
                    background: rgba(255, 255, 255, 0.95);
                    box-shadow: 0 0 8px rgba(255, 255, 255, 0.55);
                    opacity: 0.45;
                    transform-origin: center;
                }

                :host([data-theme="night"]) .star {
                    animation-name: twinkle;
                    animation-iteration-count: infinite;
                    animation-timing-function: ease-in-out;
                    animation-fill-mode: both;
                }

                .star-1 {
                    top: 16%;
                    left: 54%;
                    animation-duration: 2.1s;
                    animation-delay: 0.1s;
                }

                .star-2 {
                    top: 27%;
                    left: 68%;
                    animation-duration: 2.7s;
                    animation-delay: 0.35s;
                }

                .star-3 {
                    top: 14%;
                    left: 81%;
                    animation-duration: 2.5s;
                    animation-delay: 0.68s;
                }

                .star-4 {
                    top: 39%;
                    left: 60%;
                    animation-duration: 2.9s;
                    animation-delay: 1s;
                }

                .star-5 {
                    top: 48%;
                    left: 74%;
                    animation-duration: 2.35s;
                    animation-delay: 1.24s;
                }

                .star-6 {
                    top: 32%;
                    left: 87%;
                    animation-duration: 2.8s;
                    animation-delay: 1.52s;
                }

                @keyframes twinkle {
                    0%, 100% {
                        opacity: 0.35;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.4);
                    }
                }

                .theme-toggle-celestial {
                    position: absolute;
                    border-radius: 50%;
                    z-index: 2;
                    transition:
                        opacity 0.26s ease,
                        transform 0.32s cubic-bezier(0.22, 1, 0.36, 1),
                        box-shadow 0.32s ease;
                }

                .theme-toggle-sun {
                    top: calc(50% - (var(--toggle-height) * 0.205));
                    left: calc(var(--edge-gap) + 0.48rem);
                    width: calc(var(--toggle-height) * 0.42);
                    height: calc(var(--toggle-height) * 0.42);
                    background: radial-gradient(circle at 33% 33%, #fff7c5 0%, #ffd066 38%, #ff9d3c 70%, #e85f24 100%);
                    box-shadow: 0 0 14px rgba(255, 146, 58, 0.42);
                    opacity: 1;
                    transform: translate3d(0, 0, 0) scale(1);
                }

                :host([data-theme="night"]) .theme-toggle-sun {
                    opacity: 0;
                    transform: translate3d(0, 88%, 0) scale(0.72);
                }

                .theme-toggle-moon {
                    top: calc(50% - (var(--toggle-height) * 0.13));
                    left: calc(100% - var(--edge-gap) - (var(--toggle-height) * 0.28) - 0.36rem);
                    width: calc(var(--toggle-height) * 0.28);
                    height: calc(var(--toggle-height) * 0.28);
                    opacity: 0;
                    transform: translate3d(0, 128%, 0) scale(0.74);
                }

                .theme-toggle-moon::before,
                .theme-toggle-moon::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                }

                .theme-toggle-moon::before {
                    background: radial-gradient(circle at 32% 32%, #ffffff 0%, #f7efd8 58%, #d8ccb2 100%);
                    box-shadow: 0 0 12px rgba(255, 255, 255, 0.42);
                }

                .theme-toggle-moon::after {
                    inset: 8% -4% 0 30%;
                    background: linear-gradient(180deg, #1b2141 0%, #2b2b53 55%, #24223d 100%);
                }

                :host([data-theme="night"]) .theme-toggle-moon {
                    opacity: 1;
                    transform: translate3d(0, 0, 0) scale(1);
                }

                .theme-toggle-thumb {
                    position: absolute;
                    top: 50%;
                    left: var(--edge-gap);
                    width: var(--thumb-size);
                    height: var(--thumb-size);
                    border-radius: 50%;
                    transform: translateY(-50%) scale(0.3);
                    z-index: 5;
                    overflow: hidden;
                    opacity: 0;
                    background: radial-gradient(circle at 35% 35%, #fff0ab 0%, #ffb648 52%, #ef6d28 100%);
                    box-shadow:
                        inset -4px -4px 8px rgba(124, 46, 9, 0.18),
                        0 10px 22px rgba(248, 112, 45, 0.3);
                    transition:
                        left var(--slide-duration) cubic-bezier(0.22, 1, 0.36, 1),
                        background 0.3s ease,
                        box-shadow 0.3s ease,
                        transform var(--slide-duration) cubic-bezier(0.22, 1, 0.36, 1),
                        opacity 180ms ease;
                }

                .thumb-face {
                    position: absolute;
                    inset: 0;
                    transition: opacity 0.24s ease, transform 0.38s cubic-bezier(0.22, 1, 0.36, 1);
                }

                .thumb-sun {
                    opacity: 0;
                    transform: translate3d(0, -16%, 0) scale(0.84);
                }

                .thumb-sun::before {
                    content: "";
                    position: absolute;
                    inset: 16%;
                    border-radius: 50%;
                    background: radial-gradient(circle at 33% 33%, #fff6bf 0%, #ffd36f 38%, #ffa640 68%, #ea6128 100%);
                }

                .thumb-sun::after {
                    content: "";
                    position: absolute;
                    inset: 24%;
                    border-radius: 50%;
                    box-shadow: 0 0 0 2px rgba(255, 237, 175, 0.35);
                }

                .thumb-moon {
                    opacity: 0;
                    transform: translate3d(0, 120%, 0) scale(0.84);
                }

                .thumb-moon::before,
                .thumb-moon::after {
                    content: "";
                    position: absolute;
                    border-radius: 50%;
                }

                .thumb-moon::before {
                    inset: 18%;
                    background: radial-gradient(circle at 32% 32%, #fffef6 0%, #fbf0dc 55%, #e1d1bc 100%);
                }

                .thumb-moon::after {
                    inset: 22% 14% 14% 36%;
                    background: radial-gradient(circle at 30% 30%, #f0dfc5 0%, #d9c7b0 100%);
                    mix-blend-mode: normal;
                }

                .thumb-moon-cutout {
                    position: absolute;
                    inset: 18%;
                    border-radius: 50%;
                    background: linear-gradient(180deg, #f6e8d1 0%, #d8c8ae 100%);
                    transform: translateX(33%) scale(0.94);
                }

                :host([data-transition="to-night"]) .thumb-sun {
                    opacity: 1;
                    transform: translate3d(0, 0, 0) scale(1);
                }

                :host([data-transition="to-day"]) .thumb-moon {
                    opacity: 1;
                    transform: translate3d(0, 0, 0) scale(1);
                }

                .theme-toggle-landscape {
                    position: absolute;
                    inset-inline: 0;
                    bottom: 0;
                    height: 54%;
                    z-index: 3;
                }

                .cloud {
                    position: absolute;
                    border-radius: 9999px;
                    background: hsl(var(--card, 40 25% 98%));
                    box-shadow: 0 4px 10px rgba(255, 255, 255, 0.22);
                    opacity: 0.92;
                    transition: opacity 0.45s ease, transform 0.55s ease;
                }

                .cloud::before,
                .cloud::after {
                    content: "";
                    position: absolute;
                    border-radius: 9999px;
                    background: inherit;
                }

                .cloud-1 {
                    bottom: 0.42rem;
                    left: 41%;
                    width: 14%;
                    height: 12%;
                }

                .cloud-1::before {
                    width: 58%;
                    height: 155%;
                    left: 8%;
                    bottom: 36%;
                }

                .cloud-1::after {
                    width: 46%;
                    height: 135%;
                    right: 6%;
                    bottom: 26%;
                }

                .cloud-2 {
                    bottom: 0.58rem;
                    left: 57%;
                    width: 11%;
                    height: 9%;
                }

                .cloud-2::before {
                    width: 55%;
                    height: 150%;
                    left: 7%;
                    bottom: 30%;
                }

                .cloud-2::after {
                    width: 44%;
                    height: 124%;
                    right: 6%;
                    bottom: 18%;
                }

                .cloud-3 {
                    bottom: 0.34rem;
                    left: 72%;
                    width: 9%;
                    height: 7%;
                }

                .cloud-3::before {
                    width: 50%;
                    height: 138%;
                    left: 12%;
                    bottom: 28%;
                }

                .cloud-3::after {
                    width: 40%;
                    height: 118%;
                    right: 8%;
                    bottom: 14%;
                }

                @keyframes cloud-drift {
                    0% {
                        transform: translateX(-8%);
                    }
                    50% {
                        transform: translateX(5%);
                    }
                    100% {
                        transform: translateX(-8%);
                    }
                }

                :host([data-theme="day"]) .cloud {
                    animation: cloud-drift 8s ease-in-out infinite;
                }

                :host([data-theme="day"]) .cloud-2 {
                    animation-duration: 10s;
                    animation-delay: -1.8s;
                }

                :host([data-theme="day"]) .cloud-3 {
                    animation-duration: 11.6s;
                    animation-delay: -3.4s;
                }

                :host([data-theme="night"]) .cloud {
                    opacity: 0;
                    transform: translateY(28%);
                    animation: none;
                }

                .mountain {
                    position: absolute;
                    bottom: -1px;
                    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
                    transition: background 0.45s ease, transform 0.45s ease;
                }

                .mountain-back {
                    left: 36%;
                    width: 32%;
                    height: 52%;
                    background: #6ba05e;
                    z-index: 0;
                }

                .mountain-mid {
                    left: 53%;
                    width: 29%;
                    height: 64%;
                    background: #3f6a43;
                    z-index: 1;
                }

                .mountain-front {
                    left: 67%;
                    width: 34%;
                    height: 48%;
                    background: #144e38;
                    z-index: 2;
                }

                :host([data-theme="night"]) .mountain-back {
                    background: #4f557d;
                }

                :host([data-theme="night"]) .mountain-mid {
                    background: #343a61;
                }

                :host([data-theme="night"]) .mountain-front {
                    background: #242944;
                }

                :host([data-transition="to-night"]) .theme-toggle-thumb {
                    left: calc(100% - var(--thumb-size) - var(--edge-gap));
                    opacity: 0;
                    transform: translateY(-50%) scale(1);
                    background: radial-gradient(circle at 35% 35%, #fff5c2 0%, #ffd66f 40%, #ffab45 68%, #ef6a29 100%);
                    box-shadow:
                        inset -4px -4px 8px rgba(124, 46, 9, 0.18),
                        0 12px 24px rgba(248, 112, 45, 0.34);
                    transition:
                        left var(--slide-duration) cubic-bezier(0.22, 1, 0.36, 1),
                        opacity var(--slide-fade-duration) ease var(--slide-fade-delay),
                        background 0.3s ease,
                        box-shadow 0.3s ease,
                        transform var(--slide-duration) cubic-bezier(0.22, 1, 0.36, 1);
                }

                :host([data-transition="to-day"]) .theme-toggle-thumb {
                    left: var(--edge-gap);
                    opacity: 0;
                    transform: translateY(-50%) scale(1);
                    background: radial-gradient(circle at 35% 35%, #fffaf4 0%, #f7ead6 58%, #dccab1 100%);
                    box-shadow:
                        inset -4px -4px 8px rgba(92, 81, 70, 0.16),
                        0 12px 24px rgba(19, 24, 52, 0.4);
                    transition:
                        left var(--slide-duration) cubic-bezier(0.22, 1, 0.36, 1),
                        opacity var(--slide-fade-duration) ease var(--slide-fade-delay),
                        background 0.3s ease,
                        box-shadow 0.3s ease,
                        transform var(--slide-duration) cubic-bezier(0.22, 1, 0.36, 1);
                }

                :host([data-transition="to-night"]) .theme-toggle-sun {
                    opacity: 0.18;
                    animation: scenic-sun-set var(--scenic-set-duration) cubic-bezier(0.22, 1, 0.36, 1) var(--scenic-set-delay) both;
                }

                :host([data-transition="to-day"]) .theme-toggle-sun {
                    opacity: 1;
                    animation: scenic-sun-rise var(--scenic-rise-duration) cubic-bezier(0.22, 1, 0.36, 1) var(--scenic-rise-delay) both;
                }

                :host([data-transition="to-night"]) .theme-toggle-moon {
                    opacity: 1;
                    animation: scenic-moon-rise var(--scenic-rise-duration) cubic-bezier(0.22, 1, 0.36, 1) var(--scenic-rise-delay) both;
                }

                :host([data-transition="to-day"]) .theme-toggle-moon {
                    opacity: 1;
                    animation: scenic-moon-lower var(--scenic-set-duration) cubic-bezier(0.22, 1, 0.36, 1) var(--scenic-set-delay) both;
                }

                :host([data-transition="to-night"]) .theme-toggle-stars {
                    opacity: 0;
                    animation: stars-fade-in var(--stars-duration) ease var(--stars-delay) forwards;
                }

                :host([data-transition="to-day"]) .theme-toggle-stars {
                    opacity: 1;
                    animation: stars-fade-out var(--stars-duration) ease forwards;
                }

                @keyframes scenic-sun-set {
                    0% {
                        opacity: 1;
                        transform: translate3d(0, 0, 0) scale(1);
                    }
                    100% {
                        opacity: 0.18;
                        transform: translate3d(0, 96%, 0) scale(0.74);
                    }
                }

                @keyframes scenic-sun-rise {
                    0% {
                        opacity: 0;
                        transform: translate3d(0, 120%, 0) scale(0.74);
                    }
                    100% {
                        opacity: 1;
                        transform: translate3d(0, 0, 0) scale(1);
                    }
                }

                @keyframes scenic-moon-rise {
                    0% {
                        opacity: 0;
                        transform: translate3d(0, 132%, 0) scale(0.74);
                    }
                    100% {
                        opacity: 1;
                        transform: translate3d(0, 0, 0) scale(1);
                    }
                }

                @keyframes scenic-moon-lower {
                    0% {
                        opacity: 1;
                        transform: translate3d(0, 0, 0) scale(1);
                    }
                    100% {
                        opacity: 0.14;
                        transform: translate3d(0, 110%, 0) scale(0.74);
                    }
                }

                @keyframes stars-fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes stars-fade-out {
                    from {
                        opacity: 1;
                    }
                    to {
                        opacity: 0;
                    }
                }

                :host([data-reduced-motion="true"]) {
                    --slide-duration: 190ms;
                    --slide-fade-duration: 100ms;
                    --slide-fade-delay: 80ms;
                    --scenic-set-duration: 160ms;
                    --scenic-set-delay: 20ms;
                    --scenic-rise-duration: 180ms;
                    --scenic-rise-delay: 20ms;
                    --stars-duration: 140ms;
                    --stars-delay: 30ms;
                }

                :host([data-reduced-motion="true"]) .star,
                :host([data-reduced-motion="true"]) .cloud,
                :host([data-reduced-motion="true"]) .theme-toggle-celestial {
                    animation: none !important;
                }

                :host([data-reduced-motion="true"]) .theme-toggle-stars {
                    animation: none !important;
                }

                :host([data-reduced-motion="true"][data-transition="to-night"]) .theme-toggle-stars {
                    opacity: 1;
                }

                :host([data-reduced-motion="true"][data-transition="to-day"]) .theme-toggle-stars {
                    opacity: 0;
                }

                :host([data-reduced-motion="true"][data-transition="to-night"]) .theme-toggle-sun,
                :host([data-reduced-motion="true"][data-transition="to-day"]) .theme-toggle-sun,
                :host([data-reduced-motion="true"][data-transition="to-night"]) .theme-toggle-moon,
                :host([data-reduced-motion="true"][data-transition="to-day"]) .theme-toggle-moon {
                    animation: none !important;
                }
            </style>
            <button class="theme-toggle-wrapper" id="themeToggle" type="button" aria-label="Activate dark theme" aria-pressed="false">
                <div class="theme-toggle-scene" aria-hidden="true">
                    <div class="theme-toggle-sky"></div>
                    <div class="theme-toggle-stars">
                        <div class="star star-1"></div>
                        <div class="star star-2"></div>
                        <div class="star star-3"></div>
                        <div class="star star-4"></div>
                        <div class="star star-5"></div>
                        <div class="star star-6"></div>
                    </div>
                    <div class="theme-toggle-celestial theme-toggle-sun"></div>
                    <div class="theme-toggle-celestial theme-toggle-moon"></div>
                    <div class="theme-toggle-thumb">
                        <div class="thumb-face thumb-sun"></div>
                        <div class="thumb-face thumb-moon">
                            <span class="thumb-moon-cutout"></span>
                        </div>
                    </div>
                    <div class="theme-toggle-landscape">
                        <div class="mountain mountain-back"></div>
                        <div class="mountain mountain-mid"></div>
                        <div class="mountain mountain-front"></div>
                        <div class="cloud cloud-1"></div>
                        <div class="cloud cloud-2"></div>
                        <div class="cloud cloud-3"></div>
                    </div>
                </div>
            </button>
        `;
    }

    attachEventListeners() {
        if (!this.button) {
            return;
        }

        this.button.dataset.inputMethod = 'pointer';
        this.button.addEventListener('pointerdown', this.handlePointerDown);
        this.button.addEventListener('click', this.handleToggleClick);
        window.addEventListener('keydown', this.handleGlobalKeyDown, true);

        this.addMediaQueryListener(this.reducedMotionQuery, this.handleReducedMotionChange);
    }

    createMediaQuery(query) {
        if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
            return window.matchMedia(query);
        }

        return null;
    }

    addMediaQueryListener(query, handler) {
        if (!query) {
            return;
        }

        if (typeof query.addEventListener === 'function') {
            query.addEventListener('change', handler);
        } else if (typeof query.addListener === 'function') {
            query.addListener(handler);
        }
    }

    removeMediaQueryListener(query, handler) {
        if (!query) {
            return;
        }

        if (typeof query.removeEventListener === 'function') {
            query.removeEventListener('change', handler);
        } else if (typeof query.removeListener === 'function') {
            query.removeListener(handler);
        }
    }

    handleReducedMotionChange() {
        this.syncReducedMotionPreference();
    }

    syncReducedMotionPreference() {
        this.prefersReducedMotion = this.reducedMotionQuery ? this.reducedMotionQuery.matches : false;

        this.setAttribute('data-reduced-motion', this.prefersReducedMotion ? 'true' : 'false');
    }

    handlePointerDown() {
        if (this.button) {
            this.button.dataset.inputMethod = 'pointer';
        }
    }

    handleGlobalKeyDown(event) {
        if (event.key === 'Tab' && this.button) {
            this.button.dataset.inputMethod = 'keyboard';
        }
    }

    handleToggleClick() {
        if (this.isBusy()) {
            return;
        }

        const nextTheme = this.currentTheme === 'night' ? 'day' : 'night';
        this.startThemeTransition(nextTheme);
    }

    isBusy() {
        return this.hasAttribute('data-transition');
    }

    startThemeTransition(nextTheme) {
        const transitionState = nextTheme === 'night' ? 'to-night' : 'to-day';

        this.clearTransitionTimer();
        this.applyThemeState(nextTheme, { persist: true, emitEvent: true });
        this.setAttribute('data-transition', transitionState);

        this.transitionTimer = window.setTimeout(() => {
            this.removeAttribute('data-transition');
            this.transitionTimer = null;
        }, this.getTransitionDuration());
    }

    getTransitionDuration() {
        return this.prefersReducedMotion ? this.timings.reducedTransition : this.timings.transition;
    }

    clearTransitionTimer() {
        if (this.transitionTimer !== null) {
            window.clearTimeout(this.transitionTimer);
            this.transitionTimer = null;
        }
    }

    getSavedTheme() {
        try {
            return localStorage.getItem('theme') || 'day';
        } catch (error) {
            return 'day';
        }
    }

    updateButtonState() {
        if (!this.button) {
            return;
        }

        const isNight = this.currentTheme === 'night';
        this.button.setAttribute('aria-pressed', isNight ? 'true' : 'false');
        this.button.setAttribute('aria-label', isNight ? 'Activate light theme' : 'Activate dark theme');
    }

    applyThemeState(theme, options = {}) {
        const { persist = true, emitEvent = false } = options;
        const nextTheme = theme === 'night' ? 'night' : 'day';

        this.currentTheme = nextTheme;
        this.setAttribute('data-theme', nextTheme);

        if (document.body) {
            document.body.classList.toggle('dark-theme', nextTheme === 'night');
        }

        if (persist) {
            try {
                localStorage.setItem('theme', nextTheme);
            } catch (error) {
                // Ignore storage failures and keep the UI state in sync.
            }
        }

        this.updateButtonState();

        if (emitEvent) {
            this.dispatchEvent(new CustomEvent('theme-changed', {
                detail: { theme: nextTheme },
                bubbles: true
            }));
        }
    }
}

if (!customElements.get('theme-toggle-landscape')) {
    customElements.define('theme-toggle-landscape', ThemeToggleLandscape);
}

if (typeof module !== 'undefined') {
    module.exports = ThemeToggleLandscape;
}
