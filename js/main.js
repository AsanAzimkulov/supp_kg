$(".fixed-cart").on('click', function () {
  $('.navbar').addClass('navbar-mobile-hidden')
  $('.cart-wrapper').addClass('d-block');
  $('body').addClass("overlay");
  $('body').addClass('overflow-y-hidden');
});

$(".cart-wrapper, .close-cart").on('click', function () {
  $('.navbar').removeClass('navbar-mobile-hidden')
  $('.cart-wrapper').removeClass('d-block');
  $('body').removeClass("overlay");
  $('body').removeClass('overflow-y-hidden');
});

$('.cart').on("click", (e) => e.stopPropagation())

$("#to-checkout").click(function () {
  $('.navbar').removeClass('navbar-mobile-hidden')
  $('.cart-wrapper').removeClass('d-block');
  const offset = $('#contact').offset();
  $('html, body').animate({
    scrollTop: offset.top,
    scrollLeft: offset.left
  });
  $('body').removeClass("cart-overlay");
  $('body').removeClass('overflow-y-hidden');
});


$('#app-overlay').on('click', function () {
  $('body').removeClass('overlay');
})
