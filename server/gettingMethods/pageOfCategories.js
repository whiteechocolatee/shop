// const mysql = require("mysql");

const con = require("../SQLconfig");

// const con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "root",
//   database: "market",
// });

const resultsPerPage = 9;

module.exports = function pageOfCategories(req, res, renderingPage) {
  let categoryId = req.query["id"];

  // getting category
  let category = new Promise((resolve, reject) => {
    con.query("SELECT * FROM category WHERE id=" + categoryId, function (
      err,
      result
    ) {
      if (err) reject(err);
      resolve(result);
    });
  });

  // getting goods
  let goods = new Promise((resolve, reject) => {
    con.query(`SELECT * FROM goods WHERE category=` + categoryId, function (
      err,
      result
    ) {
      if (err) reject(err);
      const numOfResults = result.length;
      const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
      let page = req.query.page ? Number(req.query.page) : 1;
      if (page > numberOfPages) {
        res.redirect(
          `/main/category?id=${categoryId}&page=` +
            encodeURIComponent(numberOfPages)
        );
      } else if (page < 1) {
        res.redirect(
          `/category?id=${categoryId}&page=` + encodeURIComponent("1")
        );
      }
      const startingLimit = (page - 1) * resultsPerPage;
      con.query(
        `SELECT * FROM goods WHERE category=${categoryId} LIMIT ${startingLimit},${resultsPerPage} `,
        (err, result) => {
          if (err) throw err;
          let iterator = page - 5 < 1 ? 1 : page - 5;
          let endingLink =
            iterator + 9 <= numberOfPages
              ? iterator + 9
              : page + (numberOfPages - page);
          if (endingLink < page + 4) {
            iterator -= page + 4 - numberOfPages;
          }
          let resultArray = Object.values(JSON.parse(JSON.stringify(result)));
          let pagesArr = [
            {
              page: page,
              numberOfPages: numberOfPages,
            },
          ];
          resolve([resultArray, pagesArr]);
        }
      );
    });
  });

  // getting types
  let types = new Promise((resolve, reject) => {
    con.query(
      "SELECT DISTINCT type, data_type FROM goods WHERE category=" + categoryId,
      function (err, result) {
        if (err) reject(err);
        resolve(result);
      }
    );
  });

  Promise.all([category, goods, types]).then((value) => {
    res.render(renderingPage, {
      category: value[0],
      goods: value[1],
      types: value[2],
    });
  });
};
