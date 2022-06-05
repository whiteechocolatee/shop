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
  .use(express.json())
  .use(express.urlencoded())
  .use(cookieParser())
  .use(express.static(__dirname + "/public"))
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

app
  // rendering form page
  .get("/main/order", function (req, res) {
    res.render("orderPage");
  })
  // rendering agreement for customer
  .get("/main/order/agreement", function (req, res) {
    res.render("agreement");
  })
  // login form for admins
  .get("/login", function (req, res) {
    res.render("loginPage");
  })
  // rendering admin panel
  .get("/admin", function (req, res) {
    res.render("adminPanel");
  })
  // rendering page where admin can create new item
  .get("/admin/goods/createNewItem", function (req, res) {
    res.render("addNewItem");
  })
  // rendering lat uploaded files
  .get("/main", function (req, res) {
    lastUploadedFiles(req, res, "main");
  })
  // rendering categories page
  .get("/main/category", function (req, res) {
    pageOfCategories(req, res, "category");
  })
  // rendering one item page
  .get("/main/category/goods", function (req, res) {
    gettingProductInformation(req, res, "goods");
  })
  // rendering admin order table
  .get("/admin/orders", function (req, res) {
    orderTablePage(req, res, "orderPanel");
  })
  // rendering all categories at navigation panel
  .get("/gettingCategories", function (req, res) {
    gettingCategories(req, res);
  })
  // rendering editing page at admin panel
  .get("/admin/goods/edit", function (req, res) {
    gettingProductInformation(req, res, "editPage");
  })
  // rendering admin goods gallery
  .get("/admin/goods", function (req, res) {
    goodsData(req, res, "adminGoods");
  })
  // sending request to create new item
  .post("/addingNewItem", function (req, res) {
    addingItems(req, res);
  })
  // showing cart at order page
  .post("/cartGoodsInfo", function (req, res) {
    showingCart(req, res);
  })
  // create new user and order at database
  .post("/endOfTheOrder", function (req, res) {
    savingCartData(req, res);
  })
  // uploading hash when new admin log in
  .post("/login", function (req, res) {
    updatingLoginHash(req, res);
  })
  // sending request to updating existing item
  .post("/updateItem", function (req, res) {
    updatingItems(req, res);
  })
  // saving new images at folder
  .post("/addingNewImage", upload.single("image"), function (req, res) {
    res.redirect("/admin/goods");
  })
  // uploading edited image by admin
  .post("/uploadEditedImage", upload.single("editedImage"), function (
    req,
    res
  ) {
    res.redirect("/admin/goods");
  });
