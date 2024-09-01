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
    let productDescriptions = {};

    fetch('../site-information/products.json')
        .then(response => response.json())
        .then(data => {
            productDescriptions = {};
            for (const section in data) {
                if (data.hasOwnProperty(section)) {
                    console.log(section);
                    data[section].forEach(product => {
                        const key = `#${product.name.toLowerCase().replace(/\s+/g, '-')}`;
                        productDescriptions[key] = product.tagline;
                    });
        
                }
            }
            
            applyProductDescriptions();
            console.log('Loaded product descriptions:', productDescriptions);
        })
        .catch(error => {
            console.error('Error loading product descriptions:', error);
            // Fallback to default descriptions if JSON fails to load
            applyProductDescriptions();
        });

    function applyProductDescriptions() {
        document.querySelectorAll('.product-list a').forEach(link => {
            const href = link.getAttribute('href').split('#')[1];
            const key = `#${href}`;
            const description = productDescriptions[key] || 'No description available';
            link.setAttribute('data-description', description);
        });
    }

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

// Fade-in animation
function handleScrollAnimation() {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        if (rect.top <= windowHeight * 0.75) {
            el.classList.add('visible');
        }
    });
}

// Smooth scrolling for anchor links
function smoothScroll(target) {
    const element = document.querySelector(target);
    window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Handle scroll animation
    window.addEventListener('scroll', handleScrollAnimation);
    handleScrollAnimation();

    // Handle smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            smoothScroll(this.getAttribute('href'));
        });
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
    });
});

// Function to populate product and service information
function populateProductsAndServices() {
    fetch('../site-information/products.json')
        .then(response => response.json())
        .then(data => {
            const productsContainer = document.getElementById('products');
            const servicesContainer = document.getElementById('services');

            if (productsContainer) {
                data.Products.forEach((product, index) => {
                    const productHTML = `
                        <article id="${product.name.toLowerCase().replace(/\s+/g, '-')}" class="product-item ${index % 2 === 1 ? 'reverse' : ''}">
                            <div class="product-image" style="background-image: url('images/${product.name.toLowerCase().replace(/\s+/g, '-')}.jpg');"></div>
                            <div class="product-content">
                                <h2 class="fade-in">${product.name}</h2>
                                <p class="fade-in">${product.tagline}</p>
                                <a href="pages/${product.name.toLowerCase().replace(/\s+/g, '-')}.html" class="btn fade-in">Learn More</a>
                            </div>
                        </article>
                    `;
                    productsContainer.innerHTML += productHTML;
                });
            }

            if (servicesContainer) {
                data.Services.forEach((service, index) => {
                    const serviceHTML = `
                        <article id="${service.name.toLowerCase().replace(/\s+/g, '-')}" class="product-item ${index % 2 === 0 ? 'reverse' : ''}">
                            <div class="product-image" style="background-image: url('images/${service.name.toLowerCase().replace(/\s+/g, '-')}.jpg');"></div>
                            <div class="product-content">
                                <h2 class="fade-in">${service.name}</h2>
                                <p class="fade-in">${service.tagline}</p>
                                <a href="pages/${service.name.toLowerCase().replace(/\s+/g, '-')}.html" class="btn fade-in">Learn More</a>
                            </div>
                        </article>
                    `;
                    servicesContainer.innerHTML += serviceHTML;
                });
            }

            // After populating, reinitialize the fade-in effect
            handleScrollAnimation();
        })
        .catch(error => console.error('Error loading product data:', error));
}

// Call the function when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    populateProductsAndServices();
    // ... (existing code) ...
});

// Add this function to the existing script.js file

function populateProductPage() {
    const productName = window.location.pathname.split('/').pop().replace('.html', '');
    fetch('../site-information/products.json')
        .then(response => response.json())
        .then(data => {
            const product = data.Products.find(p => p.name.toLowerCase().replace(/\s+/g, '-') === productName) ||
                            data.Services.find(s => s.name.toLowerCase().replace(/\s+/g, '-') === productName);
            if (product) {
                document.title = `${product.name} | Argus Defense`;
                document.querySelector('#product-hero h2').textContent = product.name;
                document.querySelector('#product-hero p').textContent = product.tagline;
                document.querySelector('#product-hero').style.backgroundImage = `url('../images/${productName}.jpg')`;
            }
        })
        .catch(error => console.error('Error loading product data:', error));
}

// Call this function when the DOM is loaded on product pages
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('#product-hero')) {
        populateProductPage();
    }
});
