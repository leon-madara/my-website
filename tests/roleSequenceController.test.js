const path = require('path');

function createMockClassList() {
    const classes = new Set();

    return {
        add: (...tokens) => tokens.forEach((token) => classes.add(token)),
        remove: (...tokens) => tokens.forEach((token) => classes.delete(token)),
        contains: (token) => classes.has(token)
    };
}

function createMockElement(name = 'element') {
    const element = {
        nodeName: name.toUpperCase(),
        style: {
            setProperty(property, value) {
                this[property] = value;
            },
            getPropertyValue(property) {
                return this[property] || '';
            }
        },
        attributes: {},
        children: [],
        classList: createMockClassList(),
        textContent: '',
        parentNode: null,
        className: '',
        appendChild(child) {
            child.parentNode = this;
            this.children.push(child);
            return child;
        },
        removeChild(child) {
            this.children = this.children.filter((entry) => entry !== child);
            child.parentNode = null;
            return child;
        },
        setAttribute(name, value) {
            this.attributes[name] = String(value);
            if (name === 'id') {
                this.id = String(value);
            }
        },
        getAttribute(name) {
            return this.attributes[name];
        },
        querySelector(selector) {
            if (selector === '.role-sequence__text--current') {
                return this.currentText || null;
            }

            if (selector === '.role-sequence__text--next') {
                return this.nextText || null;
            }

            if (selector === '.role-sequence__sr-text') {
                return this.srText || null;
            }

            return null;
        },
        getBoundingClientRect() {
            const lines = this.textContent.length > 18 ? 2 : 1;
            return { height: 32 * lines };
        }
    };

    Object.defineProperty(element, 'offsetHeight', {
        get() {
            return this.getBoundingClientRect().height;
        }
    });

    return element;
}

function createEnvironment({ reducedMotion = false } = {}) {
    const currentText = createMockElement('span');
    const nextText = createMockElement('span');
    const srText = createMockElement('span');
    const container = createMockElement('h2');
    const body = createMockElement('body');
    const documentElement = createMockElement('html');

    container.currentText = currentText;
    container.nextText = nextText;
    container.srText = srText;

    const listeners = {};
    const motionListeners = [];
    let motionState = reducedMotion;
    let mounted = false;
    let rafId = 0;
    const rafCallbacks = new Map();

    const document = {
        readyState: 'complete',
        hidden: false,
        body,
        documentElement,
        fonts: { ready: Promise.resolve() },
        addEventListener(type, handler) {
            listeners[type] = handler;
        },
        removeEventListener(type) {
            delete listeners[type];
        },
        querySelector(selector) {
            if (selector === '.role-sequence' && mounted) {
                return container;
            }

            return null;
        },
        getElementById(id) {
            return body.children.find((child) => child.id === id) || null;
        },
        createElement(tagName) {
            return createMockElement(tagName);
        },
        createElementNS(_namespace, tagName) {
            return createMockElement(tagName);
        }
    };

    const windowObject = {
        addEventListener() { },
        removeEventListener() { },
        requestAnimationFrame(callback) {
            rafId += 1;
            rafCallbacks.set(rafId, callback);
            return rafId;
        },
        cancelAnimationFrame(id) {
            rafCallbacks.delete(id);
        },
        matchMedia() {
            return {
                get matches() {
                    return motionState;
                },
                addEventListener(type, handler) {
                    if (type === 'change') {
                        motionListeners.push(handler);
                    }
                },
                removeEventListener(type, handler) {
                    if (type === 'change') {
                        const index = motionListeners.indexOf(handler);
                        if (index >= 0) {
                            motionListeners.splice(index, 1);
                        }
                    }
                }
            };
        }
    };

    return {
        container,
        currentText,
        nextText,
        srText,
        body,
        document,
        windowObject,
        mount() {
            mounted = true;
        },
        setReducedMotion(value) {
            motionState = value;
        },
        runNextFrame(timestamp) {
            const nextEntry = rafCallbacks.entries().next().value;

            if (!nextEntry) {
                return false;
            }

            const [id, callback] = nextEntry;
            rafCallbacks.delete(id);
            callback(timestamp);
            return true;
        },
        requireController() {
            const modulePath = path.resolve(__dirname, '../public/js/role-sequence.js');
            const resolvedPath = require.resolve(modulePath);
            delete require.cache[resolvedPath];
            return require(resolvedPath);
        }
    };
}

