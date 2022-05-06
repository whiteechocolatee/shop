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
  let out = `<table class="table table-striped table-cart"><tbody>`;
  let totalCart = 0;

  for (let key in cart) {
    out += `<tr><td colspan="4"><a href='goods?id=${key}'>${data[key]["name"]}</a></td></tr>`;
    out += `<tr><td><i class="bi bi-dash-circle cart-remove" data-goods_id='${key}'></i></td>`;
    out += `<td>${cart[key]}</td>`;
    out += `<td><i class="bi bi-plus-circle cart-add" data-goods_id='${key}'></i></td>`;
    out += `<td>${data[key]["cost"] * cart[key]}</td></tr>`;
    out += `</tr>`;
    totalCart += cart[key] * data[key]["cost"];
  }
  out += `<tr><td colspan="3">Total: </td><td>${totalCart}</td></tr>`;
  out += `</tbody></table>`;

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
