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
    for (let user of data) {
      if (user.email === email) {
        console.log("MATCHING EMAIL");
        user.name = name;
        user.street = street;
        user.city = city;
        user.state = state;
        user.zip = zip;
        await writeFile(this.datafile, "");
        await writeFile(this.datafile, JSON.stringify(data));
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
