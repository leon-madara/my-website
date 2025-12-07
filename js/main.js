/**
 * Leon Madara Portfolio - Main JavaScript File
 * Vanilla implementation of portfolio functionality
 */

// Main application namespace
const LeonPortfolio = {
    // Application state
    state: {
        isInitialized: false,
        activeNavItem: null,
        animationsEnabled: true,
        isMobile: false,
        isTransitioning: false
    },

    // Configuration
    config: {
        animationDuration: 300,
        staggerDelay: 100,
        haloAnimationDuration: 200,
        breakpoints: {
            mobile: 768,
            tablet: 1024
        }
    },

    // Initialize the application
    init() {
        if (this.state.isInitialized) return;

        console.log('Initializing Leon Portfolio...');

        // Check for reduced motion preference
        this.checkReducedMotion();

        // Detect mobile device
        this.detectMobile();

        // Initialize components
        this.initializeComponents();

        // Set up global event listeners
        this.setupGlobalEvents();

        // Mark as initialized
        this.state.isInitialized = true;

        console.log('Portfolio initialized successfully');
    },

    // Check for reduced motion preference
    checkReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.state.animationsEnabled = !prefersReducedMotion;

        if (prefersReducedMotion) {
            document.body.classList.add('reduced-motion');
        }
    },

    // Detect mobile device
    detectMobile() {
        this.state.isMobile = window.innerWidth <= this.config.breakpoints.mobile;
        document.body.classList.toggle('mobile', this.state.isMobile);
    },

    // Initialize all components
    initializeComponents() {
        // Initialize HaloAnimationSystem
        this.haloSystem = new this.HaloAnimationSystem();

        // Initialize entrance animations
        this.initializeEntranceAnimations();

        // Initialize responsive features - Requirements 8.1, 8.2, 8.3, 8.4, 8.5
        this.initializeResponsiveFeatures();

        console.log('All components initialized');
    },

    // Initialize responsive features - Requirements 8.1, 8.2, 8.3, 8.4, 8.5
    initializeResponsiveFeatures() {
        // Detect device capabilities
        this.detectDeviceCapabilities();

        // Enforce initial responsive requirements
        this.enforceResponsiveRequirements();

        // Set up viewport change monitoring
        this.setupAdvancedViewportMonitoring();

        // Initialize cross-device compatibility
        this.initializeCrossDeviceCompatibility();

        // Set up responsive event listeners
        this.setupResponsiveEventListeners();

        // Monitor device orientation changes
        this.setupOrientationMonitoring();

        // Initialize touch gesture support
        this.initializeTouchGestureSupport();

        console.log('Responsive features initialized');
    },

    // Detect device capabilities - Requirements 8.4, 8.5
    detectDeviceCapabilities() {
        // Detect touch capability
        const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        // Detect hover capability
        const hasHover = window.matchMedia('(hover: hover)').matches;

        // Detect pointer precision
        const hasFinePrecision = window.matchMedia('(pointer: fine)').matches;

        // Store capabilities in state
        this.state.deviceCapabilities = {
            hasTouch,
            hasHover,
            hasFinePrecision,
            isHybrid: hasTouch && hasHover
        };

        // Add classes to body for CSS targeting
        document.body.classList.toggle('has-touch', hasTouch);
        document.body.classList.toggle('has-hover', hasHover);
        document.body.classList.toggle('has-fine-pointer', hasFinePrecision);
        document.body.classList.toggle('hybrid-input', hasTouch && hasHover);

        console.log('Device capabilities detected:', this.state.deviceCapabilities);
    },

    // Setup advanced viewport monitoring - Requirements 8.1, 8.2, 8.3
    setupAdvancedViewportMonitoring() {
        // Monitor for viewport changes beyond just resize
        if ('ResizeObserver' in window) {
            const resizeObserver = new ResizeObserver(this.utils.throttle(() => {
                this.handleAdvancedViewportChange();
            }, 100));

            resizeObserver.observe(document.documentElement);
        }

        // Monitor for orientation changes
        if ('screen' in window && 'orientation' in screen) {
            screen.orientation.addEventListener('change', () => {
                setTimeout(() => {
                    this.handleOrientationChange();
                }, 100);
            });
        }

        // Monitor for zoom changes
        let lastZoom = window.devicePixelRatio;
        const checkZoom = () => {
            const currentZoom = window.devicePixelRatio;
            if (Math.abs(currentZoom - lastZoom) > 0.1) {
                lastZoom = currentZoom;
                this.handleZoomChange(currentZoom);
            }
        };

        setInterval(checkZoom, 500);
    },

    // Handle advanced viewport changes - Requirements 8.1, 8.2, 8.3
    handleAdvancedViewportChange() {
        // Update viewport-dependent elements
        this.updateViewportDependentElements();

        // Update navigation layout
        if (this.floatingNav) {
            this.floatingNav.handleViewportChange();
        }

        // Enforce responsive requirements
        this.enforceResponsiveRequirements();
    },

    // Handle zoom changes - Requirements 8.1, 8.2, 8.5
    handleZoomChange(zoomLevel) {
        // Adjust touch targets for zoom level - Requirement 8.5
        const navIcons = document.querySelectorAll('.nav-icon');
        navIcons.forEach(icon => {
            const baseSize = 44; // Base touch target size
            const adjustedSize = Math.max(baseSize / zoomLevel, baseSize);

            if (zoomLevel > 1.5) {
                // High zoom - ensure touch targets remain accessible
                icon.style.minWidth = `${adjustedSize}px`;
                icon.style.minHeight = `${adjustedSize}px`;
            }
        });

        // Announce zoom change for accessibility
        this.utils.announceToScreenReader(
            `Page zoom changed to ${Math.round(zoomLevel * 100)}%`
        );
    },

    // Set up global event listeners
    setupGlobalEvents() {
        // Window resize handler
        window.addEventListener('resize', this.utils.debounce(() => {
            this.handleResize();
        }, 250));

        // Orientation change handler
        window.addEventListener('orientationchange', () => {
            // Delay to ensure viewport has updated
            setTimeout(() => {
                this.handleResize();
            }, 100);
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });

        // Focus management
        document.addEventListener('focusin', (e) => {
            this.handleFocusIn(e);
        });

        // Touch event handlers for mobile
        if ('ontouchstart' in window) {
            this.setupGlobalTouchEvents();
        }

        // Viewport change detection
        this.setupViewportChangeDetection();

        // Network status monitoring for mobile
        this.setupNetworkStatusMonitoring();
    },


    // Setup global touch events
    setupGlobalTouchEvents() {
        // Prevent default touch behaviors where appropriate
        document.addEventListener('touchstart', (e) => {
            this.handleGlobalTouchStart(e);
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            this.handleGlobalTouchMove(e);
        }, { passive: false });

        document.addEventListener('touchend', (e) => {
            this.handleGlobalTouchEnd(e);
        }, { passive: true });

        // Handle touch gestures
        this.setupGlobalGestureHandlers();
    },

    // Setup viewport change detection
    setupViewportChangeDetection() {
        // Use ResizeObserver if available for more accurate detection
        if (window.ResizeObserver) {
            const resizeObserver = new ResizeObserver(this.utils.throttle(() => {
                this.updateViewportDependentElements();
            }, 100));

            resizeObserver.observe(document.documentElement);
        }

        // Visual viewport API for mobile browsers
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', () => {
                this.handleVisualViewportChange();
            });
        }
    },

    // Setup network status monitoring
    setupNetworkStatusMonitoring() {
        if ('connection' in navigator) {
            const connection = navigator.connection;

            // Adjust animations based on connection speed
            const updateForConnection = () => {
                if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                    // Disable complex animations on slow connections
                    document.body.classList.add('slow-connection');
                    this.state.animationsEnabled = false;
                } else {
                    document.body.classList.remove('slow-connection');
                    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                        this.state.animationsEnabled = true;
                    }
                }
            };

            connection.addEventListener('change', updateForConnection);
            updateForConnection(); // Initial check
        }
    },

    // Handle global touch start
    handleGlobalTouchStart(e) {
        // Add touch class to body for CSS styling
        document.body.classList.add('touching');

        // Store touch start time for gesture detection
        this.touchStartTime = Date.now();

        // Prevent zoom on double tap for specific elements
        const target = e.target;
        if (target.closest('.floating-navigation') || target.closest('.pill-sidebar')) {
            if (this.lastTouchEnd && (this.touchStartTime - this.lastTouchEnd) < 300) {
                e.preventDefault();
            }
        }
    },

    // Handle global touch move
    handleGlobalTouchMove(e) {
        // Prevent overscroll on iOS
        if (this.state.isMobile && e.touches.length === 1) {
            const touch = e.touches[0];
            const target = e.target;

            // Allow scrolling on scrollable elements
            if (!target.closest('.scrollable') && !target.closest('main')) {
                // Check if we're at the top or bottom of the page
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight;
                const clientHeight = document.documentElement.clientHeight;

                if ((scrollTop === 0 && e.touches[0].clientY > this.lastTouchY) ||
                    (scrollTop + clientHeight >= scrollHeight && e.touches[0].clientY < this.lastTouchY)) {
                    e.preventDefault();
                }
            }
        }

        this.lastTouchY = e.touches[0].clientY;
    },

    // Handle global touch end
    handleGlobalTouchEnd(e) {
        // Remove touch class from body
        setTimeout(() => {
            document.body.classList.remove('touching');
        }, 100);

        this.lastTouchEnd = Date.now();
    },

    // Setup global gesture handlers
    setupGlobalGestureHandlers() {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;

        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                touchStartTime = Date.now();
            }
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            if (e.changedTouches.length === 1) {
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;
                const touchEndTime = Date.now();

                const deltaX = touchEndX - touchStartX;
                const deltaY = touchEndY - touchStartY;
                const deltaTime = touchEndTime - touchStartTime;

                // Detect swipe gestures
                if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 100 && deltaTime < 300) {
                    this.handleGlobalSwipe(deltaX > 0 ? 'right' : 'left', e);
                }

                // Detect tap gestures
                if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 200) {
                    this.handleGlobalTap(e);
                }
            }
        }, { passive: true });
    },

    // Handle global swipe gesture
    handleGlobalSwipe(direction, e) {
        // Only handle swipes on specific elements
        const target = e.target;

        if (target.closest('.hero-section')) {
            // Swipe on hero section - could trigger navigation
            this.handleHeroSwipe(direction);
        }
    },

    // Handle global tap gesture
    handleGlobalTap(e) {
        // Add ripple effect for touch feedback
        this.addTouchRipple(e.changedTouches[0]);
    },

    // Handle hero section swipe
    handleHeroSwipe(direction) {
        // Announce swipe to screen readers
        LeonPortfolio.utils.announceToScreenReader(`Swiped ${direction} on hero section`);

        // Could be used to navigate between sections or trigger actions
        console.log(`Hero swipe detected: ${direction}`);
    },

    // Add touch ripple effect
    addTouchRipple(touch) {
        const ripple = document.createElement('div');
        ripple.className = 'touch-ripple';
        ripple.style.position = 'fixed';
        ripple.style.left = `${touch.clientX}px`;
        ripple.style.top = `${touch.clientY}px`;
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.transform = 'translate(-50%, -50%) scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '9999';

        document.body.appendChild(ripple);

        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    },

    // Handle visual viewport change (mobile keyboard, etc.)
    handleVisualViewportChange() {
        const visualViewport = window.visualViewport;
        const heightDifference = window.innerHeight - visualViewport.height;

        // Keyboard is likely open if height difference is significant
        if (heightDifference > 150) {
            document.body.classList.add('keyboard-open');
            // Adjust layout for keyboard
            this.adjustLayoutForKeyboard(true);
        } else {
            document.body.classList.remove('keyboard-open');
            this.adjustLayoutForKeyboard(false);
        }
    },

    // Adjust layout for mobile keyboard
    adjustLayoutForKeyboard(keyboardOpen) {
        const sidebar = document.querySelector('.pill-sidebar');
        const navigation = document.querySelector('.floating-navigation');

        if (keyboardOpen) {
            // Hide or reposition elements when keyboard is open
            if (sidebar) {
                sidebar.style.transform = 'translateX(-100%)';
            }
            if (navigation) {
                navigation.style.bottom = `${window.visualViewport.height - 60}px`;
            }
        } else {
            // Restore normal positions
            if (sidebar) {
                sidebar.style.transform = '';
            }
            if (navigation) {
                navigation.style.bottom = '';
            }
        }
    },

    // Handle window resize - Requirements 8.1, 8.2, 8.3, 8.4, 8.5
    handleResize() {
        const wasMobile = this.state.isMobile;
        const wasTablet = this.state.isTablet;

        this.detectMobile();
        this.detectTablet();

        // Check for orientation change on mobile
        if (this.state.isMobile) {
            this.handleOrientationChange();
        }

        // Update layout if device type changed
        if (wasMobile !== this.state.isMobile || wasTablet !== this.state.isTablet) {
            this.onMobileStateChange();
        }

        // Update viewport-dependent elements
        this.updateViewportDependentElements();

        // Recalculate positions for floating elements
        this.recalculateFloatingElements();

        // Update navigation for viewport changes - Requirements 8.1, 8.2, 8.3
        if (this.floatingNav) {
            this.floatingNav.handleViewportChange();
        }

        // Ensure responsive requirements are met
        this.enforceResponsiveRequirements();
    },

    // Enforce responsive design requirements - Requirements 8.1, 8.2, 8.3, 8.4, 8.5
    enforceResponsiveRequirements() {
        // Requirement 8.1: Ensure 60px header height works across all device sizes
        const navigation = document.querySelector('.floating-navigation');
        if (navigation) {
            const computedHeight = parseInt(getComputedStyle(navigation).height);
            if (computedHeight !== 60) {
                navigation.style.height = '60px';
                console.warn('Header height corrected to 60px for responsive compliance');
            }
        }

        // Requirement 8.2: Maintain 30px icon height on mobile, tablet, and desktop
        const iconSvgs = document.querySelectorAll('.nav-icon-svg');
        iconSvgs.forEach(icon => {
            const computedWidth = parseInt(getComputedStyle(icon).width);
            const computedHeight = parseInt(getComputedStyle(icon).height);

            if (computedWidth !== 30 || computedHeight !== 30) {
                icon.style.width = '30px';
                icon.style.height = '30px';
                console.warn('Icon size corrected to 30px for responsive compliance');
            }
        });

        // Requirement 8.5: Ensure touch-friendly interaction areas meet accessibility guidelines
        const navIcons = document.querySelectorAll('.nav-icon');
        navIcons.forEach(icon => {
            const rect = icon.getBoundingClientRect();
            if (rect.width < 44 || rect.height < 44) {
                icon.style.minWidth = '44px';
                icon.style.minHeight = '44px';
                console.warn('Touch target size corrected to 44px minimum for accessibility compliance');
            }
        });

        // Requirement 8.3: Adapt icon container layout for different viewport widths
        this.adaptIconContainerLayout();

        // Requirements 8.4, 8.5: Ensure cross-device interaction compatibility
        this.ensureCrossDeviceInteractions();
    },

    // Initialize cross-device compatibility - Requirements 8.4, 8.5
    initializeCrossDeviceCompatibility() {
        // Detect input methods
        const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const hasHover = window.matchMedia('(hover: hover)').matches;
        const hasFinePrecision = window.matchMedia('(pointer: fine)').matches;

        // Store device capabilities
        this.state.deviceCapabilities = {
            hasTouch,
            hasHover,
            hasFinePrecision,
            isHybrid: hasTouch && hasHover,
            isTouchOnly: hasTouch && !hasHover,
            isMouseOnly: hasHover && hasFinePrecision && !hasTouch
        };

        // Apply device-specific classes
        document.body.classList.toggle('has-touch', hasTouch);
        document.body.classList.toggle('has-hover', hasHover);
        document.body.classList.toggle('has-fine-pointer', hasFinePrecision);
        document.body.classList.toggle('hybrid-input', hasTouch && hasHover);
        document.body.classList.toggle('touch-only', hasTouch && !hasHover);
        document.body.classList.toggle('mouse-only', hasHover && hasFinePrecision && !hasTouch);

        // Configure interactions based on device capabilities
        this.configureDeviceSpecificInteractions();

        console.log('Cross-device compatibility initialized:', this.state.deviceCapabilities);
    },

    // Configure device-specific interactions - Requirements 8.4, 8.5
    configureDeviceSpecificInteractions() {
        const navIcons = document.querySelectorAll('.nav-icon');

        navIcons.forEach(icon => {
            if (this.state.deviceCapabilities.isTouchOnly) {
                // Touch-only device optimizations
                this.setupTouchOnlyInteractions(icon);
            } else if (this.state.deviceCapabilities.isMouseOnly) {
                // Mouse-only device optimizations
                this.setupMouseOnlyInteractions(icon);
            } else if (this.state.deviceCapabilities.isHybrid) {
                // Hybrid device optimizations
                this.setupHybridInteractions(icon);
            }
        });
    },

    // Setup touch-only interactions - Requirement 8.4
    setupTouchOnlyInteractions(icon) {
        // Optimize for touch interactions
        icon.style.touchAction = 'manipulation';
        icon.style.webkitTouchCallout = 'none';
        icon.style.webkitUserSelect = 'none';
        icon.style.userSelect = 'none';

        // Add touch feedback
        icon.addEventListener('touchstart', (e) => {
            icon.classList.add('touch-active');
            // Haptic feedback if available
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        }, { passive: true });

        icon.addEventListener('touchend', (e) => {
            setTimeout(() => {
                icon.classList.remove('touch-active');
            }, 150);
        }, { passive: true });

        icon.addEventListener('touchcancel', (e) => {
            icon.classList.remove('touch-active');
        }, { passive: true });
    },

    // Setup mouse-only interactions - Requirement 8.4
    setupMouseOnlyInteractions(icon) {
        // Optimize for mouse interactions
        icon.style.cursor = 'pointer';

        // Enhanced hover effects for precise pointing
        icon.addEventListener('mouseenter', (e) => {
            icon.classList.add('mouse-hover');
        });

        icon.addEventListener('mouseleave', (e) => {
            icon.classList.remove('mouse-hover');
        });
    },

    // Setup hybrid interactions - Requirements 8.4, 8.5
    setupHybridInteractions(icon) {
        // Support both touch and mouse interactions
        icon.style.touchAction = 'manipulation';
        icon.style.cursor = 'pointer';

        // Touch interactions
        this.setupTouchOnlyInteractions(icon);

        // Mouse interactions
        this.setupMouseOnlyInteractions(icon);

        // Prevent hover states from sticking on touch
        icon.addEventListener('touchstart', (e) => {
            icon.classList.add('touch-mode');
        }, { passive: true });

        icon.addEventListener('mousemove', (e) => {
            icon.classList.remove('touch-mode');
        });
    },

    // Adapt icon container layout - Requirement 8.3
    adaptIconContainerLayout() {
        const iconsContainer = document.querySelector('.nav-icons-container');
        if (!iconsContainer) return;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const isLandscape = viewportWidth > viewportHeight;

        // Adjust spacing based on viewport size and orientation
        if (viewportWidth <= 320) {
            // Extra small mobile
            iconsContainer.style.gap = '0.75rem';
            iconsContainer.style.padding = '0.125rem 0.25rem';
        } else if (viewportWidth <= 480) {
            // Small mobile
            iconsContainer.style.gap = '1rem';
            iconsContainer.style.padding = '0.25rem 0.5rem';
        } else if (viewportWidth <= 767) {
            // Large mobile
            iconsContainer.style.gap = '1.25rem';
            iconsContainer.style.padding = '0.25rem 0.5rem';
        } else if (viewportWidth <= 1023) {
            // Tablet
            iconsContainer.style.gap = '1.5rem';
            iconsContainer.style.padding = '0.375rem 0.75rem';
        } else if (viewportWidth <= 1919) {
            // Desktop
            iconsContainer.style.gap = '1.75rem';
            iconsContainer.style.padding = '0.5rem 1rem';
        } else {
            // Large desktop and ultra-wide
            iconsContainer.style.gap = '2rem';
            iconsContainer.style.padding = '0.625rem 1.25rem';
        }

        // Special handling for landscape mode on small screens
        if (isLandscape && viewportHeight <= 500) {
            iconsContainer.style.gap = '1rem';
            iconsContainer.style.padding = '0.25rem 0.75rem';
        }
    },

    // Ensure cross-device interactions - Requirements 8.4, 8.5
    ensureCrossDeviceInteractions() {
        const navIcons = document.querySelectorAll('.nav-icon');

        navIcons.forEach(icon => {
            // Ensure minimum touch target size - Requirement 8.5
            const rect = icon.getBoundingClientRect();
            if (rect.width < 44 || rect.height < 44) {
                icon.style.minWidth = '44px';
                icon.style.minHeight = '44px';
            }

            // Ensure proper focus management for keyboard navigation
            if (!icon.hasAttribute('tabindex')) {
                icon.setAttribute('tabindex', '0');
            }

            // Add ARIA attributes for screen readers
            if (!icon.hasAttribute('role')) {
                icon.setAttribute('role', 'button');
            }

            // Ensure proper keyboard interaction
            icon.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    icon.click();
                }
            });
        });
    },

    // Setup responsive event listeners
    setupResponsiveEventListeners() {
        // Media query listeners for device capability changes
        const hoverQuery = window.matchMedia('(hover: hover)');
        const pointerQuery = window.matchMedia('(pointer: fine)');

        hoverQuery.addListener((e) => {
            this.handleDeviceCapabilityChange();
        });

        pointerQuery.addListener((e) => {
            this.handleDeviceCapabilityChange();
        });

        // Viewport size change listener
        window.addEventListener('resize', this.utils.throttle(() => {
            this.handleResponsiveResize();
        }, 100));

        // Visual viewport change listener (for mobile keyboards)
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', () => {
                this.handleVisualViewportResize();
            });
        }
    },

    // Setup orientation monitoring
    setupOrientationMonitoring() {
        // Modern orientation API
        if (screen.orientation) {
            screen.orientation.addEventListener('change', () => {
                setTimeout(() => {
                    this.handleOrientationChange();
                }, 100); // Small delay to ensure viewport has updated
            });
        }

        // Fallback orientation change detection
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });
    },

    // Initialize touch gesture support - Requirement 8.4
    initializeTouchGestureSupport() {
        if (!this.state.deviceCapabilities.hasTouch) return;

        const navigation = document.querySelector('.floating-navigation');
        if (!navigation) return;

        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;

        navigation.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                touchStartTime = Date.now();
            }
        }, { passive: true });

        navigation.addEventListener('touchend', (e) => {
            if (e.changedTouches.length === 1) {
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;
                const touchEndTime = Date.now();

                const deltaX = touchEndX - touchStartX;
                const deltaY = touchEndY - touchStartY;
                const deltaTime = touchEndTime - touchStartTime;

                // Detect swipe gestures for navigation
                if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 100 && deltaTime < 300) {
                    this.handleNavigationSwipe(deltaX > 0 ? 'right' : 'left');
                }

                // Detect tap gestures
                if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 200) {
                    this.handleNavigationTap(e.changedTouches[0]);
                }
            }
        }, { passive: true });
    },

    // Handle device capability changes
    handleDeviceCapabilityChange() {
        // Re-detect capabilities
        this.initializeCrossDeviceCompatibility();

        // Update navigation interactions
        if (this.floatingNav) {
            this.floatingNav.detectDeviceCapabilities();
        }

        // Announce change to screen readers
        this.utils.announceToScreenReader('Device interaction mode updated');
    },

    // Handle responsive resize events
    handleResponsiveResize() {
        // Update device state
        this.detectMobile();
        this.detectTablet();

        // Enforce responsive requirements
        this.enforceResponsiveRequirements();

        // Update navigation layout
        if (this.floatingNav) {
            this.floatingNav.handleViewportChange();
        }

        // Update viewport-dependent elements
        this.updateViewportDependentElements();
    },

    // Handle visual viewport resize (mobile keyboard)
    handleVisualViewportResize() {
        const visualViewport = window.visualViewport;
        const heightDifference = window.innerHeight - visualViewport.height;

        // Keyboard is likely open if height difference is significant
        if (heightDifference > 150) {
            document.body.classList.add('keyboard-open');
            this.adjustLayoutForKeyboard(true);
        } else {
            document.body.classList.remove('keyboard-open');
            this.adjustLayoutForKeyboard(false);
        }
    },

    // Handle navigation swipe gestures - Requirement 8.4
    handleNavigationSwipe(direction) {
        const navIcons = document.querySelectorAll('.nav-icon');
        const activeIcon = document.querySelector('.nav-icon.active');
        const currentIndex = Array.from(navIcons).indexOf(activeIcon);

        let newIndex;
        if (direction === 'left') {
            // Swipe left - next item
            newIndex = currentIndex < navIcons.length - 1 ? currentIndex + 1 : 0;
        } else {
            // Swipe right - previous item
            newIndex = currentIndex > 0 ? currentIndex - 1 : navIcons.length - 1;
        }

        // Activate new navigation item
        if (navIcons[newIndex]) {
            navIcons[newIndex].click();
            this.utils.announceToScreenReader(`Swiped to ${navIcons[newIndex].getAttribute('aria-label')}`);
        }
    },

    // Handle navigation tap gestures - Requirement 8.4
    handleNavigationTap(touch) {
        // Add visual feedback for tap
        const ripple = document.createElement('div');
        ripple.className = 'touch-ripple';
        ripple.style.position = 'fixed';
        ripple.style.left = `${touch.clientX}px`;
        ripple.style.top = `${touch.clientY}px`;
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.transform = 'translate(-50%, -50%) scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '9999';

        document.body.appendChild(ripple);

        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    },

    // Detect tablet device
    detectTablet() {
        const width = window.innerWidth;
        this.state.isTablet = width > this.config.breakpoints.mobile && width <= this.config.breakpoints.tablet;
        document.body.classList.toggle('tablet', this.state.isTablet);
    },

    // Handle orientation change - Requirements 8.1, 8.2, 8.3
    handleOrientationChange() {
        const isLandscape = window.innerWidth > window.innerHeight;
        const wasLandscape = document.body.classList.contains('landscape');

        document.body.classList.toggle('landscape', isLandscape);
        document.body.classList.toggle('portrait', !isLandscape);

        if (isLandscape !== wasLandscape) {
            // Orientation changed, update layout
            setTimeout(() => {
                this.updateLayoutForOrientation(isLandscape);

                // Update navigation for orientation change
                if (this.floatingNav) {
                    this.floatingNav.handleOrientationChange(isLandscape);
                }
            }, 100); // Small delay to ensure viewport has updated
        }
    },

    // Update layout for orientation change
    updateLayoutForOrientation(isLandscape) {
        const sidebar = document.querySelector('.pill-sidebar');
        const heroSection = document.querySelector('.hero-section');

        if (isLandscape) {
            // Landscape mode adjustments
            if (sidebar) {
                sidebar.classList.add('landscape-mode');
            }
            if (heroSection) {
                heroSection.classList.add('landscape-mode');
            }
        } else {
            // Portrait mode adjustments
            if (sidebar) {
                sidebar.classList.remove('landscape-mode');
            }
            if (heroSection) {
                heroSection.classList.remove('landscape-mode');
            }
        }

        // Announce orientation change
        LeonPortfolio.utils.announceToScreenReader(
            `Orientation changed to ${isLandscape ? 'landscape' : 'portrait'} mode`
        );
    },

    // Update viewport-dependent elements
    updateViewportDependentElements() {
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        // Update CSS custom properties for viewport dimensions
        document.documentElement.style.setProperty('--viewport-height', `${viewportHeight}px`);
        document.documentElement.style.setProperty('--viewport-width', `${viewportWidth}px`);

        // Handle very small screens
        if (viewportHeight < 500) {
            document.body.classList.add('small-height');
        } else {
            document.body.classList.remove('small-height');
        }

        if (viewportWidth < 320) {
            document.body.classList.add('very-small-width');
        } else {
            document.body.classList.remove('very-small-width');
        }
    },

    // Recalculate positions for floating elements
    recalculateFloatingElements() {
        // Update floating navigation positions
        if (this.floatingNav && this.floatingNav.currentHaloId) {
            const activeItem = this.floatingNav.container.querySelector('.nav-item.active');
            if (activeItem) {
                setTimeout(() => {
                    this.floatingNav.materializeHalo(activeItem);
                }, 50);
            }
        }

        // Update any other floating elements
        this.updateFloatingElementPositions();
    },

    // Update floating element positions
    updateFloatingElementPositions() {
        // Update decorative shapes positions if they exist
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            // Recalculate positions based on new viewport
            const rect = shape.getBoundingClientRect();
            if (rect.right > window.innerWidth || rect.bottom > window.innerHeight) {
                // Element is outside viewport, reposition
                this.repositionDecorativeElement(shape, index);
            }
        });
    },

    // Reposition decorative element
    repositionDecorativeElement(element, index) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Calculate safe positions within viewport
        const maxX = viewportWidth - 100; // Account for element size
        const maxY = viewportHeight - 100;

        const x = Math.random() * maxX;
        const y = Math.random() * maxY;

        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
    },

    // Handle mobile state change
    onMobileStateChange() {
        console.log('Mobile state changed:', this.state.isMobile);

        // Update floating navigation for mobile
        if (this.floatingNav) {
            this.floatingNav.updateForMobile(this.state.isMobile);
        }

        // Update pill sidebar for mobile
        this.updatePillSidebarForMobile();

        // Update hero section for mobile
        this.updateHeroSectionForMobile();

        // Update animations for mobile
        this.updateAnimationsForMobile();

        // Announce state change to screen readers
        LeonPortfolio.utils.announceToScreenReader(
            this.state.isMobile ? 'Switched to mobile layout' : 'Switched to desktop layout'
        );
    },

    // Update pill sidebar for mobile layout
    updatePillSidebarForMobile() {
        const sidebar = document.querySelector('.pill-sidebar');
        if (!sidebar) return;

        if (this.state.isMobile) {
            sidebar.classList.add('mobile-layout');
            // Add touch-friendly interactions
            this.setupMobileSidebarInteractions(sidebar);
        } else {
            sidebar.classList.remove('mobile-layout');
            // Remove mobile-specific event listeners
            this.removeMobileSidebarInteractions(sidebar);
        }
    },

    // Update hero section for mobile layout
    updateHeroSectionForMobile() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        if (this.state.isMobile) {
            heroSection.classList.add('mobile-layout');
            // Adjust text sizing and spacing for mobile
            this.adjustHeroTextForMobile();
        } else {
            heroSection.classList.remove('mobile-layout');
            this.resetHeroTextForDesktop();
        }
    },

    // Update animations for mobile devices
    updateAnimationsForMobile() {
        if (this.state.isMobile) {
            // Reduce animation complexity on mobile for better performance
            document.body.classList.add('mobile-animations');
            this.config.animationDuration = Math.min(this.config.animationDuration, 200);
            this.config.staggerDelay = Math.min(this.config.staggerDelay, 50);
        } else {
            document.body.classList.remove('mobile-animations');
            // Restore full animation settings for desktop
            this.config.animationDuration = 300;
            this.config.staggerDelay = 100;
        }
    },

    // Setup mobile-specific sidebar interactions
    setupMobileSidebarInteractions(sidebar) {
        // Add touch event handlers for better mobile experience
        const socialLinks = sidebar.querySelectorAll('.social-icon-link');

        socialLinks.forEach(link => {
            // Add touch feedback
            link.addEventListener('touchstart', this.handleMobileTouchStart.bind(this), { passive: true });
            link.addEventListener('touchend', this.handleMobileTouchEnd.bind(this), { passive: true });
            link.addEventListener('touchcancel', this.handleMobileTouchCancel.bind(this), { passive: true });
        });

        // Add swipe gesture support for sidebar
        let touchStartX = 0;
        let touchStartY = 0;

        sidebar.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        sidebar.addEventListener('touchmove', (e) => {
            if (!touchStartX || !touchStartY) return;

            const touchEndX = e.touches[0].clientX;
            const touchEndY = e.touches[0].clientY;

            const deltaX = touchStartX - touchEndX;
            const deltaY = touchStartY - touchEndY;

            // Detect horizontal swipe
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                // Add visual feedback for swipe
                sidebar.classList.add('swiping');
            }
        }, { passive: true });

        sidebar.addEventListener('touchend', () => {
            sidebar.classList.remove('swiping');
            touchStartX = 0;
            touchStartY = 0;
        }, { passive: true });
    },

    // Remove mobile-specific sidebar interactions
    removeMobileSidebarInteractions(sidebar) {
        const socialLinks = sidebar.querySelectorAll('.social-icon-link');

        socialLinks.forEach(link => {
            // Clone and replace to remove all event listeners
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);
        });
    },

    // Handle mobile touch start
    handleMobileTouchStart(e) {
        const target = e.currentTarget;
        target.classList.add('touch-active');

        // Add haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
    },

    // Handle mobile touch end
    handleMobileTouchEnd(e) {
        const target = e.currentTarget;
        setTimeout(() => {
            target.classList.remove('touch-active');
        }, 150);
    },

    // Handle mobile touch cancel
    handleMobileTouchCancel(e) {
        const target = e.currentTarget;
        target.classList.remove('touch-active');
    },

    // Adjust hero text for mobile
    adjustHeroTextForMobile() {
        const nameElement = document.querySelector('.name');
        const roleElement = document.querySelector('.role');

        if (nameElement) {
            // Adjust font size based on text length and screen width
            const screenWidth = window.innerWidth;
            const textLength = nameElement.textContent.length;

            if (screenWidth < 400 && textLength > 10) {
                nameElement.style.fontSize = 'clamp(2rem, 8vw, 3rem)';
            }
        }

        if (roleElement) {
            const screenWidth = window.innerWidth;
            if (screenWidth < 400) {
                roleElement.style.fontSize = 'clamp(1rem, 4vw, 1.5rem)';
            }
        }
    },

    // Reset hero text for desktop
    resetHeroTextForDesktop() {
        const nameElement = document.querySelector('.name');
        const roleElement = document.querySelector('.role');

        if (nameElement) {
            nameElement.style.fontSize = '';
        }

        if (roleElement) {
            roleElement.style.fontSize = '';
        }
    },

    // Handle keyboard navigation
    handleKeyboardNavigation(e) {
        // Tab navigation and accessibility handling
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    },

    // Handle focus events
    handleFocusIn(e) {
        // Remove keyboard navigation class on mouse interaction
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        }, { once: true });
    }
};

