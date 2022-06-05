const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "market",
});

module.exports = function lastUploadedFiles(req, res, renderingPage) {
  // taking 3 goods from every category and rendering main page
  let goodsName = new Promise(function (resolve, reject) {
    con.query(
      "SELECT id,name,description,cost,image,category FROM (SELECT id,name,description,cost,image,category, IF(IF(@curr_category != category,@curr_category := category,'')!= '',@k := 0, @k := @k+1) as ind FROM goods, (SELECT @curr_category := '') v ) goods WHERE ind < 4",
      function (err, result) {
        if (err) reject(err);
        resolve(result);
      }
    );
  });

  // taking all categories for rendering main page
  let goodsDescription = new Promise(function (resolve, reject) {
    con.query("SELECT * FROM category", function (err, result) {
      if (err) reject(err);
      resolve(result);
    });
  });

  // load all promises to main page
  Promise.all([goodsName, goodsDescription]).then(function (value) {
    res.render(renderingPage, {
      goods: JSON.parse(JSON.stringify(value[0])),
      category: JSON.parse(JSON.stringify(value[1])),
    });
  });
};
