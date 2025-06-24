'use strict'

const displayGrid = document.querySelector('.desserts-grid');

class Product {
    #displayParentEl;
    #displayImgEl;
    #displayCountEl;
    #displayAddBtn;
    #displayBtnContainer;
    cartParentEl;
    cartCountEl;
    cartTotalEl;
    count = 0;
    constructor(index, name, category, price, thumbnail, mobile, tablet, desktop) {
        this.index = index;
        this.name = name;
        this.category = category;
        this.price = price;
        this.thumbnail = thumbnail;
        this.mobile = mobile;
        this.tablet = tablet;
        this.desktop = desktop;
    }

    assignDisplayHtmlElements() {
        this.#displayParentEl = document.querySelector(`.dessert[data-index="${this.index}"]`);
        this.#displayImgEl = this.#displayParentEl.querySelector('.dessert-img');
        this.#displayCountEl = this.#displayParentEl.querySelector('.quantity');
        this.#displayBtnContainer = this.#displayParentEl.querySelector('.btn-container');
        this.#displayAddBtn = this.#displayParentEl.querySelector('.add-btn');
    }

    addToGrid() {
        const html = `
            <div class="dessert" data-index="${this.index}">
                    <div>
                        <picture class="dessert-img">
                            <source media="(min-width: 1024px)" srcset="${this.desktop}">
                            <source media="(min-width: 768px)" srcset="${this.tablet}">
                            <img src="${this.mobile}" alt="${this.name}">
                        </picture>
                    </div>
                    <div>
                        <button class="cart-btn add-btn justify-center">
                            <img src="assets/images/icon-add-to-cart.svg" alt="">
                            Add to Cart
                        </button>
                        <div class="cart-btn btn-container justify-space hidden">
                            <button class="icon-btn inc-dec-btn decrement-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none"
                                    viewBox="0 0 10 2">
                                    <path d="M0 .375h10v1.25H0V.375Z" />
                                </svg>
                            </button>
                            <span class="quantity">0</span>
                            <button class="icon-btn inc-dec-btn increment-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none"
                                    viewBox="0 0 10 10">
                                    <path d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z" />
                                </svg>
                            </button>

                        </div>
                    </div>
                    <div class="dessert-text">
                        <h2 class="dessert-category">${this.category}</h2>
                        <h3 class="dessert-name">${this.name}</h3>
                        <p class="price">$${this.price}</p>
                    </div>
                </div> 
        `
        displayGrid.insertAdjacentHTML('beforeend', html);
    }

    assignCartHtmlElements() {
        this.cartParentEl = document.querySelector(`.cart-item[data-index="${this.index}"`);
        this.cartCountEl = this.cartParentEl.querySelector(`.order-quant`);
        this.cartTotalEl = this.cartParentEl.querySelector(`.order-item-total`);
    }

    updateDisplay() {
        if (this.count > 0) {
            this.#displayImgEl.classList.add('dessert-img-selected');
            this.#displayAddBtn.classList.add('hidden');
            this.#displayBtnContainer.classList.remove('hidden');
        } else {
            this.#displayImgEl.classList.remove('dessert-img-selected');
            this.#displayAddBtn.classList.remove('hidden');
            this.#displayBtnContainer.classList.add('hidden');
        }
        this.#displayCountEl.textContent = this.count;
        this.cartCountEl.textContent = `${this.count}x`;
        this.cartTotalEl.textContent = `$${this.count * this.price}`
    }
};

class Cart {
    products = [];
    cartEl = document.querySelector('.cart');
    #countEl = document.querySelector('.cart-quant');
    #cartTotalEl = document.querySelector('.cart-total');
    #cartEmptyEl = document.querySelector('.cart-empty');
    #carbonNeutralEl = document.querySelector('.total-carbon-neutral');
    #cartOrdersEl = document.querySelector('.cart-orders');
    #confirmBtn = document.querySelector('.confirm-btn');
    #count = 0;
    #totalCost = 0;


    modalEl = document.querySelector('.modal-overlay');
    #modalOrdersEl = document.querySelector('.modal-orders');
    #modalTotalEl = document.querySelector('.modal-total');
    #newOrderBtn = document.querySelector('.new-order-btn');


