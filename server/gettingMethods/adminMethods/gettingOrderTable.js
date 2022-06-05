const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "market",
});

module.exports = function orderTablePage(req, res, renderingPage) {
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
};
