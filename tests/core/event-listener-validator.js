/**
 * Event Listener Validator Component
 * Verifies that proper event handlers are attached to interactive elements
 * 
 * Requirements: 2.1, 2.2, 2.3
 */

/**
 * Event Listener Detection and Validation System
 * Enumerates handlers using getEventListeners() and DOM inspection
 */
export class EventListenerValidator {
  constructor() {
    // Event types to check for interactive elements
    this.eventTypes = [
      'click',
      'mousedown',
      'mouseup',
      'touchstart',
      'touchend',
      'keydown',
      'keyup',
      'focus',
      'blur'
    ];
    
    // Element type to expected event mappings
    this.expectedEvents = {
      'project-toggle': ['click'],
      'accordion-header': ['click'],
      'accordion-link': ['click'],
      'navigation': ['click']
    };
  }

  /**
   * Enumerates all project toggle buttons and verifies each has a click event listener
   * Requirements: 2.1
   * @param {HTMLElement[]} elements - Array of project toggle elements
   * @returns {HandlerValidation[]} Array of validation results
   */
  checkClickHandlers(elements) {
    return elements.map(element => {
      const validation = {
        element,
        elementType: element.getAttribute('data-test-type') || this.determineElementType(element),
        hasClickHandler: false,
        handlerDetails: [],
        validationResult: 'failed',
        issues: []
      };

      // Check for click event listeners
      const clickHandlers = this.detectEventListeners(element, 'click');
      validation.hasClickHandler = clickHandlers.length > 0;
      validation.handlerDetails = clickHandlers;

      // Validate based on element type
      const expectedEvents = this.expectedEvents[validation.elementType] || ['click'];
      const missingEvents = expectedEvents.filter(eventType => 
        !this.detectEventListeners(element, eventType).length
      );

      if (missingEvents.length === 0) {
        validation.validationResult = 'passed';
      } else {
        validation.issues.push(`Missing event listeners: ${missingEvents.join(', ')}`);
      }

      // Additional checks for specific element types
      this.performElementSpecificValidation(element, validation);

      return validation;
    });
  }

  /**
   * Checks all accordion headers for proper event listener attachment
   * Requirements: 2.2
   * @param {HTMLElement[]} accordionHeaders - Array of accordion header elements
   * @returns {HandlerValidation[]} Array of validation results
   */
  checkAccordionHandlers(accordionHeaders) {
    return accordionHeaders.map(element => {
      const validation = {
        element,
        elementType: 'accordion-header',
        hasClickHandler: false,
        hasKeyboardHandler: false,
        handlerDetails: [],
        validationResult: 'failed',
        issues: []
      };

      // Check for click handlers
      const clickHandlers = this.detectEventListeners(element, 'click');
      validation.hasClickHandler = clickHandlers.length > 0;

      // Check for keyboard handlers (accessibility)
      const keyHandlers = this.detectEventListeners(element, 'keydown');
      validation.hasKeyboardHandler = keyHandlers.length > 0;

      validation.handlerDetails = [...clickHandlers, ...keyHandlers];

      // Validate accordion-specific requirements
      if (!validation.hasClickHandler) {
        validation.issues.push('Missing click handler for accordion toggle');
      }

      // Check for ARIA attributes that should work with handlers
      const ariaExpanded = element.getAttribute('aria-expanded');
      if (ariaExpanded !== null && !validation.hasClickHandler) {
        validation.issues.push('Has aria-expanded but no click handler to toggle state');
      }

      // Check for missing aria-expanded attribute
      if (!element.hasAttribute('aria-expanded')) {
        validation.issues.push('Missing aria-expanded attribute for accessibility');
      }

      // Check for keyboard accessibility
      const tabIndex = element.getAttribute('tabindex');
      if (tabIndex === null && element.tagName.toLowerCase() !== 'button') {
        validation.issues.push('Non-button element should have tabindex for keyboard accessibility');
      }

      validation.validationResult = validation.issues.length === 0 ? 'passed' : 'failed';

      return validation;
    });
  }

