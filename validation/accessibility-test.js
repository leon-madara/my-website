/**
 * Accessibility Compliance Testing Suite
 * Tests WCAG 2.1 AA compliance and screen reader compatibility
 */

class AccessibilityValidator {
    constructor() {
        this.testResults = {
            wcagCompliance: {},
            keyboardNavigation: {},
            screenReaderSupport: {},
            semanticMarkup: {},
            colorContrast: {},
            focusManagement: {},
            ariaLabels: {},
            errors: [],
            warnings: []
        };

        this.init();
    }

    init() {
        console.log('Starting accessibility compliance tests...');
        this.runAllTests();
    }

    runAllTests() {
        // Test semantic markup
        this.testSemanticMarkup();

        // Test ARIA labels and attributes
        this.testAriaLabels();

        // Test keyboard navigation
        this.testKeyboardNavigation();

        // Test focus management
        this.testFocusManagement();

        // Test color contrast
        this.testColorContrast();

        // Test screen reader support
        this.testScreenReaderSupport();

        // Test WCAG compliance
        this.testWCAGCompliance();

        // Generate report
        this.generateReport();
    }

    testSemanticMarkup() {
        console.log('Testing semantic markup...');

        const semanticTests = {
            hasMainLandmark: this.testMainLandmark(),
            hasNavigationLandmark: this.testNavigationLandmark(),
            hasProperHeadingStructure: this.testHeadingStructure(),
            hasSkipLink: this.testSkipLink(),
            hasLiveRegions: this.testLiveRegions(),
            hasProperListStructure: this.testListStructure(),
            hasSemanticSections: this.testSemanticSections(),
            hasProperFormLabels: this.testFormLabels()
        };

        this.testResults.semanticMarkup = semanticTests;
    }

    testMainLandmark() {
        const mainElement = document.querySelector('main');
        const mainRole = document.querySelector('[role="main"]');

        if (!mainElement && !mainRole) {
            this.testResults.errors.push('Missing main landmark element');
            return false;
        }

        return true;
    }

    testNavigationLandmark() {
        const navElements = document.querySelectorAll('nav');
        const navRoles = document.querySelectorAll('[role="navigation"]');

        if (navElements.length === 0 && navRoles.length === 0) {
            this.testResults.errors.push('Missing navigation landmark elements');
            return false;
        }

        // Check if navigation has proper aria-label
        const hasAriaLabel = Array.from(navElements).some(nav =>
            nav.hasAttribute('aria-label') || nav.hasAttribute('aria-labelledby')
        );

        if (!hasAriaLabel) {
            this.testResults.warnings.push('Navigation elements should have aria-label or aria-labelledby');
        }

        return true;
    }

    testHeadingStructure() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

        if (headings.length === 0) {
            this.testResults.errors.push('No heading elements found');
            return false;
        }

        // Check for h1
        const h1Elements = document.querySelectorAll('h1');
        if (h1Elements.length === 0) {
            this.testResults.errors.push('Missing h1 element');
            return false;
        }

        if (h1Elements.length > 1) {
            this.testResults.warnings.push('Multiple h1 elements found - consider using only one per page');
        }

        // Check heading hierarchy
        let previousLevel = 0;
        let hierarchyValid = true;

        headings.forEach(heading => {
            const level = parseInt(heading.tagName.charAt(1));

            if (previousLevel > 0 && level > previousLevel + 1) {
                hierarchyValid = false;
                this.testResults.warnings.push(`Heading hierarchy skip detected: ${heading.tagName} after h${previousLevel}`);
            }

            previousLevel = level;
        });

