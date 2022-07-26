$('#contact-form-error-popup .socials-fix a').on("click", function (e) {
  e.preventDefault();
  const cart = utils.getStringifiedCart();
  const href = e.currentTarget.getAttribute('href');
  e.currentTarget.setAttribute('href', href + cart);
  window.location.href = href + cart;

})
