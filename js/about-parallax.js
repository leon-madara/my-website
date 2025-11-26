/**
 * About Page - Parallax Scroll Animation
 * Leon Madara Portfolio
 * Using GSAP ScrollTrigger for smooth, performant animations
 */

// Wait for DOM and GSAP to load
document.addEventListener('DOMContentLoaded', () => {
    console.log('========================================');
    console.log('🎬 ANIMATION INITIALIZATION STARTED');
    console.log('========================================');
    console.log('Timestamp:', new Date().toISOString());
    console.log('User Agent:', navigator.userAgent);
    console.log('Viewport:', `${window.innerWidth}x${window.innerHeight}`);
    console.log('About page loaded, initializing parallax...');

    // Check if GSAP and ScrollTrigger are available
    console.log('Checking GSAP library availability...');
    if (typeof gsap === 'undefined') {
        console.error('❌ GSAP library failed to load from CDN. Activating fallback mode.');
        console.error('Context: GSAP library not found in global scope');
        console.log('Fallback mode: All content will be displayed immediately without animations.');
        activateFallbackMode('GSAP library not loaded');
        return;
    }
    console.log('✓ GSAP library loaded successfully');
    console.log('GSAP version:', gsap.version);

    console.log('Checking ScrollTrigger plugin availability...');
    if (typeof ScrollTrigger === 'undefined') {
        console.error('❌ ScrollTrigger plugin failed to load from CDN. Activating fallback mode.');
        console.error('Context: ScrollTrigger plugin not found in global scope');
        console.log('Fallback mode: All content will be displayed immediately without animations.');
        activateFallbackMode('ScrollTrigger plugin not loaded');
        return;
    }
    console.log('✓ ScrollTrigger plugin loaded successfully');

    // Register ScrollTrigger plugin
    console.log('Registering ScrollTrigger plugin with GSAP...');
    try {
        gsap.registerPlugin(ScrollTrigger);
        console.log('✓ ScrollTrigger plugin registered successfully');
    } catch (error) {
        console.error('❌ Failed to register ScrollTrigger plugin:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        console.log('Activating fallback mode due to plugin registration failure.');
        activateFallbackMode('ScrollTrigger registration failed');
        return;
    }

    // Register additional GSAP plugins (SplitText, ScrambleText, TextPlugin)
    console.log('Registering additional GSAP plugins...');
    try {
        if (typeof TextPlugin !== 'undefined') {
            gsap.registerPlugin(TextPlugin);
            console.log('✓ TextPlugin registered successfully');
        } else {
            console.warn('⚠️ TextPlugin not found - some text animations may not work');
        }

        if (typeof ScrambleTextPlugin !== 'undefined') {
            gsap.registerPlugin(ScrambleTextPlugin);
            console.log('✓ ScrambleTextPlugin registered successfully');
        } else {
            console.warn('⚠️ ScrambleTextPlugin not found - scramble animations will be skipped');
        }

        if (typeof SplitText !== 'undefined') {
            console.log('✓ SplitText plugin loaded successfully');
        } else {
            console.warn('⚠️ SplitText not found - split text animations will be skipped');
        }
    } catch (error) {
        console.warn('⚠️ Error registering bonus plugins:', error);
        console.log('Continuing with basic animations only');
    }

    // Check for reduced motion preference
    console.log('Checking accessibility preferences...');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        console.log('⚠️ Reduced motion preference detected');
        console.log('Accessibility mode: Using simplified animations');
        fallbackNoAnimation();
        return;
    }
    console.log('✓ No reduced motion preference detected');

    // Initialize parallax animation with error handling
    console.log('Starting parallax hero initialization...');
    try {
        initParallaxHero();
    } catch (error) {
        console.error('❌ Error during parallax initialization:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        console.log('Activating fallback mode due to initialization error.');
        activateFallbackMode('Initialization error: ' + error.message);
    }
});

/**
 * Initialize Parallax Hero Animation
 */
function initParallaxHero() {

    // Get elements
    const heroContainer = document.getElementById('hero-container');
    const heroImageWrapper = document.querySelector('.hero-image-wrapper');
    const sectionTitle = document.getElementById('section-title');
    const sectionBody = document.getElementById('section-body');
    const whatIDoSection = document.getElementById('what-i-do-section');
    const expertiseItems = document.querySelectorAll('.expertise-item');

    // Get new section elements
    const skillsSection = document.getElementById('skills-section');
    const experienceSection = document.getElementById('experience-section');
    const educationSection = document.getElementById('education-section');
    const projectsSection = document.getElementById('projects-section');
    const certificationsSection = document.getElementById('certifications-section');

    // Validate elements exist with detailed error logging
    const requiredElements = {
        'hero-container': heroContainer,
        'hero-image-wrapper': heroImageWrapper,
        'section-title': sectionTitle,
        'section-body': sectionBody,
        'what-i-do-section': whatIDoSection
    };

    const missingElements = [];
    for (const [elementId, element] of Object.entries(requiredElements)) {
        if (!element) {
            missingElements.push(elementId);
            console.error(`Required element not found: #${elementId}`);
        }
    }

    if (missingElements.length > 0) {
        console.error(`❌ Parallax initialization failed. Missing ${missingElements.length} required element(s): ${missingElements.join(', ')}`);
        console.error('Context: DOM validation failed during initialization');
        activateFallbackMode(`Missing required DOM elements: ${missingElements.join(', ')}`);
        return;
    }

    console.log('✓ All required DOM elements found and validated');
    console.log('Element validation results:', {
        heroContainer: '✓',
        heroImageWrapper: heroImageWrapper ? '✓' : '✗',
        sectionTitle: '✓',
        sectionBody: '✓',
        whatIDoSection: '✓',
        expertiseItems: `✓ (${expertiseItems.length} cards)`,
        skillsSection: skillsSection ? '✓' : '✗',
        experienceSection: experienceSection ? '✓' : '✗',
        educationSection: educationSection ? '✓' : '✗',
        projectsSection: projectsSection ? '✓' : '✗',
        certificationsSection: certificationsSection ? '✓' : '✗'
    });
    console.log('Creating animation timeline...');

    // Detect mobile device
    const isMobile = window.innerWidth <= 768;
    console.log('Device detection:', {
        isMobile: isMobile,
        viewportWidth: window.innerWidth,
        breakpoint: '768px'
    });

    // Adjust animation parameters for mobile
    const scaleTarget = isMobile ? 0.4 : 0.5;
    const translateTarget = isMobile ? '-80vw' : '-90vw';
    const scrubSpeed = isMobile ? 0.5 : 1;
    
    console.log('Animation parameters configured:', {
        scaleTarget: scaleTarget,
        translateTarget: translateTarget,
        scrubSpeed: scrubSpeed,
        deviceType: isMobile ? 'mobile' : 'desktop'
    });

    // ========================================
    // CREATE MASTER TIMELINE
    // ========================================

    console.log('========================================');
    console.log('📊 CREATING MASTER TIMELINE');
    console.log('========================================');
    
    let masterTimeline;
    try {
        const scrollTriggerConfig = {
            trigger: '.parallax-hero',
            start: 'top top',       // When hero top hits viewport top (start of scroll)
            end: 'bottom top',      // End when hero bottom reaches viewport top
            scrub: scrubSpeed,      // Smooth scrubbing
            pin: false,             // Allow natural scrolling (no pinning)
            markers: false,         // Set to true for debugging
            invalidateOnRefresh: true, // Recalculate on resize

            // Callbacks for debugging
            onEnter: () => {
                console.log('🎯 ScrollTrigger Event: onEnter');
                console.log('Animation state: Parallax animation started');
                console.log('Scroll direction: Forward (entering trigger zone)');
            },
            onLeave: () => {
                console.log('🎯 ScrollTrigger Event: onLeave');
                console.log('Animation state: Parallax animation completed');
                console.log('Scroll direction: Forward (leaving trigger zone)');
            },
            onEnterBack: () => {
                console.log('🎯 ScrollTrigger Event: onEnterBack');
                console.log('Animation state: Scrolling back up');
                console.log('Scroll direction: Backward (re-entering trigger zone)');
            },
            onLeaveBack: () => {
                console.log('🎯 ScrollTrigger Event: onLeaveBack');
                console.log('Animation state: Back to hero');
                console.log('Scroll direction: Backward (leaving trigger zone)');
            },

            onUpdate: (self) => {
                // Optional: Log progress for debugging
                // Uncomment for detailed scroll progress tracking
                // console.log('Scroll progress:', (self.progress * 100).toFixed(1) + '%');
            }
        };
        
        console.log('ScrollTrigger configuration:', {
            trigger: '.parallax-hero',
            start: scrollTriggerConfig.start,
            end: scrollTriggerConfig.end,
            scrub: scrollTriggerConfig.scrub,
            pin: scrollTriggerConfig.pin,
            markers: scrollTriggerConfig.markers
        });
        
        masterTimeline = gsap.timeline({
            scrollTrigger: scrollTriggerConfig
        });
        
        console.log('✓ Master timeline created successfully');
        console.log('Timeline ID:', masterTimeline.data ? masterTimeline.data.id : 'N/A');
    } catch (error) {
        console.error('❌ Failed to create GSAP timeline:', error);
        console.error('Error context:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        throw new Error('Timeline creation failed: ' + error.message);
    }

    // ========================================
    // ANIMATION SEQUENCE (All simultaneous)
    // ========================================

    console.log('========================================');
    console.log('🎨 CREATING INITIAL LOAD ANIMATION');
    console.log('========================================');

    // ========================================
    // INITIAL PAGE LOAD ANIMATION
    // Sequence: Lion slides to 20vw + scales to 50% → ScrambleText "About Leon Madara"
    // ========================================

    const aboutTextContainer = document.getElementById('about-text-container');
    const aboutText = document.getElementById('about-text');
    const nameText = document.getElementById('name-text');
    const greenSection = document.getElementById('green-section');

    // Create initial load timeline (plays once on page load)
    const loadTimeline = gsap.timeline({
        onComplete: () => {
            console.log('✓ Initial load animation complete');
        }
    });

    // Step 1: Slide lion to 20vw and scale to 50%
    console.log('Step 1: Animating lion graphic to final position (image only)');
    loadTimeline.to(heroImageWrapper, {
        x: '-40vw',
        scale: 0.5,
        duration: 2.5,
        ease: 'power2.inOut',
        onStart: () => {
            console.log('▶️ Lion image sliding to 10vw (from center) and scaling to 50%');
        },
        onComplete: () => {
            console.log('✓ Lion image positioned at 10vw, scale 50%');
        }
    });

    // Fade in green section (0vw to 20vw) as lion moves
    if (greenSection) {
        console.log('Step 1b: Fading in green section from 0vw to 20vw');
        loadTimeline.to(greenSection, {
            opacity: 1,
            duration: 2.5,
            ease: 'power2.inOut',
            onStart: () => {
                console.log('▶️ Green section fading in (0vw to 20vw)');
            },
            onComplete: () => {
                console.log('✓ Green section fully visible');
            }
        }, '<'); // '<' makes it start at the same time as the previous animation
    } else {
        console.warn('⚠️ Green section element not found - skipping fade-in animation');
    }

    loadTimeline.addLabel('lion-positioned');

    // Step 2: Reveal hero text container after lion finishes moving
    loadTimeline.fromTo(aboutTextContainer, {
        opacity: 0,
        scale: 0.9
    }, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
        onStart: () => {
            console.log('▶️ Hero text container fading in at center');
        },
        onComplete: () => {
            console.log('✓ Hero text container visible – ready for ScrambleText');
        }
    }, 'lion-positioned+=0.1');

    // Step 3: ScrambleText for "About" and "Leon Madara"
    if (typeof ScrambleTextPlugin !== 'undefined' && aboutText && nameText) {
        console.log('Step 3: Applying ScrambleText to About and Leon Madara');

        // Scramble "About" text
        loadTimeline.from(aboutText, {
            duration: 1,
            scrambleText: {
                text: "About",
                chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                revealDelay: 0.2,
                speed: 0.4,
                delimiter: ""
            }
        }, '>-0.1');

        // Scramble "Leon Madara" text
        loadTimeline.from(nameText, {
            duration: 1.5,
            scrambleText: {
                text: "Leon Madara",
                chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                revealDelay: 0.3,
                speed: 0.3,
                delimiter: ""
            }
        }, '>-0.4');

        // Animate red underline from left to right after scramble completes
        const nameUnderline = document.getElementById('name-underline');
        if (nameUnderline) {
            console.log('✓ Name underline element found, adding animation');
            loadTimeline.to(nameUnderline, {
                scaleX: 1,
                duration: 0.8,
                ease: 'power2.out'
            }, '>-0.2');
        } else {
            console.warn('⚠️ Name underline element not found');
        }

        console.log('✓ ScrambleText configured for hero text');
    } else {
        console.warn('⚠️ ScrambleText not available - using fade in fallback');
        // Fallback: simple fade in
        loadTimeline.to(aboutTextContainer, {
            opacity: 1,
            duration: 1
        }, 'lion-positioned+=0.1');
    }

    console.log('========================================');
    console.log('🎨 CREATING SCROLL ANIMATION');
    console.log('========================================');

    // ========================================
    // SCROLL ANIMATION: Disintegrate text, keep lion in place
    // ========================================

    try {
        console.log('Configuring scroll animation: Text disintegration');

        // Disintegrate "About Leon Madara" text on scroll
        masterTimeline.to(aboutTextContainer, {
            opacity: 0,
            scale: 0.8,
            y: -50,
            filter: 'blur(10px)',
            duration: 0.6,
            ease: 'power2.in',
            onStart: () => {
                console.log('▶️ Text disintegrating on scroll');
            },
            onComplete: () => {
                console.log('✓ Text disintegration complete');
            }
        }, 0);

        // Lion stays in position (no animation on scroll)
        console.log('Lion remains at 20vw position during scroll');

        // 2. Section Container: Fade in during hero animation
        console.log('Adding animation 2/5: Section container fade');
        console.log('  - Target: #what-i-do-section');
        console.log('  - Properties: opacity');
        console.log('  - From: opacity(0)');
        console.log('  - To: opacity(1)');
        console.log('  - Timeline position: 0.3 (starts early)');
        
        masterTimeline.fromTo(whatIDoSection,
            {
                opacity: 0
            },
            {
                opacity: 1,
                duration: 0.6,
                ease: 'power2.out'
            },
            0.3 // Start early in the animation
        );

        // 3. Section Title: Fade in from back
        console.log('Adding animation 3/5: Section title reveal');
        console.log('  - Target: #section-title');
        console.log('  - Properties: opacity, scale, y');
        console.log('  - From: opacity(0), scale(0.9), y(-30)');
        console.log('  - To: opacity(1), scale(1), y(0)');
        console.log('  - Timeline position: 0.5 (starts halfway through)');
        
        masterTimeline.fromTo(sectionTitle,
            {
                opacity: 0,
                scale: 0.9,
                y: -30
            },
            {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
                onStart: () => {
                    console.log('▶️ Animation started: Title fading in');
                },
                onComplete: () => {
                    console.log('✓ Animation complete: Section title reveal');
                }
            },
            0.5 // Start halfway through the animation
        );

        // 4. Section Body: Slide up from below
        console.log('Adding animation 4/5: Section body reveal');
        console.log('  - Target: #section-body');
        console.log('  - Properties: opacity, y');
        console.log('  - From: opacity(0), y(50)');
        console.log('  - To: opacity(1), y(0)');
        console.log('  - Timeline position: 0.6 (slightly delayed)');
        
        masterTimeline.fromTo(sectionBody,
            {
                opacity: 0,
                y: 50
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
                onStart: () => {
                    console.log('▶️ Animation started: Body sliding up');
                },
                onComplete: () => {
                    console.log('✓ Animation complete: Section body reveal');
                }
            },
            0.6 // Start slightly after title
        );

        // ========================================
        // EXPERTISE CARDS: Stagger animation
        // ========================================
        if (expertiseItems.length > 0) {
            console.log('Adding animation 5/5: Expertise cards stagger');
            console.log('  - Target: .expertise-item (count: ' + expertiseItems.length + ')');
            console.log('  - Properties: opacity, y');
            console.log('  - From: opacity(0), y(30)');
            console.log('  - To: opacity(1), y(0)');
            console.log('  - Stagger: 0.15s between cards');
            console.log('  - Timeline position: 0.7 (delayed start)');
            
            masterTimeline.fromTo(expertiseItems,
                {
                    opacity: 0,
                    y: 30
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.15,      // 0.15s delay between each card
                    ease: 'power2.out',
                    onComplete: () => {
                        console.log('✓ Animation complete: All ' + expertiseItems.length + ' expertise cards animated');
                    }
                },
                0.7 // Start later in the timeline
            );
        } else {
            console.warn('⚠️ No expertise cards found - skipping card animations');
        }

        console.log('========================================');
        console.log('✅ ANIMATION INITIALIZATION COMPLETE');
        console.log('========================================');
        console.log('Total animations added: 5');
        console.log('Timeline duration:', masterTimeline.duration() + 's');
        console.log('Active ScrollTriggers:', ScrollTrigger.getAll().length);
        console.log('Animation state: Ready and waiting for scroll');
        console.log('========================================');
    } catch (error) {
        console.error('❌ Error adding animations to timeline:', error);
        console.error('Error context:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        throw new Error('Animation sequence failed: ' + error.message);
    }

    // ========================================
    // NEW SECTIONS: Scroll Animations
    // ========================================

    console.log('========================================');
    console.log('🎨 ADDING NEW SECTION ANIMATIONS');
    console.log('========================================');

    // ========================================
    // PHASE 2: Helper Function for SplitText Masks on Section Titles
    // ========================================
    function applySplitTextMask(titleElement, sectionName) {
        if (!titleElement || typeof SplitText === 'undefined') {
            console.warn(`⚠️ SplitText mask skipped for ${sectionName}: SplitText or element not found`);
            return null;
        }

        try {
            console.log(`🎯 PHASE 2: Applying SplitText mask to ${sectionName} title`);

            // Split text into words and chars with masking
            const split = new SplitText(titleElement, {
                type: "words,chars",
                wordsClass: "word",
                charsClass: "char-masked"
            });

            // Set initial state - characters masked (hidden)
            gsap.set(split.chars, {
                yPercent: 100,
                opacity: 0
            });

            console.log(`✓ SplitText mask applied to ${sectionName}:`, split.chars.length, 'characters');
            return split;

        } catch (error) {
            console.warn(`⚠️ SplitText mask failed for ${sectionName}:`, error);
            return null;
        }
    }

    // Skills Section Animation
    if (skillsSection) {
        const skillCategories = document.querySelectorAll('.skill-category');
        const skillTags = document.querySelectorAll('.skill-tag');
        const skillsTitle = skillsSection.querySelector('.section-title');
        console.log('Adding Skills section animation:', skillCategories.length, 'categories');
        console.log('Found skill tags for ScrambleText:', skillTags.length);

        // Apply SplitText mask to title
        const skillsTitleSplit = applySplitTextMask(skillsTitle, 'Skills');

        // Create timeline for Skills section
        const skillsTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: skillsSection,
                start: 'top 80%',
                end: 'top 30%',
                scrub: 0.5,
                markers: false
            }
        });

        // Animate title with SplitText mask reveal if available, otherwise use standard animation
        if (skillsTitleSplit) {
            skillsTimeline.to(skillsTitleSplit.chars, {
                yPercent: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.02,
                ease: 'power2.out'
            });
        } else {
            skillsTimeline.fromTo(skillsTitle,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
            );
        }

        // Animate skill categories
        skillsTimeline.fromTo(skillCategories,
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power2.out' },
            '-=0.5'
        );

        // ========================================
        // PHASE 1: ScrambleText on Skill Tags
        // ========================================
        if (typeof ScrambleTextPlugin !== 'undefined' && skillTags.length > 0) {
            console.log('🎯 PHASE 1: Applying ScrambleText to', skillTags.length, 'skill tags');

            skillTags.forEach((tag, index) => {
                const originalText = tag.textContent;

                // Create individual ScrollTrigger for each skill tag
                gsap.from(tag, {
                    duration: 1.5,
                    scrambleText: {
                        text: originalText,
                        chars: "01",
                        revealDelay: 0.3,
                        speed: 0.3,
                        delimiter: ""
                    },
                    scrollTrigger: {
                        trigger: tag,
                        start: "top 90%",
                        toggleActions: "play none none none",
                        markers: false,
                        onEnter: () => {
                            console.log(`ScrambleText triggered for tag ${index + 1}:`, originalText);
                        }
                    }
                });
            });

            console.log('✓ ScrambleText animations configured for all skill tags');
        } else {
            if (typeof ScrambleTextPlugin === 'undefined') {
                console.warn('⚠️ ScrambleText skipped: ScrambleTextPlugin not found');
            } else {
                console.warn('⚠️ ScrambleText skipped: No skill tags found');
            }
        }
    }

    // Experience Section Animation
    if (experienceSection) {
        const timelineItems = document.querySelectorAll('.timeline-item');
        const experienceTitle = experienceSection.querySelector('.section-title');
        console.log('Adding Experience section animation:', timelineItems.length, 'timeline items');

        // Apply SplitText mask to title
        const experienceTitleSplit = applySplitTextMask(experienceTitle, 'Experience');

        // Create timeline for Experience section
        const experienceTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: experienceSection,
                start: 'top 80%',
                end: 'top 20%',
                scrub: 0.5,
                markers: false
            }
        });

        // Animate title with SplitText mask or standard animation
        if (experienceTitleSplit) {
            experienceTimeline.to(experienceTitleSplit.chars, {
                yPercent: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.02,
                ease: 'power2.out'
            });
        } else {
            experienceTimeline.fromTo(experienceTitle,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
            );
        }

        // Animate timeline items
        experienceTimeline.fromTo(timelineItems,
            { opacity: 0, x: -60 },
            { opacity: 1, x: 0, duration: 1, stagger: 0.2, ease: 'power2.out' },
            '-=0.5'
        );
    }

    // Education Section Animation
    if (educationSection) {
        const educationItems = document.querySelectorAll('.education-item');
        const educationTitle = educationSection.querySelector('.section-title');
        console.log('Adding Education section animation:', educationItems.length, 'education items');

        // Apply SplitText mask to title
        const educationTitleSplit = applySplitTextMask(educationTitle, 'Education');

        // Create timeline for Education section
        const educationTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: educationSection,
                start: 'top 80%',
                end: 'top 30%',
                scrub: 0.5,
                markers: false
            }
        });

        // Animate title with SplitText mask or standard animation
        if (educationTitleSplit) {
            educationTimeline.to(educationTitleSplit.chars, {
                yPercent: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.02,
                ease: 'power2.out'
            });
        } else {
            educationTimeline.fromTo(educationTitle,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
            );
        }

        // Animate education items
        educationTimeline.fromTo(educationItems,
            { opacity: 0, scale: 0.85, y: 40 },
            { opacity: 1, scale: 1, y: 0, duration: 1, stagger: 0.15, ease: 'back.out(1.2)' },
            '-=0.5'
        );
    }

    // Projects Section Animation
    if (projectsSection) {
        const projectCards = document.querySelectorAll('.project-card');
        const projectsTitle = projectsSection.querySelector('.section-title');
        console.log('Adding Projects section animation:', projectCards.length, 'project cards');

        // Apply SplitText mask to title
        const projectsTitleSplit = applySplitTextMask(projectsTitle, 'Projects');

        // Create timeline for Projects section
        const projectsTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: projectsSection,
                start: 'top 80%',
                end: 'top 30%',
                scrub: 0.5,
                markers: false
            }
        });

        // Animate title with SplitText mask or standard animation
        if (projectsTitleSplit) {
            projectsTimeline.to(projectsTitleSplit.chars, {
                yPercent: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.02,
                ease: 'power2.out'
            });
        } else {
            projectsTimeline.fromTo(projectsTitle,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
            );
        }

        // Animate project cards
        projectsTimeline.fromTo(projectCards,
            { opacity: 0, y: 60, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 1, stagger: 0.15, ease: 'back.out(1.1)' },
            '-=0.5'
        );
    }

    // Certifications Section Animation
    if (certificationsSection) {
        const certCards = document.querySelectorAll('.certification-card');
        const certificationsTitle = certificationsSection.querySelector('.section-title');
        console.log('Adding Certifications section animation:', certCards.length, 'certification cards');

        // Apply SplitText mask to title
        const certificationsTitleSplit = applySplitTextMask(certificationsTitle, 'Certifications');

        // Create timeline for Certifications section
        const certificationsTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: certificationsSection,
                start: 'top 80%',
                end: 'top 30%',
                scrub: 0.5,
                markers: false
            }
        });

        // Animate title with SplitText mask or standard animation
        if (certificationsTitleSplit) {
            certificationsTimeline.to(certificationsTitleSplit.chars, {
                yPercent: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.02,
                ease: 'power2.out'
            });
        } else {
            certificationsTimeline.fromTo(certificationsTitle,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
            );
        }

        // Animate certification cards
        certificationsTimeline.fromTo(certCards,
            { opacity: 0, scale: 0.85, y: 40 },
            { opacity: 1, scale: 1, y: 0, duration: 1, stagger: 0.15, ease: 'back.out(1.2)' },
            '-=0.5'
        );
    }

    console.log('✅ All section animations configured');
    console.log('Total ScrollTriggers:', ScrollTrigger.getAll().length);

    // ========================================
    // RESPONSIVE: Refresh on resize
    // ========================================

    console.log('Setting up viewport resize handler...');
    console.log('Note: ScrollTrigger handles resize automatically with invalidateOnRefresh');
    
    // ScrollTrigger automatically handles resize events when invalidateOnRefresh is true
    // Manual refresh is only needed for custom logic or dynamic parameter changes
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        // Log resize event for debugging
        console.log('========================================');
        console.log('📐 VIEWPORT RESIZE DETECTED');
        console.log('========================================');
        console.log('Viewport dimensions:', {
            width: window.innerWidth,
            height: window.innerHeight,
            timestamp: new Date().toISOString()
        });

        // Clear previous timeout to debounce
        clearTimeout(resizeTimeout);
        console.log('Debounce timer reset - waiting 250ms...');
        
        // Debounced resize handler (250ms timeout)
        resizeTimeout = setTimeout(() => {
            console.log('Debounced resize handler executing...');
            
            // Detect if device type changed (mobile/desktop)
            const wasMobile = scaleTarget === 0.25;
            const isNowMobile = window.innerWidth <= 768;
            
            if (wasMobile !== isNowMobile) {
                console.log('⚠️ Device type changed:', {
                    from: wasMobile ? 'mobile' : 'desktop',
                    to: isNowMobile ? 'mobile' : 'desktop',
                    breakpoint: '768px',
                    currentWidth: window.innerWidth + 'px'
                });
                console.log('Note: ScrollTrigger will auto-refresh with invalidateOnRefresh: true');
            } else {
                console.log('Device type unchanged:', isNowMobile ? 'mobile' : 'desktop');
            }
            
            // Log active ScrollTrigger count
            const activeTriggers = ScrollTrigger.getAll();
            console.log('Active ScrollTriggers:', activeTriggers.length);
            
            // Log each trigger's configuration
            activeTriggers.forEach((trigger, index) => {
                console.log(`  Trigger ${index + 1}:`, {
                    element: trigger.trigger ? trigger.trigger.id : 'unknown',
                    start: trigger.vars.start,
                    end: trigger.vars.end,
                    scrub: trigger.vars.scrub
                });
            });
            
            console.log('Resize handling complete');
            console.log('========================================');
            
        }, 250); // 250ms debounce timeout
    });
    
    console.log('✓ Resize handler registered successfully');
}

