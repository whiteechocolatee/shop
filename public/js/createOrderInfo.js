// getting form for validation
let form = document.querySelector(".needs-validation");

// client data for sending
let username = document.querySelector("#name");
let email = document.querySelector("#email");
let number = document.querySelector("#phoneNumber");
let city = document.querySelector("#city");
let state = document.querySelector("#state");
let adress = document.querySelector("#validationTextarea");

//adding input mask for validation
let maskOptions = {
  mask: "+{38} (000) 000-00-00",
};

let mask = IMask(number, maskOptions);

// submit order
form.addEventListener(
  "submit",
  function (event) {
    event.preventDefault();
    if (!form.checkValidity()) {
      event.stopPropagation();
      form.classList.add("was-validated");
      return;
    }
    fetch("/endOfTheOrder", {
      method: "POST",
      body: JSON.stringify({
        userName: username.value.trim(),
        email: email.value.trim(),
        phoneNumber: number.value,
        adress: String(adress.value.trim()),
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
            footer: '<a href="/main">Продолжить покупки</a>',
          });
          localStorage.clear();
          setTimeout(() => {
            location.reload();
            window.location.replace("/main");
          }, 3000);
        } else if (body == "0") {
          Swal.fire({
            icon: "error",
            title: "Что-то пошло не так...",
            text: "Ваша корзина пуста!",
            footer: '<a href="/main">Вернуться на главную</a>',
          });
          setTimeout(() => {
            location.reload();
            window.location.replace("/main");
          }, 3000);
        }
      });
  },
  false
);
