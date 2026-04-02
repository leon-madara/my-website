const path = require('path');

function createMockClassList() {
    const classes = new Set();

    return {
        add: (...tokens) => tokens.forEach((token) => classes.add(token)),
        remove: (...tokens) => tokens.forEach((token) => classes.delete(token)),
        contains: (token) => classes.has(token),
        toggle(token, force) {
            if (force === true) {
                classes.add(token);
                return true;
            }

            if (force === false) {
                classes.delete(token);
                return false;
            }

            if (classes.has(token)) {
                classes.delete(token);
                return false;
            }

            classes.add(token);
            return true;
        }
    };
}

class FakeEvent {
    constructor(type, options = {}) {
        this.type = type;
        this.bubbles = Boolean(options.bubbles);
        this.key = options.key;
        this.detail = options.detail;
        this.defaultPrevented = false;
        this.target = null;
    }

    preventDefault() {
        this.defaultPrevented = true;
    }
}

class FakeCustomEvent extends FakeEvent {
    constructor(type, options = {}) {
        super(type, options);
        this.detail = options.detail;
    }
}

class FakeEventTarget {
    constructor() {
        this.listeners = new Map();
    }

    addEventListener(type, handler) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }

        this.listeners.get(type).add(handler);
    }

    removeEventListener(type, handler) {
        if (!this.listeners.has(type)) {
            return;
        }

        this.listeners.get(type).delete(handler);
    }

    dispatchEvent(event) {
        event.target = this;

        const handlers = this.listeners.has(event.type)
            ? Array.from(this.listeners.get(event.type))
            : [];

        handlers.forEach((handler) => handler.call(this, event));
        return !event.defaultPrevented;
    }
}

class FakeElement extends FakeEventTarget {
    constructor(tagName = 'element') {
        super();
        this.nodeName = tagName.toUpperCase();
        this.attributes = {};
        this.dataset = {};
        this.style = {};
        this.classList = createMockClassList();
        this.children = [];
        this.parentNode = null;
        this.innerHTML = '';
        this.shadowRoot = null;
    }

    setAttribute(name, value) {
        this.attributes[name] = String(value);
    }

    getAttribute(name) {
        return Object.prototype.hasOwnProperty.call(this.attributes, name)
            ? this.attributes[name]
            : null;
    }

    hasAttribute(name) {
        return Object.prototype.hasOwnProperty.call(this.attributes, name);
    }

    removeAttribute(name) {
        delete this.attributes[name];
    }

    appendChild(child) {
        child.parentNode = this;
        this.children.push(child);

        if (typeof child.connectedCallback === 'function') {
            child.connectedCallback();
        }

        return child;
    }

    click() {
        this.dispatchEvent(new FakeEvent('click'));
    }
}

class FakeHTMLElement extends FakeElement {
    attachShadow() {
        const button = new FakeElement('button');
        const shadowRoot = {
            innerHTML: '',
            querySelector(selector) {
                if (selector === '#themeToggle') {
                    return button;
                }

                return null;
            }
        };

        this.shadowRoot = shadowRoot;
        return shadowRoot;
    }
}

function createEnvironment({ finePointer = true, reducedMotion = false } = {}) {
    const registry = new Map();
    const body = new FakeElement('body');
    const storage = new Map();
    const mediaListeners = {
        finePointer: new Set(),
        reducedMotion: new Set()
    };

    const windowObject = new FakeEventTarget();
    windowObject.setTimeout = setTimeout;
    windowObject.clearTimeout = clearTimeout;
    windowObject.matchMedia = jest.fn((query) => {
        const isFinePointer = query === '(hover: hover) and (pointer: fine)';
        const listeners = isFinePointer ? mediaListeners.finePointer : mediaListeners.reducedMotion;
        const matches = isFinePointer ? finePointer : reducedMotion;

        return {
            matches,
            media: query,
            addEventListener(type, handler) {
                if (type === 'change') {
                    listeners.add(handler);
                }
            },
            removeEventListener(type, handler) {
                if (type === 'change') {
                    listeners.delete(handler);
                }
            },
            addListener(handler) {
                listeners.add(handler);
            },
            removeListener(handler) {
                listeners.delete(handler);
            }
        };
    });

    const document = {
        body
    };

    const localStorage = {
        getItem(key) {
            return storage.has(key) ? storage.get(key) : null;
        },
        setItem(key, value) {
            storage.set(key, String(value));
        },
        clear() {
            storage.clear();
        }
    };

    return {
        body,
        document,
        windowObject,
        localStorage,
        ToggleClass: null,
        installGlobals() {
            global.window = windowObject;
            global.document = document;
            global.localStorage = localStorage;
            global.HTMLElement = FakeHTMLElement;
            global.CustomEvent = FakeCustomEvent;
            global.Event = FakeEvent;
            global.customElements = {
                define(name, ctor) {
                    registry.set(name, ctor);
                },
                get(name) {
                    return registry.get(name);
                }
            };
        },
        uninstallGlobals() {
            delete global.window;
            delete global.document;
            delete global.localStorage;
            delete global.HTMLElement;
            delete global.CustomEvent;
            delete global.Event;
            delete global.customElements;
        },
        createToggle() {
            const ToggleClass = this.ToggleClass || global.customElements.get('theme-toggle-landscape');
            return new ToggleClass();
        },
        requireComponent() {
            const modulePath = path.resolve(__dirname, '../public/js/theme-toggle-landscape-component.js');
            const resolvedPath = require.resolve(modulePath);
            delete require.cache[resolvedPath];
            this.ToggleClass = require(resolvedPath);
            return this.ToggleClass;
        }
    };
}

