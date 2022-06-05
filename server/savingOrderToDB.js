// connect db
const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "market",
});

// saving order to data base
module.exports = function savingOrder(data, res) {
  let sqlRequest;

  sqlRequest = `INSERT INTO user_info (user_name, user_email, user_phone, adress) VALUES ('${data.userName}','${data.email}','${data.phoneNumber}','${data.adress}')`;

  con.query(sqlRequest, function (error, result) {
    if (error) throw error;

    let userId = result.insertId;

    let date = Math.trunc(new Date() / 1000);

    for (let i = 0; i < res.length; i++) {
      sqlRequest = `INSERT INTO shop_order (date,user_id, goods_id,goods_cost, goods_amount, total) VALUES (${date},${userId},${
        res[i]["id"]
      },${res[i]["cost"]},${data.key[res[i]["id"]]},${
        data.key[res[i]["id"]] * res[i]["cost"]
      })`;
    }
    con.query(sqlRequest, function (error, result) {
      if (error) throw error;
    });
  });
};
