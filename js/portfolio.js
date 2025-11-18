// Portfolio Page - 3D Card Carousel with GSAP Animations
// Features: Carousel navigation, card transitions, text reveals

document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP ScrollTrigger plugin
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Initialize carousel if it exists
    if (document.querySelector('.card-carousel-container')) {
        init3DCarousel();
    } else if (document.querySelector('.infographic-container')) {
        // Fallback to old animation system
        initOldCardAnimations();
    }
});

// 3D Carousel Initialization
function init3DCarousel() {
    const cards = document.querySelectorAll('.project-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;
    let isTransitioning = false;

    if (cards.length === 0) return;

    // Initialize card positions
    updateCardPositions();

    // Setup text reveal animations for active card
    animateCardContent(cards[currentIndex]);

    // Navigation handlers
    if (prevBtn) {
        prevBtn.addEventListener('click', () => navigateCarousel('prev'));
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => navigateCarousel('next'));
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (isTransitioning) return;
        if (e.key === 'ArrowLeft') navigateCarousel('prev');
        if (e.key === 'ArrowRight') navigateCarousel('next');
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    cards.forEach(card => {
        card.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        card.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    });

    function handleSwipe() {
        if (Math.abs(touchEndX - touchStartX) > 50) {
            if (touchEndX < touchStartX && !isTransitioning) {
                navigateCarousel('next');
            } else if (touchEndX > touchStartX && !isTransitioning) {
                navigateCarousel('prev');
            }
        }
    }

    function navigateCarousel(direction) {
        if (isTransitioning) return;
        isTransitioning = true;

        // Calculate new index
        if (direction === 'next') {
            currentIndex = (currentIndex + 1) % cards.length;
        } else {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        }

        // Animate card exit
        const activeCard = document.querySelector('.project-card.active');
        if (activeCard && typeof gsap !== 'undefined') {
            gsap.to(activeCard.querySelectorAll('.card-number-badge, .card-share-btn, .card-title, .card-subtitle, .card-tagline, .card-tech-stack, .card-cta-btn'), {
                opacity: 0,
                y: 20,
                duration: 0.3,
                stagger: 0.05,
                ease: 'power2.in'
            });
        }

        // Update positions and animate in
        setTimeout(() => {
            updateCardPositions();
            animateCardContent(cards[currentIndex]);
            
            setTimeout(() => {
                isTransitioning = false;
            }, 600);
        }, 300);
    }

    function updateCardPositions() {
        cards.forEach((card, index) => {
            card.classList.remove('active', 'left', 'right');

            if (index === currentIndex) {
                card.classList.add('active');
            } else if (index === (currentIndex - 1 + cards.length) % cards.length) {
                card.classList.add('left');
            } else if (index === (currentIndex + 1) % cards.length) {
                card.classList.add('right');
            }
        });
    }

    function animateCardContent(card) {
        if (!card || typeof gsap === 'undefined') return;

        const contentElements = [
            card.querySelector('.card-number-badge'),
            card.querySelector('.card-share-btn'),
            card.querySelector('.card-title'),
            card.querySelector('.card-subtitle'),
            card.querySelector('.card-tagline'),
            card.querySelector('.card-tech-stack'),
            card.querySelector('.card-cta-btn')
        ].filter(el => el !== null);

        // Animate elements in with stagger
        gsap.to(contentElements, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            delay: 0.3,
            stagger: {
                amount: 0.4,
                from: "start"
            },
            ease: 'power3.out'
        });
    }

    // CTA button click handlers
    const ctaButtons = document.querySelectorAll('.card-cta-btn');
    ctaButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const project = cards[index].getAttribute('data-project');
            if (typeof window.openModal === 'function') {
                window.openModal(project);
            }
        });
    });

    console.log('3D Carousel initialized with', cards.length, 'cards');
}

