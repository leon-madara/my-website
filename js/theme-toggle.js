// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const themeToggleSimple = document.getElementById('themeToggleSimple');

// Check for saved theme preference or default to 'day'
const currentTheme = localStorage.getItem('theme') || 'day';

// Apply saved theme on load
if (currentTheme === 'night') {
    if (themeToggle) themeToggle.classList.add('night');
    document.body.classList.add('dark-theme');
}

// Shared function to toggle theme
function toggleTheme() {
    const isNight = document.body.classList.contains('dark-theme');
    
    if (isNight) {
        // Switch to day
        document.body.classList.remove('dark-theme');
        if (themeToggle) themeToggle.classList.remove('night');
        localStorage.setItem('theme', 'day');
    } else {
        // Switch to night
        document.body.classList.add('dark-theme');
        if (themeToggle) themeToggle.classList.add('night');
        localStorage.setItem('theme', 'night');
    }
}

// Toggle theme on elaborate toggle click (desktop)
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Toggle theme on simple toggle click (mobile)
if (themeToggleSimple) {
    themeToggleSimple.addEventListener('click', toggleTheme);
}
