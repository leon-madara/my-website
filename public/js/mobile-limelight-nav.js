// public/js/mobile-limelight-nav.js

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.mobile-bottom-nav');
    if (!nav) return;

    const items = nav.querySelectorAll('.mobile-nav-item');
    const indicator = nav.querySelector('.limelight-indicator');
    
    if (!indicator || items.length === 0) return;

    // Helper to move the indicator
    function moveLimelight(activeItem, animate = true) {
        const left = activeItem.offsetLeft + (activeItem.offsetWidth / 2) - (indicator.offsetWidth / 2);
        
        if (!animate) {
            indicator.style.transition = 'none';
        } else {
            indicator.style.transition = 'left 400ms ease-in-out';
        }
        
        indicator.style.left = `${left}px`;
        
        // Update active classes on items for clarity
        items.forEach(item => {
            if (item === activeItem) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Determine initial active item
    let currentActive = Array.from(items).find(item => item.classList.contains('active')) || items[0];

    // Initial positioning without animation
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            moveLimelight(currentActive, false);
        });
    });

    // Attach click listeners to update the indicator visually before page transitions
    items.forEach(item => {
        item.addEventListener('click', function(e) {
            currentActive = this;
            moveLimelight(this, true);
        });
    });

    // Handle resize events to keep indicator positioned correctly
    window.addEventListener('resize', () => {
        // We use requestAnimationFrame to debounce slightly
        requestAnimationFrame(() => {
            moveLimelight(currentActive, false);
        });
    });
    
    window.addEventListener('orientationchange', () => {
        setTimeout(() => moveLimelight(currentActive, false), 100);
    });
});
