let navbar = document.getElementById("navbar").classList;
let active_class = "navbar_scrolled";

window.addEventListener("scroll", (e) => {
  if (pageYOffset > 100) {
    navbar.add(active_class);
  } else {
    navbar.remove(active_class);
  }
});

// sending request to getting categories
function getCategoryList() {
  fetch("/main/gettingCategories")
    .then((response) => {
      return response.text();
    })
    .then((body) => {
      showCategoryList(JSON.parse(body));
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