describe('theme-toggle-landscape component', () => {
    let env;

    beforeEach(() => {
        jest.useFakeTimers();
        env = createEnvironment();
        env.installGlobals();
        env.requireComponent();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        env.uninstallGlobals();
    });

    test('hydrates the saved night theme on connect', () => {
        env.localStorage.setItem('theme', 'night');
        const toggle = env.createToggle();
        env.body.appendChild(toggle);

        const button = toggle.shadowRoot.querySelector('#themeToggle');

        expect(toggle.getAttribute('data-theme')).toBe('night');
        expect(env.body.classList.contains('dark-theme')).toBe(true);
        expect(button.getAttribute('aria-pressed')).toBe('true');
        expect(button.getAttribute('aria-label')).toBe('Activate light theme');
    });

    test('click from rest activates first, then switches theme and emits theme-changed', () => {
        const toggle = env.createToggle();
        env.body.appendChild(toggle);

        const button = toggle.shadowRoot.querySelector('#themeToggle');
        const themeChanged = jest.fn();

        toggle.addEventListener('theme-changed', themeChanged);
        button.click();

        expect(toggle.getAttribute('data-activation')).toBe('sun');
        expect(toggle.hasAttribute('data-transition')).toBe(false);
        expect(toggle.getAttribute('data-theme')).toBe('day');
        expect(env.body.classList.contains('dark-theme')).toBe(false);
        expect(themeChanged).toHaveBeenCalledTimes(0);

        jest.advanceTimersByTime(120);

        expect(toggle.hasAttribute('data-activation')).toBe(false);
        expect(toggle.getAttribute('data-theme')).toBe('night');
        expect(toggle.getAttribute('data-transition')).toBe('to-night');
        expect(env.body.classList.contains('dark-theme')).toBe(true);
        expect(env.localStorage.getItem('theme')).toBe('night');
        expect(button.getAttribute('aria-pressed')).toBe('true');
        expect(button.getAttribute('aria-label')).toBe('Activate light theme');
        expect(themeChanged).toHaveBeenCalledTimes(1);
        expect(themeChanged.mock.calls[0][0].detail).toEqual({ theme: 'night' });

        jest.advanceTimersByTime(860);
        expect(toggle.hasAttribute('data-transition')).toBe(false);
    });

    test('hover preview enters and exits in day mode without switching theme', () => {
        const toggle = env.createToggle();
        env.body.appendChild(toggle);

        const button = toggle.shadowRoot.querySelector('#themeToggle');
        button.dispatchEvent(new FakeEvent('pointerenter', { bubbles: true }));

        expect(toggle.getAttribute('data-preview')).toBe('sun');
        expect(toggle.getAttribute('data-theme')).toBe('day');
        expect(env.body.classList.contains('dark-theme')).toBe(false);

        button.dispatchEvent(new FakeEvent('pointerleave', { bubbles: true }));
        expect(toggle.hasAttribute('data-preview')).toBe(false);
        expect(toggle.getAttribute('data-theme')).toBe('day');
    });

    test('click from preview skips activation and enters transition directly', () => {
        const toggle = env.createToggle();
        env.body.appendChild(toggle);

        const button = toggle.shadowRoot.querySelector('#themeToggle');
        button.dispatchEvent(new FakeEvent('pointerenter', { bubbles: true }));
        button.click();

        expect(toggle.hasAttribute('data-preview')).toBe(false);
        expect(toggle.hasAttribute('data-activation')).toBe(false);
        expect(toggle.getAttribute('data-theme')).toBe('night');
        expect(toggle.getAttribute('data-transition')).toBe('to-night');
    });

    test('hover preview uses moon in the resting night state', () => {
        env.localStorage.setItem('theme', 'night');
        const toggle = env.createToggle();
        env.body.appendChild(toggle);

        const button = toggle.shadowRoot.querySelector('#themeToggle');
        button.dispatchEvent(new FakeEvent('pointerenter', { bubbles: true }));

        expect(toggle.getAttribute('data-theme')).toBe('night');
        expect(toggle.getAttribute('data-preview')).toBe('moon');

        button.dispatchEvent(new FakeEvent('pointerleave', { bubbles: true }));
        expect(toggle.hasAttribute('data-preview')).toBe(false);
    });

    test('reduced motion uses the shortened activation and transition timing', () => {
        env.uninstallGlobals();
        env = createEnvironment({ reducedMotion: true });
        env.installGlobals();
        env.requireComponent();

        const toggle = env.createToggle();
        env.body.appendChild(toggle);

        const button = toggle.shadowRoot.querySelector('#themeToggle');
        button.click();

        expect(toggle.getAttribute('data-reduced-motion')).toBe('true');
        expect(toggle.getAttribute('data-activation')).toBe('sun');

        jest.advanceTimersByTime(70);
        expect(toggle.getAttribute('data-transition')).toBe('to-night');

        jest.advanceTimersByTime(260);
        expect(toggle.hasAttribute('data-transition')).toBe(false);
    });
});
