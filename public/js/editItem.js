let updatingForm = document.querySelector(".update-form-img");
let inputFile = document.querySelector(".update-img");
let addMoreImg = document.querySelector(".additional-img");
let itemName = document.querySelector(".update-name");
let itemType = document.querySelector(".update-type");
let itemDesc = document.querySelector(".update-description");
let itemCost = document.querySelector(".update-cost");
let itemCat = document.querySelector(".update-category");
let idOfItem = document.querySelector(".id");

let imageName;
let arrOfImg = [];

addMoreImg.addEventListener("change", function (event) {
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

  let img2 = document.createElement("img");

  fileReader.onload = function () {
    document.querySelector(".additional_images").append(img2);
    img2.src = fileReader.result;
  };

  fileReader.readAsDataURL(target.files[0]);

  arrOfImg.push(Array(Number(idOfItem.innerHTML), target.files[0].name));

  console.log(arrOfImg);
});

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
      type: itemType.value.trim(),
      id: Number(idOfItem.innerHTML),
      imgArr: arrOfImg,
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
