let loginInput = document.querySelector("#loginInput").value;
let passInput = document.querySelector("#passInput").value;

let form = document.querySelector("#form");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  postLogin();
});

function postLogin() {
  fetch("/login", {
    method: "POST",
    body: JSON.stringify({
      login: loginInput,
      password: passInput,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}