// Utility functions
LeonPortfolio.utils = {
    // Debounce function for performance optimization
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for performance optimization
    throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Get element with error handling
    getElement(selector) {
        const element = document.querySelector(selector);
        if (!element) {
            console.warn(`Element not found: ${selector}`);
        }
        return element;
    },

    // Get elements with error handling
    getElements(selector) {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
            console.warn(`No elements found: ${selector}`);
        }
        return elements;
    },

    // Animate element with CSS classes
    animateElement(element, animationClass, duration = 300) {
        if (!LeonPortfolio.state.animationsEnabled || !element) return Promise.resolve();

        return new Promise((resolve) => {
            element.classList.add(animationClass);

            const handleAnimationEnd = () => {
                element.removeEventListener('animationend', handleAnimationEnd);
                resolve();
            };

            element.addEventListener('animationend', handleAnimationEnd);

            // Fallback timeout
            setTimeout(() => {
                element.removeEventListener('animationend', handleAnimationEnd);
                resolve();
            }, duration + 100);
        });
    },

    // Create element with attributes
    createElement(tag, attributes = {}, textContent = '') {
        const element = document.createElement(tag);

        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else {
                element.setAttribute(key, value);
            }
        });

        if (textContent) {
            element.textContent = textContent;
        }

        return element;
    },

    // Announce to screen readers
    announceToScreenReader(message, priority = 'polite') {
        const announcer = document.getElementById('sr-announcements');
        if (announcer) {
            announcer.setAttribute('aria-live', priority);
            announcer.textContent = message;

            // Clear after announcement
            setTimeout(() => {
                announcer.textContent = '';
            }, 1000);
        }
    }
};

