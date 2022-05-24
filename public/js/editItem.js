let updatingForm = document.querySelector(".update-form-img");
let inputFile = document.querySelector(".update-img");
let itemName = document.querySelector(".update-name");
let itemDesc = document.querySelector(".update-description");
let itemCost = document.querySelector(".update-cost");
let itemCat = document.querySelector(".update-category");
let idOfItem = document.querySelector(".id");
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

updatingForm.addEventListener("submit", function () {
  fetch("/update-item", {
    method: "POST",
    body: JSON.stringify({
      name: itemName.value.trim(),
      description: itemDesc.value.trim(),
      cost: itemCost.value.trim(),
      image: imageName,
      category: itemCat.value.trim(),
      id: Number(idOfItem.innerHTML),
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
        alert("Товар обновлен!");
      } else if (body == "0") {
        alert("Произошла ошибка!");
      }
    });
});
