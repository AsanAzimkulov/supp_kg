

const getProductInfo = (product) => {
  const productInfo = {
    name: product.getAttribute('data-name'),
    price: product.getAttribute('data-price'),
    id: product.getAttribute('data-id'),
    imageUrl: product.getAttribute('data-image-url'),
    description: product.getAttribute('data-info'),
  };
  return productInfo
}

const clearProductPage = () => {
  $("#product-popup .product-popup__title, #product-popup .product-popup__description").empty();
  $("#product-popup .product-popup__image").attr('src', '#')
}

const generateProductPage = (product) => {
  const { translateBreaksToHtml } = utils;

  const formatedTitle = translateBreaksToHtml(product.name);

  const formatedDescription = translateBreaksToHtml(product.description);



  const productTitle = $('#product-popup .product-popup__title');
  productTitle.append(formatedTitle);

  const productDescription = $('#product-popup .product-popup__description');
  productDescription.append(formatedDescription);

  const productImage = $('#product-popup .product-popup__image');

  productImage.attr('src', product.imageUrl)

};

$('.product .open-product-page').on('click', function (e) {
  e.preventDefault();
})

$('.product').on('click', function (e) {
  if (e.target.classList.contains('product-title') || e.target.classList.contains('product-image')) {
    generateProductPage(getProductInfo(this));

    $('body').addClass('overlay');
    $('body').addClass('overflow-y-hidden');
    $('#product-popup').addClass('d-block')
    $('.navbar').addClass("navbar-hidden");

    $('#app-overlay, .close-white-popup').on('click', function () {
      $('#product-popup').removeClass('d-block');
      $('body').removeClass('overflow-y-hidden');
      clearProductPage();
    })
  } else {
    e.stopImmediatePropagation();
  }

}).on('click', 'div', function (e) {
  // clicked on descendant div

  e.stopPropagation();
});