/**
 * Activate Fallback Mode
 * Called when GSAP/ScrollTrigger fails to load or encounters errors
 * Ensures all content remains accessible without animations
 * 
 * @param {string} reason - The reason for activating fallback mode
 */
function activateFallbackMode(reason) {
    console.log('========================================');
    console.log('FALLBACK MODE ACTIVATED');
    console.log('Reason:', reason);
    console.log('========================================');
    console.log('All content will be displayed immediately with full opacity.');
    console.log('Animations are disabled, but all content remains accessible.');

    // Get all elements that would normally be animated
    const whatIDoSection = document.getElementById('what-i-do-section');
    const sectionTitle = document.getElementById('section-title');
    const sectionBody = document.getElementById('section-body');
    const expertiseItems = document.querySelectorAll('.expertise-item');
    const heroContainer = document.getElementById('hero-container');

    // Display all content immediately with opacity 1
    if (whatIDoSection) {
        whatIDoSection.style.opacity = '1';
        whatIDoSection.style.visibility = 'visible';
    }

    if (sectionTitle) {
        sectionTitle.style.opacity = '1';
        sectionTitle.style.transform = 'none';
        sectionTitle.style.visibility = 'visible';
    }

    if (sectionBody) {
        sectionBody.style.opacity = '1';
        sectionBody.style.transform = 'none';
        sectionBody.style.visibility = 'visible';
    }

    // Ensure expertise cards are visible
    expertiseItems.forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'none';
        item.style.visibility = 'visible';
    });

    // Keep hero container visible (no animation)
    if (heroContainer) {
        heroContainer.style.transform = 'none';
        heroContainer.style.opacity = '1';
    }

    console.log('Fallback mode complete - all content is now visible and accessible');
    console.log('Total elements made visible:', 
        [whatIDoSection, sectionTitle, sectionBody, heroContainer].filter(el => el).length + 
        expertiseItems.length
    );
}

