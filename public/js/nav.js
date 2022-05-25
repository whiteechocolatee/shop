document.querySelector(".close-nav").onclick = closeNav;
document.querySelector(".show-nav").onclick = showNav;

// open nav
function closeNav() {
  document.querySelector(".site-nav").style.left = "-300px";
}

// close nav
function showNav() {
  document.querySelector(".site-nav").style.left = "0";
}

// sending request to getting categories
function getCategoryList() {
  fetch("/get-category-list", { method: "POST" })
    .then((response) => {
      return response.text();
    })
    .then((body) => {
      showCategoryList(JSON.parse(body));
    });
}

// rendering navigation
function showCategoryList(data) {
  let out = `<ul><li class='category-list'><a href='/'>Главная</a></li>`;
  for (let i = 0; i < data.length; i++) {
    out += `<li><a href='/cat?id=${data[i]["id"]}'>${data[i]["category"]}</a></li>`;
  }
  out += `</ul`;

  document.querySelector("#category-list").innerHTML = out;
}

getCategoryList();