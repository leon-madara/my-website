/**
 * Element Scanner Tests
 * Tests for the interactive element discovery system
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ElementScanner } from './element-scanner.js';

describe('ElementScanner', () => {
  let scanner;
  let mockPortfolio;

  beforeEach(() => {
    scanner = new ElementScanner();
    
    // Create mock portfolio structure
    mockPortfolio = TestUtils.createMockPortfolioPage();
  });

  describe('Element Discovery', () => {
    it('should scan project toggle buttons', () => {
      // Add actual project toggle buttons to DOM
      const container = document.createElement('div');
      container.className = 'project-toggle-container';
      
      for (let i = 1; i <= 3; i++) {
        const button = document.createElement('button');
        button.className = 'project-toggle-btn';
        button.setAttribute('data-project', i.toString());
        button.innerHTML = `<span class="toggle-badge">0${i}</span><span class="toggle-label">Project ${i}</span>`;
        container.appendChild(button);
      }
      
      document.body.appendChild(container);
      
      const toggles = scanner.scanProjectToggleButtons();
      
      expect(toggles).toHaveLength(3);
      expect(toggles[0].type).toBe('project-toggle');
      expect(toggles[0].expectedBehavior).toContain('Switch between different project case studies');
    });

    it('should scan accordion elements', () => {
      // Add accordion structure to DOM
      const accordion = document.createElement('div');
      accordion.className = 'accordion-nav';
      
      // Add accordion header
      const header = document.createElement('button');
      header.className = 'accordion-header';
      header.setAttribute('aria-expanded', 'true');
      header.innerHTML = 'Project Details';
      accordion.appendChild(header);
      
      // Add accordion content with links
      const content = document.createElement('div');
      content.className = 'accordion-content';
      
      const link1 = document.createElement('a');
      link1.className = 'accordion-link active';
      link1.setAttribute('data-page', '0');
      link1.href = '#overview';
      link1.textContent = 'Overview';
      content.appendChild(link1);
      
      const link2 = document.createElement('a');
      link2.className = 'accordion-link';
      link2.setAttribute('data-page', '1');
      link2.href = '#role-timeline';
      link2.textContent = 'Role & Timeline';
      content.appendChild(link2);
      
      accordion.appendChild(content);
      document.body.appendChild(accordion);
      
      const accordionElements = scanner.scanAccordionElements();
      
      expect(accordionElements.length).toBeGreaterThanOrEqual(3); // 1 header + 2 links
      
      const headers = accordionElements.filter(el => el.type === 'accordion-header');
      const links = accordionElements.filter(el => el.type === 'accordion-link');
      
      // The mock portfolio page might already have accordion elements, so check minimum
      expect(headers.length).toBeGreaterThanOrEqual(1);
      expect(links.length).toBeGreaterThanOrEqual(2);
    });

    it('should scan navigation links', () => {
      // Add navigation structure
      const nav = document.createElement('nav');
      nav.className = 'nav-pills';
      
      const links = ['index.html', 'about.html', 'portfolio.html', 'contact.html'];
      links.forEach(href => {
        const link = document.createElement('a');
        link.href = href;
        link.textContent = href.replace('.html', '');
        nav.appendChild(link);
      });
      
      document.body.appendChild(nav);
      
      const navElements = scanner.scanNavigationLinks();
      
      expect(navElements).toHaveLength(4);
      expect(navElements[0].type).toBe('navigation');
      expect(navElements[0].expectedBehavior).toContain('Navigate to different pages');
    });

    it('should scan all interactive elements', () => {
      // Create comprehensive portfolio structure
      TestUtils.createMockPortfolioPage();
      
      const allElements = scanner.scanAllInteractiveElements();
      
      expect(allElements.length).toBeGreaterThan(0);
      
      // Should contain different types
      const types = [...new Set(allElements.map(el => el.type))];
      expect(types.length).toBeGreaterThan(1);
    });
  });

  describe('Element Validation', () => {
    it('should validate element properties correctly', () => {
      const button = document.createElement('button');
      button.className = 'test-button';
      button.style.width = '100px';
      button.style.height = '40px';
      button.style.display = 'block';
      button.textContent = 'Test Button';
      document.body.appendChild(button);
      
      // Force layout calculation
      button.getBoundingClientRect();
      
      const validation = scanner.validateElementProperties(button);
      
      expect(validation.isVisible).toBe(true);
      expect(validation.isAccessible).toBe(true);
      // Note: In JSDOM, elements might not have actual dimensions
      expect(validation.rect).toBeDefined();
      expect(validation.issues.length).toBeLessThanOrEqual(1); // May have dimension issues in JSDOM
    });

    it('should detect visibility issues', () => {
      const hiddenButton = document.createElement('button');
      hiddenButton.style.display = 'none';
      document.body.appendChild(hiddenButton);
      
      const validation = scanner.validateElementProperties(hiddenButton);
      
      expect(validation.isVisible).toBe(false);
      expect(validation.issues).toContain('display: none hides element');
    });

    it('should detect pointer-events blocking', () => {
      const blockedButton = document.createElement('button');
      blockedButton.style.pointerEvents = 'none';
      document.body.appendChild(blockedButton);
      
      const validation = scanner.validateElementProperties(blockedButton);
      
      expect(validation.isAccessible).toBe(false);
      expect(validation.issues).toContain('pointer-events: none blocks interactions');
    });

    it('should detect zero dimensions', () => {
      const zeroButton = document.createElement('button');
      zeroButton.style.width = '0px';
      zeroButton.style.height = '0px';
      document.body.appendChild(zeroButton);
      
      const validation = scanner.validateElementProperties(zeroButton);
      
      expect(validation.hasDimensions).toBe(false);
      expect(validation.issues).toContain('Element has zero dimensions');
    });
  });

  describe('Element Categorization', () => {
    it('should categorize elements by type', () => {
      // Create mixed elements
      const elements = [
        {
          element: document.createElement('button'),
          type: 'project-toggle',
          selector: '.project-toggle-btn',
          expectedBehavior: 'Switch projects',
          isVisible: true,
          hasEventListeners: true,
          cssIssues: [],
          validation: { isAccessible: true }
        },
        {
          element: document.createElement('button'),
          type: 'accordion-header',
          selector: '.accordion-header',
          expectedBehavior: 'Toggle accordion',
          isVisible: true,
          hasEventListeners: true,
          cssIssues: [],
          validation: { isAccessible: true }
        },
        {
          element: document.createElement('a'),
          type: 'accordion-link',
          selector: '.accordion-link',
          expectedBehavior: 'Navigate to page',
          isVisible: false,
          hasEventListeners: true,
          cssIssues: ['visibility: hidden'],
          validation: { isAccessible: false }
        }
      ];
      
      const categorization = scanner.categorizeElements(elements);
      
      expect(categorization.projectToggles).toHaveLength(1);
      expect(categorization.accordionHeaders).toHaveLength(1);
      expect(categorization.accordionLinks).toHaveLength(1);
      expect(categorization.navigationLinks).toHaveLength(0);
      
      expect(categorization.metadata.totalElements).toBe(3);
      expect(categorization.metadata.visibleElements).toBe(2);
      expect(categorization.metadata.accessibleElements).toBe(2);
      expect(categorization.metadata.elementsWithIssues).toBe(1);
    });
  });

  describe('Element Properties Collection', () => {
    it('should collect comprehensive element properties', () => {
      const button = document.createElement('button');
      button.id = 'test-button';
      button.className = 'project-toggle-btn active';
      button.setAttribute('data-project', '1');
      button.setAttribute('aria-label', 'Switch to project 1');
      button.style.position = 'relative';
      button.style.zIndex = '10';
      document.body.appendChild(button);
      
      const properties = scanner.collectElementProperties(button);
      
      expect(properties.tagName).toBe('button');
      expect(properties.id).toBe('test-button');
      expect(properties.className).toBe('project-toggle-btn active');
      expect(properties.attributes['data-project']).toBe('1');
      expect(properties.attributes['aria-label']).toBe('Switch to project 1');
      expect(properties.cssProperties.position).toBe('relative');
      expect(properties.cssProperties.zIndex).toBe('10');
      expect(properties.accessibility.ariaLabel).toBe('Switch to project 1');
      expect(properties.expectedBehavior).toContain('Switch to project 1');
    });
  });

  describe('Element Report Generation', () => {
    it('should generate comprehensive element report', () => {
      // Create test elements with various states
      const elements = [
        {
          element: document.createElement('button'),
          type: 'project-toggle',
          selector: '.project-toggle-btn',
          expectedBehavior: 'Switch projects',
          isVisible: true,
          hasEventListeners: true,
          cssIssues: [],
          validation: { isAccessible: true }
        },
        {
          element: document.createElement('button'),
          type: 'accordion-header',
          selector: '.accordion-header',
          expectedBehavior: 'Toggle accordion',
          isVisible: false,
          hasEventListeners: true,
          cssIssues: ['display: none'],
          validation: { isAccessible: false }
        }
      ];
      
      const report = scanner.generateElementReport(elements);
      
      expect(report.summary.totalElements).toBe(2);
      expect(report.summary.visibleElements).toBe(1);
      expect(report.summary.accessibleElements).toBe(1);
      expect(report.summary.elementsWithIssues).toBe(1);
      expect(report.summary.healthScore).toBeGreaterThan(0);
      expect(report.summary.healthScore).toBeLessThanOrEqual(100);
      
      expect(report.categorization).toBeDefined();
      expect(report.detailedElements).toHaveLength(2);
      expect(report.recommendations).toBeInstanceOf(Array);
      expect(report.timestamp).toBeDefined();
    });

    it('should calculate health score correctly', () => {
      // Test with perfect elements
      const perfectElements = [
        {
          element: document.createElement('button'),
          type: 'project-toggle',
          isVisible: true,
          cssIssues: [],
          validation: { isAccessible: true }
        },
        {
          element: document.createElement('button'),
          type: 'accordion-header',
          isVisible: true,
          cssIssues: [],
          validation: { isAccessible: true }
        }
      ];
      
      const perfectReport = scanner.generateElementReport(perfectElements);
      expect(perfectReport.summary.healthScore).toBe(100);
      
      // Test with problematic elements
      const problematicElements = [
        {
          element: document.createElement('button'),
          type: 'project-toggle',
          isVisible: false,
          cssIssues: ['display: none'],
          validation: { isAccessible: false }
        }
      ];
      
      const problematicReport = scanner.generateElementReport(problematicElements);
      expect(problematicReport.summary.healthScore).toBeLessThan(50);
    });
  });
});