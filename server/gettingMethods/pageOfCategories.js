const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "market",
});

module.exports = function pageOfCategories(req, res, renderingPage) {
  let categoryId = req.query["id"];
  // get category id,and getting data from db
  let category = new Promise((resolve, reject) => {
    con.query("SELECT * FROM category WHERE id=" + categoryId, function (
      err,
      result
    ) {
      if (err) reject(err);
      resolve(result);
    });
  });
  // get goods from db
  let goods = new Promise((resolve, reject) => {
    con.query("SELECT * FROM goods WHERE category=" + categoryId, function (
      err,
      result
    ) {
      if (err) reject(err);
      resolve(result);
    });
  });

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
