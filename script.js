'use strict'



fetch('./data.json').then((response) => response.json()).then((json) => {
    const products = json;
    populateDesserts(products);

    const addCartBtns = document.querySelectorAll('.add-btn');
    addCartBtns.forEach(btn => {
        btn.addEventListener('click', function(){addToCart(btn)});
    })
    const incBtns = document.querySelectorAll('.increment-btn');
    incBtns.forEach(btn => {
        btn.addEventListener('click', function(){addToCart(btn)});
    })

    const cart = [];
    initCart(products, cart);

})

const dessertsGrid = document.querySelector('.desserts-grid');




function addToCart(btn){
    console.log(btn)
    const qtBtn = btn.closest('.dessert').querySelector('.quantity-btn');
    if(btn.classList.contains('add-btn')){
        btn.classList.add('hidden');
        qtBtn.classList.remove('hidden');
        btn.closest('.dessert').querySelector('.dessert-img').classList.add('dessert-img-selected');
    }
    qtBtn.closest('.cart-btn').querySelector('.quantity').textContent = `${Math.ceil(Math.random()*10)}`;
    

}

function initCart(products, cart){
    products.forEach((p, i) => {
        cart.push(
            {
                index: i,
                name: p.name,
                price: p.price,
                quant: 0
            });
    })
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
                        <button class="cart-btn add-btn justify-center data-index="${i}">
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

