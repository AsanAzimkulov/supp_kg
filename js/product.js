const currentProduct = {};

const getProductInfo = (product) => {
  const productInfo = {
    dataName: product.getAttribute('data-name'),
    dataPrice: product.getAttribute('data-price'),
    dataId: product.getAttribute('data-id'),
    dataImageUrl: product.getAttribute('data-image-url'),
  };
  return productInfo
}

const generateProductPage = () => {
  const productPage = $('#product-popup');
  
};


$('.product').on('click', function (e) {
  if (e.target.classList.contains('product-title') || e.target.classList.contains('product-image')) {
    currentProduct.current = getProductInfo(this);
    console.log(currentProduct);
    generateProductPage();
    $('body').addClass('overlay');
  } else {
    e.stopImmediatePropagation();
  }

}).on('click', 'div', function (e) {
  // clicked on descendant div

  e.stopPropagation();
});

