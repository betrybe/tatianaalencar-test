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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
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
  return li;
}

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

  await fetch(url)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      setListOfProducts(data);
    })
    .catch(function (error) {
      console.log(error.message);
    });
}

window.onload = () => {
  getProducts('computador');
};