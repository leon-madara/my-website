/**
 * Element Scanner Component
 * Discovers and validates interactive elements on the portfolio page
 * 
 * Requirements: 1.1, 3.4
 */

/**
 * Interactive Element Discovery System
 * Scans for project toggles, accordion headers, and navigation links
 */
export class ElementScanner {
  constructor() {
    // Element selectors based on actual portfolio HTML structure
    this.selectors = {
      PROJECT_TOGGLES: '.project-toggle-btn',
      ACCORDION_HEADERS: '.accordion-header',
      ACCORDION_LINKS: '.accordion-link',
      NAVIGATION_LINKS: 'nav a, .nav-pills a'
    };
    
    // Element type mappings
    this.elementTypes = {
      PROJECT_TOGGLE: 'project-toggle',
      ACCORDION_HEADER: 'accordion-header',
      ACCORDION_LINK: 'accordion-link',
      NAVIGATION: 'navigation'
    };
  }

  /**
   * Scans for project toggle buttons
   * @returns {InteractiveElement[]} Array of project toggle elements
   */
  scanProjectToggleButtons() {
    const elements = document.querySelectorAll(this.selectors.PROJECT_TOGGLES);
    return Array.from(elements).map(element => this.createInteractiveElement(
      element,
      this.elementTypes.PROJECT_TOGGLE,
      this.selectors.PROJECT_TOGGLES,
      'Switch between different project case studies'
    ));
  }

  /**
   * Scans for accordion elements (headers and links)
   * @returns {InteractiveElement[]} Array of accordion elements
   */
  scanAccordionElements() {
    const headers = document.querySelectorAll(this.selectors.ACCORDION_HEADERS);
    const links = document.querySelectorAll(this.selectors.ACCORDION_LINKS);
    
    const headerElements = Array.from(headers).map(element => this.createInteractiveElement(
      element,
      this.elementTypes.ACCORDION_HEADER,
      this.selectors.ACCORDION_HEADERS,
      'Expand or collapse accordion section'
    ));
    
    const linkElements = Array.from(links).map(element => this.createInteractiveElement(
      element,
      this.elementTypes.ACCORDION_LINK,
      this.selectors.ACCORDION_LINKS,
      'Navigate to specific page within case study'
    ));
    
    return [...headerElements, ...linkElements];
  }

  /**
   * Scans for navigation links
   * @returns {InteractiveElement[]} Array of navigation elements
   */
  scanNavigationLinks() {
    const elements = document.querySelectorAll(this.selectors.NAVIGATION_LINKS);
    return Array.from(elements).map(element => this.createInteractiveElement(
      element,
      this.elementTypes.NAVIGATION,
      this.selectors.NAVIGATION_LINKS,
      'Navigate to different pages'
    ));
  }

  /**
   * Scans for all interactive elements
   * @returns {InteractiveElement[]} Array of all interactive elements
   */
  scanAllInteractiveElements() {
    return [
      ...this.scanProjectToggleButtons(),
      ...this.scanAccordionElements(),
      ...this.scanNavigationLinks()
    ];
  }

  /**
   * Validates element properties (visibility, dimensions, viewport position)
   * @param {HTMLElement} element - Element to validate
   * @returns {ElementValidation} Validation results
   */
  validateElementProperties(element) {
    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);
    
    // Check visibility
    const isVisible = this.isElementVisible(element, computedStyle);
    
    // Check dimensions
    const hasDimensions = rect.width > 0 && rect.height > 0;
    
    // Check viewport position
    const isInViewport = this.isElementInViewport(rect);
    
    // Check if element is accessible
    const isAccessible = this.isElementAccessible(element, computedStyle);
    
