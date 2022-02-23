import {cart} from './dom.js';
import refreshCartDisplay from './dom.js';

// check whether user's not logged in.

if ( !JSON.parse(localStorage.getItem('user')) ) {
    location.href = './login.html';
}

window.addEventListener('DOMContentLoaded', () => {
    refreshCartDisplay();
    try {
        const url = 'https://gist.githubusercontent.com/chjack10/805b49d8f6ed3f5b7d915c481c3f0d18/raw/9335a991aba9bf79e2e6efec6817867003b3b9c3/items.json';
        fetch(url)
        .then(res => res.json())
        .then(renderCards);

    } catch (err) {
        console.error(err);
    }
});

// UserName shown on navbar

const $welcome = document.querySelector('#userWelcome');
const {userName} = JSON.parse(localStorage.getItem('user'));

$welcome.innerHTML = `
    <i class="bi bi-person-circle fs-4 me-2"></i>${userName}</span> 
    <a type="button" id="logout">(Salir)</a>
`;

// Logout
const $logout = document.querySelector('#logout');

$logout.onclick = () => {
    Swal.fire({
        title: 'Estás seguro que querés salir?',
        text: "Tu carrito va a ser reiniciado",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            location.href = './login.html';
        }
      })
};

const renderCards = (items) => {
    const $cardContainer = document.querySelector('#cardContainer');
    
    setTimeout(() => {
        $cardContainer.innerHTML = '';

        items.forEach(({id, img, name, price}) => {

            $cardContainer.innerHTML += `
            <div class="col-12 col-md-6 col-xl-4">
                <div class="card shadow">
                  <img src="${img}" height="300" width="350" class="card-img-top" alt="product_image" />
                  <div class="card-body">
                    <hr>
                    <h4 class="card-title">${name}</h4>
                    <h5 class="card-subtitle mb-2 text-muted">$${price}</h5>
                    <a class="btn btn-outline-secondary w-75 addToCart" data-id="${id}">Añadir al carrito</a>
                  </div>
                </div>
            </div>
            `; 
        });

        const $addToCartBtns = document.querySelectorAll('.addToCart');

        $addToCartBtns.forEach(btn => btn.addEventListener('click', () => {
            const getItem = id => items.find(el => el.id == id);
            cart.addItem( getItem(btn.getAttribute('data-id')));

            refreshCartDisplay();

            Toastify({
                text: "Producto añadido al carrito",
                duration: 3000,
                className: "info",
                stopOnFocus: false,
                position: "right",
                gravity: "bottom",
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast();
        }));
    }, 1500);
};