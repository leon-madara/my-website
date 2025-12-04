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

        // Setup Contact Form
        this.initContactForm();

        // Setup CSS Animations
        this.initAnimations();

        // Setup Scroll Effects
        this.initScrollEffects();
    },

    // ===================================
    // FAQ ACCORDION (Native <details> elements)
    // ===================================
    initFAQ() {
        // Native <details>/<summary> elements handle expand/collapse automatically
        // Just add screen reader announcements for better accessibility
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            item.addEventListener('toggle', () => {
                if (item.open) {
                    this.announceToScreenReader('FAQ item expanded');
                }
            });
        });

        console.log('✓ FAQ Accordion initialized (native details)');
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
    // CONTACT FORM
    // ===================================
    initContactForm() {
        const form = document.getElementById('contact-form-element');
        if (!form) return;

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const projectTypeSelect = document.getElementById('project-type');
        const messageTextarea = document.getElementById('message');

        // Real-time validation
        if (nameInput) {
            nameInput.addEventListener('blur', () => this.validateName(nameInput));
            nameInput.addEventListener('input', () => {
                if (nameInput.classList.contains('error')) {
                    this.validateName(nameInput);
                }
            });
        }

        if (emailInput) {
            emailInput.addEventListener('blur', () => this.validateEmail(emailInput));
            emailInput.addEventListener('input', () => {
                if (emailInput.classList.contains('error')) {
                    this.validateEmail(emailInput);
                }
            });
        }

        if (projectTypeSelect) {
            projectTypeSelect.addEventListener('change', () => this.validateProjectType(projectTypeSelect));
        }

        if (messageTextarea) {
            messageTextarea.addEventListener('blur', () => this.validateMessage(messageTextarea));
            messageTextarea.addEventListener('input', () => {
                if (messageTextarea.classList.contains('error')) {
                    this.validateMessage(messageTextarea);
                }
            });
        }

        // Form submission
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        console.log('✓ Contact form initialized');
    },

    // Validate Name
    validateName(input) {
        const value = input.value.trim();
        const errorSpan = input.parentElement.querySelector('.form-error');

        if (value.length === 0) {
            this.setError(input, errorSpan, 'Name is required');
            return false;
        }

        if (value.length < 2) {
            this.setError(input, errorSpan, 'Name must be at least 2 characters');
            return false;
        }

        if (!/^[a-zA-Z\s]+$/.test(value)) {
            this.setError(input, errorSpan, 'Name can only contain letters and spaces');
            return false;
        }

        this.setSuccess(input, errorSpan);
        return true;
    },

    // Validate Email
    validateEmail(input) {
        const value = input.value.trim();
        const errorSpan = input.parentElement.querySelector('.form-error');

        if (value.length === 0) {
            this.setError(input, errorSpan, 'Email is required');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            this.setError(input, errorSpan, 'Please enter a valid email address');
            return false;
        }

        this.setSuccess(input, errorSpan);
        return true;
    },

    // Validate Project Type
    validateProjectType(select) {
        const value = select.value;
        const errorSpan = select.parentElement.querySelector('.form-error');

        if (value === '') {
            this.setError(select, errorSpan, 'Please select a project type');
            return false;
        }

        this.setSuccess(select, errorSpan);
        return true;
    },

    // Validate Message
    validateMessage(textarea) {
        const value = textarea.value.trim();
        const errorSpan = textarea.parentElement.querySelector('.form-error');

        if (value.length === 0) {
            this.setError(textarea, errorSpan, 'Message is required');
            return false;
        }

        if (value.length < 10) {
            this.setError(textarea, errorSpan, 'Message must be at least 10 characters');
            return false;
        }

        if (value.length > 1000) {
            this.setError(textarea, errorSpan, 'Message must not exceed 1000 characters');
            return false;
        }

        this.setSuccess(textarea, errorSpan);
        return true;
    },

    // Set Error State
    setError(input, errorSpan, message) {
        input.classList.add('error');
        input.classList.remove('success');
        input.setAttribute('aria-invalid', 'true');
        if (errorSpan) {
            errorSpan.textContent = message;
        }
    },

    // Set Success State
    setSuccess(input, errorSpan) {
        input.classList.remove('error');
        input.classList.add('success');
        input.setAttribute('aria-invalid', 'false');
        if (errorSpan) {
            errorSpan.textContent = '';
        }
    },

    // Handle Form Submission
    async handleFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const projectTypeSelect = document.getElementById('project-type');
        const messageTextarea = document.getElementById('message');
        const submitBtn = form.querySelector('.btn-submit');

        // Validate all fields
        const isNameValid = this.validateName(nameInput);
        const isEmailValid = this.validateEmail(emailInput);
        const isProjectTypeValid = this.validateProjectType(projectTypeSelect);
        const isMessageValid = this.validateMessage(messageTextarea);

        if (!isNameValid || !isEmailValid || !isProjectTypeValid || !isMessageValid) {
            this.announceToScreenReader('Please fix the errors in the form');
            return;
        }

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        try {
            // TODO: Replace with actual form submission
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success message
            this.showFormSuccess(form);

            // Clear form
            form.reset();

            // Remove validation classes
            [nameInput, emailInput, projectTypeSelect, messageTextarea].forEach(input => {
                input.classList.remove('error', 'success');
                input.removeAttribute('aria-invalid');
            });

        } catch (error) {
            console.error('Form submission error:', error);
            this.showToast('Failed to send message. Please try again.', 'error');
        } finally {
            // Remove loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    },

    // Show Form Success
    showFormSuccess(form) {
        const successMessage = document.getElementById('form-success');

        if (successMessage) {
            form.style.display = 'none';
            successMessage.classList.add('show');

            this.announceToScreenReader('Message sent successfully!');

            // Hide success message and show form again after 5 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
                form.style.display = 'block';
            }, 5000);
        }
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
            '.contact-card, .location-card, .faq-item, .section-header, .contact-form, .calendar-option'
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
