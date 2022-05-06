let form = document.querySelector(".needs-validation");

// client data for sending
let username = document.querySelector("#name");
let secondName = document.querySelector("#secondName");
let number = +document.querySelector("#phoneNumber");
let city = document.querySelector("#city");
let state = document.querySelector("#state");
let zip = document.querySelector("#zip");

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
          secondName: secondName.value.trim(),
          phoneNumber: number.value,
          city: city.value.trim(),
          state: state.value,
          zip: zip.value,
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
            localStorage.clear();
            setTimeout(() => {
              location.reload()
            }, 5000)
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
