let form = document.querySelector(".needs-validation");

// client data for sending
let username = document.querySelector("#name");
let email = document.querySelector("#email");
let number = document.querySelector("#phoneNumber");
let city = document.querySelector("#city");
let state = document.querySelector("#state");
let adress = document.querySelector("#validationTextarea");

// adding phone number mask
[].forEach.call(document.querySelectorAll(".tel"), function (input) {
  let keyCode;
  function mask(event) {
    event.keyCode && (keyCode = event.keyCode);
    let pos = this.selectionStart;
    if (pos < 3) event.preventDefault();
    let matrix = "+38 (___) ___ ____",
      i = 0,
      def = matrix.replace(/\D/g, ""),
      val = this.value.replace(/\D/g, ""),
      new_value = matrix.replace(/[_\d]/g, function (a) {
        return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
      });
    i = new_value.indexOf("_");
    if (i != -1) {
      i < 5 && (i = 3);
      new_value = new_value.slice(0, i);
    }
    let reg = matrix
      .substr(0, this.value.length)
      .replace(/_+/g, function (a) {
        return "\\d{1," + a.length + "}";
      })
      .replace(/[+()]/g, "\\$&");
    reg = new RegExp("^" + reg + "$");
    if (
      !reg.test(this.value) ||
      this.value.length < 5 ||
      (keyCode > 47 && keyCode < 58)
    )
      this.value = new_value;
    if (event.type == "blur" && this.value.length < 5) this.value = "";
  }

  input.addEventListener("input", mask, false);
  input.addEventListener("focus", mask, false);
  input.addEventListener("blur", mask, false);
  input.addEventListener("keydown", mask, false);
});

// submit order
form.addEventListener(
  "submit",
  function (event) {
    event.preventDefault();
    if (!form.checkValidity()) {
      event.stopPropagation();
      form.classList.add("was-validated");
    } else {
      fetch("/finish-order", {
        method: "POST",
        body: JSON.stringify({
          userName: username.value.trim(),
          email: email.value.trim(),
          phoneNumber: number.value,
          adress: adress.value.trim(),
          key: JSON.parse(localStorage.getItem("cart")),
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then(function (response) {
          return response.text();
        })
        .then(function (body) {
          if (body == "1") {
            Swal.fire({
              title: "Отлично!",
              text: "Ваш заказ принят, скоро с вами свяжутся!",
              icon: "success",
              footer: '<a href="/">Продолжить покупки</a>',
            });
            // localStorage.clear();
            // setTimeout(() => {
            //   location.reload()
            // }, 5000)
          } else if (body == "0") {
            Swal.fire({
              icon: "error",
              title: "Что-то пошло не так...",
              text: "Ваша корзина пуста!",
              footer: '<a href="/">Вернуться на главную</a>',
            });
          }
        });
    }
  },
  false
);
