const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "market",
});

// connect cookie parser

const cookieParser = require("cookie-parser");

const hashGeneration = require("../../hashGeneration.js");

module.exports = function updatingLoginHash(req, res) {
  con.query(
    `SELECT * FROM admins WHERE login='${req.body.login}' and password='${req.body.password}'`,
    function (err, result) {
      if (err) throw err;

      if (result.length == 0 || result == null) {
        res.redirect("/admin/login");
      } else {
        result = JSON.parse(JSON.stringify(result));

        let hash = hashGeneration(32);

        res.cookie("hash", hash);
        res.cookie("id", result[0]["id"]);

        // update hash
        let sqlRequest = `UPDATE admins SET hash="${hash}" WHERE id=${result[0]["id"]}`;

        con.query(sqlRequest, function (err) {
          if (err) throw err;

          res.redirect("/admin");
        });
      }
    }
  );
};