// Animation utilities
LeonPortfolio.animations = {
    // Fade in up animation
    fadeInUp(element, delay = 0) {
        if (!LeonPortfolio.state.animationsEnabled || !element) return Promise.resolve();

        return new Promise((resolve) => {
            setTimeout(() => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = `opacity ${LeonPortfolio.config.animationDuration}ms ease, transform ${LeonPortfolio.config.animationDuration}ms ease`;

                // Trigger animation
                requestAnimationFrame(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                });

                setTimeout(resolve, LeonPortfolio.config.animationDuration);
            }, delay);
        });
    },

    // Slide in left animation
    slideInLeft(element, delay = 0) {
        if (!LeonPortfolio.state.animationsEnabled || !element) return Promise.resolve();

        return new Promise((resolve) => {
            setTimeout(() => {
                element.style.opacity = '0';
                element.style.transform = 'translateX(-50px)';
                element.style.transition = `opacity ${LeonPortfolio.config.animationDuration}ms ease, transform ${LeonPortfolio.config.animationDuration}ms ease`;

                // Trigger animation
                requestAnimationFrame(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0)';
                });

                setTimeout(resolve, LeonPortfolio.config.animationDuration);
            }, delay);
        });
    },

    // Staggered animations for multiple elements
    staggeredAnimation(elements, animationFunction, staggerDelay = 100) {
        const promises = [];

        elements.forEach((element, index) => {
            const delay = index * staggerDelay;
            promises.push(animationFunction(element, delay));
        });

        return Promise.all(promises);
    },

    // Enhanced fade in up with better performance
    fadeInUpEnhanced(element, delay = 0, duration = null) {
        if (!LeonPortfolio.state.animationsEnabled || !element) return Promise.resolve();

        const animationDuration = duration || LeonPortfolio.config.animationDuration;

        return new Promise((resolve) => {
            setTimeout(() => {
                // Use CSS classes for better performance when available
                if (element.classList.contains('hero-content') || element.closest('.hero-content')) {
                    element.style.animation = `fadeInUp ${animationDuration}ms ease forwards`;
                } else {
                    // Fallback to JavaScript animation
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(30px)';
                    element.style.transition = `opacity ${animationDuration}ms ease, transform ${animationDuration}ms ease`;

                    requestAnimationFrame(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    });
                }

                setTimeout(resolve, animationDuration);
            }, delay);
        });
    },

    // Enhanced slide in left with better performance
    slideInLeftEnhanced(element, delay = 0, duration = null) {
        if (!LeonPortfolio.state.animationsEnabled || !element) return Promise.resolve();

        const animationDuration = duration || LeonPortfolio.config.animationDuration;

        return new Promise((resolve) => {
            setTimeout(() => {
                // Use CSS classes for better performance when available
                if (element.classList.contains('pill-sidebar')) {
                    element.style.animation = `slideInLeft ${animationDuration}ms ease-out forwards`;
                } else {
                    // Fallback to JavaScript animation
                    element.style.opacity = '0';
                    element.style.transform = 'translateX(-50px)';
                    element.style.transition = `opacity ${animationDuration}ms ease, transform ${animationDuration}ms ease`;

                    requestAnimationFrame(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateX(0)';
                    });
                }

                setTimeout(resolve, animationDuration);
            }, delay);
        });
    },

    // Sequence multiple animations with delays
    sequenceAnimations(animationQueue) {
        return animationQueue.reduce((promise, { element, animation, delay = 0, duration }) => {
            return promise.then(() => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        animation(element, 0, duration).then(resolve);
                    }, delay);
                });
            });
        }, Promise.resolve());
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    LeonPortfolio.init();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LeonPortfolio;
}


