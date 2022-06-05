const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "market",
});

module.exports = function goodsData(req, res, renderPage) {
  con.query("SELECT * FROM goods", function (err, result, fileds) {
    if (err) throw err;
    res.render(renderPage, { goods: JSON.parse(JSON.stringify(result)) });
  });
};
