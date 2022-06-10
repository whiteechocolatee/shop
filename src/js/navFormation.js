import fetchingData from "./fetch.js";
let navbar = document.getElementById("navbar").classList;
let wrapperMenu = document.querySelector(".burger-wrapper");
let active_class = "navbar_scrolled";
let responsive_nav = "navbar__small";

wrapperMenu.addEventListener("click", () => {
  wrapperMenu.classList.toggle("open");
  navbar.toggle(responsive_nav);
});

window.addEventListener("scroll", () => {
  if (pageYOffset > 100 && document.documentElement.scrollWidth > 992) {
    navbar.add(active_class);
  } else {
    navbar.remove(active_class);
  }
});

// sending request to getting categories
function getCategoryList() {
  fetchingData("/main/categories", {
    method: "GET",
  }).then((data) => {
    showCategoryList(data);
  });
}

// rendering navigation
function showCategoryList(data) {
  let list = `<ul class="navbar__nav"><li><a href='/main'>Главная</a></li>`;
  for (let i = 0; i < data.length; i++) {
    list += `<li><a href='/main/category?id=${data[i]["id"]}'>${data[i]["category"]}</a></li>`;
  }
  list += `<li class='cart-header navbar__nav ordered'>
              <h3>
                  <a href='/main/order' class='cart-counter'>
                      <i class="bi bi-bag"></i>
                      <span class='total-items'></span>
                  </a>
              </h3>
          </li>
      </ul>`;

  document.querySelector("#category-list").innerHTML = list;
}

getCategoryList();