// HaloAnimationSystem for advanced circular halo effects
LeonPortfolio.HaloAnimationSystem = class {
    constructor() {
        this.activeHalos = new Map();
        this.animationQueue = [];
        this.isProcessing = false;
        this.rafId = null;
        this.lastFrameTime = 0;

        // Performance optimization settings
        this.performanceSettings = {
            maxHalos: 3,
            animationDuration: LeonPortfolio.config.haloAnimationDuration,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            targetFPS: 60,
            frameTime: 1000 / 60, // 16.67ms for 60fps
            useTransform3d: true, // Enable hardware acceleration
            willChange: true // Use will-change CSS property
        };

        // Animation states
        this.animationStates = {
            IDLE: 'idle',
            MATERIALIZING: 'materializing',
            ACTIVE: 'active',
            DEMATERIALIZING: 'dematerializing'
        };

        this.init();
    }

    init() {
        console.log('Initializing HaloAnimationSystem...');

        // Create shared animation styles
        this.createAnimationStyles();

        // Set up performance monitoring
        this.setupPerformanceMonitoring();

        // Bind animation frame handler
        this.boundAnimationFrame = this.animationFrame.bind(this);

        console.log('HaloAnimationSystem initialized');
    }

    createAnimationStyles() {
        // Create CSS styles for halo animations if they don't exist
        const styleId = 'halo-animation-styles';
        if (document.getElementById(styleId)) return;

        const styles = `
            .nav-halo {
                position: absolute;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%);
                border: 1px solid rgba(255, 255, 255, 0.1);
                pointer-events: none;
                z-index: -1;
                transform-origin: center center;
                will-change: transform, opacity;
                backface-visibility: hidden;
                transform: translate3d(-50%, -50%, 0) scale(0);
                opacity: 0;
            }

            .nav-halo.materializing {
                animation: haloMaterialize var(--halo-duration, 200ms) var(--halo-easing, cubic-bezier(0.4, 0, 0.2, 1)) forwards;
            }

            .nav-halo.dematerializing {
                animation: haloDematerialize var(--halo-duration, 200ms) var(--halo-easing, cubic-bezier(0.4, 0, 0.2, 1)) forwards;
            }

            .nav-halo.pulsing {
                animation: haloPulse 2s ease-in-out infinite;
            }

            @keyframes haloMaterialize {
                0% {
                    transform: translate3d(-50%, -50%, 0) scale(0);
                    opacity: 0;
                }
                50% {
                    opacity: 0.8;
                }
                100% {
                    transform: translate3d(-50%, -50%, 0) scale(1);
                    opacity: 1;
                }
            }

            @keyframes haloDematerialize {
                0% {
                    transform: translate3d(-50%, -50%, 0) scale(1);
                    opacity: 1;
                }
                50% {
                    opacity: 0.3;
                }
                100% {
                    transform: translate3d(-50%, -50%, 0) scale(0);
                    opacity: 0;
                }
            }

            @keyframes haloPulse {
                0%, 100% {
                    transform: translate3d(-50%, -50%, 0) scale(1);
                    opacity: 1;
                }
                50% {
                    transform: translate3d(-50%, -50%, 0) scale(1.1);
                    opacity: 0.8;
                }
            }

            /* Reduced motion support */
            @media (prefers-reduced-motion: reduce) {
                .nav-halo {
                    animation: none !important;
                    transition: opacity 0.2s ease !important;
                }
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.id = styleId;
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    setupPerformanceMonitoring() {
        // Monitor frame rate and adjust quality if needed
        this.frameCount = 0;
        this.lastFPSCheck = performance.now();
        this.currentFPS = 60;

        // Check FPS every second
        setInterval(() => {
            this.checkFrameRate();
        }, 1000);
    }

    checkFrameRate() {
        const now = performance.now();
        const elapsed = now - this.lastFPSCheck;
        this.currentFPS = (this.frameCount * 1000) / elapsed;

        // Adjust quality based on performance
        if (this.currentFPS < 30) {
            this.performanceSettings.useTransform3d = false;
            console.warn('Low FPS detected, reducing animation quality');
        } else if (this.currentFPS > 55) {
            this.performanceSettings.useTransform3d = true;
        }

        this.frameCount = 0;
        this.lastFPSCheck = now;
    }

    createHalo(targetElement, options = {}) {
        if (!targetElement) return null;

        const haloId = this.generateHaloId();

        // Default options
        const config = {
            size: 40,
            color: 'rgba(255, 255, 255, 0.1)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            duration: this.performanceSettings.animationDuration,
            easing: this.performanceSettings.easing,
            pulse: false,
            ...options
        };

        // Create halo element
        const halo = document.createElement('div');
        halo.className = 'nav-halo';
        halo.id = haloId;
        halo.setAttribute('aria-hidden', 'true');

        // Set custom properties for animation
        halo.style.setProperty('--halo-duration', `${config.duration}ms`);
        halo.style.setProperty('--halo-easing', config.easing);
        halo.style.width = `${config.size}px`;
        halo.style.height = `${config.size}px`;

        // Apply custom colors if provided
        if (config.color !== 'rgba(255, 255, 255, 0.1)') {
            halo.style.background = `radial-gradient(circle, ${config.color} 0%, ${config.color.replace('0.1', '0.05')} 50%, transparent 100%)`;
        }
        if (config.borderColor !== 'rgba(255, 255, 255, 0.1)') {
            halo.style.borderColor = config.borderColor;
        }

        // Store halo data
        const haloData = {
            element: halo,
            targetElement,
            config,
            state: this.animationStates.IDLE,
            startTime: null,
            position: { x: 0, y: 0 }
        };

        this.activeHalos.set(haloId, haloData);

        // Add to DOM
        const container = targetElement.closest('.floating-navigation') || document.body;
        container.appendChild(halo);

        return haloId;
    }

    materializeHalo(haloId, targetPosition = null) {
        const haloData = this.activeHalos.get(haloId);
        if (!haloData) return false;

        // Calculate position
        const position = targetPosition || this.calculateHaloPosition(haloData.targetElement);
        haloData.position = position;

        // Position the halo
        this.positionHalo(haloData.element, position);

        // Start materialization animation
        haloData.state = this.animationStates.MATERIALIZING;
        haloData.startTime = performance.now();

        // Add animation class
        haloData.element.classList.remove('dematerializing');
        haloData.element.classList.add('materializing');

        // Queue animation update
        this.queueAnimation({
            type: 'materialize',
            haloId,
            startTime: haloData.startTime,
            duration: haloData.config.duration
        });

        // Start animation loop if not running
        if (!this.isProcessing) {
            this.startAnimationLoop();
        }

        return true;
    }

    dematerializeHalo(haloId) {
        const haloData = this.activeHalos.get(haloId);
        if (!haloData) return false;

        // Start dematerialization animation
        haloData.state = this.animationStates.DEMATERIALIZING;
        haloData.startTime = performance.now();

        // Add animation class
        haloData.element.classList.remove('materializing', 'pulsing');
        haloData.element.classList.add('dematerializing');

        // Queue animation update
        this.queueAnimation({
            type: 'dematerialize',
            haloId,
            startTime: haloData.startTime,
            duration: haloData.config.duration
        });

        return true;
    }

    updateHaloPosition(haloId, newPosition = null) {
        const haloData = this.activeHalos.get(haloId);
        if (!haloData) return false;

        const position = newPosition || this.calculateHaloPosition(haloData.targetElement);
        haloData.position = position;

        // Smooth position transition
        this.positionHalo(haloData.element, position, true);

        return true;
    }

    calculateHaloPosition(targetElement) {
        if (!targetElement) return { x: 0, y: 0 };

        const rect = targetElement.getBoundingClientRect();
        const container = targetElement.closest('.floating-navigation');
        const containerRect = container ? container.getBoundingClientRect() : { left: 0, top: 0 };

        return {
            x: rect.left - containerRect.left + (rect.width / 2),
            y: rect.top - containerRect.top + (rect.height / 2)
        };
    }

    positionHalo(haloElement, position, smooth = false) {
        if (!haloElement) return;

        const transform = this.performanceSettings.useTransform3d
            ? `translate3d(${position.x}px, ${position.y}px, 0)`
            : `translate(${position.x}px, ${position.y}px)`;

        if (smooth) {
            haloElement.style.transition = 'transform 0.2s ease';
        } else {
            haloElement.style.transition = '';
        }

        haloElement.style.left = '0';
        haloElement.style.top = '0';
        haloElement.style.transform = transform;
    }

    queueAnimation(animation) {
        this.animationQueue.push(animation);
    }

    startAnimationLoop() {
        if (this.isProcessing) return;

        this.isProcessing = true;
        this.lastFrameTime = performance.now();
        this.rafId = requestAnimationFrame(this.boundAnimationFrame);
    }

    stopAnimationLoop() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
        this.isProcessing = false;
    }

    animationFrame(currentTime) {
        // Calculate frame delta
        const deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;
        this.frameCount++;

        // Process animation queue
        this.processAnimationQueue(currentTime);

        // Continue loop if there are active animations
        if (this.animationQueue.length > 0 || this.hasActiveAnimations()) {
            this.rafId = requestAnimationFrame(this.boundAnimationFrame);
        } else {
            this.stopAnimationLoop();
        }
    }

    processAnimationQueue(currentTime) {
        this.animationQueue = this.animationQueue.filter(animation => {
            const elapsed = currentTime - animation.startTime;
            const progress = Math.min(elapsed / animation.duration, 1);

            // Update animation based on type
            switch (animation.type) {
                case 'materialize':
                    return this.updateMaterializeAnimation(animation, progress);
                case 'dematerialize':
                    return this.updateDematerializeAnimation(animation, progress);
                default:
                    return false;
            }
        });
    }

    updateMaterializeAnimation(animation, progress) {
        const haloData = this.activeHalos.get(animation.haloId);
        if (!haloData) return false;

        if (progress >= 1) {
            // Animation complete
            haloData.state = this.animationStates.ACTIVE;
            haloData.element.classList.remove('materializing');

            // Add pulse effect if configured
            if (haloData.config.pulse) {
                haloData.element.classList.add('pulsing');
            }

            return false; // Remove from queue
        }

        return true; // Keep in queue
    }

    updateDematerializeAnimation(animation, progress) {
        const haloData = this.activeHalos.get(animation.haloId);
        if (!haloData) return false;

        if (progress >= 1) {
            // Animation complete - remove halo
            this.removeHalo(animation.haloId);
            return false; // Remove from queue
        }

        return true; // Keep in queue
    }

    hasActiveAnimations() {
        return Array.from(this.activeHalos.values()).some(haloData =>
            haloData.state === this.animationStates.MATERIALIZING ||
            haloData.state === this.animationStates.DEMATERIALIZING
        );
    }

    removeHalo(haloId) {
        const haloData = this.activeHalos.get(haloId);
        if (!haloData) return false;

        // Remove from DOM
        if (haloData.element && haloData.element.parentNode) {
            haloData.element.parentNode.removeChild(haloData.element);
        }

        // Remove from active halos
        this.activeHalos.delete(haloId);

        return true;
    }

    generateHaloId() {
        return `halo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Public API methods
    createAndMaterializeHalo(targetElement, options = {}) {
        const haloId = this.createHalo(targetElement, options);
        if (haloId) {
            this.materializeHalo(haloId);
        }
        return haloId;
    }

    dematerializeAllHalos() {
        const haloIds = Array.from(this.activeHalos.keys());
        haloIds.forEach(haloId => this.dematerializeHalo(haloId));
    }

    getActiveHaloCount() {
        return this.activeHalos.size;
    }

    // Performance optimization methods
    optimizeForLowEnd() {
        this.performanceSettings.useTransform3d = false;
        this.performanceSettings.willChange = false;
        this.performanceSettings.animationDuration = Math.min(this.performanceSettings.animationDuration, 150);
    }

    optimizeForHighEnd() {
        this.performanceSettings.useTransform3d = true;
        this.performanceSettings.willChange = true;
        this.performanceSettings.animationDuration = LeonPortfolio.config.haloAnimationDuration;
    }

    // Cleanup method
    destroy() {
        // Stop animation loop
        this.stopAnimationLoop();

        // Remove all halos
        this.activeHalos.forEach((haloData, haloId) => {
            this.removeHalo(haloId);
        });

        // Clear collections
        this.activeHalos.clear();
        this.animationQueue = [];

        // Remove styles
        const styleElement = document.getElementById('halo-animation-styles');
        if (styleElement) {
            styleElement.remove();
        }

        console.log('HaloAnimationSystem destroyed');
    }
};

// Entrance Animations System
LeonPortfolio.EntranceAnimations = {
    // Initialize entrance animations
    init() {
        console.log('Initializing entrance animations...');

        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.startEntranceSequence());
        } else {
            this.startEntranceSequence();
        }
    },

    // Start the entrance animation sequence
    startEntranceSequence() {
        if (!LeonPortfolio.state.animationsEnabled) {
            this.showAllElements();
            return;
        }

        // Add loaded class to body to trigger CSS animations
        document.body.classList.add('loaded');

        // Start hero content animations
        this.animateHeroContent();

        // Start pill sidebar animation
        this.animatePillSidebar();

        // Start decorative elements animation
        this.animateDecorativeElements();

        // Start footer animation (when it comes into view)
        this.setupFooterAnimation();

        // Mark animations as complete after main sequence
        setTimeout(() => {
            document.body.classList.add('animations-complete');
        }, 2000);

        console.log('Entrance animation sequence started');
    },

    // Animate hero content elements with staggered delays
    animateHeroContent() {
        const heroElements = [
            { selector: '.greeting', delay: 200 },
            { selector: '.name', delay: 400 },
            { selector: '.role', delay: 600 },
            { selector: '.location-container', delay: 800 }
        ];

        // Create animation sequence
        const animationQueue = heroElements.map(({ selector, delay }) => {
            const element = document.querySelector(selector);
            return element ? {
                element,
                animation: LeonPortfolio.animations.fadeInUpEnhanced,
                delay,
                duration: 600
            } : null;
        }).filter(Boolean);

        // Execute staggered animations
        LeonPortfolio.animations.sequenceAnimations(animationQueue);
    },

    // Animate pill sidebar entrance
    animatePillSidebar() {
        const sidebar = document.querySelector('.pill-sidebar');
        if (sidebar) {
            setTimeout(() => {
                LeonPortfolio.animations.slideInLeftEnhanced(sidebar, 0, 800);
            }, 100);
        }
    },

    // Setup footer animation when it comes into view
    setupFooterAnimation() {
        const footer = document.querySelector('.footer');
        if (!footer) return;

        // Use Intersection Observer for footer animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    footer.classList.add('animate-in');
                    observer.unobserve(footer);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        observer.observe(footer);
    },

    // Show all elements immediately (for reduced motion)
    showAllElements() {
        const elements = document.querySelectorAll('.greeting, .name, .role, .location-container, .pill-sidebar');
        elements.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'none';
            element.style.animation = 'none';
        });

        const footer = document.querySelector('.footer');
        if (footer) {
            footer.classList.add('animate-in');
        }

        // Mark animations as complete
        document.body.classList.add('animations-complete');
    },

    // Add entrance animation for decorative elements
    animateDecorativeElements() {
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            setTimeout(() => {
                shape.style.opacity = '0.6';
                shape.style.animation = `float ${7 + index * 2}s ease-in-out infinite`;
            }, 1000 + index * 200);
        });

        // Animate code elements
        const codeElements = document.querySelectorAll('.code-element');
        codeElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '0.15';
                element.style.animation = `float-code ${8 + index}s ease-in-out infinite`;
            }, 1500 + index * 300);
        });
    },

    // Reset animations (useful for testing or re-triggering)
    resetAnimations() {
        const elements = document.querySelectorAll('.greeting, .name, .role, .location-container, .pill-sidebar');
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = '';
            element.style.animation = '';
        });

        const footer = document.querySelector('.footer');
        if (footer) {
            footer.classList.remove('animate-in');
        }

        document.body.classList.remove('loaded', 'animations-complete');
    }
};

