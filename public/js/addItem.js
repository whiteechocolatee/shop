let form = document.querySelector(".save-img");
let inputFile = document.querySelector(".added-img");
let cardWrapper = document.querySelector(".card-img");
let itemName = document.querySelector("#item-name");
let itemDesc = document.querySelector("#item-description");
let itemCost = document.querySelector("#item-cost");
let itemCat = document.querySelector("#item-category");
let imageName;

// showing preview of card image
inputFile.addEventListener("change", function (event) {
  let target = event.target;

  if (!FileReader) {
    alert("Вы не можете использовать этот тип файла");
    return;
  }

  if (!target.files.length) {
    alert("Ничего не загружено");
    return;
  }

  let fileReader = new FileReader();

  fileReader.onload = function () {
    img1.src = fileReader.result;
    img1.style.width = "100%";
    img1.style.height = "auto";
  };

  fileReader.readAsDataURL(target.files[0]);

  imageName = target.files[0].name;
});

form.addEventListener("submit", function (e) {
  fetch("/add-new-item", {
    method: "POST",
    body: JSON.stringify({
      name: itemName.value.trim(),
      description: itemDesc.value.trim(),
      cost: itemCost.value.trim(),
      image: imageName.trim(),
      category: itemCat.value.trim(),
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
        alert("Товар добавлен!");
      } else if (body == "0") {
        alert("Произошла ошибка!");
      }
    });
});
