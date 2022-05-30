let navbar = document.getElementById("navbar").classList;
let active_class = "navbar_scrolled";

window.addEventListener("scroll", (e) => {
  if (pageYOffset > 300) {
    navbar.add(active_class);
  } else {
    navbar.remove(active_class);
  }
});

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
  let out = `<ul class="navbar__nav"><li><a href='/'>Главная</a></li>`;
  for (let i = 0; i < data.length; i++) {
    out += `<li><a href='/cat?id=${data[i]["id"]}'>${data[i]["category"]}</a></li>`;
  }
  out += `<li class='cart-header navbar__nav ordered'>
              <h3>
                  <a href='/order' class='cart-counter'>
                      <i class="bi bi-bag"></i>
                      <span class='total-items'></span>
                  </a>
              </h3>
          </li>
      </ul>`;

  document.querySelector("#category-list").innerHTML = out;
}

getCategoryList();
