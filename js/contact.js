/**
 * Contact Page - Interactive Features
 * Leon Madara Portfolio
 */

// Contact Page Controller
const ContactPage = {
    // Initialize
    init() {
        console.log('🚀 Contact Page Initialized');

        // Setup FAQ Accordion
        this.initFAQ();

        // Setup Copy Buttons
        this.initCopyButtons();

        // Setup Live Time Display
        this.initLiveTime();

        // Setup GSAP Animations
        this.initAnimations();

        // Setup Scroll Effects
        this.initScrollEffects();
    },

    // ===================================
    // FAQ ACCORDION
    // ===================================
    initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');

            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all FAQ items
                faqItems.forEach(faq => {
                    faq.classList.remove('active');
                    faq.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                });

                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');

                    // Announce to screen readers
                    this.announceToScreenReader('FAQ item expanded');
                }
            });

            // Keyboard navigation
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        });

        console.log('✓ FAQ Accordion initialized');
    },

    // ===================================
    // COPY TO CLIPBOARD
    // ===================================
    initCopyButtons() {
        // Copy Email
        const copyEmailBtn = document.getElementById('copy-email');
        if (copyEmailBtn) {
            copyEmailBtn.addEventListener('click', () => {
                const email = document.getElementById('email-value').textContent;
                this.copyToClipboard(email, 'Email copied to clipboard!');
            });
        }

        // Copy Phone
        const copyPhoneBtn = document.getElementById('copy-phone');
        if (copyPhoneBtn) {
            copyPhoneBtn.addEventListener('click', () => {
                const phone = document.getElementById('phone-value').textContent;
                this.copyToClipboard(phone, 'Phone number copied to clipboard!');
            });
        }

        console.log('✓ Copy buttons initialized');
    },

    // Copy to Clipboard Helper
    async copyToClipboard(text, successMessage) {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                this.showToast(successMessage, 'success');
                this.announceToScreenReader(successMessage);
            } else {
                // Fallback for older browsers
                this.fallbackCopy(text, successMessage);
            }
        } catch (error) {
            console.error('Failed to copy:', error);
            this.showToast('Failed to copy to clipboard', 'error');
        }
    },

    // Fallback Copy Method
    fallbackCopy(text, successMessage) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '0';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            document.execCommand('copy');
            this.showToast(successMessage, 'success');
            this.announceToScreenReader(successMessage);
        } catch (error) {
            console.error('Fallback copy failed:', error);
            this.showToast('Failed to copy to clipboard', 'error');
        } finally {
            document.body.removeChild(textarea);
        }
    },

    // ===================================
    // TOAST NOTIFICATIONS
    // ===================================
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;

        const messageElement = toast.querySelector('.toast-message');
        if (messageElement) {
            messageElement.textContent = message;
        }

        // Set toast type
        toast.classList.remove('success', 'error');
        toast.classList.add(type);

        // Show toast
        toast.classList.add('show');

        // Hide after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    },

    // ===================================
    // LIVE TIME DISPLAY
    // ===================================
    initLiveTime() {
        const timeElement = document.getElementById('current-time');
        if (!timeElement) return;

        const updateTime = () => {
            // East Africa Time (EAT) is UTC+3
            const now = new Date();
            const eatTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }));

            const hours = eatTime.getHours();
            const minutes = eatTime.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            const displayMinutes = minutes.toString().padStart(2, '0');

            timeElement.textContent = `${displayHours}:${displayMinutes} ${ampm}`;
        };

        // Update immediately
        updateTime();

        // Update every minute
        setInterval(updateTime, 60000);

        console.log('✓ Live time initialized');
    },

    // ===================================
    // CSS ANIMATIONS WITH INTERSECTION OBSERVER
    // ===================================
    initAnimations() {
        // Use native Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Unobserve after animating to improve performance
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all animated elements
        const animatedElements = document.querySelectorAll(
            '.contact-card, .location-card, .faq-item, .section-header'
        );

        animatedElements.forEach(el => {
            observer.observe(el);
        });

        console.log('✓ CSS animations initialized');
    },

    // ===================================
    // SCROLL EFFECTS
    // ===================================
    initScrollEffects() {
        // Floating shapes use pure CSS animation - no JavaScript parallax needed
        // This prevents conflicts and provides smoother performance

        console.log('✓ Scroll effects initialized (CSS-only)');
    },

    // ===================================
    // ACCESSIBILITY HELPERS
    // ===================================
    announceToScreenReader(message) {
        const announcement = document.getElementById('sr-announcements');
        if (announcement) {
            announcement.textContent = message;

            // Clear after announcement
            setTimeout(() => {
                announcement.textContent = '';
            }, 1000);
        }
    },

    // ===================================
    // UTILITY FUNCTIONS
    // ===================================

    // Smooth scroll to section
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// ===================================
// INITIALIZE ON DOM READY
// ===================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ContactPage.init());
} else {
    ContactPage.init();
}

// ===================================
// EXPORT FOR EXTERNAL USE
// ===================================
if (typeof window !== 'undefined') {
    window.ContactPage = ContactPage;
}
