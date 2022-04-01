const e = require("express");
const fs = require("fs");
const util = require("util");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const modifyFile = util.promisify(fs.readFile);

const db = require("./database");
db.query = util.promisify(db.query);

class userService {
  constructor(datafile) {
    this.datafile = datafile;
  }
  /**
   * Get all feedback items
   */
  async getList() {
    db.query("SELECT * FROM customers", function (err, result) {
      if (err) throw err;

      return result;
    });
  }
  /**
   * Fetches feedback data from the JSON file provided to the constructor
   */
  async getData() {
    const data = await readFile(this.datafile, "utf8");
    if (!data) return [];
    return JSON.parse(data);
  }

  async modifyEntry(email, name, street, password, city, state, zip) {
    //const hold = await this.getList();

    var sql = "";
    let info2 = [name, street, city, state, zip, email];
    let login_email = "";
    db.query(
      "SELECT * FROM customers WHERE email = ?",
      email,
      function (err, result) {
        if (err) throw err;
        if (result) {
          login_email = email;
          let info = [email, name, street, city, state, zip];
          sql =
            "INSERT INTO customer_info (username, name, street, city, state, zip) VALUES (?) ON DUPLICATE KEY UPDATE username = VALUES(username), name = VALUES(name), street = VALUES(street), city = VALUES(city), state = VALUES(state), zip = VALUES(zip)";
          db.query(sql, [info], function (err, result, fields) {
            if (err) throw err;
            console.log(result);
          });
        }
      }
    );
  }
}
module.exports = userService;
