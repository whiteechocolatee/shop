// const mysql = require("mysql");

const con = require("../SQLconfig");

// const con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "root",
//   database: "market",
// });

module.exports = function gettingProductInformation(req, res, renderingPage) {
  let goodsId = req.query.id;

  let goodsData = new Promise((resolve, reject) => {
    con.query("SELECT * FROM goods WHERE id=" + goodsId, function (
      err,
      result,
      fields
    ) {
      if (err) reject(err);
      resolve(result);
    });
  });

  let goodsImages = new Promise((resolve, reject) => {
    con.query("SELECT * FROM goods_images WHERE goods_id=" + goodsId, function (
      err,
      imgResult,
      fields
    ) {
      if (err) reject(err);
      resolve(imgResult);
    });
  });

  let goodsColors = new Promise((resolve, reject) => {
    con.query("SELECT * FROM goods_colors WHERE goods_id=" + goodsId, function (
      err,
      colorsResult,
      fields
    ) {
      if (err) reject(err);
      resolve(colorsResult);
    });
  });

  Promise.all([goodsData, goodsImages, goodsColors]).then((value) => {
    res.render(renderingPage, {
      goods: value[0],
      images: value[1],
      colors: value[2],
    });
  });
};
