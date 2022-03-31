let mysql = require("mysql");

let connection = mysql.createConnection({
  host: "class-4353-db.cvphzsyaunus.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "Ahuhu1234!",
  database: "4353_db",
});

connection.connect(function (err) {
  if (err) {
    return console.error("error: " + err.message);
  }

  console.log("Connected to the MySQL server.");
  connection.query("SELECT * FROM customers", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
  // connection.query("SELECT * FROM fuelQuotes", function (err, result, fields) {
  //   if (err) throw err;
  //   console.log(result);
  // });
});

module.exports = connection;
