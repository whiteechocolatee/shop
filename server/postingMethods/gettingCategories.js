// const mysql = require("mysql");

const con = require("../SQLconfig");

// const con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "root",
//   database: "market",
// });


module.exports = function gettingCategories(req, res) {
  con.query("SELECT id,category FROM category", function (err, result, fileds) {
    if (err) throw err;
    res.json(result);
  });
};
