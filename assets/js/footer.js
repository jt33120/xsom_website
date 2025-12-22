// Footer configuration
const footerHTML = `
    <div class="wrapper footer-inner">
        <div class="footer-copyright" data-t="copyright">© xSOM Consulting – Tous droits réservés.</div>
        <div class="footer-links">
            <a href="cookies.html" data-t="legal">Mentions légales | Utilisation des cookies</a>
            <span class="footer-separator">•</span>
            <a href="https://www.linkedin.com/company/xsom-consulting" target="_blank" rel="noopener noreferrer" class="footer-linkedin" data-t="linkedin">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 0.3rem;">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Suivez-nous sur LinkedIn
            </a>
        </div>
    </div>
`;

const footerTranslations = {
    fr: {
        copyright: "© xSOM Consulting – Tous droits réservés.",
        legal: "Mentions légales | Utilisation des cookies",
        linkedin: "Suivez-nous sur LinkedIn"
    },
    en: {
        copyright: "© xSOM Consulting – All rights reserved.",
        legal: "Legal notice | Cookie policy",
        linkedin: "Follow us on LinkedIn"
    }
};

function getLang() {
    return localStorage.getItem('lang') || 'fr';
}

function translateFooter(lang) {
    const footer = document.querySelector('footer');
    if (!footer) return;
    footer.querySelectorAll('[data-t]').forEach(el => {
        const key = el.getAttribute('data-t');
        if (footerTranslations[lang] && footerTranslations[lang][key]) {
            el.textContent = footerTranslations[lang][key];
        }
    });
}

// Function to initialize footer
function initFooter() {
    const footer = document.querySelector('footer');
    if (!footer) return;
    
    // Insert footer HTML
    footer.innerHTML = footerHTML;
    translateFooter(getLang());
    window.addEventListener('storage', () => translateFooter(getLang()));
}

// Initialize footer when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooter);
} else {
    initFooter();
}
