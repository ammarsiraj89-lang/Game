// Navigation Toggle Logic
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.getElementById('navLinks');

mobileMenu.addEventListener('click', () => {
    // Toggle 'active' class on the menu links
    navLinks.classList.toggle('active');
    
    // Animate the hamburger icon (optional but professional)
    mobileMenu.classList.toggle('is-active');
});

// Close menu when a link is clicked (useful for mobile UX)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});