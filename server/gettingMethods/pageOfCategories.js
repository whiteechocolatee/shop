const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "market",
});

const resultsPerPage = 6;

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
        res.redirect(`&page=` + encodeURIComponent(numberOfPages));
      } else if (page < 1) {
        res.redirect("&page=" + encodeURIComponent("1"));
      }
      const startingLimit = (page - 1) * resultsPerPage;
      sql = `SELECT * FROM goods WHERE category=${categoryId} LIMIT ${startingLimit},${resultsPerPage} `;
      con.query(sql, (err, result) => {
        if (err) throw err;
        let iterator = page - 5 < 1 ? 1 : page - 5;
        let endingLink =
          iterator + 9 <= numberOfPages
            ? iterator + 9
            : page + (numberOfPages - page);
        if (endingLink < page + 4) {
          iterator -= page + 4 - numberOfPages;
        }
        resolve(result);
      });
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
