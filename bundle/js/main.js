const utils = {
  translateBreaksToHtml(str) {
    return str = str.replace(/(\r\n|\n|\r)/g, "<br />");
  },
  copyLink(url) {
    navigator.clipboard.writeText(url);
    Toastify({
      text: "Ссылка была скопирована",
      className: "info",
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
        marginTop: '50px'
      }
    }).showToast();
  },
  copyText(text, message) {
    navigator.clipboard.writeText(text);
    Toastify({
      text: message,
      className: "info",
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
        marginTop: '50px'
      }
    }).showToast();
  },
  getStringifiedCart() {
    const cartJson = window.localStorage.getItem('cart');
    if (cartJson) {
      const cartObjects = JSON.parse(cartJson);
      const total = cartObjects.reduce((acc, obj) => (obj.total + acc), 0);
      const objectsInfo = cartObjects.map((obj, order, arr) => {
        let stringifiedInfo = 'Наименование товара: ' + obj.name + ', количество: ' + obj.count + 'шт/' + (obj.count * obj.price) + 'сом (Цена 1шт - ' + obj.price + 'сом)';
        if (order < (arr.length - 1)) {
          stringifiedInfo += ';';
        } else {
          stringifiedInfo += '.';
        }

        return stringifiedInfo;
      });
      objectsInfo.push('Стоимость заказа: ' + total + 'сом.');
      return objectsInfo.join('\n');
    } else {
      return 'Корзина пуста.'
    }
  },
  getStringifiedShortCart() {
    const cartJson = window.localStorage.getItem('cart');
    if (cartJson) {
      const cartObjects = JSON.parse(cartJson);
      const total = cartObjects.reduce((acc, obj) => (obj.total + acc), 0);
      const objectsInfo = cartObjects.map((obj, order, arr) => {
        let stringifiedInfo = 'id: ' + order + '/ ' + obj.count + 'шт/' + (obj.count * obj.price) + 'сом (1шт/' + obj.price + 'сом)';
        if (order < (arr.length - 1)) {
          stringifiedInfo += ';';
        } else {
          stringifiedInfo += '.';
        }

        return stringifiedInfo;
      });
      objectsInfo.push('Стоимость заказа: ' + total + 'сом.');
      return objectsInfo.join('\n');
    } else {
      return 'Корзина пуста.'
    }
  },
  insertCartInLink(link) {
    const cart = utils.getStringifiedCart();
    return link + cart;
  },
};



/*

  Author: Mihovil Ilakovac (infomiho)
  Used: javascript + underscore.js (for templating), Foundation 5 (design)
  
  It's based on a simple idea, to minimize requests to the server and only send the final cart to the server for evaluation and payment.

*/
var cartId = "cart";
var currency = 'сом';

var localAdapter = {

  saveCart: function (object) {

    var stringified = JSON.stringify(object);
    localStorage.setItem(cartId, stringified);
    return true;

  },
  getCart: function () {

    return JSON.parse(localStorage.getItem(cartId));

  },
  clearCart: function () {

    localStorage.removeItem(cartId);

  }

};

var ajaxAdapter = {

  saveCart: function (object) {

    var stringified = JSON.stringify(object);
    // do an ajax request here

  },
  getCart: function () {

    // do an ajax request -- recognize user by cookie / ip / session
    return JSON.parse(data);

  },
  clearCart: function () {

    //do an ajax request here

  }

};

var storage = localAdapter;

var helpers = {

  getHtml: function (id) {

    return document.getElementById(id).innerHTML;

  },
  setHtml: function (id, html) {

    document.getElementById(id).innerHTML = html;
    return true;

  },
  itemData: function (object) {
    var count = object.querySelector(".count"),
      patt = new RegExp("^[1-9]([0-9]+)?$");
    count.value = (patt.test(count.value) === true) ? parseInt(count.value) : 1;

    var item = {

      name: object.getAttribute('data-name'),
      price: object.getAttribute('data-price'),
      imageUrl: object.getAttribute('data-image-url'),
      id: object.getAttribute('data-id'),
      count: count.value,
      total: parseInt(object.getAttribute('data-price')) * parseInt(count.value)

    };
    return item;

  },
  updateView: function () {

    var items = cart.getItems(),
      template = this.getHtml('cartT'),
      compiled = _.template(template, {
        items: items
      });
    this.setHtml('cartItems', compiled);
    this.updateTotal();

  },
  emptyView: function () {

    this.setHtml('cartItems', '<p class="cart-empty-title">Корзина пуста</p>');
    this.updateTotal();

  },
  updateTotal: function () {

    this.setHtml('totalPrice', cart.total + currency);

  }

};

