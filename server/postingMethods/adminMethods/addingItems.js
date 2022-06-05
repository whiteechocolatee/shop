const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "market",
});

module.exports = function addingItems(req, res) {
  let data = req.body;
  con.query(
    `INSERT INTO goods (name, description, cost, image, category) VALUES ('${data.name}','${data.description}','${data.cost}','${data.image}','${data.category}')`,
    function (err, result) {
      if (err) throw err;
    }
  );
  res.send("1");
};
