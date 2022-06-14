// const mysql = require("mysql");

const con = require("../../SQLconfig");

// const con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "root",
//   database: "market",
// });


module.exports = function updatingItems(req, res) {
  let data = req.body;
  let sqlRequest;

  if (data.image === undefined) {
    sqlRequest = `
      UPDATE goods 
      SET name = '${data.name}',
          description = '${data.description}',
          cost = '${data.cost}',
          category = '${data.category}',
          type = '${data.type}',
          data_type = '${data.data_type}'
      WHERE id = ${data.id}
      `;
  } else {
    sqlRequest = `
      UPDATE goods 
      SET name = '${data.name}',
          description = '${data.description}',
          cost = '${data.cost}',
          image = '${data.image}',
          category = '${data.category}',
          type = '${data.type}',
          data_type = '${data.data_type}'
      WHERE id = ${data.id}
      `;
  }

  con.query(sqlRequest, function (err) {
    if (err) throw err;

    if (data.imgArr.length > 0) {
      let insertIntoSqlImages = `INSERT INTO goods_images (goods_id,path) VALUES ?`;
      con.query(insertIntoSqlImages, [data.imgArr], function (err) {
        if (err) throw err;
      });
    }

    if (data.colors.length > 0) {
      let insertIntoSqlImages = `INSERT INTO goods_colors (goods_id,color) VALUES ?`;
      con.query(insertIntoSqlImages, [data.colors], function (err) {
        if (err) throw err;
      });
    }

    if (data.delAddImg != []) {
      data.delAddImg.forEach((elem) => {
        console.log(elem);
        con.query(`DELETE FROM goods_images WHERE id=${elem}`, function (err) {
          if (err) throw err;
        });
      });
    }

    res.send("1");
  });
};