  /**
   * Validates that accordion links have navigation event handlers
   * Requirements: 2.3
   * @param {HTMLElement[]} accordionLinks - Array of accordion link elements
   * @returns {HandlerValidation[]} Array of validation results
   */
  checkNavigationHandlers(accordionLinks) {
    return accordionLinks.map(element => {
      const validation = {
        element,
        elementType: 'accordion-link',
        hasClickHandler: false,
        hasNavigationHandler: false,
        handlerDetails: [],
        validationResult: 'failed',
        issues: []
      };

      // Check for click handlers
      const clickHandlers = this.detectEventListeners(element, 'click');
      validation.hasClickHandler = clickHandlers.length > 0;

      // For links, also check if they have proper href or navigation logic
      const href = element.getAttribute('href');
      const hasDataPage = element.hasAttribute('data-page');
      
      validation.hasNavigationHandler = validation.hasClickHandler || 
                                       (href && href !== '#') || 
                                       hasDataPage;

      validation.handlerDetails = clickHandlers;

      // Validate navigation-specific requirements
      if (!validation.hasNavigationHandler) {
        validation.issues.push('Missing navigation handler (click event or href)');
      }

      if (href === '#' && !validation.hasClickHandler) {
        validation.issues.push('Has placeholder href (#) but no click handler for navigation');
      }

      validation.validationResult = validation.issues.length === 0 ? 'passed' : 'failed';

      return validation;
    });
  }

  /**
   * Detects event listeners on an element using multiple methods
   * @param {HTMLElement} element - Element to inspect
   * @param {string} eventType - Type of event to check for
   * @returns {EventListenerInfo[]} Array of detected event listeners
   */
  detectEventListeners(element, eventType) {
    const listeners = [];

    // Method 1: Check for inline event handlers
    const inlineHandler = element[`on${eventType}`];
    if (inlineHandler && typeof inlineHandler === 'function') {
      listeners.push({
        type: 'inline',
        eventType,
        handler: inlineHandler,
        source: 'element property'
      });
    }

    // Method 2: Check for event handler attributes
    const attributeHandler = element.getAttribute(`on${eventType}`);
    if (attributeHandler) {
      listeners.push({
        type: 'attribute',
        eventType,
        handler: attributeHandler,
        source: 'HTML attribute'
      });
    }

    // Method 3: Use getEventListeners if available (Chrome DevTools)
    if (typeof getEventListeners === 'function') {
      try {
        const elementListeners = getEventListeners(element);
        if (elementListeners[eventType]) {
          elementListeners[eventType].forEach(listener => {
            listeners.push({
              type: 'addEventListener',
              eventType,
              handler: listener.listener,
              useCapture: listener.useCapture,
              source: 'addEventListener'
            });
          });
        }
      } catch (error) {
        // getEventListeners not available or failed
      }
    }

    // Method 4: Check for common framework patterns
    const frameworkListeners = this.detectFrameworkEventListeners(element, eventType);
    listeners.push(...frameworkListeners);

    // Method 5: Check for data attributes that indicate event handling
    const dataListeners = this.detectDataAttributeHandlers(element, eventType);
    listeners.push(...dataListeners);

    return listeners;
  }

  /**
   * Detects framework-specific event listener patterns
   * @private
   */
  detectFrameworkEventListeners(element, eventType) {
    const listeners = [];

    // Check for jQuery event handlers (if jQuery is present)
    if (typeof $ !== 'undefined' && $.fn.jquery) {
      try {
        const jqEvents = $._data(element, 'events');
        if (jqEvents && jqEvents[eventType]) {
          jqEvents[eventType].forEach(handler => {
            listeners.push({
              type: 'jquery',
              eventType,
              handler: handler.handler,
              source: 'jQuery'
            });
          });
        }
      } catch (error) {
        // jQuery event detection failed
      }
    }

    // Check for React event handlers (synthetic events)
    const reactProps = element._reactInternalFiber || element._reactInternalInstance;
    if (reactProps) {
      const eventProp = `on${eventType.charAt(0).toUpperCase()}${eventType.slice(1)}`;
      if (reactProps.memoizedProps && reactProps.memoizedProps[eventProp]) {
        listeners.push({
          type: 'react',
          eventType,
          handler: reactProps.memoizedProps[eventProp],
          source: 'React synthetic event'
        });
      }
    }

    return listeners;
  }

