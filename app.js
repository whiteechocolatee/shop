// connecct express
const express = require("express"),
  app = express(),
  cookieParser = require("cookie-parser"),
  responseHelper = require("express-response-helper").helper();

const mysql = require("mysql");

// all functions
const hashValidation = require("./server/hashValidation"),
  adminRoute = require("./server/routes/adminRoutes"),
  mainRoute = require("./server/routes/mainRoutes");

const port = 3000,
  hostname = "127.0.0.1";

// const con = mysql.createConnection({
//   host: hostname,
//   user: "root",
//   password: "root",
//   database: "market",
// });

app
  .use(express.json())
  .use(express.urlencoded())
  .use(responseHelper)
  .use(cookieParser())
  .use(express.static(__dirname + "/src"))
  .use((req, res, next) => {
    if (
      req.originalUrl == "/admin" ||
      req.originalUrl == "/admin/orders" ||
      req.originalUrl == "/admin/goods"
    ) {
      hashValidation(res, req, next);
    } else {
      next();
    }
  })
  .use("/admin", adminRoute)
  .use("/main", mainRoute)
  .set("view engine", "pug")
  .listen(port, hostname, () => {
    console.log(`Server working on http://${hostname}:${port}/main`);
  });

app.get("/", (req, res) => {
  res.redirect("/main");
});
