const fs = require("fs");
const util = require("util");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const modifyFile = util.promisify(fs.readFile);
class userService {
  constructor(datafile) {
    this.datafile = datafile;
  }
  /**
   * Get all feedback items
   */
  async getList() {
    const data = await this.getData();
    return data;
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
    const data = (await this.getData()) || [];
    //const hold = await this.getList();
    let match = false;
    console.log("INSIDE MODIFYENTRY");
    let myNew = false;
    for (let user of data) {
      if (user.email === email) {
        console.log("MATCHING EMAIL");
        if (user.name === undefined && user.name === null) {
          myNew = true;
        }
        user.name = name;
        user.street = street;
        user.city = city;
        user.state = state;
        user.zip = zip;
        let info = [email, name, street, city, state, zip];
        let info2 = [name, street, city, state, zip, email];
        var sql = "";
        if (myNew) {
          sql =
            "INSERT INTO customers_info (username, name, street, city, state, zip) VALUES (?)";
          db.query(sql, [info], function (err, result) {
            if (err) throw err;
          });
        } else {
          sql =
            "UPDATE cusomters_info SET name = ?, street = ?, city = ?, state = ?, zip = ? WHERE username = ?";
          db.query(sql, [info2], function (err, result) {
            if (err) throw err;
          });
        }
        return;
      }
    }
    data.unshift({ email, name, street, password, city, state, zip });
    await writeFile(this.datafile, JSON.stringify(data));
  }
  // async addEntry(email, name, street, password, city, state, zip) {
  //   const data = (await this.getData()) || [];
  //   data.unshift({ email, name, street, password, city, state, zip });
  //   return writeFile(this.datafile, JSON.stringify(data));
  // }
}
module.exports = userService;