  /**
   * Detects event handlers indicated by data attributes
   * @private
   */
  detectDataAttributeHandlers(element, eventType) {
    const listeners = [];

    // Common data attributes that indicate event handling
    const dataAttributes = [
      'data-project',
      'data-page',
      'data-chapter',
      'data-toggle',
      'data-action',
      'data-click',
      'data-handler'
    ];

    dataAttributes.forEach(attr => {
      if (element.hasAttribute(attr)) {
        listeners.push({
          type: 'data-attribute',
          eventType,
          handler: element.getAttribute(attr),
          source: `Data attribute: ${attr}`
        });
      }
    });

    return listeners;
  }

  /**
   * Determines element type based on class names and attributes
   * @private
   */
  determineElementType(element) {
    const className = element.className || '';
    
    if (className.includes('project-toggle')) return 'project-toggle';
    if (className.includes('accordion-header')) return 'accordion-header';
    if (className.includes('accordion-link')) return 'accordion-link';
    if (element.closest('nav') || className.includes('nav')) return 'navigation';
    
    return 'unknown';
  }

  /**
   * Performs element-specific validation based on type
   * @private
   */
  performElementSpecificValidation(element, validation) {
    switch (validation.elementType) {
      case 'project-toggle':
        this.validateProjectToggle(element, validation);
        break;
      case 'accordion-header':
        this.validateAccordionHeader(element, validation);
        break;
      case 'accordion-link':
        this.validateAccordionLink(element, validation);
        break;
      case 'navigation':
        this.validateNavigationElement(element, validation);
        break;
    }
  }

  /**
   * Validates project toggle specific requirements
   * @private
   */
  validateProjectToggle(element, validation) {
    // Check for data-project attribute
    if (!element.hasAttribute('data-project')) {
      validation.issues.push('Missing data-project attribute');
    }

    // Check for active state handling
    const hasActiveClass = element.classList.contains('active');
    const hasAriaPressed = element.hasAttribute('aria-pressed');
    
    if (!hasActiveClass && !hasAriaPressed) {
      validation.issues.push('No active state indicator (class or aria-pressed)');
    }
  }

  /**
   * Validates accordion header specific requirements
   * @private
   */
  validateAccordionHeader(element, validation) {
    // Check for ARIA attributes
    if (!element.hasAttribute('aria-expanded')) {
      validation.issues.push('Missing aria-expanded attribute for accessibility');
    }

    // Check for keyboard accessibility
    const tabIndex = element.getAttribute('tabindex');
    if (tabIndex === null && element.tagName.toLowerCase() !== 'button') {
      validation.issues.push('Non-button element should have tabindex for keyboard accessibility');
    }
  }

  /**
   * Validates accordion link specific requirements
   * @private
   */
  validateAccordionLink(element, validation) {
    const href = element.getAttribute('href');
    const hasDataPage = element.hasAttribute('data-page');

    if (!href && !hasDataPage) {
      validation.issues.push('Missing href or data-page for navigation');
    }

    if (element.tagName.toLowerCase() === 'a' && !href) {
      validation.issues.push('Anchor element missing href attribute');
    }
  }

  /**
   * Validates navigation element specific requirements
   * @private
   */
  validateNavigationElement(element, validation) {
    if (element.tagName.toLowerCase() === 'a') {
      const href = element.getAttribute('href');
      if (!href || href === '#') {
        validation.issues.push('Navigation link missing valid href');
      }
    }
  }