    return {
      element,
      isVisible,
      hasDimensions,
      isInViewport,
      isAccessible,
      rect: {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
        bottom: rect.bottom,
        right: rect.right
      },
      computedStyle: {
        display: computedStyle.display,
        visibility: computedStyle.visibility,
        opacity: computedStyle.opacity,
        pointerEvents: computedStyle.pointerEvents,
        zIndex: computedStyle.zIndex
      },
      issues: this.identifyElementIssues(element, computedStyle, rect)
    };
  }

  /**
   * Creates an InteractiveElement object
   * @private
   */
  createInteractiveElement(element, type, selector, expectedBehavior) {
    const validation = this.validateElementProperties(element);
    
    return {
      element,
      type,
      selector,
      expectedBehavior,
      isVisible: validation.isVisible,
      hasEventListeners: this.hasEventListeners(element),
      cssIssues: validation.issues,
      validation
    };
  }

  /**
   * Checks if element is visible
   * @private
   */
  isElementVisible(element, computedStyle) {
    // Check CSS visibility properties
    if (computedStyle.display === 'none') return false;
    if (computedStyle.visibility === 'hidden') return false;
    if (computedStyle.opacity === '0') return false;
    
    // Check if element or parent has visibility issues
    let currentElement = element;
    while (currentElement && currentElement !== document.body) {
      const style = window.getComputedStyle(currentElement);
      if (style.display === 'none' || style.visibility === 'hidden') {
        return false;
      }
      currentElement = currentElement.parentElement;
    }
    
    return true;
  }

  /**
   * Checks if element is within viewport
   * @private
   */
  isElementInViewport(rect) {
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  /**
   * Checks if element is accessible for interactions
   * @private
   */
  isElementAccessible(element, computedStyle) {
    // Check pointer events
    if (computedStyle.pointerEvents === 'none') return false;
    
    // Check if element is disabled
    if (element.disabled) return false;
    
    // Check if element has tabindex that makes it inaccessible
    const tabIndex = element.getAttribute('tabindex');
    if (tabIndex === '-1') return false;
    
    return true;
  }

  /**
   * Identifies potential issues with element
   * @private
   */
  identifyElementIssues(element, computedStyle, rect) {
    const issues = [];
    
    // CSS blocking issues
    if (computedStyle.pointerEvents === 'none') {
      issues.push('pointer-events: none blocks interactions');
    }
    
    if (computedStyle.display === 'none') {
      issues.push('display: none hides element');
    }
    
    if (computedStyle.visibility === 'hidden') {
      issues.push('visibility: hidden hides element');
    }
    
    if (computedStyle.opacity === '0') {
      issues.push('opacity: 0 makes element invisible');
    }
    
    // Dimension issues
    if (rect.width === 0 || rect.height === 0) {
      issues.push('Element has zero dimensions');
    }
    
    // Viewport issues
    if (!this.isElementInViewport(rect)) {
      issues.push('Element is outside viewport');
    }
    
    // Z-index issues (check if element might be covered)
    const zIndex = parseInt(computedStyle.zIndex) || 0;
    if (zIndex < 0) {
      issues.push('Negative z-index may cause element to be covered');
    }
    
    // Accessibility issues
    if (element.disabled) {
      issues.push('Element is disabled');
    }
    
    return issues;
  }

  /**
   * Checks if element has event listeners (basic check)
   * @private
   */
  hasEventListeners(element) {
    // Check for common event handler attributes
    const eventAttributes = ['onclick', 'onmousedown', 'onmouseup', 'ontouchstart', 'ontouchend'];
    const hasAttributeHandlers = eventAttributes.some(attr => element.hasAttribute(attr));
    
    // Check for data attributes that might indicate event handling
    const hasDataAttributes = element.hasAttribute('data-project') || 
                             element.hasAttribute('data-page') ||
                             element.hasAttribute('data-chapter');
    
    // This is a basic check - more sophisticated detection will be in EventListenerValidator
    return hasAttributeHandlers || hasDataAttributes || element.onclick !== null;
  }

  /**
   * Categorizes elements by type and collects metadata
   * Requirements: 1.5, 2.1
   * @param {InteractiveElement[]} elements - Array of interactive elements
   * @returns {ElementCategorization} Categorized elements with metadata
   */
  categorizeElements(elements) {
    const categorization = {
      projectToggles: [],
      accordionHeaders: [],
      accordionLinks: [],
      navigationLinks: [],
      metadata: {
        totalElements: elements.length,
        visibleElements: 0,
        accessibleElements: 0,
        elementsWithIssues: 0,
        elementsByType: {},
        commonIssues: {}
      }
    };

    // Categorize elements by type
    elements.forEach(element => {
      switch (element.type) {
        case this.elementTypes.PROJECT_TOGGLE:
          categorization.projectToggles.push(element);
          break;
        case this.elementTypes.ACCORDION_HEADER:
          categorization.accordionHeaders.push(element);
          break;
        case this.elementTypes.ACCORDION_LINK:
          categorization.accordionLinks.push(element);
          break;
        case this.elementTypes.NAVIGATION:
          categorization.navigationLinks.push(element);
          break;
      }
    });

    // Collect metadata
    this.collectElementMetadata(elements, categorization.metadata);
    
    return categorization;
  }

  /**
   * Collects detailed metadata about elements
   * @private
   */
  collectElementMetadata(elements, metadata) {
    // Count elements by type
    elements.forEach(element => {
      metadata.elementsByType[element.type] = (metadata.elementsByType[element.type] || 0) + 1;
      
      if (element.isVisible) metadata.visibleElements++;
      if (element.validation.isAccessible) metadata.accessibleElements++;
      if (element.cssIssues.length > 0) metadata.elementsWithIssues++;
      
      // Track common issues
      element.cssIssues.forEach(issue => {
        metadata.commonIssues[issue] = (metadata.commonIssues[issue] || 0) + 1;
      });
    });
  }

  /**
   * Collects element properties and expected behaviors
   * @param {HTMLElement} element - Element to analyze
   * @returns {ElementProperties} Detailed element properties
   */
  collectElementProperties(element) {
    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);
    
    return {
      // Basic properties
      tagName: element.tagName.toLowerCase(),
      id: element.id || null,
      className: element.className || null,
      
      // Attributes
      attributes: this.getRelevantAttributes(element),
      
      // Position and dimensions
      position: {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
        bottom: rect.bottom,
        right: rect.right
      },
      
      // CSS properties relevant to interactions
      cssProperties: {
        display: computedStyle.display,
        visibility: computedStyle.visibility,
        opacity: computedStyle.opacity,
        pointerEvents: computedStyle.pointerEvents,
        zIndex: computedStyle.zIndex,
        position: computedStyle.position,
        overflow: computedStyle.overflow,
        cursor: computedStyle.cursor
      },
      
      // Accessibility properties
      accessibility: {
        tabIndex: element.tabIndex,
        ariaLabel: element.getAttribute('aria-label'),
        ariaExpanded: element.getAttribute('aria-expanded'),
        ariaPressed: element.getAttribute('aria-pressed'),
        disabled: element.disabled,
        role: element.getAttribute('role')
      },
      
      // Parent context
      parentContext: this.getParentContext(element),
      
      // Expected behavior based on element type and attributes
      expectedBehavior: this.determineExpectedBehavior(element)
    };
  }

  /**
   * Gets relevant attributes for interaction testing
   * @private
   */
  getRelevantAttributes(element) {
    const relevantAttrs = [
      'data-project', 'data-page', 'data-chapter',
      'href', 'target', 'type', 'role',
      'aria-label', 'aria-expanded', 'aria-pressed',
      'tabindex', 'disabled'
    ];
    
    const attributes = {};
    relevantAttrs.forEach(attr => {
      if (element.hasAttribute(attr)) {
        attributes[attr] = element.getAttribute(attr);
      }
    });
    
    return attributes;
  }

  /**
   * Gets parent element context for better understanding
   * @private
   */
  getParentContext(element) {
    const parent = element.parentElement;
    if (!parent) return null;
    
    return {
      tagName: parent.tagName.toLowerCase(),
      className: parent.className || null,
      id: parent.id || null,
      role: parent.getAttribute('role') || null
    };
  }

  /**
   * Determines expected behavior based on element analysis
   * @private
   */
  determineExpectedBehavior(element) {
    const tagName = element.tagName.toLowerCase();
    const className = element.className || '';
    
    // Project toggle buttons
    if (className.includes('project-toggle-btn')) {
      const projectId = element.getAttribute('data-project');
      return `Switch to project ${projectId} and update content display`;
    }
    
    // Accordion headers
    if (className.includes('accordion-header')) {
      const isExpanded = element.getAttribute('aria-expanded') === 'true';
      return isExpanded ? 'Collapse accordion section' : 'Expand accordion section';
    }
    
    // Accordion links
    if (className.includes('accordion-link')) {
      const pageId = element.getAttribute('data-page');
      const href = element.getAttribute('href');
      return `Navigate to page ${pageId} (${href}) within case study`;
    }
    
    // Navigation links
    if (tagName === 'a' && element.closest('nav')) {
      const href = element.getAttribute('href');
      return `Navigate to ${href}`;
    }
    
    // Generic button
    if (tagName === 'button') {
      return 'Execute button action';
    }
    
    // Generic link
    if (tagName === 'a') {
      const href = element.getAttribute('href');
      return href ? `Navigate to ${href}` : 'Execute link action';
    }
    
    return 'Unknown interaction behavior';
  }

  /**
   * Generates a comprehensive element report
   * @param {InteractiveElement[]} elements - Elements to report on
   * @returns {ElementReport} Detailed report
   */
  generateElementReport(elements) {
    const categorization = this.categorizeElements(elements);
    
    return {
      summary: {
        totalElements: categorization.metadata.totalElements,
        visibleElements: categorization.metadata.visibleElements,
        accessibleElements: categorization.metadata.accessibleElements,
        elementsWithIssues: categorization.metadata.elementsWithIssues,
        healthScore: this.calculateHealthScore(categorization.metadata)
      },
      
      categorization,
      
      detailedElements: elements.map(element => ({
        ...element,
        properties: this.collectElementProperties(element.element)
      })),
      
      recommendations: this.generateRecommendations(categorization.metadata),
      
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Calculates overall health score for elements
   * @private
   */
  calculateHealthScore(metadata) {
    if (metadata.totalElements === 0) return 0;
    
    const visibleScore = (metadata.visibleElements / metadata.totalElements) * 40;
    const accessibleScore = (metadata.accessibleElements / metadata.totalElements) * 40;
    const issueScore = Math.max(0, 20 - (metadata.elementsWithIssues / metadata.totalElements) * 20);
    
    return Math.round(visibleScore + accessibleScore + issueScore);
  }

  /**
   * Generates recommendations based on element analysis
   * @private
   */
  generateRecommendations(metadata) {
    const recommendations = [];
    
    if (metadata.elementsWithIssues > 0) {
      recommendations.push(`${metadata.elementsWithIssues} elements have issues that may prevent interactions`);
    }
    
    if (metadata.visibleElements < metadata.totalElements) {
      const hiddenCount = metadata.totalElements - metadata.visibleElements;
      recommendations.push(`${hiddenCount} elements are not visible and may not be interactive`);
    }
    
    if (metadata.accessibleElements < metadata.totalElements) {
      const inaccessibleCount = metadata.totalElements - metadata.accessibleElements;
      recommendations.push(`${inaccessibleCount} elements are not accessible for interactions`);
    }
    
    // Specific issue recommendations
    Object.entries(metadata.commonIssues).forEach(([issue, count]) => {
      if (count > 1) {
        recommendations.push(`Multiple elements (${count}) have issue: ${issue}`);
      }
    });
    
    if (recommendations.length === 0) {
      recommendations.push('All elements appear to be properly configured for interactions');
    }
    
    return recommendations;
  }
}

/**
 * Type definitions for TypeScript-like documentation
 */

/**
 * @typedef {Object} InteractiveElement
 * @property {HTMLElement} element - The DOM element
 * @property {string} type - Element type (project-toggle, accordion-header, etc.)
 * @property {string} selector - CSS selector used to find element
 * @property {string} expectedBehavior - Description of expected behavior
 * @property {boolean} isVisible - Whether element is visible
 * @property {boolean} hasEventListeners - Whether element has event listeners
 * @property {string[]} cssIssues - Array of CSS-related issues
 * @property {ElementValidation} validation - Detailed validation results
 */

/**
 * @typedef {Object} ElementValidation
 * @property {HTMLElement} element - The DOM element
 * @property {boolean} isVisible - Whether element is visible
 * @property {boolean} hasDimensions - Whether element has non-zero dimensions
 * @property {boolean} isInViewport - Whether element is within viewport
 * @property {boolean} isAccessible - Whether element is accessible for interactions
 * @property {Object} rect - Element's bounding rectangle
 * @property {Object} computedStyle - Relevant computed CSS properties
 * @property {string[]} issues - Array of identified issues
 */

/**
 * @typedef {Object} ElementCategorization
 * @property {InteractiveElement[]} projectToggles - Project toggle button elements
 * @property {InteractiveElement[]} accordionHeaders - Accordion header elements
 * @property {InteractiveElement[]} accordionLinks - Accordion link elements
 * @property {InteractiveElement[]} navigationLinks - Navigation link elements
 * @property {Object} metadata - Categorization metadata and statistics
 */

/**
 * @typedef {Object} ElementProperties
 * @property {string} tagName - HTML tag name
 * @property {string|null} id - Element ID
 * @property {string|null} className - Element class names
 * @property {Object} attributes - Relevant element attributes
 * @property {Object} position - Element position and dimensions
 * @property {Object} cssProperties - CSS properties affecting interactions
 * @property {Object} accessibility - Accessibility-related properties
 * @property {Object|null} parentContext - Parent element context
 * @property {string} expectedBehavior - Determined expected behavior
 */

/**
 * @typedef {Object} ElementReport
 * @property {Object} summary - Summary statistics and health score
 * @property {ElementCategorization} categorization - Categorized elements
 * @property {Array} detailedElements - Elements with detailed properties
 * @property {string[]} recommendations - Generated recommendations
 * @property {string} timestamp - Report generation timestamp
 */