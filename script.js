function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    const threshold = 0.2;
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * (1 - threshold) &&
        rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) * threshold
    );
}

function handleScrollAnimation() {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => {
        if (isElementInViewport(el)) {
            el.classList.add('visible');
        } else {
            el.classList.remove('visible');
        }
    });
}

// Add event listeners for scroll and load events
window.addEventListener('scroll', handleScrollAnimation);
window.addEventListener('load', handleScrollAnimation);

// Handle sticky headers
function handleStickyHeaders() {
    const sectionHeaders = document.querySelectorAll('.section-header');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    entry.target.classList.add('sticky');
                } else {
                    entry.target.classList.remove('sticky');
                }
            });
        },
        { threshold: 1 }
    );

    sectionHeaders.forEach(header => observer.observe(header));
}

window.addEventListener('load', handleStickyHeaders);

// Handle menu toggle and navigation
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
        
        const expanded = this.getAttribute('aria-expanded') === 'true' || false;
        this.setAttribute('aria-expanded', !expanded);
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!menuToggle.contains(e.target) && !mainNav.contains(e.target)) {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Add descriptions to product links
    const productDescriptions = {
        '#panoptes': 'Advanced surveillance systems for enhanced situational awareness.',
        '#janus': 'Generate high-quality knowledge graphs to identify connections and networks.',
        '#laelaps': 'Convert unguided rockets into guided missiles for any target.',
        '#wearable': 'Proactive cybersecurity solutions to protect against emerging threats.',
        '#services': 'AI/ML testing, development, and deployment services.',
        'team.html': 'Meet our founders and team members.'
    };

    document.querySelectorAll('.product-list a').forEach(link => {
        link.setAttribute('data-description', productDescriptions[link.getAttribute('href')]);
    });
});

// Handle mobile menu closing on scroll
window.addEventListener('scroll', function() {
    if (window.innerWidth <= 768) {
        const mainNav = document.querySelector('.main-nav');
        const menuToggle = document.querySelector('.menu-toggle');
        mainNav.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
});

// Handle header visibility on scroll
let lastScrollTop = 0;
const header = document.getElementById('main-header');
const headerHeight = header.offsetHeight;

function handleHeaderVisibility() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > headerHeight) {
        // Scrolling down & past the header
        header.classList.add('hidden');
    } else {
        // Scrolling up
        header.classList.remove('hidden');
    }
    
    lastScrollTop = scrollTop;
}

window.addEventListener('scroll', handleHeaderVisibility);