  /**
   * Reports missing handlers when elements lack proper event listeners
   * Requirements: 2.4
   * @param {HandlerValidation[]} validations - Array of validation results
   * @returns {MissingHandlerReport} Report of missing handlers
   */
  reportMissingHandlers(validations) {
    const report = {
      totalElements: validations.length,
      elementsWithIssues: 0,
      missingHandlers: [],
      elementsByType: {},
      recommendations: []
    };

    validations.forEach(validation => {
      // Count elements by type
      const type = validation.elementType;
      if (!report.elementsByType[type]) {
        report.elementsByType[type] = { total: 0, withIssues: 0 };
      }
      report.elementsByType[type].total++;

      // Track elements with issues
      if (validation.issues.length > 0) {
        report.elementsWithIssues++;
        report.elementsByType[type].withIssues++;

        report.missingHandlers.push({
          element: {
            id: validation.element.id,
            className: validation.element.className,
            tagName: validation.element.tagName.toLowerCase(),
            type: validation.elementType
          },
          issues: validation.issues,
          hasClickHandler: validation.hasClickHandler,
          handlerCount: validation.handlerDetails.length
        });
      }
    });

    // Generate recommendations
    this.generateHandlerRecommendations(report);

    return report;
  }

  /**
   * Generates recommendations for fixing missing handlers
   * @private
   */
  generateHandlerRecommendations(report) {
    if (report.elementsWithIssues === 0) {
      report.recommendations.push('All elements have proper event handlers attached');
      return;
    }

    // General recommendations
    report.recommendations.push(
      `${report.elementsWithIssues} out of ${report.totalElements} elements have event handler issues`
    );

    // Type-specific recommendations
    Object.entries(report.elementsByType).forEach(([type, stats]) => {
      if (stats.withIssues > 0) {
        const percentage = Math.round((stats.withIssues / stats.total) * 100);
        report.recommendations.push(
          `${percentage}% of ${type} elements (${stats.withIssues}/${stats.total}) need event handler fixes`
        );
      }
    });

    // Common issue patterns
    const commonIssues = {};
    report.missingHandlers.forEach(handler => {
      handler.issues.forEach(issue => {
        commonIssues[issue] = (commonIssues[issue] || 0) + 1;
      });
    });

    Object.entries(commonIssues).forEach(([issue, count]) => {
      if (count > 1) {
        report.recommendations.push(`Common issue affecting ${count} elements: ${issue}`);
      }
    });
  }

