// const mysql = require("mysql");

const con = require("../SQLconfig");

// const con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "root",
//   database: "market",
// });

module.exports = function showingCart(req, res) {
  if (req.body.key != "undefined" && req.body.key.length != 0) {
    con.query(
      "SELECT id, name, cost, image FROM goods WHERE id IN (" +
        req.body.key.join(",") +
        ")",
      function (err, result, fileds) {
        if (err) throw err;
        let goods = {};
        for (let i = 0; i < result.length; i++) {
          goods[result[i]["id"]] = result[i];
        }
        res.json(goods);
      }
    );
  } else {
    res.send("0");
  }
};