// Fallback: Old card animations (if carousel doesn't exist)
function initOldCardAnimations() {
    // Register GSAP ScrollTrigger plugin
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Get elements
    const infographicCards = document.querySelectorAll('.infographic-card');
    const cardButtons = document.querySelectorAll('.card-btn');

    if (infographicCards.length === 0) return;

    // Create scroll progress indicator
    createScrollProgress();

    // Setup card entrance animations
    setupCardEntranceAnimations();

    // Setup card scroll animations
    setupCardScrollAnimations();

    // Setup card click interactions
    setupCardInteractions();

    // Scroll Progress Bar
    function createScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
        document.body.appendChild(progressBar);

        const bar = progressBar.querySelector('.scroll-progress-bar');

        gsap.to(bar, {
            width: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: '.portfolio-main',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.3
            }
        });
    }

    // Card Entrance Animations - Sequential reveal on page load
    function setupCardEntranceAnimations() {
        // Add animate-in class first, then animate
        infographicCards.forEach((card, index) => {
            card.classList.add('animate-in');

            gsap.to(card, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: index * 0.2 + 0.3,
                ease: 'power3.out',
                onComplete: () => {
                    card.classList.add('visible');
                    card.classList.remove('animate-in');
                }
            });
        });
    }

    // Card Scroll Animations - Scale and glow on scroll
    function setupCardScrollAnimations() {
        infographicCards.forEach((card, index) => {
            ScrollTrigger.create({
                trigger: card,
                start: 'top 80%',
                end: 'bottom 20%',
                onEnter: () => {
                    gsap.to(card, {
                        scale: 1.05,
                        duration: 0.6,
                        ease: 'power2.out'
                    });
                },
                onLeave: () => {
                    gsap.to(card, {
                        scale: 1,
                        duration: 0.4,
                        ease: 'power2.out'
                    });
                },
                onEnterBack: () => {
                    gsap.to(card, {
                        scale: 1.05,
                        duration: 0.6,
                        ease: 'power2.out'
                    });
                },
                onLeaveBack: () => {
                    gsap.to(card, {
                        scale: 1,
                        duration: 0.4,
                        ease: 'power2.out'
                    });
                }
            });
        });
    }

    // Card Click Interactions - Open modal with project details
    function setupCardInteractions() {
        infographicCards.forEach((card) => {
            // Get project ID from data attribute
            const projectId = card.getAttribute('data-project');

            // Click handler for entire card
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking the button (it has its own handler)
                if (e.target.closest('.card-btn')) {
                    return;
                }
                openProjectModal(projectId);
            });

            // Button click handler
            const button = card.querySelector('.card-btn');
            if (button) {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openProjectModal(projectId);
                });
            }

            // Add hover tilt effect
            setupCardTiltEffect(card);

            // Keyboard accessibility
            card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openProjectModal(projectId);
                }
            });
        });
    }

    // 3D Tilt Effect on Hover
    function setupCardTiltEffect(card) {
        const cardInner = card.querySelector('.card-inner');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            gsap.to(cardInner, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.3,
                ease: 'power2.out',
                transformPerspective: 1000
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(cardInner, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    }

    // Open Project Modal
    function openProjectModal(projectId) {
        const modal = document.getElementById('project-modal');
        if (!modal) {
            console.warn('Modal not found');
            return;
        }

        // Check if projectModal.js has loaded the function
        if (typeof window.openModal === 'function') {
            window.openModal(projectId);
        } else {
            console.warn('Modal function not loaded yet');
        }
    }

    // Add entrance animation for portfolio header
    gsap.from('.portfolio-header', {
        opacity: 0,
        y: -50,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2
    });

    // Animate container entrance
    gsap.from('.infographic-container', {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out',
        delay: 0.4
    });

    // Tech badge hover animations
    document.querySelectorAll('.tech-badge').forEach(badge => {
        badge.addEventListener('mouseenter', () => {
            gsap.to(badge, {
                scale: 1.1,
                duration: 0.2,
                ease: 'back.out(1.7)'
            });
        });

        badge.addEventListener('mouseleave', () => {
            gsap.to(badge, {
                scale: 1,
                duration: 0.2,
                ease: 'power2.out'
            });
        });
    });

    // Tech tag hover animations (for detail cards)
    document.querySelectorAll('.tech-tag').forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            gsap.to(tag, {
                scale: 1.1,
                duration: 0.2,
                ease: 'back.out(1.7)'
            });
        });

        tag.addEventListener('mouseleave', () => {
            gsap.to(tag, {
                scale: 1,
                duration: 0.2,
                ease: 'power2.out'
            });
        });
    });

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Detail card reveal animations
    const detailCards = document.querySelectorAll('.project-detail-card');
    detailCards.forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                end: 'top 50%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Console log for debugging
    console.log('Portfolio infographic card animations initialized');
    console.log(`Total cards: ${infographicCards.length}`);
    if (typeof gsap !== 'undefined') {
        console.log('GSAP version:', gsap.version);
    }
}

// Utility: Lerp function for smooth interpolation
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

// Utility: Map range function
function mapRange(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