var cart = {

  count: 0,
  total: 0,
  items: [],
  getItems: function () {

    return this.items;

  },
  setItems: function (items) {

    this.items = items;
    for (var i = 0; i < this.items.length; i++) {
      var _item = this.items[i];
      this.total += _item.total;
    }

  },
  clearItems: function () {

    this.items = [];
    this.total = 0;
    storage.clearCart();
    helpers.emptyView();

  },
  addItem: function (item) {

    if (this.containsItem(item.id) === false) {

      this.items.push({
        id: item.id,
        imageUrl: item.imageUrl,
        name: item.name,
        price: item.price,
        count: item.count,
        total: item.price * item.count
      });

      storage.saveCart(this.items);


    } else {

      this.updateItem(item);

    }
    this.total += item.price * item.count;
    this.count += item.count;
    helpers.updateView();

  },
  containsItem: function (id) {

    if (this.items === undefined) {
      return false;
    }

    for (var i = 0; i < this.items.length; i++) {

      var _item = this.items[i];

      if (id == _item.id) {
        return true;
      }

    }
    return false;

  },
  updateItem: function (object) {

    for (var i = 0; i < this.items.length; i++) {

      var _item = this.items[i];

      if (object.id === _item.id) {

        _item.count = parseInt(object.count) + parseInt(_item.count);
        _item.total = parseInt(object.total) + parseInt(_item.total);
        _item.imageUrl = object.imageUrl
        this.items[i] = _item;
        storage.saveCart(this.items);

      }

    }

  }

};

document.addEventListener('DOMContentLoaded', function () {

  if (storage.getCart()) {

    cart.setItems(storage.getCart());
    helpers.updateView();

  } else {

    helpers.emptyView();

  }
  var products = document.querySelectorAll('.product-add-to-cart-button');
  [].forEach.call(products, function (product) {

    product.addEventListener('click', function (e) {

      var item = helpers.itemData(this.parentNode);
      cart.addItem(item);


    });

  });

  document.querySelector('#clear').addEventListener('click', function (e) {

    cart.clearItems();

  });


});$('#contact-form-error-popup .socials-fix a').on("click", function (e) {
  e.preventDefault();
  const cart = utils.getStringifiedShortCart();

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



window.onload = function () {
  window.emailJsAccounts = {
    dev: {
      publicKey: 'vqBagreTqyIsDjOsq',
      serviceId: 'service_9mt3fe5',
      templateId: 'template_w7s8t38'
    },
    prod: {
      publicKey: 'objDnN9KLt6PMPx-O',
      serviceId: 'service_shnb0y3',
      templateId: 'template_n5c9a8q',
    }
  }

  emailjs.init(window.emailJsAccounts.dev.publicKey);

  document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault();


    const account = window.emailJsAccounts.prod;
    const data = {
      template_params: {},
    };
    const form = this;

    cartJson = window.localStorage.getItem('cart');
    if (cartJson) {
      const cartObjects = JSON.parse(cartJson);
      const total = cartObjects.reduce((acc, obj) => (obj.total + acc), 0);
      const objectsInfo = cartObjects.map((obj, order, arr) => {
        let stringifiedInfo = `Наименование товара: ${obj.name}, количество: ${obj.count}шт/${obj.count * obj.price}сом (Цена 1шт - ${obj.price}сом)`;
        if (order < (arr.length - 1)) {
          stringifiedInfo += ';';
        } else {
          stringifiedInfo += '.';
        }

        return stringifiedInfo;
      })
      objectsInfo.push(`Стоимость заказа: ${total}сом.`)
      objectsInfoStringified = objectsInfo.join('\n');
      data.template_params['cart'] = objectsInfoStringified;
    } else {
      data.template_params['cart'] = 'Корзина пуста.';
    }



    data.template_params['customer_name'] = form.querySelector('.customer-name').value || 'Имя не указано.';
    data.template_params['contact_way'] = form.querySelector('.contact-way').value;
    data.template_params['message'] = form.querySelector('.message').value || 'сообщение не оставлено.';

    data['service_id'] = account.serviceId;
    data['template_id'] = account.templateId;
    data['user_id'] = account.publicKey;

    $.ajax('https://api.emailjs.com/api/v1.0/email/send', {
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json', // auto-detection
    }).done(function () {
      console.log('SUCCESS!');
      Toastify({
        text: "Вы успешно сделали заказ!",
        className: "info",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
          marginTop: '50px'
        }
      }).showToast();
      form.reset();
      cart.clearItems();
    }).fail(function (error) {
      console.log('FAILED...', error.responseText);
      $('#contact-form-error-popup').addClass('d-block');
      $('body').addClass("overlay");
      $('body').addClass('overflow-y-hidden');
      $('.navbar').addClass('navbar-hidden')
      Toastify({
        text: "Что-то пошло не так. Свяжитесь с нами по телефону или в соцсетях.",
        className: "error",
        style: {
          background: 'linear-gradient(211deg, rgba(162,154,195,1) 0%, rgba(226,36,36,1) 100%)',
        }
      }).showToast();
      const cart = utils.getStringifiedCart();
      const href = e.currentTarget.getAttribute('href');
      $('#contact-form-error-popup .socials-fix a').each(function () {
        this.setAttribute('href', href + cart);
      })
    });
  });


  // emailjs.sendForm(accounts.dev.serviceId, accounts.dev.templateId, formData)
  //   .then(function () {
  //     console.log('SUCCESS!');
  //     Toastify({
  //       text: "Вы успешно сделали заказ!",
  //       className: "info",
  //       style: {
  //         background: "linear-gradient(to right, #00b09b, #96c93d)",
  //         marginTop: '50px'
  //       }
  //     }).showToast();

  //   }, function (error) {
  //     console.log('FAILED...', error);
  //     Toastify({
  //       text: "Что-то пошло не так. Свяжитесь с нами по телефону или в соцсетях.",
  //       className: "error",
  //       style: {
  //         background: 'linear-gradient(211deg, rgba(162,154,195,1) 0%, rgba(226,36,36,1) 100%)',
  //       }
  //     }).showToast();

  //   });
};

