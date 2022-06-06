// connecct express
const express = require("express"),
  app = express(),
  cookieParser = require("cookie-parser");

// all functions
const hashValidation = require("./server/hashValidation"),
  adminRoute = require("./server/routes/adminRoutes"),
  mainRoute = require("./server/routes/mainRoutes");

const port = 3000,
  hostname = "127.0.0.1";

app
  .use(express.json())
  .use(express.urlencoded())
  .use(cookieParser())
  .use(express.static(__dirname + "/public"))
  .use((req, res, next) => {
    if (
      req.originalUrl == "/admin" ||
      req.originalUrl == "/admin/orders" ||
      req.originalUrl == "/admin/goods"
    ) {
      hashValidation(res, req, con, next);
    } else {
      next();
    }
  })
  .use("/admin", adminRoute)
  .use("/main", mainRoute)
  .set("view engine", "pug");

// listening port
app.listen(port, hostname, () => {
  console.log(`Server working on http://${hostname}:${port}/main`);
});
