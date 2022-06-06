const express = require("express");
const lastUploadedFiles = require("../gettingMethods/lastUploadedFiles");
const pageOfCategories = require("../gettingMethods/pageOfCategories");
const productInformation = require("../gettingMethods/productInformation");
const gettingCategories = require("../postingMethods/gettingCategories");
const savingCartData = require("../postingMethods/savingCartData");
const showingCart = require("../postingMethods/showingCart");
const router = express.Router();

router.route("/").get((req, res) => {
  lastUploadedFiles(req, res, "main");
});

router.route("/order/agreement").get((req, res) => {
  res.render("agreement");
});

router.route("/order").get((req, res) => {
  res.render("orderPage");
});

router.route("/category").get((req, res) => {
  pageOfCategories(req, res, "category");
});

router.route("/category/goods").get((req, res) => {
  productInformation(req, res, "goods");
});

router.route("/gettingCategories").get((req, res) => {
  gettingCategories(req, res);
});

router.route("/cartGoodsInfo").post((req, res) => {
  showingCart(req, res);
});

router.route("/endOfTheOrder").post((req, res) => {
  savingCartData(req, res);
});

module.exports = router;