/**
 * Fallback: No animation mode
 * Shows all content immediately for accessibility/errors
 * Used for reduced motion preference
 */
function fallbackNoAnimation() {
    console.log('Running fallback mode - showing all content immediately');

    const whatIDoSection = document.getElementById('what-i-do-section');
    const sectionTitle = document.getElementById('section-title');
    const sectionBody = document.getElementById('section-body');
    const expertiseItems = document.querySelectorAll('.expertise-item');

    // Show all elements immediately
    if (whatIDoSection) whatIDoSection.style.opacity = '1';
    if (sectionTitle) {
        sectionTitle.style.opacity = '1';
        sectionTitle.style.transform = 'none';
    }
    if (sectionBody) {
        sectionBody.style.opacity = '1';
        sectionBody.style.transform = 'none';
    }

    expertiseItems.forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'none';
    });

    console.log('Fallback mode complete - all content visible');
}

/**
 * Debug function: Toggle ScrollTrigger markers
 * Call from browser console: toggleMarkers()
 */
window.toggleMarkers = function () {
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.getAll().forEach(trigger => {
            trigger.vars.markers = !trigger.vars.markers;
        });
        ScrollTrigger.refresh();
        console.log('ScrollTrigger markers toggled');
    }
};

/**
 * Debug function: Log all ScrollTrigger instances
 * Call from browser console: logScrollTriggers()
 */
window.logScrollTriggers = function () {
    if (typeof ScrollTrigger !== 'undefined') {
        const triggers = ScrollTrigger.getAll();
        console.log(`Active ScrollTriggers: ${triggers.length}`);
        triggers.forEach((trigger, index) => {
            console.log(`Trigger ${index + 1}:`, {
                trigger: trigger.trigger,
                start: trigger.vars.start,
                end: trigger.vars.end,
                scrub: trigger.vars.scrub
            });
        });
    }
};

// Log initialization
console.log('≡ƒô£ about-parallax.js loaded');
