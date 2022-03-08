const fs = require("fs");
const util = require("util");
const priceModule = require("./priceModule");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

class fuelQuoteService {
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

  async addEntry(user, gallonsRequested, address, deliveryDate) {
    const data = (await this.getData()) || [];
    const state_PLACEHOLDER = "TX";
    const pricing = priceModule.calculate(gallonsRequested);

    let internalPricePerGallon = pricing.internalPricePerGallon;
    let internalCost = pricing.internalCost;
    let profit = pricing.profit;
    let customerPricePerGallon = pricing.customerPricePerGallon;
    let totalPrice = pricing.totalPrice;

    data.unshift({
      user,
      state_PLACEHOLDER,
      gallonsRequested,
      internalPricePerGallon,
      internalCost,
      profit,
      customerPricePerGallon,
      totalPrice,
      deliveryDate,
      address,
    });
    return writeFile(this.datafile, JSON.stringify(data));
  }
}

module.exports = fuelQuoteService;