// Page Load Effects System
LeonPortfolio.PageLoadEffects = {
    // Initialize page load effects
    init() {
        console.log('Initializing page load effects...');

        // Set initial states for animated elements
        this.setInitialStates();

        // Start entrance animations after a brief delay
        setTimeout(() => {
            LeonPortfolio.EntranceAnimations.init();
        }, 100);
    },

    // Set initial states for elements that will be animated
    setInitialStates() {
        if (!LeonPortfolio.state.animationsEnabled) return;

        // Hide hero content elements initially
        const heroElements = document.querySelectorAll('.greeting, .name, .role, .location-container');
        heroElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
        });

        // Hide pill sidebar initially
        const sidebar = document.querySelector('.pill-sidebar');
        if (sidebar) {
            sidebar.style.opacity = '0';
            sidebar.style.transform = 'translateX(-50px) translateY(-50%) scale(1.2)';
        }

        // Set footer initial state
        const footer = document.querySelector('.footer');
        if (footer) {
            footer.style.opacity = '0';
            footer.style.transform = 'translateY(20px)';
        }

        // Hide decorative elements initially
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach(shape => {
            shape.style.opacity = '0';
        });

        const codeElements = document.querySelectorAll('.code-element');
        codeElements.forEach(element => {
            element.style.opacity = '0';
        });
    }
};

