let filterBox = document.querySelectorAll(".main-card");
let filterBtns = document.querySelectorAll(".filtration-li");

document.querySelector(".filtration-nav").addEventListener("click", (event) => {
  if (event.target.tagName !== "LI") return false;
  let filterClass = event.target.dataset["filter"];

  filterBtns.forEach((elem) => {
    if (elem.classList.contains("selected")) elem.classList.remove("selected");
  });

  event.target.classList.add("selected");

  filterBox.forEach((elem) => {
    elem.classList.remove("hide");
    if (!elem.classList.contains(filterClass) && filterClass !== "all") {
      elem.classList.add("hide");
    }
  });
});
