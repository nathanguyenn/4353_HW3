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

  async modifyEntry(email, name, address, password) {
    const data = (await this.getData()) || [];
    //const hold = await this.getList();
    let match = false;
    for (let user of data) {
      if (user.email === email) {
        console.log("MATCHING EMAIL");
        user.name = name;
        user.address = address;
        match = true;
      }
    }
    if (match) {
      writeFile(this.datafile, "");
      writeFile(this.datafile, JSON.stringify(data));
    } else {
      data.unshift({ email, password, address, name });
      writeFile(this.datafile, JSON.stringify(data));
    }
  }
  // async addEntry(email, password, address, name) {
  //   const data = (await this.getData()) || [];
  //   data.unshift({ email, password, address, name });
  //   return writeFile(this.datafile, JSON.stringify(data));
  // }
}

module.exports = userService;