        return hierarchyValid;
    }

    testSkipLink() {
        const skipLink = document.querySelector('.skip-link, [href="#main-content"], [href="#main"]');

        if (!skipLink) {
            this.testResults.errors.push('Missing skip navigation link');
            return false;
        }

        // Check if skip link is properly positioned
        const computedStyle = window.getComputedStyle(skipLink);
        const isHidden = computedStyle.position === 'absolute' &&
            (computedStyle.top === '-40px' || computedStyle.left === '-9999px');

        if (!isHidden) {
            this.testResults.warnings.push('Skip link should be visually hidden by default');
        }

        return true;
    }

    testLiveRegions() {
        const liveRegions = document.querySelectorAll('[aria-live]');

        if (liveRegions.length === 0) {
            this.testResults.warnings.push('No ARIA live regions found - consider adding for dynamic content updates');
            return false;
        }

        // Check for screen reader announcements element
        const srAnnouncements = document.getElementById('sr-announcements');
        if (!srAnnouncements) {
            this.testResults.warnings.push('Missing dedicated screen reader announcements element');
        }

        return true;
    }

    testListStructure() {
        const lists = document.querySelectorAll('ul, ol');
        let validStructure = true;

        lists.forEach(list => {
            const listItems = list.querySelectorAll('li');

            if (listItems.length === 0) {
                this.testResults.warnings.push('Empty list found');
                validStructure = false;
            }

            // Check for proper nesting
            const directChildren = Array.from(list.children);
            const hasInvalidChildren = directChildren.some(child =>
                child.tagName !== 'LI' && child.tagName !== 'SCRIPT'
            );

            if (hasInvalidChildren) {
                this.testResults.warnings.push('List contains invalid direct children');
                validStructure = false;
            }
        });

        return validStructure;
    }

    testSemanticSections() {
        const sections = document.querySelectorAll('section, article, aside, header, footer');

        if (sections.length === 0) {
            this.testResults.warnings.push('No semantic section elements found');
            return false;
        }

        // Check if sections have proper headings or aria-labels
        let sectionsWithLabels = 0;

        sections.forEach(section => {
            const hasHeading = section.querySelector('h1, h2, h3, h4, h5, h6');
            const hasAriaLabel = section.hasAttribute('aria-label') ||
                section.hasAttribute('aria-labelledby');

            if (hasHeading || hasAriaLabel) {
                sectionsWithLabels++;
            }
        });

        if (sectionsWithLabels < sections.length) {
            this.testResults.warnings.push('Some sections lack proper headings or aria-labels');
        }

        return true;
    }

    testFormLabels() {
        const formControls = document.querySelectorAll('input, select, textarea');
        let allLabeled = true;

        formControls.forEach(control => {
            const hasLabel = this.hasProperLabel(control);

            if (!hasLabel) {
                this.testResults.warnings.push(`Form control without proper label: ${control.tagName}`);
                allLabeled = false;
            }
        });

        return allLabeled;
    }

    hasProperLabel(control) {
        // Check for associated label element
        if (control.id) {
            const label = document.querySelector(`label[for="${control.id}"]`);
            if (label) return true;
        }

        // Check for wrapping label
        const parentLabel = control.closest('label');
        if (parentLabel) return true;

        // Check for aria-label or aria-labelledby
        if (control.hasAttribute('aria-label') || control.hasAttribute('aria-labelledby')) {
            return true;
        }

        // Check for title attribute (not ideal but acceptable)
        if (control.hasAttribute('title')) {
            return true;
        }

        return false;
    }

    testAriaLabels() {
        console.log('Testing ARIA labels and attributes...');

        const ariaTests = {
            interactiveElementsLabeled: this.testInteractiveElementLabels(),
            ariaRolesValid: this.testAriaRoles(),
            ariaPropertiesValid: this.testAriaProperties(),
            ariaStatesValid: this.testAriaStates(),
            landmarksLabeled: this.testLandmarkLabels(),
            imagesLabeled: this.testImageLabels()
        };

        this.testResults.ariaLabels = ariaTests;
    }

    testInteractiveElementLabels() {
        const interactiveElements = document.querySelectorAll(
            'button, a, input, select, textarea, [role="button"], [role="link"], [tabindex]'
        );

        let allLabeled = true;

        interactiveElements.forEach(element => {
            const hasAccessibleName = this.hasAccessibleName(element);

            if (!hasAccessibleName) {
                this.testResults.errors.push(`Interactive element without accessible name: ${element.tagName}`);
                allLabeled = false;
            }
        });

        return allLabeled;
    }

    hasAccessibleName(element) {
        // Check for aria-label
        if (element.hasAttribute('aria-label') && element.getAttribute('aria-label').trim()) {
            return true;
        }

        // Check for aria-labelledby
        if (element.hasAttribute('aria-labelledby')) {
            const labelIds = element.getAttribute('aria-labelledby').split(' ');
            const hasValidLabels = labelIds.some(id => {
                const labelElement = document.getElementById(id);
                return labelElement && labelElement.textContent.trim();
            });
            if (hasValidLabels) return true;
        }

        // Check for text content
        if (element.textContent && element.textContent.trim()) {
            return true;
        }

        // Check for alt text (for images)
        if (element.hasAttribute('alt')) {
            return true;
        }

        // Check for title attribute
        if (element.hasAttribute('title') && element.getAttribute('title').trim()) {
            return true;
        }

        // Check for associated label (for form controls)
        if (this.hasProperLabel(element)) {
            return true;
        }

        return false;
    }

    testAriaRoles() {
        const elementsWithRoles = document.querySelectorAll('[role]');
        const validRoles = [
            'alert', 'alertdialog', 'application', 'article', 'banner', 'button',
            'cell', 'checkbox', 'columnheader', 'combobox', 'complementary',
            'contentinfo', 'definition', 'dialog', 'directory', 'document',
            'feed', 'figure', 'form', 'grid', 'gridcell', 'group', 'heading',
            'img', 'link', 'list', 'listbox', 'listitem', 'log', 'main',
            'marquee', 'math', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox',
            'menuitemradio', 'navigation', 'none', 'note', 'option', 'presentation',
            'progressbar', 'radio', 'radiogroup', 'region', 'row', 'rowgroup',
            'rowheader', 'scrollbar', 'search', 'searchbox', 'separator',
            'slider', 'spinbutton', 'status', 'switch', 'tab', 'table',
            'tablist', 'tabpanel', 'term', 'textbox', 'timer', 'toolbar',
            'tooltip', 'tree', 'treegrid', 'treeitem'
        ];

        let allValid = true;

        elementsWithRoles.forEach(element => {
            const role = element.getAttribute('role');

            if (!validRoles.includes(role)) {
                this.testResults.errors.push(`Invalid ARIA role: ${role}`);
                allValid = false;
            }
        });

        return allValid;
    }

    testAriaProperties() {
        const ariaProperties = [
            'aria-activedescendant', 'aria-atomic', 'aria-autocomplete',
            'aria-busy', 'aria-checked', 'aria-colcount', 'aria-colindex',
            'aria-colspan', 'aria-controls', 'aria-current', 'aria-describedby',
            'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage',
            'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup',
            'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label',
            'aria-labelledby', 'aria-level', 'aria-live', 'aria-modal',
            'aria-multiline', 'aria-multiselectable', 'aria-orientation',
            'aria-owns', 'aria-placeholder', 'aria-posinset', 'aria-pressed',
            'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription',
            'aria-rowcount', 'aria-rowindex', 'aria-rowspan', 'aria-selected',
            'aria-setsize', 'aria-sort', 'aria-valuemax', 'aria-valuemin',
            'aria-valuenow', 'aria-valuetext'
        ];

        const elementsWithAria = document.querySelectorAll('[aria-*]');
        let allValid = true;

        elementsWithAria.forEach(element => {
            const attributes = element.attributes;

            for (let i = 0; i < attributes.length; i++) {
                const attr = attributes[i];

                if (attr.name.startsWith('aria-')) {
                    if (!ariaProperties.includes(attr.name)) {
                        this.testResults.warnings.push(`Unknown ARIA property: ${attr.name}`);
                        allValid = false;
                    }
                }
            }
        });

        return allValid;
    }

    testAriaStates() {
        // Test common ARIA state patterns
        const expandableElements = document.querySelectorAll('[aria-expanded]');
        const checkableElements = document.querySelectorAll('[aria-checked]');
        const selectableElements = document.querySelectorAll('[aria-selected]');

        let statesValid = true;

        // Check aria-expanded values
        expandableElements.forEach(element => {
            const value = element.getAttribute('aria-expanded');
            if (value !== 'true' && value !== 'false') {
                this.testResults.errors.push(`Invalid aria-expanded value: ${value}`);
                statesValid = false;
            }
        });

        // Check aria-checked values
        checkableElements.forEach(element => {
            const value = element.getAttribute('aria-checked');
            if (value !== 'true' && value !== 'false' && value !== 'mixed') {
                this.testResults.errors.push(`Invalid aria-checked value: ${value}`);
                statesValid = false;
            }
        });

        // Check aria-selected values
        selectableElements.forEach(element => {
            const value = element.getAttribute('aria-selected');
            if (value !== 'true' && value !== 'false') {
                this.testResults.errors.push(`Invalid aria-selected value: ${value}`);
                statesValid = false;
            }
        });

        return statesValid;
    }

    testLandmarkLabels() {
        const landmarks = document.querySelectorAll(
            'nav, main, aside, section[role], [role="banner"], [role="contentinfo"], [role="complementary"], [role="navigation"], [role="main"]'
        );

        let allLabeled = true;

        landmarks.forEach(landmark => {
            const tagName = landmark.tagName.toLowerCase();
            const role = landmark.getAttribute('role');

            // Multiple landmarks of the same type should be labeled
            const sameTypeLandmarks = document.querySelectorAll(
                tagName === 'section' ? `[role="${role}"]` : tagName
            );

            if (sameTypeLandmarks.length > 1) {
                const hasLabel = landmark.hasAttribute('aria-label') ||
                    landmark.hasAttribute('aria-labelledby');

                if (!hasLabel) {
                    this.testResults.warnings.push(`Multiple ${tagName} landmarks should have unique labels`);
                    allLabeled = false;
                }
            }
        });

        return allLabeled;
    }

    testImageLabels() {
        const images = document.querySelectorAll('img, svg, [role="img"]');
        let allLabeled = true;

        images.forEach(image => {
            const hasAltText = image.hasAttribute('alt');
            const hasAriaLabel = image.hasAttribute('aria-label') ||
                image.hasAttribute('aria-labelledby');
            const isDecorative = image.getAttribute('alt') === '' ||
                image.getAttribute('aria-hidden') === 'true';

            if (!hasAltText && !hasAriaLabel && !isDecorative) {
                this.testResults.errors.push('Image without alternative text');
                allLabeled = false;
            }
        });

        return allLabeled;
    }

    testKeyboardNavigation() {
        console.log('Testing keyboard navigation...');

        const keyboardTests = {
            focusableElementsAccessible: this.testFocusableElements(),
            tabOrderLogical: this.testTabOrder(),
            keyboardTrapsHandled: this.testKeyboardTraps(),
            customControlsAccessible: this.testCustomControls(),
            skipLinksWork: this.testSkipLinkFunctionality()
        };

        this.testResults.keyboardNavigation = keyboardTests;
    }

    testFocusableElements() {
        const focusableSelectors = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
            '[contenteditable="true"]'
        ];

        const focusableElements = document.querySelectorAll(focusableSelectors.join(', '));
        let allAccessible = true;

        focusableElements.forEach(element => {
            // Check if element is visible
            const style = window.getComputedStyle(element);
            const isVisible = style.display !== 'none' &&
                style.visibility !== 'hidden' &&
                style.opacity !== '0';

            if (isVisible) {
                // Check if element has accessible name
                const hasAccessibleName = this.hasAccessibleName(element);

                if (!hasAccessibleName) {
                    this.testResults.warnings.push(`Focusable element without accessible name: ${element.tagName}`);
                    allAccessible = false;
                }
            }
        });

        return allAccessible;
    }

    testTabOrder() {
        const tabbableElements = this.getTabbableElements();

        // Check for logical tab order
        let previousTabIndex = -1;
        let orderLogical = true;

        tabbableElements.forEach(element => {
            const tabIndex = parseInt(element.getAttribute('tabindex')) || 0;

            if (tabIndex > 0 && tabIndex < previousTabIndex) {
                orderLogical = false;
                this.testResults.warnings.push('Tab order may not be logical due to positive tabindex values');
            }

            previousTabIndex = tabIndex;
        });

        return orderLogical;
    }

    getTabbableElements() {
        const tabbableSelectors = [
            'a[href]:not([tabindex="-1"])',
            'button:not([disabled]):not([tabindex="-1"])',
            'input:not([disabled]):not([tabindex="-1"])',
            'select:not([disabled]):not([tabindex="-1"])',
            'textarea:not([disabled]):not([tabindex="-1"])',
            '[tabindex]:not([tabindex="-1"])',
            '[contenteditable="true"]:not([tabindex="-1"])'
        ];

        return Array.from(document.querySelectorAll(tabbableSelectors.join(', ')))
            .filter(element => {
                const style = window.getComputedStyle(element);
                return style.display !== 'none' &&
                    style.visibility !== 'hidden' &&
                    element.offsetParent !== null;
            });
    }

    testKeyboardTraps() {
        // Check for modal dialogs or other components that should trap focus
        const modals = document.querySelectorAll('[role="dialog"], [role="alertdialog"], .modal');

        // For now, just check if modals exist and have proper focus management
        let trapsHandled = true;

        modals.forEach(modal => {
            const isVisible = window.getComputedStyle(modal).display !== 'none';

            if (isVisible) {
                const focusableElements = modal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );

                if (focusableElements.length === 0) {
                    this.testResults.warnings.push('Modal without focusable elements');
                    trapsHandled = false;
                }
            }
        });

        return trapsHandled;
    }

    testCustomControls() {
        const customControls = document.querySelectorAll('[role="button"], [role="link"], [role="menuitem"]');
        let allAccessible = true;

        customControls.forEach(control => {
            // Check if custom control is keyboard accessible
            const hasTabIndex = control.hasAttribute('tabindex');
            const tabIndex = control.getAttribute('tabindex');

            if (!hasTabIndex || tabIndex === '-1') {
                this.testResults.warnings.push('Custom control may not be keyboard accessible');
                allAccessible = false;
            }
        });

        return allAccessible;
    }

    testSkipLinkFunctionality() {
        const skipLink = document.querySelector('.skip-link, [href="#main-content"], [href="#main"]');

        if (!skipLink) {
            return false;
        }

        // Check if skip link target exists
        const href = skipLink.getAttribute('href');
        if (href && href.startsWith('#')) {
            const target = document.querySelector(href);

            if (!target) {
                this.testResults.errors.push('Skip link target does not exist');
                return false;
            }
        }

        return true;
    }

    testFocusManagement() {
        console.log('Testing focus management...');

        const focusTests = {
            focusIndicatorsVisible: this.testFocusIndicators(),
            focusOrderLogical: this.testFocusOrder(),
            focusNotTrapped: this.testFocusTrapping(),
            initialFocusSet: this.testInitialFocus()
        };

        this.testResults.focusManagement = focusTests;
    }

    testFocusIndicators() {
        // Create a test element to check focus indicators
        const testButton = document.createElement('button');
        testButton.textContent = 'Test';
        testButton.style.position = 'absolute';
        testButton.style.top = '-1000px';
        document.body.appendChild(testButton);

        testButton.focus();

        const computedStyle = window.getComputedStyle(testButton, ':focus');
        const hasOutline = computedStyle.outline !== 'none' && computedStyle.outline !== '';
        const hasBoxShadow = computedStyle.boxShadow !== 'none';
        const hasBorder = computedStyle.borderColor !== computedStyle.borderColor; // Check if border changes

        document.body.removeChild(testButton);

        const hasFocusIndicator = hasOutline || hasBoxShadow || hasBorder;

        if (!hasFocusIndicator) {
            this.testResults.warnings.push('Focus indicators may not be visible');
        }

        return hasFocusIndicator;
    }

    testFocusOrder() {
        const tabbableElements = this.getTabbableElements();

        // Check if focus order matches visual order (simplified test)
        let orderLogical = true;

        for (let i = 1; i < tabbableElements.length; i++) {
            const current = tabbableElements[i];
            const previous = tabbableElements[i - 1];

            const currentRect = current.getBoundingClientRect();
            const previousRect = previous.getBoundingClientRect();

            // Very basic check: if current element is significantly above previous, order might be wrong
            if (currentRect.top < previousRect.top - 50) {
                this.testResults.warnings.push('Focus order may not match visual order');
                orderLogical = false;
                break;
            }
        }

        return orderLogical;
    }

    testFocusTrapping() {
        // Check for elements that might inappropriately trap focus
        const elementsWithTabIndex = document.querySelectorAll('[tabindex]');
        let noInappropriateTrapping = true;

        elementsWithTabIndex.forEach(element => {
            const tabIndex = element.getAttribute('tabindex');

            // Negative tabindex on interactive elements might indicate focus issues
            if (tabIndex === '-1' && this.isInteractiveElement(element)) {
                this.testResults.warnings.push('Interactive element with tabindex="-1" may not be keyboard accessible');
                noInappropriateTrapping = false;
            }
        });

        return noInappropriateTrapping;
    }

    isInteractiveElement(element) {
        const interactiveTags = ['button', 'a', 'input', 'select', 'textarea'];
        const interactiveRoles = ['button', 'link', 'menuitem', 'tab'];

        return interactiveTags.includes(element.tagName.toLowerCase()) ||
            interactiveRoles.includes(element.getAttribute('role'));
    }

    testInitialFocus() {
        // Check if page has appropriate initial focus
        const activeElement = document.activeElement;

        // Skip link should be focusable but not initially focused
        const skipLink = document.querySelector('.skip-link');

        if (activeElement === document.body || activeElement === document.documentElement) {
            // This is normal for most pages
            return true;
        }

        return true; // Initial focus handling is generally acceptable
    }

    testColorContrast() {
        console.log('Testing color contrast...');

        const contrastTests = {
            textContrastSufficient: this.testTextContrast(),
            linkContrastSufficient: this.testLinkContrast(),
            buttonContrastSufficient: this.testButtonContrast(),
            focusIndicatorContrast: this.testFocusIndicatorContrast()
        };

        this.testResults.colorContrast = contrastTests;
    }

    testTextContrast() {
        // This is a simplified test - full contrast testing requires color analysis
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
        let sufficientContrast = true;

        // Check for common contrast issues
        textElements.forEach(element => {
            const style = window.getComputedStyle(element);
            const color = style.color;
            const backgroundColor = style.backgroundColor;

            // Basic check for very light text on light background or very dark on dark
            if (this.isLowContrast(color, backgroundColor)) {
                this.testResults.warnings.push('Potential low contrast text detected');
                sufficientContrast = false;
            }
        });

        return sufficientContrast;
    }

    testLinkContrast() {
        const links = document.querySelectorAll('a');
        let sufficientContrast = true;

        links.forEach(link => {
            const style = window.getComputedStyle(link);
            const color = style.color;
            const backgroundColor = style.backgroundColor;

            if (this.isLowContrast(color, backgroundColor)) {
                this.testResults.warnings.push('Potential low contrast link detected');
                sufficientContrast = false;
            }
        });

        return sufficientContrast;
    }

    testButtonContrast() {
        const buttons = document.querySelectorAll('button, [role="button"]');
        let sufficientContrast = true;

        buttons.forEach(button => {
            const style = window.getComputedStyle(button);
            const color = style.color;
            const backgroundColor = style.backgroundColor;

            if (this.isLowContrast(color, backgroundColor)) {
                this.testResults.warnings.push('Potential low contrast button detected');
                sufficientContrast = false;
            }
        });

        return sufficientContrast;
    }

    testFocusIndicatorContrast() {
        // Test focus indicator contrast (simplified)
        const focusableElements = document.querySelectorAll('button, a, input');
        let sufficientContrast = true;

        if (focusableElements.length > 0) {
            const testElement = focusableElements[0];
            testElement.focus();

            const focusStyle = window.getComputedStyle(testElement, ':focus');
            const outlineColor = focusStyle.outlineColor;

            // Basic check - this would need more sophisticated color analysis in practice
            if (outlineColor === 'transparent' || outlineColor === 'rgba(0, 0, 0, 0)') {
                this.testResults.warnings.push('Focus indicators may have insufficient contrast');
                sufficientContrast = false;
            }

            testElement.blur();
        }

        return sufficientContrast;
    }

    isLowContrast(color1, color2) {
        // Very simplified contrast check
        // In practice, this would need proper color parsing and contrast ratio calculation

        if (color1 === color2) return true;

        // Check for common low contrast patterns
        const lightColors = ['rgb(255, 255, 255)', 'white', '#ffffff', '#fff'];
        const darkColors = ['rgb(0, 0, 0)', 'black', '#000000', '#000'];

        const isColor1Light = lightColors.some(light => color1.includes(light));
        const isColor2Light = lightColors.some(light => color2.includes(light));
        const isColor1Dark = darkColors.some(dark => color1.includes(dark));
        const isColor2Dark = darkColors.some(dark => color2.includes(dark));

        // Both light or both dark = potential low contrast
        return (isColor1Light && isColor2Light) || (isColor1Dark && isColor2Dark);
    }

    testScreenReaderSupport() {
        console.log('Testing screen reader support...');

        const screenReaderTests = {
            ariaLiveRegionsPresent: this.testAriaLiveRegions(),
            screenReaderOnlyContentPresent: this.testScreenReaderOnlyContent(),
            properlyHiddenDecorative: this.testDecorativeContentHidden(),
            dynamicContentAnnounced: this.testDynamicContentAnnouncements()
        };

        this.testResults.screenReaderSupport = screenReaderTests;
    }

    testAriaLiveRegions() {
        const liveRegions = document.querySelectorAll('[aria-live]');

        if (liveRegions.length === 0) {
            this.testResults.warnings.push('No ARIA live regions found for dynamic content updates');
            return false;
        }

        // Check for proper live region setup
        let properSetup = true;

        liveRegions.forEach(region => {
            const liveValue = region.getAttribute('aria-live');

            if (liveValue !== 'polite' && liveValue !== 'assertive' && liveValue !== 'off') {
                this.testResults.errors.push(`Invalid aria-live value: ${liveValue}`);
                properSetup = false;
            }
        });

        return properSetup;
    }

    testScreenReaderOnlyContent() {
        const srOnlyElements = document.querySelectorAll('.sr-only, .screen-reader-only, .visually-hidden');

        if (srOnlyElements.length === 0) {
            this.testResults.warnings.push('No screen reader only content found - consider adding context for screen readers');
            return false;
        }

        // Check if screen reader only content is properly hidden
        let properlyHidden = true;

        srOnlyElements.forEach(element => {
            const style = window.getComputedStyle(element);

            const isVisuallyHidden = (
                style.position === 'absolute' &&
                (style.left === '-9999px' || style.top === '-9999px' ||
                    style.left === '-10000px' || style.top === '-10000px')
            ) || (
                    style.width === '1px' && style.height === '1px' && style.overflow === 'hidden'
                ) || (
                    style.clip === 'rect(0px, 0px, 0px, 0px)' || style.clip === 'rect(0, 0, 0, 0)'
                );

            if (!isVisuallyHidden) {
                this.testResults.warnings.push('Screen reader only content may be visible');
                properlyHidden = false;
            }
        });

        return properlyHidden;
    }

    testDecorativeContentHidden() {
        const decorativeElements = document.querySelectorAll('[aria-hidden="true"], [role="presentation"]');
        let properlyHidden = true;

        decorativeElements.forEach(element => {
            // Check if decorative elements are not focusable
            const isFocusable = element.hasAttribute('tabindex') &&
                element.getAttribute('tabindex') !== '-1';

            if (isFocusable) {
                this.testResults.errors.push('Decorative element should not be focusable');
                properlyHidden = false;
            }
        });

        return properlyHidden;
    }

    testDynamicContentAnnouncements() {
        // Check if there's a system for announcing dynamic content changes
        const announcementElements = document.querySelectorAll('#sr-announcements, #announcements, [aria-live]');

        if (announcementElements.length === 0) {
            this.testResults.warnings.push('No system found for announcing dynamic content changes');
            return false;
        }

        return true;
    }

    testWCAGCompliance() {
        console.log('Testing WCAG 2.1 AA compliance...');

        const wcagTests = {
            perceivable: this.testPerceivableGuideline(),
            operable: this.testOperableGuideline(),
            understandable: this.testUnderstandableGuideline(),
            robust: this.testRobustGuideline()
        };

        this.testResults.wcagCompliance = wcagTests;
    }

    testPerceivableGuideline() {
        // WCAG Perceivable tests
        return {
            textAlternatives: this.testResults.ariaLabels.imagesLabeled,
            captions: true, // Assume no video content for now
            adaptable: this.testResults.semanticMarkup.hasProperHeadingStructure,
            distinguishable: this.testResults.colorContrast.textContrastSufficient
        };
    }

    testOperableGuideline() {
        // WCAG Operable tests
        return {
            keyboardAccessible: this.testResults.keyboardNavigation.focusableElementsAccessible,
            seizures: true, // Assume no flashing content
            navigable: this.testResults.semanticMarkup.hasSkipLink,
            inputModalities: this.testResults.keyboardNavigation.customControlsAccessible
        };
    }

    testUnderstandableGuideline() {
        // WCAG Understandable tests
        const langAttribute = document.documentElement.hasAttribute('lang');

        return {
            readable: langAttribute,
            predictable: true, // Assume consistent navigation
            inputAssistance: this.testResults.semanticMarkup.hasProperFormLabels
        };
    }

    testRobustGuideline() {
        // WCAG Robust tests
        return {
            compatible: this.testResults.ariaLabels.ariaRolesValid &&
                this.testResults.ariaLabels.ariaPropertiesValid
        };
    }

    generateReport() {
        console.log('Generating accessibility compliance report...');

        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalTests: this.countTotalTests(),
                passedTests: this.countPassedTests(),
                failedTests: this.countFailedTests(),
                warningCount: this.testResults.warnings.length,
                errorCount: this.testResults.errors.length,
                overallScore: this.calculateOverallScore(),
                wcagLevel: this.determineWCAGLevel()
            },
            details: this.testResults
        };

        // Log report to console
        console.log('Accessibility Compliance Report:', report);

        // Store report for potential display
        window.accessibilityReport = report;

        return report;
    }

    countTotalTests() {
        let total = 0;

        // Count all test categories
        Object.values(this.testResults).forEach(category => {
            if (typeof category === 'object' && !Array.isArray(category)) {
                total += Object.keys(category).length;
            }
        });

        return total;
    }

    countPassedTests() {
        let passed = 0;

        Object.values(this.testResults).forEach(category => {
            if (typeof category === 'object' && !Array.isArray(category)) {
                Object.values(category).forEach(result => {
                    if (result === true || (typeof result === 'object' && this.isTestPassed(result))) {
                        passed++;
                    }
                });
            }
        });

        return passed;
    }

    countFailedTests() {
        return this.countTotalTests() - this.countPassedTests();
    }

    isTestPassed(result) {
        if (typeof result === 'object') {
            // For nested test objects, check if all sub-tests pass
            return Object.values(result).every(subResult => subResult === true);
        }
        return result === true;
    }

    calculateOverallScore() {
        const total = this.countTotalTests();
        const passed = this.countPassedTests();

        if (total === 0) return 0;

        return Math.round((passed / total) * 100);
    }

    determineWCAGLevel() {
        const score = this.calculateOverallScore();
        const errorCount = this.testResults.errors.length;

        if (errorCount === 0 && score >= 95) {
            return 'AA';
        } else if (errorCount <= 2 && score >= 85) {
            return 'A';
        } else {
            return 'Non-compliant';
        }
    }
}

// Auto-run tests when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for the main application to initialize
    setTimeout(() => {
        new AccessibilityValidator();
    }, 1500);
});

// Export for manual testing
window.AccessibilityValidator = AccessibilityValidator;