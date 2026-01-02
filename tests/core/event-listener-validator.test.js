/**
 * Event Listener Validator Tests
 * Tests for event listener detection and validation functionality
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { EventListenerValidator } from './event-listener-validator.js';

describe('EventListenerValidator', () => {
  let validator;
  let testContainer;

  beforeEach(() => {
    validator = new EventListenerValidator();
    
    // Create test container
    testContainer = document.createElement('div');
    testContainer.id = 'test-container';
    document.body.appendChild(testContainer);
  });

  afterEach(() => {
    // Clean up test container
    if (testContainer && testContainer.parentNode) {
      testContainer.parentNode.removeChild(testContainer);
    }
  });

  describe('Event Listener Detection', () => {
    it('should detect inline click handlers', () => {
      const button = document.createElement('button');
      button.onclick = () => console.log('clicked');
      testContainer.appendChild(button);

      const listeners = validator.detectEventListeners(button, 'click');
      
      expect(listeners).toHaveLength(1);
      expect(listeners[0].type).toBe('inline');
      expect(listeners[0].eventType).toBe('click');
    });

    it('should detect attribute-based handlers', () => {
      const button = document.createElement('button');
      button.setAttribute('onclick', 'console.log("clicked")');
      testContainer.appendChild(button);

      const listeners = validator.detectEventListeners(button, 'click');
      
      expect(listeners.length).toBeGreaterThanOrEqual(1);
      const attributeListener = listeners.find(l => l.type === 'attribute');
      expect(attributeListener).toBeDefined();
      expect(attributeListener.handler).toBe('console.log("clicked")');
    });

    it('should detect data attribute handlers', () => {
      const button = document.createElement('button');
      button.setAttribute('data-project', 'project1');
      button.className = 'project-toggle';
      testContainer.appendChild(button);

      const listeners = validator.detectEventListeners(button, 'click');
      
      expect(listeners.length).toBeGreaterThan(0);
      expect(listeners.some(l => l.type === 'data-attribute')).toBe(true);
    });
  });

  describe('Click Handler Validation', () => {
    it('should validate project toggle buttons', () => {
      const toggle = document.createElement('button');
      toggle.className = 'project-toggle';
      toggle.setAttribute('data-project', 'project1');
      toggle.onclick = () => console.log('toggle clicked');
      testContainer.appendChild(toggle);

      const validations = validator.checkClickHandlers([toggle]);
      
      expect(validations).toHaveLength(1);
      expect(validations[0].elementType).toBe('project-toggle');
      expect(validations[0].hasClickHandler).toBe(true);
      expect(validations[0].validationResult).toBe('passed');
    });

    it('should identify missing click handlers', () => {
      const toggle = document.createElement('button');
      toggle.className = 'project-toggle';
      // Don't add data-project to avoid false positive
      testContainer.appendChild(toggle);

      const validations = validator.checkClickHandlers([toggle]);
      
      expect(validations[0].hasClickHandler).toBe(false);
      expect(validations[0].validationResult).toBe('failed');
      expect(validations[0].issues.length).toBeGreaterThan(0);
    });
  });

  describe('Accordion Handler Validation', () => {
    it('should validate accordion headers with proper handlers', () => {
      const header = document.createElement('button'); // Use button to avoid tabindex issue
      header.className = 'accordion-header';
      header.setAttribute('aria-expanded', 'false');
      header.onclick = () => console.log('accordion toggled');
      testContainer.appendChild(header);

      const validations = validator.checkAccordionHandlers([header]);
      
      expect(validations[0].hasClickHandler).toBe(true);
      expect(validations[0].validationResult).toBe('passed');
    });

    it('should identify missing aria-expanded attributes', () => {
      const header = document.createElement('div');
      header.className = 'accordion-header';
      header.onclick = () => console.log('accordion toggled');
      // Missing aria-expanded attribute
      testContainer.appendChild(header);

      const validations = validator.checkAccordionHandlers([header]);
      
      expect(validations[0].issues.some(issue => 
        issue.includes('aria-expanded')
      )).toBe(true);
    });
  });

  describe('Navigation Handler Validation', () => {
    it('should validate navigation links with href', () => {
      const link = document.createElement('a');
      link.className = 'accordion-link';
      link.href = '/page1';
      testContainer.appendChild(link);

      const validations = validator.checkNavigationHandlers([link]);
      
      expect(validations[0].hasNavigationHandler).toBe(true);
      expect(validations[0].validationResult).toBe('passed');
    });

    it('should identify links with placeholder href but no click handler', () => {
      const link = document.createElement('a');
      link.className = 'accordion-link';
      link.href = '#';
      // No click handler for navigation
      testContainer.appendChild(link);

      const validations = validator.checkNavigationHandlers([link]);
      
      expect(validations[0].issues.some(issue => 
        issue.includes('placeholder href')
      )).toBe(true);
    });
  });

  describe('Handler Execution Testing', () => {
    it('should test synthetic event execution', () => {
      const button = document.createElement('button');
      let clicked = false;
      button.onclick = () => { clicked = true; };
      testContainer.appendChild(button);

      const result = validator.executeSyntheticEvent(button, { 
        type: 'click', 
        method: 'programmatic' 
      });
      
      expect(result.eventType).toBe('click');
      expect(result.method).toBe('programmatic');
      expect(result.success).toBe(true);
    });

    it('should test handler execution with state changes', () => {
      const button = document.createElement('button');
      button.onclick = () => {
        button.classList.add('clicked');
        button.setAttribute('data-clicked', 'true');
      };
      testContainer.appendChild(button);

      const test = validator.testHandlerExecution(button);
      
      expect(test.executionResults.length).toBeGreaterThan(0);
      expect(test.responseTime).toBeGreaterThan(0);
    });
  });

  describe('Event Propagation Testing', () => {
    it('should test event bubbling', () => {
      const parent = document.createElement('div');
      const child = document.createElement('button');
      parent.appendChild(child);
      testContainer.appendChild(parent);

      const test = validator.validateEventPropagation(child);
      
      expect(test.bubbling.tested).toBe(true);
      expect(test.capturing.tested).toBe(true);
      expect(test.preventDefault.tested).toBe(true);
      expect(test.stopPropagation.tested).toBe(true);
    });
  });

  describe('Missing Handler Reporting', () => {
    it('should generate comprehensive missing handler report', () => {
      // Create elements with various issues
      const elements = [];
      
      // Element with handler and all required attributes
      const goodButton = document.createElement('button');
      goodButton.className = 'project-toggle';
      goodButton.setAttribute('data-project', 'project1');
      goodButton.setAttribute('aria-pressed', 'false'); // Add aria-pressed for active state
      goodButton.onclick = () => {};
      elements.push(goodButton);
      
      // Element without handler
      const badButton = document.createElement('button');
      badButton.className = 'project-toggle';
      elements.push(badButton);
      
      testContainer.appendChild(goodButton);
      testContainer.appendChild(badButton);

      const validations = validator.checkClickHandlers(elements);
      const report = validator.reportMissingHandlers(validations);
      
      expect(report.totalElements).toBe(2);
      expect(report.elementsWithIssues).toBe(1);
      expect(report.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('Validation Report Generation', () => {
    it('should generate comprehensive validation report', () => {
      const button = document.createElement('button');
      button.className = 'project-toggle';
      button.onclick = () => {};
      testContainer.appendChild(button);

      const report = validator.generateValidationReport([button]);
      
      expect(report.summary).toBeDefined();
      expect(report.validations).toBeDefined();
      expect(report.missingHandlerReport).toBeDefined();
      expect(report.recommendations).toBeDefined();
      expect(report.timestamp).toBeDefined();
      expect(report.summary.overallScore).toBeGreaterThan(0);
    });
  });

  describe('Element Type Detection', () => {
    it('should correctly identify project toggle elements', () => {
      const toggle = document.createElement('button');
      toggle.className = 'project-toggle-btn';
      
      const type = validator.determineElementType(toggle);
      expect(type).toBe('project-toggle');
    });

    it('should correctly identify accordion elements', () => {
      const header = document.createElement('div');
      header.className = 'accordion-header';
      
      const type = validator.determineElementType(header);
      expect(type).toBe('accordion-header');
    });

    it('should correctly identify navigation elements', () => {
      const nav = document.createElement('nav');
      const link = document.createElement('a');
      nav.appendChild(link);
      testContainer.appendChild(nav);
      
      const type = validator.determineElementType(link);
      expect(type).toBe('navigation');
    });
  });

  describe('Event Listener Count', () => {
    it('should count all event listeners on an element', () => {
      const button = document.createElement('button');
      button.onclick = () => {};
      button.onmousedown = () => {};
      testContainer.appendChild(button);

      const count = validator.getEventListenerCount(button);
      expect(count).toBeGreaterThanOrEqual(2);
    });
  });
});