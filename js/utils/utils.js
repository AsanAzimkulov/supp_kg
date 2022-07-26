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
  insertCartInLink(link) {
    const cart = utils.getStringifiedCart();
    return link + cart;
  },
};


