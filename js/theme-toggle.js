// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');

// Check for saved theme preference or default to 'day'
const currentTheme = localStorage.getItem('theme') || 'day';

// Apply saved theme on load
if (currentTheme === 'night') {
    themeToggle.classList.add('night');
    document.body.classList.add('dark-theme');
}

// Toggle theme on click
themeToggle.addEventListener('click', () => {
    themeToggle.classList.toggle('night');
    
    if (themeToggle.classList.contains('night')) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'night');
    } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'day');
    }
});
