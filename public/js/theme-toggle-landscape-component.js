/**
 * Theme Toggle Landscape Web Component
 * Reusable custom element for theme switching with day/night landscape
 * Usage: <theme-toggle-landscape></theme-toggle-landscape>
 */
class ThemeToggleLandscape extends HTMLElement {
    constructor() {
        super();
        
        // Create shadow DOM for encapsulation
        this.attachShadow({ mode: 'open' });
        
        // Initialize theme state
        this.currentTheme = localStorage.getItem('theme') || 'day';
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
        this.applyInitialTheme();
    }

    render() {
        // HTML structure
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    position: fixed;
                    top: 25px;
                    right: 2rem;
                    z-index: 9999;
                }

                .theme-toggle-wrapper {
                    position: relative;
                    height: 2.5rem;
                    width: 5rem;
                    cursor: pointer;
                    overflow: hidden;
                    border-radius: 9999px;
                    border-width: 2px;
                    border-color: hsl(var(--border, 0 0% 85%));
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    background: transparent;
                    border-style: solid;
                    padding: 0;
                    margin: 0;
                    pointer-events: auto;
                }

                .theme-toggle-wrapper:hover {
                    transform: scale(1.05);
                }

                .theme-toggle-wrapper:focus {
                    outline: 2px solid transparent;
                    outline-offset: 2px;
                    box-shadow: 0 0 0 2px hsl(var(--ring, 155 100% 21%));
                }

                .theme-toggle-scene {
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .theme-toggle-sky {
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
                    background: linear-gradient(180deg, #47b4eb, #f0c775);
                }

                :host([data-theme="night"]) .theme-toggle-sky {
                    background: linear-gradient(180deg, #171f36, #392d53);
                }

                .theme-toggle-celestial {
                    position: absolute;
                    height: 1.5rem;
                    width: 1.5rem;
                    border-radius: 9999px;
                    transition: all 0.5s cubic-bezier(0, 0, 0.2, 1);
                    top: 50%;
                    left: 6px;
                    transform: translateY(-50%);
                    background: linear-gradient(135deg, #ffd966, #ffb31a);
                    box-shadow: 0 0 20px #fc39;
                }

                :host([data-theme="night"]) .theme-toggle-celestial {
                    left: calc(100% - 30px);
                    background: linear-gradient(135deg, #f5f3f0, #dddad5);
                    box-shadow: 0 0 15px rgba(245, 243, 240, 0.4);
                }

                .crater {
                    position: absolute;
                    border-radius: 9999px;
                    opacity: 0;
                    transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    background: #c6c1b9;
                }

                :host([data-theme="night"]) .crater {
                    opacity: 1;
                }

                .crater-1 {
                    width: 6px;
                    height: 6px;
                    top: 4px;
                    left: 4px;
                }

                .crater-2 {
                    width: 4px;
                    height: 4px;
                    top: 12px;
                    left: 10px;
                }

                .crater-3 {
                    width: 3px;
                    height: 3px;
                    top: 6px;
                    left: 14px;
                }

                .theme-toggle-stars {
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    opacity: 0;
                    transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                }

                :host([data-theme="night"]) .theme-toggle-stars {
                    opacity: 1;
                }

                .star {
                    position: absolute;
                    border-radius: 9999px;
                    background-color: hsl(var(--foreground, 0 0% 10%));
                    width: 2px;
                    height: 2px;
                    animation: twinkle 2s ease-in-out infinite;
                }

                .star-1 {
                    top: 8px;
                    left: 12px;
                    animation-delay: 0s;
                }

                .star-2 {
                    top: 14px;
                    left: 20px;
                    animation-delay: 0.3s;
                }

                .star-3 {
                    top: 6px;
                    left: 28px;
                    animation-delay: 0.6s;
                }

                .star-4 {
                    top: 18px;
                    left: 36px;
                    animation-delay: 0.9s;
                }

                .star-5 {
                    top: 10px;
                    left: 44px;
                    animation-delay: 1.2s;
                }

                @keyframes twinkle {
                    0%, 100% {
                        opacity: 0.4;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.3);
                    }
                }

                .theme-toggle-landscape {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 1rem;
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .cloud {
                    position: absolute;
                    border-radius: 9999px;
                    background-color: hsl(var(--card, 40 25% 98%));
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .cloud-1 {
                    width: 16px;
                    height: 6px;
                    bottom: 10px;
                    left: 10px;
                }

                .cloud-2 {
                    width: 12px;
                    height: 4px;
                    bottom: 14px;
                    left: 50px;
                }

                :host([data-theme="night"]) .cloud {
                    opacity: 0;
                }

                .mountain {
                    position: absolute;
                    bottom: 0;
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
                }

                .mountain-1 {
                    width: 24px;
                    height: 10px;
                    left: 4px;
                    background: #478547;
                }

                .mountain-2 {
                    width: 20px;
                    height: 8px;
                    left: 18px;
                    background: #437043;
                }

                :host([data-theme="night"]) .mountain-1 {
                    background: #242b42;
                }

                :host([data-theme="night"]) .mountain-2 {
                    background: #222839;
                }
            </style>
            <button class="theme-toggle-wrapper" id="themeToggle" aria-label="Toggle theme" type="button">
                <div class="theme-toggle-scene">
                    <div class="theme-toggle-sky"></div>
                    <div class="theme-toggle-celestial">
                        <div class="crater crater-1"></div>
                        <div class="crater crater-2"></div>
                        <div class="crater crater-3"></div>
                    </div>
                    <div class="theme-toggle-stars">
                        <div class="star star-1"></div>
                        <div class="star star-2"></div>
                        <div class="star star-3"></div>
                        <div class="star star-4"></div>
                        <div class="star star-5"></div>
                    </div>
                    <div class="theme-toggle-landscape">
                        <div class="cloud cloud-1"></div>
                        <div class="cloud cloud-2"></div>
                        <div class="mountain mountain-1"></div>
                        <div class="mountain mountain-2"></div>
                    </div>
                </div>
            </button>
        `;
    }

    attachEventListeners() {
        const button = this.shadowRoot.querySelector('#themeToggle');
        if (button) {
            button.addEventListener('click', () => this.toggleTheme());
        }
    }

    applyInitialTheme() {
        // Apply saved theme on load
        if (this.currentTheme === 'night') {
            this.setAttribute('data-theme', 'night');
            document.body.classList.add('dark-theme');
        } else {
            this.setAttribute('data-theme', 'day');
            document.body.classList.remove('dark-theme');
        }
    }

    toggleTheme() {
        const isNight = document.body.classList.contains('dark-theme');
        
        if (isNight) {
            // Switch to day
            document.body.classList.remove('dark-theme');
            this.setAttribute('data-theme', 'day');
            this.currentTheme = 'day';
            localStorage.setItem('theme', 'day');
        } else {
            // Switch to night
            document.body.classList.add('dark-theme');
            this.setAttribute('data-theme', 'night');
            this.currentTheme = 'night';
            localStorage.setItem('theme', 'night');
        }

        // Dispatch custom event for other scripts that might need to listen
        this.dispatchEvent(new CustomEvent('theme-changed', {
            detail: { theme: this.currentTheme },
            bubbles: true
        }));
    }
}

// Register the custom element
customElements.define('theme-toggle-landscape', ThemeToggleLandscape);

