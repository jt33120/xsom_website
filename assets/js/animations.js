/**
 * xSOM Consulting - Premium Animations
 * Professional scroll animations and interactive effects
 */

(function() {
    'use strict';

    // =====================================================
    // SCROLL REVEAL ANIMATIONS
    // =====================================================
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: unobserve after animation
                // revealOnScroll.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate on scroll
    const animateElements = [
        '.section-header',
        '.expertise-card',
        '.card',
        '.metric',
        '.highlight-box',
        '.form-card',
        '.sectors-box',
        '.missions-box',
        '.list-check-modern li',
        '.slide'
    ];

    function initScrollAnimations() {
        animateElements.forEach(selector => {
            document.querySelectorAll(selector).forEach((el, index) => {
                el.classList.add('animate-on-scroll');
                el.style.transitionDelay = `${index * 0.1}s`;
                revealOnScroll.observe(el);
            });
        });
    }

    // =====================================================
    // HEADER SCROLL EFFECT
    // =====================================================
    
    function initHeaderScroll() {
        const header = document.querySelector('header');
        if (!header) return;

        let lastScroll = 0;
        const scrollThreshold = 50;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }

    // =====================================================
    // SMOOTH COUNTER ANIMATION
    // =====================================================
    
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeOut);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        requestAnimationFrame(updateCounter);
    }

    function initCounterAnimations() {
        const counters = document.querySelectorAll('[data-counter]');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.counter, 10);
                    animateCounter(entry.target, target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    // =====================================================
    // PARALLAX EFFECT FOR HERO
    // =====================================================
    
    function initParallax() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            hero.style.backgroundPositionY = `calc(center + ${rate}px)`;
        }, { passive: true });
    }

    // =====================================================
    // SMOOTH HOVER EFFECTS FOR CARDS
    // =====================================================
    
    function initCardHoverEffects() {
        const cards = document.querySelectorAll('.expertise-card, .card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }

    // =====================================================
    // MAGNETIC BUTTON EFFECT
    // =====================================================
    
    function initMagneticButtons() {
        const buttons = document.querySelectorAll('.btn-primary, .btn-large');
        
        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });
    }

    // =====================================================
    // TYPING EFFECT FOR HERO (optional)
    // =====================================================
    
    function initTypingEffect() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle || heroTitle.dataset.typed) return;
        
        // Mark as processed
        heroTitle.dataset.typed = 'true';
    }

    // =====================================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // =====================================================
    
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // =====================================================
    // STAGGER ANIMATION FOR GRID ITEMS
    // =====================================================
    
    function initStaggerAnimations() {
        const grids = document.querySelectorAll('.expertise-grid, .card-grid, .metrics-grid');
        
        grids.forEach(grid => {
            const items = grid.children;
            Array.from(items).forEach((item, index) => {
                item.style.animationDelay = `${index * 0.15}s`;
            });
        });
    }

    // =====================================================
    // PROGRESS BAR ON SCROLL
    // =====================================================
    
    function initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
        document.body.appendChild(progressBar);

        const bar = progressBar.querySelector('.scroll-progress-bar');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            bar.style.width = `${scrollPercent}%`;
        }, { passive: true });
    }

    // =====================================================
    // LAZY LOAD IMAGES
    // =====================================================
    
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // =====================================================
    // INITIALIZE ALL ANIMATIONS
    // =====================================================
    
    function init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAll);
        } else {
            initAll();
        }
    }

    function initAll() {
        initScrollAnimations();
        initHeaderScroll();
        initParallax();
        initCardHoverEffects();
        initSmoothScroll();
        initStaggerAnimations();
        initLazyLoading();
        
        // Optional advanced effects (can be disabled for performance)
        // initMagneticButtons();
        // initScrollProgress();
        // initCounterAnimations();
    }

    // Start initialization
    init();

    // Expose for external use if needed
    window.xsomAnimations = {
        animateCounter,
        initScrollAnimations
    };

})();
