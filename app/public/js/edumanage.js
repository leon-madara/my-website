/**
 * EduManage Case Study - Minimal JS
 * Handles sticky nav highlighting and theme toggle
 */

document.addEventListener('DOMContentLoaded', function() {
    // ================================
    // Section Navigation Highlighting
    // ================================
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-item');

    if (sections.length > 0 && navItems.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navItems.forEach(item => {
                        item.classList.remove('active');
                        if (item.getAttribute('href') === `#${id}`) {
                            item.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));

        // Smooth scroll for nav links
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // ================================
    // Mobile Chapters Selector
    // ================================
    const chaptersButton = document.querySelector('.chapters-button');
    const chaptersModal = document.querySelector('.chapters-modal');
    const chaptersButtonText = document.querySelector('.chapters-button-text');
    const chaptersItems = document.querySelectorAll('.chapters-item');

    // Only initialize if mobile chapters elements exist
    if (chaptersButton && chaptersModal && chaptersButtonText) {
        // Function to update button text based on active section
        function updateChaptersButtonText() {
            if (!chaptersButtonText || !sections || sections.length === 0) return;
        
        // Find the active section using Intersection Observer logic
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        };

        const buttonObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const matchingItem = Array.from(chaptersItems).find(item => 
                        item.getAttribute('href') === `#${id}`
                    );
                    if (matchingItem) {
                        const chapterName = matchingItem.getAttribute('data-chapter');
                        chaptersButtonText.textContent = chapterName;
                        
                        // Update active state in modal
                        chaptersItems.forEach(item => {
                            item.classList.remove('active');
                            if (item === matchingItem) {
                                item.classList.add('active');
                            }
                        });
                    }
                }
            });
        }, observerOptions);

            sections.forEach(section => buttonObserver.observe(section));
        }

        // Toggle modal
        function toggleChaptersModal() {
            if (!chaptersButton || !chaptersModal) return;
            
            const isOpen = chaptersModal.classList.contains('open');
            
            if (isOpen) {
                closeChaptersModal();
            } else {
                openChaptersModal();
            }
        }

        function openChaptersModal() {
            if (!chaptersButton || !chaptersModal) return;
            
            chaptersModal.classList.add('open');
            chaptersButton.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
            
            // Focus first chapter item for accessibility
            if (chaptersItems.length > 0) {
                chaptersItems[0].focus();
            }
        }

        function closeChaptersModal() {
            if (!chaptersButton || !chaptersModal) return;
            
            chaptersModal.classList.remove('open');
            chaptersButton.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            
            // Return focus to button
            chaptersButton.focus();
        }

        // Initialize button text on load
        updateChaptersButtonText();
        
        // Button click handler
        chaptersButton.addEventListener('click', toggleChaptersModal);
        
        // Close on backdrop click
        chaptersModal.addEventListener('click', function(e) {
            if (e.target === chaptersModal) {
                closeChaptersModal();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && chaptersModal.classList.contains('open')) {
                closeChaptersModal();
            }
        });
        
        // Chapter item click handlers
        chaptersItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Update button text immediately
                    const chapterName = this.getAttribute('data-chapter');
                    chaptersButtonText.textContent = chapterName;
                    
                    // Update active state
                    chaptersItems.forEach(i => i.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Close modal
                    closeChaptersModal();
                    
                    // Smooth scroll to section
                    setTimeout(() => {
                        targetSection.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                }
            });
        });
    }

    // ================================
    // Sticky Chapters Button
    // ================================
    const chaptersSelector = document.querySelector('.chapters-selector-mobile');
    const heroSection = document.querySelector('.hero');
    
    if (chaptersSelector && heroSection) {
        const backNavHeight = 69; // Height of back-nav from DOM info
        const stickyThreshold = backNavHeight + 3; // 72px total
        
        const stickyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
                    // Hero has scrolled past, make button sticky
                    chaptersSelector.classList.add('is-sticky');
                } else {
                    // Hero is visible, remove sticky
                    chaptersSelector.classList.remove('is-sticky');
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0
        });
        
        stickyObserver.observe(heroSection);
        
        // Handle window resize to recalculate
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Recalculate if needed
                if (chaptersSelector.classList.contains('is-sticky')) {
                    const heroRect = heroSection.getBoundingClientRect();
                    if (heroRect.top >= 0) {
                        chaptersSelector.classList.remove('is-sticky');
                    }
                }
            }, 100);
        });
    }

    // ================================
    // Chapter Progress Indicator
    // ================================
    const progressIndicator = document.querySelector('.chapter-progress-indicator');
    const progressFill = document.querySelector('.progress-fill');
    const chapterMarkers = document.querySelectorAll('.chapter-marker');
    const allSections = document.querySelectorAll('.section');
    
    if (progressIndicator && progressFill && chapterMarkers.length > 0) {
        // Map chapter IDs to markers
        const chapterMap = {
            'crisis': 0,
            'complexity': 1,
            'approach': 2,
            'architecture': 3,
            'results': 4,
            'learnings': 5
        };
        
        // Calculate section positions and update marker positions
        function updateMarkerPositions() {
            if (allSections.length === 0) return;
            
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const indicatorHeight = progressIndicator.offsetHeight;
            const indicatorTop = progressIndicator.getBoundingClientRect().top + window.scrollY;
            
            allSections.forEach((section, index) => {
                const sectionId = section.getAttribute('id');
                const markerIndex = chapterMap[sectionId];
                
                if (markerIndex !== undefined && chapterMarkers[markerIndex]) {
                    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
                    const sectionPosition = (sectionTop - indicatorTop) / indicatorHeight;
                    const percentage = Math.max(0, Math.min(100, sectionPosition * 100));
                    
                    chapterMarkers[markerIndex].style.top = `${percentage}%`;
                }
            });
        }
        
        // Update progress fill based on scroll position
        function updateProgressFill() {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollableHeight = documentHeight - windowHeight;
            const scrollPercentage = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
            
            progressFill.style.height = `${Math.min(100, Math.max(0, scrollPercentage))}%`;
        }
        
        // Update active marker based on current section
        function updateActiveMarker() {
            const scrollPosition = window.scrollY + window.innerHeight * 0.3;
            
            allSections.forEach((section, index) => {
                const sectionId = section.getAttribute('id');
                const markerIndex = chapterMap[sectionId];
                
                if (markerIndex !== undefined && chapterMarkers[markerIndex]) {
                    const sectionTop = section.offsetTop;
                    const sectionBottom = sectionTop + section.offsetHeight;
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                        chapterMarkers.forEach(m => m.classList.remove('active'));
                        chapterMarkers[markerIndex].classList.add('active');
                        chapterMarkers[markerIndex].setAttribute('aria-current', 'true');
                    } else {
                        chapterMarkers[markerIndex].removeAttribute('aria-current');
                    }
                }
            });
        }
        
        // Marker click handlers
        chapterMarkers.forEach(marker => {
            marker.addEventListener('click', function() {
                const chapterId = this.getAttribute('data-chapter');
                const targetSection = document.getElementById(chapterId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
        
        // Throttled scroll handler
        let scrollTimeout;
        function handleScroll() {
            updateProgressFill();
            updateActiveMarker();
        }
        
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = requestAnimationFrame(handleScroll);
        }, { passive: true });
        
        // Initial setup
        updateMarkerPositions();
        updateProgressFill();
        updateActiveMarker();
        
        // Update on resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                updateMarkerPositions();
                updateProgressFill();
            }, 100);
        });
        
        // Sync with existing section observer for active states
        if (allSections.length > 0) {
            const existingObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        const markerIndex = chapterMap[id];
                        
                        if (markerIndex !== undefined && chapterMarkers[markerIndex]) {
                            chapterMarkers.forEach(m => {
                                m.classList.remove('active');
                                m.removeAttribute('aria-current');
                            });
                            chapterMarkers[markerIndex].classList.add('active');
                            chapterMarkers[markerIndex].setAttribute('aria-current', 'true');
                        }
                    }
                });
            }, {
                root: null,
                rootMargin: '-20% 0px -60% 0px',
                threshold: 0
            });
            
            allSections.forEach(section => existingObserver.observe(section));
        }
    }

    // ================================
    // Theme Toggle
    // ================================
    const themeToggle = document.querySelector('.theme-toggle');
    const root = document.documentElement;

    // Check for saved preference or system preference
    function getPreferredTheme() {
        const saved = localStorage.getItem('edumanage-theme');
        if (saved) return saved;
        
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    // Apply theme
    function setTheme(theme) {
        if (theme === 'light') {
            root.setAttribute('data-theme', 'light');
        } else {
            root.removeAttribute('data-theme');
        }
        localStorage.setItem('edumanage-theme', theme);
    }

    // Initialize theme
    setTheme(getPreferredTheme());

    // Toggle handler
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = root.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
        if (!localStorage.getItem('edumanage-theme')) {
            setTheme(e.matches ? 'light' : 'dark');
        }
    });

    // Add loaded class
    document.body.classList.add('loaded');

    // ================================
    // Scroll-Triggered Animations
    // ================================
    const animateOnScroll = () => {
        const observerOptions = {
            root: null,
            rootMargin: '-10% 0px -10% 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe section titles
        const sectionTitles = document.querySelectorAll('.section-title');
        sectionTitles.forEach(title => {
            observer.observe(title);
        });

        // Observe stat cards with stagger
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(card);
        });

        // Observe result cards with stagger
        const resultCards = document.querySelectorAll('.result-card');
        resultCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
            observer.observe(card);
        });

        // Observe decision cards
        const decisionCards = document.querySelectorAll('.decision-card');
        decisionCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.15}s`;
            observer.observe(card);
        });

        // Observe learning items
        const learningItems = document.querySelectorAll('.learning-item');
        learningItems.forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.2}s`;
            observer.observe(item);
        });

        // Observe diagrams
        const diagrams = document.querySelectorAll('.diagram');
        diagrams.forEach(diagram => {
            observer.observe(diagram);
        });
    };

    // Initialize scroll animations
    animateOnScroll();

    // ================================
    // Number Counter Animation
    // ================================
    
    /**
     * Parse result value string to extract numeric value, prefix, and suffix
     * @param {string} valueString - The value string (e.g., "45 sec", "100%", "<1%")
     * @returns {Object} - { prefix: string, value: number, suffix: string }
     */
    function parseResultValue(valueString) {
        // Handle HTML entities
        const decoded = valueString.replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
        
        let prefix = '';
        let suffix = '';
        let numericValue = 0;
        
        // Check for prefix (like "<")
        if (decoded.startsWith('<')) {
            prefix = '<';
            const remaining = decoded.substring(1);
            // Extract number and suffix
            const match = remaining.match(/^(\d+(?:\.\d+)?)(.*)$/);
            if (match) {
                numericValue = parseFloat(match[1]);
                suffix = match[2].trim();
            }
        } else {
            // Extract number and suffix
            const match = decoded.match(/^(\d+(?:\.\d+)?)(.*)$/);
            if (match) {
                numericValue = parseFloat(match[1]);
                suffix = match[2].trim();
            }
        }
        
        return {
            prefix: prefix,
            value: numericValue,
            suffix: suffix
        };
    }

    /**
     * Easing function for smooth animation (ease-out cubic)
     * @param {number} t - Progress from 0 to 1
     * @returns {number} - Eased progress
     */
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    /**
     * Animate counter from start to target value
     * @param {HTMLElement} element - The element to update
     * @param {number} targetValue - Target numeric value
     * @param {number} duration - Animation duration in milliseconds
     * @param {string} prefix - Prefix string (e.g., "<")
     * @param {string} suffix - Suffix string (e.g., " sec", "%")
     */
    function animateCounter(element, targetValue, duration, prefix, suffix) {
        const startValue = 0;
        const startTime = performance.now();
        let animationFrameId = null;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutCubic(progress);
            
            const currentValue = Math.round(startValue + (targetValue - startValue) * easedProgress);
            element.textContent = prefix + currentValue + suffix;
            
            if (progress < 1) {
                animationFrameId = requestAnimationFrame(update);
            } else {
                // Ensure final value is exact
                element.textContent = prefix + targetValue + suffix;
            }
        }

        animationFrameId = requestAnimationFrame(update);
        
        // Return function to cancel animation if needed
        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }

    /**
     * Initialize result value counters
     */
    function initializeResultCounters() {
        const resultValues = document.querySelectorAll('.result-value');
        const resultCards = document.querySelectorAll('.result-card');
        
        if (resultValues.length === 0) return;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        resultValues.forEach((element, index) => {
            const originalValue = element.textContent.trim();
            const parsed = parseResultValue(originalValue);
            
            // Store target values as data attributes
            element.setAttribute('data-target-value', parsed.value);
            element.setAttribute('data-prefix', parsed.prefix);
            element.setAttribute('data-suffix', parsed.suffix);
            element.setAttribute('data-original-value', originalValue);
            
            // Initialize display to 0 with appropriate suffix
            if (parsed.prefix === '<') {
                // For "<1%", show "<0%" initially
                element.textContent = '<0' + parsed.suffix;
            } else {
                element.textContent = '0' + parsed.suffix;
            }
        });

        // Set up Intersection Observer for results section
        const resultsSection = document.getElementById('results');
        if (!resultsSection) return;

        let hasAnimated = false;

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2 // Trigger when 20% visible
        };

        const resultsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    
                    if (prefersReducedMotion) {
                        // Show final values immediately without animation
                        resultValues.forEach(element => {
                            const originalValue = element.getAttribute('data-original-value');
                            element.textContent = originalValue;
                        });
                    } else {
                        // Animate counters with stagger
                        resultValues.forEach((element, index) => {
                            const targetValue = parseFloat(element.getAttribute('data-target-value'));
                            const prefix = element.getAttribute('data-prefix');
                            const suffix = element.getAttribute('data-suffix');
                            const duration = 1800; // 1.8 seconds
                            const delay = index * 120; // 120ms stagger between cards
                            
                            setTimeout(() => {
                                animateCounter(element, targetValue, duration, prefix, suffix);
                            }, delay);
                        });
                    }
                    
                    // Unobserve after animation starts
                    resultsObserver.unobserve(resultsSection);
                }
            });
        }, observerOptions);

        resultsObserver.observe(resultsSection);
    }

    // Initialize result counters
    initializeResultCounters();

    // ================================
    // Hero Title Split Text Animation
    // ================================
    
    /**
     * Split text into individual character spans
     * @param {HTMLElement} element - The element containing text to split
     */
    function splitTextIntoChars(element) {
        const text = element.textContent.trim();
        const chars = text.split('');
        
        element.innerHTML = chars.map((char, index) => {
            if (char === ' ') {
                return '<span class="char-space"> </span>';
            }
            return `<span class="char" data-char-index="${index}">${char}</span>`;
        }).join('');
    }

    /**
     * Initialize hero title animation
     */
    function initHeroTitleAnimation() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Split text into characters
        splitTextIntoChars(heroTitle);

        // Check if GSAP is available
        if (typeof gsap === 'undefined') {
            // Fallback: simple fade-in
            heroTitle.style.opacity = '0';
            setTimeout(() => {
                heroTitle.style.transition = 'opacity 0.6s ease';
                heroTitle.style.opacity = '1';
            }, 200);
            return;
        }

        if (prefersReducedMotion) {
            // Show immediately without animation
            gsap.set(heroTitle.querySelectorAll('.char'), {
                opacity: 1,
                y: 0
            });
            return;
        }

        // Set initial state for characters
        gsap.set(heroTitle.querySelectorAll('.char'), {
            opacity: 0,
            y: 20
        });

        // Create animation timeline
        gsap.timeline({ delay: 0.3 })
            .to(heroTitle.querySelectorAll('.char'), {
                opacity: 1,
                y: 0,
                duration: 0.7,
                stagger: 0.04,
                ease: "power2.out"
            });
    }

    // Initialize hero title animation
    initHeroTitleAnimation();
});
