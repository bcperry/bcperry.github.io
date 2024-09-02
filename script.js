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

function initializeMenuToggle() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            
            const expanded = this.getAttribute('aria-expanded') === 'true' || false;
            this.setAttribute('aria-expanded', !expanded);
        });
    }
}

function applyProductDescriptions(productDescriptions) {
    document.querySelectorAll('.product-list a').forEach(link => {
        const href = link.getAttribute('href').split('#').pop();
        const key = `#${href}`;
        const description = productDescriptions[key] || 'No description available';
        // console.log(href, key, description)
        link.setAttribute('data-description', description);
    });
}

function fetchProductDescriptions() {
    fetch('../site-information/products.json')
        .then(response => response.json())
        .then(data => {
            const productDescriptions = {};
            for (const section in data) {
                if (data.hasOwnProperty(section)) {
                    data[section].forEach(product => {
                        const key = `#${product.name.toLowerCase().replace(/\s+/g, '-')}`;
                        productDescriptions[key] = product.tagline;
                    });
                }
            }
            applyProductDescriptions(productDescriptions);
            // console.log('Loaded product descriptions:', productDescriptions);
        })
        .catch(error => {
            console.error('Error loading product descriptions:', error);
            applyProductDescriptions({});
        });
}

function handleHeaderVisibility() {
    let lastScrollTop = 0;
    let header = null;

    return function() {
        if (!header) {
            header = document.getElementById('main-header');
            if (!header) return; // Exit if header is still not found
        }

        const headerHeight = header.offsetHeight;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > headerHeight) {
            // Scrolling down
            header.classList.add('hidden');
        } else if (scrollTop < lastScrollTop) {
            // Scrolling up
            header.classList.remove('hidden');
        }
        lastScrollTop = scrollTop;
    };
}

function smoothScroll(target) {
    const element = document.querySelector(target);
    window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
    });
}

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

            handleScrollAnimation();
        })
        .catch(error => console.error('Error loading product data:', error));
}

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

function loadHeader() {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            initializeMenuToggle();
            // Add scroll event listener after header is loaded
            window.addEventListener('scroll', handleHeaderVisibility());
        })
        .catch(error => console.error('Error loading header:', error));
}

function loadFooter() {
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    loadHeader();
    loadFooter();
    populateProductsAndServices();
    fetchProductDescriptions();

    if (document.querySelector('#product-hero')) {
        populateProductPage();
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            smoothScroll(this.getAttribute('href'));
        });
    });

    initializeMenuToggle();
    handleScrollAnimation();
});

window.addEventListener('scroll', function() {
    if (window.innerWidth <= 768) {
        const mainNav = document.querySelector('.main-nav');
        const menuToggle = document.querySelector('.menu-toggle');
        mainNav.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
});

window.addEventListener('load', handleScrollAnimation);
window.addEventListener('load', handleStickyHeaders);
