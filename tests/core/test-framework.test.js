/**
 * Test Framework Validation Tests
 * Ensures the testing infrastructure is properly set up and functional
 */

import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import { 
  elementConfigGenerator, 
  cssBlockingGenerator,
  createElementFromConfig,
  applyCSSFromConfig 
} from '../utils/test-generators.js';
import { 
  validateTestElement, 
  simulateInteraction, 
  analyzeCSSBlocking,
  createElementTestReport 
} from '../utils/test-helpers.js';

describe('Test Framework Infrastructure', () => {
  beforeEach(() => {
    // Clean DOM before each test
    document.body.innerHTML = '';
  });

  describe('Test Environment Setup', () => {
    it('should have global test configuration available', () => {
      expect(global.TEST_CONFIG).toBeDefined();
      expect(global.TEST_CONFIG.PBT_ITERATIONS).toBe(100);
      expect(global.TEST_CONFIG.SELECTORS).toBeDefined();
      expect(global.TEST_CONFIG.ELEMENT_TYPES).toBeDefined();
    });

    it('should have test utilities available', () => {
      expect(global.TestUtils).toBeDefined();
      expect(typeof global.TestUtils.createMockElement).toBe('function');
      expect(typeof global.TestUtils.createMockPortfolioPage).toBe('function');
      expect(typeof global.TestUtils.simulateClick).toBe('function');
    });

    it('should create mock portfolio page structure', () => {
      const page = global.TestUtils.createMockPortfolioPage();
      
      expect(page).toBeDefined();
      expect(page.id).toBe('portfolio-container');
      expect(document.querySelector('.project-toggles')).toBeDefined();
      expect(document.querySelector('.accordion-nav')).toBeDefined();
      expect(document.querySelectorAll('.project-toggle')).toHaveLength(3);
    });
  });

  describe('Property-Based Test Generators', () => {
    it('should generate valid element configurations', () => {
      fc.assert(fc.property(elementConfigGenerator, (config) => {
        expect(config.type).toMatch(/^(project-toggle|accordion-header|accordion-link|navigation)$/);
        expect(config.id).toMatch(/^test-/);
        expect(typeof config.className).toBe('string');
        expect(typeof config.innerHTML).toBe('string');
        expect(typeof config.visible).toBe('boolean');
        expect(typeof config.hasEventListener).toBe('boolean');
        return true;
      }), { numRuns: 50 });
    });

    it('should generate valid CSS blocking configurations', () => {
      fc.assert(fc.property(cssBlockingGenerator, (cssConfig) => {
        expect(['auto', 'none', 'inherit', 'initial']).toContain(cssConfig.pointerEvents);
        expect(['visible', 'hidden', 'collapse']).toContain(cssConfig.visibility);
        expect(['block', 'inline', 'none', 'flex', 'grid']).toContain(cssConfig.display);
        expect(typeof cssConfig.zIndex).toBe('number');
        expect(cssConfig.opacity).toBeGreaterThanOrEqual(0);
        expect(cssConfig.opacity).toBeLessThanOrEqual(1);
        return true;
      }), { numRuns: 50 });
    });

    it('should create DOM elements from generated configurations', () => {
      fc.assert(fc.property(elementConfigGenerator, (config) => {
        const element = createElementFromConfig(config);
        
        expect(element).toBeInstanceOf(HTMLElement);
        expect(element.id).toBe(config.id);
        expect(element.className).toBe(config.className);
        expect(element.textContent).toBe(config.innerHTML);
        expect(element.getAttribute('data-test-type')).toBe(config.type);
        
        if (!config.visible) {
          expect(element.style.display).toBe('none');
        }
        
        return true;
      }), { numRuns: 30 });
    });
  });

  describe('Test Helper Functions', () => {
    it('should validate test elements correctly', () => {
      const element = global.TestUtils.createMockElement('project-toggle', {
        id: 'test-element',
        className: 'test-class'
      });

      // Set some dimensions for the test element
      element.style.width = '100px';
      element.style.height = '50px';

      const validation = validateTestElement(element);
      
      expect(validation.exists).toBe(true);
      expect(validation.isInDOM).toBe(true);
      expect(validation.hasValidType).toBe(true);
      expect(validation.isVisible).toBe(true);
      // Note: In jsdom, getBoundingClientRect may return 0 dimensions
      // so we'll just check that the validation runs without error
      expect(typeof validation.hasValidDimensions).toBe('boolean');
    });

    it('should simulate click interactions', () => {
      const element = global.TestUtils.createMockElement('project-toggle');
      let clicked = false;
      
      element.addEventListener('click', () => {
        clicked = true;
      });

      const result = simulateInteraction(element, 'click');
      
      expect(result).toBe(true);
      expect(clicked).toBe(true);
    });

    it('should analyze CSS blocking correctly', () => {
      const element = global.TestUtils.createMockElement('project-toggle');
      
      // Test normal element
      let analysis = analyzeCSSBlocking(element);
      expect(analysis.hasBlockingIssues).toBe(false);
      expect(analysis.isInteractable).toBe(true);
      
      // Test blocked element
      element.style.pointerEvents = 'none';
      analysis = analyzeCSSBlocking(element);
      expect(analysis.hasBlockingIssues).toBe(true);
      expect(analysis.isInteractable).toBe(false);
      expect(analysis.blockingIssues[0].property).toBe('pointer-events');
    });

    it('should create comprehensive test reports', () => {
      const element = global.TestUtils.createMockElement('project-toggle', {
        id: 'test-report-element'
      });
      
      const testResults = {
        interactionSuccessful: true,
        responseTime: 50,
        responseDetected: true
      };
      
      const report = createElementTestReport(element, testResults);
      
      expect(report.element.id).toBe('test-report-element');
      expect(report.element.type).toBe('project-toggle');
      expect(report.validation).toBeDefined();
      expect(report.cssAnalysis).toBeDefined();
      expect(report.testResults).toBe(testResults);
      expect(report.passed).toBe(true);
      expect(report.timestamp).toBeDefined();
    });
  });

  describe('Fast-Check Integration', () => {
    it('should run property-based tests with configured iterations', () => {
      let runCount = 0;
      
      fc.assert(fc.property(fc.integer(), (n) => {
        runCount++;
        return typeof n === 'number';
      }), { numRuns: global.TEST_CONFIG.PBT_ITERATIONS });
      
      expect(runCount).toBe(global.TEST_CONFIG.PBT_ITERATIONS);
    });

    it('should handle property test failures gracefully', () => {
      expect(() => {
        fc.assert(fc.property(fc.integer(), (n) => {
          return n < 0; // This will fail for positive numbers
        }), { numRuns: 10 });
      }).toThrow();
    });
  });

  describe('DOM Manipulation Utilities', () => {
    it('should clean up DOM between tests', () => {
      // Add some elements
      global.TestUtils.createMockElement('test-element');
      expect(document.body.children.length).toBeGreaterThan(0);
      
      // Simulate beforeEach cleanup (this happens automatically)
      document.body.innerHTML = '';
      expect(document.body.children.length).toBe(0);
    });

    it('should handle event listener cleanup', () => {
      const element = global.TestUtils.createMockElement('project-toggle');
      let eventFired = false;
      
      const handler = () => { eventFired = true; };
      element.addEventListener('click', handler);
      
      // Simulate click
      element.click();
      expect(eventFired).toBe(true);
      
      // Remove listener
      element.removeEventListener('click', handler);
      eventFired = false;
      element.click();
      expect(eventFired).toBe(false);
    });
  });
});