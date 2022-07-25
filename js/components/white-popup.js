$('.close-white-popup').on('click', function () {
  $('body').removeClass('overlay');
  $('.white-popup-wrapper').addClass('d-none');
  $('.navbar').removeClass('navbar-hidden');
})