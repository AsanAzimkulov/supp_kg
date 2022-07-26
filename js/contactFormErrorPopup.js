$('#contact-form-error-popup .socials-fix a').on("click", function (e) {
  e.preventDefault();
  const cart = utils.getStringifiedCart();
  const href = e.currentTarget.getAttribute('href');
  if (href.includes("telegram") || href.includes("instagram")) { //not supported direct message link
    utils.copyText(cart, 'Корзина скопирована')
    setTimeout(() => window.location.href = href, 700)
  } else {
    e.currentTarget.setAttribute('href', href + cart);
    window.location.href = href + cart;
  }
})

$('#contact-form-error-popup .marked').on('click', function () {
  const cart = utils.getStringifiedCart();
  utils.copyText(cart, 'Корзина скопирована')
})

$('#contact-form-error-popup .close-white-popup').on('click', () => {
  $('#contact-form-error-popup').removeClass('d-block');
})

$('#app-overlay').on('click', function () {
  $('#contact-form-error-popup').removeClass('d-block');
})

