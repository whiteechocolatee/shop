// connecct express
const express = require("express"),
  app = express(),
  cookieParser = require("cookie-parser");

const mysql = require("mysql");

const multer = require("multer");

// all functions
const hashValidation = require("./server/hashValidation"),
  gettingProductInformation = require("./server/gettingMethods/productInformation"),
  lastUploadedFiles = require("./server/gettingMethods/lastUploadedFiles"),
  pageOfCategories = require("./server/gettingMethods/pageOfCategories"),
  orderTablePage = require("./server/gettingMethods/adminMethods/gettingOrderTable"),
  goodsData = require("./server/gettingMethods/adminMethods/goodsData"),
  updatingItems = require("./server/postingMethods/adminMethods/updatingItems"),
  addingItems = require("./server/postingMethods/adminMethods/addingItems"),
  updatingLoginHash = require("./server/postingMethods/adminMethods/updatingLoginHash"),
  gettingCategories = require("./server/postingMethods/gettingCategories"),
  showingCart = require("./server/postingMethods/showingCart"),
  savingCartData = require("./server/postingMethods/savingCartData");

const port = 3000,
  hostname = "127.0.0.1";

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "market",
  }),
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

const upload = multer({ storage: storage });

app
  // reading json
  .use(express.json())
  // adding middleware function for parsing requset body
  .use(express.urlencoded())
  // adding cookie parser
  .use(cookieParser())
  // static files at server
  .use(express.static(__dirname + "/public"))
  // adding hash validation to admin panel
  .use((req, res, next) => {
    if (req.originalUrl == "/admin" || req.originalUrl == "/admin-orders") {
      hashValidation(res, req, con, next);
    } else {
      next();
    }
  })
  .set("view engine", "pug");

// listening port
app.listen(port, hostname, () => {
  console.log(`Server working on http://${hostname}:${port}/main`);
});

//
// rendering pages with static files
//

// render order page
app.get("/main/order", function (req, res) {
  res.render("orderPage");
});
// admin panel
app.get("/admin", function (req, res) {
  res.render("adminPanel", {});
});
// create login to admin panel
app.get("/login", function (req, res) {
  res.render("loginPage", {});
});
// agreement url for terms and coditions
app.get("/main/order/agreement", function (req, res) {
  res.render("agreement", {});
});
//adding new item
app.get("/admin/goods/createNewItem", function (req, res) {
  res.render("addNewItem");
});

//
// sending data , and rendering pages with data
//

// getting main page
app.get("/main", function (req, res) {
  lastUploadedFiles(req, res, "main");
});
// get adress of categories with id
app.get("/main/category", function (req, res) {
  pageOfCategories(req, res, "category");
});
//sending items to goods page
app.get("/main/category/goods", function (req, res) {
  gettingProductInformation(req, res, "goods");
});
// adminPanel orders
app.get("/admin/orders", function (req, res) {
  orderTablePage(req, res, "orderPanel");
});
// rendering admin goods
app.get("/admin/goods", function (req, res) {
  goodsData(req, res, "adminGoods");
});
//edit card page
app.get("/admin/goods/edit", function (req, res) {
  gettingProductInformation(req, res, "editPage");
});
// update data goods
app.post("/updateItem", function (req, res) {
  updatingItems(req, res);
});
// saving new goods to data base
app.post("/addingNewItem", function (req, res) {
  addingItems(req, res);
});
// posting login data
app.post("/login", function (req, res) {
  updatingLoginHash(req, res);
});
// getting categories to navigation
app.get("/gettingCategories", function (req, res) {
  gettingCategories(req, res);
});
// showing items in cart
app.post("/cartGoodsInfo", function (req, res) {
  showingCart(req, res);
});
// posting data at database
app.post("/endOfTheOrder", function (req, res) {
  savingCartData(req, res);
});

//
// saving img by multer and redirecting to goods page at admin panel
//

// saving image to folder
app.post("/addingNewImage", upload.single("image"), function (req, res) {
  res.redirect("/admin/goods");
});

// saving edited image to folder
app.post("/uploadEditedImage", upload.single("editedImage"), function (
  req,
  res
) {
  res.redirect("/admin/goods");
});
