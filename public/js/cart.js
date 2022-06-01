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
  fetch("/get-goods-info", {
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
  console.log(data);
  let out = `<table class="table table-striped table-cart"><tbody>`;
  let totalItemCart = 0;
  let totalCart = 0;

  for (let key in cart) {
    out += `
    <div class="cart-card">
      <div class="cart-img">
        <img class="responsive-img rounded" src="./images/${data[key]["image"]}"/>
      </div>
      <div class="cart-info">
        <h4>
          <a href='goods?id=${key}'>
            ${data[key]["name"]}
          </a>
        </h4>
        <div class="cart-price">  
          <p>Размер</p>
          <p>Цвет</p>
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
    // out += `<tr>
    //             <td colspan="4">
    //                 <a href='goods?id=${key}'>
    //                     ${data[key]["name"]}
    //                 </a>
    //             </td>
    //         </tr>`;
    // out += `<tr><td><i class="bi bi-dash-circle cart-remove" data-goods_id='${key}'></i></td>`; // меньше
    // out += `<td>${cart[key]}</td>`; // колво товаров
    // out += `<td><i class="bi bi-plus-circle cart-add" data-goods_id='${key}'></i></td>`; // больше
    // out += `<td>${data[key]["cost"] * cart[key]}</td></tr>`; // тотал
    // out += `</tr>`;
    // totalCart += cart[key] * data[key]["cost"]; // тотал корзины
    // totalItemCart += cart[key]; // общее колво вещей в корзине
  }
  // out += `<tr><td colspan="3">Total: ${totalItemCart}</td><td>${totalCart}</td></tr>`;
  // out += `</tbody></table>`;

  if (totalItemCart > 0) {
    document.querySelector(".total-items").style.opacity = "100%";
  } else {
    document.querySelector(".total-items").style.opacity = "0%";
  }

  document.querySelector(".total-items").innerHTML = totalItemCart;
  document.querySelector("#cart-nav").innerHTML = out;

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
