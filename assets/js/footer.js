// Footer configuration (full corporate footer)
const footerHTML = `
<div class="w">
    <div class="fg">
        <div class="fb">
            <div class="lo"><img src="assets/images/LOGO.png" alt="xSOM" style="width:26px;height:26px"><div class="lo-t"><a href="index.html">xSOM Consulting</a></div></div>
            <p>Cabinet de conseil en informatique. Stratégie, cybersécurité, infrastructures IA et Data Science.</p>
        </div>
        <div class="fl">
            <div><h5>Expertises</h5><ul><li><a href="expertise.html">Télécom & Cyber</a></li><li><a href="ia.html">IA & Data Science</a></li><li><a href="vision.html">Vision & Mission</a></li></ul></div>
            <div><h5>Cabinet</h5><ul><li><a href="about.html">Qui nous sommes</a></li><li><a href="join.html">Nous rejoindre</a></li><li><a href="contact.html">Contact</a></li></ul></div>
        </div>
    </div>
    <div class="fbot"><span>© 2026 xSOM Consulting. Tous droits réservés.</span><span>Paris · France · USA</span></div>
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

// Injects the full footer and its styles
function injectFooterStyles() {
    if (!document.getElementById('xsom-footer-style')) {
        var style = document.createElement('style');
        style.id = 'xsom-footer-style';
        style.textContent = `
footer{padding:2.5rem 0 1.5rem;border-top:1px solid var(--border-s)}
.fg{display:flex;justify-content:space-between;align-items:start;gap:2rem;flex-wrap:wrap}
.fb p{font-size:.76rem;color:var(--text-dim);max-width:250px;margin-top:.55rem;line-height:1.5}
.fl{display:flex;gap:2.5rem}
.fl h5{font-size:.62rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text-dim);margin-bottom:.55rem}
.fl ul{display:flex;flex-direction:column;gap:.28rem}
.fl a{font-size:.8rem;color:var(--text-mid);transition:color .2s}
.fl a:hover{color:var(--white)}
.fbot{margin-top:2rem;padding-top:1.15rem;border-top:1px solid var(--border-s);display:flex;justify-content:space-between;font-size:.7rem;color:var(--text-dim)}
@media(max-width:768px){
.fg{flex-direction:column}.fl{flex-direction:column;gap:1rem}
.fbot{flex-direction:column;gap:.4rem;text-align:center}
}
`;
        document.head.appendChild(style);
    }
}

function initFooter() {
    const footer = document.querySelector('footer');
    if (!footer) return;
    injectFooterStyles();
    footer.innerHTML = footerHTML;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooter);
} else {
    initFooter();
}
