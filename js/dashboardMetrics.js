// Dashboard Metrics Animations and Interactions
// Handles animated counters, progress indicators, and scroll-triggered animations

document.addEventListener('DOMContentLoaded', () => {
    // Animated Counter Function
    function animateCounter(element, targetValue, duration = 2000, suffix = '') {
        const startValue = 0;
        const startTime = Date.now();
        
        function updateCounter() {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);
            
            element.textContent = currentValue + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        updateCounter();
    }

    // Scroll-triggered counter animations
    function setupCounterAnimations() {
        const counters = document.querySelectorAll('[data-target]');
        
        counters.forEach(counter => {
            const targetValue = parseInt(counter.getAttribute('data-target'));
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = parseInt(counter.getAttribute('data-duration')) || 2000;
            
            ScrollTrigger.create({
                trigger: counter,
                start: 'top 80%',
                once: true,
                onEnter: () => {
                    animateCounter(counter, targetValue, duration, suffix);
                }
            });
        });
    }

    // Circular Progress Indicator Animation
    function setupProgressIndicators() {
        const indicators = document.querySelectorAll('.progress-ring');
        
        indicators.forEach(ring => {
            const circle = ring.querySelector('.progress-circle');
            const percentage = parseInt(ring.getAttribute('data-percentage'));
            
            if (!circle) return;
            
            const circumference = 2 * Math.PI * 45; // radius = 45
            circle.style.strokeDasharray = `${circumference} ${circumference}`;
            circle.style.strokeDashoffset = circumference;
            
            ScrollTrigger.create({
                trigger: ring,
                start: 'top 80%',
                once: true,
                onEnter: () => {
                    const offset = circumference - (percentage / 100) * circumference;
                    
                    gsap.to(circle, {
                        strokeDashoffset: offset,
                        duration: 1.5,
                        ease: 'power2.out'
                    });
                }
            });
        });
    }

    // Gauge Chart Animation
    function setupGaugeAnimations() {
        const gauges = document.querySelectorAll('.gauge');
        
        gauges.forEach(gauge => {
            const percentage = parseInt(gauge.getAttribute('data-percentage'));
            const gaugeArc = gauge.querySelector('.gauge-arc');
            
            if (!gaugeArc) return;
            
            ScrollTrigger.create({
                trigger: gauge,
                start: 'top 80%',
                once: true,
                onEnter: () => {
                    gsap.fromTo(gaugeArc, 
                        { '--percentage': '0' },
                        { '--percentage': percentage + '%', duration: 1.5, ease: 'power2.out' }
                    );
                }
            });
        });
    }

    // Card Entrance Animations
    function setupCardAnimations() {
        const metricCards = document.querySelectorAll('.metric-card');
        
        metricCards.forEach((card, index) => {
            gsap.fromTo(card, 
                {
                    opacity: 0,
                    y: 50,
                    scale: 0.95
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });
    }

    // Hover Effects for Interactive Cards
    function setupHoverEffects() {
        const cards = document.querySelectorAll('.metric-card');
        
        cards.forEach(card => {
            const cardContent = card.querySelector('.metric-card-inner');
            
            card.addEventListener('mouseenter', () => {
                gsap.to(cardContent, {
                    y: -5,
                    scale: 1.02,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(cardContent, {
                    y: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }

    // Stat Badge Pulse Animation
    function setupBadgeAnimations() {
        const badges = document.querySelectorAll('.stat-badge');
        
        badges.forEach(badge => {
            ScrollTrigger.create({
                trigger: badge,
                start: 'top 80%',
                once: true,
                onEnter: () => {
                    gsap.fromTo(badge,
                        { scale: 0, rotation: -10 },
                        {
                            scale: 1,
                            rotation: 0,
                            duration: 0.5,
                            ease: 'back.out(1.7)'
                        }
                    );
                }
            });
        });
    }

    // Initialize all animations
    if (typeof ScrollTrigger !== 'undefined') {
        setupCounterAnimations();
        setupProgressIndicators();
        setupGaugeAnimations();
        setupCardAnimations();
        setupHoverEffects();
        setupBadgeAnimations();
    }

    // Responsive handling for chart resizing
    window.addEventListener('resize', () => {
        // Recalculate any size-dependent animations if needed
        ScrollTrigger.refresh();
    });

    console.log('Dashboard metrics animations initialized');
});

