const con = require("./SQLconfig");

module.exports = function (res, req, next) {
  if (req.cookies.id === undefined || req.cookies.hash === undefined) {
    res.redirect("/admin/login");
    return;
  }
  con.query(
    `SELECT * FROM admins WHERE id=${req.cookies.id} and hash='${req.cookies.hash}'`,
    function (err, result) {
      if (err) throw err;
      if (result.length === 0) {
        res.redirect("/login");
      } else {
        next();
      }
    }
  );
};
