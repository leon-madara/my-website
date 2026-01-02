/**
 * Test Setup Configuration
 * Initializes testing environment for portfolio clickability tests
 */

import { beforeEach, afterEach } from 'vitest';

// Global test configuration
global.TEST_CONFIG = {
  // Property-based testing configuration
  PBT_ITERATIONS: 100,
  
  // Performance testing thresholds
  CLICK_RESPONSE_THRESHOLD_MS: 100,
  
  // Element selectors for portfolio components
  SELECTORS: {
    PROJECT_TOGGLES: '.project-toggle, [data-project-toggle]',
    ACCORDION_HEADERS: '.accordion-header, [data-accordion-header]',
    ACCORDION_LINKS: '.accordion-link, [data-accordion-link]',
    NAVIGATION_LINKS: 'nav a, .nav-link'
  },
  
  // Test element types
  ELEMENT_TYPES: {
    PROJECT_TOGGLE: 'project-toggle',
    ACCORDION_HEADER: 'accordion-header', 
    ACCORDION_LINK: 'accordion-link',
    NAVIGATION: 'navigation'
  }
};

// Mock DOM environment setup
beforeEach(() => {
  // Reset DOM to clean state
  document.body.innerHTML = '';
  
  // Clear any existing event listeners
  const newBody = document.createElement('body');
  document.documentElement.replaceChild(newBody, document.body);
  
  // Reset any global state
  if (window.portfolioState) {
    window.portfolioState = {};
  }
});

afterEach(() => {
  // Clean up any timers or intervals
  clearTimeout();
  clearInterval();
  
  // Remove any added event listeners
  const events = ['click', 'mousedown', 'mouseup', 'touchstart', 'touchend'];
  events.forEach(event => {
    document.removeEventListener(event, () => {});
  });
});

// Utility functions for tests
global.TestUtils = {
  /**
   * Creates a mock interactive element for testing
   */
  createMockElement(type, options = {}) {
    const element = document.createElement(options.tagName || 'button');
    element.className = options.className || `test-${type}`;
    element.setAttribute('data-test-type', type);
    
    if (options.id) element.id = options.id;
    if (options.innerHTML) element.innerHTML = options.innerHTML;
    
    // Add to DOM if parent specified
    if (options.parent) {
      options.parent.appendChild(element);
    } else {
      document.body.appendChild(element);
    }
    
    return element;
  },
  
  /**
   * Creates a mock portfolio page structure
   */
  createMockPortfolioPage() {
    const container = document.createElement('div');
    container.id = 'portfolio-container';
    
    // Create project toggle buttons
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'project-toggles';
    for (let i = 1; i <= 3; i++) {
      const toggle = this.createMockElement('project-toggle', {
        className: 'project-toggle',
        id: `project-${i}`,
        innerHTML: `Project ${i}`,
        parent: toggleContainer
      });
    }
    container.appendChild(toggleContainer);
    
    // Create accordion navigation
    const accordion = document.createElement('div');
    accordion.className = 'accordion-nav';
    
    const header = this.createMockElement('accordion-header', {
      className: 'accordion-header',
      innerHTML: 'Navigation',
      parent: accordion
    });
    
    const content = document.createElement('div');
    content.className = 'accordion-content';
    for (let i = 1; i <= 3; i++) {
      this.createMockElement('accordion-link', {
        tagName: 'a',
        className: 'accordion-link',
        innerHTML: `Link ${i}`,
        parent: content
      });
    }
    accordion.appendChild(content);
    container.appendChild(accordion);
    
    document.body.appendChild(container);
    return container;
  },
  
  /**
   * Simulates a click event on an element
   */
  simulateClick(element, options = {}) {
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
      ...options
    });
    
    const startTime = performance.now();
    const result = element.dispatchEvent(event);
    const endTime = performance.now();
    
    return {
      success: result,
      responseTime: endTime - startTime,
      event
    };
  },
  
  /**
   * Waits for a condition to be true or timeout
   */
  async waitFor(condition, timeout = 1000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    return false;
  }
};

// Console setup for test output
console.log('Portfolio Clickability Test Environment Initialized');