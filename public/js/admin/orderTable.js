// connecting table sorting
new Tablesort(document.querySelector(".table"));

// downloading table to excel file for administrators
document
  .querySelector(".btn-download")
  .addEventListener("click", function name(params) {
    let tableToExcel = new Table2Excel();
    tableToExcel.export(document.querySelector(".table"));
  });

