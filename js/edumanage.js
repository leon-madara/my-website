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
});
