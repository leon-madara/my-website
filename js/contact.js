/**
 * Contact Page JavaScript
 * Leon Madara Portfolio
 */

// Contact Page Controller
const ContactPage = {
    // State
    state: {
        isSubmitting: false,
        formData: {},
    },

    // Elements
    elements: {
        form: null,
        nameInput: null,
        emailInput: null,
        subjectInput: null,
        messageInput: null,
        submitBtn: null,
        copyEmailBtn: null,
        toast: null,
        messageCounter: null,
    },

    // Initialize
    init() {
        console.log('Initializing Contact Page...');

        // Cache DOM elements
        this.cacheElements();

        // Set up event listeners
        this.setupEventListeners();

        // Initialize GSAP animations
        this.initAnimations();

        // Initialize character counter
        this.initCharacterCounter();

        console.log('Contact Page initialized successfully');
    },

    // Cache DOM Elements
    cacheElements() {
        this.elements.form = document.getElementById('contact-form-element');
        this.elements.nameInput = document.getElementById('name');
        this.elements.emailInput = document.getElementById('email');
        this.elements.subjectInput = document.getElementById('subject');
        this.elements.messageInput = document.getElementById('message');
        this.elements.submitBtn = document.getElementById('submit-btn');
        this.elements.copyEmailBtn = document.getElementById('copy-email-btn');
        this.elements.toast = document.getElementById('toast');
        this.elements.messageCounter = document.getElementById('message-counter');
    },

    // Setup Event Listeners
    setupEventListeners() {
        // Form submission
        if (this.elements.form) {
            this.elements.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Real-time validation
        if (this.elements.nameInput) {
            this.elements.nameInput.addEventListener('blur', () => this.validateName());
            this.elements.nameInput.addEventListener('input', () => this.clearError('name'));
        }

        if (this.elements.emailInput) {
            this.elements.emailInput.addEventListener('blur', () => this.validateEmail());
            this.elements.emailInput.addEventListener('input', () => this.clearError('email'));
        }

        if (this.elements.subjectInput) {
            this.elements.subjectInput.addEventListener('blur', () => this.validateSubject());
            this.elements.subjectInput.addEventListener('input', () => this.clearError('subject'));
        }

        if (this.elements.messageInput) {
            this.elements.messageInput.addEventListener('blur', () => this.validateMessage());
            this.elements.messageInput.addEventListener('input', () => {
                this.clearError('message');
                this.updateCharacterCounter();
            });
        }

        // Copy email button
        if (this.elements.copyEmailBtn) {
            this.elements.copyEmailBtn.addEventListener('click', () => this.copyEmailToClipboard());
        }
    },

    // Initialize GSAP Animations
    initAnimations() {
        if (typeof gsap === 'undefined') {
            console.warn('GSAP not loaded, skipping animations');
            return;
        }

        // Hero section animation
        gsap.from('.hero-title', {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out',
        });

        gsap.from('.hero-subtitle', {
            opacity: 0,
            y: 30,
            duration: 1,
            delay: 0.2,
            ease: 'power3.out',
        });

        gsap.from('.scroll-indicator', {
            opacity: 0,
            y: 20,
            duration: 1,
            delay: 0.4,
            ease: 'power3.out',
        });

        // Contact cards stagger animation
        gsap.from('.contact-card', {
            scrollTrigger: {
                trigger: '.contact-methods-grid',
                start: 'top 80%',
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
        });

        // Form fields stagger animation
        gsap.from('.form-group', {
            scrollTrigger: {
                trigger: '.contact-form',
                start: 'top 80%',
            },
            opacity: 0,
            x: -30,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
        });

        // Location items animation
        gsap.from('.location-item', {
            scrollTrigger: {
                trigger: '.location-section',
                start: 'top 80%',
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out',
        });
    },

    // Initialize Character Counter
    initCharacterCounter() {
        this.updateCharacterCounter();
    },

    // Update Character Counter
    updateCharacterCounter() {
        if (!this.elements.messageInput || !this.elements.messageCounter) return;

        const currentLength = this.elements.messageInput.value.length;
        const maxLength = this.elements.messageInput.maxLength;

        this.elements.messageCounter.textContent = `${currentLength} / ${maxLength}`;

        // Change color when approaching limit
        if (currentLength >= maxLength * 0.9) {
            this.elements.messageCounter.style.color = 'var(--kenyan-red)';
        } else {
            this.elements.messageCounter.style.color = 'var(--secondary-text)';
        }
    },

    // Validation Methods
    validateName() {
        const name = this.elements.nameInput.value.trim();
        const errorElement = document.getElementById('name-error');

        if (name.length === 0) {
            this.showError('name', 'Name is required');
            return false;
        }

        if (name.length < 2) {
            this.showError('name', 'Name must be at least 2 characters');
            return false;
        }

        this.clearError('name');
        return true;
    },

    validateEmail() {
        const email = this.elements.emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const errorElement = document.getElementById('email-error');

        if (email.length === 0) {
            this.showError('email', 'Email is required');
            return false;
        }

        if (!emailRegex.test(email)) {
            this.showError('email', 'Please enter a valid email address');
            return false;
        }

        this.clearError('email');
        return true;
    },

    validateSubject() {
        const subject = this.elements.subjectInput.value.trim();
        const errorElement = document.getElementById('subject-error');

        if (subject.length === 0) {
            this.showError('subject', 'Subject is required');
            return false;
        }

        if (subject.length < 3) {
            this.showError('subject', 'Subject must be at least 3 characters');
            return false;
        }

        this.clearError('subject');
        return true;
    },

    validateMessage() {
        const message = this.elements.messageInput.value.trim();
        const errorElement = document.getElementById('message-error');

        if (message.length === 0) {
            this.showError('message', 'Message is required');
            return false;
        }

        if (message.length < 10) {
            this.showError('message', 'Message must be at least 10 characters');
            return false;
        }

        this.clearError('message');
        return true;
    },

    // Show Error
    showError(fieldName, message) {
        const inputElement = this.elements[`${fieldName}Input`];
        const errorElement = document.getElementById(`${fieldName}-error`);

        if (inputElement) {
            inputElement.classList.add('error');
        }

        if (errorElement) {
            errorElement.textContent = message;
        }
    },

    // Clear Error
    clearError(fieldName) {
        const inputElement = this.elements[`${fieldName}Input`];
        const errorElement = document.getElementById(`${fieldName}-error`);

        if (inputElement) {
            inputElement.classList.remove('error');
        }

        if (errorElement) {
            errorElement.textContent = '';
        }
    },

    // Validate All Fields
    validateAllFields() {
        const isNameValid = this.validateName();
        const isEmailValid = this.validateEmail();
        const isSubjectValid = this.validateSubject();
        const isMessageValid = this.validateMessage();

        return isNameValid && isEmailValid && isSubjectValid && isMessageValid;
    },

    // Handle Form Submit
    async handleFormSubmit(e) {
        e.preventDefault();

        // Validate all fields
        if (!this.validateAllFields()) {
            this.showToast('Please fix the errors in the form', 'error');
            return;
        }

        // Prevent double submission
        if (this.state.isSubmitting) {
            return;
        }

        // Set submitting state
        this.state.isSubmitting = true;
        this.elements.submitBtn.classList.add('loading');
        this.elements.submitBtn.disabled = true;

        // Collect form data
        this.state.formData = {
            name: this.elements.nameInput.value.trim(),
            email: this.elements.emailInput.value.trim(),
            subject: this.elements.subjectInput.value.trim(),
            message: this.elements.messageInput.value.trim(),
            timestamp: new Date().toISOString(),
        };

        try {
            // Simulate form submission (replace with actual backend call)
            await this.submitForm(this.state.formData);

            // Success
            this.showToast('Message sent successfully!', 'success');
            this.resetForm();

            // Announce success to screen readers
            this.announceToScreenReader('Your message has been sent successfully');

        } catch (error) {
            console.error('Form submission error:', error);
            this.showToast('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset submitting state
            this.state.isSubmitting = false;
            this.elements.submitBtn.classList.remove('loading');
            this.elements.submitBtn.disabled = false;
        }
    },

    // Submit Form (Replace with actual backend integration)
    async submitForm(data) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success (90% success rate for demo)
                if (Math.random() > 0.1) {
                    console.log('Form data submitted:', data);
                    resolve({ success: true });
                } else {
                    reject(new Error('Network error'));
                }
            }, 2000);
        });

        // TODO: Replace with actual backend integration
        // Example with EmailJS:
        /*
        return emailjs.send(
            'YOUR_SERVICE_ID',
            'YOUR_TEMPLATE_ID',
            data,
            'YOUR_PUBLIC_KEY'
        );
        */

        // Example with Formspree:
        /*
        return fetch('https://formspree.io/f/YOUR_FORM_ID', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
        */
    },

    // Reset Form
    resetForm() {
        if (this.elements.form) {
            this.elements.form.reset();
        }

        // Clear all errors
        this.clearError('name');
        this.clearError('email');
        this.clearError('subject');
        this.clearError('message');

        // Reset character counter
        this.updateCharacterCounter();
    },

    // Copy Email to Clipboard
    async copyEmailToClipboard() {
        const email = document.getElementById('email-value').textContent;

        try {
            // Modern clipboard API
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(email);
                this.showToast('Email copied to clipboard!', 'success');

                // Visual feedback on button
                const originalText = this.elements.copyEmailBtn.querySelector('.action-text').textContent;
                this.elements.copyEmailBtn.querySelector('.action-text').textContent = 'Copied!';

                setTimeout(() => {
                    this.elements.copyEmailBtn.querySelector('.action-text').textContent = originalText;
                }, 2000);

            } else {
                // Fallback for older browsers
                this.fallbackCopyEmail(email);
            }

            // Announce to screen readers
            this.announceToScreenReader('Email address copied to clipboard');

        } catch (error) {
            console.error('Failed to copy email:', error);
            this.showToast('Failed to copy email', 'error');
        }
    },

    // Fallback Copy Method
    fallbackCopyEmail(email) {
        const textArea = document.createElement('textarea');
        textArea.value = email;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
            this.showToast('Email copied to clipboard!', 'success');
        } catch (error) {
            console.error('Fallback copy failed:', error);
            this.showToast('Failed to copy email', 'error');
        } finally {
            document.body.removeChild(textArea);
        }
    },

    // Show Toast Notification
    showToast(message, type = 'success') {
        if (!this.elements.toast) return;

        // Set message
        const messageElement = this.elements.toast.querySelector('.toast-message');
        if (messageElement) {
            messageElement.textContent = message;
        }

        // Set type
        this.elements.toast.classList.remove('success', 'error');
        this.elements.toast.classList.add(type);

        // Update icon
        const iconElement = this.elements.toast.querySelector('.toast-icon');
        if (iconElement) {
            if (type === 'error') {
                iconElement.innerHTML = '<path d="M18 6L6 18M6 6l12 12"></path>';
            } else {
                iconElement.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
            }
        }

        // Show toast
        this.elements.toast.classList.add('show');

        // Hide after 4 seconds
        setTimeout(() => {
            this.elements.toast.classList.remove('show');
        }, 4000);
    },

    // Announce to Screen Reader
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
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ContactPage.init());
} else {
    ContactPage.init();
}