    constructor() {
        this.#confirmBtn.addEventListener('click', this.checkout.bind(this));
        this.#newOrderBtn.addEventListener('click', this.newOrder.bind(this));
        this.modalEl.addEventListener('click', function (e) {
            if (e.target.classList.contains('modal-overlay')) this.closeModal();
        }.bind(this))
        console.log(this.#modalOrdersEl)
    };

    startCart() {
        this.#cartEmptyEl.classList.add('hidden');
        this.#carbonNeutralEl.classList.remove('hidden');
    }

    addToCart(product) {
        if (this.#count === 0) this.startCart();

        if (product.count === 0) {
            const html = `
            <div class="cart-item" data-index="${product.index}">
                <div class="item-info">
                    <h3 class="item-name">${product.name}</h3>
                    <p class="order">
                        <span class="order-quant">1x</span>
                        <span class="order-unit-value">@ $${product.price}</span>
                        <span class="order-item-total">$${product.price}</span>
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
            `;
            this.#cartOrdersEl.insertAdjacentHTML('beforeend', html);
            product.assignCartHtmlElements();
        }
        this.#count++;
        this.#totalCost += product.price;
        product.count++;

        this.updateDisplay(product);
    }

    removeFromCart(product) {
        product.count--;
        if (product.count === 0) {
            product.count = 0;
            product.cartParentEl.remove();
        }

        this.#count--;
        this.#totalCost -= product.price;
        this.updateDisplay(product);
    }

    excludeItem(product) {
        this.#count -= product.count;
        this.#totalCost -= product.count * product.price;
        product.cartParentEl.remove();
        product.count = 0;
        this.updateDisplay(product);
    }

    emptyCart() {
        this.#cartEmptyEl.classList.remove('hidden');
        this.#carbonNeutralEl.classList.add('hidden');
    }

    updateDisplay(product) {
        product.updateDisplay()
        this.#countEl.textContent = this.#count;
        this.#cartTotalEl.textContent = `$${this.#totalCost}`;
        //this.#modalTotalEl.textContent = `$${this.#totalCost}`;
        if (this.#count === 0) this.emptyCart();
    }

    checkout() {
        this.modalEl.classList.remove('hidden');
        this.products.forEach((p) => {
            if (p.count > 0) {
                const html = `
                <div class="modal-item" data-index="${p.index}">

                    <div class="modal-flex">
                        <div class="thumbnail">
                            <img src="${p.thumbnail}" alt="${p.name}">
                        </div>
                        <div class="item-info">
                            <h3 class="item-name">${p.name}</h3>
                            <p class="order">
                                <span class="order-quant">${p.count}x</span>
                                <span class="order-unit-value">@ $${p.price}</span>
                            </p>
                        </div>
                    </div>

                    <div>
                        <span class="order-item-total">$${p.price * p.count}</span>
                    </div>
                </div>
            `
                this.#modalOrdersEl.insertAdjacentHTML("beforeend", html);
            }

        })

        const totalHtml = `
                <div>
                    <p class="order-total"><span>Order Total</span><span class="total-cost modal-total">$${this.#totalCost}</span></p>
                </div>
                
            </div>`
        this.#modalOrdersEl.insertAdjacentHTML("beforeend", totalHtml);



    }

    newOrder() {
        this.closeModal();
    }

    closeModal() {
        this.modalEl.classList.add('hidden');
    }
};

const cart = new Cart();


fetch('./data.json').then((response) => response.json()).then((json) => {
    const data = json;

    data.forEach((data, i) => {
        const product = new Product(i, data.name, data.category, data.price,
            data.image.thumbnail, data.image.mobile, data.image.tablet, data.image.desktop);
        product.addToGrid();
        product.assignDisplayHtmlElements();
        cart.products.push(product);
    });

    displayGrid.addEventListener('click', function (e) {

        if (!(e.target.closest('.add-btn') || e.target.closest('.increment-btn'))) return;

        const prodEl = e.target.closest('.dessert');
        const product = cart.products[prodEl.dataset.index];
        cart.addToCart(product);
    });

    displayGrid.addEventListener('click', function (e) {

        if (!e.target.closest('.decrement-btn')) return;

        const prodEl = e.target.closest('.dessert');
        const product = cart.products[prodEl.dataset.index];
        cart.removeFromCart(product);
    });

    cart.cartEl.addEventListener('click', function (e) {

        if (!e.target.closest('.remove-btn')) return;

        const prodEl = e.target.closest('.cart-item');
        const product = cart.products[prodEl.dataset.index];
        cart.excludeItem(product);
    })

})

let cartEmpty = true;