$(".fixed-cart").on('click', function () {
  $('.navbar').addClass('navbar-hidden')
  $('.cart-wrapper').addClass('d-block');
  $('body').addClass("overlay");
  $('body').addClass('overflow-y-hidden');
});

$(".cart-wrapper, .close-cart, #to-checkout").on('click', function () {
  $('.navbar').removeClass('navbar-hidden')
  $('.cart-wrapper').removeClass('d-block');
  $('body').removeClass("overlay");
  $('body').removeClass('overflow-y-hidden');
});

$('.cart').on("click", (e) => e.stopPropagation());

$("#to-checkout").click(function () {
  $('.navbar').removeClass('navbar-hidden')
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
  $('body').removeClass('overflow-y-hidden');
})


$('a.footer-link').on("click", function (e) {
  e.preventDefault();
  utils.copyLink(e.target.getAttribute('href'));
})

$('.btn-number').click(function (e) {
  e.preventDefault();

  fieldName = $(this).attr('data-field');
  type = $(this).attr('data-type');
  var input = $("input[name='" + fieldName + "']");
  var currentVal = parseInt(input.val());
  if (!isNaN(currentVal)) {
    if (type == 'minus') {

      if (currentVal > input.attr('min')) {
        input.val(currentVal - 1).change();
      }
      if (parseInt(input.val()) == input.attr('min')) {
        $(this).attr('disabled', true);
      }

    } else if (type == 'plus') {

      if (currentVal < input.attr('max')) {
        input.val(currentVal + 1).change();
      }
      if (parseInt(input.val()) == input.attr('max')) {
        $(this).attr('disabled', true);
      }

    }
  } else {
    input.val(0);
  }
});
$('.input-number').focusin(function () {
  $(this).data('oldValue', $(this).val());
});
$('.input-number').change(function () {

  minValue = parseInt($(this).attr('min'));
  maxValue = parseInt($(this).attr('max'));
  valueCurrent = parseInt($(this).val());

  name = $(this).attr('name');
  if (valueCurrent >= minValue) {
    $(".btn-number[data-type='minus'][data-field='" + name + "']").removeAttr('disabled')
  } else {
    alert('Извините, максимальное число для заказа - 100 штук. Если вы оптовый покупатель, свяжитесь с нами напрямую.');
    $(this).val($(this).data('oldValue'));
  }
  if (valueCurrent <= maxValue) {
    $(".btn-number[data-type='plus'][data-field='" + name + "']").removeAttr('disabled')
  } else {
    alert('Извините, максимальное число для заказа - 100 штук. Если вы оптовый покупатель, свяжитесь с нами напрямую.');
    $(this).val($(this).data('oldValue'));
  }


});
$(".input-number").keydown(function (e) {
  // Allow: backspace, delete, tab, escape, enter and .
  if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
    // Allow: Ctrl+A
    (e.keyCode == 65 && e.ctrlKey === true) ||
    // Allow: home, end, left, right
    (e.keyCode >= 35 && e.keyCode <= 39)) {
    // let it happen, don't do anything
    return;
  }
  // Ensure that it is a number and stop the keypress
  if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
    e.preventDefault();
  }
});


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
    document.getElementById('product-popup').scrollTo(0, 0);
    $('.navbar').addClass("navbar-hidden");

    $('#app-overlay, .close-white-popup').on('click', function () {
      $('#product-popup').removeClass('d-block');
      $('body').removeClass('overflow-y-hidden');
      clearProductPage();
    })
  } else {
    e.stopImmediatePropagation();
  }

})


