const fs = require("fs");
const util = require("util");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

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

  async addEntry(email, password, address, name) {
    const data = (await this.getData()) || [];
    data.unshift({ email, password, address, name });
    return writeFile(this.datafile, JSON.stringify(data));
  }
}

module.exports = userService;
