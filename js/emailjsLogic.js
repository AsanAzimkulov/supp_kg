
window.onload = function () {
  document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const account = window.emailJsAccounts.dev;
    const data = {
      template_params: {},
    };
    const form = this;

    cart = window.localStorage.getItem('cart');
    if (cart) {
      const cartObjects = JSON.parse(cart);
      const total = cartObjects.reduce((acc, obj) => (obj.total += acc), 0);

      const objectsInfo = cartObjects.map((obj, order, arr) => {
        let stringifiedInfo = `Наименование товара: ${obj.name}, количество: ${obj.count}шт/${obj.total}сом (Цена 1шт - ${obj.price}сом)`;
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
      console.log(objectsInfo)
    } else {
      data.template_params['cart'] = 'Корзина пуста.';
    }



    data.template_params['customer_name'] = form.querySelector('.customer-name').value || 'Имя не указано.';
    data.template_params['contact_way'] = form.querySelector('.contact-way').value;
    data.template_params['message'] = form.querySelector('.message').value || 'сообщение не оставлено.';
    data['service_id'] = account.serviceId;
    data['template_id'] = account.templateId;
    data['user_id'] = account.publicKey;
    console.log(data);
    console.log(JSON.stringify(data))

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
    }).fail(function (error) {
      console.log('FAILED...', error.responseText);
      Toastify({
        text: "Что-то пошло не так. Свяжитесь с нами по телефону или в соцсетях.",
        className: "error",
        style: {
          background: 'linear-gradient(211deg, rgba(162,154,195,1) 0%, rgba(226,36,36,1) 100%)',
        }
      }).showToast();
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
