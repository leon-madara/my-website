/**
 * Property-Based Test Generators
 * Provides generators for creating test data for portfolio clickability tests
 */

import fc from 'fast-check';

/**
 * Generates random element configurations for testing
 */
export const elementConfigGenerator = fc.record({
  type: fc.constantFrom('project-toggle', 'accordion-header', 'accordion-link', 'navigation'),
  id: fc.string({ minLength: 1, maxLength: 20 }).map(s => `test-${s}`),
  className: fc.array(fc.string({ minLength: 1, maxLength: 15 }), { minLength: 1, maxLength: 3 }).map(arr => arr.join(' ')),
  innerHTML: fc.string({ minLength: 1, maxLength: 50 }),
  visible: fc.boolean(),
  hasEventListener: fc.boolean()
});

/**
 * Generates CSS property combinations that might block interactions
 */
export const cssBlockingGenerator = fc.record({
  pointerEvents: fc.constantFrom('auto', 'none', 'inherit', 'initial'),
  visibility: fc.constantFrom('visible', 'hidden', 'collapse'),
  display: fc.constantFrom('block', 'inline', 'none', 'flex', 'grid'),
  zIndex: fc.integer({ min: -1000, max: 1000 }),
  opacity: fc.float({ min: 0, max: 1, noNaN: true }),
  position: fc.constantFrom('static', 'relative', 'absolute', 'fixed', 'sticky')
});

/**
 * Generates viewport and element dimension configurations
 */
export const dimensionGenerator = fc.record({
  elementWidth: fc.integer({ min: 0, max: 500 }),
  elementHeight: fc.integer({ min: 0, max: 200 }),
  elementX: fc.integer({ min: -100, max: 1920 }),
  elementY: fc.integer({ min: -100, max: 1080 }),
  viewportWidth: fc.integer({ min: 320, max: 1920 }),
  viewportHeight: fc.integer({ min: 240, max: 1080 })
});

/**
 * Generates event listener configurations
 */
export const eventListenerGenerator = fc.record({
  eventType: fc.constantFrom('click', 'mousedown', 'mouseup', 'touchstart', 'touchend'),
  useCapture: fc.boolean(),
  passive: fc.boolean(),
  once: fc.boolean(),
  handlerExists: fc.boolean()
});

/**
 * Generates entrance animation states
 */
export const animationStateGenerator = fc.record({
  animationComplete: fc.boolean(),
  animationDuration: fc.integer({ min: 0, max: 5000 }),
  hasEntranceCompleteClass: fc.boolean(),
  animationDelay: fc.integer({ min: 0, max: 2000 })
});

/**
 * Generates performance test scenarios
 */
export const performanceScenarioGenerator = fc.record({
  elementCount: fc.integer({ min: 1, max: 50 }),
  simulatedLoad: fc.constantFrom('light', 'medium', 'heavy'),
  networkDelay: fc.integer({ min: 0, max: 1000 }),
  cpuThrottling: fc.float({ min: 1, max: 4 })
});

/**
 * Generates browser compatibility scenarios
 */
export const browserScenarioGenerator = fc.record({
  userAgent: fc.constantFrom(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
  ),
  touchSupport: fc.boolean(),
  pointerSupport: fc.boolean(),
  modernEventSupport: fc.boolean()
});

/**
 * Creates a generator for complete test scenarios
 */
export const testScenarioGenerator = fc.record({
  elements: fc.array(elementConfigGenerator, { minLength: 1, maxLength: 10 }),
  cssRules: fc.array(cssBlockingGenerator, { minLength: 0, maxLength: 5 }),
  dimensions: dimensionGenerator,
  eventListeners: fc.array(eventListenerGenerator, { minLength: 0, maxLength: 3 }),
  animationState: animationStateGenerator,
  performance: performanceScenarioGenerator,
  browser: browserScenarioGenerator
});

/**
 * Helper function to create DOM elements from generated configurations
 */
export function createElementFromConfig(config) {
  const element = document.createElement(config.type === 'accordion-link' ? 'a' : 'button');
  
  element.id = config.id;
  element.className = config.className;
  // Use textContent instead of innerHTML to avoid HTML encoding issues
  element.textContent = config.innerHTML;
  element.setAttribute('data-test-type', config.type);
  
  if (!config.visible) {
    element.style.display = 'none';
  }
  
  if (config.hasEventListener) {
    element.addEventListener('click', () => {
      element.setAttribute('data-clicked', 'true');
    });
  }
  
  return element;
}

/**
 * Helper function to apply CSS rules from generated configuration
 */
export function applyCSSFromConfig(element, cssConfig) {
  Object.entries(cssConfig).forEach(([property, value]) => {
    const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
    element.style[property] = value;
  });
}

/**
 * Helper function to set up viewport from generated configuration
 */
export function setupViewportFromConfig(dimensionConfig) {
  // Mock viewport dimensions (in real browser this would be handled differently)
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: dimensionConfig.viewportWidth
  });
  
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: dimensionConfig.viewportHeight
  });
}