$('.product-add-to-cart-button').on('click', function () {
  $('.fixed-cart').addClass('fixed-cart--shake');
})


'use strict';
// (function ($) {

$(function () {
  $('.owl-carousel-projects').owlCarousel({
    loop: true,
    stagePadding: 100,
    margin: 20,
    nav: false,
    responsive: {
      0: {
        items: 2
      },
      600: {
        items: 3
      },
      1000: {
        items: 4
      }
    }
  })
  var wWidth = $(window).width();
  var menuWidth = $(".navbar-collapse").width();
  $(".navbar-toggler").click(function () {
    $('.collapsing').toggleClass('show');
    $('.navbar').addClass('navbar-hidden')
    $('body').addClass("overlay");
    $('body').addClass('overflow-y-hidden');
  });
  $("#app-overlay, .close-menu, .nav-link, .close").click(function () {
    $('.collapse').removeClass('show');
    $('.navbar').removeClass('navbar-hidden')
    $('body').removeClass("overlay");
    $('body').removeClass('overflow-y-hidden');
  });

  $("a.nav-link").on('click', function (event) {
    if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function () {

        window.location.hash = hash;
      });
    }
  });

  AOS.init({
    offset: 0,
    duration: 800,
    easing: 'ease-in-quad',
    delay: 100,
  });

  $("#testimonial-flipster").flipster({
    style: 'coverflow',
    spacing: -.9,
    nav: false,
    loop: true,
    buttons: false,
  });

  $('.flipster-custom-nav-link').click(function () {
    var navlinkSelected = parseInt(this.title);
    $('.flipster-custom-nav-link').removeClass("active");
    $(this).addClass("active");
    $("#testimonial-flipster").flipster('jump', navlinkSelected);
  });

  $('#toggle-switch').click(function () {
    if ($('#toggle-switch').is(':checked')) {
      $('.monthly').addClass("text-active");
      $('.yearly').removeClass("text-active");
      $("#toggle-switch").attr("checked", "checked");
    } else {
      $('.monthly').removeClass("text-active");
      $('.yearly').addClass("text-active");
      $("#toggle-switch").removeAttr("checked"); 'buildOwnScripts'
    }
  });

  // counter Satisfied clients
  var maxScVal = 97;
  var isc = parseInt($('.scVal').text());
  var tim;
  function run() {
    tim = setInterval(function () {
      if (isc >= maxScVal) {
        clearInterval(tim);
        return;
      }
      $('.scVal').text(++isc);
    }, 100);
  }
  run();
  //Counters

  // counter finished Projects
  var maxfPVal = 3214;
  var ifP = parseInt($('.fpVal').text());
  var timfP;
  function runfP() {
    timfP = setInterval(function () {

      if (ifP >= maxfPVal) {
        clearInterval(timfP);
        return;
      }
      $('.fpVal').text(++ifP);

    }, 1);
  }
  runfP();
  //finished Projects

  //counter Team Members
  var maxtMVal = 125;
  var itm = parseInt($('.tMVal').text());
  var timtM;
  function runtM() {
    timtM = setInterval(function () {
      if (itm >= maxtMVal) {
        clearInterval(timtM);
        return;
      }
      $('.tMVal').text(++itm);
    }, 100);
  }
  runtM();
  //Team Members

  //counter blog post
  var maxbPVal = 2135;
  var ibP = parseInt($('.bPVal').text());
  var timbP;
  function runbP() {
    timbP = setInterval(function () {
      if (ibP >= maxbPVal) {
        clearInterval(timbP);
        return;
      }
      $('.bPVal').text(++ibP);

    }, 1);
  }
  runbP();
  //blog post


});
// })(jQuery)
$('.close-white-popup').on('click', function () {
  $('body').removeClass('overlay');
  $('.white-popup-wrapper').addClass('d-none');
  $('.navbar').removeClass('navbar-hidden');
})