// Initialize entrance animations system
LeonPortfolio.initializeEntranceAnimations = function () {
    // Initialize page load effects
    this.PageLoadEffects.init();
};

// Add responsive and mobile interaction styles
LeonPortfolio.addResponsiveStyles = function () {
    const styleId = 'responsive-mobile-styles';
    if (document.getElementById(styleId)) return;

    const styles = `
        /* Touch ripple animation */
        @keyframes ripple {
            0% {
                transform: translate(-50%, -50%) scale(0);
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -50%) scale(4);
                opacity: 0;
            }
        }

        /* Mobile layout adjustments */
        .mobile .floating-navigation {
            padding: 8px 12px;
        }

        .mobile .nav-item {
            padding: 12px;
            margin: 0 4px;
        }

        .mobile .pill-sidebar {
            width: 60px;
            padding: 12px 8px;
        }

        .mobile .social-icon {
            width: 20px;
            height: 20px;
        }

        /* Touch feedback */
        .touch-active {
            transform: scale(0.95);
            opacity: 0.8;
        }

        .mobile-nav-item.touch-active {
            background: rgba(255, 255, 255, 0.1);
        }

        /* Swiping feedback */
        .swiping {
            opacity: 0.7;
            transform: translateX(5px);
        }

        /* Landscape mode adjustments */
        .landscape .pill-sidebar {
            top: 50%;
            left: 20px;
        }

        .landscape .hero-section {
            padding-left: 100px;
        }

        /* Small height adjustments */
        .small-height .hero-section {
            padding-top: 20px;
            padding-bottom: 20px;
        }

        .small-height .name {
            font-size: 2.5rem;
        }

        .small-height .role {
            font-size: 1.2rem;
        }

        /* Very small width adjustments */
        .very-small-width .name {
            font-size: 2rem;
        }

        .very-small-width .role {
            font-size: 1rem;
        }

        .very-small-width .pill-sidebar {
            width: 50px;
        }

        /* Keyboard open adjustments */
        .keyboard-open .floating-navigation {
            transition: bottom 0.3s ease;
        }

        .keyboard-open .pill-sidebar {
            transition: transform 0.3s ease;
        }

        /* Slow connection adjustments */
        .slow-connection * {
            animation-duration: 0.1s !important;
            transition-duration: 0.1s !important;
        }

        /* Mobile animations */
        .mobile-animations .nav-halo {
            animation-duration: 0.15s !important;
        }

        .mobile-animations .hero-content > * {
            animation-duration: 0.2s !important;
        }

        /* Tablet adjustments */
        .tablet .floating-navigation {
            padding: 10px 16px;
        }

        .tablet .pill-sidebar {
            width: 70px;
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
            .touch-ripple {
                animation: none !important;
            }
            
            .swiping {
                transition: none !important;
            }
            
            .touch-active {
                transition: none !important;
            }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
            .mobile-nav-tooltip {
                background: black !important;
                border: 2px solid white !important;
            }
            
            .touch-ripple {
                background: white !important;
            }
        }
    `;

    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
};