  /**
   * Verifies event listeners are attached after DOM updates and project switches
   * Requirements: 2.5
   * @param {HTMLElement[]} elements - Elements to monitor
   * @returns {Promise<DOMUpdateValidation>} Validation results after DOM changes
   */
  async validateAfterDOMUpdates(elements) {
    const validation = {
      initialState: {},
      afterUpdateState: {},
      changedElements: [],
      newIssues: [],
      resolvedIssues: []
    };

    // Capture initial state
    elements.forEach(element => {
      const elementId = this.getElementIdentifier(element);
      validation.initialState[elementId] = {
        hasHandlers: this.detectEventListeners(element, 'click').length > 0,
        handlerCount: this.getAllEventListeners(element).length
      };
    });

    // Set up mutation observer to detect DOM changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          // DOM has changed, we'll validate after a short delay
          setTimeout(() => this.validatePostUpdate(elements, validation), 100);
        }
      });
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'data-project', 'aria-expanded']
    });

    // Simulate a DOM update (for testing purposes)
    await this.simulateDOMUpdate();

    // Stop observing after a reasonable time
    setTimeout(() => observer.disconnect(), 2000);

    return validation;
  }

  /**
   * Validates elements after DOM update
   * @private
   */
  validatePostUpdate(elements, validation) {
    elements.forEach(element => {
      const elementId = this.getElementIdentifier(element);
      const currentState = {
        hasHandlers: this.detectEventListeners(element, 'click').length > 0,
        handlerCount: this.getAllEventListeners(element).length
      };

      validation.afterUpdateState[elementId] = currentState;

      // Compare with initial state
      const initialState = validation.initialState[elementId];
      if (initialState) {
        if (initialState.hasHandlers !== currentState.hasHandlers) {
          validation.changedElements.push({
            element: elementId,
            change: currentState.hasHandlers ? 'handlers_added' : 'handlers_removed',
            before: initialState,
            after: currentState
          });
        }

        // Track new issues
        if (initialState.hasHandlers && !currentState.hasHandlers) {
          validation.newIssues.push(`Element ${elementId} lost event handlers after DOM update`);
        }

        // Track resolved issues
        if (!initialState.hasHandlers && currentState.hasHandlers) {
          validation.resolvedIssues.push(`Element ${elementId} gained event handlers after DOM update`);
        }
      }
    });
  }

  /**
   * Gets all event listeners for an element
   * @private
   */
  getAllEventListeners(element) {
    const allListeners = [];
    this.eventTypes.forEach(eventType => {
      allListeners.push(...this.detectEventListeners(element, eventType));
    });
    return allListeners;
  }

  /**
   * Gets a unique identifier for an element
   * @private
   */
  getElementIdentifier(element) {
    return element.id || 
           `${element.tagName.toLowerCase()}.${element.className.replace(/\s+/g, '.')}` ||
           `element_${Array.from(element.parentNode.children).indexOf(element)}`;
  }

  /**
   * Simulates a DOM update for testing
   * @private
   */
  async simulateDOMUpdate() {
    // This would be replaced with actual DOM manipulation in real scenarios
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Simulate project switch or accordion toggle
    const projectToggles = document.querySelectorAll('.project-toggle');
    if (projectToggles.length > 0) {
      projectToggles[0].classList.add('active');
      projectToggles[0].setAttribute('aria-pressed', 'true');
    }
  }

  /**
   * Tests event propagation and bubbling behavior
   * Requirements: 2.4, 6.2
   * @param {HTMLElement} element - Element to test
   * @returns {PropagationTest} Test results for event propagation
   */
  validateEventPropagation(element) {
    const test = {
      element,
      bubbling: {
        tested: false,
        works: false,
        stoppedAt: null
      },
      capturing: {
        tested: false,
        works: false,
        capturedAt: null
      },
      preventDefault: {
        tested: false,
        works: false
      },
      stopPropagation: {
        tested: false,
        works: false
      },
      issues: []
    };

    try {
      // Test event bubbling
      this.testEventBubbling(element, test);
      
      // Test event capturing
      this.testEventCapturing(element, test);
      
      // Test preventDefault behavior
      this.testPreventDefault(element, test);
      
      // Test stopPropagation behavior
      this.testStopPropagation(element, test);
      
    } catch (error) {
      test.issues.push(`Error during propagation testing: ${error.message}`);
    }

    return test;
  }

  /**
   * Tests handler execution by triggering synthetic events
   * Requirements: 2.4
   * @param {HTMLElement} element - Element to test
   * @returns {ExecutionTest} Test results for handler execution
   */
  testHandlerExecution(element) {
    const test = {
      element,
      elementType: this.determineElementType(element),
      executionResults: [],
      overallSuccess: false,
      responseTime: 0,
      stateChanges: [],
      errors: []
    };

    const startTime = performance.now();

    try {
      // Capture initial state
      const initialState = this.captureElementState(element);
      
      // Test different types of synthetic events
      const eventTests = [
        { type: 'click', method: 'programmatic' },
        { type: 'click', method: 'mouseEvent' },
        { type: 'click', method: 'coordinate' }
      ];

      eventTests.forEach(eventTest => {
        const result = this.executeSyntheticEvent(element, eventTest);
        test.executionResults.push(result);
      });

      // Capture final state and detect changes
      const finalState = this.captureElementState(element);
      test.stateChanges = this.compareElementStates(initialState, finalState);

      // Determine overall success
      test.overallSuccess = test.executionResults.some(result => result.success) ||
                           test.stateChanges.length > 0;

    } catch (error) {
      test.errors.push(`Handler execution test failed: ${error.message}`);
    }

    test.responseTime = performance.now() - startTime;
    return test;
  }

  /**
   * Creates synthetic event triggering system
   * Requirements: 2.4
   * @param {HTMLElement} element - Element to trigger event on
   * @param {Object} eventConfig - Configuration for the event
   * @returns {SyntheticEventResult} Result of synthetic event execution
   */
  executeSyntheticEvent(element, eventConfig) {
    const result = {
      eventType: eventConfig.type,
      method: eventConfig.method,
      success: false,
      eventFired: false,
      handlerCalled: false,
      responseTime: 0,
      error: null
    };

    const startTime = performance.now();

    try {
      // Set up event listener to detect if event fires
      let eventDetected = false;
      const eventDetector = () => { eventDetected = true; };
      element.addEventListener(eventConfig.type, eventDetector, { once: true });

      // Set up handler detection
      let handlerDetected = false;
      const originalHandlers = this.wrapExistingHandlers(element, eventConfig.type, () => {
        handlerDetected = true;
      });

      // Execute the synthetic event based on method
      switch (eventConfig.method) {
        case 'programmatic':
          result.success = this.triggerProgrammaticEvent(element, eventConfig.type);
          break;
        case 'mouseEvent':
          result.success = this.triggerMouseEvent(element, eventConfig.type);
          break;
        case 'coordinate':
          result.success = this.triggerCoordinateEvent(element, eventConfig.type);
          break;
        default:
          throw new Error(`Unknown event method: ${eventConfig.method}`);
      }

      // Wait a short time for handlers to execute
      setTimeout(() => {
        result.eventFired = eventDetected;
        result.handlerCalled = handlerDetected;
        
        // Clean up
        element.removeEventListener(eventConfig.type, eventDetector);
        this.restoreOriginalHandlers(element, eventConfig.type, originalHandlers);
      }, 10);

    } catch (error) {
      result.error = error.message;
    }

    result.responseTime = performance.now() - startTime;
    return result;
  }

  /**
   * Tests event bubbling behavior
   * @private
   */
  testEventBubbling(element, test) {
    test.bubbling.tested = true;
    
    let bubbleDetected = false;
    let bubbleStoppedAt = null;

    // Add listeners to parent elements to detect bubbling
    let currentElement = element.parentElement;
    const listeners = [];
    
    while (currentElement && currentElement !== document.body) {
      const listener = (event) => {
        bubbleDetected = true;
        if (!bubbleStoppedAt) {
          bubbleStoppedAt = currentElement;
        }
      };
      
      currentElement.addEventListener('click', listener, false);
      listeners.push({ element: currentElement, listener });
      currentElement = currentElement.parentElement;
    }

    // Trigger event and check for bubbling
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    element.dispatchEvent(event);

    // Clean up listeners
    listeners.forEach(({ element: el, listener }) => {
      el.removeEventListener('click', listener);
    });

    test.bubbling.works = bubbleDetected;
    test.bubbling.stoppedAt = bubbleStoppedAt;
  }

  /**
   * Tests event capturing behavior
   * @private
   */
  testEventCapturing(element, test) {
    test.capturing.tested = true;
    
    let captureDetected = false;
    let capturedAt = null;

    // Add capture listeners to parent elements
    let currentElement = element.parentElement;
    const listeners = [];
    
    while (currentElement && currentElement !== document.body) {
      const listener = (event) => {
        captureDetected = true;
        if (!capturedAt) {
          capturedAt = currentElement;
        }
      };
      
      currentElement.addEventListener('click', listener, true); // Use capture
      listeners.push({ element: currentElement, listener });
      currentElement = currentElement.parentElement;
    }

    // Trigger event and check for capturing
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    element.dispatchEvent(event);

    // Clean up listeners
    listeners.forEach(({ element: el, listener }) => {
      el.removeEventListener('click', listener, true);
    });

    test.capturing.works = captureDetected;
    test.capturing.capturedAt = capturedAt;
  }

  /**
   * Tests preventDefault behavior
   * @private
   */
  testPreventDefault(element, test) {
    test.preventDefault.tested = true;
    
    let defaultPrevented = false;
    
    const listener = (event) => {
      event.preventDefault();
      defaultPrevented = event.defaultPrevented;
    };
    
    element.addEventListener('click', listener, { once: true });
    
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    element.dispatchEvent(event);
    
    test.preventDefault.works = defaultPrevented;
  }

  /**
   * Tests stopPropagation behavior
   * @private
   */
  testStopPropagation(element, test) {
    test.stopPropagation.tested = true;
    
    let propagationStopped = false;
    let parentHandlerCalled = false;
    
    // Add handler to element that stops propagation
    const elementListener = (event) => {
      event.stopPropagation();
      propagationStopped = true;
    };
    
    // Add handler to parent to detect if propagation was stopped
    const parentListener = () => {
      parentHandlerCalled = true;
    };
    
    element.addEventListener('click', elementListener, { once: true });
    
    if (element.parentElement) {
      element.parentElement.addEventListener('click', parentListener, { once: true });
    }
    
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    element.dispatchEvent(event);
    
    // Clean up
    if (element.parentElement) {
      element.parentElement.removeEventListener('click', parentListener);
    }
    
    test.stopPropagation.works = propagationStopped && !parentHandlerCalled;
  }

  /**
   * Triggers a programmatic event (element.click())
   * @private
   */
  triggerProgrammaticEvent(element, eventType) {
    try {
      if (eventType === 'click' && typeof element.click === 'function') {
        element.click();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Triggers a MouseEvent
   * @private
   */
  triggerMouseEvent(element, eventType) {
    try {
      const event = new MouseEvent(eventType, {
        bubbles: true,
        cancelable: true,
        view: window
      });
      return element.dispatchEvent(event);
    } catch (error) {
      return false;
    }
  }

  /**
   * Triggers an event at specific coordinates
   * @private
   */
  triggerCoordinateEvent(element, eventType) {
    try {
      const rect = element.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      
      const event = new MouseEvent(eventType, {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: x,
        clientY: y
      });
      return element.dispatchEvent(event);
    } catch (error) {
      return false;
    }
  }

  /**
   * Captures current state of an element
   * @private
   */
  captureElementState(element) {
    return {
      className: element.className,
      attributes: Array.from(element.attributes).reduce((acc, attr) => {
        acc[attr.name] = attr.value;
        return acc;
      }, {}),
      innerHTML: element.innerHTML,
      style: element.getAttribute('style') || '',
      computedStyle: {
        display: getComputedStyle(element).display,
        visibility: getComputedStyle(element).visibility,
        opacity: getComputedStyle(element).opacity
      }
    };
  }

  /**
   * Compares two element states to detect changes
   * @private
   */
  compareElementStates(initialState, finalState) {
    const changes = [];
    
    if (initialState.className !== finalState.className) {
      changes.push({
        type: 'className',
        before: initialState.className,
        after: finalState.className
      });
    }
    
    if (initialState.innerHTML !== finalState.innerHTML) {
      changes.push({
        type: 'innerHTML',
        before: initialState.innerHTML.substring(0, 100) + '...',
        after: finalState.innerHTML.substring(0, 100) + '...'
      });
    }
    
    if (initialState.style !== finalState.style) {
      changes.push({
        type: 'style',
        before: initialState.style,
        after: finalState.style
      });
    }
    
    // Compare attributes
    Object.keys(finalState.attributes).forEach(attr => {
      if (initialState.attributes[attr] !== finalState.attributes[attr]) {
        changes.push({
          type: 'attribute',
          attribute: attr,
          before: initialState.attributes[attr],
          after: finalState.attributes[attr]
        });
      }
    });
    
    return changes;
  }

  /**
   * Wraps existing handlers to detect when they're called
   * @private
   */
  wrapExistingHandlers(element, eventType, callback) {
    const originalHandlers = [];
    
    // Wrap inline handler
    const inlineHandler = element[`on${eventType}`];
    if (inlineHandler) {
      originalHandlers.push({ type: 'inline', handler: inlineHandler });
      element[`on${eventType}`] = function(event) {
        callback();
        return inlineHandler.call(this, event);
      };
    }
    
    return originalHandlers;
  }

  /**
   * Restores original handlers after testing
   * @private
   */
  restoreOriginalHandlers(element, eventType, originalHandlers) {
    originalHandlers.forEach(({ type, handler }) => {
      if (type === 'inline') {
        element[`on${eventType}`] = handler;
      }
    });
  }

  /**
   * Gets the count of event listeners for an element
   * Requirements: Helper method for validation
   * @param {HTMLElement} element - Element to count listeners for
   * @returns {number} Number of event listeners
   */
  getEventListenerCount(element) {
    return this.getAllEventListeners(element).length;
  }

  /**
   * Generates a comprehensive event listener validation report
   * @param {HTMLElement[]} elements - Elements to validate
   * @returns {EventListenerReport} Complete validation report
   */
  generateValidationReport(elements) {
    const clickValidations = this.checkClickHandlers(elements);
    const missingHandlerReport = this.reportMissingHandlers(clickValidations);

    return {
      summary: {
        totalElements: elements.length,
        elementsWithHandlers: clickValidations.filter(v => v.hasClickHandler).length,
        elementsWithIssues: missingHandlerReport.elementsWithIssues,
        overallScore: this.calculateValidationScore(clickValidations)
      },
      validations: clickValidations,
      missingHandlerReport,
      recommendations: missingHandlerReport.recommendations,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Calculates overall validation score
   * @private
   */
  calculateValidationScore(validations) {
    if (validations.length === 0) return 0;
    
    const passedValidations = validations.filter(v => v.validationResult === 'passed').length;
    return Math.round((passedValidations / validations.length) * 100);
  }
}

/**
 * Type definitions for TypeScript-like documentation
 */

/**
 * @typedef {Object} PropagationTest
 * @property {HTMLElement} element - The DOM element tested
 * @property {Object} bubbling - Bubbling test results
 * @property {Object} capturing - Capturing test results  
 * @property {Object} preventDefault - preventDefault test results
 * @property {Object} stopPropagation - stopPropagation test results
 * @property {string[]} issues - Array of issues encountered during testing
 */

/**
 * @typedef {Object} ExecutionTest
 * @property {HTMLElement} element - The DOM element tested
 * @property {string} elementType - Type of element being tested
 * @property {SyntheticEventResult[]} executionResults - Results from synthetic event tests
 * @property {boolean} overallSuccess - Whether any test method succeeded
 * @property {number} responseTime - Total time for all tests
 * @property {Array} stateChanges - Changes detected in element state
 * @property {string[]} errors - Array of errors encountered
 */

/**
 * @typedef {Object} SyntheticEventResult
 * @property {string} eventType - Type of event triggered
 * @property {string} method - Method used to trigger event
 * @property {boolean} success - Whether event was successfully triggered
 * @property {boolean} eventFired - Whether event was detected as firing
 * @property {boolean} handlerCalled - Whether handler was detected as being called
 * @property {number} responseTime - Time taken for event execution
 * @property {string|null} error - Error message if execution failed
 */

/**
 * @typedef {Object} HandlerValidation
 * @property {HTMLElement} element - The DOM element
 * @property {string} elementType - Type of element (project-toggle, accordion-header, etc.)
 * @property {boolean} hasClickHandler - Whether element has click event listener
 * @property {EventListenerInfo[]} handlerDetails - Details of detected event listeners
 * @property {string} validationResult - 'passed' or 'failed'
 * @property {string[]} issues - Array of validation issues
 */

/**
 * @typedef {Object} EventListenerInfo
 * @property {string} type - Type of listener (inline, attribute, addEventListener, etc.)
 * @property {string} eventType - Event type (click, mousedown, etc.)
 * @property {Function|string} handler - The event handler function or code
 * @property {string} source - Source of the event listener
 * @property {boolean} [useCapture] - Whether listener uses capture phase
 */

/**
 * @typedef {Object} MissingHandlerReport
 * @property {number} totalElements - Total number of elements checked
 * @property {number} elementsWithIssues - Number of elements with issues
 * @property {Array} missingHandlers - Details of elements with missing handlers
 * @property {Object} elementsByType - Statistics by element type
 * @property {string[]} recommendations - Generated recommendations
 */

/**
 * @typedef {Object} DOMUpdateValidation
 * @property {Object} initialState - State before DOM update
 * @property {Object} afterUpdateState - State after DOM update
 * @property {Array} changedElements - Elements that changed
 * @property {string[]} newIssues - New issues found after update
 * @property {string[]} resolvedIssues - Issues resolved after update
 */

/**
 * @typedef {Object} EventListenerReport
 * @property {Object} summary - Summary statistics and score
 * @property {HandlerValidation[]} validations - Individual element validations
 * @property {MissingHandlerReport} missingHandlerReport - Missing handler analysis
 * @property {string[]} recommendations - Generated recommendations
 * @property {string} timestamp - Report generation timestamp
 */