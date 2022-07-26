
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

    $.ajax('https://api.emailjs.com/api/v1.0/email/sed', {
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
