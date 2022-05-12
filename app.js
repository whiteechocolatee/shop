// connecct express
const express = require("express");
const app = express();

// connect db
const mysql = require("mysql");

// host
const port = 3000;
const hostname = "127.0.0.1";

// nodemailer
const nodemailer = require("nodemailer");

// create connection to db
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "market",
});

// reading json
app.use(express.json());

// adding static files to server
app.use(express.static(__dirname + "/public"));

// adding pug
app.set("view engine", "pug");

// listening port
app.listen(port, hostname, () => {
  console.log(`Server working on http://${hostname}:${port}`);
});

// getting main page
app.get("/", function (req, res) {
  // taking all goods for rendering main page
  let goodsName = new Promise(function (resolve, reject) {
    con.query(
      "SELECT id,name,cost,image,category FROM (SELECT id,name,cost,image,category, IF(IF(@curr_category != category,@curr_category := category,'')!= '',@k := 0, @k := @k+1) as ind FROM goods, (SELECT @curr_category := '') v ) goods WHERE ind < 4",
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
  //
  Promise.all([category, goods]).then((value) => {
    res.render("category", { category: value[0], goods: value[1] });
  });
});

//sending items to goods page
app.get("/goods", function (req, res) {
  con.query("SELECT * FROM goods WHERE id=" + req.query.id, function (
    err,
    result,
    fields
  ) {
    if (err) throw err;
    res.render("goods", { goods: JSON.parse(JSON.stringify(result)) });
  });
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
      console.log(result);
      if (err) throw err;
      res.render("orderPanel", { orders: JSON.parse(JSON.stringify(result)) });
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
  if (req.body.key.length != 0) {
    con.query(
      "SELECT id, name, cost FROM goods WHERE id IN (" +
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
        console.log("saved");
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
