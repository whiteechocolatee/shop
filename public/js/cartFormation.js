let cart = {};

document.querySelectorAll(".add-to-cart").forEach((element) => {
  element.onclick = addToCart;
});

if (localStorage.getItem("cart")) {
  cart = JSON.parse(localStorage.getItem("cart"));
  ajaxGetGoodsInfo();
}

function addToCart() {
  let goodsId = this.dataset.goods_id;

  if (cart[goodsId]) {
    cart[goodsId]++;
  } else {
    cart[goodsId] = 1;
  }
  ajaxGetGoodsInfo();
}

// reloading cart info
function ajaxGetGoodsInfo() {
  cartUpdateLocalStorage();
  fetch("/cartGoodsInfo", {
    method: "POST",
    body: JSON.stringify({ key: Object.keys(cart) }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      return response.text();
    })
    .then(function (body) {
      showCart(JSON.parse(body));
    });
}

// rendering cart
function showCart(data) {
  let cardBody = ``;
  let checkBody = `
      <div class="check-card">
        <div class="check-header">
          <h3>
            Чек
          </h3>
          <hr>
        </div>
        <div class="check-body">
        `;

  let totalItemCart = 0;
  let totalCart = 0;

  for (let key in cart) {
    cardBody += `
    <div class="cart-card">
    <div class="cart-img">
        <img class="responsive-img rounded" src="/images/${
          data[key]["image"]
        }" />
    </div>
    <div class="cart-info">
        <h4>
            <a href='goods?id=${key}'>
                ${data[key]["name"]}
            </a>
        </h4>
        <div class="cart-price">
            <p>Размер</p>
            <p>
              Цвет&nbsp;<input type='color' class='goods-colors' value='' disabled/>
            </p>
        </div>
        <div class="cart-total">
            <p class="cart-item-quantity">
                <span>
                    <i class="bi bi-dash-circle cart-remove" data-goods_id='${key}'>
                    </i>
                </span>
                <span>
                    ${cart[key]}
                </span>
                <span>
                    <i class="bi bi-plus-circle cart-add" data-goods_id='${key}'>
                    </i>
                </span>
            </p>
            <p class="cart-item-price">
                <b>
                    ${data[key]["cost"] * cart[key]}
                </b>
            </p>
        </div>
    </div>
</div>
      `;

    checkBody += `
          <div class="check-description">
            <span>
              ${data[key]["name"]}
            </span>
            <span>
              ${cart[key]}
            </span>
          </div>
            `;

    totalCart += cart[key] * data[key]["cost"]; // тотал корзины
    totalItemCart += cart[key]; // общее колво вещей в корзине
  }

  checkBody += `
        </div>
        <hr>
        <div class="check-footer">
          <h3>Итого</h3>
          <p>
            <b>${totalCart}</b>
          </p>
        </div>
    `;

  if (totalItemCart > 0) {
    document.querySelector(".total-items").style.opacity = "100%";
  } else {
    document.querySelector(".total-items").style.opacity = "0%";
    document
      .querySelector("#cart-nav")
      .remove(document.querySelector(".cart-check"));
  }

  document.querySelector(".total-items").innerHTML = totalItemCart;
  document.querySelector(".cart-cards").innerHTML = cardBody;
  document.querySelector(".cart-check").innerHTML = checkBody;

  document.querySelectorAll(".cart-add").forEach((el) => {
    el.onclick = cartAdd;
  });

  document.querySelectorAll(".cart-remove").forEach((el) => {
    el.onclick = cartRemove;
  });
}

function cartAdd() {
  let goodsId = this.dataset.goods_id;
  cart[goodsId]++;
  ajaxGetGoodsInfo();
}

function cartRemove() {
  let goodsId = this.dataset.goods_id;
  if (cart[goodsId] - 1 > 0) {
    cart[goodsId]--;
  } else {
    delete cart[goodsId];
  }
  ajaxGetGoodsInfo();
}

// adding goods from cart to localStorage
function cartUpdateLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
