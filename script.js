window.addEventListener('scroll', function() {
  const products = document.querySelector('.products');
  const productsTop = products.offsetTop;
  const scrollPosition = window.scrollY;

  Array.from(products.children).forEach((product, index) => {
    if (scrollPosition >= productsTop + (index * 150)) {
      product.style.opacity = "1";
    }
  });
});
