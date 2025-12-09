/**
 * Profile Card Interactive Features
 * Handles follow button, parallax effects, and stats animation
 */

(function() {
    'use strict';

    // ============================================
    // FOLLOW BUTTON INTERACTION
    // ============================================

    const followButton = document.querySelector('.follow-button');
    let isFollowing = false;

    if (followButton) {
        followButton.addEventListener('click', function() {
            isFollowing = !isFollowing;

            // Update button content and styling
            if (isFollowing) {
                this.innerHTML = `
                    <span>Following</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" stroke-width="2" />
                    </svg>
                `;
                this.style.background = '#006b3f';
                this.style.color = '#ffffff';
                this.setAttribute('aria-pressed', 'true');
            } else {
                this.innerHTML = `
                    <span>Follow</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                `;
                this.style.background = '#ffffff';
                this.style.color = '#1a1a1a';
                this.setAttribute('aria-pressed', 'false');
            }

            // Announce state change for screen readers
            announceToScreenReader(
                isFollowing ? 'Now following Leon Madara' : 'Unfollowed Leon Madara'
            );

            // Haptic feedback (if supported)
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        });
    }

    // ============================================
    // AVATAR PARALLAX EFFECT
    // ============================================

    const card = document.querySelector('.profile-card');
    const avatar = document.querySelector('.profile-avatar-wrapper');

    if (card && avatar) {
        // Store original transform for reset
        const originalTransform = 'translate(-50%, 50%)';

        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            // Calculate movement (max ±10px)
            const moveX = (x - 0.5) * 10;
            const moveY = (y - 0.5) * 10;

            // Apply smooth transform
            avatar.style.transition = 'transform 0.1s ease-out';
            avatar.style.transform = `translate(calc(-50% + ${moveX}px), calc(50% + ${moveY}px))`;
        });

        card.addEventListener('mouseleave', function() {
            // Reset to original position with smooth transition
            avatar.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            avatar.style.transform = originalTransform;
        });
    }

    // ============================================
    // STATS COUNTER ANIMATION
    // ============================================

    /**
     * Animates a number from start to end value
     * @param {HTMLElement} element - Element to animate
     * @param {number} start - Starting value
     * @param {number} end - Ending value
     * @param {number} duration - Animation duration in ms
     */
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // Easing function (ease-out-quart)
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);

            const current = Math.floor(easeOutQuart * (end - start) + start);
            element.textContent = formatNumber(current);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = formatNumber(end);
            }
        };

        window.requestAnimationFrame(step);
    }

    /**
     * Formats number with K/M suffixes
     * @param {number} num - Number to format
     * @returns {string} Formatted number string
     */
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    /**
     * Parses stat value text into number
     * @param {string} text - Stat text (e.g., "72.9K")
     * @returns {number} Parsed number value
     */
    function parseStatValue(text) {
        let value = parseFloat(text.replace(/[KM]/g, ''));

        if (text.includes('K')) {
            value = value * 1000;
        } else if (text.includes('M')) {
            value = value * 1000000;
        }

        return value;
    }

    // Initialize stats animation with Intersection Observer
    const statValues = document.querySelectorAll('.stat-value');

    if (statValues.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const targetValue = parseStatValue(element.textContent);

                    // Animate from 0 to target value
                    animateValue(element, 0, targetValue, 1500);

                    // Unobserve after animation starts
                    statsObserver.unobserve(element);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px'
        });

        // Observe all stat value elements
        statValues.forEach(stat => statsObserver.observe(stat));
    }

    // ============================================
    // ACCESSIBILITY UTILITIES
    // ============================================

    /**
     * Announces text to screen readers
     * @param {string} message - Message to announce
     * @param {string} priority - 'polite' or 'assertive'
     */
    function announceToScreenReader(message, priority = 'polite') {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', priority);
        announcement.className = 'sr-only';
        announcement.textContent = message;

        document.body.appendChild(announcement);

        // Remove after announcement
        setTimeout(() => {
            if (announcement.parentNode) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }

    // ============================================
    // EXPERIENCE BAR ANIMATION
    // ============================================

    /**
     * Triggers experience bar fill animation on scroll into view
     */
    function initExperienceBar() {
        const expBarFill = document.querySelector('.experience-bar-fill');

        if (expBarFill) {
            const expObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Trigger CSS animation by adding class
                        entry.target.classList.add('animate');
                        expObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.5
            });

            expObserver.observe(expBarFill);
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initExperienceBar);
    } else {
        initExperienceBar();
    }

    // ============================================
    // CARD TILT EFFECT (OPTIONAL)
    // ============================================

    /**
     * Optional 3D tilt effect on card hover
     * Uncomment to enable
     */
    /*
    if (card) {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            const tiltX = (y - 0.5) * 10; // Max ±5 degrees
            const tiltY = (x - 0.5) * -10;

            this.style.transform = `
                perspective(1000px)
                rotateX(${tiltX}deg)
                rotateY(${tiltY}deg)
                translateY(-8px)
            `;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    }
    */

    // ============================================
    // SOCIAL ICON INTERACTIONS
    // ============================================

    const socialIcons = document.querySelectorAll('.social-icon-button');

    if (socialIcons.length > 0) {
        socialIcons.forEach(icon => {
            // Add ripple effect on click (optional)
            icon.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                ripple.className = 'ripple-effect';

                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';

                this.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // ============================================
    // PERFORMANCE MONITORING (DEV MODE)
    // ============================================

    /**
     * Log performance metrics in development
     */
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.addEventListener('load', function() {
            if (window.performance && window.performance.timing) {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

                console.log('🎨 Profile Card Performance:');
                console.log(`   Page Load: ${pageLoadTime}ms`);
                console.log(`   DOM Ready: ${perfData.domContentLoadedEventEnd - perfData.navigationStart}ms`);
            }
        });
    }

    // ============================================
    // EXPORT FOR MODULE USAGE (OPTIONAL)
    // ============================================

    // If using as module, export functions
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            animateValue,
            formatNumber,
            announceToScreenReader
        };
    }

})();
