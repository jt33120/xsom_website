// Navbar configuration
const navbarHTML = `
    <nav class="nav-links">
        <a href="about.html" data-page="about.html" data-t="about">Qui nous sommes</a>
        <a href="vision.html" data-page="vision.html" data-t="vision">Vision</a>
        <a href="expertise.html" data-page="expertise.html" data-t="expertise">Expertises</a>
        <a href="join.html" data-page="join.html" data-t="join">Nous rejoindre</a>
        <a href="contact.html" class="nav-cta" data-page="contact.html" data-t="contact">Nous contacter</a>
        <div class="lang-switcher">
            <button data-lang="fr" class="lang-btn">FR</button>
            <button data-lang="en" class="lang-btn">EN</button>
        </div>
    </nav>
`;

const translations = {
    fr: {
        about: "Qui nous sommes",
        vision: "Vision",
        expertise: "Expertises",
        join: "Nous rejoindre",
        contact: "Nous contacter"
    },
    en: {
        about: "About us",
        vision: "Vision",
        expertise: "Expertise",
        join: "Join us",
        contact: "Contact us"
    }
};

function getLang() {
    return localStorage.getItem('lang') || 'fr';
}

function setLang(lang) {
    localStorage.setItem('lang', lang);
    document.documentElement.setAttribute('lang', lang);
}

function translateNavbar(lang) {
    const navContainer = document.getElementById('nav-container');
    if (!navContainer) return;
    navContainer.querySelectorAll('[data-t]').forEach(el => {
        const key = el.getAttribute('data-t');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
    navContainer.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
}

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

    // Language switcher
    const lang = getLang();
    setLang(lang);
    translateNavbar(lang);

    navContainer.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLang(lang);
            translateNavbar(lang);
            // Optionally reload page for full translation
            if (typeof window.translatePage === 'function') window.translatePage(lang);
        });
    });
}

// Initialize navbar when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbar);
} else {
    initNavbar();
}
