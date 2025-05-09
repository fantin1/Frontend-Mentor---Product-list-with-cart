'use strict'

const dessertsGrid = document.querySelector('.desserts-grid');

fetch('./data.json')
    .then((response) => response.json())
    .then((json) => {
        const products = json;
        //populateDesserts(products);
        














    })


function populateDesserts(products) {
    dessertsGrid.innerHTML = '';
    products.forEach((prod) => {
        const html = `
        <div class="dessert">
                    <div>
                        <img  class="dessert-img" src="${prod.image.desktop}" alt="">
                    </div>
                    <div>
                        <button class="cart-btn">
                            <img src="assets/images/icon-add-to-cart.svg" alt="">
                            Add to Cart
                        </button>
                    </div>
                    <div class="dessert__text">
                        <h2 class="dessert-type">${prod.category}</h2>
                        <h3 class="dessert-name">${prod.name}</h3>
                        <p class="price">$${prod.price.toFixed(2)}</p>
                    </div>
                </div>`
        dessertsGrid.insertAdjacentHTML("beforeend", html);
    })
}
