// const mysql = require("mysql");

// const con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "root",
//   database: "market",
// });

const sendDataMail = require("../sendMailToCustomer");
const savingOrder = require("../savingOrderToDB");
const con = require("../SQLconfig");

module.exports = function savingCartData(req, res) {
  let keys;

  if (req.body.key != null) {
    keys = Object.keys(req.body.key);
  } else {
    keys = {};
  }

  if (keys.length > 0) {
    con.query(
      "SELECT id, name, cost FROM goods WHERE id IN (" + keys.join(",") + ")",
      function (err, result, fields) {
        if (err) throw err;
        savingOrder(req.body, result);
        sendDataMail(req.body, result).catch(console.error);
        res.respond(200);
      }
    );
  } else if (keys.length == undefined || keys.length == 0) {
    res.fail();
  }
};