describe('RoleSequenceController', () => {
    afterEach(() => {
        delete global.document;
        delete global.window;
    });

    test('injects the threshold filter and sets initial accessible text', () => {
        const env = createEnvironment();
        global.document = env.document;
        global.window = env.windowObject;

        const RoleSequenceController = env.requireController();
        env.mount();
        const controller = new RoleSequenceController();

        expect(env.body.children).toHaveLength(1);
        expect(env.body.children[0].attributes.id).toBe('role-sequence-threshold-svg');
        expect(env.srText.textContent).toBe('Full Stack AI Developer & Designer');
        expect(env.container.getAttribute('aria-label')).toBe('Full Stack AI Developer & Designer');

        controller.destroy();
    });

    test('uses the static fallback when reduced motion is preferred', () => {
        const env = createEnvironment({ reducedMotion: true });
        global.document = env.document;
        global.window = env.windowObject;

        const RoleSequenceController = env.requireController();
        env.mount();
        const controller = new RoleSequenceController();

        expect(env.container.classList.contains('role-sequence--reduced-motion')).toBe(true);
        expect(env.currentText.textContent).toBe('Full Stack AI Developer & Designer');
        expect(env.nextText.style.opacity).toBe('0');

        controller.destroy();
    });

    test('crossfades into the next role with its next color before the accessible label changes', () => {
        const env = createEnvironment();
        global.document = env.document;
        global.window = env.windowObject;

        const RoleSequenceController = env.requireController();
        env.mount();
        const controller = new RoleSequenceController();

        env.runNextFrame(0);
        env.runNextFrame(3001);
        env.runNextFrame(3301);

        expect(env.currentText.textContent).toBe('Full Stack AI Developer & Designer');
        expect(env.nextText.textContent).toBe('AI Integration Engineer');
        expect(Number.parseFloat(env.currentText.style.opacity)).toBeGreaterThan(0);
        expect(Number.parseFloat(env.currentText.style.opacity)).toBeLessThan(1);
        expect(Number.parseFloat(env.nextText.style.opacity)).toBeGreaterThan(0);
        expect(Number.parseFloat(env.nextText.style.opacity)).toBeLessThan(1);
        expect(env.currentText.style.filter).toContain('blur(');
        expect(env.nextText.style.filter).toContain('blur(');
        expect(env.currentText.style.getPropertyValue('--role-layer-color')).toBe('#ce1126');
        expect(env.nextText.style.getPropertyValue('--role-layer-color')).toBe('#006b3f');
        expect(env.container.getAttribute('aria-label')).toBe('Full Stack AI Developer & Designer');

        controller.destroy();
    });

    test('completes a crossfade transition and updates the visible and accessible role', () => {
        const env = createEnvironment();
        global.document = env.document;
        global.window = env.windowObject;

        const RoleSequenceController = env.requireController();
        env.mount();
        const controller = new RoleSequenceController();

        env.runNextFrame(0);
        env.runNextFrame(3001);
        env.runNextFrame(4452);

        expect(controller.getCurrentIndex()).toBe(1);
        expect(controller.getCurrentRoleText()).toBe('AI Integration Engineer');
        expect(env.currentText.textContent).toBe('AI Integration Engineer');
        expect(env.srText.textContent).toBe('AI Integration Engineer');
        expect(env.container.getAttribute('aria-label')).toBe('AI Integration Engineer');

        controller.destroy();
    });

    test('loops from the final role back to the first role with the same transition path', () => {
        const env = createEnvironment();
        global.document = env.document;
        global.window = env.windowObject;

        const RoleSequenceController = env.requireController();
        env.mount();
        const controller = new RoleSequenceController();

        env.runNextFrame(0);
        env.runNextFrame(3001);
        env.runNextFrame(4452);
        env.runNextFrame(7453);
        env.runNextFrame(8904);
        env.runNextFrame(11905);
        env.runNextFrame(13356);
        env.runNextFrame(16357);
        env.runNextFrame(17808);

        expect(controller.getCurrentIndex()).toBe(0);
        expect(controller.getCurrentRoleText()).toBe('Full Stack AI Developer & Designer');
        expect(env.currentText.textContent).toBe('Full Stack AI Developer & Designer');
        expect(env.nextText.textContent).toBe('AI Integration Engineer');
        expect(env.currentText.style.getPropertyValue('--role-layer-color')).toBe('#ce1126');

        controller.destroy();
    });
});
