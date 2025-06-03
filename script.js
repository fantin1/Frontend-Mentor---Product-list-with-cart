'use strict'

fetch('./data.json').then((response) => response.json()).then((json) => {
    const products = json;
    populateDesserts(products);
    
    const cart = [];
    
    initCart(products, cart);

    const addCartBtns = document.querySelectorAll('.add-btn');
    addCartBtns.forEach(btn => {
        btn.addEventListener('click', function(){incrementItem(btn, cart)});
    })
    const incBtns = document.querySelectorAll('.increment-btn');
    incBtns.forEach(btn => {
        btn.addEventListener('click', function(){incrementItem(btn, cart)});
    })
    const decBtns = document.querySelectorAll('.decrement-btn');
    decBtns.forEach(btn => btn.addEventListener('click', function(){decrementItem(btn, cart);}))
    
})

const dessertsGrid = document.querySelector('.desserts-grid');
const cartContainer = document.querySelector('.cart');
const cartOrders = document.querySelector('.cart-orders');
const totalCarbon = document.querySelector('.total-carbon-neutral');
const totalDisplay = document.querySelector('.total-cost');
const cartDisplay = document.querySelector('.cart-quant');

let cartEmpty;
let total = 0;
let numProds = 0;

function incrementItem(btn, cart){
    /* Add to cart btn */
    const qtBtn = btn.closest('.dessert').querySelector('.quantity-btn');
    if(btn.classList.contains('add-btn')){
        btn.classList.add('hidden');
        qtBtn.classList.remove('hidden');
        btn.closest('.dessert').querySelector('.dessert-img').classList.add('dessert-img-selected');
    }
    /* Dealing with cart */
    const index = btn.dataset.index;
    const c = cart[index];
    c.quant++;
    numProds ++;
    total += c.price;
    qtBtn.closest('.cart-btn').querySelector('.quantity').textContent = `${cart[index].quant}`;
    
    if(cartEmpty) {
        cartContainer.querySelector('.cart-empty').classList.add('hidden');
        cartEmpty = false;
        totalCarbon.classList.remove('hidden');
    }
    if(c.quant > 1){
        const item = cartOrders.querySelector(`.cart-item[data-index="${index}"]`);
        item.querySelector('.order-quant').textContent = `${c.quant}x`;
        item.querySelector('.order-item-total').textContent = `$${c.price * c.quant}`;
    }else{
        cartOrders.insertAdjacentHTML('beforeend',
            `
        <div class="cart-item" data-index="${index}">
            <div class="item-info">
                <h3 class="item-name">${c.name}</h3>
                <p class="order">
                    <span class="order-quant">${c.quant}x</span>
                    <span class="order-unit-value">@ $${c.price}</span>
                    <span class="order-item-total">$${c.price * c.quant}</span>
                </p>
            </div>
            <div>
                <button class="icon-btn remove-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                        <path
                            d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z" />
                    </svg>
                </button>
            </div>
        </div>
`
        )
        const item = cartOrders.querySelector(`.cart-item[data-index="${index}"]`);
        const rmvBtn = item.querySelector('.remove-btn');
        rmvBtn.addEventListener('click', function(){removeItem(btn, cart);})
    }
    console.log(total);
    cartDisplay.textContent = numProds;
    totalDisplay.textContent = `$${total.toFixed(2)}`;
}

function decrementItem(btn, cart){
    const index = btn.dataset.index;
    const c = cart[index];
    c.quant--;
    numProds--;
    total -= c.price;
    cartEmpty = true;
        cart.forEach(cartItem => {if(cartItem.quant > 0) cartEmpty = false});

    const qtBtn = btn.closest('.dessert').querySelector('.quantity-btn');
    const cartBtn = btn.closest('.dessert').querySelector('.add-btn');
    const item = cartOrders.querySelector(`.cart-item[data-index="${index}"]`);
    if(c.quant === 0){
        qtBtn.classList.add('hidden');
        cartBtn.classList.remove('hidden');
        item.remove();
        if(cartEmpty) {
            cartContainer.querySelector('.cart-empty').classList.remove('hidden');
            totalCarbon.classList.add('hidden');
        }
    }else{
        qtBtn.closest('.cart-btn').querySelector('.quantity').textContent = `${cart[index].quant}`;
        item.querySelector('.order-quant').textContent = `${c.quant}x`;
        item.querySelector('.order-item-total').textContent = `$${c.price * c.quant}`;
    }

    cartDisplay.textContent = numProds;
    totalDisplay.textContent = `$${total.toFixed(2)}`;
}

function removeItem(btn, cart){
    const index = btn.dataset.index;
    const c = cart[index];
    numProds-= c.quant;
    total -= c.price * c.quant;
    c.quant = 0;
    cartEmpty = true;
    cart.forEach(cartItem => {if(cartItem.quant > 0) cartEmpty = false});
    const qtBtn = btn.closest('.dessert').querySelector('.quantity-btn');
    const cartBtn = btn.closest('.dessert').querySelector('.add-btn');
    const item = cartOrders.querySelector(`.cart-item[data-index="${index}"]`);
    qtBtn.classList.add('hidden');
    cartBtn.classList.remove('hidden');
    item.remove();

    if(cartEmpty) {
        cartContainer.querySelector('.cart-empty').classList.remove('hidden');
        totalCarbon.classList.add('hidden');
    }
}

function initCart(products, cart){
    products.forEach((p) => {
        cart.push(
            {
                name: p.name,
                price: p.price,
                quant: 0
            });
    })
    cartEmpty = true;
}

function populateDesserts(products) {
    dessertsGrid.innerHTML = '';
    products.forEach((p, i) => {
        const html = `
        <div class="dessert">
                    <div>
                        <picture class="dessert-img">
                            <source media="(min-width: 1024px)" srcset="${p.image.desktop}">
                            <source media="(min-width: 768px)" srcset="${p.image.tablet}">
                            <img src="${p.image.mobile}" alt="${p.name}">
                        </picture>
                    </div>
                    <div>
                        <button class="cart-btn add-btn justify-center" data-index="${i}">
                            <img src="assets/images/icon-add-to-cart.svg" alt="">
                            Add to Cart
                        </button>
                        <div class="cart-btn quantity-btn justify-space hidden">
                            <button class="icon-btn inc-dec-btn decrement-btn" data-index="${i}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none"
                                    viewBox="0 0 10 2">
                                    <path d="M0 .375h10v1.25H0V.375Z" />
                                </svg>
                            </button>
                            <span class="quantity">0</span>
                            <button class="icon-btn inc-dec-btn increment-btn" data-index="${i}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none"
                                    viewBox="0 0 10 10">
                                    <path d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z" />
                                </svg>
                            </button>

                        </div>
                    </div>
                    <div class="dessert-text">
                        <h2 class="dessert-category">${p.category}</h2>
                        <h3 class="dessert-name">${p.name}</h3>
                        <p class="price">${p.price.toFixed(2)}</p>
                    </div>
                </div>`;
        dessertsGrid.insertAdjacentHTML("beforeend", html);
    })
}
