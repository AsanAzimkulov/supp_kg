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


});