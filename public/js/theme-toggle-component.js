/**
 * Theme Toggle Web Component
 * Reusable custom element for theme switching
 * Usage: <theme-toggle></theme-toggle>
 */
class ThemeToggle extends HTMLElement {
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
                    position: relative;
                }

                button.theme-toggle-wrapper {
                    position: relative;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 80px;
                    height: 38px;
                    transition: all 0.3s ease;
                }

                button.theme-toggle-wrapper:hover {
                    opacity: 0.8;
                    transform: scale(1.05);
                }

                button.theme-toggle-wrapper:active {
                    transform: scale(0.95);
                }

                .theme-toggle-scene {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .theme-toggle-stars {
                    color: white;
                    font-size: 18px;
                    letter-spacing: 4px;
                    transition: opacity 0.3s ease;
                    user-select: none;
                }

                :host([data-theme="night"]) .theme-toggle-stars {
                    opacity: 1;
                }

                :host([data-theme="day"]) .theme-toggle-stars {
                    opacity: 0.6;
                }
            </style>
            <button class="theme-toggle-wrapper" id="themeToggle" aria-label="Toggle theme">
                <div class="theme-toggle-scene">
                    <div class="theme-toggle-stars">✦ ★ ✦</div>
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
customElements.define('theme-toggle', ThemeToggle);

