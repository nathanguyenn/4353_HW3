let mysql = require("mysql");

let connection = mysql.createConnection({
  host: "class-4353-db.cvphzsyaunus.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "Ahuhu1234!",
  database: "4353_db",
});

connection.connect(function (err) {
  if (err) throw err;
});

module.exports = connection;
