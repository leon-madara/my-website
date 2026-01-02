/**
 * Test Helper Utilities
 * Common utilities and assertions for portfolio clickability tests
 */

/**
 * Validates that an element is properly configured for interaction testing
 */
export function validateTestElement(element) {
  const validation = {
    exists: !!element,
    isInDOM: document.contains(element),
    hasValidType: element?.getAttribute('data-test-type') !== null,
    isVisible: false,
    hasValidDimensions: false,
    isInViewport: false
  };

  if (element) {
    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);
    
    validation.isVisible = computedStyle.display !== 'none' && 
                          computedStyle.visibility !== 'hidden' &&
                          computedStyle.opacity !== '0';
    
    validation.hasValidDimensions = rect.width > 0 && rect.height > 0;
    
    validation.isInViewport = rect.top >= 0 && 
                             rect.left >= 0 && 
                             rect.bottom <= window.innerHeight && 
                             rect.right <= window.innerWidth;
  }

  return validation;
}

/**
 * Checks if an element has event listeners attached
 */
export function hasEventListeners(element, eventType = 'click') {
  // In a real browser environment, we could use getEventListeners()
  // For testing, we'll check for our test markers
  return element.hasAttribute('data-has-listener') || 
         element.onclick !== null ||
         element.getAttribute('data-clicked') !== null;
}

/**
 * Simulates various types of click events
 */
export function simulateInteraction(element, interactionType = 'click') {
  const interactions = {
    click: () => {
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      });
      return element.dispatchEvent(event);
    },
    
    programmaticClick: () => {
      if (typeof element.click === 'function') {
        element.click();
        return true;
      }
      return false;
    },
    
    coordinateClick: () => {
      const rect = element.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y
      });
      return element.dispatchEvent(event);
    },
    
    touch: () => {
      const touchEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [{
          clientX: element.getBoundingClientRect().left + 10,
          clientY: element.getBoundingClientRect().top + 10
        }]
      });
      return element.dispatchEvent(touchEvent);
    }
  };

  return interactions[interactionType] ? interactions[interactionType]() : false;
}

/**
 * Measures interaction response time
 */
export async function measureResponseTime(element, interaction) {
  const startTime = performance.now();
  
  let responseDetected = false;
  const originalState = element.getAttribute('data-clicked');
  
  // Set up response detection
  const observer = new MutationObserver(() => {
    responseDetected = true;
  });
  
  observer.observe(element, {
    attributes: true,
    attributeFilter: ['data-clicked', 'class', 'style']
  });

  // Perform interaction
  const interactionResult = await interaction();
  
  // Wait for response or timeout
  const timeout = 1000; // 1 second timeout
  const checkInterval = 10; // Check every 10ms
  let elapsed = 0;
  
  while (!responseDetected && elapsed < timeout) {
    await new Promise(resolve => setTimeout(resolve, checkInterval));
    elapsed += checkInterval;
    
    // Check if state changed
    if (element.getAttribute('data-clicked') !== originalState) {
      responseDetected = true;
    }
  }
  
  const endTime = performance.now();
  observer.disconnect();
  
  return {
    responseTime: endTime - startTime,
    responseDetected,
    interactionSuccessful: interactionResult,
    timedOut: elapsed >= timeout
  };
}

/**
 * Analyzes CSS properties that might block interactions
 */
export function analyzeCSSBlocking(element) {
  const computedStyle = window.getComputedStyle(element);
  const blockingIssues = [];

  // Check pointer-events
  if (computedStyle.pointerEvents === 'none') {
    blockingIssues.push({
      property: 'pointer-events',
      value: 'none',
      severity: 'high',
      description: 'Element has pointer-events: none which blocks all interactions'
    });
  }

  // Check visibility
  if (computedStyle.visibility === 'hidden') {
    blockingIssues.push({
      property: 'visibility',
      value: 'hidden',
      severity: 'high',
      description: 'Element is hidden and cannot be interacted with'
    });
  }

  // Check display
  if (computedStyle.display === 'none') {
    blockingIssues.push({
      property: 'display',
      value: 'none',
      severity: 'high',
      description: 'Element is not displayed and cannot be interacted with'
    });
  }

  // Check opacity
  if (parseFloat(computedStyle.opacity) === 0) {
    blockingIssues.push({
      property: 'opacity',
      value: '0',
      severity: 'medium',
      description: 'Element is transparent and may not be clickable'
    });
  }

  // Check z-index issues (simplified check)
  const zIndex = parseInt(computedStyle.zIndex);
  if (zIndex < 0) {
    blockingIssues.push({
      property: 'z-index',
      value: zIndex.toString(),
      severity: 'medium',
      description: 'Element has negative z-index and may be behind other elements'
    });
  }

  return {
    hasBlockingIssues: blockingIssues.length > 0,
    blockingIssues,
    isInteractable: blockingIssues.filter(issue => issue.severity === 'high').length === 0
  };
}

/**
 * Creates a comprehensive test report for an element
 */
export function createElementTestReport(element, testResults) {
  const validation = validateTestElement(element);
  const cssAnalysis = analyzeCSSBlocking(element);
  
  return {
    element: {
      id: element.id,
      className: element.className,
      type: element.getAttribute('data-test-type'),
      tagName: element.tagName.toLowerCase()
    },
    validation,
    cssAnalysis,
    testResults,
    timestamp: new Date().toISOString(),
    passed: validation.exists && 
            validation.isInDOM && 
            validation.isVisible && 
            cssAnalysis.isInteractable &&
            testResults.interactionSuccessful
  };
}

/**
 * Utility to wait for DOM changes
 */
export function waitForDOMChange(targetNode, options = {}) {
  return new Promise((resolve, reject) => {
    const timeout = options.timeout || 5000;
    const timer = setTimeout(() => {
      observer.disconnect();
      reject(new Error('Timeout waiting for DOM change'));
    }, timeout);

    const observer = new MutationObserver((mutations) => {
      clearTimeout(timer);
      observer.disconnect();
      resolve(mutations);
    });

    observer.observe(targetNode, {
      childList: true,
      attributes: true,
      subtree: true,
      ...options
    });
  });
}

/**
 * Mock entrance animation completion
 */
export function mockEntranceAnimationComplete() {
  document.body.classList.add('entrance-complete');
  
  // Dispatch custom event
  const event = new CustomEvent('entranceAnimationComplete', {
    bubbles: true,
    detail: { timestamp: Date.now() }
  });
  document.dispatchEvent(event);
}

/**
 * Reset entrance animation state
 */
export function resetEntranceAnimationState() {
  document.body.classList.remove('entrance-complete');
  document.body.classList.add('entrance-loading');
}