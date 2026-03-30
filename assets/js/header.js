// Injects the xSOM header into the page
// Injects the xSOM header and its styles into the page
(function() {
  var headerStyle = `
header{position:fixed;top:0;left:0;width:100%;z-index:100;height:var(--hh);background:rgba(10,22,40,.8);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid var(--border-s);transition:background .4s}
header.scrolled{background:rgba(10,22,40,.95)}
.nb{display:flex;align-items:center;justify-content:space-between;height:var(--hh)}
.lo{display:flex;align-items:center;gap:.55rem}
.lo img{width:32px;height:32px;object-fit:contain}
.lo-t a{font-size:1rem;font-weight:700;color:var(--white);letter-spacing:-.01em}
.lo-t span{display:block;font-size:.58rem;text-transform:uppercase;letter-spacing:.14em;color:var(--text-dim);font-weight:600;margin-top:1px}
nav{display:flex;align-items:center}
nav a{padding:.4rem .75rem;font-size:.78rem;font-weight:500;color:var(--text-mid);transition:color .2s}
nav a:hover,nav a.active{color:var(--white)}
.nc{margin-left:.5rem;padding:.38rem .95rem;border:1px solid var(--border-m);border-radius:999px;font-size:.74rem;font-weight:600;color:var(--white);transition:all .25s var(--ease)}
.nc:hover{background:var(--white);color:var(--navy)}
.mt{display:none;background:none;border:none;color:var(--white);cursor:pointer;padding:.5rem}
`;
  var headerHTML = `
<header id="sh">
  <div class="w nb">
    <div class="lo">
      <img src="assets/images/LOGO_NOBG.PNG" alt="xSOM" style="width:32px;height:32px;max-width:32px;max-height:32px;min-width:32px;object-fit:contain;flex-shrink:0">
      <div class="lo-t"><a href="index.html">xSOM Consulting</a><span>Conseil en informatique</span></div>
    </div>
    <nav id="mn">
      <a href="index.html">Accueil</a>
      <a href="expertise.html">Expertises</a>
      <a href="ia.html">IA & Data</a>
      <a href="vision.html">Vision</a>
      <a href="about.html">Le cabinet</a>
      <a href="join.html">Carrières</a>
      <a href="contact.html" class="nc">Contact</a>
    </nav>
    <button class="mt" id="mt" aria-label="Menu"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
  </div>
</header>
`;

  // Insert header at the top of <body>
  document.addEventListener('DOMContentLoaded', function() {
    // Inject header styles if not already present
    if (!document.getElementById('xsom-header-style')) {
      var style = document.createElement('style');
      style.id = 'xsom-header-style';
      style.textContent = headerStyle;
      document.head.appendChild(style);
    }
    // Inject header HTML if not already present
    if (!document.body.querySelector('header#sh')) {
      document.body.insertAdjacentHTML('afterbegin', headerHTML);
    }
    // Menu toggle logic
    var t=document.getElementById('mt'),n=document.getElementById('mn');
    if(t&&n)t.addEventListener('click',function(){n.classList.toggle('open')});
    var h=document.getElementById('sh');
    window.addEventListener('scroll',function(){h.classList.toggle('scrolled',window.scrollY>50)},{passive:true});
    // Highlight current page in nav
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    var navLinks = document.querySelectorAll('header#sh nav a[href]');
    navLinks.forEach(function(link) {
      var href = link.getAttribute('href');
      if (href && href.toLowerCase() === currentPage.toLowerCase()) {
        link.classList.add('active');
      }
    });
  });
})();
