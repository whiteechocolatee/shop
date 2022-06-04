// connecct express
const express = require("express");
const app = express();

//connect cookie parser
const cookieParser = require("cookie-parser");

// connect db
const mysql = require("mysql");

// host
const port = 3000;
const hostname = "127.0.0.1";

// nodemailer
const nodemailer = require("nodemailer");

// multer
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// add hashValidator &
const hashValidation = require("./public/js/hashValidation");
const hashGeneration = require("./public/js/hashGeneration");

// create connection to db
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "market",
});

// reading json
app.use(express.json());

// adding middleware function for parsing requset body
app.use(express.urlencoded());

// adding cookie parser
app.use(cookieParser());

// adding static files to server
app.use(express.static(__dirname + "/public"));

// adding hash validation to admin panel
app.use((req, res, next) => {
  if (req.originalUrl == "/admin" || req.originalUrl == "/admin-orders") {
    hashValidation(res, req, con, next);
  } else {
    next();
  }
});

// adding pug
app.set("view engine", "pug");

// listening port
app.listen(port, hostname, () => {
  console.log(`Server working on http://${hostname}:${port}`);
});

// getting main page
app.get("/", function (req, res) {
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
    res.render("main", {
      goods: JSON.parse(JSON.stringify(value[0])),
      category: JSON.parse(JSON.stringify(value[1])),
    });
  });
});

// get adress of categories with id
app.get("/cat", function (req, res) {
  let categoryId = req.query["id"];
  // get category id,and getting data from db
  let category = new Promise((resolve, reject) => {
    con.query("SELECT * FROM category WHERE id=" + categoryId, function (
      err,
      result
    ) {
      if (err) reject(err);
      resolve(result);
    });
  });
  // get goods from db
  let goods = new Promise((resolve, reject) => {
    con.query("SELECT * FROM goods WHERE category=" + categoryId, function (
      err,
      result
    ) {
      if (err) reject(err);
      resolve(result);
    });
  });

  let types = new Promise((resolve, reject) => {
    con.query(
      "SELECT DISTINCT type FROM goods WHERE category=" + categoryId,
      function (err, result) {
        if (err) reject(err);
        resolve(result);
      }
    );
  });

  Promise.all([category, goods, types]).then((value) => {
    res.render("category", {
      category: value[0],
      goods: value[1],
      types: value[2],
    });
  });
});

//sending items to goods page
app.get("/goods", function (req, res) {
  let goodsId = req.query.id;

  console.log(goodsId);

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
    console.log(value);
    res.render("goods", {
      goods: value[0],
      images: value[1],
      colors: value[2],
    });
  });
  
  // res.end();

  // res.render("goods", {
  // goods: result,
  // images: imgResult,
  // colors: colorsResult,
  // });
});

// render order page
app.get("/order", function (req, res) {
  res.render("orderPage");
});

// admin panel
app.get("/admin", function (req, res) {
  res.render("admin", {});
});

// adminPanel orders
app.get("/admin-orders", function (req, res) {
  con.query(
    `SELECT 
      shop_order.id as id,
      shop_order.user_id as user_id,
      shop_order.goods_id as goods_id,
      shop_order.goods_cost as goods_cost,
      shop_order.goods_amount as goods_amount,
      shop_order.total as total,
      from_unixtime(date, '%D %M %Y %H:%i:%s') as unix_timestapm,
      user_info.user_name as user,
      user_info.user_phone as phone,
      user_info.adress as adress
    FROM 
      shop_order
    LEFT JOIN	
      user_info
    ON shop_order.user_id = user_info.id ORDER BY id DESC`,
    function (err, result, fileds) {
      if (err) throw err;
      res.render("orderPanel", { orders: JSON.parse(JSON.stringify(result)) });
    }
  );
});

// rendering admin goods
app.get("/admin-goods", function (req, res) {
  con.query("SELECT * FROM goods", function (err, result, fileds) {
    if (err) throw err;
    res.render("adminGoods", { goods: JSON.parse(JSON.stringify(result)) });
  });
});

// create login to admin panel
app.get("/login", function (req, res) {
  res.render("loginPage", {});
});

// agreement url for terms and coditions
app.get("/agreement", function (req, res) {
  res.render("agreement", {});
});