// Initialize responsive styles when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    LeonPortfolio.addResponsiveStyles();
});
// Font Loading and Accessibility Enhancement System
LeonPortfolio.FontAccessibilitySystem = class {
    constructor() {
        this.fontsLoaded = false;
        this.fontLoadingTimeout = 3000; // 3 seconds timeout
        this.customFonts = [
            { family: 'Space Mono', element: '.greeting' },
            { family: 'Asimovian', element: '.name' },
            { family: 'Enriqueta', element: '.role' }
        ];
        this.accessibilityFeatures = {
            reducedMotion: false,
            highContrast: false,
            fontLoadingDisabled: false
        };

        this.init();
    }

    init() {
        console.log('Initializing Font Accessibility System...');

        // Check accessibility preferences
        this.checkAccessibilityPreferences();

        // Set up font loading detection
        this.setupFontLoadingDetection();

        // Set up accessibility event listeners
        this.setupAccessibilityListeners();

        // Enhance gradient text accessibility
        this.enhanceGradientTextAccessibility();

        console.log('Font Accessibility System initialized');
    }

    checkAccessibilityPreferences() {
        // Check for reduced motion preference
        this.accessibilityFeatures.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Check for high contrast preference
        this.accessibilityFeatures.highContrast = window.matchMedia('(prefers-contrast: high)').matches;

        // Apply accessibility classes
        if (this.accessibilityFeatures.reducedMotion) {
            document.body.classList.add('reduced-motion');
        }

        if (this.accessibilityFeatures.highContrast) {
            document.body.classList.add('high-contrast');
        }
    }

    setupFontLoadingDetection() {
        // Use Font Loading API if available
        if ('fonts' in document) {
            this.detectFontsWithAPI();
        } else {
            // Fallback detection method
            this.detectFontsWithFallback();
        }
    }

    async detectFontsWithAPI() {
        try {
            // Load custom fonts
            const fontPromises = this.customFonts.map(font => {
                return document.fonts.load(`400 16px "${font.family}"`);
            });

            // Set timeout for font loading
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Font loading timeout')), this.fontLoadingTimeout);
            });

            // Race between font loading and timeout
            await Promise.race([
                Promise.all(fontPromises),
                timeoutPromise
            ]);

            this.onFontsLoaded();
        } catch (error) {
            console.warn('Font loading failed or timed out:', error);
            this.onFontLoadingFailed();
        }
    }

    detectFontsWithFallback() {
        // Create test elements to detect font loading
        const testElements = this.customFonts.map(font => {
            const element = document.createElement('div');
            element.style.fontFamily = `"${font.family}", monospace`;
            element.style.fontSize = '16px';
            element.style.position = 'absolute';
            element.style.left = '-9999px';
            element.style.visibility = 'hidden';
            element.textContent = 'Font loading test';
            document.body.appendChild(element);
            return { element, font };
        });

        // Check if fonts have loaded by measuring text width
        let checkCount = 0;
        const maxChecks = 30; // 3 seconds with 100ms intervals

        const checkFonts = () => {
            checkCount++;

            const allLoaded = testElements.every(({ element, font }) => {
                const width = element.offsetWidth;
                // If width changed from initial measurement, font likely loaded
                return width > 0 && element.dataset.initialWidth !== width.toString();
            });

            if (allLoaded) {
                this.onFontsLoaded();
                // Clean up test elements
                testElements.forEach(({ element }) => {
                    document.body.removeChild(element);
                });
            } else if (checkCount >= maxChecks) {
                this.onFontLoadingFailed();
                // Clean up test elements
                testElements.forEach(({ element }) => {
                    document.body.removeChild(element);
                });
            } else {
                setTimeout(checkFonts, 100);
            }
        };

        // Store initial widths
        setTimeout(() => {
            testElements.forEach(({ element }) => {
                element.dataset.initialWidth = element.offsetWidth.toString();
            });
            checkFonts();
        }, 100);
    }

    onFontsLoaded() {
        console.log('Custom fonts loaded successfully');
        this.fontsLoaded = true;
        document.body.classList.add('fonts-loaded');
        document.body.classList.remove('font-loading-error');

        // Announce to screen readers
        LeonPortfolio.utils.announceToScreenReader('Custom fonts loaded successfully');
    }

    onFontLoadingFailed() {
        console.warn('Custom fonts failed to load, using fallback fonts');
        this.accessibilityFeatures.fontLoadingDisabled = true;
        document.body.classList.add('font-loading-error');
        document.body.classList.remove('fonts-loaded');

        // Apply fallback styling
        this.applyFallbackFonts();

        // Announce to screen readers
        LeonPortfolio.utils.announceToScreenReader('Using fallback fonts for better compatibility');
    }

    applyFallbackFonts() {
        this.customFonts.forEach(({ element }) => {
            const elements = document.querySelectorAll(element);
            elements.forEach(el => {
                el.classList.add('fallback-font');
            });
        });
    }

    setupAccessibilityListeners() {
        // Listen for changes in accessibility preferences
        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        reducedMotionQuery.addListener((e) => {
            this.accessibilityFeatures.reducedMotion = e.matches;
            document.body.classList.toggle('reduced-motion', e.matches);

            if (e.matches) {
                this.disableAnimations();
            } else {
                this.enableAnimations();
            }
        });

        const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
        highContrastQuery.addListener((e) => {
            this.accessibilityFeatures.highContrast = e.matches;
            document.body.classList.toggle('high-contrast', e.matches);

            if (e.matches) {
                this.enhanceContrast();
            } else {
                this.resetContrast();
            }
        });

        // Listen for forced-colors mode (Windows High Contrast)
        const forcedColorsQuery = window.matchMedia('(forced-colors: active)');
        forcedColorsQuery.addListener((e) => {
            if (e.matches) {
                this.handleForcedColors();
            }
        });
    }

    enhanceGradientTextAccessibility() {
        const gradientElements = document.querySelectorAll('.kenyan-gradient');

        gradientElements.forEach(element => {
            // Add aria-label if not present
            if (!element.hasAttribute('aria-label')) {
                const textContent = element.textContent.trim();
                element.setAttribute('aria-label', textContent);
            }

            // Ensure text is selectable
            element.style.userSelect = 'text';
            element.style.webkitUserSelect = 'text';

            // Add focus support
            if (!element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }

            // Add focus event listeners
            element.addEventListener('focus', () => {
                this.handleGradientTextFocus(element);
            });

            element.addEventListener('blur', () => {
                this.handleGradientTextBlur(element);
            });
        });
    }

    handleGradientTextFocus(element) {
        // Ensure text is readable when focused
        element.style.outline = '3px solid #CE1126';
        element.style.outlineOffset = '2px';
        element.style.background = 'none';
        element.style.color = '#CE1126';
        element.style.webkitTextFillColor = '#CE1126';

        // Announce to screen readers
        const text = element.getAttribute('aria-label') || element.textContent;
        LeonPortfolio.utils.announceToScreenReader(`Focused on: ${text}`);
    }

    handleGradientTextBlur(element) {
        // Restore gradient styling
        element.style.outline = '';
        element.style.outlineOffset = '';

        if (!this.accessibilityFeatures.highContrast) {
            element.style.background = '';
            element.style.color = '';
            element.style.webkitTextFillColor = '';
        }
    }

    disableAnimations() {
        // Disable all animations for motion sensitivity
        const style = document.createElement('style');
        style.id = 'reduced-motion-override';
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
            
            .greeting, .name, .role {
                animation: none !important;
                transition: none !important;
                transform: none !important;
            }
            
            .kenyan-gradient {
                animation: none !important;
                transition: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    enableAnimations() {
        // Remove reduced motion override
        const style = document.getElementById('reduced-motion-override');
        if (style) {
            style.remove();
        }
    }

    enhanceContrast() {
        // Apply high contrast styling
        const style = document.createElement('style');
        style.id = 'high-contrast-override';
        style.textContent = `
            .greeting, .name, .role {
                color: #000000 !important;
                text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.9) !important;
                font-weight: 600 !important;
            }
            
            .kenyan-gradient {
                color: #000000 !important;
                background: none !important;
                -webkit-text-fill-color: #000000 !important;
                text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8) !important;
            }
            
            .asimovian-regular, .space-mono-regular, .enriqueta-regular {
                font-weight: 600 !important;
                text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.9) !important;
            }
        `;
        document.head.appendChild(style);
    }

    resetContrast() {
        // Remove high contrast override
        const style = document.getElementById('high-contrast-override');
        if (style) {
            style.remove();
        }
    }

    handleForcedColors() {
        // Handle Windows High Contrast mode
        document.body.classList.add('forced-colors');

        // Disable gradient effects in forced colors mode
        const gradientElements = document.querySelectorAll('.kenyan-gradient');
        gradientElements.forEach(element => {
            element.style.background = 'none';
            element.style.webkitTextFillColor = 'inherit';
            element.style.color = 'inherit';
        });
    }

    // Public method to check if fonts are loaded
    areFontsLoaded() {
        return this.fontsLoaded;
    }

    // Public method to get accessibility status
    getAccessibilityStatus() {
        return { ...this.accessibilityFeatures };
    }
};

// Initialize Font Accessibility System
LeonPortfolio.initializeFontAccessibility = function () {
    this.fontAccessibilitySystem = new this.FontAccessibilitySystem();
};

// Add to main initialization
const originalInit = LeonPortfolio.init;
LeonPortfolio.init = function () {
    originalInit.call(this);
    this.initializeFontAccessibility();
};