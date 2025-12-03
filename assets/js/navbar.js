// Navbar configuration
const navbarHTML = `
    <nav class="nav-links">
        <a href="about.html" data-page="about.html">Qui nous sommes</a>
        <a href="expertise.html" data-page="expertise.html">Expertises</a>
        <a href="join.html" data-page="join.html">Nous rejoindre</a>
        <a href="contact.html" class="nav-cta" data-page="contact.html">Nous contacter</a>
    </nav>
`;

// Function to initialize navbar
function initNavbar() {
    const navContainer = document.getElementById('nav-container');
    if (!navContainer) return;
    
    // Insert navbar HTML
    navContainer.innerHTML = navbarHTML;
    
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Set active class on current page link
    const links = navContainer.querySelectorAll('a[data-page]');
    links.forEach(link => {
        if (link.getAttribute('data-page') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Initialize navbar when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbar);
} else {
    initNavbar();
}
