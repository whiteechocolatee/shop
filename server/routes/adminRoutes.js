const express = require("express");
const multer = require("multer");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const gettingOrderTable = require("../gettingMethods/adminMethods/gettingOrderTable");
const goodsData = require("../gettingMethods/adminMethods/goodsData");
const productInformation = require("../gettingMethods/productInformation");
const addingItems = require("../postingMethods/adminMethods/addingItems");
const updatingItems = require("../postingMethods/adminMethods/updatingItems");
const updatingLoginHash = require("../postingMethods/adminMethods/updatingLoginHash");

router.route("/").get((req, res) => {
  res.render("adminPanel");
});

router.route("/orders").get((req, res) => {
  gettingOrderTable(req, res, "orderPanel");
});

router.route("/goods/createNewItem").get((req, res) => {
  res.render("addNewItem");
});

router.route("/goods/edit").get((req, res) => {
  productInformation(req, res, "editPage");
});

router.route("/goods").get((req, res) => {
  goodsData(req, res, "adminGoods");
});

router.route("/goods/updateItem").post((req, res) => {
  updatingItems(req, res);
});

router
  .route("/goods/addingNewImage")
  .post(upload.single("image"), (req, res) => {
    res.redirect("/admin/goods");
  });

router
  .route("/goods/uploadEditedImage")
  .post(upload.single("editedImage"), (req, res) => {
    res.redirect("/admin/goods");
  });

router.route("/goods/addingNewItem").post((req, res) => {
  addingItems(req, res);
});

router
  .route("/login")
  .get((req, res) => {
    res.render("loginPage");
  })
  .post((req, res) => {
    updatingLoginHash(req, res);
  });

module.exports = router;
