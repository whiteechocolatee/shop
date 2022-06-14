import {fetchingData} from "./fetch.js";
import Toast from "./modalWindows.js";

// getting form for validation
let form = document.querySelector(".needs-validation");

// client data for sending
let username = document.querySelector("#name");
let email = document.querySelector("#email");
let number = document.querySelector("#phoneNumber");
let adress = document.querySelector("#validationTextarea");

//adding input mask for validation
let maskOptions = {
  mask: "+{38} (000) 000-00-00",
};
let mask = IMask(number, maskOptions);

// reloading function

const clearLocalStorageData = () => {
  localStorage.removeItem("cart");
  setTimeout(() => {
    location.reload();
    window.location.replace("/main");
  }, 4000);
};

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
    fetchingData("/main/endOfTheOrder", {
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
    }).then((response) => {
      if (response === 200) {
        Toast.fire({
          icon: "success",
          title: "Спасибо за заказ!",
        });
        clearLocalStorageData();
      } else {
        Toast.fire({
          icon: "error",
          title: "Что-то пошло не так :(",
        });
        clearLocalStorageData();
      }
    });
  },
  false
);
