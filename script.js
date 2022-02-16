/* Utils */
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Função que soma os itens do carrinho de compras
function sumCartProducts() {
  let sum = 0;

  document.querySelectorAll('.cart__item').forEach(function (product) {
    const details = product.innerText;
    const price = details.substring(details.indexOf('PRICE: ') + 8, details.length);
    sum += parseFloat(price);
  });

  document.querySelector('.total-price').innerHTML = Math.trunc(sum * 100) / 100;
}
/* ---------------------------------------- */

/* Create elements */
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({
  sku,
  name,
  image,
}) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// Função que remove um produto na LocalStorage a cada exclusão de produto no carrinho
function removeProductFromStorage(product) {
  if (localStorage.getItem('cart') !== null) {
    const details = product.innerText;
    const sku = details.substring(5, details.indexOf('|') - 1);

    let cartStorage = [];
    cartStorage = localStorage.getItem('cart');
    cartStorage = JSON.parse(cartStorage);

    const search = cartStorage.findIndex(function (item) {
      return item.sku === sku;
    });

    cartStorage.splice(search, 1);

    cartStorage = JSON.stringify(cartStorage);
    localStorage.setItem('cart', cartStorage);
  }
}

function cartItemClickListener(event) {
  const element = event.target;
  element.parentNode.removeChild(element);
  removeProductFromStorage(element);
  sumCartProducts();
}

function createCartItemElement({
  sku,
  name,
  salePrice,
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.addEventListener('click', cartItemClickListener);
  return li;
}
/* ---------------------------------------- */

/* Loading */
function showLoading() {
  const loadingNotification = document.createElement('span');
  loadingNotification.classList.add('loading');
  loadingNotification.textContent = 'loading...';
  document.querySelector('.items').appendChild(loadingNotification);
}

function hideLoading() {
  document.querySelector('.items').removeChild(document.querySelector('.loading'));
}
/* ---------------------------------------- */

/* Product Cart */
// Função que obtém o carrinho de compras da LocalStorage
function getCartStorage() {
  let cartStorage = [];

  if (localStorage.getItem('cart') !== null) {
    cartStorage = localStorage.getItem('cart');
    cartStorage = JSON.parse(cartStorage);

    cartStorage.forEach(function (details) {
      const cartElement = createCartItemElement(details);
      document.querySelector('.cart__items').appendChild(cartElement);
    });
  }
}

// Função que adiciona um produto na LocalStorage a cada inserção de produto no carrinho
function addProductToStorage(details) {
  let cartStorage = [];

  if (localStorage.getItem('cart') !== null) {
    cartStorage = localStorage.getItem('cart');
    cartStorage = JSON.parse(cartStorage);
  }

  cartStorage.push(details);
  cartStorage = JSON.stringify(cartStorage);

  localStorage.setItem('cart', cartStorage);
}

/* Product Cart */
function setProductOnCart(data) {
  const details = {
    sku: data.id,
    name: data.title,
    salePrice: data.price,
  };

  document.querySelector('ol.cart__items').appendChild(createCartItemElement(details));
  addProductToStorage(details);
  sumCartProducts();
}

// Função assíncrona que obtém os detalhes de um produto para inserí-lo no carrinho de compras
async function addProductToCart(event) {
  const sku = getSkuFromProductItem(event.target.parentNode);
  const url = `https://api.mercadolibre.com/items/${sku}`;
  
  showLoading();

  await fetch(url)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      hideLoading();
      setProductOnCart(data);
    })
    .catch(function (error) {
      console.log(error.message);
    });
}

function setListenersCart() {
  document.querySelectorAll('.item__add').forEach(function (button) {
    button.addEventListener('click', addProductToCart);
  });
}
/* ---------------------------------------- */

/* Products */
function setListOfProducts(data) {
  const products = data.results.map(function (product) {
    const productObject = {
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    };
    return productObject;
  });

  products.forEach(function (product) {
    document.querySelector('.items').appendChild(createProductItemElement(product));
  });
}

// Função assíncrona que obtém os detalhes de um produto para inserí-lo no carrinho de compras
async function getProducts(query) {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;

  showLoading();

  await fetch(url)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      hideLoading();
      setListOfProducts(data);
      setListenersCart();
    })
    .catch(function (error) {
      console.log(error.message);
    });
}
/* ---------------------------------------- */

window.onload = () => {
  document.querySelector('.empty-cart').addEventListener('click', function () {
    const productsList = document.querySelector('.cart__items');

    /* optei por não utilizar jQuery para limpar a lista, mesmo sendo mais simples ($('.cart__items').empty())
    para utilizar apenas JavaScript, pois não sei o momento em que o aluno está no curso */
    while (productsList.firstChild) productsList.removeChild(productsList.firstChild);

    localStorage.clear();

    sumCartProducts();
  });
  
  getProducts('computador');
  getCartStorage();
  sumCartProducts();
};