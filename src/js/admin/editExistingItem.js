// getting input color for adding colors to item
import {fetchingData} from "../fetch.js";
let colorPicker = document.querySelector(".choose-color");
let newColors = [];

// getting imgs for editing additional images
let additionalBlock = document.querySelector(".additional_images");
let addMoreImg = document.querySelector(".additional-img");
let deleteImg = [];

// getting all forms for pushing to db
let updatingForm = document.querySelector(".update-form-img");
let inputFile = document.querySelector(".update-img");
let itemName = document.querySelector(".update-name");
let itemType = document.querySelector(".update-type");
let itemDesc = document.querySelector(".update-description");
let itemCost = document.querySelector(".update-cost");
let itemCat = document.querySelector(".update-category");
let idOfItem = document.querySelector(".id");
let imageName;
let arrOfImg = [];

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

// adding colors to item
colorPicker.addEventListener("change", function (event) {
  let chosenColor = event.target.value;
  let newColor = document.createElement("input");
  newColor.setAttribute("type", "color");
  newColor.setAttribute("value", chosenColor);
  document.querySelector(".item-colors").append(newColor);
  newColors.push(Array(Number(idOfItem.innerHTML), chosenColor));
});

// adding additional images
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
});

// deleting additional images
additionalBlock.addEventListener("click", function (event) {
  deleteImg.push(Number(event.target.alt));
  event.target.remove();
});

// updating card data
updatingForm.addEventListener("submit", () => {
  fetchingData("/admin/goods/updateItem", {
    method: "POST",
    body: JSON.stringify({
      name: itemName.value.trim(),
      description: itemDesc.value.trim(),
      cost: itemCost.value.trim(),
      image: imageName,
      category: itemCat.value.trim(),
      type: itemType.options[itemType.selectedIndex].text.trim(),
      data_type: itemType.value.trim(),
      id: Number(idOfItem.innerHTML),
      imgArr: arrOfImg,
      delAddImg: deleteImg,
      colors: newColors,
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
});
