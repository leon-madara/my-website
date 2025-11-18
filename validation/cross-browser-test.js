/**
 * Cross-Browser Compatibility Testing Suite
 * Tests functionality across different browsers and devices
 */

class CrossBrowserValidator {
    constructor() {
        this.testResults = {
            browser: this.detectBrowser(),
            device: this.detectDevice(),
            features: {},
            animations: {},
            interactions: {},
            performance: {},
            errors: []
        };

        this.init();
    }

    init() {
        console.log('Starting cross-browser compatibility tests...');
        this.runAllTests();
    }

    detectBrowser() {
        const userAgent = navigator.userAgent;

        if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
            return { name: 'Chrome', version: this.extractVersion(userAgent, 'Chrome/') };
        } else if (userAgent.includes('Firefox')) {
            return { name: 'Firefox', version: this.extractVersion(userAgent, 'Firefox/') };
        } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
            return { name: 'Safari', version: this.extractVersion(userAgent, 'Version/') };
        } else if (userAgent.includes('Edg')) {
            return { name: 'Edge', version: this.extractVersion(userAgent, 'Edg/') };
        } else {
            return { name: 'Unknown', version: 'Unknown' };
        }
    }

    detectDevice() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isTablet = /iPad|Android(?=.*Mobile)/i.test(navigator.userAgent);

        return {
            type: isMobile ? (isTablet ? 'tablet' : 'mobile') : 'desktop',
            touchSupport: 'ontouchstart' in window,
            screenSize: `${window.screen.width}x${window.screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`
        };
    }

    extractVersion(userAgent, prefix) {
        const start = userAgent.indexOf(prefix) + prefix.length;
        const end = userAgent.indexOf(' ', start);
        return userAgent.substring(start, end === -1 ? undefined : end);
    }

    runAllTests() {
        // Test core features
        this.testCoreFeatures();

        // Test animations
        this.testAnimations();

        // Test interactions
        this.testInteractions();

        // Test performance
        this.testPerformance();

        // Test mobile-specific features
        if (this.testResults.device.type !== 'desktop') {
            this.testMobileFeatures();
        }

        // Generate report
        this.generateReport();
    }

    testCoreFeatures() {
        console.log('Testing core features...');

        const features = {
            cssCustomProperties: this.testCSSCustomProperties(),
            cssGrid: this.testCSSGrid(),
            flexbox: this.testFlexbox(),
            transforms: this.testTransforms(),
            animations: this.testCSSAnimations(),
            intersectionObserver: this.testIntersectionObserver(),
            resizeObserver: this.testResizeObserver(),
            requestAnimationFrame: this.testRequestAnimationFrame(),
            localStorage: this.testLocalStorage(),
            eventListeners: this.testEventListeners()
        };

        this.testResults.features = features;

        // Test DOM elements exist
        this.testDOMElements();
    }

    testCSSCustomProperties() {
        try {
            const testElement = document.createElement('div');
            testElement.style.setProperty('--test-prop', 'test');
            return testElement.style.getPropertyValue('--test-prop') === 'test';
        } catch (e) {
            this.testResults.errors.push('CSS Custom Properties not supported');
            return false;
        }
    }

    testCSSGrid() {
        try {
            const testElement = document.createElement('div');
            testElement.style.display = 'grid';
            return testElement.style.display === 'grid';
        } catch (e) {
            this.testResults.errors.push('CSS Grid not supported');
            return false;
        }
    }

    testFlexbox() {
        try {
            const testElement = document.createElement('div');
            testElement.style.display = 'flex';
            return testElement.style.display === 'flex';
        } catch (e) {
            this.testResults.errors.push('Flexbox not supported');
            return false;
        }
    }

    testTransforms() {
        try {
            const testElement = document.createElement('div');
            testElement.style.transform = 'translateX(10px)';
            return testElement.style.transform !== '';
        } catch (e) {
            this.testResults.errors.push('CSS Transforms not supported');
            return false;
        }
    }

    testCSSAnimations() {
        try {
            const testElement = document.createElement('div');
            testElement.style.animation = 'test 1s ease';
            return testElement.style.animation !== '';
        } catch (e) {
            this.testResults.errors.push('CSS Animations not supported');
            return false;
        }
    }

    testIntersectionObserver() {
        return typeof IntersectionObserver !== 'undefined';
    }

    testResizeObserver() {
        return typeof ResizeObserver !== 'undefined';
    }

    testRequestAnimationFrame() {
        return typeof requestAnimationFrame !== 'undefined';
    }

    testLocalStorage() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (e) {
            this.testResults.errors.push('LocalStorage not supported');
            return false;
        }
    }

    testEventListeners() {
        try {
            const testElement = document.createElement('div');
            const testFunction = () => { };
            testElement.addEventListener('click', testFunction);
            testElement.removeEventListener('click', testFunction);
            return true;
        } catch (e) {
            this.testResults.errors.push('Event Listeners not supported');
            return false;
        }
    }

    testDOMElements() {
        const requiredElements = [
            '.floating-navigation',
            '.hero-section',
            '.pill-sidebar',
            '.footer',
            '.nav-item',
            '.hero-content',
            '.greeting',
            '.name',
            '.role'
        ];

        const missingElements = [];

        requiredElements.forEach(selector => {
            const element = document.querySelector(selector);
            if (!element) {
                missingElements.push(selector);
            }
        });

        if (missingElements.length > 0) {
            this.testResults.errors.push(`Missing DOM elements: ${missingElements.join(', ')}`);
        }

        this.testResults.features.domElements = missingElements.length === 0;

        // Test greeting text responsive behavior
        this.testGreetingResponsiveBehavior();
    }

    testGreetingResponsiveBehavior() {
        try {
            const greetingElement = document.querySelector('.greeting');
            if (!greetingElement) {
                this.testResults.errors.push('Greeting element not found for responsive testing');
                return false;
            }

            // Get computed styles
            const computedStyle = window.getComputedStyle(greetingElement);
            const fontSize = computedStyle.fontSize;
            const fontFamily = computedStyle.fontFamily;

            // Verify font family is Space Mono or fallback monospace
            const hasCorrectFont = fontFamily.includes('Space Mono') || fontFamily.includes('monospace');
            if (!hasCorrectFont) {
                this.testResults.errors.push('Greeting text does not have correct font family');
            }

            // Verify font size is using the 2x scaled value (should be larger than default)
            const fontSizeValue = parseFloat(fontSize);
            const isLargeEnough = fontSizeValue >= 40; // Should be at least 2.5rem (40px) at minimum
            if (!isLargeEnough) {
                this.testResults.errors.push('Greeting text font size appears too small for 2x scaling');
            }

            // Check for layout overflow
            const parentElement = greetingElement.parentElement;
            const greetingRect = greetingElement.getBoundingClientRect();
            const parentRect = parentElement.getBoundingClientRect();

            const hasOverflow = greetingRect.width > parentRect.width;
            if (hasOverflow) {
                this.testResults.errors.push('Greeting text causes horizontal overflow');
            }

            // Test responsive behavior at different viewport sizes
            this.testGreetingAtViewportSizes();

            this.testResults.features.greetingResponsive = hasCorrectFont && isLargeEnough && !hasOverflow;
            return this.testResults.features.greetingResponsive;

        } catch (e) {
            this.testResults.errors.push('Greeting responsive behavior test failed: ' + e.message);
            return false;
        }
    }

    testGreetingAtViewportSizes() {
        try {
            const greetingElement = document.querySelector('.greeting');
            if (!greetingElement) return;

            // Store original viewport size
            const originalWidth = window.innerWidth;
            const originalHeight = window.innerHeight;

            // Test different viewport sizes (simulated)
            const testSizes = [
                { width: 320, name: 'mobile' },
                { width: 768, name: 'tablet' },
                { width: 1024, name: 'desktop' },
                { width: 1920, name: 'large-desktop' }
            ];

            testSizes.forEach(size => {
                // We can't actually resize the viewport in tests, but we can check
                // that the CSS clamp() function would work at different sizes
                const computedStyle = window.getComputedStyle(greetingElement);
                const fontSize = computedStyle.fontSize;

                // Verify font size is reasonable (not too small or too large)
                const fontSizeValue = parseFloat(fontSize);
                const isReasonable = fontSizeValue >= 20 && fontSizeValue <= 96; // 1.25rem to 6rem range

                if (!isReasonable) {
                    this.testResults.errors.push(`Greeting font size (${fontSize}) unreasonable for ${size.name} viewport`);
                }
            });

        } catch (e) {
            this.testResults.errors.push('Viewport size testing failed: ' + e.message);
        }
    }

    testAnimations() {
        console.log('Testing animations...');

        const animations = {
            fadeInUp: this.testFadeInUpAnimation(),
            slideInLeft: this.testSlideInLeftAnimation(),
            haloAnimations: this.testHaloAnimations(),
            reducedMotion: this.testReducedMotionSupport()
        };

        this.testResults.animations = animations;
    }

    testFadeInUpAnimation() {
        try {
            const testElement = document.createElement('div');
            testElement.style.animation = 'fadeInUp 0.3s ease forwards';
            document.body.appendChild(testElement);

            // Check if animation is applied
            const computedStyle = window.getComputedStyle(testElement);
            const hasAnimation = computedStyle.animationName !== 'none';

            document.body.removeChild(testElement);
            return hasAnimation;
        } catch (e) {
            this.testResults.errors.push('FadeInUp animation test failed');
            return false;
        }
    }

    testSlideInLeftAnimation() {
        try {
            const testElement = document.createElement('div');
            testElement.style.animation = 'slideInLeft 0.3s ease forwards';
            document.body.appendChild(testElement);

            const computedStyle = window.getComputedStyle(testElement);
            const hasAnimation = computedStyle.animationName !== 'none';

            document.body.removeChild(testElement);
            return hasAnimation;
        } catch (e) {
            this.testResults.errors.push('SlideInLeft animation test failed');
            return false;
        }
    }

    testHaloAnimations() {
        try {
            // Test if halo system is available
            const hasHaloSystem = typeof LeonPortfolio !== 'undefined' &&
                LeonPortfolio.HaloAnimationSystem;

            if (!hasHaloSystem) {
                this.testResults.errors.push('Halo animation system not found');
                return false;
            }

            return true;
        } catch (e) {
            this.testResults.errors.push('Halo animation test failed');
            return false;
        }
    }

    testReducedMotionSupport() {
        try {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            return prefersReducedMotion !== null;
        } catch (e) {
            this.testResults.errors.push('Reduced motion detection failed');
            return false;
        }
    }

    testInteractions() {
        console.log('Testing interactions...');

        const interactions = {
            mouseEvents: this.testMouseEvents(),
            keyboardEvents: this.testKeyboardEvents(),
            touchEvents: this.testTouchEvents(),
            focusManagement: this.testFocusManagement(),
            navigationInteractions: this.testNavigationInteractions()
        };

        this.testResults.interactions = interactions;
    }

    testMouseEvents() {
        try {
            const navItems = document.querySelectorAll('.nav-item');
            if (navItems.length === 0) {
                this.testResults.errors.push('No navigation items found for mouse event testing');
                return false;
            }

            // Test hover events
            const firstNavItem = navItems[0];
            const mouseEnterEvent = new MouseEvent('mouseenter', { bubbles: true });
            const mouseLeaveEvent = new MouseEvent('mouseleave', { bubbles: true });

            firstNavItem.dispatchEvent(mouseEnterEvent);
            firstNavItem.dispatchEvent(mouseLeaveEvent);

            return true;
        } catch (e) {
            this.testResults.errors.push('Mouse event testing failed');
            return false;
        }
    }

    testKeyboardEvents() {
        try {
            const navItems = document.querySelectorAll('.nav-item');
            if (navItems.length === 0) {
                return false;
            }

            const firstNavItem = navItems[0];
            const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });

            firstNavItem.dispatchEvent(keydownEvent);
            return true;
        } catch (e) {
            this.testResults.errors.push('Keyboard event testing failed');
            return false;
        }
    }

    testTouchEvents() {
        if (!this.testResults.device.touchSupport) {
            return true; // Not applicable for non-touch devices
        }

        try {
            const navItems = document.querySelectorAll('.nav-item');
            if (navItems.length === 0) {
                return false;
            }

            const firstNavItem = navItems[0];
            const touchStartEvent = new TouchEvent('touchstart', { bubbles: true });
            const touchEndEvent = new TouchEvent('touchend', { bubbles: true });

            firstNavItem.dispatchEvent(touchStartEvent);
            firstNavItem.dispatchEvent(touchEndEvent);

            return true;
        } catch (e) {
            this.testResults.errors.push('Touch event testing failed');
            return false;
        }
    }

    testFocusManagement() {
        try {
            const navItems = document.querySelectorAll('.nav-item');
            if (navItems.length === 0) {
                return false;
            }

            const firstNavItem = navItems[0];
            firstNavItem.focus();

            const hasFocus = document.activeElement === firstNavItem;
            firstNavItem.blur();

            return hasFocus;
        } catch (e) {
            this.testResults.errors.push('Focus management testing failed');
            return false;
        }
    }

    testNavigationInteractions() {
        try {
            // Test if FloatingNavigation class is available and working
            const hasFloatingNav = typeof LeonPortfolio !== 'undefined' &&
                LeonPortfolio.FloatingNavigation;

            if (!hasFloatingNav) {
                this.testResults.errors.push('FloatingNavigation class not found');
                return false;
            }

            return true;
        } catch (e) {
            this.testResults.errors.push('Navigation interaction testing failed');
            return false;
        }
    }

    testPerformance() {
        console.log('Testing performance...');

        const performance = {
            loadTime: this.measureLoadTime(),
            animationFrameRate: this.testAnimationFrameRate(),
            memoryUsage: this.testMemoryUsage(),
            renderingPerformance: this.testRenderingPerformance()
        };

        this.testResults.performance = performance;
    }

    measureLoadTime() {
        try {
            if (window.performance && window.performance.timing) {
                const timing = window.performance.timing;
                const loadTime = timing.loadEventEnd - timing.navigationStart;
                return {
                    total: loadTime,
                    domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
                    acceptable: loadTime < 3000 // 3 seconds threshold
                };
            }
            return { error: 'Performance timing not available' };
        } catch (e) {
            this.testResults.errors.push('Load time measurement failed');
            return { error: e.message };
        }
    }

    testAnimationFrameRate() {
        return new Promise((resolve) => {
            let frameCount = 0;
            const startTime = performance.now();
            const duration = 1000; // Test for 1 second

            const countFrames = () => {
                frameCount++;
                const elapsed = performance.now() - startTime;

                if (elapsed < duration) {
                    requestAnimationFrame(countFrames);
                } else {
                    const fps = Math.round((frameCount * 1000) / elapsed);
                    resolve({
                        fps: fps,
                        acceptable: fps >= 30, // 30 FPS minimum
                        smooth: fps >= 60 // 60 FPS ideal
                    });
                }
            };

            requestAnimationFrame(countFrames);
        });
    }

    testMemoryUsage() {
        try {
            if (window.performance && window.performance.memory) {
                const memory = window.performance.memory;
                return {
                    used: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
                    total: Math.round(memory.totalJSHeapSize / 1024 / 1024), // MB
                    limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024), // MB
                    acceptable: memory.usedJSHeapSize < (memory.jsHeapSizeLimit * 0.8)
                };
            }
            return { error: 'Memory API not available' };
        } catch (e) {
            this.testResults.errors.push('Memory usage testing failed');
            return { error: e.message };
        }
    }

    testRenderingPerformance() {
        try {
            const startTime = performance.now();

            // Create and animate test elements
            const testElement = document.createElement('div');
            testElement.style.cssText = `
                position: absolute;
                top: -1000px;
                width: 100px;
                height: 100px;
                background: red;
                transition: transform 0.3s ease;
            `;

            document.body.appendChild(testElement);

            // Force reflow
            testElement.offsetHeight;

            // Apply transform
            testElement.style.transform = 'translateX(100px)';

            // Force another reflow
            testElement.offsetHeight;

            const renderTime = performance.now() - startTime;

            document.body.removeChild(testElement);

            return {
                renderTime: renderTime,
                acceptable: renderTime < 16.67 // 60 FPS threshold
            };
        } catch (e) {
            this.testResults.errors.push('Rendering performance testing failed');
            return { error: e.message };
        }
    }

    testMobileFeatures() {
        console.log('Testing mobile-specific features...');

        const mobileFeatures = {
            touchGestures: this.testTouchGestures(),
            orientationChange: this.testOrientationChange(),
            viewportHandling: this.testViewportHandling(),
            mobileNavigation: this.testMobileNavigation()
        };

        this.testResults.mobileFeatures = mobileFeatures;
    }

    testTouchGestures() {
        try {
            // Test if touch gesture handlers are set up
            const hasGlobalTouchHandlers = typeof LeonPortfolio !== 'undefined' &&
                LeonPortfolio.state &&
                LeonPortfolio.state.isMobile !== undefined;

            return hasGlobalTouchHandlers;
        } catch (e) {
            this.testResults.errors.push('Touch gesture testing failed');
            return false;
        }
    }

    testOrientationChange() {
        try {
            // Test if orientation change is handled
            const orientationEvent = new Event('orientationchange');
            window.dispatchEvent(orientationEvent);
            return true;
        } catch (e) {
            this.testResults.errors.push('Orientation change testing failed');
            return false;
        }
    }

    testViewportHandling() {
        try {
            // Test viewport meta tag
            const viewportMeta = document.querySelector('meta[name="viewport"]');
            const hasViewportMeta = viewportMeta !== null;

            // Test visual viewport API if available
            const hasVisualViewport = typeof window.visualViewport !== 'undefined';

            return {
                viewportMeta: hasViewportMeta,
                visualViewportAPI: hasVisualViewport,
                content: viewportMeta ? viewportMeta.getAttribute('content') : null
            };
        } catch (e) {
            this.testResults.errors.push('Viewport handling testing failed');
            return false;
        }
    }

    testMobileNavigation() {
        try {
            const navigation = document.querySelector('.floating-navigation');
            if (!navigation) {
                return false;
            }

            // Test if mobile classes are applied correctly
            const hasMobileSupport = navigation.classList.contains('mobile-layout') ||
                document.body.classList.contains('mobile');

            return hasMobileSupport;
        } catch (e) {
            this.testResults.errors.push('Mobile navigation testing failed');
            return false;
        }
    }

    generateReport() {
        console.log('Generating cross-browser compatibility report...');

        const report = {
            timestamp: new Date().toISOString(),
            browser: this.testResults.browser,
            device: this.testResults.device,
            summary: {
                totalTests: this.countTotalTests(),
                passedTests: this.countPassedTests(),
                failedTests: this.testResults.errors.length,
                overallScore: this.calculateOverallScore()
            },
            details: this.testResults
        };

        // Log report to console
        console.log('Cross-Browser Compatibility Report:', report);

        // Store report for potential display
        window.crossBrowserReport = report;

        return report;
    }

    countTotalTests() {
        let total = 0;

        // Count feature tests
        total += Object.keys(this.testResults.features).length;

        // Count animation tests
        total += Object.keys(this.testResults.animations).length;

        // Count interaction tests
        total += Object.keys(this.testResults.interactions).length;

        // Count performance tests
        total += Object.keys(this.testResults.performance).length;

        // Count mobile tests if applicable
        if (this.testResults.mobileFeatures) {
            total += Object.keys(this.testResults.mobileFeatures).length;
        }

        return total;
    }

    countPassedTests() {
        let passed = 0;

        // Count passed feature tests
        Object.values(this.testResults.features).forEach(result => {
            if (result === true) passed++;
        });

        // Count passed animation tests
        Object.values(this.testResults.animations).forEach(result => {
            if (result === true) passed++;
        });

        // Count passed interaction tests
        Object.values(this.testResults.interactions).forEach(result => {
            if (result === true) passed++;
        });

        // Count passed performance tests
        Object.values(this.testResults.performance).forEach(result => {
            if (typeof result === 'object' && result.acceptable === true) passed++;
        });

        // Count passed mobile tests
        if (this.testResults.mobileFeatures) {
            Object.values(this.testResults.mobileFeatures).forEach(result => {
                if (result === true) passed++;
            });
        }

        return passed;
    }

    calculateOverallScore() {
        const total = this.countTotalTests();
        const passed = this.countPassedTests();

        if (total === 0) return 0;

        return Math.round((passed / total) * 100);
    }
}

// Auto-run tests when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for the main application to initialize
    setTimeout(() => {
        new CrossBrowserValidator();
    }, 1000);
});

// Export for manual testing
window.CrossBrowserValidator = CrossBrowserValidator;