// func for clearing order table
app.get("/clear-table", function (req, res) {
  let sqlTruncateOrders = "TRUNCATE TABLE shop_order";
  let sqlTruncateUsers = "TRUNCATE TABLE user_info";

  con.query(sqlTruncateOrders, function (err, result) {
    if (err) throw err;
    con.query(sqlTruncateUsers, function (err, result) {
      if (err) throw err;
    });
    res.redirect("/admin-orders");
  });
});

//adding new item
app.get("/add-new-item", function (req, res) {
  res.render("addNewItem");
});

//edit card page
app.get("/edit", function (req, res) {
  con.query("SELECT * FROM goods WHERE id=" + req.query.id, function (
    err,
    result,
    fields
  ) {
    if (err) throw err;
    result = JSON.parse(JSON.stringify(result));

    con.query(
      "SELECT * FROM goods_images WHERE goods_id=" + req.query.id,
      function (err, imagesResult, fields) {
        if (err) throw err;
        imagesResult = JSON.parse(JSON.stringify(imagesResult));

        con.query(
          "SELECT * FROM goods_colors WHERE goods_id=" + req.query.id,
          function (err, colorsResult, fields) {
            colorsResult = JSON.parse(JSON.stringify(colorsResult));
            res.render("editPage", {
              goods: result,
              images: imagesResult,
              colors: colorsResult,
            });
          }
        );
      }
    );
  });
});

// saving image to folder
app.post("/add-new-photo", upload.single("image"), function (req, res) {
  res.redirect("/admin-goods");
});

// saving edited image to folder
app.post("/upload-edited-image", upload.single("editedImage"), function (
  req,
  res
) {
  res.redirect("/admin-goods");
});

// update data goods
app.post("/update-item", function (req, res) {
  let data = req.body;
  console.log(data.imgArr);
  let sqlRequest;

  if (data.image === undefined) {
    sqlRequest = `
    UPDATE goods 
    SET name = '${data.name}',
        description = '${data.description}',
        cost = '${data.cost}',
        category = '${data.category}',
        type = '${data.type}'
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
        type = '${data.type}'
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
});

// saving new goods to data base
app.post("/add-new-item", function (req, res) {
  let data = req.body;

  con.query(
    `INSERT INTO goods (name, description, cost, image, category) VALUES ('${data.name}','${data.description}','${data.cost}','${data.image}','${data.category}')`,
    function (err, result) {
      if (err) throw err;
    }
  );
  res.send("1");
});

// posting login data
app.post("/login", function (req, res) {
  con.query(
    `SELECT * FROM admins WHERE login='${req.body.login}' and password='${req.body.password}'`,
    function (err, result) {
      if (err) throw err;

      if (result.length == 0 || result == null) {
        res.redirect("/login");
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
});

// adding goods to cart at nav
app.post("/get-category-list", function (req, res) {
  con.query("SELECT id,category FROM category", function (err, result, fileds) {
    if (err) throw err;
    res.json(result);
  });
});

// get items in cart
app.post("/get-goods-info", function (req, res) {
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
});

// sending request to db, get items in cart
app.post("/finish-order", function (req, res) {
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
        res.send("1");
      }
    );
  } else if (keys.length == undefined || keys.length == 0) {
    res.send("0");
  }
});

// saving order to data base
function savingOrder(data, res) {
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
      con.query(sqlRequest, function (error, result) {
        if (error) throw error;
      });
    }
  });
}

// connect nodemailer function to send mails to clients
async function sendDataMail(data, result) {
  let letter = "<h2>Ваш заказ в магазине ....</h2>";
  let totalPrice = 0;

  for (let i = 0; i < result.length; i++) {
    letter += `<p>${result[i]["name"]} - ${data.key[result[i]["id"]]} - ${
      result[i]["cost"] * data.key[result[i]["id"]]
    } uah </p>`;
    totalPrice += result[i]["cost"] * data.key[result[i]["id"]];
  }

  // making a letter
  letter += "<hr>";
  letter += `Сумма заказа: ${totalPrice}`;
  letter += "<hr>";
  letter += `<hr>
                Имя - ${data.userName} </br>
                Номер телефона - ${data.phoneNumber}`;
  letter += ` <hr>
                Данные для отправки - ${data.adress}</br>
              <hr>  
                `;

  // create test account
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  let mailOption = {
    from: "<creatuseandr@icloud.com>",
    to: data.email,
    subject: "shop order",
    text: letter,
    html: letter,
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOption);

  console.log("MessageSent: %s", info.messageId);

  // getting URL for watching message
  console.log("PreviewSent: %s", nodemailer.getTestMessageUrl(info));

  return true;
}
